# Phase 33 notes

## 33.1
- Helpers in `src/lib/projects.ts`: `PROJECT_KINDS`, `ProjectKind`, `KIND_LABEL`, `KIND_NOUN`, `sortProjects`, `getProjects`, `groupProjectsByYear`, `projectsByKind`, `hasPage`, `relatedProjects`, `recentProjects`. `sortProjects` copies before sorting (the old `getProjects` sorted the collection array in place); there is a no-mutation test.
- Tests were run red (13 failing) before the implementation. `astro check` was not run at 33.1 (types need the 33.2 schema), per the phase file.

## 33.2
- Schema: `kind`, `period`, `role`, `summary` (replaces `description`), `metaDescription`, `cover`, `tags`, `featured`, `order`, plus `body` in Keystatic. Both config files carry the same field list.
- Out-of-list edits so the build stays green after `description` became `summary` (also a plan.md checkbox): `src/pages/index.astro` (summary), `src/pages/sitemap.astro` (summary), `src/pages/og/[...route].ts` (`metaDescription ?? summary`, one line), `src/pages/projects/index.astro` (summary; rewritten in 33.4).
- `keystatic.config.ts`: the thoughts `body: fields.mdx(...)` block moved into a shared `articleBody(assetDir)` helper so projects and thoughts cannot drift; thoughts output is unchanged.
- Oddhalls MDX is at `src/content/projects/oddhalls.mdx`; the six images are relative `../../assets/projects/oddhalls/*.png` and are optimised by Astro (same six webp outputs as before).
- `[slug].astro` is an interim stub (about 45 lines): filters `hasPage`, renders `<Content>` with the four blocks inside `.prose`, back link, h1, summary. 33.3 replaces it. The stub has no "Visit" button yet (the CTA links inside the body remain).
- Text parity (built page text before/after, markup stripped): all sentences identical. Differences: `<title>` (now `Oddhalls — Paul Fernandez`, the known conscious change), the old inline tag line and lead paragraph moved into the body unchanged, summary line added by the template, table header words added (`Fact / Detail / Note`, `Spec / Detail`) because markdown tables need a header row, caption label and text joined in one italic paragraph (`Cull Stage. Cull stage: ...`), the head "Visit" button absent until 33.3, and line-wrapping.

