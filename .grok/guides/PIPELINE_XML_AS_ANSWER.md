# Guide: Recover Fenced Pipeline XML as a Tool Call

**Date**: 2026-08-25
**Feature**: When the LLM writes a terminating `<pipeline>` as fenced HTML/XML instead of a native tool call, the agent loop executes it and the UI peels the summary. TravelPlan maps `data.hotel_rows` onto cards.
**Status**: Active
**Related Plan**: `.grok/plans/FIX_PIPELINE_XML_AS_ANSWER.md`

## 1. Overview
- **Purpose**: Analytics catalogs tell the model “emit tool call or ONE pipeline directly.” Grok sometimes dumps that plan as ````html <pipeline>…```` with zero hops. The client recovers that envelope as a `pipeline` tool call; TravelPlan maps hotel/airport rows onto cards.
- **Scope**: Client agent loop + Layer A peel; TravelPlan analytics prompt, Docker sibling-client install, and card mapping. Does not re-author BASE catalogs or expose `rt.data.pipeline`.
- **Entry points**:
  - `rt.agent.run_turn` (analytics or any catalog that includes the `pipeline` verb)
  - `POST /api/search` in `default_mode=analytics`

## 2. Architecture & Flow
- **High-level flow**:
  1. LLM round returns content, `tool_calls=[]`.
  2. `parse_pipeline_envelope` looks for `<pipeline>` with a JSON `steps` list (fences `html`/`xml`/`pipeline` allowed).
  3. If Zeus is bound and `pipeline` is in the catalog tools, synthesize a pipeline tool call (`allow_pipeline=True`) and execute it.
  4. Terminating fields on the envelope (`summary`, `query_decomposition`, `decomposition`, `confidence`) follow the existing `pipeline_turn_complete` cheap path.
  5. If recovery is not allowed, `user_facing_answer` still peels `<summary>` so chat is not raw XML.
  6. TravelPlan cards read hop `result_json` / `snippet`, walk `data.<as>.rows` (e.g. `hotel_rows`), skip `job_fingerprint` / city-only predicates, infer Airport vs Hotel, and prefer hotel cards.

```text
LLM content ````html <pipeline>…````
  → parse_pipeline_envelope
  → synthetic pipeline tool call
  → Zeus POST /v2/.../pipeline
  → hops[].result_json.data.hotel_rows.rows + summary
  → results_waterfall → cards
```

- **Key components**:
  - `zeus_client/domain/layer_a.py` — envelope parse + peel
  - `zeus_client/application/agent_turn.py` — recovery before `exit_kind=direct`
  - `src/travel_planner/search.py` — analytics messages are the raw query
  - `src/travel_planner/results_parser.py` / `turn_mapper.py` — hotel_rows + airportname + snippet rows
  - `Dockerfile` / `docker-compose.yml` — editable sibling client at `/opt/zeus_client_python`
- **Data flow**: XML/JSON tags → pipeline args → Zeus hop body → `result_json` → allowlisted cards
- **Dependencies**: `kotenai-zeus-client` 2.3.x sibling with `parse_pipeline_envelope`; Zeus pipeline accepts flattened step keys (`entity_type` next to `as`/`verb`)

## 3. Setup
- **Prerequisites**: Same as TravelPlan V2 BFF (Zeus + LLM + `travel-sample/_default`).
- **Environment variables**: unchanged
- **Install / bootstrap steps**: `pip install -e ".[dev]"` (picks up sibling client). Docker: `docker compose up -d --build travel-planner` (bind-mounts `../zeus_client_python`).
- **Configuration**: `default_mode` may be `analytics`; `settings.ai_process_result` stays false
- **Verification**:
  ```bash
  pytest tests/unit/application/test_agent_turn.py tests/unit/domain/test_layer_a.py -q
  pytest tests/ -q
  curl -sS http://localhost:5050/api/health
  # expect pipeline_envelope_recovery: true
  ```

