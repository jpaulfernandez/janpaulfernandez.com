# janpaulfernandez.com — Implementation Plan

Source of truth for build order and completion status. The live work is the **v3 rebuild**: what to build is in [rebuild-plan.md](rebuild-plan.md), how to build it is in [docs/rebuild/](docs/rebuild/README.md). Phases 1–30 (the v1/v2 build, July–September 2026) are archived verbatim in [docs/archive/plan-phases-1-30.md](docs/archive/plan-phases-1-30.md).

## How to use this file (for any coding agent: Claude, Gemini, GPT)

1. Find the first unchecked task below. Tasks run in order; do not start a phase before the previous one is checked off.
2. Open the linked phase file in `docs/rebuild/`. Each task there has files, steps and a "Done when"; each phase ends with a **Definition of Done**.
3. Do only what the task says. If a task seems to require work not listed, stop and flag it — don't expand scope.
4. When a task's "Done when" passes, mark its checkbox here `[x]` and append the completion date, e.g. `[x] (2026-11-02)`. Check the phase's DoD box last.
5. Never check a box with failing builds, failing tests, or partial work.

Phases are vertical slices: each ends with a deployable, visibly-improved site.

---

## Blocked-on-Paul items

Carried forward from the archived tracker on 2026-10-29; items the rebuild makes moot were left in the archive.

- **GA4 vs. spec §8 (decision needed, not a bug).** `BaseLayout` ships the gtag script on every page. Spec §8 called for Plausible/Umami with no cookie banner, and GA4 technically wants consent under ePrivacy/GDPR. Stays as-is through the rebuild (rebuild-plan R8).
- **Unconsumed CMS fields.** `thoughts.stage` (passed to `PostListItem`, then ignored) and the `seo` singleton (read by nothing) are still authored but unused. Render or delete — both schema files together. (`services.icon`, `gallery.featured` and `gallery.licensingAvailable` are deleted by Phases 32 and 35.)
- **Cloudflare Images migration for the gallery (not started — needs credentials).** `src/assets/gallery` is 68 MB; `.git` is 310 MB. Blocked on a Cloudflare account ID + API token. Out of scope for the rebuild.
- **Before the program is announced (not before it is merged):** BIR registration and official receipts before the first corporate invoice; written MMDC employer clearance covering outside work and public use of title and history.
- **Wikidata item** (Phase 30 B2): create it and add the Q-ID to `sameAs`. Off-site, no code.

## v3 rebuild (approved 2026-10-29)

- [x] (2026-10-29) Paul approves `rebuild-plan.md` — all ten §11 items answered; R1/R2/R4 approved; program prices on enquiry; modes "message for a quote"; based in Manila
- [x] (2026-10-29) Implementation plan written: [docs/rebuild/](docs/rebuild/README.md)

### Phase 31 — Foundation · [phase file](docs/rebuild/phase-31-foundation.md)

- [x] (2026-10-29) 31.0 Housekeeping: pending T30 diff committed or stashed; tag `v2-final`
- [x] (2026-10-29) 31.1 Fonts: Fraunces, Inter, JetBrains Mono
- [x] (2026-10-29) 31.2 Tokens: `@theme` rewrite
- [x] (2026-10-29) 31.3 `global.css` rewrite
- [x] (2026-10-29) 31.4 Remove GSAP and `motion.ts`
- [ ] 31.5 Utility sweep (old ink/paper/wine → v3 tokens)
- [ ] 31.6 OG route re-theme
- [ ] 31.7 CLAUDE.md constraints + colophon updated to v3
- [ ] 31.8 BaseLayout nav and footer
- [ ] 31.9 Verify + Paul's visual review
- [ ] **Phase 31 Definition of Done**

### Phase 32 — Work with me + program · [phase file](docs/rebuild/phase-32-work-with-me-program.md)

- [ ] 32.1 Schemas: `program` collection + singleton, `workWithMe.modes[]`
- [ ] 32.2 Program copy entered from doc 09 / doc 07
- [ ] 32.3 Service + FAQPage structured data
- [ ] 32.4 `/work-with-me/` rewrite
- [ ] 32.5 Program overview + tier pages
- [ ] 32.6 Retire `/workshops` (courses, services, redirects)
- [ ] 32.7 llms.txt, HTML sitemap, OG, meta descriptions
- [ ] 32.8 Verify
- [ ] **Phase 32 Definition of Done**

### Phase 33 — Projects · [phase file](docs/rebuild/phase-33-projects.md)

- [ ] 33.1 `src/lib/projects.ts` helpers, tests first
- [ ] 33.2 Projects schema replaced; Oddhalls migrated to MDX
- [ ] 33.3 Generic project page template
- [ ] 33.4 Projects index with kind filter
- [ ] 33.5 Seed entries
- [ ] 33.6 Structured data, llms.txt, sitemap
- [ ] 33.7 Verify
- [ ] **Phase 33 Definition of Done**

### Phase 34 — Home + About + Now · [phase file](docs/rebuild/phase-34-home-about-now.md)

- [ ] 34.1 Home singleton fields
- [ ] 34.2 Home page sections
- [ ] 34.3 Portrait crop
- [ ] 34.4 About
- [ ] 34.5 Now re-skin
- [ ] 34.6 Verify
- [ ] **Phase 34 Definition of Done**

### Phase 35 — Gallery · [phase file](docs/rebuild/phase-35-gallery.md)

- [ ] 35.1 `libraryOrder()`, tests first; masonry packer removed
- [ ] 35.2 Gallery schema: `photos[].date`, dead fields deleted
- [ ] 35.3 Library grid
- [ ] 35.4 Density control (buttons, wheel, keys, pinch)
- [ ] 35.5 Viewer with pinch-zoom
- [ ] 35.6 Set pages re-skin
- [ ] 35.7 Verify (Paul: real iPhone + Android)
- [ ] **Phase 35 Definition of Done**

### Phase 36 — Thoughts re-skin + launch · [phase file](docs/rebuild/phase-36-thoughts-launch.md)

- [ ] 36.1 Article blocks + ArticleLayout
- [ ] 36.2 Thoughts index, topics, remaining pages
- [ ] 36.3 Lighthouse ≥ 95 ×4 on five URLs
- [ ] 36.4 spec.md, CLAUDE.md, voice.md, memory updated
- [ ] 36.5 Whole-rebuild Definition of Done (rebuild-plan §9)
- [ ] 36.6 Launch (Paul)
- [ ] **Phase 36 Definition of Done**

## Out of scope — do not build

See [rebuild-plan.md §10](rebuild-plan.md). Also still out: Idea Graveyard, backlinks/hover previews, search, library page, webmentions, newsletter, footnotes/sidenotes.
