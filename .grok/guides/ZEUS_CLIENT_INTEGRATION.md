# Guide: Zeus Client Integration

**Date**: 2026-07-07
**Feature**: Pip-based `kotenai-zeus-client` library integration (replaces vendored `vendor/python3`)
**Status**: Active
**Related Plan**: `.grok/plans/ACCEPT_ZEUS_CLIENT_2_5_4.md`; `.grok/plans/REPLACE_VENDOR_ZEUS_CLIENT.md`

## 1. Overview

- **Purpose**: Run the travel demo's Zeus agent loop via the published Python client from [koten-ai/zeus_client_python](https://github.com/koten-ai/zeus_client_python) instead of a copied vendor tree.
- **Scope**: Agent loop (`ZeusRuntime.agent.run_turn`), config mapping, auth, catalog discovery, HTTP client lifecycle. Excludes the upstream sample UI.
- **Entry points**:
  - `travel_planner.zeus_config.configure_paths()` — sets env vars before runtime bind
  - `travel_planner.search.run_search()` — travel-specific wrapper around `rt.agent.run_turn()`
  - `travel_planner.chat_store` — local multi-turn persistence (not in upstream package)
  - `travel_planner.tool_order` — `/api/tool-order` for trace panel chart axes
- **Status note**: V1 `run_agent` / `init_http` paths were removed. Client in use is **2.5.4** (boot gate: 2.5.x family + `parse_pipeline_envelope`). See `.grok/guides/ZEUS_CLIENT_V2_BFF.md`.

## 2. Architecture & Flow

- **High-level flow**:
  1. `import travel_planner` calls `configure_paths()` which loads `.env` (`override=False`, so Compose `ZEUS_URL` wins) and maps beer names onto empty `ZEUS_CLIENT_*` keys, then sets `ZEUS_CLIENT_CONFIG_DIR`, `ZEUS_CHAT_REQUESTS_DIR`, and `CHAT_LOG_PATH`.
  2. Flask `create_app()` → `startup()` → `build_runtime()` + optional `rt.catalog.sync()` + `load_chats_from_jsonl()`.
  3. `POST /api/search` → `run_search()` → `rt.agent.run_turn()` with `travel_booking` mode.
  4. Catalog resolved from `data/chat_requests/` via `ZEUS_CHAT_REQUESTS_DIR`.
  5. Chat state persisted to `data/chats.jsonl` via local `chat_store`.

- **Import-order constraint**: Path env vars are set in `travel_planner.__init__` via `configure_paths()` before Flask builds the runtime.

- **Config mapping**: `config.json` (`zeus`, `target`, `llm`, `settings`, plus travel `scope_contracts` / `chat_requests_sync`) is mapped to `RuntimeConfig` in `runtime_factory.py`. Sentinels `ZEUS_AUTH_MODE`, `ZEUS_MODE`, `LLM_BASE_URL`, and `LLM_MODEL` resolve from the environment. When `ZEUS_URL` is set, `zeus.auth_mode` is replaced from `ZEUS_AUTH_MODE`. `llm.api_key_env` stays the name `LLM_API_KEY` and `zeus.password_env` stays `ZEUS_PASSWORD`. `session.semantic_cache` uses public `SemanticCacheConfig` (`enabled` only). `OverlaySecretStore` reads the process environment and does not copy inline JSON secrets.

- **Key components**:
  - `src/travel_planner/zeus_config.py` — `.env` load plus path configuration
  - `src/travel_planner/search.py` — agent invocation
  - `src/travel_planner/chat_store.py` — JSONL chat persistence
  - `src/travel_planner/tool_order.py` — trace chart tool axes
  - `data/chat_requests/by_use_case/chat_request_travel_booking_v2.json` — travel mode catalog
  - `kotenai-zeus-client` (PyPI) — upstream agent library

- **Data flow**: `config.json` → `build_runtime()` → `rt.agent.run_turn(...)` → Zeus V2 dispatch → `turn_mapper` allowlist + `results_parser` / `answer_parser`
- **Structured rows**: See `.grok/guides/DEMO_OUTPUT_SCHEMA.md` for the app-owned allowlist that keeps card fields only.

