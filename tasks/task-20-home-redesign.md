# T20 — Text-minimal homepage

**Phase:** 7 · **Depends on:** T18, T19 · **Spec:** Paul's minimalist redesign request (2026-08-12)

## Goal

Redesign `/` as a text-minimal index in the spirit of luyuhang.net / paco.me: name + short bio + now one-liner, then text indexes for writing, projects, and work. No cards, buttons, images, or gradients — typography and whitespace only.

## Architecture & Rules

- **Structure (in order):**
  1. Name/greeting (one `h1`; keep the Keystatic `heroGreeting` voice)
  2. Bio paragraph (from home singleton `heroIntro`)
  3. Now one-liner (latest `now` entry, existing snippet logic)
  4. **Writing** — latest thoughts as plain rows (title → date), link to `/thoughts`
  5. **Projects** — latest 3 projects as plain rows, link to `/projects` (uses T19 helper; renders nothing/skips section if collection empty — no dead section)
  6. **Work** — one or two lines + text link to `/work-with-me`
- **Sections separated by whitespace and/or hairline rules** (`border-moss-200`), never background blocks.
- **Home singleton cleanup:** `ctaPrimaryLabel` / `ctaSecondaryLabel` become unused — remove them from `keystatic.config.ts`, `src/content.config.ts`, and `src/content/pages/home.json` together (fields stay identical across both schemas).
- **Deletions:** `src/components/Hero.astro` and `src/components/ServiceStack.astro` if left unused after this page lands (check all usages first — ServiceStack may still be referenced by work-with-me; T21 handles that page).
- **Keep:** JSON-LD set (webSite/profilePage/person/breadcrumbs), title/meta description, zero-state behavior when no thoughts exist (re-styled as plain text).
- Rows are one-off for this page → inline in the page, not a new component (extract on second use only).

## Steps

1. Rewrite `src/pages/index.astro` frontmatter + markup per the structure above.
2. Update both schema files + `home.json` for the dropped CTA fields.
3. Delete `Hero.astro`; delete `ServiceStack.astro` only if unreferenced.
4. Check 375px and 1440px; verify view-source shows no unexpected scripts and correct head tags.

## Definition of Done

- [x] One `h1`; text-only content; no cards/buttons/images/gradients on the page
- [x] Writing / Projects / Work sections render from real collection data with correct links
- [x] CTA fields removed from both schema files and `home.json` (field-identical)
- [x] Unused components deleted; no dangling imports
- [x] `npm run build`, `npx astro check`, and `npm test` all pass cleanly