## 33.3
- `src/pages/projects/[slug].astro` is generic (75 lines): `getStaticPaths` filters `hasPage` and passes `relatedProjects(project, withPages, 3)`. Head: visible `Breadcrumbs` (same trail as the JSON-LD, the Phase 32 tier-page pattern; it replaces the stub's ad-hoc back link), kicker `{KIND_NOUN} · {period ?? year}{ · role}`, one `h1`, summary as `.subtext`, then `Visit {hostname} ↗` when `link` is set. Body in `.prose` in its own ruled section; "Related" only when `related.length > 0` (absent for Oddhalls today).
- The Visit button is `btn-ghost`, not `btn-primary`: the header CTA is already the one red fill above the fold (same call as the tier pages).
- New `src/components/ProjectRow.astro` (the row: title · kind noun · summary · arrow; destination page → link → inert). Extracted now because Related and the 33.4 index both use it, and Phase 34's Home "Recent projects" is a third caller. Its scoped CSS is inlined on every project page (~600 B) even when Related is absent; Astro includes an imported component's styles regardless.
- Oddhalls text vs the 33.2 `oddhalls-after.txt`: only additions in the head (breadcrumb "Home / Projects", kicker "Product · 2026", "Visit oddhalls.janpaulfernandez.com ↗" restored) and the back link replaced by the breadcrumb. Same six images. Scripts on the page: the `.js` inline, GA4 (two tags) and JSON-LD only.
- Follow-up fix: the `Visit {hostname} ↗` button overflowed the shell at 375px (`.btn` is `nowrap`); it now carries `max-w-full whitespace-normal leading-snug` and wraps to two lines on phones.

## 33.4
- Chip styles extracted (second use): `global.css` `@layer components` now has `.chip` sharing the `.tag` rule, `cursor: pointer`, and `.chip[aria-pressed="true"]` sharing the red-500 fill with `.tag[data-active]`. Thoughts topic chips swapped `filter-chip tag` → `filter-chip chip` and their scoped rules were removed; computed styles at rest and pressed are unchanged (checked in the browser), Thoughts script untouched. No `:hover` was added to `.chip`, so Thoughts renders exactly as before.
- `src/pages/projects/index.astro`: `h1` + one-sentence `.subtext` intro; ruled section with the filter bar (`role="group"`, `data-filter-group="kind"`, `aria-pressed`, a chip per kind that has entries, "All" first) and an `sr-only` `aria-live` status; one `<section data-year-group>` per year, year `h2` in mono left of the rows from 64rem, above them below it. Rows are `ProjectRow` (33.3).
- Hairlines: rows carry a top rule and no bottom rule (the list closes with one rule), so hiding rows or years never doubles a line. Neither the `<li>` nor the year `<section>` has a scoped `display`, so the `hidden` utility is never outranked.
- No-JS: `.filter-bar { display: none }` with `:global(.js) .filter-bar { display: flex }`; with `js` removed every row is visible and the bar is gone (checked).
- Script: Astro inlined it (no `/_astro/*.js`); 593 B raw, **345 B gzip** (budget 2 KB).
- Verified with two temporary uncommitted entries (work 2022 with link, side 2026 inert) so filtering, empty-year hiding, external `↗` rows and inert rows could be exercised: Work → 1 row, 2026 hidden; Products → 2022 hidden; All restores; status reads "Showing N project(s)". Keyboard: Tab reaches each chip, Space and Enter toggle, red-700 focus ring. 375px: stacked rows, no horizontal scroll. Axe: 0 violations on `/projects/`, `/projects/oddhalls/` and `/thoughts/` (with and without the temp entries).
- Today the index has one row and two chips (All, Products): the seven-row count is 33.5's Done-when.
- The selected chip is a red fill below the header's red CTA: two red fills can share a screen here, as on Thoughts. rebuild-plan §3.1 names the selected chip as a red fill explicitly; flag for Paul if it reads as too much.
- Meta description and JSON-LD on the index are unchanged (33.6).

## 33.5
Six files added under `src/content/projects/` (frontmatter only, no body, so `hasPage` is false). `/projects/` now has 7 rows (1 product, 1 side, 5 work) under 2026 / 2023 / 2022 / 2019 / 2018, no empty year.

| Entry | Facts and where they come from |
|---|---|
| anakloud | work, 2026, order 2. Summary: `now/officially-joined-anakloud.md:6` (capstone, parents track children's developmental goals, "help with all things tech"); date 2026-09-13 at `:4`. Role `Tech lead`: **only** `rebuild-plan.md:139` ("capstone tech lead"); flagged with a TODO in the frontmatter. |
| eyelicium | side, 2026, order 3. `now/eyelicium-ai-project.md:6` (thumbnail click likelihood, "not scientific yet", URL); date `:4`. Tag `ai` from the Now entry's wording. |
| phvote-2022 | work, 2022. `about.md:5` (PHVote, Rappler's election-monitoring platform, 2022 presidential race); `career/rappler.md:11` (results tracking and canvassing coverage). Tags `rappler`, `elections`. |
| phvote-2019 | work, 2019. Same sources, "2019 senatorial" (`about.md:5`). |
| rappler-cms-migration | work, **2023 is a placeholder** (TODO comment in the frontmatter); period `2018–2023` is `career/rappler.md:7`. Summary: `about.md:5` and `career/rappler.md:11` (new CMS, ontology, knowledge graph). Tag `rappler` only (the `elections` tag would be wrong here). |
| psbank-account-opening | work, 2018, period `2015–2018`, role `Systems Analyst`: `career/psbank.md:4-7`, `:11` (account-opening solution, three branches). Year 2018 is the period end, per the phase file's "year it shipped or last worked on" convention. |

Not seeded: the AIM capstone (name unsourced; `about.md:11` mentions the Master's only), every talk (no list exists). No metrics, client names or outcomes added. The Eyelicium and PHVote summaries are my wording of the cited sources, not verbatim quotes.
Logged in plan.md "Blocked-on-Paul": seed-list confirmation, Rappler year, Anakloud role, AIM, Oddhalls `<title>`.

## 33.6
- Index: `webPage` replaced by the existing `collectionPage` (no `schema.ts` change, no new builder) plus `breadcrumbs` and `person()`. Items: `hasPage` → `/projects/{id}/`, else `link`, else skipped; today 2 (Oddhalls page, Eyelicium external link). Meta description is now 146 characters.
- Project page: unchanged (`webPage` + `breadcrumbs` + `person()`); built JSON-LD on `/projects/oddhalls/` is one WebPage, one BreadcrumbList, one Person (`@id` `https://janpaulfernandez.com/#person`). The index has one CollectionPage, one BreadcrumbList, one Person.
- OG: loop filtered to `hasPage`; `dist/client/og/projects-oddhalls.png` is the only `projects-*` card (plus the index's `projects.png`).
- `llms.txt`: the Projects line now links the index with one indented bullet per `hasPage` project (Oddhalls). `llms-full.txt.ts` has no projects reference; unchanged.
- HTML sitemap: only `hasPage` projects, count reads "1 case study".
- `astro.config.mjs` `contentLastmod()` read, not changed: it has no `/projects/` entries.