- **Dependencies**: `kotenai-zeus-client` from sibling `../zeus_client_python` (path dep in `pyproject.toml`; GitHub repo is private / not yet on PyPI under this name)

## 3. Setup

- **Prerequisites**: Python 3.11+, Zeus Engine with `travel-sample` / `inventory` / `hotel`, `LLM_API_KEY` in `.env`

- **Environment variables** (names and defaults from `.env.example`):
  - `ZEUS_URL` — `http://localhost:8080` (Compose sets `http://host.docker.internal:8080` and wins over the file)
  - `ZEUS_BUCKET` — `travel-sample`
  - `ZEUS_SCOPE` — `inventory`
  - `ZEUS_COLLECTION` — `hotel`
  - `ZEUS_MODE` — `analytics`
  - `ZEUS_PASSWORD` — basic-auth password (empty in `.env.example`)
  - `LLM_API_KEY` — required LLM key (empty in `.env.example`; not stored in `config.json`)
  - `LLM_BASE_URL` — `https://api.x.ai/v1`
  - `LLM_MODEL` — `grok-4-1-fast-non-reasoning`
  - `PORT` — `5000` (Compose publishes host `5050`)
  - `ZEUS_CLIENT_CONFIG_DIR` — Directory for `config.json` (default: project root via `configure_paths()`)
  - `ZEUS_CHAT_REQUESTS_DIR` — Local catalog snapshots (default: `data/chat_requests`)
  - `CHAT_LOG_PATH` — Multi-turn chat JSONL (default: `data/chats.jsonl`)

- **Install / bootstrap steps**:
  1. Clone `zeus_client_python` beside this repo under `koten-ai/`, then `pip install -e ".[dev]"`
  2. `cp .env.example .env` and set `LLM_API_KEY` and `ZEUS_PASSWORD`. Do not put the API key in `config.json`.
  3. Ensure `data/chat_requests/by_use_case/chat_request_travel_booking_v2.json` exists
  4. `python -m travel_planner` or `docker compose up --build`

- **Configuration**: Committed `config.json` (identical to `config.example.json`) is secret-free. `password_env` is `ZEUS_PASSWORD` and `api_key_env` is `LLM_API_KEY`. Legacy nested `llm_provider` / `samples` keys still map when present; inline secret fields are ignored.

- **Verification**: `pytest tests/test_app.py`; manual `GET /api/tool-order` returns `v1`/`v2` lists.

## 4. How to Use

- **Primary workflow** (developer):
  1. Install deps: `pip install -e .`
  2. Set `ZEUS_URL` and `LLM_API_KEY` in `.env` (from `.env.example`). Do not put the API key in `config.json`
  3. Run app; submit search queries

- **Refreshing catalogs from Zeus** (optional):
  ```python
  import asyncio
  from travel_planner.runtime_factory import build_runtime

  async def sync():
      rt = build_runtime()
      try:
          result = await rt.catalog.sync()
          print(result.synced)
      finally:
          await rt.aclose()

  asyncio.run(sync())
  ```
  Synced files land under `ZEUS_CHAT_REQUESTS_DIR`.

- **Upgrading the client**: Keep sibling `../zeus_client_python` on **2.5.4** (2.5.x family), then `pip install -e ".[dev]"`. `GET /api/health` must report `zeus_client_version` `2.5.4` (prefix `2.5`) and `pipeline_envelope_recovery: true`. The search UI prints `v{{ zeus_client_version }}` from the imported package, not `config.json` `build_version`.

- **Limitations**: Chat store and tool-order metrics are demo-local; not exported by `kotenai-zeus-client`.

