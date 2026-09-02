# Plan: Debug Query Enables Zeus Rewind

**Date**: 2026-09-02
**Task**: When the page/API query string is `debug=true`, TravelPlan must opt the Zeus turn into verbose persist (`rewind=true`).
**Priority**: High
**Estimated Effort**: 1 hour / 4 steps

## 1. Context & Requirements
- **Goal**: Opening `/?debug=true` (and any `POST /api/search?debug=true`) makes this turn send Zeus rewind: query `?rewind=true` on V2 verbs, and query + JSON `"rewind": true` on session create/turn/trace. Default searches stay rewind-off.
- **Constraints**:
  - Do not enable `DebugPolicy.rewind` process-wide. Per-turn via `rt.agent.run_turn(..., rewind=True)` (ZCP-112).
  - `?debug=true` already mounts the vendored tracer; reuse that kill switch rather than a new flag.
  - Flask BFF stays the HTTP server. No config.json change required.
  - Verb JSON bodies must still never carry a `rewind` field (client strips it).
- **Assumptions**:
  - User request “Review: true” means **Rewind** (the flag we just audited). There is no Zeus `Review` payload field.
  - Sibling `kotenai-zeus-client` 2.3.x with ZCP-112 `AgentAPI.run_turn(rewind=...)`.
  - Page query `/?debug=true` does not automatically apply to `POST /api/search`; the UI must forward it.
- **Out of Scope**:
  - Changing Zeus client internals.
  - Enabling `ZEUS_REWIND` / `debug.rewind` as a global default.
  - Hub Rewind playback UI.

## 2. Analysis & Research
- Key files explored:
  - `src/travel_planner/app.py` — `POST /api/search` ignores query string
  - `src/travel_planner/search.py` — `run_turn` omits `rewind`
  - `src/travel_planner/runtime_factory.py` — `DebugPolicy(detective_briefing=True)` (rewind default False)
  - `src/travel_planner/static/app.js` — `fetch("/api/search")` with no query
  - `../zeus_client_python/src/zeus_client/api/agent.py` — per-call `rewind`
  - `../zeus_client_python/src/zeus_client/adapters/zeus_http/{session,verbs,headers}.py`
- Potential risks/edge cases:
  - Page `/?debug=true` vs API URL mismatch → Mitigation: `app.js` copies the page flag onto `/api/search?debug=true`
  - `debug=1` / `yes` / `on` used by the tracer widget → Mitigation: same truthy set on Flask
  - Accidental verbose persist in production searches → Mitigation: only when query flag is present; default off
  - Existing `run_search(query, chat_id)` callers → Mitigation: keyword-only `rewind=False`
- Alternatives considered:
  - Set `DebugPolicy.rewind=True` on the process runtime — too coarse; every turn would persist verbose tapes.
  - JSON body `{debug: true}` only — user asked for query string; body is not required.

## 3. Step-by-Step Implementation Plan
1. **Parse `debug` on `/api/search` and pass rewind**
   - Files to change: `src/travel_planner/app.py`, `src/travel_planner/search.py`
   - Changes:
     - Treat query `debug` as truthy when `1|true|yes|on` (case-insensitive).
     - `run_search(..., rewind=...)` → `rt.agent.run_turn(..., rewind=True)` only when that flag is set.
     - Include `rewind` on the JSON response so operators can confirm the turn opted in.
   - Tests needed: [x] Flask query flag, [x] `run_turn` kwargs

2. **Forward page `?debug=true` from the search UI**
   - Files to change: `src/travel_planner/static/app.js`
   - Changes: if `location.search` has truthy `debug`, `fetch("/api/search?debug=true", ...)`
   - Tests needed: [x] script contains the forward

3. **Tests**
   - Files to change: `tests/test_app.py`, `tests/test_v2_bff_search.py`
   - Changes: default search does not pass rewind; `?debug=true` does; JS wires the query
   - Commands to run: `python -m pytest -q tests/test_app.py tests/test_v2_bff_search.py`

4. **Docs**
   - Files to change: `.grok/guides/DEBUG_QUERY_REWIND.md`, `.grok/guides/TRAVEL_PLANNER.md`, `.grok/guides/ZEUS_CLIENT_V2_BFF.md`, `.grok/guides/PINNED_TRACE_WIDGET.md`, `README.md`
   - Changes: document that tracer `?debug=true` also opts Zeus hops into rewind
   - Tests needed: [ ]

## 4. Verification & Rollback
- **Tests**: pytest for Flask + search kwargs + JS string; curl `POST /api/search?debug=true` if a server is up
- **Review Checklist**:
  - [ ] Code style/linting passes
  - [ ] No breaking changes (`rewind` keyword-only; default searches unchanged)
  - [x] Feature guide created in `.grok/guides/DEBUG_QUERY_REWIND.md`
- **Rollback Plan**: revert the four source files; searches go back to rewind-off.

## 5. Open Questions / Decisions Needed
- Interpreted “Review: true” as **Rewind: true**. If a different payload field was intended, stop and confirm before shipping.
