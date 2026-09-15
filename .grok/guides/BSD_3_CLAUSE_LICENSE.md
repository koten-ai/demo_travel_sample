# Guide: BSD-3-Clause License

**Date**: 2026-09-15
**Feature**: Repository licensed under BSD 3-Clause
**Status**: Active
**Related Plan**: `.grok/plans/ADD_BSD_3_CLAUSE_LICENSE.md`

## 1. Overview
- **Purpose**: Make redistribution and reuse terms explicit via a standard open-source license.
- **Scope**: Root `LICENSE` file, `pyproject.toml` package metadata, and README license section. Does not cover third-party dependency licenses.
- **Entry points**: `LICENSE`, `pyproject.toml` (`license` / `license-files`), `README.md` (License section)

## 2. Architecture & Flow
- **High-level flow**:
  1. Full license text lives in `LICENSE` at the repo root.
  2. Packaging metadata in `pyproject.toml` declares SPDX `BSD-3-Clause` and includes `LICENSE` in the distribution.
  3. README links readers to the license file.
- **Key components**:
  - `LICENSE` — Canonical BSD 3-Clause text and copyright notice
  - `pyproject.toml` — SPDX identifier and license-files for packaging
  - `README.md` — Human-facing license pointer
- **Data flow**: N/A
- **Dependencies**: None (legal/docs only)

## 3. Setup
- **Prerequisites**: None
- **Environment variables**: None
- **Install / bootstrap steps**: N/A
- **Configuration**: Copyright line in `LICENSE` is `Copyright (c) 2026 Koten AI`
- **Verification**: Confirm `LICENSE` exists and `pyproject.toml` contains `license = "BSD-3-Clause"`

## 4. How to Use
- **Primary workflow**:
  1. Open `LICENSE` for full terms.
  2. When packaging or publishing, ensure `license-files = ["LICENSE"]` remains so the file ships with the package.
- **Examples**: See SPDX identifier `BSD-3-Clause` in `pyproject.toml`
- **Edge cases**: Dependency packages (e.g. Flask, httpx, `kotenai-zeus-client`) keep their own licenses
- **Limitations**: Does not grant trademark rights to the "Koten AI" name (clause 3)

## 5. Debugging & Known Issues
- **Common symptoms → causes → fixes**:
  | Symptom | Likely Cause | Fix |
  |---------|--------------|-----|
  | GitHub shows "No license" | `LICENSE` missing or misnamed | Ensure root file is named `LICENSE` |
  | Package build omits license | `license-files` missing | Keep `license-files = ["LICENSE"]` in `pyproject.toml` |
- **Debug checklist**:
  - [ ] `LICENSE` present at repo root
  - [ ] `pyproject.toml` has `license = "BSD-3-Clause"`
  - [ ] README License section links to `LICENSE`
- **Known issues**: None
- **Logging & observability**: N/A

## 6. Related Artifacts
- **Files changed / owned by this feature**:
  - `LICENSE` — BSD 3-Clause license text
  - `pyproject.toml` — SPDX license metadata
  - `README.md` — License section
  - `.grok/plans/ADD_BSD_3_CLAUSE_LICENSE.md` — Implementation plan
- **Tickets**: None
- **Commits**: Pending until committed
- **Pull requests**: None

## 7. Changelog
| Date | Author | Change |
|------|--------|--------|
| 2026-09-15 | agent | Initial guide; added BSD-3-Clause to repo |
