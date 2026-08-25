# Guide: Loader and Stop in One Composer Button

**Date**: 2026-08-25
**Feature**: The in-flight search control is a single circular button: spinning loader ring around a stop square.
**Status**: Active
**Related Plan**: `.grok/plans/COMBINE_LOADER_AND_STOP.md`

## 1. Overview
- **Purpose**: Show that a search is running and that the user can cancel it, without a second control.
- **Scope**: Visual busy-face of `#search-btn`. Cancel behavior is still `AbortController` (see `.grok/guides/SEND_BUTTON_AS_CANCEL.md`).
- **Entry points**: `#search-btn` while `aria-busy` on `#search-form`.

## 2. Architecture & Flow
- **High-level flow**:
  1. Idle: `#search-btn-icon` (magnifier) visible; `#search-btn-cancel` has class `hidden`.
  2. Busy: icon hidden; `#search-btn-cancel.search-btn-busy` shown — SVG ring spins, `.search-btn-stop` stays centered; `#search-btn` uses `btn-error` instead of `btn-primary`.
  3. Click still submits the form, which calls `cancelSearch()`.
- **Key components**:
  - `src/travel_planner/templates/index.html` — ring + stop markup inside `#search-btn`
  - `src/travel_planner/static/app.css` — `.search-btn-busy`, `.search-btn-ring`, `@keyframes search-btn-spin`
  - `src/travel_planner/static/app.js` — `setSearchBusy` toggles `hidden` on icon vs busy face
- **Data flow**: Unchanged.
- **Dependencies**: CSS animation; `prefers-reduced-motion` disables the spin.

## 3. Setup
- **Prerequisites**: Travel planner app running.
- **Environment variables**: None.
- **Install / bootstrap steps**: None (static/template mounts).
- **Configuration**: None.
- **Verification**: Busy markup contains both `search-btn-ring` and `search-btn-stop` inside `#search-btn`.

## 4. How to Use
- **Primary workflow**:
  1. Send a search.
  2. The same primary circle shows a loader around a stop square.
  3. Click it to cancel.
- **Edge cases**: Reduced-motion users still see the ring and square, without rotation.
- **Limitations**: Indeterminate spinner only (no percent complete).

## 5. Debugging & Known Issues
- **Common symptoms → causes → fixes**:
  | Symptom | Likely Cause | Fix |
  |---------|--------------|-----|
  | Ring never hides | `.search-btn-busy { display: inline-flex }` beating Tailwind `hidden` | Keep `.search-btn-busy.hidden { display: none }` |
  | Square missing | `.search-btn-stop` not in template | Restore the span inside `#search-btn-cancel` |
- **Debug checklist**:
  - [ ] Only one `id="search-btn"`
  - [ ] Busy face is a child of that button, not a sibling
- **Known issues**: None.
- **Logging & observability**: N/A (CSS).

## 6. Related Artifacts
- **Files changed / owned by this feature**:
  - `src/travel_planner/templates/index.html`
  - `src/travel_planner/static/app.css`
  - `src/travel_planner/static/app.js`
  - `tests/test_app.py`
  - `.grok/guides/SEND_BUTTON_AS_CANCEL.md`
- **Tickets**: none
- **Commits**: none yet
- **Pull requests**: none

## 7. Changelog
| Date | Author | Change |
|------|--------|--------|
| 2026-08-25 | Grok | Combined spinner ring and stop square in `#search-btn` |
