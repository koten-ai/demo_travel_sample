# Plan: Pin Zeus Tracer 1.2.0

**Date**: 2026-09-02
**Status**: Superseded by `../zeus_client_chat_trace/.grok/plans/PUBLISH_CDN_1_2_3.md` (current pin **1.2.3**)
**Task**: Pin TravelPlan to the vendored `zeus_client_chat_trace@1.2.0` inspector instead of CDN `latest`.
**Priority**: High
**Estimated Effort**: 0.5 hours / 3 steps

## 1. Context & Requirements
- **Goal**: `templates/index.html` loads `/static/zeus_client_chat_trace.js?v=1.2.0`. That file is the sibling repo’s 1.2.0 inspector (DaisyUI Detective IA, title **Turn traces**), not CDN `latest`.
- **Constraints**: Keep Flask/BFF and `appendTraceCard` contract. Widget kill switch still defaults off (`?debug=true`).
- **Assumptions**: `../zeus_client_chat_trace` is the source of truth; `dist/` is built at 1.0.0.
- **Out of Scope**: Publishing CDN, changing `app.js` search flow, removing leftover `static/trace.js`.

## 2. Analysis & Research
- Key files explored: `templates/index.html`, `static/zeus_client_chat_trace.js` (0.1.6), `static/app.js`, sibling `zeus_client_chat_trace/package.json` (1.0.0)
- Potential risks/edge cases:
  - CDN `latest` in the working tree would ignore local inspector work → Mitigation: vendor + `?v=1.0.0`
  - Browser cache of old `/static/` file → Mitigation: query pin
  - Detective link hidden without Hub → Mitigation: set `hubBaseUrl` to local Hub origin
- Alternatives considered: Pin CDN `…/1.0.0/…` (not published with this working tree) vs vendor the built bundle (this plan).

## 3. Step-by-Step Implementation Plan
1. **Copy bundle**
   - Files to change: `src/travel_planner/static/zeus_client_chat_trace.js`, `.map`
   - Changes: copy from `../zeus_client_chat_trace/dist/`
   - Commands to run: `bash scripts/vendor_trace.sh`
   - Tests needed: [ ] grep `1.0.0` in the vendored file

2. **Pin script tag**
   - Files to change: `src/travel_planner/templates/index.html`
   - Changes: `/static/zeus_client_chat_trace.js?v=1.0.0`; `hubBaseUrl`
   - Tests needed: [ ]

3. **Docs**
   - Files to change: `README.md`, `.grok/guides/PINNED_TRACE_WIDGET.md`, `.grok/guides/TRAVEL_PLANNER.md`
   - Changes: how to re-vendor; `?debug=true`
   - Tests needed: [ ]

## 4. Verification & Rollback
- **Tests**: vendored JS embeds `He="1.0.0"` and `.tt-panel`; no DaisyUI CDN; index pin `?v=1.0.0`
- **Review Checklist**:
  - [x] Code style/linting passes
  - [x] No breaking changes
  - [x] Feature guide created or updated in `.grok/guides/PINNED_TRACE_WIDGET.md`
- **Rollback Plan**: restore previous `static/zeus_client_chat_trace.js*` and CDN/`/static/` script tag

## 5. Open Questions / Decisions Needed
- None — vendoring matches commit `1edfd8a` (switch debug panel to vendored widget).
