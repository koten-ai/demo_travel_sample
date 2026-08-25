# Plan: Loader and Stop in One Composer Button

**Date**: 2026-08-25
**Task**: Show a spinning loader and a cancel/stop control together inside the same circular send button.  
**Priority**: Medium  
**Estimated Effort**: 0.5 hours / 3 steps

## 1. Context & Requirements
- **Goal**: While `/api/search` is in flight, `#search-btn` stays one clickable button whose face is a stop square with a spinning ring around it (loader + cancel, not two controls).
- **Constraints**: DaisyUI `btn-circle`; keep AbortController cancel behavior; no second button or overlay.
- **Assumptions**: Compose volume mounts pick up template/CSS/JS without rebuild.
- **Out of Scope**: Determinate progress, server-side cancel, changing the idle search icon.

## 2. Analysis & Research
- Key files: `src/travel_planner/templates/index.html`, `src/travel_planner/static/app.css`, `src/travel_planner/static/app.js`, `.grok/guides/SEND_BUTTON_AS_CANCEL.md`
- Current: busy state swaps the search icon for a stop square only (`btn-neutral`); the old DaisyUI spinner was removed.
- DaisyUI `loading-spinner` as a sibling of the square can cover the center (mask-based). A CSS/SVG arc ring around a centered square is the ChatGPT-style pattern and stays one hit target.
- Risk: `hidden` vs `inline-flex` on the busy span → keep `hidden` as the only display toggle; size/layout in `app.css`.
- Alternative: two buttons (spinner + Cancel) — rejected; user asked for one button.

## 3. Step-by-Step Implementation Plan
1. **Markup** — `#search-btn-cancel` contains a ring SVG + stop square; keep `#search-btn` as the only control.
2. **CSS** — `.search-btn-busy` stacks ring + square; spin the arc; `prefers-reduced-motion` disables spin. Keep `btn-primary` while busy so it is the same button.
3. **JS/docs/tests** — toggle the combined busy face; drop `btn-neutral` swap; update guides and `tests/test_app.py`.

## 4. Verification & Rollback
- **Tests**: `pytest tests/test_app.py`; Node DOM sim still send → cancel → idle; live HTML has ring + stop inside `#search-btn`.
- **Review Checklist**:
  - [x] One `#search-btn`; no extra cancel control
  - [x] Click still aborts via `AbortController`
  - [x] Guides updated
- **Rollback Plan**: Restore stop-square-only markup and previous CSS.

## 5. Open Questions / Decisions Needed
- None — spinning incomplete ring + centered square, same primary circle.
