# Plan: Replace Vendored zeus_client with kotenai-zeus-client

**Date**: 2026-07-07
**Task**: Swap `vendor/python3` for the `kotenai-zeus-client` package from https://github.com/koten-ai/zeus_client_python
**Priority**: High
**Estimated Effort**: 2 hours / 7 steps

## 1. Context & Requirements

- **Goal**: Travel demo uses `zeus_client` pip package; `vendor/` removed; tests pass; guides updated.
- **Constraints**: Private GitHub repo; PyPI name is `kotenai-zeus-client` (not published yet as of implementation); monorepo sibling at `../zeus_client_python`.
- **Assumptions**: `zeus_client_python` checked out beside `demo_travel_sample` under `koten-ai/`.
- **Out of Scope**: Upstreaming `chat_store` to zeus_client; frontend trace JS bundle.

## 2. Analysis & Research

- Key files explored: `src/travel_planner/*`, `vendor/python3/*`, `zeus_client_python/src/*`
- Potential risks:
  - PyPI `zeus-client` is unrelated package → use `file:../zeus_client_python` path dep
  - Import-order for env vars → mitigate via `travel_planner/__init__.py`
  - Missing `travel_booking` catalog → move to `data/chat_requests/`
- Alternatives: Git URL install (repo private); PyPI pin (not available under correct name)

## 3. Step-by-Step Implementation Plan

1. **Add dependency** — `pyproject.toml`: `kotenai-zeus-client @ file:../zeus_client_python`
2. **Local modules** — `chat_store.py`, `tool_order.py` in `travel_planner`
3. **Rewire imports** — `search.py`, `async_runner.py`, `app.py`, `zeus_config.py`, `__init__.py`
4. **Catalog data** — `data/chat_requests/by_use_case/chat_request_travel_booking_v2.json`
5. **Deploy** — Dockerfile uses monorepo context `..`; docker-compose updated; delete `vendor/`
6. **Documentation** — `.grok/guides/ZEUS_CLIENT_INTEGRATION.md`, update `TRAVEL_PLANNER.md`
7. **Verify** — `pytest`, manual search smoke test

## 4. Verification & Rollback

- **Tests**: `pytest tests/test_app.py`
- **Review Checklist**:
  - [x] No `vendor/python3` imports remain
  - [x] `kotenai-zeus-client` installed
  - [x] Guide created/updated in `.grok/guides/`
- **Rollback Plan**: Restore `vendor/` from git; revert pyproject.toml dependency

## 5. Open Questions / Decisions Needed

- Publish `kotenai-zeus-client` to private PyPI to replace path dependency for non-monorepo clones.