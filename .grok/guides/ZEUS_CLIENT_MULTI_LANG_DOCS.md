# Guide: Zeus Client Multi-Language GitBook Docs

**Date**: 2026-07-15  
**Feature**: Multi-language Zeus Client documentation layout (Python / Node / C# / Java) for GitBook site_jqufk  
**Status**: Active (scaffold ready; site wiring pending)  
**Related Plan**: `.grok/plans/ZEUS_CLIENT_MULTI_LANG_DOCS.md`

## 1. Overview
- **Purpose**: Document Zeus Client across programming languages with a parallel page tree and GitBook **variants** (not a single mixed-language TOC).
- **Scope**: Docs structure, content scaffold, migration notes. Excludes SDK implementation itself.
- **Entry points**:
  - Live Python: https://app.gitbook.com/o/eZsLfn2QedPPldZe5eLl/sites/site_jqufk/s/4QKwtwb9eXDpzPLyT2Vg/zeus-client-python/readme
  - Scaffold: `koten_docs_scaffold/` in this workspace

## 2. Architecture & Flow
- **High-level flow**:
  1. Author markdown per language under `zeus-client/<lang>/`
  2. GitBook space git-syncs that folder
  3. Site `site_jqufk` links spaces as **variants** of section **Zeus Client**
  4. Readers pick language in the variant switcher; same slugs keep orientation
- **Key components**:
  - `koten_docs_scaffold/zeus-client/python/` — GA content exported + Languages table on Home
  - `koten_docs_scaffold/zeus-client/{node,csharp,java}/` — scaffold trees
  - `koten_docs_scaffold/SITE_STRUCTURE.md` — GitBook UI wiring
  - `koten_docs_scaffold/MIGRATION.md` — merge into private `koten_docs`
- **Data flow**: Source of truth = git (`koten_docs`) → GitBook revision via git sync → published site
- **Dependencies**: GitBook Pro org, git sync GitHub installation, site structure variants feature

### Target site structure

```
site_jqufk
└── Section: Zeus Client
    ├── Variant: Python (default)  → 4QKwtwb9eXDpzPLyT2Vg
    ├── Variant: Node
    ├── Variant: C#
    └── Variant: Java
```

### Parallel page tree (all languages)

```
README.md
getting-started.md
concepts.md
agent-loop.md
contracts-and-catalog.md
hooks-and-policy.md
integration-tips.md
with-zeus.md
compatibility.md
faq.md
diagrams.md
versions.md
```

## 3. Setup
- **Prerequisites**: Access to `koten-ai/koten_docs`, GitBook admin on site_jqufk
- **Environment variables**: N/A for docs authoring
- **Install / bootstrap steps**:
  1. Copy `koten_docs_scaffold/zeus-client/` into `koten_docs`
  2. Follow `MIGRATION.md` Option A or B
  3. Follow `SITE_STRUCTURE.md` for variants
- **Configuration**: Each language folder has `.gitbook.yaml` + `SUMMARY.md`
- **Verification**: After git sync, open each variant Home and confirm Languages table + diagrams

## 4. How to Use
- **Primary workflow (authors)**:
  1. Edit the language folder that matches the SDK release
  2. Keep conceptual pages parallel; localize only install/API/integration
  3. Commit/push; trigger git sync if needed
- **Primary workflow (readers)**:
  1. Open Zeus Client docs
  2. Use variant switcher for language
  3. Follow Getting started → Agent loop → Hooks
- **Edge cases**: Scaffold languages show warning hints until package GA
- **Limitations**: Cannot create spaces/variants via current MCP; private repo not accessible from this agent host

## 5. Debugging & Known Issues
- **Common symptoms → causes → fixes**:

  | Symptom | Likely Cause | Fix |
  |---------| |--------------|-----|
  | Space not found for space ID hex hash | That was not a space ID | Use `4QKwtwb9eXDpzPLyT2Vg` / site_jqufk |
  | Git sync overwrites wrong tree | Path still repo root | Set sync path to `zeus-client/python` |
  | Broken diagrams after move | Absolute CDN URLs only | Use relative `assets/images/` (scaffold does) |
  | Variant switcher 404 | Different slugs per language | Keep identical SUMMARY order/slugs |

- **Debug checklist**:
  - [ ] Space git sync URL + path
  - [ ] Site Structure variant order / default
  - [ ] SUMMARY.md matches across languages
  - [ ] Assets present under each language `assets/images/`
- **Known issues**:
  - **Private koten_docs** — scaffold lives in workspace until manually copied
  - **MCP read-only** — no automated page push to GitBook
- **Logging & observability**: GitBook change requests / git sync status on space

## 6. Related Artifacts
- **Files changed / owned by this feature**:
  - `koten_docs_scaffold/**` — full multi-lang scaffold
  - `.grok/plans/ZEUS_CLIENT_MULTI_LANG_DOCS.md` — plan
  - `.grok/guides/ZEUS_CLIENT_MULTI_LANG_DOCS.md` — this guide
- **Tickets**: None linked
- **Commits**: Pending (local scaffold only)
- **Pull requests**: N/A until merge to koten_docs

## 7. Changelog
| Date | Author | Change |
|------|--------|--------|
| 2026-07-15 | agent | Initial scaffold + guide from live Python space export |
