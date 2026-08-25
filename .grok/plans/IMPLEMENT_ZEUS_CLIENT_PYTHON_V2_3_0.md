# Plan: Implement kotenai-zeus-client 2.3.0

**Date**: 2026-08-21
**Task**: Cut TravelPlan over from the V1 `run_agent` / `init_http` BFF (committed `main`) to the `kotenai-zeus-client` **2.3.0** public surface (`import zeus_client` → `ZeusRuntime` / `rt.agent.run_turn`), aligned with family design law in sibling **`zeus_client_design`** (and catalog/BASE SoT in **`zeus_chat_request`**). There is no separate repo named `zeus_chat_design` — those two siblings are the design SoT.
**Priority**: High
**Estimated Effort**: 6–8 hours / 10 steps (working tree already contains a ZeusRuntime BFF draft; step 0 is the design-law gate)

## 1. Context & Requirements

- **Goal**: After this work, TravelPlan boots and searches only through `kotenai-zeus-client==2.3.0`. `GET /api/health` reports `zeus_client_version` starting with `2.3` and `client_import=zeus_client`. `POST /api/search` still returns the existing JSON keys (`results[]`, `answer` / `structured_answer`, `trace`, `chat_id`, `tool_order`, session fields). Destination cards and the vendored chat-trace widget keep working with no HTML/CSS/JS redesign.
- **Constraints**:
  - Flask remains the HTTP server. Do not introduce FastAPI for the product BFF.
  - Nested operator `config.json` (`zeus` + `llm_provider` + `samples` + `default_mode` + inline secrets) stays valid. Do not force operators to rewrite existing files to native `RuntimeConfig` JSON.
  - Sibling install stays `kotenai-zeus-client @ file:../zeus_client_python` (repo is private; Docker copies that tree).
  - Card waterfall, chat JSONL, and tool-order axes stay app-owned.
  - Default import is `zeus_client`, never the deprecated `zeus_client_v2` alias, never `zeus_client.compat.v1`.
  - `output_schema` is **not** a `run_turn` kwarg in 2.3.0 — keep the app-owned allowlist in `turn_mapper`.
  - Secrets on `RuntimeConfig` are env **names** only (`password_env`, `api_key_env`). Inline `password` / `api_key` in nested JSON go through an overlay secret store, never onto the config object.
  - **Family design wins over demo convenience.** Implementation must follow sibling `../zeus_client_design` (product how-to, L0 APIs, CHECKLIST) and `../zeus_chat_request` (BASE packs, COMPAT, Layer A, multi-round bags). If Python SDK code and design law disagree, **do not invent a third path** — follow design law and use the 2.3.0 public surface that already implements it. Do not forge `contract_hash` / COMPAT triples.
- **Assumptions**:
  - Sibling `../zeus_client_python` is package **2.3.0** (`dist/kotenai_zeus_client-2.3.0-*.whl`, `zeus_client.__version__ == "2.3.0"`).
  - Zeus Engine is reachable; durable sessions use `/v2/session` (library-owned in 2.3.0 — drop the local `patch_durable_session_v2_routes` monkeypatch).
  - `auth_mode=basic` now mints a **per-scope session** (`POST /v1/{bucket}/{scope}/auth/session`) instead of sending HTTP Basic on every hop. TravelPlan already ships `scope_credentials` for `travel-sample/_default`; keep mapping those into `ZeusEndpointConfig.scope_credentials`.
  - Semantic agent cache (2.3.0 CHECKLIST E2 / ZF-WISH-001) defaults **off**. Zeus ≥ 0.7.6 is required to turn it on; older engines treat memory as off. MATRIX honesty is `flag`, not `supported`.
  - Uncommitted working-tree files (`runtime_factory.py`, `turn_mapper.py`, `tool_order.py`, rewritten `search.py` / `async_runner.py` / `app.py`, V2 tests/docs) are a **draft of the 2.0 BFF**, not a finished 2.3.0 integration. Finish and correct them; do not start over and do not treat `CLEANUP_V2_BFF.md` as done.
- **Out of Scope**:
  - UI redesign; template/static edits except if a 2.3.0 trace-shape bug forces a one-line widget contract fix.
  - Enabling `session.semantic_cache` by default, or any `/v2/agent_memory` traffic in the demo.
  - Mode 3 (`rt.jobs` / `rt.units` / `llm.roles`) — claim is `multi_agent=docs`; TravelPlan stays single-agent `run_turn`.
  - FastAPI rewrite; Helios/RBAC; committing secrets; inventing a COMPAT triple.
  - Publishing the client to PyPI.

