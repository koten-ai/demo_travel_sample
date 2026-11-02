# Plan: Accept kotenai-zeus-client 2.5.4

**Date**: 2026-11-02
**Task**: Move the TravelPlan boot gate from the 2.4.x family to 2.5.x so sibling 2.5.4 stays up and Compose publishes port 5050.
**Priority**: High
**Estimated Effort**: 1 hour / 3 steps

## 1. Context & Requirements
- **Goal**: `require_client_version()` accepts `2.5.4`. `docker compose ps` shows `0.0.0.0:5050->5000/tcp`. `GET /api/health` returns `zeus_client_version` `2.5.4`.
- **Constraints**: Keep the fail-closed prefix check and the `parse_pipeline_envelope` check. Keep host **5050** → container **5000**. Do not change `config.json` `build_version`.
- **Assumptions**: Sibling `../zeus_client_python` is **2.5.4** and still exports `parse_pipeline_envelope`. Compose already publishes `"5050:5000"`. The PORTS column stays empty while the container is `Restarting`.
- **Out of Scope**: Zeus Engine upgrades, UI changes, host port remapping, accepting 2.4.x alongside 2.5.x.

## 2. Analysis & Research
- Key files explored: `docker-compose.yml`, `Dockerfile`, `src/travel_planner/runtime_factory.py`, `src/travel_planner/__main__.py`, `tests/test_runtime_factory.py`, `tests/test_app.py`, `../zeus_client_python/src/zeus_client/_version.py`
- Potential risks/edge cases:
  - A 2.4 checkout fails closed after the move → Mitigation: docs and the error string say 2.5.x; sibling in use is 2.5.4
  - 2.5.4 drops `parse_pipeline_envelope` → Mitigation: keep that attribute check; local import confirms it exists
  - Docs still say boot gate 2.4.x → Mitigation: update README and Active guides that state the current pin
- Alternatives considered: Accept both `2.4` and `2.5` prefixes (keeps old checkouts, but the BFF pin would not match the sibling). Exact equality on `2.5.4` only (rejects the next 2.5 patch the same way 2.4 rejected 2.5.4).

## 3. Step-by-Step Implementation Plan
1. **Move the boot gate to 2.5.x**
   - Files to change: `src/travel_planner/runtime_factory.py`, `src/travel_planner/search.py`, `tests/test_runtime_factory.py`, `tests/test_app.py`, `pyproject.toml`
   - Changes: `REQUIRED_CLIENT_VERSION_PREFIX = "2.5"`; tests `startswith("2.5")`; comments name 2.5.4
   - Commands to run: `.venv/bin/pytest tests/test_runtime_factory.py tests/test_app.py -q`
   - Tests needed: [x] version gate accepts installed 2.5.4

2. **Operator docs**
   - Files to change: `README.md`, `config.example.json`, `data/chat_requests/README.md`, `.grok/guides/TRAVEL_PLANNER.md`, `.grok/guides/ZEUS_CLIENT_INTEGRATION.md`, `.grok/guides/ZEUS_CLIENT_V2_BFF.md`, `.grok/guides/DEMO_OUTPUT_SCHEMA.md`, `.grok/guides/DEBUG_QUERY_REWIND.md`, `.grok/guides/PIPELINE_XML_AS_ANSWER.md`
   - Changes: In-use client is **2.5.4**; boot gate is 2.5.x
   - Tests needed: [ ]

3. **Restart Compose**
   - Files to change: none
   - Changes: source is bind-mounted; restart `travel-planner`
   - Commands to run: `docker compose restart travel-planner`; `docker compose ps`; `curl -sS http://localhost:5050/api/health`
   - Tests needed: [x] PORTS shows 5050; health `zeus_client_version` is `2.5.4`

## 4. Verification & Rollback
- **Tests**: `pytest` on the version gate and app health; live `/api/health` and homepage version stamp
- **Review Checklist**:
  - [x] `pytest tests/test_runtime_factory.py tests/test_app.py` — 20 passed
  - [x] Compose publishes `0.0.0.0:5050->5000/tcp`; `/api/health` reports `2.5.4`
  - [x] Feature guide created or updated in `.grok/guides/ZEUS_CLIENT_V2_BFF.md`
- **Rollback Plan**: Set `REQUIRED_CLIENT_VERSION_PREFIX` back to `"2.4"` and restart the container. That again rejects sibling 2.5.4.

## 5. Open Questions / Decisions Needed
- None. Family prefix `2.5` accepts 2.5.4 and later 2.5 patches.
