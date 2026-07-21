# Guide: Demo Output Schema (Cleaner zeus_data)

**Date**: 2026-07-09
**Feature**: App-owned `output_schema` so structured agent rows match travel cards
**Status**: Active
**Related Plan**: `.grok/plans/DEMO_OUTPUT_SCHEMA.md`

## 1. Overview
- **Purpose**: Constrain `structured.zeus_data` to card-relevant travel fields (`name`, `description`, `image*`, location, etc.) instead of full Hotel/Destination documents or MINI-SCHEMA dump.
- **Scope**: Client-side filtering after the agent turn. Does not change Zeus tool HTTP payloads the LLM sees.
- **Entry points**:
  - `travel_planner.output_schema.DEMO_OUTPUT_SCHEMA`
  - `travel_planner.search._search_async` → `run_agent(..., output_schema=DEMO_OUTPUT_SCHEMA)`
  - Downstream: `zeus_data_to_results(structured.zeus_data)`

## 2. Architecture & Flow
- **High-level flow**:
  1. User search → `run_search` / `_search_async`
  2. `run_agent(..., structured=True, output_schema=DEMO_OUTPUT_SCHEMA)`
  3. Client extracts last successful data-tool rows and filters keys per entity type
  4. App maps filtered rows → UI cards via `zeus_data_to_results`
- **Key components**:
  - `src/travel_planner/output_schema.py` — allowlist for Hotel / Destination / Airport
  - `src/travel_planner/search.py` — passes schema into the agent
  - `src/travel_planner/results_parser.py` — normalizes rows to card fields; unwraps JSON hotel blobs in `description`
  - `zeus_client.agent.response.extract_structured_response` — applies allowlist
- **Data flow**: tool result rows → allowlist filter → `zeus_data` → destination cards
- **Dependencies**: `kotenai-zeus-client` with `structured=True` + `output_schema` support

### Allowlist precedence (client)
1. `output_schema` argument (this demo) — **wins**
2. `guidance.injections.output_schema` in chat_request
3. Live MINI-SCHEMA from scope brief

Reserved always kept: `id`, `doc_key`, `entity_type`.

## 3. Setup
- **Prerequisites**: None beyond normal app install.
- **Environment variables**: None new.
- **Verification**:
  ```bash
  pytest tests/test_output_schema.py -q
  ```

## 4. How to Use
- **Primary workflow**: automatic on every search; no UI toggle.
- **Extend the schema** (e.g. keep `rating`):
  1. Edit `DEMO_OUTPUT_SCHEMA` in `src/travel_planner/output_schema.py`
  2. Update card mapping in `results_parser.py` if the UI should show the new field
  3. Add/adjust tests in `tests/test_output_schema.py`
- **Edge cases**:
  - Entity type missing from schema → empty `zeus_data` for that type; app falls back to `extract_destinations(trace)` then answer parser
  - Extra backend keys (`hotel_details`, `job_fingerprint`, `meta`, `status`) are dropped; client may still log `[WARN] zeus_data: dropped unknown field …` — expected soft noise, not a contract failure
- **Limitations**: Schema does not slim tool results sent to the LLM mid-loop; only final structured `zeus_data`.

## 5. Debugging & Known Issues
| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Empty `zeus_data` but tools returned rows | Entity type not in `DEMO_OUTPUT_SCHEMA` | Add the entity type + fields |
| `[WARN] zeus_data: entity_type unknown; cannot resolve MINI-SCHEMA fields` and `zeus_data=0` while `results>0` | Last data tool was `get` (args: `ids`/`include` only) so schema filter could not pick an allowlist | Fixed in `zeus_client` ≥ local editable: infer `entity_type` from prior `find`/`search`, row `entity_type`, then decomposition. Rebuild/restart app so it loads the updated client |
| Cards missing image/description | Field name not on allowlist | Add synonym to `DEMO_OUTPUT_SCHEMA` (and `results_parser` keys if needed) |
| Card description is a JSON blob (`{"address":...}`) | Full hotel doc stuffed into `description` as string/object | `results_parser` unwraps blob → prose + address/price/url; hard-refresh UI |
| Still see dropped-field WARNs | Backend rows include non-allowlisted keys | Expected; ignore or tighten `project` fields in prompts |
| Schema ignored | Old client without `output_schema` | Upgrade `kotenai-zeus-client` |

### Why `find` → `get` used to wipe `zeus_data`
Agent turns often end with **`get`** after **`find`** (hydrate full docs by node id). Structured extraction uses the **last** successful data tool with rows. `get` does not take `entity_type`, so older clients left `entity_type=None`. With multi-key `DEMO_OUTPUT_SCHEMA` (Hotel / Destination / Airport), the single-entity override fallback does not apply, MINI-SCHEMA cannot resolve fields, allowlist is empty, and **`zeus_data` is cleared**. UI cards may still appear via markdown / `extract_destinations` fallback (`results=N` but `zeus_data=0` in logs).

- **Debug checklist**:
  - [ ] Confirm `search.py` passes `output_schema=DEMO_OUTPUT_SCHEMA`
  - [ ] Inspect `structured_response.zeus_data`, `.entity_type`, `.source_tool`, and `.warnings` on API response
  - [ ] If `source_tool=get` and `entity_type` is set, allowlist resolution should succeed
  - [ ] Run `pytest tests/test_output_schema.py`
  - [ ] In sibling client: `pytest tests/test_agent_response.py` (includes find→get inheritance)

## 6. Related Artifacts
- **Files changed / owned by this feature**:
  - `src/travel_planner/output_schema.py` — allowlist definition
  - `src/travel_planner/search.py` — wire into `run_agent`
  - `tests/test_output_schema.py` — schema + filter tests
  - `.grok/plans/DEMO_OUTPUT_SCHEMA.md` — plan
- **Tickets**: none
- **Commits**: pending

## 7. Changelog
| Date | Author | Change |
|------|--------|--------|
| 2026-07-09 | agent | Unwrap JSON hotel docs from `description`; keep price/url/address on cards |
| 2026-07-09 | agent | Document `entity_type unknown` on find→get; client now infers entity_type from prior tools / rows |
| 2026-07-09 | agent | Initial guide: demo output_schema for cleaner zeus_data |
