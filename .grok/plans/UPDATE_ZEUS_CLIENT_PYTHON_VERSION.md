# Plan: Pin zeus_client_python version to what is in use

**Date**: 2026-08-25
**Task**: Show and document the installed `kotenai-zeus-client` version (`2.3.0`) instead of the stale UI/config stamp `1.0.0`.
**Priority**: Medium
**Estimated Effort**: 0.5 hours / 4 steps

## 1. Context & Requirements
- **Goal**: The TravelPlan search chrome and operator docs report the sibling `../zeus_client_python` package version that is actually imported (`zeus_client.__version__` == `2.3.0`). `/api/health` already reports this; the homepage currently prints `config.json` `build_version` (`1.0.0`).
- **Constraints**: Keep the fail-closed boot gate as family prefix `2.3` (path deps cannot PEP-440 pin). Flask stays the HTTP server. Do not bump the sibling package clock.
- **Assumptions**: Running `travel-planner` health is `zeus_client_version: "2.3.0"`; sibling `pyproject.toml` / `_version.py` / tag `v2.3.0` match.
- **Out of Scope**: Releasing a new `kotenai-zeus-client`; changing GitBook/`koten_docs` spaces; tightening the gate to exact `==2.3.0`.

## 2. Analysis & Research
- Key files explored: `src/travel_planner/templates/index.html`, `src/travel_planner/app.py`, `config.json`, `pyproject.toml`, `README.md`, `../zeus_client_python/src/zeus_client/_version.py`
- Potential risks/edge cases:
  - `build_version` is an app stamp, not the SDK → Mitigation: template uses live `zeus_client.__version__`; `build_version` remains on `/api/health` only
  - Sibling bind-mount can change without rewriting config → Mitigation: read version at request time
- Alternatives considered: Only rewrite gitignored `config.json` `build_version` (works until the next stale stamp). Rejected in favor of the imported package clock.

## 3. Step-by-Step Implementation Plan
1. **Homepage uses imported client version**
   - Files to change: `src/travel_planner/app.py`, `src/travel_planner/templates/index.html`, `tests/test_app.py`
   - Changes: Pass `zeus_client_version` into the template; hero hint prints `v{{ zeus_client_version }}`; test asserts the live `__version__` string
   - Commands to run: `pytest tests/test_app.py -q`
   - Tests needed: [x] `test_index_renders` includes `v{zeus_client.__version__}`

2. **Local config stamp**
   - Files to change: `config.json` (gitignored)
   - Changes: Set `build_version` to `2.3.0` so `/api/health` `build_version` is not `1.0.0`
   - Tests needed: [ ]

3. **Docs pin “in use” to 2.3.0**
   - Files to change: `pyproject.toml`, `README.md`, `.grok/guides/TRAVEL_PLANNER.md`, `.grok/guides/ZEUS_CLIENT_INTEGRATION.md`
   - Changes: Describe the sibling in use as **2.3.0**; keep the 2.3.x family gate
   - Tests needed: [ ]

4. **Verify live container**
   - Commands to run: `curl -sS http://localhost:5050/` and `/api/health`
   - Tests needed: [ ] homepage contains `v2.3.0`; health `zeus_client_version` is `2.3.0`

## 4. Verification & Rollback
- **Tests**: `pytest tests/test_app.py tests/test_runtime_factory.py -q` (14 passed); curl homepage + health
- **Review Checklist**:
  - [x] Code style/linting passes
  - [x] No breaking changes
  - [x] Feature guide created or updated in `.grok/guides/ZEUS_CLIENT_INTEGRATION.md` / `TRAVEL_PLANNER.md`
- **Rollback Plan**: Revert the template to `build_version`; restore `config.json` `build_version` to `1.0.0`

## 5. Open Questions / Decisions Needed
- None — live process, sibling clocks, and `/api/health` all report `2.3.0`.
