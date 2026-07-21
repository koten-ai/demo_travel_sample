# Guide: Markdown Answer Parser

**Date**: 2026-07-01
**Feature**: Parse structured markdown LLM answers into JSON when Zeus tool results are unavailable
**Status**: Active
**Related Plan**: `.grok/plans/MARKDOWN_ANSWER_PARSER.md`

## 1. Overview

- **Purpose**: Convert free-form markdown `answer` text from the Zeus agent loop into structured JSON so the API and UI can render destination/hotel cards even when the graph connection is down and no `trace.tool_calls` rows are returned.
- **Scope**: Markdown parsing, optional JSON fence passthrough, flattening to result cards. Does not change LLM prompts or Zeus tool extraction.
- **Entry points**: `services.answer_parser.parse_markdown_answer()`, `services.answer_parser.structured_answer_to_results()`, `POST /api/search` response field `structured_answer`

## 2. Architecture & Flow

- **High-level flow**:
  1. `run_agent()` returns `(answer, trace, ...)`.
  2. `extract_destinations(trace)` pulls rows from Zeus `tool_calls` (primary path).
  3. `parse_markdown_answer(answer)` parses markdown when the LLM wrote prose instead of invoking tools.
  4. If step 2 yields no cards but step 3 succeeds, `structured_answer_to_results()` fills `results` for the frontend.
  5. API returns both `answer` (raw markdown), `structured_answer` (JSON), and `results` (flat cards).

- **Sequence**:

```mermaid
flowchart TD
    A[run_agent] --> B[answer + trace]
    B --> C[extract_destinations trace]
    B --> D[parse_markdown_answer answer]
    C --> E{results empty?}
    E -->|yes| F[structured_answer_to_results]
    E -->|no| G[keep Zeus rows]
    D --> F
    F --> H[/api/search response]
    G --> H
```

- **Key components**:
  - `services/answer_parser.py` — Markdown-to-JSON parser and flatten helper
  - `services/results_parser.py` — Zeus trace row extraction (existing)
  - `services/search.py` — Orchestrates both parsers on each search

- **Data flow**:
  - **Input**: Markdown string with `###` sections, numbered `1. **Name**` items, and `- **Field**: value` bullets; or a fenced ` ```json ` block
  - **Output**: `structured_answer` dict; optional flat `results` list with `name`, `description`, `image`, `location`

- **Dependencies**: Python `re`, `json` (stdlib only)

## 3. Setup

- **Prerequisites**: None beyond the travel planner app itself
- **Environment variables**: None
- **Install / bootstrap**: Included automatically — no extra steps
- **Configuration**: No config knobs; parser heuristics are code-defined
- **Verification**:
  ```powershell
  cd demo_travel_sample
  python -m pytest tests/test_answer_parser.py -v
  ```

## 4. How to Use

- **Primary workflow**:
  1. Call `POST /api/search` with a natural-language query.
  2. Inspect `structured_answer` in the JSON response when Zeus tools return no rows.
  3. Use `results` for card rendering (populated from Zeus rows or flattened structured answer).

- **Supported markdown patterns**:

  | Pattern | Example | Maps to |
  |---------|---------|---------|
  | `###` section header | `### **Charles de Gaulle (CDG) – Terminal-area hotels**` | `airports[].name` + `section` |
  | Numbered item | `1. **Hôtel ibis Paris CDG Airport**` | `hotels[].name` or `items[].name` |
  | Bullet field | `- **Location**: Directly connected to Terminal 1` | `location` (and other known fields) |
  | Tip | `**Tip**: For the absolute closest stay...` | `tip` |
  | Intro before first `###` | Zeus-unavailable preamble | `context` |
  | Closing question | `Would you like me to refine...?` | `follow_up` |
  | Fenced JSON | ` ```json { "airports": [...] } ``` ` | Returned as-is |

- **Example response shape** (Paris airports):

```json
{
  "structured_answer": {
    "airports": [
      {
        "name": "Charles de Gaulle (CDG)",
        "section": "Terminal-area hotels",
        "hotels": [
          {
            "name": "Hôtel ibis Paris CDG Airport",
            "location": "Directly connected to Terminal 1 & 3 via covered walkway",
            "description": "Budget-friendly 3-star with 24-hour shuttle...",
            "image": "Typical modern airport-hotel exterior with blue ibis signage."
          }
        ]
      }
    ],
    "tip": "For the absolute closest stay...",
    "context": "Nearest hotels to Paris airports... Zeus graph connection is currently unavailable...",
    "follow_up": "Would you like me to refine this list...?"
  },
  "results": [
    {
      "name": "Hôtel ibis Paris CDG Airport",
      "description": "Budget-friendly 3-star...",
      "image": "Typical modern airport-hotel exterior...",
      "location": "Directly connected to Terminal 1 & 3 via covered walkway"
    }
  ]
}
```

- **Edge cases**:
  - Sections without airport keywords use `sections[].items` instead of `airports[].hotels`
  - Numbered lists without `###` headers produce a top-level `items` array
  - Embedded ` ```json ` blocks bypass markdown parsing entirely
  - Travel-sample style lists (`### Top matching hotels` + **Address** / **Price** / **URL**) flatten correctly; `address` becomes card `location`

- **Limitations**:
  - Heuristic parser — unusual markdown layouts may return `structured_answer: null`
  - `image` fields are text descriptions, not URLs, when the LLM provides prose
  - Zeus tool rows always take precedence; markdown flattening only runs when `results` is empty
  - The raw `answer` field is still markdown prose for humans/debug; cards use `results` / `structured_answer`

## 5. Debugging & Known Issues

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| `structured_answer` is `null` | Answer is plain prose without sections/lists | Check raw `answer`; adjust LLM output format or add JSON fence |
| `results` empty but `structured_answer` populated | Zeus rows present but empty; flatten skipped | Expected when Zeus returns rows; inspect `trace.tool_calls` |
| Wrong section grouping | Header missing `###` or inline formatting | Parser normalizes inline `###` / numbered items; verify source text |
| Missing `tip` / `follow_up` | Labels differ from `**Tip**:` or no closing `?` | Align LLM output to supported patterns |
| API has `results` but UI shows only markdown | Client re-filtered cards by full NL query | Fixed in `static/app.js`: local filters no longer substring-match the agent query |
| Cards show section title as location | Only **Address** fields present, not **Location** | Flatten maps `address` → `location`; skips generic "Top matching hotels" headers |

- **Debug checklist**:
  - [ ] Read `answer` field in `/api/search` response (raw markdown — always present)
  - [ ] Confirm `results` array is non-empty for card UI
  - [ ] Confirm `structured_answer` is non-null via pytest fixture in `tests/test_answer_parser.py`
  - [ ] Inspect Zeus trace panel for tool call rows vs prose-only fallback

- **Known issues**: None open

- **Logging**: `search complete ... structured=True/False` logged in `search.py`

## 6. Related Artifacts

- **Files changed / owned by this feature**:
  - `src/travel_planner/answer_parser.py` — Parser and flatten logic
  - `src/travel_planner/search.py` — Wires parser into search response
  - `src/travel_planner/static/app.js` — Cards from `results`; summary not full markdown wall
  - `tests/test_answer_parser.py` — Unit tests (Paris airports + travel-sample list)

- **Tickets**: None

- **Commits**: Pending initial commit

- **Pull requests**: None

## 7. Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-07-09 | Agent | Map Address/Price/URL into cards; fix UI filter that hid results after NL search |
| 2026-07-01 | Agent | Initial markdown answer parser, API wiring, and guide |