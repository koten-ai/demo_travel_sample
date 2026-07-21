# Guide: Analytics Contract Drift (Session Failures)

**Date**: 2026-07-10
**Feature**: Diagnose and fix contract hash drift + session create failures for analytics mode
**Status**: Active
**Related Plan**: `.grok/plans/FIX_ANALYTICS_CONTRACT_DRIFT.md`

## 1. Overview
- **Purpose**: Keep the analytics `chat_request` stamp, config binding, and Zeus payload hash identical, and ensure durable session create reaches Zeus at `/v2/session` with working auth.
- **Scope**: Analytics mode for `travel-sample/_default` (`analytics_v4`).
- **Entry points**:
  - UI chat with mode `analytics`
  - `zeus_client.run_agent(..., mode="analytics")`
  - Runtime audit lines in `trace["notes"]` / `trace["runtime_basic_chat_audit"]`

## 2. Architecture & Flow
- **High-level flow**:
  1. Load stamped catalog from `data/chat_requests/travel-sample__default/chat_request_analytics_v2.json` (or bundled fallback).
  2. Merge live `## SCOPE BRIEF` when missing.
  3. Resolve `contract_id` / `contract_hash` from `config.json` `scope_contracts`.
  4. Authenticate (`auth_mode: basic` → `POST /v1/{bucket}/{scope}/auth/session`).
  5. Create durable session via `POST /v2/session` (not `/v1/session` — ZE-35).
  6. Zeus hashes the request body (brief stripped) and compares to the claimed `contract_hash`.

- **Root causes seen in the field (2026-07-10)**:

  | Symptom | Cause |
  |---------||--------|
  | Bound hash ≠ payload hash | `scope_contracts.analytics.contract_hash` lagged the loaded catalog (`ea77…` vs `a148…`) or scoped catalog file was missing (fell back to bundled). |
  | `All connection attempts failed` | App in Docker used `zeus.url=http://localhost:8080` (container loopback). Use `host.docker.internal:8080`. |
  | Session create `401 unauthenticated` | Zeus has auth enforced; client used `auth_mode: none` and/or empty `zeus_users`. |
  | Session create `404 page not found` | Client called `/v1/session*`; Zeus only mounts `/v2/session*` (ZE-35). |

- **Key components**:
  - `config.json` — URL, auth, `scope_contracts`
  - `data/chat_requests/travel-sample__default/chat_request_analytics_v2.json` — stamped analytics catalog
  - `src/travel_planner/zeus_config.py` — env + runtime `/v2/session` shim for older client images
  - `zeus_client_python/src/zeus/session.py` — durable session HTTP helpers
  - `zeus_client.contract_hash` — strip + hash + session hash selection

## 3. Setup
- **Prerequisites**: travel-planner with sibling `zeus_client_python`; Zeus reachable; Couchbase with `travel-sample` and a user in `travel-sample._default.zeus_users`.
- **Environment variables**:
  - `ZEUS_URL` — overrides `zeus.url` (Compose sets `http://host.docker.internal:8080`)
  - `ZEUS_CLIENT_CONFIG_DIR` / `ZEUS_CHAT_REQUESTS_DIR` — set by `configure_zeus_client()`
- **Configuration** (working shape):
  ```json
  "zeus": {
    "url": "http://host.docker.internal:8080",
    "auth_mode": "basic",
    "username": "demo_1",
    "password": "<policy-compliant password>",
    "scope_credentials": {
      "travel-sample/_default": { "username": "demo_1", "password": "<same>" }
    },
    "scope_contracts": {
      "travel-sample/_default": {
        "analytics": {
          "contract_id": "analytics_v4",
          "contract_hash": "md5:a148645f9763b39ea4117c1b35f739db"
        }
      }
    }
  }
  ```
- **Seed a Zeus user** (when `zeus_users` is empty):
  ```bash
  # Password must be ≥13 chars with upper, lower, digit, special.
  # Document key is user:<lowercase-name>
  ```
- **Verification**:
  ```bash
  python scripts/verify_config.py
  curl -sS -X POST http://localhost:5000/api/search \
    -H 'Content-Type: application/json' \
    -d '{"query":"nearby hotels in paris airport"}'
  # Expect: contract_status=match, OVERALL RUNTIME: PASS (7/7)
  ```

## 4. How to Use
1. Ensure analytics catalog exists under `data/chat_requests/travel-sample__default/`.
2. Align `scope_contracts.analytics.contract_hash` with catalog `_hash` / `contract.hash`.
3. Use Docker-reachable Zeus URL + basic auth with a seeded user.
4. Restart travel-planner after image rebuilds so the client package refresh applies (the app also shims `/v1`→`/v2` session paths at runtime).

## 5. Debugging & Known Issues

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Bound ≠ payload hash | Stale `scope_contracts` or wrong catalog file | Re-sync catalog; set hash to stamped value |
| `All connection attempts failed` | Wrong Zeus URL inside Docker | `host.docker.internal:8080` + `extra_hosts` |
| `401 unauthenticated` | No credentials / empty `zeus_users` | Seed user; `auth_mode: basic` |
| `404` on session create | Client still on `/v1/session` | Upgrade client or use `patch_durable_session_v2_routes` |
| `409 contract_mismatch` | Claimed hash ≠ Zeus payload hash | Align stamp + config to payload hash |
| `tools available: 37` + `find_nodes` 404 | V1 tools dump under V2 filename | Restore standardized V2 catalog (~13 verbs) |
| search tool 500 `embed: ollama` | Embeddings backend down | Optional; `find`/`describe` still work |

- **Debug checklist**:
  - [ ] Trace note `chat_request: synced (…analytics…) + live scope brief`
  - [ ] `auth: basic→session travel-sample/_default …`
  - [ ] `session create … status=match`
  - [ ] `OVERALL RUNTIME: PASS (7/7)`
  - [ ] Catalog `_hash` == config `scope_contracts` analytics hash

## 6. Related Artifacts
- **Files**:
  - `config.json` / `config.example.json`
  - `docker-compose.yml` (`ZEUS_URL`)
  - `data/chat_requests/travel-sample__default/chat_request_analytics_v2.json`
  - `src/travel_planner/zeus_config.py` — `/v2` session shim
  - `src/travel_planner/answer_parser.py` — accept dict answers
  - `zeus_client_python/src/zeus/session.py` — `/v2/session*` paths
- **Tickets**: none
- **Commits**: local

## 7. Changelog
| Date | Author | Change |
|------|--------|--------|
| 2026-07-09 | agent | Initial guide: trailing-ws brief-merge drift |
| 2026-07-09 | agent | Document unstamped V1 37-tool overwrite |
| 2026-07-10 | agent | Docker URL, basic auth seed, `/v2/session` ZE-35, hash realign to `a148645f…` |