## 5. Debugging & Known Issues

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| `catalog not found for mode='travel_booking'` | Catalog missing | Restore `data/chat_requests/` snapshots or enable `chat_requests_sync.on_startup` |
| `llm api_key missing` | `LLM_API_KEY` unset in the process | Set `LLM_API_KEY` in `.env` (see `.env.example`). Do not put the API key in `config.json` |
| Config read from wrong path | `ZEUS_CLIENT_CONFIG_DIR` unset or import order wrong | Ensure `import travel_planner` runs before direct `zeus_client` imports |
| `no Zeus URL configured` | Missing `zeus.url` | Fill `config.json` Zeus connection |
| Wrong catalog loaded | Stale sync dir | Check `ZEUS_CHAT_REQUESTS_DIR` points at `data/chat_requests` |
| `[WARN] zeus_data: entity_type unknown…` / `zeus_data=0` after successful find+get | Structured extractor took last tool (`get`) without `entity_type` | Fixed in local `zeus_client` (`agent/response.py` infers from prior find/search or row field). See `.grok/guides/DEMO_OUTPUT_SCHEMA.md` |
| Runtime audit hash drift / session `none` | See `.grok/guides/ANALYTICS_CONTRACT_DRIFT.md` | Align catalog stamp + `scope_contracts`; Docker URL `host.docker.internal`; basic auth; `/v2/session` |
| `All connection attempts failed` to Zeus from Compose | `localhost:8080` inside container | Set `zeus.url` / `ZEUS_URL` to `http://host.docker.internal:8080` |
| Session create `404` | Client still on `/v1/session` (pre ZE-35) | Use `kotenai-zeus-client` 2.5.x (`/v2/session` is library-owned; no local monkeypatch) |
| `kotenai-zeus-client 2.5.x required` | Sibling checkout older than 2.5 | Update `../zeus_client_python` and reinstall |

- **Debug checklist**:
  - [ ] `echo $ZEUS_CLIENT_CONFIG_DIR` / verify `config.json` location
  - [ ] List `data/chat_requests/**/*.json`
  - [ ] `GET /api/tool-order` returns 200
  - [ ] Zeus `/readyz` reachable at configured URL

- **Logging**: Zeus client logs as `zeus_client` logger prefix.

## 6. Related Artifacts

- **Files changed / owned by this feature**:
  - `pyproject.toml`, `requirements.txt` — `kotenai-zeus-client` and `python-dotenv`
  - `.env.example` — beer variable names; travel bucket `travel-sample`, scope `inventory`, collection `hotel`, `PORT=5000`; empty `LLM_API_KEY` and `ZEUS_PASSWORD`
  - `config.json`, `config.example.json` — identical secret-free document
  - `src/travel_planner/__init__.py` — early `configure_paths()`
  - `src/travel_planner/zeus_config.py` — `.env` load and client-env overlay
  - `src/travel_planner/runtime_factory.py` — sentinel resolution; no JSON secret promotion
  - `src/travel_planner/search.py`, `async_runner.py`, `app.py` — rewired imports
  - `src/travel_planner/chat_store.py`, `tool_order.py` — lifted from vendor
  - `data/chat_requests/` — travel_booking catalog
  - `Dockerfile`, `docker-compose.yml` — removed `vendor/` mount; Compose bind-mounts `./.env` read-only
  - `vendor/` — **removed**
- **Tickets**:
  - [ZD-27](https://kotenai.atlassian.net/browse/ZD-27) — beer `.env` / `config.json` contract

- **Upstream**: [koten-ai/zeus_client_python](https://github.com/koten-ai/zeus_client_python)

## 7. Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-07-07 | agent | Initial guide: replaced vendored `vendor/python3` with `kotenai-zeus-client` pip package |
| 2026-08-21 | agent | BFF now uses `ZeusRuntime` (see `ZEUS_CLIENT_V2_BFF.md`); this guide kept for setup/env |
| 2026-08-21 | agent | Require client 2.3.x; drop `/v1/session` monkeypatch troubleshooting |
| 2026-08-25 | Grok | UI + docs pin the in-use sibling as **2.3.0** (`zeus_client.__version__`); family gate stays `2.3` |
| 2026-09-15 | Grok | Docs pin + boot gate **2.4.0** / 2.4.x (`parse_pipeline_envelope`) |
| 2026-11-02 | Grok | Boot gate accepts **2.5.4** (2.5.x family) |
| 2026-11-06 | Grok | ZD-27: load `.env.example` contract; `LLM_API_KEY` stays out of `config.json` |