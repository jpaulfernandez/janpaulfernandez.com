# v3 rebuild — implementation plan

How to build the site described in [rebuild-plan.md](../../rebuild-plan.md) (approved by Paul, 2026-10-29). `rebuild-plan.md` says **what** and **why**; these files say **how**, in order, with a checkable "Done when" on every task. The tracker is [plan.md](../../plan.md); house rules are [CLAUDE.md](../../CLAUDE.md) (read it, but see rule 5 below for what it no longer governs).

## Phases

Work them in order. Each ends deployable and gets its own branch and PR.

| Phase | File | Slice that is live when it ends | Branch |
|---|---|---|---|
| 31 | [phase-31-foundation.md](phase-31-foundation.md) | New brand (white, red/blue, Fraunces/Inter/JetBrains Mono) on every existing page; GSAP gone; nothing else changed | `rebuild/31-foundation` |
| 32 | [phase-32-work-with-me-program.md](phase-32-work-with-me-program.md) | The offer: Work with me, the AI-Resilient Organisation overview and five tier pages; `/workshops/*` retired with 301s | `rebuild/32-work-with-me` |
| 33 | [phase-33-projects.md](phase-33-projects.md) | Projects as a typed collection with a kind filter; Oddhalls case study as MDX; seed entries | `rebuild/33-projects` |
| 34 | [phase-34-home-about-now.md](phase-34-home-about-now.md) | Home matches the offer; About gains the timeline and "How I work"; Now re-skinned | `rebuild/34-home-about-now` |
| 35 | [phase-35-gallery.md](phase-35-gallery.md) | One date-sorted photo library with density control and a pinch-zoom viewer | `rebuild/35-gallery` |
| 36 | [phase-36-thoughts-launch.md](phase-36-thoughts-launch.md) | Thoughts re-skin, Lighthouse pass, docs rewritten, launch | `rebuild/36-thoughts-launch` |

Task IDs (`31.0` … `36.6`) are fixed: `plan.md` links to them, and the phase files, the PR descriptions and the commit messages all use them (`feat(31.3): …`).

## How to work

1. **Start at `plan.md`.** Take the first unchecked task. Open its phase file, read "Context" and "Read first", then the task. Don't skip ahead; don't start a phase before the previous phase's PR is merged.
2. **State your understanding before coding** (CLAUDE.md). If the phase file and the code disagree, say so and ask. Several line numbers and counts in these files were scouted on 2026-10-29 and will drift — re-derive them with the grep given, don't trust the number.
3. **Test-first where it is pure logic** (`src/lib/`). Everything else is verified against the task's "Done when" by running the command it names.
4. **Mark the task** in `plan.md` as `[x] (YYYY-MM-DD)` only when "Done when" passes. The phase's own Definition of Done is the last box in its section.
5. **Anything the phase files don't cover** goes into `plan.md` as a new checkbox first (CLAUDE.md workflow rule 5), then gets done.
6. **Blocked?** Log it under "Blocked-on-Paul items" in `plan.md`, leave an obvious placeholder, say so in the PR. Never invent a fact, a metric, a date, a URL or a price.

## Cross-cutting rules

These apply to every phase; phase files refer to them as "rule N".

1. **Tracker.** `plan.md` lists every task ID as a checkbox linking to its phase file. First unchecked first; `[x] (date)` only when "Done when" passes.
2. **Baseline tag.** Task 31.0 creates the local git tag `v2-final` on the commit before any v3 code. Every "content unchanged" check is
   `git diff v2-final -- src/content/pages/about.md src/content/now src/content/thoughts src/assets/thoughts` → empty.
