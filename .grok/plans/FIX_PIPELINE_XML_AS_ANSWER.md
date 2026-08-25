# Plan: Recover Fenced Pipeline XML as a Zeus Tool Call

**Date**: 2026-08-25
**Task**: Stop analytics turns from returning a fenced `<pipeline>` plan as the user answer with empty `results[]`.
**Priority**: High
**Estimated Effort**: 3 hours / 5 steps

## 1. Context & Requirements
- **Goal**: Query `Nearby hotels in paris airport` (and `give the list of airports in US`) in analytics mode returns a prose summary and hotel/airport cards, not a markdown/HTML pipeline dump. `trace.hops` contains a `pipeline` hop. Same prompt in `zeus_client` already returns ~50 Zeus hotel rows once the pipeline executes.
- **Constraints**: Keep `ai_process_result=false` (cheap product). Pipeline stays agent-internal (`allow_pipeline=True` on the agent hop only). Do not expose `rt.data.pipeline`. Family Layer A / G2-not-in-UI still holds. Docker image must install current sibling `../zeus_client_python` (recovery lives in the SDK, not the Flask mapper).
- **Assumptions**: Catalog verbs already include `pipeline` (13 tools). Zeus `pipelineStep.UnmarshalJSON` already absorbs flattened step keys (`entity_type` next to `as`/`verb`).
- **Out of Scope**: Re-authoring the analytics BASE prompt; EntityMap / SCOPE BRIEF `nodes_total: 0` (separate Zeus data issue); Hub UI.

## 2. Analysis & Research
- Key files explored:
  - User payload (`Nearby hotels in paris airport`): `mode=analytics`, `hop_count=0`, `tool_calls=[]`, `ai_process_result_exit=direct`, `results=[]`, `answer` is ````html <pipeline>…````
  - Running `travel-planner` container: `kotenai-zeus-client==2.3.0` **without** `parse_pipeline_envelope` / recovery note (image baked before the SDK change)
  - Local editable sibling `../zeus_client_python` **has** recovery
  - `zeus_client` sample: live Zeus `POST /pipeline` returns `data.hotel_rows.rows` (50 hotels) beside `job_fingerprint` / `meta`
  - `data/chat_requests/travel-sample__default/chat_request_analytics_v2.json` — “Emit tool call or ONE pipeline directly”
  - `zeus_client_python/src/zeus_client/application/agent_turn.py` — no-tool_calls ⇒ `exit_kind=direct` unless envelope recovered
  - `src/travel_planner/turn_mapper.py` / `results_parser.py` — cards from hops; must walk `data.<as>.rows`, not treat `{city: Paris}` as a row
- Potential risks/edge cases:
  - Recovering XML when `pipeline` is not in the tool list → Mitigation: only synthesize when catalog tools include `pipeline` and Zeus port is bound
  - Flattened vs `params{}` steps → Mitigation: Zeus already absorbs flat sibling keys
  - Cards still empty after a successful hop (`snippet` only, no `result_json`) → Mitigation: attach `result_json` on hops; parse `snippet`; map `airportname`; walk `hotel_rows`
  - Stale Docker image keeps old SDK while Flask source is volume-mounted → Mitigation: editable install + bind-mount sibling; `require_client_version` checks `parse_pipeline_envelope`; `/api/health` exposes `pipeline_envelope_recovery`
  - Mixed airport+hotel pipeline fills `MAX_RESULTS=20` with airports → Mitigation: `prefer_hotel_rows`
  - Empty EntityMap (`nodes_total: 0` in this brief) → Mitigation: document; execution may still return 0 rows if Zeus has no entities (this query’s Zeus pipeline does return hotels)
- Alternatives considered:
  - Peel summary only (no execute) — UI less ugly, still no hotels
  - Retry LLM with “call the pipeline tool” — extra billable round
  - `tool_choice=required` — does not stop XML dumps
  - Re-implement pipeline POST in TravelPlan — forbidden; L1 SDK only

## 3. Step-by-Step Implementation Plan
1. **Parse + peel pipeline envelopes in the client**
   - Files: `../zeus_client_python/src/zeus_client/domain/layer_a.py`, `tests/unit/domain/test_layer_a.py`
   - Changes: strip `html`/`xml` fences; parse `<pipeline>` child tags; `user_facing_answer` prefers `<summary>`
   - Tests: fenced html pipeline peels to summary; prose unchanged

2. **Execute recovered envelopes in the agent loop**
   - Files: `../zeus_client_python/src/zeus_client/application/agent_turn.py`, `tests/unit/application/test_agent_turn.py`
   - Changes: when LLM content is a pipeline envelope, no native tool_calls, Zeus bound, and `pipeline` is a catalog tool, synthesize a pipeline tool call and continue the hop path; store `result_json` on hops
   - Tests: XML content → pipeline hop + cheap terminal summary; plain “Hello” still `direct`

3. **TravelPlan mapping**
   - Files: `src/travel_planner/search.py`, `results_parser.py`, `turn_mapper.py`, tests
   - Changes: analytics user message is the raw query (no travel-booking prefix); airportname/faa/icao → cards; hops `snippet` / nested `rows` / `data.hotel_rows.rows` → waterfall; infer entity type; skip city-only predicates; hotel cards before airports
   - Tests: analytics message; airport cards; snippet hops; hotel_rows beside job_fingerprint; peel fenced XML answer

4. **Docker client freshness**
   - Files: `Dockerfile`, `docker-compose.yml`, `runtime_factory.py`, `app.py`
   - Changes: `pip install -e /opt/zeus_client_python`; compose bind-mounts sibling source; boot/health fail closed without `parse_pipeline_envelope`
   - Tests: health includes `pipeline_envelope_recovery`

5. **Docs**
   - Files: `.grok/guides/PIPELINE_XML_AS_ANSWER.md`, `.grok/guides/ZEUS_CLIENT_V2_BFF.md`

## 4. Verification & Rollback
- **Tests**: `pytest tests/ -q` in travel-planner; `pytest tests/unit/application/test_agent_turn.py tests/unit/domain/test_layer_a.py -q` in zeus_client_python
- **Live**: `docker compose up -d --build travel-planner` then `POST /api/search` with `{"query":"Nearby hotels in paris airport"}` — expect peeled summary, non-empty `results[]` named hotels, `trace.hops[0].name == pipeline`, `pipeline_envelope_recovery: true` on `/api/health`
- **Review Checklist**:
  - [x] Code style/linting passes
  - [x] No breaking changes (`test_direct_answer_no_tools` still `direct`)
  - [x] Feature guide created or updated in `.grok/guides/PIPELINE_XML_AS_ANSWER.md`
- **Rollback Plan**: revert the four client/app files and Docker install path; XML dump returns.

## 5. Open Questions / Decisions Needed
- SCOPE BRIEF in the reported turn showed `nodes_total: 0`, `entities_total: 0`, `mini_entity_types: []`. Recovery still executes the dumped plan against Zeus; this query’s pipeline returns hotels even when the brief is empty. If Zeus EntityMap is actually empty, recovered execution can still yield zero rows.
