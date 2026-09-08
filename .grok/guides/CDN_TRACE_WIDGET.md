# Guide: CDN Zeus Tracer Widget (latest)

**Date**: 2026-09-08
**Feature**: TravelPlan loads `zeus_client_chat_trace` from the public CDN `latest` pointer, not a vendored `/static/` copy
**Status**: Active
**Related Plan**: `.grok/plans/CDN_TRACE_WIDGET_LATEST.md`

## 1. Overview
- **Purpose**: Always show the current published inspector UI without re-copying a bundle into this repo.
- **Scope**: Script tag + docs. Does not publish Spaces or change Flask BFF / `appendTraceCard`.
- **Entry points**: `GET /` → `templates/index.html` → CDN `…/zeus_client_chat_trace/latest/zeus_client_chat_trace.js`

## 2. Architecture & Flow
- **High-level flow**:
  1. Index sets `ZeusTraceConfig.toolOrder` (server) and `hubBaseUrl`.
  2. Browser loads the CDN `latest` IIFE asynchronously.
  3. `app.js` calls `appendTraceCard(query, data)` after `/api/search`.
  4. Widget mounts only when `?debug=true` (or `enabled: true`). `app.js` also forwards that page flag to `POST /api/search?debug=true` so the BFF opts the turn into Zeus rewind (see `.grok/guides/DEBUG_QUERY_REWIND.md`).
- **Key components**:
  - `src/travel_planner/templates/index.html` — CDN `latest` script tag
  - `src/travel_planner/static/app.js` — `appendTraceCard`
  - `scripts/vendor_trace.sh` — stub (copy-into-repo is no longer used)
- **Data flow**: `/api/search` JSON (`trace` or `debug`) → `appendTraceCard`
- **Dependencies**: Public CDN; `../zeus_client_chat_trace` only when publishing a new widget.

## 3. Setup
- **Prerequisites**: Browser can reach `koten-static-cdn.nyc3.cdn.digitaloceanspaces.com`
- **Environment variables**: none at TravelPlan runtime
- **Install / bootstrap steps**:
  1. No TravelPlan copy step. Confirm index.html uses the CDN `latest` URL below.
  2. To ship a new inspector: `cd ../zeus_client_chat_trace && npm test && npm run build && npm run publish:cdn`
- **Configuration**: `window.ZeusTraceConfig.hubBaseUrl` (default `http://zeus-dev.local:9091` for Detective). `toolOrder` injected by Flask.
- **Verification**: Open http://localhost:5050/?debug=true (Compose) or :5000; Network shows the CDN `latest` script 200; lightning toggle bottom-left; title **Turn traces**.

## 4. How to Use
- **Primary workflow**:
  1. Search as usual.
  2. Open `/?debug=true` to mount the inspector.
  3. Lightning toggle (bottom-left) opens the overlay.
- **Examples**:
  ```text
  https://koten-static-cdn.nyc3.cdn.digitaloceanspaces.com/zeus_client_chat_trace/latest/zeus_client_chat_trace.js
  ```
  Freeze a release by swapping `latest` for a semver path (`…/1.2.3/zeus_client_chat_trace.js`).
- **Edge cases**: CDN `latest` cache is short (Spaces `max-age` on the pointer). Hard-refresh if a just-published bundle does not appear.
- **Limitations**: Offline / blocked CDN means no inspector. `static/trace.js` is leftover and not loaded. `scripts/vendor_trace.sh` exits 1.

## 5. Debugging & Known Issues
- **Common symptoms → causes → fixes**:
  | Symptom | Likely Cause | Fix |
  |---------|--------------|-----|
  | No lightning toggle | Kill switch off | Add `?debug=true` |
  | Old pinned inspector | Stale `/static/` script tag | `src` must be the CDN `latest` URL |
  | Script 404 / blocked | CDN or network | Confirm the URL 200; allow `*.digitaloceanspaces.com` |
  | Footer not the newest semver | CDN cache | Wait for pointer TTL; hard refresh |
  | Detective hidden | Hub origin wrong | Set `hubBaseUrl` to the Hub the **browser** can reach |
- **Debug checklist**:
  - [ ] Network: CDN `latest` script 200
  - [ ] `ZeusTrace.version` matches published latest
  - [ ] Inspector title is **Turn traces**; tabs include Overview / Diagnosis / Tools
  - [ ] Shadow root on `#zeus-trace-host`
- **Known issues**: Leftover `static/trace.js` is unused.
- **Logging & observability**: Browser console `[ZeusTrace] Failed to mount widget`

## 6. Related Artifacts
- **Files changed / owned by this feature**:
  - `src/travel_planner/templates/index.html` — CDN script tag
  - `scripts/vendor_trace.sh` — obsolete stub
  - `tests/test_app.py` — asserts CDN `latest`, not `/static/` pin
- **Tickets**: none
- **Commits**: (fill at merge)
- **Pull requests**: none

## 7. Changelog
| Date | Author | Change |
|------|--------|--------|
| 2026-09-08 | Grok | Load CDN `latest`; stop vendoring `/static/zeus_client_chat_trace.js` |
