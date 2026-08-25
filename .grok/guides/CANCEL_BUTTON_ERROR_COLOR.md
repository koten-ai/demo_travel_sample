# Guide: Red Cancel Button Color

**Date**: 2026-08-25
**Feature**: In-flight composer cancel button uses DaisyUI `btn-error` (red).
**Status**: Active
**Related Plan**: `.grok/plans/CANCEL_BUTTON_ERROR_COLOR.md`

## 1. Overview
- **Purpose**: Make the cancel/stop face visually distinct from send (primary blue → error red).
- **Scope**: Button color class while busy. Loader + stop markup and abort behavior are unchanged.
- **Entry points**: `setSearchBusy(true)` on `#search-btn`.

## 2. Architecture & Flow
- **High-level flow**:
  1. Idle: `#search-btn` has `btn-primary`.
  2. Busy: JS removes `btn-primary`, adds `btn-error` and `is-cancel`. Ring/stop use `currentColor` (error content).
  3. Idle restore: `btn-error` off, `btn-primary` on.
- **Key components**:
  - `src/travel_planner/static/app.js` — `setSearchBusy` class toggle
- **Data flow**: None.
- **Dependencies**: DaisyUI 4 `btn-error` (theme `--er`).

## 3. Setup
- **Prerequisites**: Travel planner UI.
- **Environment variables**: None.
- **Install / bootstrap steps**: None.
- **Configuration**: None (not `btn-warning`; amber was the rejected alternative).
- **Verification**: While a search is running, `#search-btn` has `btn-error` and not `btn-primary`.

## 4. How to Use
- **Primary workflow**: Send a search; the circle turns red; click to cancel; it returns to primary blue.
- **Edge cases**: None.
- **Limitations**: Color is the theme error token, not a custom hex.

## 5. Debugging & Known Issues
- **Common symptoms → causes → fixes**:
  | Symptom | Likely Cause | Fix |
  |---------|--------------|-----|
  | Stays blue while busy | Both `btn-primary` and `btn-error` present | Toggle with force flags so they are exclusive |
  | Amber instead of red | `btn-warning` applied | Use `btn-error` |
- **Debug checklist**:
  - [ ] Idle: `btn-primary`
  - [ ] Busy: `btn-error`
- **Known issues**: None.
- **Logging & observability**: N/A.

## 6. Related Artifacts
- **Files changed / owned by this feature**:
  - `src/travel_planner/static/app.js`
  - `tests/test_app.py`
  - `.grok/guides/SEND_BUTTON_AS_CANCEL.md`
  - `.grok/guides/TRAVEL_PLANNER.md`
- **Tickets**: none
- **Commits**: none yet
- **Pull requests**: none

## 7. Changelog
| Date | Author | Change |
|------|--------|--------|
| 2026-08-25 | Grok | In-flight cancel button uses `btn-error` |
