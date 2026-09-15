# Plan: Add BSD-3-Clause License

**Date**: 2026-09-15
**Task**: Add a BSD-3-Clause license to the demo_travel_sample repository.  
**Priority**: Medium  
**Estimated Effort**: 0.5 hours / 3 steps

## 1. Context & Requirements
- **Goal**: Repo has a standard `LICENSE` file, package metadata declares `BSD-3-Clause`, and README points to the license.
- **Constraints**: Use SPDX identifier `BSD-3-Clause`; copyright holder `Koten AI` (org that owns `github.com/koten-ai`).
- **Assumptions**: Copyright year 2026 matches repo first commit (2026-07-01).
- **Out of Scope**: Relicensing dependencies; GitHub UI license detection verification beyond file presence.

## 2. Analysis & Research
- Key files explored: `README.md`, `pyproject.toml`, `src/travel_planner.egg-info/PKG-INFO`, repo root listing
- Potential risks/edge cases:
  - Wrong copyright holder name → Mitigation: use org name from remote (`koten-ai`) / README ("Koten AI")
  - setuptools rejects `license` field shape → Mitigation: use PEP 639 string form supported by setuptools>=69
- Alternatives considered: MIT (simpler) vs BSD-3-Clause (user-requested)

## 3. Step-by-Step Implementation Plan
1. **Add LICENSE file**  
   - Files to change: `LICENSE`
   - Changes: Full BSD 3-Clause text with `Copyright (c) 2026 Koten AI`
   - Commands to run: none
   - Tests needed: [ ] File present and non-empty

2. **Declare license in package metadata**  
   - Files to change: `pyproject.toml`
   - Changes: `license = "BSD-3-Clause"`, `license-files = ["LICENSE"]`
   - Commands to run: none
   - Tests needed: [ ] Fields parse under setuptools

3. **Update README License section**  
   - Files to change: `README.md`
   - Changes: Replace "Internal demo..." with link to `LICENSE`
   - Commands to run: none
   - Tests needed: [ ] Section links to LICENSE

## 4. Verification & Rollback
- **Tests**: Confirm `LICENSE` exists; `pyproject.toml` has SPDX id; README links to license file
- **Review Checklist**:
  - [x] Code style/linting passes (N/A — docs/metadata only)
  - [x] No breaking changes
  - [x] Feature guide created or updated in `.grok/guides/BSD_3_CLAUSE_LICENSE.md`
- **Rollback Plan**: Delete `LICENSE`; revert `pyproject.toml` and `README.md` license edits

## 5. Open Questions / Decisions Needed
- None — copyright holder set to Koten AI per org remote and prior README wording.