3. **Branching.** One branch per phase, PR into `main`. A push to `main` deploys production on Vercel, so **merging is Paul's call**, made after he has looked at the PR's Vercel preview. Agents open the PR; they do not merge.
4. **Gates after every task:** `npm run build`, `npx astro check`, `npm test` — all green. A task that leaves one red is not done, whatever its own checklist says.
5. **v3 rules beat CLAUDE.md's dark-build visual rules** (ink ground, wine accent, Switzer/Courier, GSAP and the `data-reveal` vocabulary, the `#FFF` ceiling) from the moment Phase 31 starts. Task 31.7 rewrites CLAUDE.md so the file stops contradicting the build. Rules that survive unchanged: the YAGNI ladder; component CSS inside `@layer components`; scoped `<style>` blocks hide with media queries, never `lg:hidden`; one `h1` per page; AA contrast; hairline-only surfaces; section rhythm (`.section` + `.section-ruled` opens an argument, a bare `.section-tight` continues it); the four-tier type ramp (now `ink-900` / `ink-600` / `ink-400` metadata-only); Keystatic/Astro schema parity; the single Person `@id`; test-first for `src/lib/`.
6. **Schema parity.** Any collection change edits `keystatic.config.ts` and `src/content.config.ts` in the same commit.
7. **Client JS budget** ([rebuild-plan §7](../../rebuild-plan.md#7-tech-decisions)). 0 KB on Home, About, Now, Work with me, program pages and articles; ≤ 2 KB on the Thoughts index and the Projects index; ≤ 6 KB on the Gallery. The inline `.js` class script in `<head>` and the GA4 tag are the only exceptions. Check by inspecting the built HTML in `dist/client/` for `<script` tags and `/_astro/*.js` references — and look at the page, not only the file list, because `astro build` hoists component scripts into `/_astro/`.
8. **Copy rules.** [voice.md](../../voice.md) plus the program spec's style rules (doc 00, lines 81–86): no *leverage, unlock, empower, genuinely, honestly, straightforward*; cite a URL for every factual claim; name survey sponsors; say "aligned to PSF-AAI", never "certified"; say "not legal advice" out loud on Tier 1. **No peso figures anywhere** (`grep -rn "₱\|PHP " dist/client` finds nothing on v3 pages). Paul is **based in Manila** — the program spec's "Angeles City / Clark" line does not apply (delivery areas Metro Manila, Clark/Pampanga, Cebu and online may stay).
9. **Accessibility check.** `npx @axe-core/cli <url>` against the built site served with `npx serve dist/client -l 4321` (`astro preview` does not support the `@astrojs/vercel` adapter) — run ad hoc through `npx`, **not** added to `package.json` — plus a manual keyboard pass (tab order, visible focus, menu, form, dialog). Redirects can only be checked on the Vercel preview.

## The program spec (private source material)

Copy for Phase 32 comes from `~/Downloads/ai-program-spec/` — read it **there**; it is not in the repo and nothing private is copied into it. Documents used: `09-marketing-and-pitch.md` Part 1 (§1 Home, §2 Program, §3 Tier pages, §5 Founding-client offer; §4 About for the "How I work" lines in Phase 34), `07-research-appendix.md` (§2 figures D-01, D-02, D-06, D-09 and §13 source list), `04-tier2-fluency-and-champions.md` Part B for Champions, and `00-program-spec.md` lines 81–86 for style rules. **Do not copy into the repo:** pricing tables (`01`, `09` §2 and §5), the pitch deck (`09` Part 2), outreach (`09` §6), objection handling (`09` §7), run-of-show tables.

## Where this plan departs from rebuild-plan.md

Eight deliberate changes, each with its reason. Where the two documents disagree, **this list wins**.

| # | rebuild-plan.md says | This plan does | Reason |
|---|---|---|---|
| 1 | CLAUDE.md is updated in Phase 36 (§8) | **Task 31.7** rewrites its brand/motion/type rules; Phase 36 does the final pass and `spec.md` | Once the palette flips, the dark-build rules would mislead every agent working Phases 32–35. |
| 2 | Home + About + Now (33), then Projects (34) | **Projects is Phase 33; Home/About/Now is Phase 34** | Home's "Recent projects" reads the new projects schema (`kind`, `featured`); building Home first means wiring that section twice. |
| 3 | The "interested in" select is preset from the row clicked (§5.5) | Rows link to `#enquire`; **the select is not preset** | Presetting needs JS; Work with me's budget is 0 KB. The select is one click. |
| 4 | `workWithMe` gains `topics[]`; `home` gains `selectedProjects[]` (§6) | Neither is added; Home uses `recentProjects(3)` honouring a `featured` flag | §11 dropped the topics section; Paul has no project pick. |
| 5 | "How I work" lives on About (§5.2) | The copy lives **in `about.astro`**, not `about.md` | `about.md` must stay byte-identical. |
| 6 | `/workshops/*` redirects cover old links (§4) | The thought `jack-and-the-snack-culture.mdx` links to `/workshops` and is **not edited** | Thoughts content is frozen; the 301 covers it. |
| 7 | Five redirects (§4) | The existing `/workshop` → `/workshops/` redirect is **retargeted** straight to the program page | No redirect chains (`/workshop` → `/workshops/` → program). |
| 8 | "Recrop `paul.webp`" (§5.1) | The recrop is **CSS** (`object-position` / `aspect-ratio`) on the existing file | No new asset unless Paul supplies one. |

Smaller additions the phase files make, flagged in place so a reviewer can object: an optional `metaDescription` on projects (keeps the Oddhalls SEO description when its copy moves to MDX, 33.2); the Home hero action is a hairline button, not red, because the nav already carries the one red fill above the fold (§3.1 vs §5.1 — Paul to confirm, 34.2); `bundles[].tiers` on the program singleton (tier pages need "part of" links) and `faq[]` on `workWithMe` (the six FAQ items feed FAQPage) — both in task 32.1; Astro collection name `programPage` for the `program.json` singleton, because `program` is taken by the tier collection.

## Consolidated Blocked-on-Paul list

Each also appears in its phase file. None of them stops an agent working; each has a stated placeholder.

- **31.0** — Commit (or approve committing) the pending T30 diff before the `v2-final` tag.
- **31.2** — The Oddhalls `--step-*` / `--space-*` values, if they can't be read from oddhalls.janpaulfernandez.com's served CSS.
- **31.8** — Paul's GitHub profile URL for the footer (omitted until confirmed).
- **32.2** — Confirm the founding-offer terms text. **Before announcing** (not before merging): BIR registration and MMDC clearance.
- **33.5** — Name of the AIM capstone (not seeded until given); confirmation of the seed list.
- **35.7** — Pinch and viewer tested on a real iPhone (Safari) and Android (Chrome).
- **36.6** — Merge, Search Console resubmit, the one-week 404 check.

## Gate commands

```bash
npm run build && npx astro check && npm test       # rule 4, after every task
git diff v2-final -- src/content/pages/about.md src/content/now src/content/thoughts src/assets/thoughts   # rule 2: empty
grep -rn "₱\|PHP " dist/client                      # rule 8: nothing on v3 pages
```
