# Plan: Fix Zeus Client 2.4 Minor Gaps

**Date**: 2026-09-15
**Task**: Close documentation and API-hygiene gaps after aligning TravelPlan to kotenai-zeus-client 2.4.0.
**Priority**: Medium
**Estimated Effort**: 1 hour / 4 steps

## 1. Context & Requirements
- **Goal**: No private loader imports for semantic cache; Active guides report 2.4.0 / 2.4.x; editable install metadata matches imported `__version__`.
- **Constraints**: Keep nested TravelPlan `config.json` adapter; do not switch to `ZeusRuntime.from_config` (shape mismatch). CDN trace widget stays intentional.
- **Assumptions**: Sibling `../zeus_client_python` source is 2.4.0; live `/api/health` already reports 2.4.0.
- **Out of Scope**: Rewriting historical `.grok/plans/*` that document the 2.3 cutover; changing sibling demo-builder TRACE_PANEL.md; PyPI publish.

## 2. Analysis & Research
- Key files explored: `runtime_factory.py`, `.grok/guides/ZEUS_CLIENT_*.md`, `TRAVEL_PLANNER.md`, `SemanticCacheConfig` public export
- Potential risks/edge cases:
  - Nested semantic_cache knobs beyond `enabled` → Mitigation: TravelPlan example only sets `enabled`; map that via public `SemanticCacheConfig`
  - Stale guides confuse operators → Mitigation: update Active guides + changelog rows
- Alternatives considered: `config_from_mapping` for cache block (rejected; user chose direct `SemanticCacheConfig`)

## 3. Step-by-Step Implementation Plan
1. **Public semantic_cache mapping** — `runtime_factory.py`
2. **Refresh Active guides** — 2.3 → 2.4 pins
3. **Reinstall editable client** — fix dist metadata 2.3.0 → 2.4.0
4. **Verify** — pytest + `/api/health`

## 4. Verification & Rollback
- **Tests**: `pytest tests/test_runtime_factory.py tests/test_app.py`
- **Review Checklist**:
  - [x] No `_parse_semantic_cache` import
  - [x] Guides say 2.4.0 / 2.4.x where they describe current pin
  - [x] Feature guides updated (ZEUS_CLIENT_*, TRAVEL_PLANNER, DEMO_OUTPUT_SCHEMA, DEBUG_QUERY_REWIND, PIPELINE_XML)
  - [x] Guide: `.grok/guides/ZEUS_CLIENT_V2_BFF.md` / `ZEUS_CLIENT_INTEGRATION.md`
- **Rollback Plan**: Revert commits / restore `_parse_semantic_cache` import

## 5. Open Questions / Decisions Needed
- None — user chose public `SemanticCacheConfig` mapping.

## 6. Done notes
- Editable install metadata now reports `kotenai-zeus-client` **2.4.0** (was stale 2.3.0).
- `pytest tests/test_runtime_factory.py tests/test_app.py` → 20 passed.
- Live `GET /api/health` → `zeus_client_version: 2.4.0`, `pipeline_envelope_recovery: true`.
- Historical changelog rows and `.grok/plans/IMPLEMENT_ZEUS_CLIENT_PYTHON_V2_3_0.md` left as history.
