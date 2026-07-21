# Plan: Fix zeus_data entity_type unknown (find → get)

**Date**: 2026-07-09
**Task**: Resolve `[WARN] zeus_data: entity_type unknown; cannot resolve MINI-SCHEMA fields` when agent ends on `get`
**Priority**: High
**Estimated Effort**: 1 hour / done

## 1. Context & Requirements
- **Goal**: Structured `zeus_data` populates when the last successful data tool is `get` after `find`/`search`
- **Constraints**: Fix in `zeus_client` (shared library); demo already passes multi-entity `DEMO_OUTPUT_SCHEMA`
- **Assumptions**: Editable install of `../zeus_client_python` is what the demo uses
- **Out of Scope**: Changing Zeus server `get` API to require `entity_type`; prompt changes

## 2. Analysis & Research
- Key files explored:
  - `zeus_client_python/src/agent/response.py` — warning + allowlist resolution
  - `demo_travel_sample/src/travel_planner/search.py` — `output_schema=DEMO_OUTPUT_SCHEMA`
  - User logs: last verbs `find` then `get` with `args_keys=['ids', 'include']`; `zeus_data=0`, `results=10`
- Potential risks/edge cases:
  - Mixed entity types across prior tools → use most recent prior tool with entity_type
  - Rows without `entity_type` and no prior find → still warn (correct)
- Alternatives considered: union all multi-entity allowlist fields (too loose); only document workaround (insufficient)

## 3. Step-by-Step Implementation Plan
1. **Infer entity_type in client**
   - Files: `zeus_client_python/src/agent/response.py`
   - Changes: from prior data tools, unanimous row `entity_type`, decomposition (existing)
2. **Tests**
   - Files: `zeus_client_python/tests/test_agent_response.py`
   - Cases: find→get inheritance; row field; multi-entity output_schema
3. **Docs**
   - Update `.grok/guides/DEMO_OUTPUT_SCHEMA.md` and `ZEUS_CLIENT_INTEGRATION.md`

## 4. Verification & Rollback
- **Tests**: `pytest tests/test_agent_response.py` in `zeus_client_python` (15 passed)
- **Review Checklist**:
  - [x] Code style/linting passes
  - [x] No breaking changes
  - [x] Feature guide created or updated in `.grok/guides/DEMO_OUTPUT_SCHEMA.md`
- **Rollback Plan**: Revert response.py inference helpers

## 5. Open Questions / Decisions Needed
- None remaining
