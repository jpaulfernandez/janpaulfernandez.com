# Phase 33 — Projects (a real portfolio)

**Slice:** `/projects/` is a year-grouped, kind-filtered ruled list of seven real entries, and Oddhalls is a generic MDX case study on the same template every future case study will use · **Depends on:** Phase 32 · **Spec:** [rebuild-plan.md §5.4, §6, §12](../../rebuild-plan.md)

## Context

Today `projects` is one JSON file (`oddhalls.json`: title, year, description, link) and `src/pages/projects/[slug].astro` is a 651-line Oddhalls page: the copy and six screenshot imports are hard-coded in the template (about lines 27–202). Phase 33 inverts that: the template becomes generic, the copy moves into `src/content/projects/oddhalls.mdx`, and the schema gains `kind`, `featured` and the rest of §6.

This phase runs **before** Home (Phase 34) on purpose: Home's "Recent projects" calls `recentProjects(all, 3)` from this phase. Building Home first would mean wiring that section twice.

Must not change: the Oddhalls copy and its six images (a parity check proves it, 33.7); the `/projects/oddhalls/` URL; v3 palette/type from Phase 31 (use `ink-*`/`paper`/`blue-*`/`red-*` only, hairlines only, see [README](README.md) rule 5); the Phase 32 nav. JS budget for this phase: **≤2 KB on `/projects/`, 0 KB on `/projects/[slug]/`** ([README](README.md) rule 7).

## Read first

- [rebuild-plan.md](../../rebuild-plan.md) §5.4 (Projects), §6 (content model), §12 (OpenAI year-grouped index, Locomotive narrow-width fallback).
- `src/lib/projects.ts` and `src/lib/projects.test.ts` (the whole thing is ~30 + ~70 lines; `getProjects` sorts by `year.localeCompare`, `groupProjectsByYear` preserves input order).
- `src/content.config.ts:84–96` (projects collection, JSON glob loader) and `keystatic.config.ts:241–253` (projects collection). The `thoughts` collection in both files is the pattern for an MDX-bodied collection (`keystatic.config.ts` `body: fields.mdx(...)` with `KeyTakeaway`/`Callout`/`PullQuote`/`Embed` components).
- `src/pages/thoughts/[slug].astro` (how the four article blocks are mapped into `<Content components={...} />`) and `src/pages/thoughts/index.astro` — the `<script>` at the bottom (~50 lines) is the filter pattern 33.4 copies.
- `src/pages/projects/[slug].astro` and `src/pages/projects/index.astro` (what is being replaced).
- Current consumers of the projects collection: `src/pages/index.astro:61`, `src/pages/sitemap.astro:10,221–234`, `src/pages/og/[...route].ts:80–84`, `src/pages/llms.txt.ts:35`. Run `grep -rn "getProjects\|collection('projects')\|projects/" src --include=*.astro --include=*.ts` and treat the output as the checklist for 33.2/33.6.
- `src/content/pages/about.md`, `src/content/career/*.md`, `src/content/now/*.md` — the **only** sources for seed facts (33.5).

## Tasks

### 33.1 `src/lib/projects.ts` helpers — tests first

**Files:** `src/lib/projects.test.ts` (edit first), `src/lib/projects.ts`.
**Test-first?** Yes — mandatory ([CLAUDE.md](../../CLAUDE.md), `src/lib/` rule).

