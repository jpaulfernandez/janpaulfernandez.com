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
- **Phase 32 copy review (32.2).** Confirm the founding-offer terms text; confirm the facilitator proof points (the MMDC "former IT Manager" and Master's lines from the program spec were left out because `about.md` contradicts them: TODO(Paul)); review the six Work-with-me FAQ answers and the mode copy (drafted, not authored by Paul). See `docs/rebuild/notes/phase-32.md`.
- **Phase 32 live checks (need a Vercel preview, README rule 9).** (a) Web3Forms test submission on `/work-with-me/` lands on `/thanks/` — sends one email to Paul, tell him first (32.4). (b) The seven old URLs (`/workshop`, `/workshops`, `/workshops/`, `/workshops/ai-fluency/`, `/workshops/leadership-ai/`, `/workshops/ai-for-business/`, `/workshops/vibe-coding/`) each return one-hop 301 to the target in `astro.config.mjs`, `#advise` surviving. (c) Paste `/work-with-me/` and one tier page into validator.schema.org and Google's Rich Results Test (JSON-LD parses locally: Service x4, FAQPage). The built `.vercel/output/config.json` matches the table, but its sources are slash-less (`^/workshops/ai-fluency$`) and sit behind the adapter's no-slash-to-slash 308 rule, so Vercel may need an extra entry per slash form if a hop is added (32.8).
- **Phase 33 seed entries (33.5).** (a) Confirm the seven-entry list (kind, year, summary), and whether PHVote 2019 and 2022 stay two entries. (b) Rappler CMS migration year is a PLACEHOLDER `2023` (the repo gives only the 2018-2023 tenure); entry ships only if Paul accepts it or supplies the year. (c) Anakloud role `Tech lead` rests on rebuild-plan.md:139 only; confirm. (d) The AIM capstone is NOT seeded: Paul has not named it. (e) Oddhalls `<title>` changed from "Oddhalls — Local-first photo editor & photobook designer" to "Oddhalls — Paul Fernandez" (33.2/33.3); confirm, or put the descriptor back into the frontmatter `title`. See `docs/rebuild/notes/phase-33.md`.
- **Phase 35 (gallery).** (a) 35.7: pinch on the grid and in the viewer tested on a real iPhone (Safari) and Android (Chrome); also confirm the white viewer ground. (b) Optional: per-photo dates (`photos[].date`) for any new shoot; the 95 existing photos have no date data (EXIF stripped) and use their set's date. See `docs/rebuild/notes/phase-35.md`.
- **Wikidata item** (Phase 30 B2): create it and add the Q-ID to `sameAs`. Off-site, no code.
- Phase 31 visual review (31.9 last box / Phase 31 DoD) — main is local-only, nothing pushed; review on a preview before pushing.
- **GitHub profile URL for the footer (31.8).** No profile URL exists in the repo; the footer omits GitHub until Paul confirms `https://github.com/jpaulfernandez` (one line in `elsewhere` in `BaseLayout.astro`).
- **Phase 34 Home copy (34.1).** Approve `heroStatement` and `heroWho`: the "eleven years" figure (PSBank 2015 to 2026), "a college of working students" (from the rebuild-plan draft, not verified against another source), and the delivery-area list "Metro Manila, Clark, Cebu and online" (program spec doc 09 has two other variants). Spec doc 09 line 199 says Paul is based in Angeles City near Clark; the phase file and README say Manila, so Manila is used. Closing CTA wording (34.2): spec says "Book a 20-minute scoping call", the phase file says "Book a scoping call"; the phase file's wording will be used. See `docs/rebuild/notes/phase-34.md`. Home (34.2) also needs: the hairline hero "Work with me" button vs §5.1's red one (one-class flip), and the closing sentence "Not sure which of these you need? That's what the first call is for." (new copy, not from a source). About (34.4): approve the three "How I work" lines (label "Artefacts leave the room." is not verbatim in doc 09; sentences are doc 09 §1/§4 in first person), the Connect sentence "I work with teams three ways: with you, for you, or as an adviser.", and the h1 kept as "Jan Paul Fernandez" (phase file step 2 says "About"). Visual review (34.6): hero hairline button and portrait crop at 375/768/1280 (the 768 portrait is vertically centred; top-align is a one-line change); optionally make Home's three Now titles plain text so only "Full timeline" links to /now/.

## v3 rebuild (approved 2026-10-29)

- [x] (2026-10-29) Paul approves `rebuild-plan.md` — all ten §11 items answered; R1/R2/R4 approved; program prices on enquiry; modes "message for a quote"; based in Manila
- [x] (2026-10-29) Implementation plan written: [docs/rebuild/](docs/rebuild/README.md)

### Phase 31 — Foundation · [phase file](docs/rebuild/phase-31-foundation.md)

- [x] (2026-10-29) 31.0 Housekeeping: pending T30 diff committed or stashed; tag `v2-final`
- [x] (2026-10-29) 31.1 Fonts: Fraunces, Inter, JetBrains Mono
- [x] (2026-10-29) 31.2 Tokens: `@theme` rewrite
- [x] (2026-10-29) 31.3 `global.css` rewrite
- [x] (2026-10-29) 31.4 Remove GSAP and `motion.ts`
- [x] (2026-10-29) 31.5 Utility sweep (old ink/paper/wine → v3 tokens)
- [x] (2026-10-29) 31.6 OG route re-theme
- [x] (2026-10-29) 31.7 CLAUDE.md constraints + colophon updated to v3
- [x] (2026-10-29) 31.8 BaseLayout nav and footer
- [x] (2026-10-29) 31.9 Verify (Paul's visual review pending — see Blocked)
- [ ] **Phase 31 Definition of Done**

### Phase 32 — Work with me + program · [phase file](docs/rebuild/phase-32-work-with-me-program.md)

- [x] (2026-10-29) 32.1 Schemas: `program` collection + singleton, `workWithMe.modes[]`
- [x] (2026-10-29) 32.2 Program copy entered from doc 09 / doc 07
- [x] (2026-10-29) 32.3 Service + FAQPage structured data
- [x] (2026-10-29) 32.4 `/work-with-me/` rewrite (Web3Forms live test pending — see Blocked)
- [x] (2026-10-29) 32.5 Program overview + tier pages
- [x] (2026-10-29) 32.6 Retire `/workshops` (courses, services, redirects)
- [x] (2026-10-29) 32.6a Not in any task text: Home minimum repair (workshops block, `services` read and peso figures out; points at the program), `thanks.astro` "mid-workshop" wording, Person description "teaches AI workshops" (`schema.ts`), `llms.txt` About line. Home's real rewrite stays 34.2
- [x] (2026-10-29) 32.7 llms.txt, HTML sitemap, OG, meta descriptions
- [x] (2026-10-29) 32.8 Verify (local checks only; live redirects, Web3Forms, validator.schema.org and the keyboard pass are pending — see Blocked)
- [ ] **Phase 32 Definition of Done**

### Phase 33 — Projects · [phase file](docs/rebuild/phase-33-projects.md)

- [x] (2026-10-29) 33.1 `src/lib/projects.ts` helpers, tests first (`astro check` deferred to 33.2 per the phase file: types need the new schema)
- [x] (2026-10-29) 33.2 Projects schema replaced; Oddhalls migrated to MDX
- [x] (2026-10-29) 33.2a Not in any task text: `description` became `summary`, so `index.astro`, `sitemap.astro`, `og/[...route].ts` and the old `projects/index.astro` were touched by one line each; thoughts body field in `keystatic.config.ts` extracted to a shared `articleBody()`
- [x] (2026-10-29) 33.3 Generic project page template
- [x] (2026-10-29) 33.4 Projects index with kind filter
- [x] (2026-10-29) 33.5 Seed entries (list, Rappler year, Anakloud role pending Paul; AIM not seeded — see Blocked)
- [x] (2026-10-29) 33.6 Structured data, llms.txt, sitemap
- [x] (2026-10-29) 33.7 Verify (all automated checks pass; seed list, Rappler year, Anakloud role and Oddhalls title pending Paul — see Blocked)
- [ ] **Phase 33 Definition of Done**

### Phase 34 — Home + About + Now · [phase file](docs/rebuild/phase-34-home-about-now.md)

- [x] (2026-10-29) 34.1 Home singleton fields (copy approval pending — see Blocked)
- [x] (2026-10-29) 34.2 Home page sections (hairline hero button and closing sentence pending Paul — see Blocked)
- [x] (2026-10-29) 34.3 Portrait crop (crop visual review pending Paul)
- [x] (2026-10-29) 34.4 About (h1 kept as the name; How I work lines and Connect sentence pending Paul — see Blocked)
- [x] (2026-10-29) 34.5 Now re-skin
- [x] (2026-10-29) 34.6 Verify (all automated checks and keyboard passes pass; copy approvals and visual review pending Paul — see Blocked)
- [ ] **Phase 34 Definition of Done**

### Phase 35 — Gallery · [phase file](docs/rebuild/phase-35-gallery.md)

- [x] (2026-10-29) 35.1 `libraryOrder()`, tests first; masonry packer removed
- [x] (2026-10-29) 35.2 Gallery schema: `photos[].date`, dead fields deleted
- [x] (2026-10-29) 35.3 Library grid
- [x] (2026-10-29) 35.4 Density control (buttons, wheel, keys, pinch)
- [x] (2026-10-29) 35.5 Viewer with pinch-zoom
- [x] (2026-10-29) 35.6 Set pages re-skin
- [x] (2026-10-29) 35.7 Verify (real-device test pending — see Blocked)
- [ ] **Phase 35 Definition of Done**

### Phase 36 — Thoughts re-skin + launch · [phase file](docs/rebuild/phase-36-thoughts-launch.md)

- [x] (2026-10-29) 36.1 Article blocks + ArticleLayout
- [x] (2026-10-29) 36.2 Thoughts index, topics, remaining pages (+ global career `.rail` first dot no longer red-500: only About uses it; see notes)
- [ ] 36.3 Lighthouse ≥ 95 ×4 on five URLs
- [ ] 36.4 spec.md, CLAUDE.md, voice.md, memory updated
- [ ] 36.5 Whole-rebuild Definition of Done (rebuild-plan §9)
- [ ] 36.6 Launch (Paul)
- [ ] **Phase 36 Definition of Done**

## Out of scope — do not build

See [rebuild-plan.md §10](rebuild-plan.md). Also still out: Idea Graveyard, backlinks/hover previews, search, library page, webmentions, newsletter, footnotes/sidenotes.
