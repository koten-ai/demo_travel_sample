# Plan: Fix Empty Cards When LLM Returns Markdown

**Date**: 2026-07-09
**Task**: Restore destination cards for hotel searches that return markdown answers  
**Priority**: High  
**Estimated Effort**: 1 hour / 3 steps

## 1. Context & Requirements
- **Goal**: After a search like “Nearest hotels to Paris airports”, the cards grid shows structured hotel cards from `results` / `structured_answer`, not only a wall of markdown.
- **Constraints**: Keep existing `/api/search` shape (`answer`, `structured_answer`, `results`); no Zeus/LLM contract change required for the primary bug.
- **Assumptions**: Backend already parses markdown into `results` for travel-sample style lists.
- **Out of Scope**: Forcing the LLM to emit JSON-only answers; changing Zeus tools.

## 2. Analysis & Research
- Key files explored: `static/app.js`, `answer_parser.py`, `search.py`, chat logs
- Root cause: After search, `filterResults()` treated the natural-language query as a substring filter on card title/location/description. Queries like “Nearest hotels to Paris airports” never appear in hotel names, so every card was dropped and only `showSummary(data.answer)` (markdown) remained.
- Secondary gap: Flatten path did not map **Address** → `location` or pass **Price** / **URL**.
- Alternatives considered: Separate “filter results” input (heavier UX) vs stop applying agent query as local filter (chosen).

## 3. Step-by-Step Implementation Plan
1. **Fix frontend filter**  
   - Files: `src/travel_planner/static/app.js`  
   - Changes: Remove agent-query substring filter; keep type/budget/month/sort; show short summary instead of full markdown when cards exist; parse euro price ranges; use `address` for location.

2. **Improve markdown → card flatten**  
   - Files: `src/travel_planner/answer_parser.py`, `tests/test_answer_parser.py`  
   - Changes: Map address/price/url; skip generic section titles as location; add travel-sample fixture test.

3. **Document**  
   - Files: `.grok/guides/MARKDOWN_ANSWER_PARSER.md`, this plan  
   - Changes: Debugging table for “markdown only” symptom.

## 4. Verification & Rollback
- **Tests**: `pytest tests/test_answer_parser.py -q`
- **Review Checklist**:
  - [x] Code style/linting passes
  - [x] No breaking API changes
  - [x] Feature guide updated in `.grok/guides/MARKDOWN_ANSWER_PARSER.md`
- **Rollback Plan**: Revert the three source files above.

## 5. Open Questions / Decisions Needed
- None — fixed.

---
