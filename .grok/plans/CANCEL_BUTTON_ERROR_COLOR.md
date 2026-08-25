# Plan: Red Cancel Button Color

**Date**: 2026-08-25
**Task**: While a search is in flight, color the composer cancel button red (DaisyUI `btn-error`).  
**Priority**: Low  
**Estimated Effort**: 0.25 hours / 2 steps

## 1. Context & Requirements
- **Goal**: The in-flight cancel face of `#search-btn` is clearly not the send control — red `btn-error` (DaisyUI error, not amber `btn-warning`).
- **Constraints**: Same circular `#search-btn`; idle state stays `btn-primary`; loader ring + stop square unchanged.
- **Assumptions**: DaisyUI 4 light theme `btn-error` is red with light content (`currentColor` on the ring/square).
- **Out of Scope**: Changing idle search color; `btn-warning` amber.

## 2. Analysis & Research
- Key files: `src/travel_planner/static/app.js`, `src/travel_planner/templates/index.html`, `.grok/guides/SEND_BUTTON_AS_CANCEL.md`
- Current: `setSearchBusy` toggles `is-cancel` but leaves `btn-primary`.
- DaisyUI `btn-error` = red; `btn-warning` = amber. Cancel/stop maps to error/red.

## 3. Step-by-Step Implementation Plan
1. **JS** — `setSearchBusy`: `btn-error` when busy, `btn-primary` when idle (mutually exclusive).
2. **Docs/tests** — guides + any assertions that the button stays primary while busy.

## 4. Verification & Rollback
- **Tests**: `pytest tests/test_app.py`; Node sim: busy → `btn-error`, idle → `btn-primary`.
- **Review Checklist**:
  - [x] Idle button is still primary
  - [x] Busy button is `btn-error`, still one `#search-btn`
  - [x] Guides updated
- **Rollback Plan**: Remove `btn-error` toggle; keep `btn-primary` always.

## 5. Open Questions / Decisions Needed
- None — using `btn-error` (red) rather than `btn-warning` (amber).
