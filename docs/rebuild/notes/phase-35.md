# Phase 35 notes

## 35.1
- `libraryOrder(sets)` returns `LibraryPhoto[]` = `{ image, caption, setSlug, setTitle, date }`, newest first. Takes `{ id, data: { title, publishedDate, cover?, photos: [{ image, caption?, date? }] } }[]` (a gallery collection entry fits).
- Phase file drift: honne is 2024-03-23 and wanderland-music-festival 2024-03-22 (file had them swapped), so the real tie is daniel-caesar-at-wanderland vs wanderland-music-festival, resolved by slug ascending (tested with those slugs). Honne (03-23) sorts above both.
- Masonry exports and tests removed. `gallery/index.astro` imported `masonryLayout`; to keep the build green it now assigns columns round-robin with widthFactor 1 (marked TEMP). 35.3 rewrites the page and deletes that block.

## 35.2
- `photos[].date` is optional (`dateSchema.optional()` / `fields.date`, same pattern as `updatedDate`); no photo is back-filled because none carries date info (EXIF stripped, filenames are sequence numbers).
- `featured` and `licensingAvailable` deleted from gallery in both config files and the four JSON files (lines 7-8 each, not 6-7). The Phase 35 grep over `content.config.ts`/`keystatic.config.ts` still matches `featured` on the **projects** collection (lines ~175 / ~238); that is a different, live field.
- The set file is `bini-asiya.json`, not `bini.json`.

## 35.3
- `/gallery/` is one `.library` grid: 95 `a.photo-trigger` anchors, newest first (bini 12, honne 19, daniel-caesar 14, wanderland 50), each `href="/gallery/{set}/"` so no-JS lands on the set page. Dedupe loop, spread/round-robin, both walls and the grayscale hover CSS are gone.
- `<Image width={720} widths={[160,320,480,720]}>`: `width` added beyond the task so the `src` fallback is the 720px file, not the 2731px original (665 KB). Thumbnails: bini-01 is 3.8 / 10.9 / 19.9 / 37.7 KB at 160/320/480/720w; at 1280px / 6 columns / DPR 1 the browser picks 320w.
- `CollectionPage` JSON-LD byte-identical to pre-phase. Sets list kept under the grid.

## 35.4
- `src/scripts/gallery.ts` `initDensity(grid)`: levels 3/5/7 and 4/6/8/12 behind `matchMedia('(min-width: 48rem)')`; writes only `--cols` and each img's `sizes` (`(100/n).toFixed(1)vw`); `gallery-cols` in localStorage inside try/catch, accepted only if the current breakpoint offers it, re-resolved on the breakpoint `change`.
- Readout is `{n} per row` in an `aria-live="polite"` span; buttons carry `aria-keyshortcuts` and a `title` naming the key. Keys ignore modifier chords (so browser ⌘−/⌘= zoom is untouched), form fields, and an open dialog. ⌘/Ctrl+wheel is bound on the grid only, `preventDefault` only with the modifier; 60 deltaY units per step.
- Verified in the browser pane: at 1280 buttons step 6→8→12 (− disabled at 12) and back to 4 (+ disabled); real `-`/`=` key presses step 6→8→6; ctrl+wheel 30+40 = one step, meta+wheel −100 = one step back, plain wheel not prevented; synthetic two-pointer pinch steps a level per 25% and the following click is swallowed (no viewer); level survives reload. At 375 (mobile preset): default 3, stored `6` rejected, 3→5→7 (− disabled) and back.
- No-JS (scripts stripped from a copy of the built page, headless Chrome at 1280): no control, grid at 6. Headless Chrome cannot go below ~500px wide, so the 375 no-JS check rests on the CSS default (`--cols: 3` below 48rem), which the pane showed at 375.