Steps:
1. Branch `rebuild/33-projects` from `main` (after Phase 32 is merged).
2. In `projects.test.ts`, widen the `vi.mock('astro:content')` fixtures and the inline `as unknown as ProjectEntry[]` fixtures to the new shape: `data: { title, kind, year, summary, featured, order?, ... }` and a `body` string on entries that have a page. Keep the existing three tests' intent (year-desc, grouping, empty) and add, **before** any implementation:
   - `sortProjects`: year desc; within a year `order` ascending with `order === undefined` sorting last; remaining ties keep input order (stable); input array is not mutated.
   - `getProjects`: returns `sortProjects(await getCollection('projects'))`.
   - `groupProjectsByYear`: unchanged behaviour (newest year first, input order preserved inside a group, `[]` → `[]`).
   - `projectsByKind(all, kind)`: only that kind, order preserved.
   - `hasPage(entry)`: `true` when `entry.body` has non-whitespace content, `false` for `''`, whitespace-only, and `undefined`.
   - `relatedProjects(entry, all, n = 3)`: same `kind`, excludes `entry` itself (compare `id`), sorted via `sortProjects`, capped at `n`, `[]` when nothing else shares the kind.
   - `recentProjects(all, n)`: `featured` entries first (themselves ordered by `sortProjects`), then the rest by `sortProjects`, sliced to `n`; with no featured entries it is just the newest `n`.
3. Run `npm test` — the new cases must **fail** (red). Commit the failing test only if the branch convention allows; otherwise proceed straight to step 4 in the same commit.
4. Implement in `projects.ts`: `PROJECT_KINDS = ['product','work','talk','side'] as const`, `type ProjectKind`, `KIND_LABEL` (plural, for chips: Products · Work · Talks · Side projects) and `KIND_NOUN` (singular, for rows and kickers: Product · Work · Talk · Side project), `sortProjects`, `getProjects`, `groupProjectsByYear`, `projectsByKind`, `hasPage`, `relatedProjects`, `recentProjects`. All pure except `getProjects`. `year` stays a string; compare with `localeCompare`.
5. `npm test` green. (The collection schema does not exist yet; `ProjectEntry` is `CollectionEntry<'projects'>` and will not type-check against the new `data` fields until 33.2 — so land 33.1 and 33.2 in the same PR but **do not run `astro check` between them**; run it at the end of 33.2.)

**Done when:** `npx vitest run src/lib/projects.test.ts` passes with ≥10 assertions across the seven exports, every new test was seen failing first.

### 33.2 Schema replace (both files, one commit) and Oddhalls migration

**Files:** `src/content.config.ts`, `keystatic.config.ts`, `src/content/projects/oddhalls.json` (delete), `src/content/projects/oddhalls.mdx` (new), `src/pages/projects/[slug].astro` (only to delete the hard-coded copy, rewritten in 33.3), `src/assets/projects/oddhalls/*` (unchanged).
**Test-first?** No (config + content). The parity check in step 1 is the safety net.

Steps:
1. **Capture the baseline before touching anything.** `npm run build`, then save the visible text of the current Oddhalls page:
   ```
   sed -e 's/<script.*<\/script>//g' -e 's/<style.*<\/style>//g' -e 's/<[^>]*>/\n/g' dist/client/projects/oddhalls/index.html | sed 's/^[[:space:]]*//' | grep -v '^$' > "${TMPDIR:-/tmp}/oddhalls-before.txt"
   ```
   Also record the six image file names in the built HTML (`grep -o 'oddhalls/[a-z-]*\.[A-Za-z0-9_]*\.\(png\|webp\)' ...`) — 33.7 compares against both.
