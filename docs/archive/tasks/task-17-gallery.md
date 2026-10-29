# T17 — Photo Gallery (/gallery), Licensing CTA, & Bento Footer Integration

**Phase:** 6 · **Depends on:** T03, T04, T08 · **Spec:** Customization requested by Paul

## Goal

Create a flexible `/gallery` section where all photo collections/albums are displayed by default with tag filtering, opening `/gallery/[slug]` for detailed view. Add seamless photo licensing CTAs and connect the 4 Bento footer images to pull dynamically from featured gallery items.

## Architecture & Rules

- **Keystatic + Astro schemas:** A `gallery` collection stored as JSON in `src/content/gallery/*.json` with fields: `title`, `publishedDate`, `cover`, `description`, `tags`, `featured`, `licensingAvailable`, and an optional `photos` array (allowing both single photos and album collections).
- **Static HTML + Vanilla JS (YAGNI Ladder):** Gallery filter chips operate via vanilla DOM class toggling (~30 lines of JS, progressive enhancement safe). Lightbox view uses native HTML `<dialog>` with keyboard accessibility (`Esc`, arrow keys).
- **Licensing CTA:** A clean, static `mailto:` link pre-populated with the album/photo reference and inquiry subject line.
- **Footer Integration:** `BaseLayout.astro` fetches up to 4 featured/latest gallery items to display in the Bento grid tiles, linking to `/gallery/[slug]`.

## Steps

1. Define `gallery` schema in `keystatic.config.ts` and `src/content.config.ts` (ensuring fields match identically).
2. Create `src/assets/gallery/` directory and add 3 seed gallery entries (`src/content/gallery/*.json`) with real/sample imagery.
3. Build `src/pages/gallery/index.astro`: page intro, filter chips for tags, and masonry/grid cards linking to `/gallery/[slug]`.
4. Build `src/pages/gallery/[slug].astro`: cover image display, photo grid/list, `<dialog>` lightbox modal, and "License this photo" button.
5. Update `src/layouts/BaseLayout.astro` to dynamically render up to 4 featured/latest gallery items in the Bento footer grid, and add "Gallery" link to navigation and footer links.
6. Verify against DoD: build passes, type-check passes, tests pass.

## Definition of Done

- [x] `gallery` collection defined and field-identical in both `keystatic.config.ts` and `src/content.config.ts`
- [x] At least 3 seed entries present in `src/content/gallery/`
- [x] `/gallery` renders all items by default newest-first; tag filter chips work via vanilla JS and degrade gracefully without JS
- [x] `/gallery/[slug]` renders the album/photo details, includes a functional native `<dialog>` lightbox, and features a "License this photo" mailto link
- [x] Bento footer in `BaseLayout.astro` dynamically displays up to 4 featured/latest gallery items linking to `/gallery/[slug]`
- [x] Navigation includes a link to `/gallery`
- [x] `npm run build`, `npx astro check`, and `npm test` all pass cleanly

