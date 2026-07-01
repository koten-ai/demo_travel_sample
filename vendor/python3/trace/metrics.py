"""Chat metrics and tool-order helpers."""
import json

from python3.constants import normalize_api_version
from python3.storage.chat_store import CHATS
from python3.constants import v2_tool_order
from python3.trace.pipeline import _pipeline_step_costs

def tool_names_from_step(step):
    """Tool / verb names invoked by one trace step (pipeline → inner verbs)."""
    if step.get("type") != "tool":
        return []
    name = step.get("name")
    if name == "pipeline":
        names = []
        args = step.get("args") or {}
        steps_plan = args.get("steps") or []
        if not steps_plan and step.get("pipeline_json"):
            steps_plan = step.get("pipeline_json", {}).get("steps") or []
        by_name = {
            s.get("name"): s for s in steps_plan
            if isinstance(s, dict) and s.get("name")
        }
        for sc in _pipeline_step_costs(step) or []:
            key = sc.get("as") or sc.get("name")
            verb = (by_name.get(key) or {}).get("verb") or key
            if verb:
                names.append(verb)
        if not names:
            for s in steps_plan:
                if isinstance(s, dict) and s.get("verb"):
                    names.append(s["verb"])
        return names
    return [name] if name else []


def build_v1_tool_order_from_chats():
    """V1 x-axis: first-seen tool names from persisted chats.jsonl."""
    order, seen = [], set()

    def add(nm):
        if nm and nm not in seen:
            seen.add(nm)
            order.append(nm)

    for _cid, chat in sorted(CHATS.items(), key=lambda kv: kv[1].get("created", 0)):
        for tr in chat.get("traces", []):
            if normalize_api_version(tr.get("api_version")) != "v1":
                continue
            for step in (tr.get("trace") or {}).get("steps", []):
                for nm in tool_names_from_step(step):
                    add(nm)
        if normalize_api_version(
                (chat.get("traces") or [{}])[-1].get("api_version") if chat.get("traces") else "v2") != "v1":
            continue
        for turn in chat.get("turns", []):
            if turn.get("role") != "assistant":
                continue
            for tc in turn.get("tool_calls") or []:
                add((tc.get("function") or {}).get("name"))
    return order


def build_tool_order():
    return {"v1": build_v1_tool_order_from_chats(), "v2": v2_tool_order()}


def _pipeline_step_costs(step):
    """Return Zeus per-step costs for a pipeline tool step, if present."""
    costs = step.get("pipeline_step_costs")
    if costs:
        return costs
    for key in ("result_full", "result"):
        raw = step.get(key)
        if not raw:
            continue
        try:
            data = json.loads(raw)
        except (TypeError, ValueError):
            continue
        costs = (data.get("meta") or {}).get("step_costs")
        if costs:
            return costs
        if step.get("name") == "pipeline" and data.get("status") not in (None, "ok"):
            return [{"status": data.get("status")}]
    plan = (step.get("args") or {}).get("steps") or []
    return [{"as": s.get("name"), "status": "planned"} for s in plan if isinstance(s, dict)]


def summarize_chat_metrics(chat):
    """Aggregate wall-clock and AI / Zeus / Other splits across stored traces."""
    traces = chat.get("traces") or []
    total_ms = ai_ms = zeus_ms = rounds = 0
    ai_error = tool_error = False
    pipeline_steps = 0
    for tr in traces:
        trace = tr.get("trace") or {}
        total_ms += int(trace.get("total_ms") or 0)
        rounds += int(trace.get("rounds") or 0)
        for step in trace.get("steps") or []:
            ms = int(step.get("ms") or 0)
            st = step.get("type")
            if st == "llm_error":
                ai_error = True
                ai_ms += ms
            elif st == "llm":
                ai_ms += ms
            elif st == "tool":
                zeus_ms += ms
                status = step.get("status")
                try:
                    status_n = int(status) if status is not None else 200
                except (TypeError, ValueError):
                    status_n = 0 if status else 200
                if status_n == 0 or status_n >= 400:
                    tool_error = True
                if step.get("name") == "pipeline":
                    costs = _pipeline_step_costs(step)
                    pipeline_steps += len(costs)
                    for sc in costs:
                        st_status = (sc.get("status") or "").lower()
                        if st_status and st_status not in ("ok", "planned"):
                            tool_error = True
                    try:
                        raw = step.get("result_full") or step.get("result") or ""
                        data = json.loads(raw) if raw else {}
                        top_status = (data.get("status") or "").lower()
                        if top_status and top_status != "ok":
                            tool_error = True
                    except (TypeError, ValueError):
                        pass
    other_ms = max(0, total_ms - ai_ms - zeus_ms)
    sum_ms = total_ms or 1
    preview = chat.get("title") or ""
    provider = model = model_label = ""
    models_seen = []
    if traces:
        preview = traces[-1].get("question") or traces[0].get("question") or preview
        for tr in traces:
            prov = (tr.get("provider") or "").strip()
            mod = (tr.get("model") or "").strip()
            if not mod:
                continue
            label = f"{prov}/{mod}" if prov else mod
            if label not in models_seen:
                models_seen.append(label)
        if models_seen:
            model_label = models_seen[-1]
            if len(models_seen) > 1:
                model_label += f" (+{len(models_seen) - 1})"
            last = traces[-1]
            provider = (last.get("provider") or "").strip()
            model = (last.get("model") or "").strip()
    return {
        "preview": preview,
        "total_ms": total_ms,
        "ai_ms": ai_ms,
        "zeus_ms": zeus_ms,
        "other_ms": other_ms,
        "rounds": rounds,
        "ai_pct": round(ai_ms / sum_ms * 100),
        "tool_pct": round(zeus_ms / sum_ms * 100),
        "other_pct": round(other_ms / sum_ms * 100),
        "ai_error": ai_error,
        "tool_error": tool_error,
        "has_pipeline": pipeline_steps > 0,
        "pipeline_steps": pipeline_steps,
        "provider": provider,
        "model": model,
        "model_label": model_label,
    }
