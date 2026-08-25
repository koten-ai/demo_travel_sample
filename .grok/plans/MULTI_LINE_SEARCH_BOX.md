# Plan: Multi-line Search Box

**Date**: 2026-08-25
**Task**: Replace the single-line hero search input with a larger multi-line prompt box.  
**Priority**: Medium  
**Estimated Effort**: 1 hour / 4 steps

## 1. Context & Requirements
- **Goal**: Users can type multi-line travel prompts in a taller chat-style box; Enter submits, Shift+Enter inserts a newline.
- **Constraints**: DaisyUI + Tailwind in `index.html`; keep existing `/api/search` JSON `{query}` contract (newlines in the query string are allowed).
- **Assumptions**: Flask debug + compose volume mounts pick up template/static changes without rebuild.
- **Out of Scope**: Chat history UI, changing the search API, mobile-only composer, markdown editor.

## 2. Analysis & Research
- Key files explored: `src/travel_planner/templates/index.html`, `src/travel_planner/static/app.css`, `src/travel_planner/static/app.js`, `.grok/guides/TRAVEL_PLANNER.md`, `tests/test_app.py`
- Potential risks/edge cases:
  - Enter currently does nothing useful in a textarea (does not submit) → handle Enter/Shift+Enter in JS; ignore IME composition.
  - Results header `"Results for \"{query}\""` would wrap badly with newlines → collapse whitespace for display only.
  - Fixed `h-[380px]` hero would clip a taller box → use `min-height` + vertical padding.
  - `#searchInput { width: 650px }` overflows small viewports → `width: 100%` with parent `max-w-2xl`.
- Alternatives considered: keep `<input>` and only increase height (cannot wrap); contenteditable div (overkill).

## 3. Step-by-Step Implementation Plan
1. **Template: textarea composer**  
   - Files to change: `src/travel_planner/templates/index.html`  
   - Changes: swap `#searchInput` to `<textarea rows="3">`; pin search button to bottom-right; grow hero; keyboard hint.  
   - Tests needed: index HTML contains `textarea#searchInput`

2. **CSS: taller auto-growing box**  
   - Files to change: `src/travel_planner/static/app.css`  
   - Changes: min/max height, `resize: none`, overflow, padding for the submit button.

3. **JS: autosize + keyboard submit**  
   - Files to change: `src/travel_planner/static/app.js`  
   - Changes: autosize on input; Enter submits, Shift+Enter newline; collapse query whitespace in results header; reset height on clear.

4. **Docs + tests**  
   - Files to change: `.grok/guides/TRAVEL_PLANNER.md`, `tests/test_app.py`  
   - Commands: `pytest tests/test_app.py`; curl localhost:5050

## 4. Verification & Rollback
- **Tests**: `pytest tests/test_app.py`; GET `/` contains textarea; type multi-line text (manual / curl HTML).
- **Review Checklist**:
  - [x] Code style/linting passes
  - [x] No breaking changes (`/api/search` still accepts a string query)
  - [x] Feature guide created or updated in `.grok/guides/TRAVEL_PLANNER.md`
- **Rollback Plan**: Revert the four files above to restore the single-line `<input>`.

## 5. Open Questions / Decisions Needed
- Enter-to-search vs always requiring the button — using chat convention (Enter search, Shift+Enter newline).
