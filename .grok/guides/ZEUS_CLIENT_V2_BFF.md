# Guide: TravelPlan ZeusRuntime BFF

**Date**: 2026-08-21
**Feature**: Flask BFF uses `zeus_client.ZeusRuntime` / `rt.agent.run_turn` while serving the existing DaisyUI UI
**Status**: Active
**Related Plan**: `.grok/plans/FIX_ZEUS_CLIENT_2_4_GAPS.md`; historical `.grok/plans/IMPLEMENT_ZEUS_CLIENT_PYTHON_V2_3_0.md` (supersedes `.grok/plans/CLEANUP_V2_BFF.md`)

## 1. Overview
- **Purpose**: Keep TravelPlan’s HTML/CSS/JS unchanged while the backend talks to the current Zeus client public surface (`import zeus_client` → `ZeusRuntime`), not V1 `run_agent` free functions.
- **Scope**: Runtime factory, Flask lifecycle, `/api/search` mapping, `/api/health`, app-owned catalog/chat/schema. Excludes UI redesign and FastAPI.
- **Entry points**:
  - `GET /` — Jinja search UI (`templates/index.html` + `static/`)
  - `POST /api/search` — one agent turn
  - `GET /api/tool-order` — trace-panel axes
  - `GET /api/health` — app + client versions

## 2. Architecture & Flow
- **High-level flow**:
  1. Package import calls `configure_paths()` (config dir, chat_requests dir, chat log).
  2. `create_app()` → `startup()` builds a process-scoped `ZeusRuntime` and optionally `rt.catalog.sync()`.
  3. `POST /api/search` → `run_search()` → `rt.agent.run_turn` (omits `chat_request` so 2.4.0 `load_for_turn` merges SCOPE BRIEF + MINI-SCHEMA). Query `debug=true` (same kill switch as the tracer) passes `rewind=True` for that turn only.
  4. `turn_mapper` peels G1 user answer, attaches detective onto `trace` (not the chat text), strips G2 keys, filters rows with `DEMO_OUTPUT_SCHEMA`, and runs the card waterfall.
  5. Flask returns the existing `/api/search` JSON keys; `app.js` renders cards and the CDN `latest` `zeus_client_chat_trace` inspector consumes `trace`.

```text
UI (unchanged templates/static)
  → Flask (app.py)
    → search.run_search
      → ZeusRuntime.agent.run_turn
      → turn_mapper + results_parser + answer_parser
    → kotenai-zeus-client 2.4
      → LLM + Zeus Engine
```

- **Key components**:
  - `src/travel_planner/runtime_factory.py` — nested `config.json` → `RuntimeConfig` + HTTP/LLM/catalog ports
  - `src/travel_planner/async_runner.py` — background loop + runtime lifecycle
  - `src/travel_planner/search.py` — domain prompt + chat persistence
  - `src/travel_planner/turn_mapper.py` — `TurnResult` → API JSON
  - `src/travel_planner/tool_order.py` — static v1/v2 axes (pipeline not on Direct)
  - `src/travel_planner/app.py` — Flask routes
- **Data flow**: nested config + overlay secrets → runtime → `TurnResult` → `results[]` / `answer` / `trace` → UI
- **Dependencies**: `kotenai-zeus-client` **2.4.0** (sibling `../zeus_client_python`; boot gate 2.4.x + `parse_pipeline_envelope`), Flask, httpx. No FastAPI.

### Design law (family SoT)

There is no repo named `zeus_chat_design`. TravelPlan follows:

| Sibling | Role |
| --- | --- |
| `../zeus_client_design` | Product how-to, L0 APIs, CHECKLIST |
| `../zeus_chat_request` (or `../Zeus/ai/zeus_chat_request`) | BASE packs, COMPAT, Layer A, multi-round bags |
| `../zeus_client_python` 2.4.0 | L1 SDK only — not a second law |

