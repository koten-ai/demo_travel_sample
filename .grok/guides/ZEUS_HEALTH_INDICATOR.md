# Guide: Zeus health indicator

**Date**: 2026-11-02
**Feature**: Top-right navbar shows whether Zeus liveness is up, refreshed every 3 seconds.
**Status**: Active
**Related Plan**: `.grok/plans/ZEUS_HEALTH_INDICATOR.md`

## 1. Overview
- **Purpose**: Tell an operator, on the search page, if the Zeus process answering this app is up.
- **Scope**: `GET /healthz` only. Couchbase readiness (`/readyz`) and the splash `online` flag are excluded.
- **Entry points**: `GET /` navbar indicator; `GET /api/zeus/health`.

## 2. Architecture & Flow
- **High-level flow**:
  1. The page paints `Zeus: Offline` with a gray dot.
  2. `app.js` calls `GET /api/zeus/health` immediately, then every 3000ms. A poll still in flight is skipped.
  3. Flask calls `probe_zeus_online()`, which GETs `{ZEUS_URL or config zeus.url}/healthz` with a 2 second timeout and no auth.
  4. HTTP 200 and JSON `status: ok` sets `online: true`. The label becomes `Zeus: Online` and the dot turns green. Anything else stays gray and `Zeus: Offline`.
- **Key components**:
  - `src/travel_planner/zeus_health.py` — URL resolution and `/healthz` probe
  - `src/travel_planner/app.py` — `GET /api/zeus/health`
  - `src/travel_planner/templates/index.html` — top-right indicator
  - `src/travel_planner/static/app.js` — 3 second poll
  - `src/travel_planner/static/app.css` — green and gray dots
- **Data flow**: Browser → Flask → Zeus `GET /healthz` → `{online, label}` → label and dot class.
- **Dependencies**: `httpx`. Zeus URL from `ZEUS_URL` or `config.json` `zeus.url`, rewritten by `_rewrite_loopback_host` when the process is not in Docker.

## 3. Setup
- **Prerequisites**: Zeus listening on the configured URL. `/healthz` is public.
- **Environment variables**:
  - `ZEUS_URL` — optional override of `zeus.url`
- **Install / bootstrap steps**:
  1. Same as the travel planner (`pip install -e ".[dev]"` or Compose).
- **Configuration**: No new config key. The probe uses the existing Zeus URL.
- **Verification**: `curl -sS http://localhost:5050/api/zeus/health` returns `{"online": true, "label": "Online"}` when Zeus is up.

## 4. How to Use
- **Primary workflow**:
  1. Open `/`.
  2. Read the top-right label. Green dot and `Zeus: Online` means `/healthz` succeeded. Gray dot and `Zeus: Offline` means it did not.
  3. The label updates every 3 seconds.
- **Examples**:
  ```bash
  curl -sS http://127.0.0.1:5000/api/zeus/health
  ```
- **Edge cases**: A probe that exceeds 2 seconds returns offline for that tick. The next poll still runs.
- **Limitations**: This is process liveness. A Zeus that answers `/healthz` while Couchbase is down still shows Online.

## 5. Debugging & Known Issues
- **Common symptoms → causes → fixes**:
  | Symptom | Likely Cause | Fix |
  |---------|--------------|-----|
  | Stays `Zeus: Offline` | Zeus URL unreachable, or `/healthz` is not 200 `status: ok` | Check `ZEUS_URL` / `config.json` `zeus.url` and `curl` that origin `/healthz` |
  | Host shows Offline while Compose is up | Host rewrote `host.docker.internal` to `127.0.0.1` and nothing listens there | Point `zeus.url` at a host-reachable Zeus, or open the Compose app |
- **Debug checklist**:
  - [ ] `GET /api/zeus/health` returns `online` true or false with HTTP 200
  - [ ] `GET {zeus}/healthz` returns `{"status":"ok"}`
  - [ ] Navbar `#zeus-health` is present on `/`
- **Known issues**:
  - **Liveness is not readiness** — `/readyz` can be 503 while this indicator stays Online.
- **Logging & observability**: The probe does not log each tick.

## 6. Related Artifacts
- **Files changed / owned by this feature**:
  - `src/travel_planner/zeus_health.py` — probe
  - `src/travel_planner/app.py` — route
  - `src/travel_planner/templates/index.html` — markup
  - `src/travel_planner/static/app.js` — poll
  - `src/travel_planner/static/app.css` — dot colors
  - `tests/test_zeus_health.py` — probe, route, and poll contract
- **Tickets**:
  - None
- **Commits**:
  - On `zd-23/align-client-2-5-4` with the navbar health indicator
- **Pull requests** (if applicable):
  - [#6](https://github.com/koten-ai/demo_travel_sample/pull/6) — open

## 7. Changelog
| Date | Author | Change |
|------|--------|--------|
| 2026-11-02 | Grok | Navbar polls Zeus `/healthz` every 3 seconds and shows a green or gray dot. |
