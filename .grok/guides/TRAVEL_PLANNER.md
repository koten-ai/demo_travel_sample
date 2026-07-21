# Guide: Travel Planner App

**Date**: 2026-07-01
**Feature**: Flask + DaisyUI travel search powered by Zeus Engine and LLM agent loop
**Status**: Active
**Related Plan**: `.grok/plans/TRAVEL_PLANNER_APP.md`

## 1. Overview

- **Purpose**: Let users describe travel preferences in natural language and receive destination recommendations from Zeus `travel-sample` data, with a floating Zeus trace debug panel.
- **Scope**: Search UI, `/api/search`, trace panel. No settings wizard or chat history UI.
- **Entry points**: `GET /`, `POST /api/search`, `GET /api/tool-order`

## 2. Architecture & Flow

- **High-level flow**:
  1. User submits preferences via DaisyUI search form.
  2. Flask calls `services.search.run_search()` → zeus_client `run_agent()` with `travel_booking` mode.
  3. LLM invokes Zeus V2 verbs (`search`, `find`, `pipeline`, etc.).
  4. `services.results_parser` extracts destination rows from `trace.tool_calls`.
  5. When tool rows are empty, `services.answer_parser` parses markdown `answer` into `structured_answer` JSON and flat `results` cards.
  6. Frontend renders cards + appends trace card to floating debug panel.

- **Key components**:
  - `src/travel_planner/app.py` — Flask application factory and routes
  - `src/travel_planner/search.py` — Zeus agent wrapper
  - `src/travel_planner/results_parser.py` — Destination card extraction from Zeus trace
  - `src/travel_planner/answer_parser.py` — Markdown answer → JSON fallback (see `.grok/guides/MARKDOWN_ANSWER_PARSER.md`)
  - `src/travel_planner/async_runner.py` — Background asyncio loop for httpx
  - `src/travel_planner/chat_store.py` — Multi-turn chat JSONL persistence
  - `src/travel_planner/tool_order.py` — `/api/tool-order` for trace chart
  - `src/travel_planner/zeus_config.py` — `zeus_client` env configuration
  - `src/travel_planner/static/trace.js` — Trace UI
  - `data/chat_requests/` — `travel_booking` catalog snapshot
  - `kotenai-zeus-client` — Zeus agent loop pip package (see `.grok/guides/ZEUS_CLIENT_INTEGRATION.md`)

- **Dependencies**: `kotenai-zeus-client` (sibling `../zeus_client_python`), Zeus server, LLM API key in `config.json`

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
  1. Enter travel preferences in the textarea (e.g. "warm beaches in Europe under $2000").
  2. Click **Search**.
  3. View destination cards and AI summary.
  4. Click **Trace** (bottom-right) to inspect Zeus/LLM execution waterfall.

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
- `.grok/guides/ZEUS_CLIENT_INTEGRATION.md` — Zeus client pip integration details

## 7. Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-07-01 | agent | Initial travel planner implementation |
| 2026-07-01 | agent | Vendored zeus_client code; removed PYTHONPATH / sibling-repo dependency |
| 2026-07-01 | agent | Restructured to src/travel_planner + vendor/ layout with pyproject.toml |
| 2026-07-07 | agent | Replaced vendored `vendor/python3` with `kotenai-zeus-client` pip package; see `ZEUS_CLIENT_INTEGRATION.md` |