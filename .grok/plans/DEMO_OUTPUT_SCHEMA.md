# Plan: Demo Output Schema for Cleaner zeus_data

**Date**: 2026-07-09
**Task**: Add a concrete demo `output_schema` so structured `zeus_data` keeps only card-relevant travel fields.  
**Priority**: Medium  
**Estimated Effort**: 0.5 hours / 4 steps

## 1. Context & Requirements
- **Goal**: `run_agent(..., structured=True, output_schema=DEMO_OUTPUT_SCHEMA)` produces stable, demo-shaped `zeus_data` rows (name/description/image-friendly fields) instead of full MINI-SCHEMA / raw document dumps.
- **Constraints**: Use existing `zeus_client` `output_schema` precedence (arg > injection > MINI-SCHEMA). Do not change contract hash / chat_request files.
- **Assumptions**: Travel-sample entity types used by this demo are primarily `Hotel`, `Destination`, and occasionally `Airport`.
- **Out of Scope**: Silencing all `[WARN] dropped unknown field` notes (extra backend keys will still be dropped); EntityMap / server-side schema changes.

## 2. Analysis & Research
- Key files explored: `src/travel_planner/search.py`, `src/travel_planner/results_parser.py`, `zeus_client_python/src/agent/response.py`
- Potential risks/edge cases:
  - Entity type not in schema → empty `zeus_data` → fall back to `extract_destinations` / answer parser → Mitigation: include Hotel, Destination, Airport
  - Synonym field names (`image_url` vs `image`) → Mitigation: allowlist synonyms already used by `results_parser`
- Alternatives considered: chat_request `guidance.injections.output_schema` (hash-excluded but shared) vs app-level constant (clearer for demo ownership) — choose app-level.

## 3. Step-by-Step Implementation Plan
1. **Add demo schema module**  
   - Files: `src/travel_planner/output_schema.py`
   - Changes: `DEMO_OUTPUT_SCHEMA` dict + short docstring
2. **Pass schema into run_agent**  
   - Files: `src/travel_planner/search.py`
   - Changes: `output_schema=DEMO_OUTPUT_SCHEMA`
3. **Tests**  
   - Files: `tests/test_output_schema.py`
   - Changes: assert schema shape; assert `filter_rows_to_schema` / `extract_structured_response` keeps allowlisted fields and drops noise
4. **Docs**  
   - Plan + guide under `.grok/`

## 4. Verification & Rollback
- **Tests**: `pytest tests/test_output_schema.py tests/test_results_parser.py`
- **Review Checklist**:
  - [x] Code style/linting passes
  - [x] No breaking changes
  - [x] Feature guide created or updated in `.grok/guides/DEMO_OUTPUT_SCHEMA.md`
- **Rollback Plan**: Remove `output_schema=` arg and delete `output_schema.py`.

## 5. Open Questions / Decisions Needed
- None — app-owned allowlist is intentional for the demo.

---
