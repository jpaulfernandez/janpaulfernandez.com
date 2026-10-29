# Phase 35 notes

## 35.1
- `libraryOrder(sets)` returns `LibraryPhoto[]` = `{ image, caption, setSlug, setTitle, date }`, newest first. Takes `{ id, data: { title, publishedDate, cover?, photos: [{ image, caption?, date? }] } }[]` (a gallery collection entry fits).
- Phase file drift: honne is 2024-03-23 and wanderland-music-festival 2024-03-22 (file had them swapped), so the real tie is daniel-caesar-at-wanderland vs wanderland-music-festival, resolved by slug ascending (tested with those slugs). Honne (03-23) sorts above both.
- Masonry exports and tests removed. `gallery/index.astro` imported `masonryLayout`; to keep the build green it now assigns columns round-robin with widthFactor 1 (marked TEMP). 35.3 rewrites the page and deletes that block.

## 35.2
- `photos[].date` is optional (`dateSchema.optional()` / `fields.date`, same pattern as `updatedDate`); no photo is back-filled because none carries date info (EXIF stripped, filenames are sequence numbers).
- `featured` and `licensingAvailable` deleted from gallery in both config files and the four JSON files (lines 7-8 each, not 6-7). The Phase 35 grep over `content.config.ts`/`keystatic.config.ts` still matches `featured` on the **projects** collection (lines ~175 / ~238); that is a different, live field.
- The set file is `bini-asiya.json`, not `bini.json`.
