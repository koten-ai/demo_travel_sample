# Guide: Pinned Zeus Tracer Widget

**Date**: 2026-09-08
**Feature**: TravelPlan vendors `zeus_client_chat_trace@1.2.3` and loads it from `/static/`, not CDN `latest`
**Status**: Deprecated / Superseded by `.grok/guides/CDN_TRACE_WIDGET.md`
**Related Plan**: `.grok/plans/CDN_TRACE_WIDGET_LATEST.md` (current); historical pin: widget `../zeus_client_chat_trace/.grok/plans/PUBLISH_CDN_1_2_3.md`

TravelPlan now loads CDN `latest`. Keep this guide only as the rollback recipe (restore vendored JS + `/static/…?v=`).

## 1. Overview
- **Purpose**: Freeze the inspector UI TravelPlan ships so CDN `latest` cannot change it out from under the demo.
- **Scope**: Vendored JS + script tag pin. Does not publish Spaces or replace Flask BFF.
- **Entry points**: `GET /` → `templates/index.html` → `/static/zeus_client_chat_trace.js?v=1.2.3`

## 2. Architecture & Flow
- **High-level flow**:
  1. Sibling `../zeus_client_chat_trace` is built (`npm run build`).
  2. `scripts/vendor_trace.sh` copies `dist/zeus_client_chat_trace.js` (+ `.map`) into `src/travel_planner/static/`.
  3. Index sets `ZeusTraceConfig.toolOrder` (server) and `hubBaseUrl`, then loads the pinned script.
  4. `app.js` calls `appendTraceCard(query, data)` after `/api/search`.
  5. Widget mounts only when `?debug=true` (or `enabled: true`). `app.js` also forwards that page flag to `POST /api/search?debug=true` so the BFF opts the turn into Zeus rewind (see `.grok/guides/DEBUG_QUERY_REWIND.md`).
- **Key components**:
  - `scripts/vendor_trace.sh` — rebuild + copy
  - `src/travel_planner/static/zeus_client_chat_trace.js` — pinned 1.2.3 inspector (DaisyUI Detective IA + Turn traces UI detail)
  - `src/travel_planner/templates/index.html` — script tag `?v=1.2.3`
  - `src/travel_planner/static/app.js` — `appendTraceCard`
- **Data flow**: `/api/search` JSON (`trace` or `debug`) → `appendTraceCard`
- **Dependencies**: Node only when re-vendoring; runtime is the copied IIFE.

## 3. Setup
- **Prerequisites**: Sibling `../zeus_client_chat_trace`, Node 18+ to re-vendor
- **Environment variables**: none at TravelPlan runtime
- **Install / bootstrap steps**:
  1. `cd ../zeus_client_chat_trace && npm install && npm run build` (or use the script below)
  2. `./scripts/vendor_trace.sh`
  3. Confirm index.html uses `/static/zeus_client_chat_trace.js?v=1.2.3`
- **Configuration**: `window.ZeusTraceConfig.hubBaseUrl` (default `http://127.0.0.1:9091` for Detective). `toolOrder` injected by Flask.
- **Verification**: Open http://localhost:5050/?debug=true (Compose) or :5000; lightning toggle bottom-left; title **Turn traces**; turn dropdown above tabs; footer `v1.2.3`.

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
  | Old dark DevTools tabs / CDN latest | Stale vendor or index still on jsDelivr | Re-run `vendor_trace.sh`; script src must be `/static/…?v=1.2.3` |
  | Footer not `v1.2.3` | Cached JS | Hard refresh; bump `?v=` |
  | Detective hidden | Hub origin wrong | Set `hubBaseUrl` to the Hub the **browser** can reach |
- **Debug checklist**:
  - [ ] Network: `/static/zeus_client_chat_trace.js?v=1.2.3` 200
  - [ ] `ZeusTrace.version === "1.2.3"`
  - [ ] Inspector title is **Turn traces**; tabs include Overview / Diagnosis / Tools
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
| 2026-09-08 | Grok | Deprecated: TravelPlan now loads CDN `latest` (see `CDN_TRACE_WIDGET.md`) |
| 2026-09-08 | Grok | Pin vendored inspector **1.2.3** (Turn traces UI detail); CDN also has `…/1.2.3/` + `latest` |
| 2026-09-04 | Grok | Pin vendored inspector **1.2.2** (active-row stacking + title inset); CDN also has `…/1.2.2/` + `latest` |
| 2026-09-03 | Grok | Pin vendored inspector **1.2.1** (turn dropdown); CDN also has `…/1.2.1/` + `latest` |
| 2026-09-02 | Grok | Pin vendored inspector **1.2.0** (DaisyUI Detective IA); restore `/static/` script (was CDN latest) |
| 2026-08-25 | Grok | Pin vendored inspector 1.0.0; drop CDN `latest` |
| 2026-09-02 | Grok | Page `?debug=true` also forwards onto `/api/search` for Zeus rewind |
