# Guide: Observe middleware

**Date**: 2026-11-03
**Feature**: DEBUG logs for the six 2.5 agent-loop moments, without changing the turn.
**Status**: Active
**Related Plan**: `.grok/plans/OBSERVE_MIDDLEWARE.md`

## 1. Overview
- **Purpose**: Record that a search turn passed each agent-loop hook, for local debugging. It does not score, refuse, rewrite args, or change the answer.
- **Scope**: Observe-only logging on the TravelPlan runtime. SecurityHooks stays first. Full payloads, V1 AgentHooks, jailbreak scoring, and extra events (`round_end`, `contract_status`, `policy_decision`) are excluded.
- **Entry points**: `build_runtime()` installs the chain. Every later `rt.agent.run_turn` (including `search.py`) uses it. No new HTTP route.

## 2. Architecture & Flow
- **High-level flow**:
  1. `build_runtime` constructs `_ObservedRuntime`, wires Zeus, LLM, and catalog, then caches one `AgentAPI`.
  2. That `AgentAPI` starts with `SecurityHooks` (`name` `security`). `ObserveMiddleware` is appended once (`name` `observe`).
  3. `ZeusRuntime.agent` on kotenai-zeus-client 2.5.4 would otherwise build a new `AgentAPI` (security only) on every access. The subclass returns the cached object, so a second `rt.agent` still has `security`, then `observe`.
  4. During `run_turn`, the chain calls both hooks. Observe logs and returns. `before_zeus` returns the same args dict. `ctx.data` is not written.
  5. `search.py` still omits `chat_request` (catalog `load_for_turn`), and still passes session and `rewind`. Those arguments are unchanged.
- **Key components**:
  - `src/travel_planner/observe.py` — `ObserveMiddleware` (`NoopMiddleware`, `critical = False`)
  - `src/travel_planner/runtime_factory.py` — `_ObservedRuntime` caches the chain after services are wired
  - `src/travel_planner/search.py` — still calls `rt.agent.run_turn` with the same arguments (not modified)
- **Data flow**: Hook name, `ctx.turn_id`, and `ctx.round` go to logger `travel_planner` at DEBUG. Some hooks add one extra count or name. User text, messages, tool arguments, Zeus bodies, prompts, and secrets are not logged.
- **Dependencies**: `zeus_client.application.middleware.NoopMiddleware` from kotenai-zeus-client 2.5.x. No new env var and no feature flag.

### Six-hook map

| Hook | Logged fields | Not logged / not changed |
|------|---------------|---------------------------|
| `on_turn_start` | event, `turn_id`, `round` | user text; `ctx.data` |
| `before_llm` | event, `turn_id`, `round` | messages |
| `after_llm` | event, `turn_id`, `round`, tool-call count from `response["tool_calls"]` | `content`, usage values |
| `before_zeus` | event, `turn_id`, `round`, verb name | tool arguments; returns the same args object |
| `after_zeus` | event, `turn_id`, `round`, verb name, HTTP status | body |
| `on_turn_end` | event, `turn_id`, `round`, answer length | answer text |

Chain order is `security`, then `observe`. SecurityHooks is not modified and stays first. Observe does not set `hooks_jailbreak_score`, `hooks_must_refuse`, `denied_verbs`, or `tool_body_override`.

Example line:

```text
observe event=before_zeus turn_id=turn-1 round=0 verb=find
```

## 3. Setup
- **Prerequisites**: TravelPlan installed from this repo with kotenai-zeus-client 2.5.x (2.5.4 in use). No extra package.
- **Environment variables**:
  - None added. Existing `ZEUS_URL` and LLM keys are unchanged.
- **Install / bootstrap steps**:
  1. Install as usual (`pip install -e ".[dev]"` from this repo, or Compose).
  2. Enable DEBUG for logger `travel_planner` when you want the lines. They are silent at INFO.
- **Configuration**: No config key. `build_runtime` always installs the middleware.
- **Verification**: `pytest tests/test_observe_middleware.py tests/test_runtime_factory.py tests/test_v2_bff_search.py::test_run_search_async_passes_rewind`

## 4. How to Use
- **Primary workflow**:
  1. Start the app so `build_runtime` runs.
  2. Set logger `travel_planner` to DEBUG.
  3. Run a search. Each loop moment emits one DEBUG line with the fields in the table above.
- **Examples**:
  ```python
  import logging
  logging.getLogger("travel_planner").setLevel(logging.DEBUG)
  ```
- **Edge cases**: A missing `tool_calls` value logs `tool_calls=0`. A non-critical exception inside observe is isolated by the client chain and does not fail the turn. A second `rt.agent` access returns the same chain, not a second `observe` item.
- **Limitations**: Logs are not a trace export. They do not include round-end, contract status, or policy decisions. Verb names are logged; treat a verb that echoes user text as sensitive at DEBUG.

## 5. Debugging & Known Issues
- **Common symptoms → causes → fixes**:
  | Symptom | Likely Cause | Fix |
  |---------|--------------|-----|
  | No observe lines | Logger level is above DEBUG | Set `travel_planner` to DEBUG |
  | Chain is only `security` | Code used stock `ZeusRuntime.agent` instead of `build_runtime` | Use the runtime from `build_runtime` / `get_runtime` |
  | Two `observe` items | `_cache_agent` ran twice on a new agent | It must no-op when `_agent_api` is already set |
- **Debug checklist**:
  - [ ] `rt.agent is` the next `rt.agent`
  - [ ] `[item.name for item in rt.agent.middleware.items] == ["security", "observe"]`
  - [ ] DEBUG lines contain `event=`, `turn_id=`, and `round=` and not the user query
- **Known issues**:
  - **Stock `ZeusRuntime.agent` drops extra middleware** — caching is required on 2.5.4. Do not `add` observe on a temporary `rt.agent`.
- **Logging & observability**: Logger name `travel_planner`, level DEBUG, message prefix `observe`.

## 6. Related Artifacts
- **Files changed / owned by this feature**:
  - `src/travel_planner/observe.py` — six hooks and safe DEBUG fields
  - `src/travel_planner/runtime_factory.py` — cached agent; security then observe
  - `tests/test_observe_middleware.py` — six DEBUG lines, args identity, no payload, `ctx.data` untouched
  - `tests/test_runtime_factory.py` — middleware order across two `rt.agent` accesses
- **Tickets**:
  - [ZD-24](https://kotenai.atlassian.net/browse/ZD-24) — observe-only middleware on the TravelPlan runtime
- **Commits**:
  - None yet — working tree only
- **Pull requests** (if applicable):
  - None yet

## 7. Changelog
| Date | Author | Change |
|------|--------|--------|
| 2026-11-03 | Grok | Log the six agent-loop moments at DEBUG after SecurityHooks, without changing the turn. |
