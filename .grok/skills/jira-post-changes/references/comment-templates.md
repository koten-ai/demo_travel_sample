# Jira Comment Templates

Copy and fill in. Remove sections that don't apply. Keep `[bracketed]` placeholders out of the final comment.

---

## Root Cause Analysis (Bug only — separate comment)

```markdown
## Root Cause Analysis

**Issue:** [One-line description of the defect and user-visible impact]

### Symptoms
- [What users or systems experienced]
- [Error messages, failed flows, or incorrect behavior]

### Root Cause
[Clear explanation of the underlying defect — the "why", not the fix. Name the faulty assumption, missing check, race condition, misconfiguration, etc.]

### Contributing Factors
- [Factor 1 — e.g. missing validation on edge case]
- [Factor 2 — e.g. timeout too aggressive under load]
- [Omit section if none]

### Discovery
- **How found:** [Manual test / customer report / CI failure / code review]
- **Reproduction:** [Brief steps or conditions required to reproduce]

### Prevention
- [Optional: monitoring, test gap closed, guard added — keep brief; implementation detail goes in Detailed Changes]
```

---

## Detailed Changes (all issue types)

```markdown
## Detailed Changes

**Summary:** [1–2 sentences describing what was implemented or fixed]

### Changes
#### [Area / component name]
- `path/to/file.py` — [What changed and why]
- `path/to/other.ts` — [What changed and why]

#### [Another area]
- `path/to/file` — [Change description]

### Testing
- [ ] [Test command or scenario — e.g. `pytest tests/test_setup.py` — all pass]
- [ ] [Manual verification step]
- [ ] [Edge case verified]

### Risks & Follow-ups
- [Known limitations or deferred work — omit if none]

### References
- Branch: `[branch-name]`
- PR: [link if available]
- Commits: `[short sha]` — [message]
```

---

## Example: Bug fix (two comments)

### Comment 1 — RCA

```markdown
## Root Cause Analysis

**Issue:** Setup wizard redirected to dashboard before configuration was persisted, leaving new installs in a broken state.

### Symptoms
- Fresh install completed the wizard UI but API returned 503 on first request
- `config.json` missing required `provider` field after wizard "finished"

### Root Cause
The `/api/setup/complete` endpoint returned success before `save_config()` flushed to disk. A race between the redirect and the async write meant the frontend navigated away while persistence was still in flight; on slow disks the write never completed before process restart.

### Contributing Factors
- No transaction or fsync guarantee on config save
- Frontend treated HTTP 200 as "fully configured" without polling setup status

### Discovery
- **How found:** Integration test `test_setup_status.py` flaky on CI (fails ~30% on Windows runners)
- **Reproduction:** Run wizard E2E with artificial 2s delay injected before fsync

### Prevention
- Added post-save verification read before returning success
```

### Comment 2 — Detailed Changes

```markdown
## Detailed Changes

**Summary:** Made setup completion synchronous and added a status poll gate before redirecting the wizard.

### Changes
#### API / persistence
- `python3/setup.py` — `complete_setup()` now blocks until config is written and re-read; raises on verification failure
- `python3/api/routes.py` — `/api/setup/complete` returns 500 with detail if save fails instead of silent success

#### Frontend
- `templates/setup-wizard.html` — Polls `/api/setup/status` after complete; redirects only when `configured=true`

#### Tests
- `tests/test_setup.py` — Added regression test for delayed-write race
- `tests/test_api_routes.py` — Asserts 500 on save failure path

### Testing
- [x] `pytest tests/test_setup.py tests/test_api_routes.py` — 24 passed
- [x] Manual wizard flow on Docker compose fresh volume

### References
- Branch: `feature/ZC-21-setup-wizard`
```

---

## Example: Story / Task (one comment)

```markdown
## Detailed Changes

**Summary:** Added provider selection step to the setup wizard with validation and persisted choice.

### Changes
#### Setup wizard UI
- `templates/setup-wizard.html` — New step 2 for LLM provider pickers; validates API key format client-side

#### Backend
- `python3/setup.py` — Persists `provider` and `api_key` fields; validates against supported provider list
- `python3/api/routes.py` — `GET /api/setup/providers` returns available providers

### Testing
- [x] `pytest tests/test_setup.py` — all pass
- [x] Verified wizard flow end-to-end in local Docker

### References
- Branch: `feature/ZC-21-setup-wizard`
```