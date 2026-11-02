# Plan: Zeus health indicator

**Date**: 2026-11-02
**Task**: Show a top-right Zeus online/offline indicator that probes `/healthz` every 3 seconds.
**Priority**: Medium
**Estimated Effort**: 1 hour / 4 steps

## 1. Context & Requirements
- **Goal**: The navbar shows `Zeus: Online` with a green dot when Zeus `GET /healthz` returns `{"status":"ok"}`, and `Zeus: Offline` with a gray dot otherwise. The page polls every 3 seconds.
- **Constraints**: Probe from the Flask process so the browser does not call Zeus directly. Use the same Zeus URL as the runtime (`ZEUS_URL`, then `config.json`, with the loopback rewrite). Timeout stays under the poll interval. `/healthz` is the public liveness probe and needs no auth.
- **Assumptions**: A non-200, a body other than `status: ok`, or a network error means offline.
- **Out of Scope**: Couchbase readiness (`/readyz`), splash `online` (up to 2s), and changing search behavior.

## 2. Analysis & Research
- Key files explored: `src/travel_planner/templates/index.html`, `src/travel_planner/static/app.js`, `src/travel_planner/app.py`, `src/travel_planner/runtime_factory.py`, Zeus `GET /healthz`
- Potential risks/edge cases:
  - A hung Zeus holds the request past the next poll → Mitigation: 2s timeout and the browser skips a poll while one is in flight
  - Docker `host.docker.internal` from the host → Mitigation: reuse `_rewrite_loopback_host`
- Alternatives considered: Poll splash `/` for the Couchbase `online` flag (slower, wrong probe for a 3s liveness indicator).

## 3. Step-by-Step Implementation Plan
1. **Probe**
   - Files to change: `src/travel_planner/zeus_health.py`
   - Changes: `GET {zeus}/healthz` with a 2s timeout. Online only on HTTP 200 and `status == ok`.
   - Tests needed: [x] online, connection error, non-ok body

2. **Route**
   - Files to change: `src/travel_planner/app.py`
   - Changes: `GET /api/zeus/health` returns `{online, label}` and always HTTP 200.
   - Tests needed: [x] route maps the probe

3. **Indicator**
   - Files to change: `templates/index.html`, `static/app.css`, `static/app.js`
   - Changes: Top-right dot and label. Poll immediately, then every 3000ms.
   - Tests needed: [x] markup and interval are present

4. **Docs**
   - Files to change: `.grok/guides/ZEUS_HEALTH_INDICATOR.md`, `.grok/guides/ZEUS_CLIENT_V2_BFF.md`
   - Tests needed: [ ]

## 4. Verification & Rollback
- **Tests**: `pytest tests/test_zeus_health.py tests/test_app.py`
- **Review Checklist**:
  - [x] No breaking changes
  - [x] Feature guide created or updated in `.grok/guides/ZEUS_HEALTH_INDICATOR.md`
  - [x] Browser: green `Zeus: Online` at the top right, then gray `Zeus: Offline` after `/healthz` stops, within one 3s poll
- **Rollback Plan**: Remove the route, the navbar node, and the poll.

## 5. Open Questions / Decisions Needed
- None. Liveness is `/healthz`, not `/readyz`.
