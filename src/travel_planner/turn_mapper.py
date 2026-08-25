"""Map ZeusRuntime TurnResult → TravelPlan /api/search JSON fields."""

from __future__ import annotations

import json
from dataclasses import asdict, is_dataclass
from typing import Any, Mapping

from zeus_client import SessionHandle, TurnResult, user_facing_answer

from travel_planner.output_schema import DEMO_OUTPUT_SCHEMA
from travel_planner.results_parser import (
    extract_destinations,
    infer_entity_type,
    is_product_row,
    prefer_hotel_rows,
    zeus_data_to_results,
)

# API_LAYER_A G2 — never product chat / cards (conformance g2_not_in_ui).
_G2_UI_FORBIDDEN = frozenset(
    {
        "wish_i_knew",
        "jail_break_attempt",
        "subject_confidence",
        "data_gaps",
        "business_rules_triggers",
        "app_output",
        "hooks_jailbreak_score",
        "detective",
    }
)


def session_handle_from_chat(chat: Mapping[str, Any]) -> SessionHandle | None:
    sid = (chat.get("zeus_session_id") or "").strip()
    if not sid:
        return None
    try:
        rnd = int(chat.get("zeus_round", 0) or 0)
    except (TypeError, ValueError):
        rnd = 0
    return SessionHandle(
        session_id=sid,
        round=rnd,
        chat_id=str(chat.get("chat_id") or ""),
        contract_status=str(chat.get("contract_status") or "none"),
    )


def prior_messages_from_turns(turns: list | None) -> tuple[dict[str, Any], ...]:
    """Map stored chat turns to OpenAI-style message dicts when possible."""
    if not turns:
        return ()
    out: list[dict[str, Any]] = []
    for t in turns:
        if not isinstance(t, Mapping):
            continue
        role = t.get("role")
        content = t.get("content")
        if isinstance(role, str) and content is not None:
            out.append(
                {
                    "role": role,
                    "content": content if isinstance(content, str) else str(content),
                }
            )
    return tuple(out)


def apply_session_to_chat(chat: dict[str, Any], result: TurnResult) -> None:
    """Persist durable session handle from TurnResult (never invent ids)."""
    if result.session is None:
        notes = list(getattr(result.debug, "notes", ()) or ())
        rehydrate_failed = any(
            isinstance(n, str) and "rehydrate" in n and "failed" in n for n in notes
        )
        if rehydrate_failed:
            chat.pop("zeus_session_id", None)
            chat["zeus_round"] = 0
            chat["contract_status"] = "none"
        return
    sess = result.session
    if getattr(sess, "session_id", None):
        chat["zeus_session_id"] = sess.session_id
        chat["zeus_round"] = int(getattr(sess, "round", 0) or 0)
        chat["contract_status"] = getattr(sess, "contract_status", None) or "none"


def trace_payload(result: TurnResult) -> dict[str, Any]:
    """Widget-facing trace from public_trace + detective (G2 stays out of answer)."""
    debug = result.debug
    trace: dict[str, Any] = dict(debug.public_trace or {})
    if debug.notes:
        existing = list(trace.get("notes") or [])
        for n in debug.notes:
            if n not in existing:
                existing.append(n)
        trace["notes"] = existing
    if debug.detective is not None:
        trace["detective"] = dict(debug.detective)
    if debug.preferred_req_id:
        sess = dict(trace.get("session") or {})
        if not isinstance(sess, dict):
            sess = {}
        sess["preferred_req_id"] = debug.preferred_req_id
        trace["session"] = sess
    if debug.hops and not trace.get("hops"):
        trace["hops"] = [dict(h) for h in debug.hops]
    return trace


def _as_public_dict(obj: Any) -> dict[str, Any]:
    if obj is None:
        return {}
    if is_dataclass(obj) and not isinstance(obj, type):
        return asdict(obj)
    if isinstance(obj, Mapping):
        return dict(obj)
    return {}


def structured_response_payload(
    result: TurnResult,
    *,
    zeus_data: list | None = None,
    answer: str | None = None,
) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "status": result.status.value if hasattr(result.status, "value") else str(result.status),
        "answer": answer if answer is not None else (result.answer or ""),
        "zeus_data": list(zeus_data or []),
        "warnings": [],
    }
    if result.structured is not None:
        payload["structured"] = _as_public_dict(result.structured)
    if result.layer_a is not None:
        payload["layer_a"] = _as_public_dict(result.layer_a)
    if result.policy is not None:
        payload["policy"] = _as_public_dict(result.policy)
    if result.error is not None:
        payload["error"] = _as_public_dict(result.error)
    return payload


