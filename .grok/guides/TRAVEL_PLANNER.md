# Guide: Travel Planner App

**Date**: 2026-07-01
**Feature**: Flask + DaisyUI travel search powered by Zeus Engine and LLM agent loop
**Status**: Active
**Related Plan**: `.grok/plans/COMBINE_LOADER_AND_STOP.md`; `.grok/plans/SEND_BUTTON_AS_CANCEL.md` (in-flight cancel); `.grok/plans/SHRINK_SEARCH_BOX.md`; `.grok/plans/WIDEN_SEARCH_BOX.md`; `.grok/plans/MULTI_LINE_SEARCH_BOX.md` (composer UI); `.grok/plans/IMPLEMENT_ZEUS_CLIENT_PYTHON_V2_3_0.md` (client 2.3.0); original app plan `.grok/plans/TRAVEL_PLANNER_APP.md`

## 1. Overview

- **Purpose**: Let users describe travel preferences in natural language and receive destination recommendations from Zeus `travel-sample` data, with a floating Zeus trace debug panel.
- **Scope**: Search UI, `/api/search`, trace panel. No settings wizard or chat history UI.
- **Entry points**: `GET /`, `POST /api/search`, `GET /api/tool-order`, `GET /api/health`

## 2. Architecture & Flow

- **High-level flow**:
  1. User submits preferences via the multi-line DaisyUI search box (`#searchInput` textarea; Enter submits, Shift+Enter newline). The hint under the box shows the installed `kotenai-zeus-client` version (`v2.3.0`). While `/api/search` is in flight, `#search-btn` keeps the same circular control but shows a spinning loader ring around a stop square; clicking it aborts the browser fetch (`AbortController`) and restores the send control. Cancelling does not stop the Zeus turn on the server.
  2. Flask calls `search.run_search()` → `ZeusRuntime.agent.run_turn()` (`config.json` `default_mode`, often `analytics`). If the model dumps a fenced `<pipeline>` instead of a tool call, the sibling client recovers it as a Zeus `pipeline` hop (see `.grok/guides/PIPELINE_XML_AS_ANSWER.md`).
  3. LLM invokes Zeus V2 verbs (`search`, `find`, `project`, etc.).
  4. `turn_mapper` + `results_parser` extract destination rows from `trace.hops` / `tool_calls`.
  5. When tool rows are empty, `answer_parser` parses markdown `answer` into `structured_answer` JSON and flat `results` cards.
  6. Frontend renders cards + appends trace card to floating debug panel.

- **Key components**:
  - `src/travel_planner/app.py` — Flask application factory and routes
  - `src/travel_planner/search.py` — Domain `run_turn` wrapper
  - `src/travel_planner/runtime_factory.py` — Nested config → `ZeusRuntime`
  - `src/travel_planner/turn_mapper.py` — `TurnResult` → `/api/search` JSON
  - `src/travel_planner/results_parser.py` — Destination card extraction from Zeus trace
  - `src/travel_planner/answer_parser.py` — Markdown answer → JSON fallback (see `.grok/guides/MARKDOWN_ANSWER_PARSER.md`)
  - `src/travel_planner/async_runner.py` — Background loop + process-scoped runtime
  - `src/travel_planner/chat_store.py` — Multi-turn chat JSONL persistence
  - `src/travel_planner/tool_order.py` — `/api/tool-order` for trace chart
  - `src/travel_planner/zeus_config.py` — Path env before runtime bind
  - `src/travel_planner/static/` — CSS, JS, pinned `zeus_client_chat_trace@1.0.0` (see `.grok/guides/PINNED_TRACE_WIDGET.md`)
  - `data/chat_requests/` — `travel_booking` catalog snapshot
  - `kotenai-zeus-client` — ZeusRuntime pip package (see `.grok/guides/ZEUS_CLIENT_V2_BFF.md`)

- **Dependencies**: `kotenai-zeus-client` **2.3.0** (sibling `../zeus_client_python`; boot gate 2.3.x), Zeus server, LLM API key in `config.json`

## 3. Setup

- **Prerequisites**: Docker (recommended) or Python 3.12+, running Zeus with `travel-sample/_default` scope, LLM API key

- **Environment variables**:
  - `ZEUS_URL` — Overrides Zeus URL in config (default `http://host.docker.internal:8080` in Docker)
  - `ZEUS_CLIENT_CONFIG_DIR` — Directory for `config.json` (default: project root)
  - `ZEUS_CHAT_REQUESTS_DIR` — Local catalog dir (default: `data/chat_requests`)
  - `CHAT_LOG_PATH` — Chat persistence file (default `/app/data/chats.jsonl`)
  - `PORT` — Flask port (default `5000`)

- **Install / bootstrap**:
  1. `cp config.example.json config.json` and add LLM `api_key`
  2. `docker compose up --build`
  3. Open http://localhost:5000

