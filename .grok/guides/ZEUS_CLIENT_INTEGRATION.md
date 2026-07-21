# Guide: Zeus Client Integration

**Date**: 2026-07-07
**Feature**: Pip-based `kotenai-zeus-client` library integration (replaces vendored `vendor/python3`)
**Status**: Active
**Related Plan**: `.grok/plans/REPLACE_VENDOR_ZEUS_CLIENT.md`

## 1. Overview

- **Purpose**: Run the travel demo's Zeus agent loop via the published Python client from [koten-ai/zeus_client_python](https://github.com/koten-ai/zeus_client_python) instead of a copied vendor tree.
- **Scope**: Agent loop (`run_agent`), config load, auth, catalog discovery, HTTP client lifecycle. Excludes the upstream FastAPI sample UI (`python3/main.py` equivalent).
- **Entry points**:
  - `travel_planner.zeus_config.configure_zeus_client()` — sets env vars before `zeus_client` import
  - `travel_planner.search.run_search()` — travel-specific wrapper around `zeus_client.run_agent()`
  - `travel_planner.chat_store` — local multi-turn persistence (not in upstream package)
  - `travel_planner.tool_order` — `/api/tool-order` for trace panel chart axes

## 2. Architecture & Flow

- **High-level flow**:
  1. `import travel_planner` calls `configure_zeus_client()` (sets `ZEUS_CLIENT_CONFIG_DIR`, `ZEUS_CHAT_REQUESTS_DIR`, `CHAT_LOG_PATH`).
  2. Flask `create_app()` → `startup()` → `zeus_client.init_http()` + `load_chats_from_jsonl()`.
  3. `POST /api/search` → `run_search()` → `zeus_client.run_agent()` with `travel_booking` mode.
  4. Catalog resolved from `data/chat_requests/` via `ZEUS_CHAT_REQUESTS_DIR`.
  5. Chat state persisted to `data/chats.jsonl` via local `chat_store`.

- **Import-order constraint**: `zeus_client.constants` reads env vars at import time. Never import `zeus_client` before `configure_zeus_client()` runs. The package `__init__.py` handles this automatically.

- **Config normalization**: `zeus_client.load_config()` accepts legacy `zeus_connections` + `providers` shapes from `config.example.json` and normalizes in memory to `zeus` + `llm_provider`. Use `resolve_llm_provider_config(cfg)` and `resolve_zeus_config(cfg)` in application code.

- **Key components**:
  - `src/travel_planner/zeus_config.py` — env-based path configuration
  - `src/travel_planner/search.py` — agent invocation
  - `src/travel_planner/chat_store.py` — JSONL chat persistence
  - `src/travel_planner/tool_order.py` — trace chart tool axes
  - `data/chat_requests/by_use_case/chat_request_travel_booking_v2.json` — travel mode catalog
  - `kotenai-zeus-client` (PyPI) — upstream agent library

- **Data flow**: `config.json` → `load_config()` → `run_agent(..., structured=True, output_schema=DEMO_OUTPUT_SCHEMA)` → Zeus V2 dispatch → filtered `zeus_data` + answer → `results_parser` / `answer_parser`
- **Structured rows**: See `.grok/guides/DEMO_OUTPUT_SCHEMA.md` for the app-owned allowlist that keeps card fields only.

- **Dependencies**: `kotenai-zeus-client` from sibling `../zeus_client_python` (path dep in `pyproject.toml`; GitHub repo is private / not yet on PyPI under this name)

## 3. Setup

- **Prerequisites**: Python 3.11+, Zeus Engine with `travel-sample/_default`, LLM API key

- **Environment variables**:
  - `ZEUS_CLIENT_CONFIG_DIR` — Directory for `config.json` (default: project root via `configure_zeus_client()`)
  - `ZEUS_CHAT_REQUESTS_DIR` — Local catalog snapshots (default: `data/chat_requests`)
  - `CHAT_LOG_PATH` — Multi-turn chat JSONL (default: `data/chats.jsonl`)
  - `ZEUS_URL` — Runtime override for Zeus base URL (optional)

- **Install / bootstrap steps**:
  1. Clone `zeus_client_python` beside this repo under `koten-ai/`, then `pip install -e ".[dev]"`
  2. `cp config.example.json config.json` and set LLM `api_key`
  3. Ensure `data/chat_requests/by_use_case/chat_request_travel_booking_v2.json` exists
  4. `python -m travel_planner` or `docker compose up --build`

