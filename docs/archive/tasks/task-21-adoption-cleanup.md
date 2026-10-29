# T21 — Remaining pages adoption & cleanup

**Phase:** 7 · **Depends on:** T18–T20 · **Spec:** Paul's minimalist redesign request (2026-08-12)

## Goal

Bring every page that survived T18's shell swap into the text-minimal system, remove dead code/theme leftovers, and close the phase with the full verification suite green.

## Scope

- **`/about`:** drop the `page-magenta` body class and theme; keep the Timeline component (content stays, styling inherits beige/ink tokens). Check contrast of any formerly-magenta-styled elements.
- **`/work-with-me`:** replace `ServiceStack` usage with a plain-text services list (title + description rows); keep the contact form, FAQ (native `<details>`), and any schema intact. Then delete `src/components/ServiceStack.astro` if unreferenced.
- **`/thoughts`, `/topics`, `/gallery`, articles:** inherit the new shell; verify spacing, focus states, and that no page depended on removed notch clearance or bento footer for layout. No redesign of these pages beyond what the shell change forces.
- **`global.css`:** remove `body.page-magenta` override block and any other orphaned rules (e.g. notch-related) once no page references them.
- **Deletions:** any component left with zero usages after the above.

## Steps

1. Grep for `page-magenta`, `ServiceStack`, `Hero`, and notch-era classes; fix every usage.
2. Restyle `/about` + `/work-with-me` per scope; spot-check every remaining route at 375px and 1440px.
3. Full verification: `npm run build` && `npx astro check` && `npm test`; view-source sanity on `/`, `/about`, `/work-with-me`, one article.
4. Mark T18–T21 checkboxes in plan.md with the completion date.

## Definition of Done

- [x] No references to `page-magenta`, notch nav, or bento footer remain in `src/`
- [x] `/about` and `/work-with-me` are visually coherent with the text-minimal shell (AA contrast verified)
- [x] No unused components or orphaned CSS remain
- [x] Every route renders correctly in the new shell (spot-checked)
- [x] `npm run build`, `npx astro check`, and `npm test` all pass cleanly