### Success criteria (definition of done)

1. No TravelPlan package import of `run_agent`, `init_http`, `close_http`, `load_config` (V1), `sync_chat_requests` (V1 free function), `build_tool_order` (client), `StructuredAgentResponse`, `normalize_api_version`, `resolve_*`, `zeus_client.compat`, or `zeus_client_v2`.
2. Process-scoped `ZeusRuntime` with `HttpxZeusPort` + `OpenAICompatibleLlmClient` + `FsCatalogStore` + `HttpxCatalogRemote` bound in `runtime_factory` (2.3.0 `from_config` does **not** auto-wire Zeus/LLM ports — see `zeus_client_python/examples/minimal_agent.py`).
3. `POST /api/search` → `rt.agent.run_turn` → existing JSON contract; detective lives on `trace.detective`, never in user `answer`.
4. `GET /api/health` → `zeus_client_version` matches `zeus_client.__version__` and starts with `2.3`; `client_import=zeus_client`.
5. `pytest -q` green; `scripts/verify_config.py` uses V2 catalog/hash APIs.
6. Guides updated: `ZEUS_CLIENT_INTEGRATION.md`, `ZEUS_CLIENT_V2_BFF.md`, `TRAVEL_PLANNER.md`, `README.md`. Implementation plan also saved to `.grok/plans/IMPLEMENT_ZEUS_CLIENT_PYTHON_V2_3_0.md`.
7. Design-law checklist in §1.1 is green (Mode 1 only, G1-only chat UI, no invented stamps, cheap `ai_process_result`).

### 1.1 Design law (what `zeus_chat_design` maps to)

There is **no** checkout named `zeus_chat_design`. Family design for this work is the sibling pair Python 2.3.0 already pins:

| Repo (sibling) | Role | TravelPlan must treat as |
| --- | --- | --- |
| [`../zeus_client_design`](https://github.com/koten-ai/zeus_client_design) | Family law: modes, L0 APIs, CHECKLIST, MATRIX honesty, logging/stamps | **Product how-to for the BFF** |
| [`../zeus_chat_request`](https://github.com/koten-ai/zeus_chat_request) (also under `../Zeus/ai/zeus_chat_request`) | BASE packs, COMPAT triples, Layer A schemas, multi-round bags | **Catalog / terminate / transcript SoT** |
| `../zeus_client_python` @ **2.3.0** | Language SDK (`sdk_bootstrap.pins.json` → design commit `4ba1df97…`) | **Only** L1 implementation — not a second law |

Python 2.3.0 pin file: `zeus_client_python/sdk_bootstrap.pins.json` (`design_repo_ref: local:../zeus_client_design`, `claim_level: candidate`, `semantic_cache: flag`, `ai_process_result_default: false`).

**Read before coding (implementer gate):**

| Doc | Why it binds TravelPlan |
| --- | --- |
| `zeus_client_design/docs/product/HOW_TO_USE_ZEUS_CLIENT.md` | Three modes. Search UI = **Mode 1** `agent.run` (`rt.agent.run_turn`). Not typeahead (Mode 2). Not jobs (Mode 3). |
| `zeus_client_design/docs/product/WHAT_ZEUS_CLIENT_IS_AND_IS_NOT.md` | Client is Zeus-law middleman, not a company ESB / unbounded dump into the model. App owns HTTP, chat JSONL, card allowlist. |
| `zeus_client_design/guides/api/API_AGENT.md` | One user turn, one `bucket.scope`. Result: `answer` + `structured` + `session` + `debug` + `tool_trail`. |
| `zeus_client_design/guides/api/API_LAYER_A.md` | **G1 only** in product chat UI (`summary` → `answer`). **G2 never** in chat chrome (Detective, `wish_i_knew`, scores). G3/policy stays in artifacts / `structured_response`. |
| `zeus_client_design/guides/api/API_SESSION.md` | Durable `/v2/session*`. `ai_process_result` product default **false**. `ignore_user_tool_path_hints` default **true**. `semantic_cache.enabled` default **false**. Never invent `session.id`. |
| `zeus_client_design/guides/api/API_RESULT.md` | Typed failure: `ZeusClientError.public_message` / code; no secret leakage. |
| `zeus_client_design/docs/architecture/PROJECT_OPTIMIZATION.md` | Model is expensive: no second LLM after Zeus unless `ai_process_result`; one turn = one user intent; never `agent.run` for typeahead. |
| `zeus_client_design/CHECKLIST.md` §A–E2 (Python 2.3.0 already ticked) | BFF must **consume** those capabilities, not reimplement: stamped catalog bind, bags A–D, G2-not-in-UI, product stamp `user=zeus_client`, UUID v4 `req_id`. |
| `zeus_client_design/conformance/fixtures/L2_control_plane/g2_not_in_ui/case.json` | Automated expectation: `g2_not_in_ui_view`. Mirror in `turn_mapper` tests. |
| `zeus_chat_request/docs/MULTI_ROUND_CLIENT.md` | App owns **Bag C** `messages[]` (chat_store). Catalog = Bag A (runtime). Inject brief/mini-schema = Bag B (`load_for_turn`). Cards = Bag D artifacts (not raw re-prompt). |
| `zeus_chat_request/COMPAT.md` | **Do not invent** Zeus × BASE × client triples or production `contract_hash`. |

**Precedence:** `zeus_client_design` L0 names and product rules > `zeus_client_python` internals > this demo’s historical V1 helpers. Demo Builder kit recipes that still say `run_agent` / `init_http` are **stale** for 2.3.0 — follow design + Runtime API instead of kit anti-examples.

**BFF-mapped design rules (must hold after the cutover):**

| Design rule | TravelPlan behavior |
| --- | --- |
| Mode 1, one scope | `travel_booking` against `travel-sample/_default/_default` via `run_turn` only |
| Mode 2 not for this search box | No `rt.data.search` on `/api/search`; no typeahead in this task |
| Mode 3 out | No `rt.jobs` / `rt.units` |
| G1 → UI | `user_facing_answer` / Layer A `summary` → `answer`; cards from hops after allowlist |
| G2 ↛ UI | Detective, G2, `wish_i_knew` only on `trace` / debug; never in `answer` or card fields |
| Cheap product | `ai_process_result=false` unless config/profile `hub` |
| Path policy | Leave `ignore_user_tool_path_hints=true` (do not honor “don’t use pipeline” in the travel prompt) |
| Semantic cache | Map knobs; keep `enabled=false` (CHECKLIST E2 `flag`; Zeus ≥ 0.7.6 to turn on) |
| Stamps | Do not set Hub `user=admin`; library stamps `user=zeus_client` |
| Hashes | `verify_config.py` reads published stamp / bind; never writes a made-up `md5:` |
| Transcript | Persist user/assistant turns + `SessionHandle`; pass `prior_messages`; do not invent session ids on rehydrate failure |
| Correlation | Keep `debug.preferred_req_id` / hop `req_id` on `trace` for Detective join |
| Secrets | Env names on config; overlay for demo inline keys; REDACT via client logger |

## 2. Analysis & Research

- Key files explored:
  - Committed `main` BFF: `src/travel_planner/search.py` (`run_agent` 5-tuple), `async_runner.py` (`init_http` / `close_http` / `sync_chat_requests`), `zeus_config.py` (`patch_durable_session_v2_routes`), `app.py` (`from zeus_client import build_tool_order`), `scripts/verify_config.py` (V1 `zeus_client.zeus.catalog` / `contract_hash`).
  - Working-tree draft: `runtime_factory.py`, `turn_mapper.py`, `tool_order.py`, rewritten `search.py` / `async_runner.py` / `app.py`, `tests/test_runtime_factory.py`, `tests/test_v2_bff_search.py`, `.grok/guides/ZEUS_CLIENT_V2_BFF.md`, `.grok/plans/CLEANUP_V2_BFF.md`.
  - Upstream 2.3.0: `zeus_client_python/CHANGELOG.md`, `docs/V2/MIGRATION.md`, `src/zeus_client/runtime.py` (`from_config`, auto `SessionLifecycle` + `agent_memory`), `config/models.py` (`ClientSettings.ai_process_result` default **False**, `SemanticCacheConfig` default **off**), `api/agent.py` (`load_for_turn` / `ensure_scope_brief`), `examples/minimal_agent.py`, `config.example.json`, `sdk_bootstrap.pins.json`.
  - Family design SoT: `zeus_client_design/docs/product/HOW_TO_USE_ZEUS_CLIENT.md`, `WHAT_ZEUS_CLIENT_IS_AND_IS_NOT.md`, `guides/api/API_AGENT.md`, `API_LAYER_A.md`, `API_SESSION.md`, `API_RESULT.md`, `CHECKLIST.md`, `docs/architecture/PROJECT_OPTIMIZATION.md`, `conformance/fixtures/L2_control_plane/g2_not_in_ui/`.
  - Catalog/BASE SoT: `zeus_chat_request/docs/MULTI_ROUND_CLIENT.md`, `COMPAT.md`, Layer A `response_output_schema.json` (pack-owned; BFF allowlist is a **UI** subset, not a second terminate schema).
  - Dogfood pattern: `demo_yelp/src/local_guide/runtime_factory.py` (nested JSON → `RuntimeConfig` + `OverlaySecretStore`). Yelp still imports `zeus_client_v2` — TravelPlan must **not** copy that alias (design L0 is `zeus_client`).
- Potential risks/edge cases:
  - Nested travel `config.json` is not native `RuntimeConfig` JSON (`llm_provider` / `samples` / inline secrets vs `llm` / `target` / env names) → Mitigation: keep `runtime_factory` mapper (yelp pattern). Optionally dual-read a native `llm`+`target` block if present, but do not require it.
  - 2.3.0 `ZeusRuntime.from_config` only loads config (+ jobs/catalog_remote). It does **not** bind Zeus HTTP or LLM → Mitigation: BFF continues to assign `rt.services.zeus` / `llm` / `catalog` / `catalog_remote`.
  - Working-tree factory defaults `ai_process_result=True` and the unit test asserts that. Package 2.2.0 **broke** the default to `false` (product-cheap). Hub insight is profile `hub` → Mitigation: default **False**; honor `settings.ai_process_result` / `ZEUS_CLIENT_AI_PROCESS_RESULT` when set. Flip `tests/test_runtime_factory.py`.
  - `session.semantic_cache` is unmapped today (library default off — OK). Operators who copy `zeus_client` `config.example.json` would expect the nested `session` block to round-trip → Mitigation: parse `session.semantic_cache` when present; leave `config.example.json` with `"enabled": false`.
  - V2 `public_trace` uses `hops` not only `tool_calls` → Mitigation: `turn_mapper` already extracts hops/steps/tool_calls; keep markdown `answer_parser` fallback.
  - Catalog resolve never silent-sibling `*__*` rglob (2.0 breaking) → Mitigation: ship snapshots under `data/chat_requests/travel-sample__default/` and `ZEUS_CHAT_REQUESTS_DIR`; startup `rt.catalog.sync()` remains soft-fail.
  - `auth_mode=basic` per-scope session mint (2.2.0) → Mitigation: map `scope_credentials` with `password_env`; overlay inline `password`. Do not reintroduce HTTP Basic on every hop.
  - Detective / G2 / `wish_i_knew` leaking into chat text → Mitigation: `user_facing_answer` from the package; attach `debug.detective` only onto `trace`.
  - Docker still installs the sibling tree; `requirements.txt` does not list the client. Health/startup must fail clearly if `__version__` is not 2.3.x → Mitigation: version assertion in `/api/health` tests + optional boot log.
  - Residual V1 monkeypatch (`patch_durable_session_v2_routes`) will `ImportError` on 2.3.0 (`http_client` / `zeus_client.zeus.session` gone) → Mitigation: delete the patch and its `__init__.py` call.
- Alternatives considered:
  - **A. Switch operators to native `RuntimeConfig` JSON + `ZeusRuntime.from_config`.** Cleaner long-term, but breaks every existing `config.json` / `config.example.json` and Demo Builder kit docs that still describe nested travel keys. Rejected for this cutover.
  - **B. Keep `compat.v1.run_agent` as a shim.** Forbidden for new BFF code; shims are time-boxed and missing on a default 2.3.0 install path we care about. Rejected.
  - **C. Nested mapper + process-scoped `ZeusRuntime` (yelp / CLEANUP_V2_BFF), then 2.3.0 knob alignment.** Chosen. Reuses the uncommitted draft; adds semantic-cache mapping (off), `ai_process_result=False`, `load_for_turn`, version gate, and doc/test updates.

### What 2.3.0 adds on top of the 2.0 Runtime cutover (must land, not just “use ZeusRuntime”)

| 2.3.0 / 2.2.0 item | TravelPlan action |
| --- | --- |
| Default import `zeus_client` 2.3.0 | Health + import-linter test; no `zeus_client_v2` |
| `ClientSettings.ai_process_result` default **false** | Factory default false; overridable |
| `session.semantic_cache` (default off) | Map if present; do not enable |
| Auto-wired `SessionLifecycle` when `durable_sessions` | Do not reimplement; pass `SessionHandle` from chat store |
| Auto-wired `HttpxAgentMemoryClient` | Leave unused unless cache enabled |
| `rt.catalog.load(..., base_id=)` / `load_for_turn` / `ensure_scope_brief` | Prefer omitting `chat_request` so `run_turn` calls `load_for_turn` (merges `## SCOPE BRIEF` + `## MINI-SCHEMA`) |
| `rt.catalog.contract.hash\|id\|bind` | `scripts/verify_config.py` |
| Family logger + redaction | Rely on runtime `_configure_logging`; app logger stays `travel_planner` |
| `auth_mode=basic` → per-scope session | Map `scope_credentials` |
| Array `business_rules_triggers` removed | Do not emit arrays; object `{id: bool}` only if we ever pass rules |
| Mode 3 jobs/units | Out of scope |

## 3. Step-by-Step Implementation Plan

0. **Bind to design law (do this first; no product code)**
   - Files to change: none yet; later cite these from `.grok/guides/ZEUS_CLIENT_V2_BFF.md`
   - Changes:
     - Confirm siblings exist: `../zeus_client_design`, `../zeus_chat_request` or `../Zeus/ai/zeus_chat_request`, `../zeus_client_python` at 2.3.0.
     - Read the implementer gate in §1.1. If a TravelPlan shortcut would violate G2-not-in-UI, Mode 1-only search, stamp honesty, or `ai_process_result` cheap default, **change the BFF**, do not “fix” the client.
     - Copy the design-rule table from §1.1 into the feature guide when docs land (step 9).
   - Commands to run: `test -d ../zeus_client_design && test -d ../zeus_client_python`
   - Tests needed: [ ]

1. **Pin the 2.3.0 client and drop leftover V1-era deps**
   - Files to change: `pyproject.toml`, `requirements.txt`, `Dockerfile` (verify only)
   - Changes:
     - Keep path dep `kotenai-zeus-client @ file:../zeus_client_python` (path deps cannot PEP-440 pin). Document required version **2.3.0** in README + guides.
     - Confirm unused FastAPI/uvicorn/multipart/toon are gone from `pyproject.toml` (working tree already dropped them; `main` still has them).
     - Docker already `COPY zeus_client_python` then `pip install /tmp/zeus_client_python` — no Dockerfile rewrite unless the sibling layout changes.
     - Add a small `_require_client_version()` helper (e.g. in `runtime_factory` or `app.py`) that logs an error if `zeus_client.__version__` does not start with `2.3`.
   - Commands to run: `pip install -e ".[dev]"`; `python -c "import zeus_client; print(zeus_client.__version__)"` → `2.3.0`
   - Tests needed: [x] `test_health_zeus_client_version` already compares to `zeus_client.__version__`; add `startswith("2.3")`.

2. **Finish `runtime_factory` as the 2.3.0 bootstrap (nested JSON → RuntimeConfig + ports)**
   - Files to change: `src/travel_planner/runtime_factory.py`, `tests/test_runtime_factory.py`
   - Changes:
     - Keep `OverlaySecretStore` (implements `SecretStorePort.get`). Map inline `zeus.password` / `scope_credentials.*.password` / `llm_provider.api_key` onto env-name keys (`ZEUS_PASSWORD`, `ZEUS_SCOPE_PASSWORD_*`, `XAI_API_KEY`).
     - Map nested travel keys → `RuntimeConfig`: `zeus.url` (with `ZEUS_URL` + `host.docker.internal` rewrite), `auth_mode`, `username`, `password_env` / `token_env`, `scope_credentials`, `tls_verify` (default True), `target` from `samples[default_sample]` or `target`, `llm` from `llm_provider` (provider id from label/host, first `models[]` as `model`, `api_key_env`).
     - `ClientSettings`: `mode` from `settings.mode` or `default_mode` (`travel_booking`); **`ai_process_result` default False** (HOW_TO_USE + CHECKLIST B + API_SESSION); leave **`ignore_user_tool_path_hints=True`** (ZCF-WISH-054); `durable_sessions` from `settings` or `zeus.enable_durable_sessions` (default True); `max_rounds` default 12 for the travel agent loop (package default is 8 — keep 12 unless `settings.max_rounds` is set).
     - Parse optional `session.semantic_cache` into `RuntimeConfig.semantic_cache` (library helper `_parse_semantic_cache` or equivalent local parse). Default remains disabled.
     - Pass through `scope_contracts`, `chat_requests_dir` (`ZEUS_CHAT_REQUESTS_DIR` / `ZEUS_CLIENT_CHAT_REQUESTS_DIR`), `debug.detective_briefing=True`.
     - `build_runtime()`: `ZeusRuntime(cfg, secrets=..., catalog=FsCatalogStore)` then bind `HttpxZeusPort`, `OpenAICompatibleLlmClient`, `HttpxCatalogRemote`. Do **not** import `zeus_client_v2`. Let `__init__` auto-wire `SessionLifecycle` + `agent_memory`.
   - Commands to run: `pytest tests/test_runtime_factory.py -q`
   - Tests needed: [x] nested shape maps mode/target/llm/overlay secrets; `ai_process_result is False` unless set; `ZEUS_URL` override; semantic_cache stays disabled by default and enables only when JSON says so; ports bound; `aclose()` in teardown.

3. **Process lifecycle without `init_http`**
   - Files to change: `src/travel_planner/async_runner.py`, `src/travel_planner/zeus_config.py`, `src/travel_planner/__init__.py`
   - Changes:
     - `configure_paths()` at import (already in working tree): `ZEUS_CLIENT_CONFIG_DIR`, `ZEUS_CHAT_REQUESTS_DIR`, `ZEUS_CLIENT_CHAT_REQUESTS_DIR`, `CHAT_LOG_PATH`.
     - **Delete** `patch_durable_session_v2_routes` and its `__init__.py` / `search.py` calls.
     - `startup()`: `build_runtime()` → process-scoped `_runtime`; optional `rt.catalog.sync()` when `chat_requests_sync.on_startup`; `load_chats_from_jsonl()`; soft-fail sync errors.
     - `shutdown()` / `atexit`: `await rt.aclose()`.
     - Keep the Flask background asyncio loop (`run_coro`). Do not `asyncio.run` per request.
   - Commands to run: `pytest tests/test_async_runner.py -q`
   - Tests needed: [x] sync skipped when `on_startup` falsey; runs when true; logs and continues on failure.

4. **Search wrapper + TurnResult mapping (idiomatic 2.3.0 `run_turn`)**
   - Files to change: `src/travel_planner/search.py`, `src/travel_planner/turn_mapper.py`, `src/travel_planner/output_schema.py`, `src/travel_planner/results_parser.py` (only if hop-shape gaps), `src/travel_planner/tool_order.py`
   - Changes:
     - `run_search` → `get_runtime()` → `rt.agent.run_turn(message, target=, settings=, session=SessionHandle, prior_messages=, chat_id=, model=, enable_sessions=)`.
     - Prefer **omitting** `chat_request` so 2.3.0 `AgentAPI.run_turn` calls `catalog.load_for_turn` (scope brief + mini-schema merge). If tests need a frozen catalog, pass `chat_request=` explicitly.
     - Map `TurnResult` with existing helpers: `user_facing_answer` (API_LAYER_A G1 only), `trace_payload` (public_trace + detective + hops — G2/Detective stay here), `results_waterfall` (schema filter → `zeus_data_to_results` → `extract_destinations` → markdown parser), `apply_session_to_chat` (never invent session ids; MULTI_ROUND_CLIENT Bag C).
     - Assert G2 keys (`wish_i_knew`, detective scores, raw Layer A) never appear in `answer` or `results[]` (conformance `g2_not_in_ui`).
     - On `TurnStatus.ERROR`, return `{"error", "chat_id", "status": "error"}` without breaking the Flask 400/502 mapping.
     - Catch `ZeusClientError` via `public_message`; `httpx.HTTPError` as `network error:`.
     - Keep static `tool_order` (`pipeline` not on Direct V2 axes).
     - Keep `DEMO_OUTPUT_SCHEMA` as BFF allowlist (comment already says it is not a `run_turn` kwarg).
   - Commands to run: `pytest tests/test_v2_bff_search.py tests/test_output_schema.py tests/test_results_parser.py -q`
   - Tests needed: [x] `/api/search` JSON keys; detective on trace not in answer; schema strips `job_fingerprint`; error path.

5. **Flask routes (UI unchanged)**
   - Files to change: `src/travel_planner/app.py`
   - Changes:
     - Keep `GET /`, `POST /api/search`, `GET /api/tool-order`.
     - Keep/confirm `GET /api/health`: `status`, `app_version`, `build_version`, `zeus_client_version`, `client_import="zeus_client"`. Optionally add `semantic_cache_enabled` (always false unless operator opted in) — only if it does not clutter the contract.
     - Empty query still 400 `"empty query"`.
     - Do not import `build_tool_order` from `zeus_client`; use local `travel_planner.tool_order`.
   - Commands to run: `pytest tests/test_app.py -q`
   - Tests needed: [x] index still serves CSS/JS; health version `2.3*`; AST import linter for forbidden V1 names.

6. **Config example + verify script**
   - Files to change: `config.example.json`, `scripts/verify_config.py`
   - Changes:
     - Keep nested operator keys (do not replace with native RuntimeConfig JSON).
     - Additive, documented keys: `"profile": "development"`, `"settings": {"mode": "travel_booking", "ai_process_result": false, "durable_sessions": true, "max_rounds": 12}`, `"session": {"semantic_cache": {"enabled": false}}`. Comment in `_comment` that enabling cache needs Zeus ≥ 0.7.6.
     - Prefer documenting `password_env` / `api_key_env` while still accepting inline secrets via overlay (existing demo workflow).
     - `verify_config.py`: `configure_paths()` → `build_runtime()` → print `scope_contracts` binds → optional `rt.catalog.sync()` → `compute_contract_hash` / `extract_stamped_hash` / `resolve_catalog_path` from `zeus_client` 2.3 APIs → `rt.aclose()`. No `init_http`.
   - Commands to run: `python scripts/verify_config.py` (live sync may SKIP)
   - Tests needed: [ ] manual / script smoke

7. **Tests: rewrite remaining V1 mocks**
   - Files to change: `tests/conftest.py`, `tests/test_app.py`, `tests/test_async_runner.py`, `tests/test_output_schema.py`; add `tests/test_runtime_factory.py`, `tests/test_v2_bff_search.py`
   - Changes:
     - `flask_client` fixture keeps `startup` mocked so unit tests do not bind a live runtime.
     - Forbidden-import AST walk on `src/travel_planner/**/*.py`.
     - No test should patch `run_agent` / `init_http`.
   - Commands to run: `pytest -q`
   - Tests needed: [x] full non-integration suite green

8. **Manual / contract verification (browser + curl)**
   - Files to change: none unless a regression is found
   - Changes:
     - `python -m travel_planner` or `docker compose up --build`
     - `GET /` — TravelPlan HTML, `/static/app.css`, `/static/app.js`, injected `toolOrder`
     - `GET /api/health` — `zeus_client_version` 2.3.x, `client_import=zeus_client`
     - `POST /api/search` empty → 400; real query → cards and/or answer, `trace` with hops, `chat_id`
     - Follow-up with same `chat_id` increments `session_round` when durable sessions work
     - Trace panel opens (widget still consumes `data.trace` + `toolOrder`)
     - Desktop + mobile viewports if any layout was touched (expect none)
   - Commands to run:
     ```bash
     curl -sS http://localhost:5000/api/health
     curl -sS -X POST http://localhost:5000/api/search \
       -H "Content-Type: application/json" \
       -d '{"query":"warm beaches in Europe under $2000"}'
     ```
   - Tests needed: [ ] live smoke (operator Zeus + LLM key)

9. **Docs (guides + README + plan file in-repo)**
   - Files to change:
     - `.grok/plans/IMPLEMENT_ZEUS_CLIENT_PYTHON_V2_3_0.md` (copy of this plan, AGENTS.md location)
     - `.grok/guides/ZEUS_CLIENT_V2_BFF.md` (status Active; 2.3.0 specifics: semantic cache off, `ai_process_result` false, `load_for_turn`, no V1 patch)
     - `.grok/guides/ZEUS_CLIENT_INTEGRATION.md` (upgrade path; remove `init_http` / session monkeypatch troubleshooting that no longer applies; add 2.3.0 rows)
     - `.grok/guides/TRAVEL_PLANNER.md`, `.grok/guides/DEMO_OUTPUT_SCHEMA.md` (allowlist still BFF-owned)
     - `README.md` (architecture diagram already mentions `run_turn`; fix leftover `zeus_connections` / `providers` wording if still present)
     - Mark `.grok/plans/CLEANUP_V2_BFF.md` as superseded by this plan (do not delete).
     - In `ZEUS_CLIENT_V2_BFF.md` §2, link the design SoT (`../zeus_client_design` HOW_TO_USE, API_LAYER_A, API_SESSION; `../zeus_chat_request` MULTI_ROUND_CLIENT) and paste the §1.1 BFF-mapped rules table.
   - Changes: Follow AGENTS.md guide template changelog rows dated 2026-08-21.
   - Commands to run: n/a
   - Tests needed: [ ]

### Forbidden in this BFF

```python
from zeus_client import run_agent, init_http, load_config, build_tool_order
from zeus_client.compat.v1 import run_agent
import zeus_client_v2
rt.data.pipeline(...)  # not on Direct
```

### Target call shape

```python
rt = get_runtime()
result = await rt.agent.run_turn(
    message,
    target=rt.config.target,
    settings=rt.config.settings,
    session=prior_session,          # SessionHandle or None
    prior_messages=prior_messages,  # OpenAI-style tuples from chat_store
    chat_id=chat_id,
    model=rt.config.llm.model,
    enable_sessions=bool(rt.config.settings.durable_sessions),
)
# chat_request omitted → load_for_turn (2.3.0)
```

## 4. Verification & Rollback

- **Tests**:
  - `pytest -q` (unit/BFF; no live Zeus)
  - `python -c "import zeus_client; assert zeus_client.__version__.startswith('2.3')"`
  - `GET /api/health` → `client_import=zeus_client`, version `2.3.*`
  - `GET /` still TravelPlan HTML + static assets
  - `POST /api/search` empty query still 400
  - Live smoke with a real query when Zeus + LLM key are available
  - `python scripts/verify_config.py` (sync may SKIP)
- **Review Checklist**:
  - [ ] Code style/linting passes
  - [ ] No breaking changes to HTML/CSS/JS or `/api/search` success keys
  - [ ] No V1 free-function or `zeus_client_v2` imports in `src/travel_planner`
  - [ ] Nested `config.json` still works (inline secrets via overlay)
  - [ ] `ai_process_result` defaults false; semantic cache defaults off
  - [ ] Feature guide created or updated in `.grok/guides/ZEUS_CLIENT_V2_BFF.md` (includes design-SoT links)
  - [ ] In-repo plan at `.grok/plans/IMPLEMENT_ZEUS_CLIENT_PYTHON_V2_3_0.md`
  - [ ] Design law: Mode 1 only for `/api/search`; G2/Detective not in `answer` or cards; `ai_process_result` default false; `semantic_cache` default off; no invented `contract_hash` / session ids; product stamp left to the client (`user=zeus_client`)
- **Rollback Plan**: Revert the Python/test/doc commits (and leave UI files untouched). Path dep will still install whatever sibling tree is present — pin/roll the sibling checkout to the last V1-compatible client only if rolling all the way back to `main`'s `run_agent` BFF.

## 5. Open Questions / Decisions Needed

Resolved in this plan (no blocker):

- **Keep nested `config.json`** rather than forcing native RuntimeConfig JSON. Mapper stays.
- **Semantic cache stays off** unless an operator sets `session.semantic_cache.enabled` and Zeus is ≥ 0.7.6.
- **`ai_process_result` defaults false** (2.2.0+ product-cheap). Hub insight = set true or use profile `hub`.
- **Mode 3 jobs/units out of scope.**
- **Finish the uncommitted ZeusRuntime draft** instead of discarding it or depending on `compat.v1`.
- **Design SoT** is sibling `zeus_client_design` + `zeus_chat_request` (no repo `zeus_chat_design`). Implementation follows those docs; Python 2.3.0 is the L1 that already claims CHECKLIST A–E2 as `candidate`.

Optional follow-ups (not this task): enable semantic cache behind an explicit config flag + Zeus version check; dual-read native RuntimeConfig JSON; Mode 3 demo.