- **Configuration**: Project-root `config.json`. Legacy `zeus_connections`/`providers` keys still work; normalized on load.

- **Verification**: `pytest tests/test_app.py`; manual `GET /api/tool-order` returns `v1`/`v2` lists.

## 4. How to Use

- **Primary workflow** (developer):
  1. Install deps: `pip install -e .`
  2. Configure Zeus URL and LLM key in `config.json`
  3. Run app; submit search queries

- **Refreshing catalogs from Zeus** (optional):
  ```python
  import asyncio
  from zeus_client import ZeusClient, load_config, sync_chat_requests

  async def sync():
      async with ZeusClient():
          cfg = await load_config()
          result = await sync_chat_requests(cfg)
          print(result.synced)

  asyncio.run(sync())
  ```
  Synced files land under `ZEUS_CHAT_REQUESTS_DIR` (or `~/.config/zeus_client/chat_requests` if unset).

- **Upgrading the client**: Bump `kotenai-zeus-client` version in `pyproject.toml` and `requirements.txt`, then `pip install -e .`.

- **Limitations**: Chat store and tool-order metrics are demo-local; not exported by `kotenai-zeus-client`.

## 5. Debugging & Known Issues

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| `no chat_request file for mode 'travel_booking'` | Catalog missing | Restore `data/chat_requests/by_use_case/chat_request_travel_booking_v2.json` or run `sync_chat_requests` |
| `llm_provider has no api_key` | Empty key after normalization | Set `llm_provider.api_key` or legacy `providers.<id>.api_key` |
| Config read from wrong path | `ZEUS_CLIENT_CONFIG_DIR` unset or import order wrong | Ensure `import travel_planner` runs before direct `zeus_client` imports |
| `no Zeus URL configured` | Missing `zeus.url` | Fill `config.json` Zeus connection |
| Wrong catalog loaded | Stale sync dir | Check `ZEUS_CHAT_REQUESTS_DIR` points at `data/chat_requests` |
| `[WARN] zeus_data: entity_type unknown…` / `zeus_data=0` after successful find+get | Structured extractor took last tool (`get`) without `entity_type` | Fixed in local `zeus_client` (`agent/response.py` infers from prior find/search or row field). See `.grok/guides/DEMO_OUTPUT_SCHEMA.md` |
| Runtime audit hash drift / session `none` | See `.grok/guides/ANALYTICS_CONTRACT_DRIFT.md` | Align catalog stamp + `scope_contracts`; Docker URL `host.docker.internal`; basic auth; `/v2/session` |
| `All connection attempts failed` to Zeus from Compose | `localhost:8080` inside container | Set `zeus.url` / `ZEUS_URL` to `http://host.docker.internal:8080` |
| Session create `404` | Client still on `/v1/session` (pre ZE-35) | Upgrade `kotenai-zeus-client` or rely on `patch_durable_session_v2_routes` |

- **Debug checklist**:
  - [ ] `echo $ZEUS_CLIENT_CONFIG_DIR` / verify `config.json` location
  - [ ] List `data/chat_requests/**/*.json`
  - [ ] `GET /api/tool-order` returns 200
  - [ ] Zeus `/readyz` reachable at configured URL

- **Logging**: Zeus client logs as `zeus_client` logger prefix.

## 6. Related Artifacts

- **Files changed / owned by this feature**:
  - `pyproject.toml`, `requirements.txt` — `kotenai-zeus-client` dependency
  - `src/travel_planner/__init__.py` — early `configure_zeus_client()`
  - `src/travel_planner/zeus_config.py` — env configuration
  - `src/travel_planner/search.py`, `async_runner.py`, `app.py` — rewired imports
  - `src/travel_planner/chat_store.py`, `tool_order.py` — lifted from vendor
  - `data/chat_requests/` — travel_booking catalog
  - `Dockerfile`, `docker-compose.yml` — removed `vendor/` mount
  - `vendor/` — **removed**

- **Upstream**: [koten-ai/zeus_client_python](https://github.com/koten-ai/zeus_client_python)

## 7. Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-07-07 | agent | Initial guide: replaced vendored `vendor/python3` with `kotenai-zeus-client` pip package |