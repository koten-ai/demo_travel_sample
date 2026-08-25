# Plan: Shrink Chat Box 20%

**Date**: 2026-08-25
**Task**: Make the hero search/chat box 20% smaller than its current size.  
**Priority**: Medium  
**Estimated Effort**: 0.5 hours / 2 steps

## 1. Context & Requirements
- **Goal**: Scale the composer to 80% of the current width and height caps (after the +60% width change).
- **Constraints**: Keep multi-line textarea, Enter/Shift+Enter, and fluid `width: 100%` on small viewports.
- **Assumptions**: “20% smaller” means linear scale of the current box (width max and min/max height), not only one axis.
- **Out of Scope**: Results grid, hero background, keyboard behavior.

## 2. Analysis & Research
- Key files: `src/travel_planner/static/app.css`, `src/travel_planner/static/app.js`, `src/travel_planner/templates/index.html`
- Current: `max-width: calc(42rem * 1.6)` (67.2rem / 1075px), `min-height: 11rem`, `max-height: 18rem`, JS cap 288px.
- Target: `calc(42rem * 1.6 * 0.8)` (53.76rem / 860px), min 8.8rem, max 14.4rem, JS cap 230px.
- Risk: shorter min-height may clip the mobile placeholder → verify and raise min-height only if needed.

## 3. Step-by-Step Implementation Plan
1. **Scale CSS/JS caps** — `app.css`, `app.js`
2. **Guide + visual check** — desktop ~860px; mobile no overflow/clip

## 4. Verification & Rollback
- **Tests**: Desktop/mobile screenshots; measure width ≈ 860px at ≥1100px viewport.
- **Review Checklist**:
  - [x] Desktop box ~20% smaller than 1075px (measured 860px × 141px)
  - [x] Mobile placeholder not clipped, no horizontal overflow
  - [x] Feature guide updated
- **Rollback Plan**: Restore `calc(42rem * 1.6)`, `11rem` / `18rem`, JS `288`.

## 5. Open Questions / Decisions Needed
- None.