def _rows_from_trace(trace: Mapping[str, Any]) -> list[dict[str, Any]]:
    """Best-effort entity rows from public_trace hops/steps/tool_calls."""
    rows: list[dict[str, Any]] = []

    def _as_mapping(payload: Any) -> Mapping[str, Any] | None:
        if isinstance(payload, Mapping):
            return payload
        if isinstance(payload, str):
            text = payload.strip()
            if text[:1] in "{[":
                try:
                    parsed = json.loads(text)
                except (TypeError, ValueError, json.JSONDecodeError):
                    return None
                if isinstance(parsed, Mapping):
                    return parsed
        return None

    def _consume_payload(payload: Any) -> None:
        mapping = _as_mapping(payload)
        if mapping is None:
            return
        for key in ("rows", "items", "results", "entities"):
            val = mapping.get(key)
            if isinstance(val, list):
                for item in val:
                    if isinstance(item, dict) and is_product_row(item):
                        rows.append(item)
            nested_map = _as_mapping(val)
            if nested_map is not None:
                nested = nested_map.get("rows") or nested_map.get("items")
                if isinstance(nested, list):
                    for item in nested:
                        if isinstance(item, dict) and is_product_row(item):
                            rows.append(item)
        data = mapping.get("data")
        if isinstance(data, Mapping):
            for key, v in data.items():
                if key in {"job_fingerprint", "meta", "status"}:
                    continue
                if isinstance(v, list):
                    for item in v:
                        if isinstance(item, dict) and is_product_row(item):
                            rows.append(item)
                elif isinstance(v, Mapping):
                    nested = v.get("rows") or v.get("items")
                    if isinstance(nested, list):
                        for item in nested:
                            if isinstance(item, dict) and is_product_row(item):
                                rows.append(item)
                    else:
                        _consume_payload(v)
        nested_result = mapping.get("result")
        if isinstance(nested_result, Mapping):
            _consume_payload(nested_result)

    for section in ("hops", "steps", "tool_calls"):
        items = trace.get(section)
        if not isinstance(items, list):
            continue
        for hop in items:
            if not isinstance(hop, Mapping):
                continue
            for key in ("result_json", "body", "response", "result", "snippet"):
                if key in hop:
                    _consume_payload(hop.get(key))
    return rows


def filter_row_by_schema(row: Mapping[str, Any]) -> dict[str, Any]:
    """App-owned allowlist (DEMO_OUTPUT_SCHEMA) — not a client run_turn kwarg."""
    entity = infer_entity_type(row)
    allowed = (
        DEMO_OUTPUT_SCHEMA.get(entity)
        or DEMO_OUTPUT_SCHEMA.get(entity.capitalize())
        or DEMO_OUTPUT_SCHEMA.get("Destination")
        or DEMO_OUTPUT_SCHEMA.get("Hotel")
        or ()
    )
    if not allowed:
        out = {k: v for k, v in row.items() if k not in _G2_UI_FORBIDDEN}
        out["entity_type"] = entity
        return out
    allow = set(allowed)
    out = {
        k: v
        for k, v in row.items()
        if k not in _G2_UI_FORBIDDEN
        and (k in allow or k in {"entity_type", "type", "id", "doc_key"})
    }
    out["entity_type"] = entity
    return out


def results_waterfall(
    result: TurnResult,
    trace: Mapping[str, Any],
    answer: str,
) -> list[dict[str, str]]:
    from travel_planner.answer_parser import parse_markdown_answer, structured_answer_to_results

    raw_rows = [r for r in _rows_from_trace(trace) if is_product_row(r)]
    if raw_rows:
        filtered = [filter_row_by_schema(r) for r in prefer_hotel_rows(raw_rows)]
        cards = zeus_data_to_results(filtered)
        if cards:
            return cards
    cards = extract_destinations(dict(trace) if isinstance(trace, Mapping) else {})
    if cards:
        return cards
    structured_answer = parse_markdown_answer(answer)
    if structured_answer:
        return structured_answer_to_results(structured_answer)
    return []


def raw_rows_for_structured(trace: Mapping[str, Any]) -> list[dict[str, Any]]:
    return [filter_row_by_schema(r) for r in _rows_from_trace(trace)]


def user_answer(result: TurnResult) -> str:
    """User-facing prose only — peel Layer A / G2 via package helper."""
    layer = result.layer_a
    layer_summary = None
    ui_text = None
    if layer is not None:
        layer_d = _as_public_dict(layer)
        layer_summary = layer_d.get("summary") if isinstance(layer_d.get("summary"), str) else None
    if result.structured is not None:
        st = _as_public_dict(result.structured)
        ui = st.get("ui") if isinstance(st.get("ui"), Mapping) else {}
        if isinstance(ui, Mapping):
            ui_text = ui.get("text") or ui.get("message")
        if not layer_summary and isinstance(st.get("layer_a"), Mapping):
            layer_summary = st["layer_a"].get("summary")
    return user_facing_answer(
        result.answer or "",
        ui_text=ui_text if isinstance(ui_text, str) else None,
        layer_summary=layer_summary if isinstance(layer_summary, str) else None,
    )
