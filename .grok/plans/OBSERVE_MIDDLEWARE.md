# Plan: Observe middleware

**Date**: 2026-11-03
**Task**: Register an observe-only middleware that logs the six 2.5 agent-loop moments without changing the turn.
**Priority**: Medium
**Estimated Effort**: 2 hours / 4 steps

## 1. Context & Requirements
- **Goal**: Each search turn logs `on_turn_start`, `before_llm`, `after_llm`, `before_zeus`, `after_zeus`, and `on_turn_end` at DEBUG. The middleware chain is SecurityHooks (`security`), then ObserveMiddleware (`observe`). The turn, `ctx.data`, and `run_turn` arguments stay unchanged.
- **Constraints**: kotenai-zeus-client 2.5.4. Subclass `NoopMiddleware`. Logger `travel_planner` at DEBUG. Log only safe fields. `ZeusRuntime.agent` builds a new `AgentAPI` on every access, so observe is appended on that new facade. `critical` is false.
- **Assumptions**: `AgentAPI` starts its chain with only `SecurityHooks`. Turn state stays on the request, so a fresh facade per access matches the client lifecycle.
- **Out of Scope**: V1 `AgentHooks`, `compat.v1`, changing SecurityHooks or jailbreak scoring, Zeus engine changes, logging full payloads, emitting `round_end`, `contract_status`, or `policy_decision`.

## 2. Analysis & Research
- Key files explored: `src/travel_planner/runtime_factory.py`, `src/travel_planner/search.py`, `zeus_client/application/middleware.py`, `zeus_client/api/agent.py`, `zeus_client/runtime.py` (`agent` property)
- Potential risks/edge cases:
  - A one-shot `rt.agent.middleware.add` is dropped on the next access → Mitigation: `_ObservedRuntime.agent` builds a new `AgentAPI` and appends observe on every access. A process-lifetime cache was rejected because it would share later per-call facade state across searches.
  - Observe logs a prompt, tool args, or Zeus body → Mitigation: a fixed field list (event, turn id, round, tool-call count, verb, HTTP status, answer length)
  - Observe writes jailbreak keys and changes the turn → Mitigation: do not touch `ctx.data`; `before_zeus` returns the same args object; `critical = False`
- Alternatives considered: Append observe inside `search.py` before `run_turn` (does not survive the next `rt.agent` access, and the plan forbids changing `search.py`).

## 3. Step-by-Step Implementation Plan
1. **Add ObserveMiddleware**
   - Files to change: `src/travel_planner/observe.py`
   - Changes: Subclass `NoopMiddleware`. `name = "observe"`, `critical = False`. DEBUG lines for the six hooks with safe fields only. `before_zeus` returns the original args object.
   - Tests needed: [x] each method's DEBUG line; `before_zeus` identity; payloads and `ctx.data` untouched

2. **Install it after security**
   - Files to change: `src/travel_planner/runtime_factory.py`
   - Changes: `_ObservedRuntime.agent` returns a new `AgentAPI` and appends `ObserveMiddleware` once. `search.py` `run_turn` arguments stay as they are (catalog load, session, rewind).
   - Tests needed: [x] each access has names `security`, then `observe`, and the two facades are different objects

3. **Tests**
   - Files to change: `tests/test_observe_middleware.py`, `tests/test_runtime_factory.py`
   - Changes: New middleware unit test. Extend the runtime factory tests. Do not change `search.py`.
   - Commands to run: `pytest tests/test_observe_middleware.py tests/test_runtime_factory.py tests/test_v2_bff_search.py`
   - Tests needed: [x] existing `test_run_search_async_passes_rewind` still covers rewind and answer shape

4. **Docs**
   - Files to change: `.grok/guides/OBSERVE_MIDDLEWARE.md`, `.grok/plans/OBSERVE_MIDDLEWARE.md`
   - Changes: Guide records the six-hook map, safe fields, and chain order.
   - Tests needed: [ ]

## 4. Verification & Rollback
- **Tests**: `pytest tests/test_observe_middleware.py tests/test_runtime_factory.py tests/test_v2_bff_search.py`
- **Review Checklist**:
  - [x] Code style/linting passes
  - [x] No breaking changes
  - [x] Feature guide created or updated in `.grok/guides/OBSERVE_MIDDLEWARE.md`
- **Rollback Plan**: Remove `observe.py`, return a plain `ZeusRuntime` from `build_runtime`, and delete the new tests and this guide.

## 5. Open Questions / Decisions Needed
- None. Chain order is security, then observe. Logs stay at DEBUG and omit payloads.