- **Local dev (no Docker)**:
  ```powershell
  cd demo_travel_sample
  pip install -e .
  python -m travel_planner
  ```

## 4. How to Use

- **Primary workflow**:
  1. Type travel preferences in the multi-line search box (e.g. "warm beaches in Europe under $2000"). Shift+Enter adds a new line; Enter or the search button submits.
  2. While the search runs, the same circular button turns red (`btn-error`) and shows a spinning ring around a stop square (`aria-label="Cancel search"`). Click it to abort the in-flight request; the composer unlocks and no error toast is shown.
  3. View destination cards and AI summary.
  4. Open `/?debug=true` and use the lightning toggle (bottom-left) for the **zeus_client_chat_trace@1.0.0** inspector.

- **Edge cases**:
  - Multi-line queries are sent as-is to `/api/search` (`query` string may contain `\n`).
  - The results heading collapses whitespace so a long prompt does not wrap as multiple title lines.
  - Clicking the button while a search is running cancels that search; it does not start a second request.
  - Aborting the browser fetch leaves any in-progress Zeus `run_turn` on the server; the UI simply ignores the response.

- **API example**:
  ```bash
  curl -X POST http://localhost:5000/api/search \
    -H "Content-Type: application/json" \
    -d '{"query": "tropical destinations with great food"}'
  ```

## 5. Debugging & Known Issues

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| `no Zeus URL configured` | Missing config | Create `config.json` from example |
| `llm_provider has no api_key` | Empty LLM key | Fill `llm_provider.api_key` or legacy `providers.<name>.api_key` |
| `no chat_request file for mode 'travel_booking'` | Missing catalog | Restore `data/chat_requests/by_use_case/chat_request_travel_booking_v2.json` |
| Empty result cards | LLM returned prose only | Check `structured_answer` in API response; see `MARKDOWN_ANSWER_PARSER.md` |
| Docker can't reach Zeus | Wrong `ZEUS_URL` | Set to host-accessible Zeus URL |

## 6. Related Artifacts

- `pyproject.toml`, `src/travel_planner/`, `data/chat_requests/`, `tests/`, `Dockerfile`, `docker-compose.yml`
- `src/travel_planner/templates/index.html` — multi-line `#searchInput` textarea; `#search-btn-cancel` loader ring + stop square
- `src/travel_planner/static/app.js` — autosize + Enter/Shift+Enter; in-flight cancel via `AbortController`
- `src/travel_planner/static/app.css` — composer min/max height; `.search-box` max-width `calc(42rem * 1.6 * 0.8)`; in-flight `.search-btn-busy` ring + stop
- `.grok/guides/ZEUS_CLIENT_INTEGRATION.md` — Zeus client pip integration details
- `.grok/guides/ZEUS_CLIENT_V2_BFF.md` — ZeusRuntime BFF (current)
- `.grok/plans/MULTI_LINE_SEARCH_BOX.md` — composer textarea
- `.grok/plans/SEND_BUTTON_AS_CANCEL.md` — in-flight cancel button

## 7. Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-07-01 | agent | Initial travel planner implementation |
| 2026-07-01 | agent | Vendored zeus_client code; removed PYTHONPATH / sibling-repo dependency |
| 2026-07-01 | agent | Restructured to src/travel_planner + vendor/ layout with pyproject.toml |
| 2026-07-07 | agent | Replaced vendored `vendor/python3` with `kotenai-zeus-client` pip package; see `ZEUS_CLIENT_INTEGRATION.md` |
| 2026-08-21 | agent | BFF cleanup: `ZeusRuntime` / `run_turn` (UI unchanged); see `ZEUS_CLIENT_V2_BFF.md` |
| 2026-08-25 | Grok | Pin vendored `zeus_client_chat_trace@1.0.0` (not CDN latest) |
| 2026-08-21 | agent | Require `kotenai-zeus-client` 2.3.x; family design law (G1 UI, cheap `ai_process_result`) |
| 2026-08-25 | Grok | Multi-line search box: textarea, autosize, Enter to search / Shift+Enter newline |
| 2026-08-25 | Grok | Chat box 60% wider (`max-width: calc(42rem * 1.6)`) |
| 2026-08-25 | Grok | Chat box 20% smaller (`max-width: calc(42rem * 1.6 * 0.8)`, height scaled 0.8) |
| 2026-08-25 | Grok | In-flight search button becomes cancel/stop; `AbortController` aborts `/api/search` |
| 2026-08-25 | Grok | In-flight button combines spinner ring and stop square in one control |
| 2026-08-25 | Grok | In-flight cancel button uses DaisyUI `btn-error` (red) |
| 2026-08-25 | Grok | Search UI version stamp is installed `kotenai-zeus-client` **2.3.0** (`zeus_client.__version__`) |