| Design rule | TravelPlan behavior |
| --- | --- |
| Mode 1, one scope | `travel_booking` against `travel-sample/_default/_default` via `run_turn` only |
| Mode 2 not for this search box | No `rt.data.search` on `/api/search` |
| Mode 3 out | No `rt.jobs` / `rt.units` |
| G1 → UI | `user_facing_answer` / Layer A `summary` → `answer`; cards from hops after allowlist |
| G2 ↛ UI | Detective, G2, `wish_i_knew` only on `trace` / debug; never in `answer` or card fields |
| Cheap product | `ai_process_result=false` unless config/profile `hub` |
| Path policy | `ignore_user_tool_path_hints=true` |
| Semantic cache | Mapped via public `SemanticCacheConfig` (`enabled` only); off unless operator opts in (Zeus ≥ 0.7.6) |
| Stamps | Library stamps `user=zeus_client`; never Hub `admin` |
| Hashes | `verify_config.py` reads published stamp / bind; never invents `md5:` |
| Transcript | `chat_store` + `SessionHandle` + `prior_messages`; never invent session ids |
| Correlation | `debug.preferred_req_id` / hop `req_id` on `trace` |
| Secrets | Env names on config; overlay for demo inline keys |

Key docs: `zeus_client_design/docs/product/HOW_TO_USE_ZEUS_CLIENT.md`, `guides/api/API_LAYER_A.md`, `API_SESSION.md`, `CHECKLIST.md`; `zeus_chat_request/docs/MULTI_ROUND_CLIENT.md`.

### Forbidden
- `from zeus_client import run_agent` / `init_http` / `compat.v1`
- `import zeus_client_v2` (deprecated alias)
- Mutating HTML/CSS/JS as part of BFF cleanup

## 3. Setup
- **Prerequisites**: Python 3.11+, Zeus with `travel-sample/_default`, LLM API key
- **Environment variables**:
  - `ZEUS_CLIENT_CONFIG_DIR` — directory for `config.json` (default: project root)
  - `ZEUS_CHAT_REQUESTS_DIR` — catalog snapshots (default: `data/chat_requests`)
  - `CHAT_LOG_PATH` — JSONL chat store
  - `ZEUS_URL` — overrides `zeus.url` (Compose sets `http://host.docker.internal:8080`)
  - `PORT` — Flask listen port (default `5000`)
- **Install / bootstrap steps**:
  1. `cp config.example.json config.json` and set LLM `api_key` / Zeus password
  2. `pip install -e ".[dev]"` (sibling `../zeus_client_python` must export `parse_pipeline_envelope`)
  3. `python -m travel_planner` or `docker compose up -d --build` (compose bind-mounts the sibling client)
- **Configuration**: Keep nested `zeus` + `llm_provider` + `samples` + `default_mode`. Optional additive keys: `profile`, `settings.ai_process_result` (default false), `session.semantic_cache.enabled` (default false). Inline secrets are copied into an overlay secret store (`password_env` / `api_key_env`); they are never stored on `RuntimeConfig`.
- **Verification**:
  ```bash
  pytest -q
  curl -sS http://localhost:5050/api/health
  # expect client_import=zeus_client, zeus_client_version starting with 2.4,
  # and pipeline_envelope_recovery: true
  ```

## 4. How to Use
- **Primary workflow**:
  1. Open `/` and submit a travel query (UI unchanged).
  2. Cards come from `results[]`; summary from `structured_answer` / result count.
  3. Trace panel still reads `window.ZeusTraceConfig.toolOrder` and `data.trace`.
- **Examples**:
  ```bash
  curl -sS -X POST http://localhost:5000/api/search \
    -H "Content-Type: application/json" \
    -d '{"query":"warm beaches in Europe under $2000"}'
  ```
- **Edge cases**: Missing `chat_id` mints `travel_` + 12 hex chars. Catalog sync failures at boot are logged and ignored (on-disk catalogs still used).
- **Limitations**: Card allowlist is applied after the turn, not as a client `run_turn` kwarg. Semantic cache stays off unless `session.semantic_cache.enabled` is set and Zeus is ≥ 0.7.6.

