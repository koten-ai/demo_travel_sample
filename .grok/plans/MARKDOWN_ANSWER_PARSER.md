# Plan: Markdown Answer Parser

**Date**: 2026-07-01
**Task**: Parse Zeus agent markdown answers into structured JSON for API and UI consumption
**Priority**: Medium
**Estimated Effort**: 4 steps

## 1. Context & Requirements

- **Goal**: When Zeus tool calls return no rows, extract airports/hotels (or generic items) from the LLM `answer` markdown and expose as `structured_answer` JSON plus flat `results` cards.
- **Constraints**: Stdlib-only parsing; must not break existing `extract_destinations()` path; tests required.
- **Assumptions**: LLM answers follow `###` sections, numbered items, and `- **Field**:` bullets (or embed JSON fences).
- **Out of Scope**: Prompt changes, frontend card layout changes, LLM re-extraction pass.

## 2. Analysis & Research

- Key files explored: `services/results_parser.py`, `services/search.py`, `static/app.js`, `tests/test_results_parser.py`
- Potential risks/edge cases:
  - Inline markdown without newlines → Mitigated via `_normalize_markdown()` boundary insertion
  - Varied section formats → Airport heuristic + generic `sections` / `items` fallback
- Alternatives considered: LLM post-processing (rejected: extra latency/cost); prompt-only JSON (rejected: not reliable alone)

## 3. Step-by-Step Implementation Plan

1. **Add `services/answer_parser.py`**
   - Files to change: `services/answer_parser.py`
   - Changes: `parse_markdown_answer()`, `structured_answer_to_results()`
   - Tests needed: [x]

2. **Wire into search API**
   - Files to change: `services/search.py`
   - Changes: Populate `structured_answer`; fallback `results` from structured data
   - Tests needed: [x] (via parser tests)

3. **Unit tests**
   - Files to change: `tests/test_answer_parser.py`
   - Changes: Paris airports fixture, JSON fence, empty input cases
   - Tests needed: [x]

4. **Documentation**
   - Files to change: `.grok/guides/MARKDOWN_ANSWER_PARSER.md`, `.grok/guides/TRAVEL_PLANNER.md`
   - Tests needed: [ ]

## 4. Verification & Rollback

- **Tests**: `python -m pytest tests/test_answer_parser.py tests/test_results_parser.py -v`
- **Review Checklist**:
  - [x] Code style/linting passes
  - [x] No breaking changes to `/api/search` shape (additive `structured_answer` field)
  - [x] Feature guide created at `.grok/guides/MARKDOWN_ANSWER_PARSER.md`
- **Rollback Plan**: Remove `services/answer_parser.py`, revert `services/search.py` imports and response fields

## 5. Open Questions / Decisions Needed

- None — heuristic parser accepted for v1; prompt tuning can follow if parse rate is low.