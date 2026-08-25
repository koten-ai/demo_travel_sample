# Plan: Send Button Becomes Cancel While In Flight

**Date**: 2026-08-25
**Task**: While a chat search is running, turn the composer send button into a cancel control that aborts the request.  
**Priority**: Medium  
**Estimated Effort**: 1 hour / 4 steps

## 1. Context & Requirements
- **Goal**: After the user sends a search, the circular composer button shows a cancel/stop affordance and stays clickable; clicking it aborts the in-flight `/api/search` fetch and restores the send icon. Abort is silent (no error toast).
- **Constraints**: DaisyUI + Tailwind in `index.html`; existing `/api/search` JSON `{query, chat_id}` contract; Flask debug + compose volume mounts pick up template/static changes without rebuild.
- **Assumptions**: Client-side `AbortController` is enough for this UX. Disconnecting the browser request does not need to cancel the Zeus agent turn on the server.
- **Out of Scope**: Server-side turn cancellation, streaming stop-tokens, changing the idle search icon, chat history UI.

## 2. Analysis & Research
- Key files explored: `src/travel_planner/templates/index.html`, `src/travel_planner/static/app.js`, `src/travel_planner/static/app.css`, `src/travel_planner/app.py`, `.grok/guides/TRAVEL_PLANNER.md`, `tests/test_app.py`
- Current behavior: `setLoading(true)` disables `#search-btn` and `#searchInput`, swaps the search icon for a spinner. `fetch("/api/search")` has no abort signal, so the user cannot stop a long Zeus turn.
- Potential risks/edge cases:
  - Form `submit` while busy would start a second search → treat busy-clicks as cancel, not send.
  - Abort then immediately send: `finally` from the aborted fetch must not clear the new request’s busy state → only reset if `searchController` is still this generation’s controller.
  - `AbortError` must not call `showError` (looks like a failure).
  - Enter-to-search while busy: ignore (textarea is disabled anyway).
- Alternatives considered: keep spinner and add a separate Cancel link (extra chrome); server cancel endpoint (no Zeus cancel API wired). Client abort + icon swap matches chat composers.

## 3. Step-by-Step Implementation Plan
1. **Template: cancel icon in the same button**  
   - Files to change: `src/travel_planner/templates/index.html`  
   - Changes: replace `#search-btn-spinner` with `#search-btn-cancel` (stop square); keep `#search-btn` as `type="submit"`.  
   - Tests needed: index HTML contains `id="search-btn-cancel"` and no spinner.

2. **JS: busy = cancel mode + AbortController**  
   - Files to change: `src/travel_planner/static/app.js`  
   - Changes: `searchController`; `setSearchBusy` swaps icons, `aria-label`, optional error styling, disables textarea only; `performSearch` passes `signal`; catch `AbortError` silently; submit while busy calls `abort()`.  
   - Tests needed: app.js contains `AbortController` and `"Cancel search"`.

3. **CSS (minimal)**  
   - Files to change: `src/travel_planner/static/app.css` only if the stop icon needs sizing; otherwise skip.

4. **Docs + tests**  
   - Files to change: `.grok/guides/TRAVEL_PLANNER.md`, `tests/test_app.py`  
   - Commands: `pytest tests/test_app.py`; curl `/` for cancel markup.

## 4. Verification & Rollback
- **Tests**: `pytest tests/test_app.py` (7 passed); GET `/` contains cancel icon id; Node DOM simulation: send → cancel icon → abort → idle → send again.
- **Review Checklist**:
  - [x] Code style/linting passes
  - [x] No breaking changes (`/api/search` contract unchanged)
  - [x] Feature guide created or updated in `.grok/guides/TRAVEL_PLANNER.md` and `.grok/guides/SEND_BUTTON_AS_CANCEL.md`
- **Rollback Plan**: Restore spinner + `btn.disabled = busy` in `setLoading`; drop `AbortController`.

## 5. Open Questions / Decisions Needed
- None — using a stop-square icon (chat convention) with `aria-label="Cancel search"`, not a text “Cancel” label (the control is `btn-circle`).
