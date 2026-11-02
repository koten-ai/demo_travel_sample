# Plan: Align version-gate tests to the prefix

**Date**: 2026-11-02
**Task**: Make the client-version tests assert `REQUIRED_CLIENT_VERSION_PREFIX` and stop requiring patch `2.5.4`.
**Priority**: High
**Estimated Effort**: 1 step

## 1. Context & Requirements
- **Goal**: `require_client_version()` and the tests share one family gate. A later 2.5 patch still passes.
- **Constraints**: Do not change the boot gate, docs that name the installed 2.5.4 clock, or `config.json` `build_version`.
- **Assumptions**: Sibling checkout stays on the 2.5.x family.
- **Out of Scope**: Version-tuple parsing, doc rewrites, Jira transitions.

## 2. Analysis & Research
- Key files explored: `src/travel_planner/runtime_factory.py`, `tests/test_runtime_factory.py`, `tests/test_app.py`
- Potential risks/edge cases:
  - A 2.4 checkout still fails the prefix → Mitigation: the constant stays `"2.5"`
- Alternatives considered: Keep the exact `== "2.5.4"` pin (rejects the next patch while the app boots).

## 3. Step-by-Step Implementation Plan
1. **Share the prefix constant**
   - Files to change: `tests/test_runtime_factory.py`, `tests/test_app.py`
   - Changes: Assert `startswith(REQUIRED_CLIENT_VERSION_PREFIX)`. Drop `== "2.5.4"` and the duplicate literal `"2.5"`.
   - Commands to run: `.venv/bin/pytest tests/test_runtime_factory.py tests/test_app.py -q`
   - Tests needed: [x] family prefix only

## 4. Verification & Rollback
- **Tests**: `.venv/bin/pytest tests/test_runtime_factory.py tests/test_app.py -q` — 20 passed. This repo has no lint config in `pyproject.toml`.
- **Review Checklist**:
  - [x] No breaking changes
  - [x] Feature guide created or updated in `.grok/guides/ZEUS_CLIENT_V2_BFF.md`
- **Rollback Plan**: Restore the `== "2.5.4"` assertions.

## 5. Open Questions / Decisions Needed
- None.