## 4. How to Use
- **Primary workflow**:
  1. Ask analytics questions such as “Nearby hotels in paris airport” or “give the list of airports in US”.
  2. Expect `answer` to be the pipeline `summary`, `results[]` hotel (or airport) cards, `trace.hops` with a `pipeline` hop.
- **Examples**: A recovered turn note is `recovered pipeline envelope from model content as pipeline tool call`.
- **Edge cases**: If `pipeline` is not in the catalog tools, the loop stays `direct` but the answer is still the peeled summary (no hops).
- **Limitations**: Recovery does not invent EntityMap data. A SCOPE BRIEF with `nodes_total: 0` / `entities_total: 0` can still yield empty rows after a valid pipeline hop if Zeus has no matching entities. Card cap is `MAX_RESULTS=20`.

## 5. Debugging & Known Issues
| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| `answer` is ````html <pipeline>…```` | Client without this recovery, or `pipeline` missing from tools | Rebuild/restart so sibling 2.3 with `parse_pipeline_envelope` is loaded; confirm catalog verbs include `pipeline` |
| `/api/health` `pipeline_envelope_recovery: false` | Docker image installed an older wheel; compose is not bind-mounting `../zeus_client_python` | `docker compose up -d --build travel-planner` |
| Summary shown, `results=[]`, `hops=[]` | Recovery skipped (no Zeus port / no pipeline tool) | Check `trace.notes` and `GET /api/health` |
| Summary shown, hop present, empty cards or one card named `Paris` | Rows in `data.hotel_rows` were skipped as meta, or `{city: Paris}` treated as a row | Mapper walks `as` bindings and skips predicates; inspect hop `result_json.data` |
| `output.rows_signal: 0` in detective | No Zeus hop / empty payload | Confirm recovery note and hop `result_size` |

- **Debug checklist**:
  - [ ] `GET /api/health` has `pipeline_envelope_recovery: true`
  - [ ] `trace.ai_process_result_exit` is `cheap_terminal` or `cheap_final`, not `direct`, after a list query
  - [ ] `trace.notes` includes `recovered pipeline envelope…` when the model dumped XML
  - [ ] `trace.hops[0].name == "pipeline"`
  - [ ] Analytics user message is the raw query (no “Find travel destinations…” prefix)
- **Known issues**:
  - **Empty analytics EntityMap** — reported brief had `nodes_total: 0`, `mini_entity_types: []`. Zeus-side; recovery cannot fabricate rows if Zeus itself has none. The Paris-hotels pipeline still returns travel-sample hotels when Zeus data is present.
  - **Stale travel-planner image** — Flask source is volume-mounted but a copy-installed client is not. Fixed by editable `/opt/zeus_client_python` + compose bind-mount.
- **Logging & observability**: client note on `trace.notes`; detective `output_grade=warn` when `rows_signal=0`; health flag `pipeline_envelope_recovery`.

## 6. Related Artifacts
- **Files changed / owned by this feature**:
  - `../zeus_client_python/src/zeus_client/domain/layer_a.py` — parse/peel
  - `../zeus_client_python/src/zeus_client/application/agent_turn.py` — recover + `result_json` on hops
  - `src/travel_planner/search.py` — mode-aware user message
  - `src/travel_planner/results_parser.py` — airportname + hotel_rows cards
  - `src/travel_planner/turn_mapper.py` — snippet / nested rows / schema infer
  - `src/travel_planner/runtime_factory.py` — require pipeline envelope API
  - `src/travel_planner/app.py` — health flag
  - `Dockerfile`, `docker-compose.yml` — editable sibling client
- **Tickets**: none
- **Commits**: local
- **Pull requests**: n/a

## 7. Changelog
| Date | Author | Change |
|------|--------|--------|
| 2026-08-25 | agent | Initial guide: recover fenced pipeline XML; analytics prompt; airport cards |
| 2026-08-25 | agent | Paris hotels: `data.hotel_rows` mapping; Docker editable client; health flag |
