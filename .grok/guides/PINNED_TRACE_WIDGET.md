# Guide: Pinned Zeus Tracer Widget

**Date**: 2026-08-25
**Feature**: TravelPlan vendors `zeus_client_chat_trace@1.0.0` and loads it from `/static/`, not CDN `latest`
**Status**: Active
**Related Plan**: `.grok/plans/PIN_ZEUS_TRACE_WIDGET.md`

## 1. Overview
- **Purpose**: Freeze the inspector UI TravelPlan ships so CDN `latest` cannot change it out from under the demo.
- **Scope**: Vendored JS + script tag pin. Does not publish Spaces or replace Flask BFF.
- **Entry points**: `GET /` → `templates/index.html` → `/static/zeus_client_chat_trace.js?v=1.0.0`

## 2. Architecture & Flow
- **High-level flow**:
  1. Sibling `../zeus_client_chat_trace` is built (`npm run build`).
  2. `scripts/vendor_trace.sh` copies `dist/zeus_client_chat_trace.js` (+ `.map`) into `src/travel_planner/static/`.
  3. Index sets `ZeusTraceConfig.toolOrder` (server) and `hubBaseUrl`, then loads the pinned script.
  4. `app.js` calls `appendTraceCard(query, data)` after `/api/search`.
  5. Widget mounts only when `?debug=true` (or `enabled: true`).
- **Key components**:
  - `scripts/vendor_trace.sh` — rebuild + copy
  - `src/travel_planner/static/zeus_client_chat_trace.js` — pinned 1.0.0 inspector
  - `src/travel_planner/templates/index.html` — script tag `?v=1.0.0`
  - `src/travel_planner/static/app.js` — `appendTraceCard`
- **Data flow**: `/api/search` JSON (`trace` or `debug`) → `appendTraceCard`
- **Dependencies**: Node only when re-vendoring; runtime is the copied IIFE.

## 3. Setup
- **Prerequisites**: Sibling `../zeus_client_chat_trace`, Node 18+ to re-vendor
- **Environment variables**: none at TravelPlan runtime
- **Install / bootstrap steps**:
  1. `cd ../zeus_client_chat_trace && npm install && npm run build` (or use the script below)
  2. `./scripts/vendor_trace.sh`
  3. Confirm index.html uses `/static/zeus_client_chat_trace.js?v=1.0.0`
- **Configuration**: `window.ZeusTraceConfig.hubBaseUrl` (default `http://127.0.0.1:9091` for Detective). `toolOrder` injected by Flask.
- **Verification**: Open http://localhost:5050/?debug=true (Compose) or :5000; lightning toggle bottom-left; footer `v1.0.0`.

## 4. How to Use
- **Primary workflow**:
  1. Search as usual.
  2. Open `/?debug=true` to mount the inspector.
  3. Lightning toggle (bottom-left) opens the overlay.
- **Examples**:
  ```bash
  ./scripts/vendor_trace.sh
  # already-built sibling:
  SKIP_BUILD=1 ./scripts/vendor_trace.sh
  ```
- **Edge cases**: `TRACE_SRC=/other/zeus_client_chat_trace ./scripts/vendor_trace.sh`
- **Limitations**: Bumping the widget means a new copy **and** updating `?v=` on the script tag. `static/trace.js` is leftover and not loaded.

## 5. Debugging & Known Issues
- **Common symptoms → causes → fixes**:
  | Symptom | Likely Cause | Fix |
  |---------|--------------|-----|
  | No lightning toggle | Kill switch off | Add `?debug=true` |
  | Old stacked DaisyUI cards | Stale 0.1.6 vendor or CDN latest | Re-run `vendor_trace.sh`; script src must be `/static/…?v=1.0.0` |
  | Footer not `v1.0.0` | Cached JS | Hard refresh; bump `?v=` |
  | Detective hidden | Hub origin wrong | Set `hubBaseUrl` to the Hub the **browser** can reach |
- **Debug checklist**:
  - [ ] Network: `/static/zeus_client_chat_trace.js?v=1.0.0` 200
  - [ ] `ZeusTrace.version === "1.0.0"`
  - [ ] Shadow root on `#zeus-trace-host`
- **Known issues**: Leftover `static/trace.js` is unused.
- **Logging & observability**: Browser console `[ZeusTrace] Failed to mount widget`

## 6. Related Artifacts
- **Files changed / owned by this feature**:
  - `scripts/vendor_trace.sh`
  - `src/travel_planner/static/zeus_client_chat_trace.js`
  - `src/travel_planner/static/zeus_client_chat_trace.js.map`
  - `src/travel_planner/templates/index.html`
- **Tickets**: none
- **Commits**: (fill at merge)
- **Pull requests**: none

## 7. Changelog
| Date | Author | Change |
|------|--------|--------|
| 2026-08-25 | Grok | Pin vendored inspector 1.0.0; drop CDN `latest` |
