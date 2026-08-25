# Plan: Widen Chat Box 60%

**Date**: 2026-08-25
**Task**: Make the hero search/chat box 60% wider than the current `max-w-2xl` (42rem) cap.  
**Priority**: Medium  
**Estimated Effort**: 0.5 hours / 2 steps

## 1. Context & Requirements
- **Goal**: Chat box max width becomes `42rem * 1.6 = 67.2rem` (~1075px); still `width: 100%` on smaller viewports.
- **Constraints**: DaisyUI hero-content currently `max-w-3xl` (48rem) would clip a wider box and must be raised.
- **Assumptions**: “Chat box area” is the white `#searchInput` composer, not the results grid.
- **Out of Scope**: Height changes, results layout, mobile-only breakpoints beyond fluid 100% width.

## 2. Analysis & Research
- Key files explored: `src/travel_planner/templates/index.html`, `src/travel_planner/static/app.css`
- Potential risks/edge cases:
  - Parent `hero-content max-w-3xl` clips the box → raise hero max-width to at least `max-w-6xl` (72rem).
  - Narrow phones: keep `width: 100%` so +60% does not overflow.
- Alternatives considered: Tailwind `max-w-[67.2rem]` only on the inner wrap (still clipped by hero-content).

## 3. Step-by-Step Implementation Plan
1. **Widen composer + hero**  
   - Files: `index.html`, `app.css`  
   - Changes: `.search-box { max-width: calc(42rem * 1.6) }`; hero-content `max-w-6xl`.
2. **Docs + visual check**  
   - Guide changelog; desktop/mobile screenshots measuring box width ≈ 1075px at 1280px+.

## 4. Verification & Rollback
- **Tests**: GET `/` still renders textarea; measure composer width in browser.
- **Review Checklist**:
  - [x] No overflow on ~390px mobile
  - [x] Desktop box ~60% wider than 42rem (measured 1075px)
  - [x] Feature guide updated
- **Rollback Plan**: Restore `max-w-2xl` / `max-w-3xl`.

## 5. Open Questions / Decisions Needed
- None — 60% applied to the previous `max-w-2xl` chat-box cap.
