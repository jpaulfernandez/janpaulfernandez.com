# T19 — Projects collection & /projects page

**Phase:** 7 · **Depends on:** T18, T04, T06 · **Spec:** Paul's minimalist redesign request (2026-08-12)

## Goal

Scaffold a `projects` collection (Keystatic + Astro, field-identical) and a text-only `/projects` index in the luyuhang.net style: entries grouped under year headings, each a title (optionally linked out) + one-line description. Paul adds real entries (e.g. Eyelicium AI) through the CMS later — do not invent project data.

## Architecture & Rules

- **Fields (minimal):** `title` (string, required), `year` (string, required — display value e.g. "2026"), `description` (string, required — one line), `link` (string, optional — external URL; if absent, render the title as plain text, never a dead link).
- **Keystatic:** collection `projects`, entry layout, slug from label; validate/format where Keystatic supports it.
- **Astro:** collection in `src/content.config.ts`, stored `src/content/projects/`. Sort helper (year desc) belongs in `src/lib/projects.ts` as a pure function with vitest tests — test-first.
- **Page:** `src/pages/projects/index.astro` — h1 "Projects", one intro line, list grouped by year (year as visual anchor, like luyuhang). Zero-state text block when the collection is empty (quirky, in house voice).
- **SEO:** unique title/description via BaseLayout props; add Page/ItemList JSON-LD only if an existing builder in `src/lib/schema.ts` covers it — otherwise skip (no hand-written JSON-LD).

## Steps

1. Add vitest-tested sort/group helper in `src/lib/projects.ts` (first).
2. Define the collection in `keystatic.config.ts` and `src/content.config.ts` — fields must match exactly.
3. Build `/projects` page with year-grouped list + zero state.
4. Verify `/keystatic` admin loads the collection and can author an entry locally (write a test entry, then remove it before committing unless Paul provided real data).

## Definition of Done

- [x] `projects` collection defined and field-identical in both `keystatic.config.ts` and `src/content.config.ts`
- [x] `/projects` renders, groups by year desc, handles empty collection with a zero state
- [x] Titles without a `link` render as plain text (no dead links)
- [x] Helper in `src/lib/projects.ts` covered by passing vitest tests
- [x] `npm run build`, `npx astro check`, and `npm test` all pass cleanly
