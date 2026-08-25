# Guide: Send Button Becomes Cancel While In Flight

**Date**: 2026-08-25
**Feature**: While a travel search is running, the composer send button becomes a cancel/stop control that aborts the browser request.
**Status**: Active
**Related Plan**: `.grok/plans/SEND_BUTTON_AS_CANCEL.md`

## 1. Overview
- **Purpose**: Let users stop a long Zeus search without waiting for `/api/search` to finish, using the same circular control that sent the query.
- **Scope**: Client-side button state, `AbortController` on `fetch("/api/search")`. Does not cancel the Zeus agent turn on the server.
- **Entry points**: `#search-form` submit, `#search-btn` click, Enter in `#searchInput`.

## 2. Architecture & Flow
- **High-level flow**:
  1. Idle: `#search-btn` is primary with the search icon (`#search-btn-icon`), `aria-label="Search"`.
  2. User submits a non-empty query → `performSearch()` creates an `AbortController`, sets `searchController`, calls `setSearchBusy(true)`.
  3. Busy: textarea disabled; search icon hidden; `#search-btn-cancel` shows a spinning ring around a stop square in the same `#search-btn`. The button swaps `btn-primary` for DaisyUI `btn-error` (red) and `aria-label="Cancel search"`.
  4. Click/submit while busy → `cancelSearch()` aborts the fetch, immediately restores idle UI. `AbortError` is ignored (no error alert).
  5. On success or non-abort failure, `finally` clears busy state only if this request still owns `searchController`.
- **Key components**:
  - `src/travel_planner/templates/index.html` — `#search-btn-icon` / `#search-btn-cancel` (ring + stop)
  - `src/travel_planner/static/app.css` — `.search-btn-busy` layout and spin
  - `src/travel_planner/static/app.js` — `setSearchBusy`, `cancelSearch`, `performSearch` signal
- **Data flow**: Unchanged JSON `{query, chat_id}` to `POST /api/search`; abort only affects the browser.
- **Dependencies**: Browser `fetch` + `AbortController`.

## 3. Setup
- **Prerequisites**: Same as the travel planner app (see `.grok/guides/TRAVEL_PLANNER.md`).
- **Environment variables**: None new.
- **Install / bootstrap steps**: None; static/template volume mounts pick up the change.
- **Configuration**: None.
- **Verification**: `GET /` HTML includes `id="search-btn-cancel"`, `search-btn-ring`, and `search-btn-stop`.

## 4. How to Use
- **Primary workflow**:
  1. Enter a query and press Enter or the search button.
  2. The same circular button turns red (`btn-error`) and shows a spinning loader ring around a stop square.
  3. Click that button to cancel; the composer unlocks and no error toast appears.
- **Examples**: N/A (UI-only).
- **Edge cases**: A second click after cancel sends a new search (state is cleared immediately on abort, not only in `finally`). Enter is ignored while busy because the textarea is disabled.
- **Limitations**: Server-side Zeus `run_turn` may continue after abort; the UI never applies that response.

## 5. Debugging & Known Issues
- **Common symptoms → causes → fixes**:
  | Symptom | Likely Cause | Fix |
  |---------|--------------|-----|
  | Button stays a spinner | Stale cached `index.html` / `app.js` | Hard-refresh; confirm volume mount |
  | Error alert after cancel | `AbortError` treated as failure | `catch` must ignore `err.name === "AbortError"` |
  | Results appear after cancel | Response applied despite abort | Do not process `res` after abort; `finally` must not reuse aborted data |
- **Debug checklist**:
  - [ ] `#search-btn` `aria-label` is `Cancel search` during fetch
  - [ ] `#search-form` `aria-busy="true"` during fetch
  - [ ] DevTools Network: request status `(canceled)` after stop
- **Known issues**:
  - **Server work continues** — abort is client-only; no Zeus cancel API.
- **Logging & observability**: Browser Network panel; Flask still logs the in-flight `run_search` if the worker continues.

## 6. Related Artifacts
- **Files changed / owned by this feature**:
  - `src/travel_planner/templates/index.html` — busy face: ring + stop inside `#search-btn`
  - `src/travel_planner/static/app.css` — `.search-btn-busy` stack and spin
  - `src/travel_planner/static/app.js` — abort + busy UI
  - `tests/test_app.py` — markup and script wiring assertions
  - `.grok/guides/TRAVEL_PLANNER.md` — composer workflow note
- **Tickets**: none
- **Commits**: none yet
- **Pull requests**: none

## 7. Changelog
| Date | Author | Change |
|------|--------|--------|
| 2026-08-25 | Grok | Initial guide: send button becomes cancel while search is in flight |
| 2026-08-25 | Grok | Loader ring and stop square share one `#search-btn` |
| 2026-08-25 | Grok | In-flight cancel face uses DaisyUI `btn-error` (red) |
