# T04 — Keystatic setup

**Phase:** 1 · **Depends on:** T01 · **Spec:** §8, §8.1

## Goal

Keystatic admin UI working at `/keystatic` in local mode, wired to Astro. Collections are added by later tasks (T06, T10, T15) — this task only establishes the plumbing with one small proof collection.

## Context you need

- Keystatic needs `@keystatic/core`, `@keystatic/astro`, and React (`@astrojs/react`, react, react-dom). This is the only place React enters the project — the public site must stay React-free.
- Keystatic's admin routes need server rendering. The site must stay fully static, so the admin must not ship to production builds. Use the documented Keystatic + Astro static approach: the `keystatic()` Astro integration injects admin/API routes in **dev only** when output is static — verify against current Keystatic docs (https://keystatic.com/docs/installation-astro) rather than assuming.
- `storage: { kind: 'local' }` for now. GitHub mode is a T16 launch item.

## Steps

1. Install the packages above; add `react()` and `keystatic()` integrations to `astro.config.mjs`.
2. Create `keystatic.config.ts` with `storage: { kind: 'local' }` and a single collection `now` (it's the simplest real one — spec §8.1): fields `date` (date, required), `body` (markdoc/mdx short text), `link` (url, optional). Content path `src/content/now/*`.
3. Run dev, open `/keystatic`, create one test Now entry; confirm a file appears under `src/content/now/`.
4. Wire the Astro side: `src/content.config.ts` defining a `now` collection with a glob loader over `src/content/now` and a zod schema matching the Keystatic fields. `getCollection('now')` must return the test entry (prove with a temporary log or on styleguide page, then remove).
5. Confirm `npm run build` output contains no `/keystatic` admin pages and no React runtime in `dist/` client assets.

## Definition of Done

- [ ] `/keystatic` admin loads in dev; creating/editing a Now entry writes a file to `src/content/now/`
- [ ] `getCollection('now')` returns entries typed by the zod schema; `npx astro check` passes
- [ ] Production build is static, contains no admin routes, and no client-side React (`grep -ri react dist/_astro` finds nothing, or dist has no JS at all)
- [ ] `npm run build` passes
