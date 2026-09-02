# Guide: Debug Query Enables Zeus Rewind

**Date**: 2026-09-02
**Feature**: `?debug=true` opts the current search turn into Zeus verbose persist (`rewind=true`)
**Status**: Active
**Related Plan**: `.grok/plans/DEBUG_QUERY_REWIND.md`

## 1. Overview
- **Purpose**: When an operator opens the demo tracer (`/?debug=true`), Zeus hops for that search persist a verbose tape so Hub Rewind can replay tool result bodies. Ordinary searches stay rewind-off (size + 30-day TTL).
- **Scope**: Flask `/api/search` query flag, `run_turn(rewind=...)`, UI forward of the page query. Does not set process-wide `DebugPolicy.rewind` or `ZEUS_REWIND`.
- **Entry points**:
  - `GET /?debug=true` — tracer kill switch; UI copies the flag onto search
  - `POST /api/search?debug=true` — BFF sets `rewind=True` on `rt.agent.run_turn`

## 2. Architecture & Flow
- **High-level flow**:
  1. Operator loads `/?debug=true` (same flag that mounts `zeus_client_chat_trace`).
  2. `app.js` `searchApiUrl()` reads `location.search` `debug` (`1|true|yes|on`) and POSTs `/api/search?debug=true`.
  3. Flask `debug_query_enabled(request.args.get("debug"))` → `run_search(..., rewind=True)`.
  4. `search._search_async` calls `rt.agent.run_turn(..., rewind=True)`.
  5. Sibling client (ZCP-112) sends `?rewind=true` on V2 verbs (never in verb JSON) and query + `"rewind": true` on `/v2/session`, `/session/{id}/turn`, `/session/trace`.
  6. Response JSON includes `"rewind": true` so the operator can confirm the turn opted in.

```text
/?debug=true
  → app.js fetch /api/search?debug=true
    → app.debug_query_enabled
      → search.run_search(rewind=True)
        → ZeusRuntime.agent.run_turn(rewind=True)
          → verbs: ?rewind=true
          → session hops: query + JSON rewind true
```

- **Key components**:
  - `src/travel_planner/app.py` — query-string parse (`debug_query_enabled`)
  - `src/travel_planner/search.py` — per-turn `rewind` into `run_turn`
  - `src/travel_planner/static/app.js` — `pageDebugEnabled` / `searchApiUrl`
  - `../zeus_client_python/src/zeus_client/api/agent.py` — `run_turn(rewind=...)`
- **Data flow**: page query → API query → bool `rewind` → client DebugPolicy overlay for that turn only
- **Dependencies**: `kotenai-zeus-client` 2.3.x with ZCP-112; Zeus 0.7.29+ to persist verbose tapes

## 3. Setup
- **Prerequisites**: Running TravelPlan + Zeus; no extra env vars
- **Environment variables**: none required. Do **not** set `ZEUS_REWIND` unless you want every turn verbose.
- **Install / bootstrap steps**:
  1. Existing `pip install -e ".[dev]"` / `docker compose up`
  2. Open `http://localhost:5050/?debug=true` (Compose) or `:5000` locally
- **Configuration**: no `config.json` change. Runtime still builds `DebugPolicy(detective_briefing=True)` (rewind default False).
- **Verification**: `POST /api/search?debug=true` JSON has `"rewind": true`. Without the query, `"rewind": false`.

## 4. How to Use
- **Primary workflow**:
  1. Open the app with `?debug=true`.
  2. Submit a search.
  3. Tracer mounts as before; Zeus hops for that turn persist verbose.
- **Examples**:
  ```bash
  curl -sS -X POST 'http://localhost:5050/api/search?debug=true' \
    -H 'Content-Type: application/json' \
    -d '{"query":"airports in France"}'
  # response includes "rewind": true
  ```
  ```bash
  curl -sS -X POST 'http://localhost:5050/api/search' \
    -H 'Content-Type: application/json' \
    -d '{"query":"airports in France"}'
  # response includes "rewind": false
  ```
- **Edge cases**:
  - Truthy: `debug=true`, `TRUE`, `1`, `yes`, `on`.
  - Falsy / omitted: `debug=false`, `0`, empty, missing — rewind stays off.
  - Direct API callers must put `debug=true` on the **search URL**; the page query does not apply to curl.
- **Limitations**:
  - `X-Zeus-Trace: 1` is a different keep-hop flag; this path does not set it.
  - Verb JSON never contains `rewind` (client strips it).
  - Cancelling the browser fetch does not stop the server turn; a rewind-on turn already in flight still persists.

## 5. Debugging & Known Issues
- **Common symptoms → causes → fixes**:
  | Symptom | Likely Cause | Fix |
  |---------|--------------|-----|
  | `"rewind": false` on `/?debug=true` search | UI not forwarding query (old JS cache) | Hard refresh; confirm `searchApiUrl` in `app.js` |
  | `"rewind": true` but Hub tape is slim | Zeus older than 0.7.29, or played session `req_id` instead of tool hop | Play Hub Rewind on the **tool** `req_id` |
  | Every turn verbose | `ZEUS_REWIND` set in the environment | Unset it; this demo is per-query only |
- **Debug checklist**:
  - [ ] Response JSON `rewind` matches the query flag
  - [ ] Network: search request URL is `/api/search?debug=true`
  - [ ] Zeus verb URLs include `rewind=true` only for that turn
- **Known issues**: none
- **Logging & observability**: search log line is unchanged; use the `rewind` field on `/api/search` JSON

## 6. Related Artifacts
- **Files changed / owned by this feature**:
  - `src/travel_planner/app.py` — `debug_query_enabled` + `/api/search` query
  - `src/travel_planner/search.py` — `run_turn(rewind=...)` + response field
  - `src/travel_planner/static/app.js` — forward page `debug` onto the search URL
  - `tests/test_app.py` — Flask + JS tests
  - `tests/test_v2_bff_search.py` — `run_turn` kwargs
- **Tickets**: none
- **Commits**: (fill at merge)
- **Pull requests**: none

## 7. Changelog
| Date | Author | Change |
|------|--------|--------|
| 2026-09-02 | Grok | `?debug=true` opts the search turn into Zeus rewind |