## 5. Debugging & Known Issues
| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| `runtime not started` | `startup()` skipped / factory failed | Check `config.json`; inspect boot logs |
| `llm api_key missing` | Empty `llm_provider.api_key` and no `XAI_API_KEY` | Set key in config or env |
| `catalog not found for mode='travel_booking'` | Missing snapshot under `data/chat_requests` | Restore catalogs or enable `chat_requests_sync.on_startup` |
| Empty cards, non-empty answer | Hops lacked name/description; markdown fallback failed | Inspect `trace.hops` / `structured_response.zeus_data` |
| Answer is a fenced HTML `<pipeline>` dump, empty `results`/`hops` | Model wrote the plan as text; loop took `direct`, **or** the Docker image has a client older than 2.4.0 without `parse_pipeline_envelope` | Rebuild so sibling `../zeus_client_python` is editable at `/opt/zeus_client_python`; `GET /api/health` must show `pipeline_envelope_recovery: true`. See `.grok/guides/PIPELINE_XML_AS_ANSWER.md` |
| Docker can't reach Zeus | `localhost:8080` inside the container | Use `ZEUS_URL=http://host.docker.internal:8080` |
| DeprecationWarning on `zeus_client_v2` | Alias import | Use `import zeus_client` |

- **Debug checklist**:
  - [ ] `GET /api/health` → `client_import=zeus_client`
  - [ ] `GET /` still includes `/static/app.css` and `/static/app.js`
  - [ ] `GET /api/tool-order` returns `v2` without `pipeline`
  - [ ] Catalog files exist under `data/chat_requests/travel-sample__default/`
- **Logging & observability**: logger prefix `travel_planner`; client family logger `zeus_client`. Detective lives on `trace.detective`, not in `answer`.

## 6. Related Artifacts
- **Files changed / owned by this feature**:
  - `src/travel_planner/runtime_factory.py` — config mapping + port wiring
  - `src/travel_planner/turn_mapper.py` — TurnResult mapping
  - `src/travel_planner/search.py` — `run_turn` wrapper
  - `src/travel_planner/async_runner.py` — runtime lifecycle
  - `src/travel_planner/app.py` — Flask + `/api/health`
  - `src/travel_planner/tool_order.py` — trace axes
  - `src/travel_planner/zeus_config.py` — path env only (no session monkeypatch)
  - `scripts/verify_config.py` — V2 catalog/hash check
  - `tests/test_v2_bff_search.py`, `tests/test_runtime_factory.py`
- **Tickets**: Travel V2 BFF pattern ZD-8; package cutover ZCP-33
- **Commits**: (fill on commit)
- **Pull requests**: n/a

## 7. Changelog
| Date | Author | Change |
|------|--------|--------|
| 2026-08-21 | agent | Replaced V1 `run_agent` BFF with `ZeusRuntime`; UI templates/static left in place |
| 2026-08-21 | agent | Aligned to kotenai-zeus-client 2.3.0 + family design (`load_for_turn`, `ai_process_result=false`, G2-not-in-UI, semantic cache mapped/off) |
| 2026-09-08 | Grok | Inspector loads CDN `latest` (see `CDN_TRACE_WIDGET.md`) |
| 2026-08-25 | Grok | Pin `zeus_client_chat_trace@1.0.0` in static (not CDN latest) |
| 2026-08-25 | agent | Analytics XML pipeline dump: recover as tool call; raw analytics query (no booking prefix) |
| 2026-08-25 | Grok | Homepage version stamp is imported `kotenai-zeus-client` **2.3.0** |
| 2026-09-02 | Grok | `POST /api/search?debug=true` → `run_turn(rewind=True)` (see `DEBUG_QUERY_REWIND.md`) |
| 2026-09-15 | Grok | Docs pin + boot gate **2.4.0** / 2.4.x; semantic cache via public `SemanticCacheConfig` |
