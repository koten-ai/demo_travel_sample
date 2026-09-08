# Plan: Load Zeus Tracer from CDN latest

**Date**: 2026-09-08
**Task**: Stop vendoring `zeus_client_chat_trace` and always load the public CDN `latest` bundle.
**Priority**: Medium
**Estimated Effort**: 0.5 hours / 4 steps

## 1. Context & Requirements
- **Goal**: TravelPlan’s debug inspector is the current published `zeus_client_chat_trace` **latest** pointer. `templates/index.html` does not load `/static/zeus_client_chat_trace.js`. Footer / `ZeusTrace.version` follow whatever CDN `latest` currently is.
- **Constraints**: Keep embed API (`appendTraceCard`, `ZeusTraceConfig`, `?debug=true` kill switch). Match demo_yelp’s CDN URL. Do not change Flask BFF / search.
- **Assumptions**: `https://koten-static-cdn.nyc3.cdn.digitaloceanspaces.com/zeus_client_chat_trace/latest/zeus_client_chat_trace.js` is published and reachable from the browser.
- **Out of Scope**: Publishing Spaces from this repo; changing `app.js` search flow; removing leftover `static/trace.js`.

## 2. Analysis & Research
- Key files explored: `templates/index.html`, `scripts/vendor_trace.sh`, `.grok/guides/PINNED_TRACE_WIDGET.md`, `demo_yelp/frontend/src/lib/trace.ts`
- Potential risks/edge cases:
  - CDN `latest` can change inspector UI without a TravelPlan deploy → accepted; that is the request
  - Offline / blocked CDN → debug panel missing → Mitigation: document URL + publish path
  - Browser cache of old `/static/` pin → Mitigation: remove vendored files and change script `src`
- Alternatives considered: Re-vendor the newest sibling build (one-shot pin) vs CDN `latest` (always current). Chose CDN `latest`.

## 3. Step-by-Step Implementation Plan
1. **Script tag**
   - Files to change: `src/travel_planner/templates/index.html`
   - Changes: load CDN `…/zeus_client_chat_trace/latest/zeus_client_chat_trace.js`
   - Tests needed: [x] index HTML contains CDN latest URL, not `/static/zeus_client_chat_trace.js`

2. **Stop vendoring**
   - Files to change: `scripts/vendor_trace.sh`, `src/travel_planner/static/zeus_client_chat_trace.js`, `.map`
   - Changes: stub the vendor script (demo_yelp pattern); delete copied bundle
   - Commands to run: `git rm` the vendored JS
   - Tests needed: [ ]

3. **Docs**
   - Files to change: `README.md`, `.grok/guides/PINNED_TRACE_WIDGET.md`, `.grok/guides/CDN_TRACE_WIDGET.md`, `.grok/guides/TRAVEL_PLANNER.md`, `.grok/guides/ZEUS_CLIENT_V2_BFF.md`
   - Changes: pin guide deprecated; new CDN guide; README how-to is publish, not copy
   - Tests needed: [ ]

4. **Verify**
   - Commands: `pytest tests/test_app.py`; curl homepage + CDN; Compose bind-mount picks up HTML
   - Tests needed: [x] `test_index_renders` asserts CDN script

## 4. Verification & Rollback
- **Tests**: `pytest tests/test_app.py` (12 passed); GET `/` includes CDN latest script; CDN URL returns 200 (`Nn="1.2.3"` in current pointer)
- **Review Checklist**:
  - [x] Code style/linting passes
  - [x] No breaking changes to embed API
  - [x] Feature guide created or updated in `.grok/guides/CDN_TRACE_WIDGET.md`
- **Rollback Plan**: restore vendored JS + `/static/zeus_client_chat_trace.js?v=<semver>` script tag (see `.grok/guides/PINNED_TRACE_WIDGET.md`).

## 5. Open Questions / Decisions Needed
- None — “always latest” means the CDN `latest` pointer, not a new pin.

---
