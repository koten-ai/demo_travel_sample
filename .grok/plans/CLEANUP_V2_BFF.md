# Plan: Cleanup TravelPlan BFF onto ZeusRuntime

> **Superseded** by `.grok/plans/IMPLEMENT_ZEUS_CLIENT_PYTHON_V2_3_0.md` (kotenai-zeus-client 2.3.0 + family design law). Kept for history.

**Date**: 2026-08-21
**Task**: Replace the V1 `run_agent` Flask BFF with a process-scoped `ZeusRuntime` BFF while keeping the existing HTML/CSS/JS UI and `/api/search` JSON contract.
**Priority**: High
**Estimated Effort**: 4 hours / 8 steps

## 1. Context & Requirements
- **Goal**: TravelPlan’s backend uses the current Zeus client public surface (`import zeus_client` → `ZeusRuntime` / `rt.agent.run_turn`), not V1 free functions. The DaisyUI search page, cards, and vendored chat-trace widget keep working without HTML/CSS/JS edits.
- **Constraints**: Flask stays the HTTP server. Nested `config.json` (`zeus` + `llm_provider` + `samples` + `default_mode`) remains valid. Card waterfall and chat JSONL stay app-owned. Default import is `zeus_client` (not the deprecated `zeus_client_v2` alias).
- **Assumptions**: Sibling `../zeus_client_python` is package 2.3.x with `ZeusRuntime.from_config` / adapter ports. UI reads `results[]`, `answer`/`structured_answer`, `trace`, `chat_id`, and injected `toolOrder`.
- **Out of Scope**: Redesigning the UI; FastAPI rewrite; changing `config.json` on disk; committing secrets; Helios/RBAC.

## 2. Analysis & Research
- Key files explored: `src/travel_planner/search.py`, `app.py`, `async_runner.py`, `zeus_config.py`, `templates/index.html`, `static/app.js`, `.worktrees/v2-python-client/`, `demo_yelp/src/local_guide/runtime_factory.py`, `zeus_client_python/docs/V2/MIGRATION.md`
- Potential risks/edge cases:
  - Nested travel config is not native `RuntimeConfig` JSON → Mitigation: map in `runtime_factory` (yelp pattern), including inline secrets → overlay store
  - V2 `public_trace` uses `hops` not only `tool_calls` → Mitigation: `turn_mapper` row extract + `results_parser` fallback
  - `output_schema` is not a `run_turn` kwarg → Mitigation: app-owned allowlist in `turn_mapper`
  - Unused FastAPI/uvicorn leftovers confuse the BFF → Mitigation: drop unused deps
- Alternatives considered: Keep `compat.v1.run_agent` (short-lived, forbidden for new BFF code); import `zeus_client_v2` alias (deprecated). Chose default `zeus_client` + `ZeusRuntime`.

## 3. Step-by-Step Implementation Plan
1. **Runtime factory + lifecycle**
   - Files to change: `src/travel_planner/runtime_factory.py` (new), `async_runner.py`, `zeus_config.py`, `__init__.py`
   - Changes: Map nested config → `RuntimeConfig`; wire `HttpxZeusPort` / LLM / `FsCatalogStore`; process-scoped runtime; drop V1 `/v1/session` monkeypatch and `init_http`
   - Tests needed: [x] `tests/test_runtime_factory.py`, rewrite `tests/test_async_runner.py`

2. **Turn mapper + search wrapper**
   - Files to change: `src/travel_planner/turn_mapper.py` (new), `search.py`, `tool_order.py` (new), `output_schema.py`, `results_parser.py`
   - Changes: `rt.catalog.load` + `rt.agent.run_turn`; map `TurnResult` to existing API JSON; static tool-order axes; schema filter in BFF; hops in destination extract
   - Tests needed: [x] `tests/test_v2_bff_search.py`, rewrite `tests/test_output_schema.py`

3. **Flask routes**
   - Files to change: `src/travel_planner/app.py`
   - Changes: Keep `GET /`, `POST /api/search`, `GET /api/tool-order`; add `GET /api/health`; no template/static edits
   - Tests needed: [x] `tests/test_app.py`

4. **Deps + verify_config**
   - Files to change: `pyproject.toml`, `requirements.txt`, `scripts/verify_config.py`
   - Changes: Drop unused FastAPI/uvicorn/multipart/toon; rewrite verify script on V2 catalog/hash APIs
   - Tests needed: [ ]

5. **Docs**
   - Files to change: `.grok/guides/ZEUS_CLIENT_V2_BFF.md` (new), `TRAVEL_PLANNER.md`, `ZEUS_CLIENT_INTEGRATION.md`, `DEMO_OUTPUT_SCHEMA.md`, `README.md`
   - Changes: Document V2 BFF flow; keep UI/setup instructions
   - Tests needed: [ ]

## 4. Verification & Rollback
- **Tests**: `pytest -q`; curl `GET /` still serves TravelPlan HTML; `GET /api/health` reports `client_import=zeus_client`; empty search still 400
- **Review Checklist**:
  - [x] Code style/linting passes (`pytest -q` — 34 passed)
  - [x] No breaking changes to HTML/CSS/JS or `/api/search` success keys
  - [x] Feature guide created or updated in `.grok/guides/ZEUS_CLIENT_V2_BFF.md`
- **Rollback Plan**: Revert the BFF Python/test/doc commits; UI files are untouched

## 5. Open Questions / Decisions Needed
- Keep Flask (yes — UI is served from Jinja templates; FastAPI was an unused leftover).
- Default import `zeus_client` rather than `zeus_client_v2` (package GA cutover).