2. `src/content.config.ts`: replace the `projects` collection. Loader `glob({ pattern: '*.{md,mdx}', base: 'src/content/projects' })`; schema becomes a function `({ image }) => z.object({...})` (the `gallery` collection shows the pattern) with:
   `title: string`, `kind: z.enum(['product','work','talk','side'])`, `year: string`, `period: string.optional()`, `role: string.optional()`, `summary: string`, `metaDescription: string.optional()` (see Risks — added to keep Oddhalls' 140–160-char SEO description; falls back to `summary`), `link: string.optional()`, `cover: image().optional()`, `tags: array(string).default([])`, `featured: boolean.default(false)`, `order: number.optional()`.
   `year` convention (write it in a one-line comment): the year it shipped or was last worked on; `period` carries the range for display.
3. `keystatic.config.ts`: replace the `projects` collection with the same fields. Keep `slugField: 'slug'`, `path: 'src/content/projects/*'`; copy the `thoughts` collection's `format`/`entryLayout` for an MDX body (the body field is named `body` there — name it `body` here too so `entry.body` and the `contentField` agree; **verify the exact `format.contentField` / `entryLayout` options against current Keystatic 0.5 docs**, do not copy from memory). `kind` is `fields.select` (default `product`), `cover` is `fields.image` with `directory: 'src/assets/projects'`, `publicPath: '../../assets/projects'`, `tags` is `fields.array(fields.text(...))`, `featured` is `fields.checkbox`, `order` is `fields.integer`. The `body` field is `fields.mdx` with the **same** options and the same four components as `thoughts` (`KeyTakeaway`, `Callout`, `PullQuote`, `Embed`); its `image` option points at `src/assets/projects` / `../../assets/projects`. Verify `fields.mdx` image options against current docs.
4. **Schema parity check:** field-by-field diff of the two files for `projects` (CLAUDE.md hard constraint). `metaDescription` and `order` are the two easiest to forget.
5. Create `src/content/projects/oddhalls.mdx`. Frontmatter: `title: Oddhalls`, `kind: product`, `year: '2026'`, `summary:` (the existing one-line `description` from `oddhalls.json`, verbatim), `metaDescription:` (the string currently hard-coded as `description` in `projects/[slug].astro`, verbatim), `link: https://oddhalls.janpaulfernandez.com`, `tags` (leave `[]` unless the old page already names categories), `order: 1`.
6. Move the body. Read `projects/[slug].astro` top to bottom and port, **in the same order and with the same words**: the intro paragraphs; the `metaFacts` list (Platform / Architecture / Color & RAW / Inference) as a **markdown table** (a facts table is body content, not a schema field — see Risks); each `stages` entry (01 Cull, 02 Develop, 03 Design, …) as an `##` heading + tagline paragraph + image + caption + its `items` as `###` + paragraph (or a list, whichever matches the original more closely); every remaining section after the stages. Images: copy the six imports to `![alt](../../assets/projects/oddhalls/<file>)` relative paths so Astro's MDX image pipeline optimises them (**verify against current Astro MDX/images docs**; if relative images are not optimised inside MDX in 5.18, fall back to `import cull from '../../assets/...'` at the top of the MDX and `<Image src={cull} ... />`, which needs `Image` passed via `components`). Captions: a plain italic paragraph directly under each image; do not invent a `Figure` component for six uses (YAGNI: extract on the second *place*, and this is one page).
7. Delete `src/content/projects/oddhalls.json`.
8. Delete from `projects/[slug].astro` everything that is now content (the six image imports, `metaFacts`, `stages`, the long markup) but leave a compiling stub — it is replaced in 33.3.
9. Run `npm run build` once to prove the collection loads (an empty template is fine) and `npx astro check`.

**Done when:** `oddhalls.json` is gone, `oddhalls.mdx` exists with the copy and six images, `npm run build` and `npx astro check` pass, and the field lists in `content.config.ts` and `keystatic.config.ts` match line for line.

### 33.3 Generic `projects/[slug].astro`

**Files:** `src/pages/projects/[slug].astro` (rewrite, target <120 lines).
**Test-first?** No (UI; verified against the DoD).

Steps:
1. `getStaticPaths`: `getProjects()`, **filter `hasPage`**, return `{ params: { slug: project.id }, props: { project, related: relatedProjects(project, withPages, 3) } }` where `withPages` is the filtered list. Entries without a body get no page and no redirect.
2. Render `const { Content } = await render(project)` and map the four blocks exactly as `thoughts/[slug].astro` does (`KeyTakeaway, Callout, PullQuote, Embed`).
3. Markup, in order: breadcrumbs nav is JSON-LD only (as today); `<section class="page-head">` with one `h1` (the title); a mono `.kicker` line `{KIND_NOUN[kind]} · {period ?? year}{role ? ' · ' + role : ''}`; `summary` as the lead paragraph (`.subtext`, body size, `ink-600`); if `link`, a single `.btn` "Visit {hostname} ↗" (`rel="noopener"`); then `<div class="prose">` containing `<Content components={components} />` in the 38rem measure. If the body contains a markdown table the `.prose` table styles from 31.3 render the facts table; do not add table CSS here.
4. "Related" block after the prose: only when `related.length > 0`; a `.rows` ruled list of `.row-link` rows (title · kind · summary), hairlines only. For Oddhalls this block is correctly **absent** until a second `product` with a page exists.
5. `<BaseLayout title={project.data.title} description={metaDescription ?? summary} ogImage={`/og/projects-${project.id}.png`}>`. Keep the OG key (`projects-<slug>`) — the OG route is adjusted in 33.6. Pass `title` the way `BaseLayout` composes `<title>`; Oddhalls' old long title (`Oddhalls — Local-first photo editor & photobook designer`) is dropped in favour of `Oddhalls` + the site suffix — note this in the PR as a conscious SEO change, or restore it by writing the descriptor into `title` in the frontmatter if Paul prefers.
6. Zero `<script>` tags in the template; no `data-*` motion attributes (removed in 31.4).

**Done when:** `dist/client/projects/oddhalls/index.html` exists, has exactly one `<h1>`, contains no `<script` beyond the two [README](README.md) exceptions, and `dist/client/projects/` contains no other slug directories.

### 33.4 Index with kind filter

**Files:** `src/pages/projects/index.astro` (rewrite), `src/styles/global.css` (only if the chip styles are not already there — see step 1).
**Test-first?** No; the pure logic it needs (`groupProjectsByYear`, `projectsByKind`) was tested in 33.1.

Steps:
1. Chip styles are the **second use** of the Thoughts filter look, so extract now. `grep -n "filter-chip\|segmented\|\.seg\b\|\.tag\b" src/styles/global.css src/pages/thoughts/index.astro`. If Phase 31.3 already put them in `global.css` `@layer components`, reuse. If they still live in `thoughts/index.astro`'s scoped `<style>`, move the rules for the chip button into `global.css` inside `@layer components` as `.chip` / `.chip[aria-pressed='true']` (pressed = `bg-red-500` fill with `ink-900` text, per rebuild-plan §3.1: the selected filter chip is a red fill), and swap the class on the Thoughts markup in the same commit. Do not touch Thoughts' script or any other Thoughts markup (Phase 36.2 owns its polish).
2. Data: `const all = await getProjects(); const groups = groupProjectsByYear(all);` and `const kinds = PROJECT_KINDS.filter((k) => projectsByKind(all, k).length > 0);` — a chip renders only for a kind that has entries, so "Talks" is absent today and appears automatically when the first talk is added. Render the "All" chip first.
3. Markup: `h1` "Projects" with a one-sentence intro (`.subtext`; Paul's voice from `voice.md`, no hype; e.g. what is here and that case studies are linked); then the filter bar (`role="group" aria-label="Filter projects"`, `data-filter-group="kind"`, buttons with `aria-pressed` and `data-value`), then one `<section data-year-group>` per year: `h2` year in mono on the left, `<ul class="rows">` on the right. Row = one element per entry with `data-kind={kind}`:
   - `hasPage(entry)` → `<a href="/projects/{id}/" class="row-link">`;
   - else `link` → `<a href={link} rel="noopener" class="row-link">` with a visually-hidden "(opens {hostname})" and a `↗` glyph;
   - else a `<div>` (inert, no arrow).
   Inside: title (Inter 500) · kind noun (mono, `ink-400`) · `summary` (`ink-600`) · `→` (decorative, `aria-hidden`). At <640px use the single-column stack (title over meta over summary) — the Locomotive fallback in §12. No cards, no fills, hairline `border-blue-200` between rows.
4. **No-JS rule:** all rows are in the HTML and visible. The filter bar is hidden unless `.js`: in a scoped `<style>` write `.filter-bar { display: none; }` then `:global(.js) .filter-bar { display: flex; }` — a plain rule, not `lg:hidden`, per the scoped-style trap in [CLAUDE.md](../../CLAUDE.md).
5. Script (an Astro `<script>` at the bottom of the page, ≈30 lines, vanilla TS, modelled on the Thoughts script): on chip click set `aria-pressed` on the group, read `data-value`, for each `[data-kind]` row toggle the Tailwind `hidden` class (**not** the `hidden` attribute — an author `display:grid` on `.row-link` beats the UA `[hidden]` rule), then for each `[data-year-group]` add `hidden` when it has no visible row, and write `Showing N projects` into an `aria-live="polite"` `.sr-only` region. Do not extract a shared module with the Thoughts script: two 30-line scripts are cheaper than an abstraction; revisit only on a third use.
6. JSON-LD stays in 33.6.

**Done when:** `dist/client/projects/index.html` has 7 `data-kind` rows (`grep -o 'data-kind="' dist/client/projects/index.html | wc -l`), no "Talks" chip, the bundled script is ≤2 KB gzip (command in Verification), and the filter works with and without JS (33.7).

### 33.5 Seed entries

**Files:** `src/content/projects/{eyelicium,anakloud,phvote-2022,phvote-2019,rappler-cms-migration,psbank-account-opening}.mdx` (new, frontmatter only, no body). `oddhalls.mdx` already exists.
**Test-first?** No (content).

Rule: **every value below is traceable to a file in the repo; nothing else is added.** Where the repo is silent the optional field is left out and the gap is listed under "Blocked on Paul" and in the PR description.

| Slug | kind | year / period | order | role | summary (from) | link |
|---|---|---|---|---|---|---|
| `oddhalls` | product | 2026 | 1 | — | existing `description` | oddhalls.janpaulfernandez.com |
| `anakloud` | work | 2026 | 2 | `Tech lead` ([rebuild-plan §5.4](../../rebuild-plan.md); Paul confirms) | `now/officially-joined-anakloud.md`: a capstone project that helps parents track their children's developmental goals; I am helping with the technology | — |
| `eyelicium` | side | 2026 | 3 | — | `now/eyelicium-ai-project.md`: scores a YouTube thumbnail on how likely it is to earn a click; a proof of concept, not scientific yet | `https://eyelicium.janpaulfernandez.com/` |
| `phvote-2022` | work | 2022 | — | — | `about.md` + `career/rappler.md`: Rappler's election-monitoring platform; results tracking and canvassing coverage for the 2022 presidential race | — |
| `phvote-2019` | work | 2019 | — | — | same, 2019 senatorial race | — |
| `rappler-cms-migration` | work | 2023 (placeholder) / period `2018–2023` | — | — | `about.md` + `career/rappler.md`: moved the old site to a new CMS, enabling ontology and a knowledge graph | — |
| `psbank-account-opening` | work | 2018 / period `2015–2018` | — | `Systems Analyst` (`career/psbank.md`) | `career/psbank.md`: the account-opening solution, deployed to three branches | — |

Steps:
1. Create the six files with frontmatter only (empty body, so `hasPage` is false and no page is generated). Add `tags` only where a source names one (`rappler`, `elections` for the three Rappler rows; `ai` for Eyelicium is in the Now entry's wording — otherwise leave `[]`).
2. Edit `oddhalls.mdx` order to 1 (already set in 33.2). Order 1–3 mirrors the Now dates (Oddhalls 23 Oct, Anakloud 13 Sep, Eyelicium 30 Jul 2026) so "three newest" on Home is deterministic.
3. **Not seeded:** the AIM capstone (Paul has not named it) and every `talk` (no talks list, [rebuild-plan §11](../../rebuild-plan.md)). No metrics, client names, dates or outcomes beyond what the table cites.
4. The Rappler CMS year is a placeholder (the repo gives only the 2018–2023 tenure). Add a line under "Blocked-on-Paul items" in `plan.md` and say so in the PR: the entry ships only if Paul accepts `2023` or supplies the year.

**Done when:** `npm run build` passes, `/projects/` lists exactly seven entries across the years 2026, 2023, 2022, 2019, 2018 with no empty year heading, and every summary can be matched to a quoted source in the table.

### 33.6 Structured data, OG, llms.txt, sitemap

**Files:** `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`, `src/pages/og/[...route].ts`, `src/pages/llms.txt.ts`, `src/pages/sitemap.astro`, `astro.config.mjs` (verify only).
**Test-first?** No; no new builder is added.

Steps:
1. Index: replace the `webPage(...)` call with the existing `collectionPage({ title: 'Projects', description, url: '/projects/', items })` plus `breadcrumbs` and `person()`. `items` = every entry that has a destination: `hasPage` → `/projects/{id}/`, else `link` if present, else skipped (an `ItemList` entry needs a URL). The `description` is 140–160 characters ([README](README.md) rule on meta descriptions).
2. Project page: keep `webPage({ url, name, description })` + `breadcrumbs` + `person()` (the builders that exist; **no new `CreativeWork` builder** — adding one is a `schema.ts` change that needs its own failing test and a task in `plan.md`; out of scope here).
3. `og/[...route].ts:80–84` builds a card for every project. Restrict that loop to `hasPage` entries so the build does not emit six orphan PNGs (and the key `projects-<id>` still resolves for Oddhalls). Touch nothing else in that file.
4. `llms.txt.ts:35`: replace the single "Projects … including Oddhalls" line with the index link plus one bullet per `hasPage` project (`[Title](url): summary`). Do not add the entries without pages.
5. `sitemap.astro:221–234`: list only `hasPage` projects as links (`/projects/{id}/`) and keep the count wording truthful (`{n} case studies`); entries without pages are not URLs. Re-read the `{projects.length}` line so it does not claim seven pages.
6. `astro.config.mjs` `contentLastmod()`: **leave `/projects/` bare.** T30's reasoning (a build-time timestamp is worse than none) still holds; the project pages get no `lastmod` because the frontmatter has no date. Confirm by reading the function, change nothing.
7. Rebuild and extract every `application/ld+json` block from `dist/client/projects/index.html` and `.../oddhalls/index.html`; confirm one `CollectionPage`, one `BreadcrumbList`, one `Person` with the single `@id`, and no dangling references.

**Done when:** `dist/client/og/projects-oddhalls.png` exists and no other `og/projects-*.png` does; `llms.txt` and the HTML sitemap mention only real URLs; JSON-LD blocks parse.

### 33.7 Verify

**Files:** none (checks only; record results in the PR).

Steps: run the commands under Verification, then the manual passes: keyboard (Tab to each chip, Space/Enter toggles, focus ring visible in `red-700`), screen reader announcement text, 375px and 1280px widths, filter with JS disabled (DevTools "Disable JavaScript" → every row visible, no filter bar), and the parity diff.

**Done when:** every Definition of Done box below is ticked.

## Definition of Done

- [ ] `npx vitest run src/lib/projects.test.ts` green; the seven new exports each have assertions written before the implementation.
- [ ] `npm run build`, `npx astro check`, `npm test` all green ([README](README.md) rule 4).
- [ ] `projects` is field-identical in `src/content.config.ts` and `keystatic.config.ts` (including `metaDescription`, `order`, `featured`, `cover`).
- [ ] `src/content/projects/oddhalls.json` is deleted; `oddhalls.mdx` exists; `src/pages/projects/[slug].astro` contains no Oddhalls copy and no `src/assets/projects/` imports.
- [ ] Oddhalls parity: text diff against `oddhalls-before.txt` shows no changed or missing sentence (only wrapper/markup differences), and the same six image sources appear.
- [ ] `/projects/` has seven rows, grouped under 2026 / 2023 / 2022 / 2019 / 2018, one `h1`, no Talks chip, no AIM entry, no talk entries.
- [ ] With JS disabled: all seven rows visible and the filter bar absent. With JS: each chip filters, empty year headings hide, "All" restores.
- [ ] `/projects/` bundled JS ≤2 KB gzip; `/projects/oddhalls/` has no `<script` beyond the inline `.js` class script (and the GA4 tag, if still present).
- [ ] `grep -rn "wine-\|text-paper-[0-9]\|bg-ink-[0-9]" src/pages/projects` → nothing; no shadows, gradients or filled cards (hairlines only).
- [ ] `grep -rn "data-reveal\|data-hero\|gsap" src/pages/projects` → nothing.
- [ ] `git diff v2-final -- src/content/pages/about.md src/content/now src/content/thoughts src/assets/thoughts` is empty ([README](README.md) rule 2).
- [ ] Axe clean on `/projects/` and `/projects/oddhalls/` ([README](README.md) rule 9).
- [ ] JSON-LD: `CollectionPage` on the index, `webPage` on Oddhalls, one `Person`, no duplicates; only `hasPage` projects in `llms.txt`, the HTML sitemap and OG output.
- [ ] `plan.md` boxes 33.1–33.7 and the Phase 33 DoD marked `[x] (YYYY-MM-DD)` as each passes.

## Verification

```
npm test && npx astro check && npm run build
```

```
# Seven rows in the HTML, no JS needed to see them
grep -o 'data-kind="[a-z]*"' dist/client/projects/index.html | sort | uniq -c
```

```
# Only Oddhalls has a page; no orphan OG cards
ls dist/client/projects/ && ls dist/client/og | grep '^projects-'
```

```
# Script budget on the index: external and inline scripts both count
grep -o '<script[^>]*>' dist/client/projects/index.html
for f in $(grep -o '/_astro/[^"]*\.js' dist/client/projects/index.html | sort -u); do printf '%s ' "$f"; gzip -c "dist/client$f" | wc -c; done
```

```
# Oddhalls copy parity (run after the rebuild; expect only markup-level differences)
sed -e 's/<script.*<\/script>//g' -e 's/<style.*<\/style>//g' -e 's/<[^>]*>/\n/g' dist/client/projects/oddhalls/index.html | sed 's/^[[:space:]]*//' | grep -v '^$' > "${TMPDIR:-/tmp}/oddhalls-after.txt"
diff "${TMPDIR:-/tmp}/oddhalls-before.txt" "${TMPDIR:-/tmp}/oddhalls-after.txt"
```

```
# Serve the build for the manual and axe passes (axe/serve run via npx, never added to package.json)
npx serve dist/client -l 4321 &   # astro preview is unsupported by @astrojs/vercel (core/preview/index.js:45); serve the build
npx @axe-core/cli http://localhost:4321/projects/ http://localhost:4321/projects/oddhalls/
```

## Risks & notes

- **`fields.mdx` images and Astro MDX image optimisation** are the two API-shape risks (33.2 steps 3 and 6). Verify against current Keystatic and Astro docs before writing; the `import` + `<Image>` fallback is described in the step.
- **`metaDescription` is an addition** to the schema listed in the brief. Without it Oddhalls' 140–160-char SEO description would be lost (its one-line `summary` is ~100 chars). It is optional and falls back to `summary`.
- **Facts table has no schema field.** "Optional facts table" is implemented as a markdown table in the MDX body so the schema stays small; the `.prose` table style from Phase 31 renders it.
- **`year` for ranges.** `year` (string, required) drives grouping; `period` is display-only. A project that spans years is grouped under the year it shipped or was last worked on. Two seeds (Rappler CMS, PSBank) depend on that convention.
- **`hasPage` couples four places** (static paths, related, OG, llms/sitemap). If one is missed the symptom is a 404 link or an orphan PNG — the Verification `ls` checks catch both.
- The Thoughts script keeps its own copy of the filter logic on purpose (see 33.4 step 3).
- Phase 34 reads `recentProjects(all, 3)`; do not rename the export.

## Blocked on Paul

- Confirm or correct the seven entries (kind, year, one-line summary). Specifically: the **Rappler CMS migration year** (placeholder `2023`), the **Anakloud role** (`Tech lead`), and whether PHVote 2019 and 2022 should stay two entries.
- Name the **AIM capstone** if it should be listed (kind `work`, 2025–26 per [rebuild-plan §5.4](../../rebuild-plan.md)); until then it is not seeded.
- Whether Oddhalls should keep its long `<title>` descriptor ("Local-first photo editor & photobook designer") — see 33.3 step 5.
