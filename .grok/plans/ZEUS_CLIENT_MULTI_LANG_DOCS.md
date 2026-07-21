# Plan: Zeus Client Multi-Language Docs Layout

**Date**: 2026-07-15  
**Task**: Scaffold multi-language GitBook docs for Zeus Client (Python, Node, C#, Java) on site_jqufk  
**Priority**: High  
**Estimated Effort**: Scaffold complete; site wiring ~1 hour manual

## 1. Context & Requirements
- **Goal**: Parallel language variants for Zeus Client under GitBook site `site_jqufk`, with Python as default/GA and Node/C#/Java as scaffolded trees
- **Constraints**: GitBook MCP is read-only; spaces are git-locked; `koten_docs` is private and not cloneable from this environment
- **Assumptions**: Content updates ship via git sync to `koten-ai/koten_docs`; site variants are wired in GitBook UI
- **Out of Scope**: Implementing real Node/C#/Java SDKs; creating GitBook spaces via API; publishing site changes without human UI steps

## 2. Analysis & Research
- Key files explored:
  - Space `4QKwtwb9eXDpzPLyT2Vg` (Zeus Client Python) — full page tree
  - Site URL: `https://app.gitbook.com/o/eZsLfn2QedPPldZe5eLl/sites/site_jqufk/s/4QKwtwb9eXDpzPLyT2Vg/...`
  - Live pages: Home, Getting started, Concepts, Agent loop, Contracts, Hooks, Integration, With Zeus, Compatibility, FAQ, Diagrams, Versions
- Potential risks/edge cases:
  - Git sync currently points at repo root (flat paths) → Mitigation: MIGRATION.md Option A/B
  - Scaffold APIs may not match final package symbols → Mitigation: warning hints on non-Python pages
  - CDN image URLs break offline → Mitigation: relative `assets/images/` + downloaded SVGs
- Alternatives considered: single-space language folders (worse picker UX); section-per-language (Ultimate + duplication)

## 3. Step-by-Step Implementation Plan
1. **Export live Python content** — Done via GitBook MCP
2. **Scaffold monorepo trees** — Done under `koten_docs_scaffold/zeus-client/{python,node,csharp,java}/`
3. **Update Python Home with Languages table** — Done
4. **Document site wiring** — Done (`SITE_STRUCTURE.md`, `MIGRATION.md`)
5. **Human: merge into koten_docs + create spaces + variants** — Pending
6. **Human: re-point Python git sync path (Option A)** — Pending

## 4. Verification & Rollback
- **Tests**:
  - [ ] Open each language SUMMARY tree — same page order/slugs
  - [ ] Python Getting started still runs against real package
  - [ ] Diagrams load via relative assets after git sync
  - [ ] Variant switcher on site_jqufk lands on equivalent path
- **Review Checklist**:
  - [x] Scaffold created
  - [x] Feature guide created in `.grok/guides/ZEUS_CLIENT_MULTI_LANG_DOCS.md`
  - [ ] Merged to koten_docs
  - [ ] Site variants live
- **Rollback Plan**: Keep Python space on previous git revision; remove new variant spaces from site structure (spaces themselves can remain)

## 5. Open Questions / Decisions Needed
- Confirm package names for Node (`@koten-ai/zeus-client`), C# (`KotenAI.ZeusClient`), Java (`ai.koten:zeus-client`)
- Confirm whether to re-point Python git sync to `zeus-client/python` now or later (Option A vs B)
- When do Node/C#/Java go from Scaffold → GA?

---
