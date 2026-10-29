# Phase 35 — Gallery (the photo library)

**Slice:** `/gallery/` is one date-sorted, square-thumbnail library of all 95 photographs with iOS-Photos-style zoom levels and a full-screen viewer with pinch-zoom; set pages stay and link back · **Depends on:** Phase 34 · **Spec:** [rebuild-plan.md §5.8, §6, §7](../../rebuild-plan.md)

## Context

Today `/gallery/` renders **two** walls (a 2-column mobile flow and a 3-column build-time masonry, one hidden by CSS) from `src/pages/gallery/index.astro` using `masonryLayout`/`widthFactor` in `src/lib/gallery.ts`, and a `Lightbox.astro` whose script lives inline in the component and rebuilds its list from the *visible* triggers. Phase 35 collapses that to one grid, one script file, and one viewer.

This is the phase that needs a **real phone**: pinch is Pointer Events math that desktop emulation cannot prove. Paul tests it (35.7). The `.js` guard pattern is the rule for the new controls: with JS blocked the grid renders at the default density and every thumbnail is a plain link to its set page.

Must not change: the 95 photographs and `src/assets/gallery` (Cloudflare migration stays out of scope); set-page URLs; `ImageGallery` JSON-LD on set pages and `CollectionPage` (of sets) on the index; `lightboxWidth` (still used). JS budget: **≤6 KB gzip** on `/gallery/` ([README](README.md) rule 7).

## Read first

- [rebuild-plan.md](../../rebuild-plan.md) §5.8 (behaviour, level lists, data changes), §3.1 (`ink-400` metadata only, hairlines, no shadows or gradients), §7.
- `src/lib/gallery.ts` (`lightboxWidth` stays; `MasonryInput`, `MasonrySlot`, `masonryLayout`, `widthFactor` go) and `src/lib/gallery.test.ts` (describe blocks `lightboxWidth` keep, `masonryLayout`/width-factor blocks go).
- `src/pages/gallery/index.astro` — the flatten-and-dedupe loop (lines ~34–75: dedupe on `image.src`, cover inherits `photos[]` caption), the `getImage` call for the 1600px viewer source (~93–97), the `collectionPage` JSON-LD (~104). `src/pages/gallery/[slug].astro` — same dedupe/caption logic, `photo-trigger` anchors, `imageGallery` JSON-LD.
- `src/components/Lightbox.astro` — 256 lines: `<dialog id="photo-modal">`, `data-src/-alt/-caption/-href/-href-label` contract, inline `<script>`.
- `src/content/gallery/*.json` — `photos[]` is `{ image, caption }`; `featured` and `licensingAvailable` are the dead keys on lines 6–7 of each file. The four sets' `publishedDate`: bini 2024-10-15, wanderland-music-festival 2024-03-23, daniel-caesar and honne both 2024-03-22.
- `src/content.config.ts:171–192` and `keystatic.config.ts:254–297` (the gallery collection in both files). MDN: Pointer Events, `touch-action`, `<dialog>`; verify iOS Safari behaviour of `dialog` and `touch-action` against current docs.

## Tasks

### 35.1 `libraryOrder()` — tests first; masonry removed

**Files:** `src/lib/gallery.test.ts` (edit first), `src/lib/gallery.ts`.
**Test-first?** Yes — mandatory.

Steps:
1. Branch `rebuild/35-gallery`. In `gallery.test.ts` add a `describe('libraryOrder')` **before** touching `gallery.ts`, with minimal fake sets (`{ id, data: { title, publishedDate, cover?, photos: [{ image: { src, width, height }, caption?, date? }] } }`) and these cases:
   - flattens every set into one array of `{ image, caption, setSlug, setTitle, date }`;
   - sorts by `photo.date ?? set.publishedDate` **descending** (string compare is correct for `YYYY-MM-DD`);
   - a per-photo `date` overrides the set date, so one set can be split by it;
   - photos of one set keep their authored order (stable);
   - equal dates across sets: ordered by `setSlug` ascending, so builds are deterministic and a set stays contiguous (daniel-caesar then honne on 2024-03-22);
   - the cover is emitted once: dedupe on `image.src`, and the cover inherits the caption of the matching `photos[]` entry (mirrors `index.astro` today);
   - an empty collection returns `[]`; a set with no photos contributes nothing.
2. `npm test` → the new block fails (red).
3. In `gallery.ts` implement `libraryOrder(sets)` and export the `LibraryPhoto` type; keep `lightboxWidth`. **Delete** `MasonryInput`, `MasonrySlot`, `masonryLayout`, `widthFactor` and the matching `describe` blocks in the test file.
4. `npm test` green. `grep -rn "masonryLayout\|widthFactor\|MasonryInput" src` → only `gallery/index.astro` until 35.3 rewrites it (so run `astro check` after 35.3, not now).

**Done when:** `npx vitest run src/lib/gallery.test.ts` passes with the `libraryOrder` cases written first, and the masonry exports are gone from `gallery.ts` and its tests.

### 35.2 Gallery schema

**Files:** `src/content.config.ts`, `keystatic.config.ts`, `src/content/gallery/*.json` (4 files).
**Test-first?** No.

Steps:
1. Both config files, one commit: add `date` (optional, `YYYY-MM-DD`) to each `photos[]` object — zod `dateSchema.optional()` (reuse the existing `dateSchema` at the top of `content.config.ts`), Keystatic `fields.date({ label: 'Date taken (optional)' })` inside the `fields.object` (**verify `fields.date` inside an array object against current Keystatic docs**). Delete `featured` and `licensingAvailable` from both (`content.config.ts:182–183`, `keystatic.config.ts:273–274`).
2. Strip the two keys from the four JSON files; each sits on its own line:
   ```
   sed -i '' -e '/"featured"/d' -e '/"licensingAvailable"/d' src/content/gallery/*.json
   for f in src/content/gallery/*.json; do node -e "JSON.parse(require('fs').readFileSync('$f','utf8'))" && echo "ok $f"; done
   ```
   (the `sed -i ''` form is macOS; `git diff` must show exactly the two deleted lines per file, and the line before them must not be left with a dangling comma — fix by hand if it is).
3. Do **not** back-fill `date` on the 95 existing photos; the set date is accurate and the field is for new shots ([rebuild-plan §11 item 10](../../rebuild-plan.md)).
4. Parity check on the gallery collection in both files.

**Done when:** `grep -rn "featured\|licensingAvailable" src/content src/content.config.ts keystatic.config.ts` → nothing, `npm run build` passes, the two config files agree field for field.

### 35.3 Library grid (`/gallery/`)

**Files:** `src/pages/gallery/index.astro` (rewrite), `src/styles/global.css` (only a `.rows`-style class if needed; the grid CSS is page-scoped).
**Test-first?** No.

Steps:
1. Frontmatter: `const library = libraryOrder(await getCollection('gallery'))`; for each photo `getImage({ src, width: lightboxWidth(image) })` → `fullSrc` (keep the `Promise.all`). Keep the `collectionPage` of **sets** JSON-LD, `breadcrumbs`, and the description (140–160 chars, T30). Remove the dedupe loop, `spread`, `column`, `wallColumns`, both wall blocks and all their CSS.
2. Header (`page-head`): one `h1` "Gallery", the existing lead line, mono counter `{n} photographs · {m} sets` (`ink-400`), and — right-aligned in the same row — the density control mount (35.4).
3. Grid markup: `<div class="library" id="library">` containing one `<a class="photo-trigger" href="/gallery/{setSlug}/" data-src data-alt data-caption data-href="/gallery/{setSlug}/" data-href-label="{setTitle} →">` per photo, each holding an Astro `<Image>`: `widths={[160, 320, 480, 720]}`, `sizes="(min-width: 48rem) 17vw, 34vw"` (the default-density sizes: 6 columns / 3 columns), `alt={caption || setTitle}`, `class="library-img"`, `decoding="async"`, `loading={index < 12 ? 'eager' : 'lazy'}` (two rows at the 6-column default; the first six on the phone default are inside that). No captions in the grid. Each anchor also gets `aria-label="View larger: {alt}"`.
4. CSS (scoped `<style>` is fine; none of it hides with a utility): `.library { --cols: 3; display: grid; grid-template-columns: repeat(var(--cols), 1fr); gap: 2px; touch-action: pan-x pan-y; } @media (min-width: 48rem) { .library { --cols: 6; } } .library-img { width: 100%; aspect-ratio: 1; object-fit: cover; display: block; }` plus a `:focus-visible` outline in `red-700` on the anchor. `touch-action: pan-x pan-y` disables the browser's own pinch-zoom over the grid so the density pinch (35.4) receives its pointer events — see Risks.
5. Square crop is CSS only (`object-fit: cover`); the source is the existing 4:3 webp, so no new asset and the set page still shows frames whole.
6. No `<script>` yet; 35.4 and 35.5 add it. No hover filter, no scale, no shadow, no fade-in.

**Done when:** `/gallery/` renders all 95 thumbnails in one grid, newest first, at 3 columns at 375px and 6 at 1280px, with JS disabled, and every thumbnail links to its set page; `grep -c 'class="photo-trigger' dist/client/gallery/index.html` is 95.

### 35.4 Density script (`src/scripts/gallery.ts`, part 1)

**Files:** `src/scripts/gallery.ts` (new), `src/pages/gallery/index.astro` (mount + `<script>`), `src/styles/global.css` or the page (`.density` control styles).
**Test-first?** No (DOM/pointer code; verified in 35.7). Keep any pure arithmetic in tiny named functions so it is readable.

The file `src/scripts/gallery.ts` is the **only** gallery client code: it exports `initDensity(grid)` and `initViewer()` (35.5) plus a shared `distance(a, b)` for pinch math. Pages import what they need, so bundling drops the rest (set pages ship the viewer only). Budget for both exports together: ≤6 KB gzip.

Steps:
1. Levels (rebuild-plan §5.8): `const LEVELS = { phone: [3, 5, 7], wide: [4, 6, 8, 12] }`, defaults `3` and `6`, breakpoint `matchMedia('(min-width: 48rem)')`. The script only ever writes `grid.style.setProperty('--cols', n)` and updates each thumbnail's `sizes`.
2. `setCols(n)`: write `--cols`; for every `img` in the grid set `img.sizes = `${(100 / n).toFixed(1)}vw`` so the browser re-selects a smaller or larger candidate (a 12-column level must not keep 720px files; a move from 6 to 4 columns must not stay blurry); update the readout (`6 / 12`) and disable − at the densest and + at the largest level; persist.
3. Persistence: `localStorage.getItem/setItem('gallery-cols')` each inside `try/catch`; accept a stored value only if it exists in the current breakpoint's list, otherwise use the default. On the breakpoint's `change` event re-resolve (otherwise a stale inline `--cols` from the other layout survives rotation).
4. Controls, in the header: `<div class="density">` containing a mono `−` button (`aria-label="Zoom out: more photos per row"`; − = more columns, as in Photos), a mono readout, and `+` (`aria-label="Zoom in: fewer photos per row"`). Hidden unless `.js`: `.density { display: none } :global(.js) .density { display: inline-flex }` in the scoped style (plain rule, not a utility). Buttons are real `<button type="button">` with visible `ink-900` mono glyphs and a hairline border, no fill.
5. Inputs, all calling the same step function: click on the buttons; `keydown` for `-` and `=`/`+` when focus is not in an input and the viewer is closed; `wheel` with `ctrlKey || metaKey` (this also catches trackpad pinch on desktop) using `{ passive: false }` + `preventDefault()` **only** when a modifier is held, accumulating `deltaY` and stepping every ~60 units so one flick is one step.
6. Pinch (touch): `pointerdown/move/up/cancel` on the grid tracked in a `Map<pointerId, {x, y}>`. With two pointers store the start distance; on move, if `d / d0 > 1.25` zoom **in** one level (fewer columns) and reset `d0 = d`; if `< 0.8` zoom out one level and reset. Continuous pinching therefore steps through levels. Set a `pinched` flag when a step fires and swallow the next `click` on the grid (`capture: true`, `preventDefault`, clear flag) so lifting the fingers over a thumbnail does not open the viewer.
7. Nothing animates, so `prefers-reduced-motion` needs no handling.

**Done when:** in the browser pane at 1280px the − / + buttons, `-`/`=` keys and ⌘/Ctrl+wheel move through 4/6/8/12 and the level survives a reload; at 375px (mobile emulation) − / + move through 3/5/7; with JS blocked the control is absent and the grid is at 6/3.

### 35.5 Viewer with pinch-zoom

**Files:** `src/components/Lightbox.astro` (markup + CSS only; script removed), `src/scripts/gallery.ts` (`initViewer`), `src/pages/gallery/index.astro` and `src/pages/gallery/[slug].astro` (each gets a two-line `<script>`).
**Test-first?** No.

Steps:
1. `Lightbox.astro`: keep the `<dialog id="photo-modal">`, the `data-*` contract in its header comment (`data-src`, `data-alt`, `data-caption`, `data-href`, `data-href-label`) and the ids. Delete the inline `<script>`. Re-skin: ground `bg-paper` (white; a viewer is not a dark theme — see Risks), controls `ink-900` mono, caption `ink-600`, link `red-700`; **remove `backdrop-filter`/blur and the translucent black** (hairlines only, no blur). Size with `100dvh`/`100dvw` (iOS Safari toolbars), `html:has(dialog[open]) { overflow: hidden }`.
2. Wire the page scripts: `<script>import { initViewer } from '../../scripts/gallery'; initViewer();</script>` on both gallery pages, and `initDensity(document.getElementById('library'))` after it on the index.
3. `initViewer()` replaces the old inline logic: collect `.photo-trigger` anchors once (there is one grid now, so the old "visible triggers" filtering is deleted); on click `preventDefault()`, `showModal()`, show index; update `img.src/alt`, caption, "from *Set* →" link (`hidden` when no `data-href`), counter `n / N`; preload the next and previous `data-src` with `new Image()`.
4. Navigation: ←/→ keys, prev/next buttons, swipe (single pointer, horizontal travel >50px and larger than vertical, **only when scale is 1**). Close: Esc (native `cancel`), the close button, a click on the dialog backdrop.
5. Zoom on the stage (`.lightbox-image-wrap`, `touch-action: none` — this element only): two-pointer pinch scales the `img` via `transform: translate(x, y) scale(s)`, clamped to 1–4, anchored on the pinch midpoint; one pointer pans when `s > 1` (clamp so the image cannot leave the stage); double-tap/double-click (two `pointerup`s within 300 ms and 30 px) toggles 1× ↔ 2× at the tap point; `s` and the offset reset to identity whenever the photo changes. Reuse `distance()` from the density code.
6. Focus: on open, focus the close button; on close, `triggers[currentIndex].focus()` (the thumbnail of the photo the user ended on, which may not be the one they opened) and `scrollIntoView({ block: 'nearest' })`. Set `aria-live="polite"` on the counter (already present).
7. Set pages keep working unchanged: their anchors have `href` = full image (opens the image with JS off) and no `data-href`.

**Done when:** on the index and on a set page the viewer opens, navigates by arrows, buttons and swipe, closes three ways, returns focus to the right thumbnail, and pinch/double-tap zoom works in mobile emulation with touch events.

### 35.6 Set pages re-skin

**Files:** `src/pages/gallery/[slug].astro`.
**Test-first?** No.

Steps:
1. Keep the data flow, `photoList` dedupe/caption logic, `getImage` for `fullSrc`, and `imageGallery` + `breadcrumbs` + `person()` JSON-LD untouched.
2. Re-skin only: header = mono date and tags in `ink-400`, `h1`, description in `.subtext`, a `.link` "← All photographs" to `/gallery/`; remove `data-reveal*`/`data-hero`; the CSS-columns layout (true aspect ratios; §5.8 says the set page shows frames whole) stays, with `gap`/`column-gap` 2px–8px as it is today; delete the hover `filter`/`transform` rules and any token that no longer exists (`grep -n "paper-\|ink-9\|wine-\|--color-" src/pages/gallery/\[slug\].astro`).
3. Add the viewer `<script>` from 35.5. No other behaviour change.

**Done when:** a set page validates in axe, shows the same photographs in the same order as before, and `ImageGallery` JSON-LD is byte-equivalent to the pre-phase output (`git stash`-free check: compare the extracted `ld+json` before/after for one set).

### 35.7 Verify

**Files:** none.

Steps:
1. Run the Verification block. Record the gzip size of the gallery bundle and the `<script` inventory in the PR.
2. Mobile emulation in the browser pane at 375×812 (`resize_window` preset `mobile`, then reset to `desktop`): 3 columns by default, − / + work, viewer opens and swipes.
3. No-JS pass: disable JavaScript in DevTools — grid at default density, no control, thumbnails navigate to set pages.
4. Keyboard pass: Tab reaches every thumbnail, Enter opens the viewer, arrows/Esc work, focus returns, `-`/`=` change density.
5. **Paul tests on a real iPhone (Safari) and a real Android phone (Chrome)**: pinch the grid through every level; open a photo; pinch-zoom it; double-tap; pan; swipe to the next; close and confirm focus/scroll position. This box is his.

**Done when:** steps 1–4 pass and Paul has ticked step 5.

## Definition of Done

- [ ] `npm run build`, `npx astro check`, `npm test` green ([README](README.md) rule 4).
- [ ] `libraryOrder` has tests written before the implementation (flatten, date-desc, per-photo override, within-set stability, deterministic ties, cover dedupe, empty).
- [ ] `grep -rn "masonryLayout\|widthFactor\|MasonryInput\|MasonrySlot" src` → nothing.
- [ ] `grep -rn "featured\|licensingAvailable" src/content src/content.config.ts keystatic.config.ts` → nothing; `photos[].date` optional in **both** config files.
- [ ] `/gallery/` is one grid of 95 anchors, newest first, 2px gap, square thumbnails, 3 columns at 375px and 6 at ≥768px with JS off.
- [ ] Levels 3/5/7 (phone) and 4/6/8/12 (≥768px) reachable by buttons, `-`/`=` keys, ⌘/Ctrl+wheel and pinch; level persists via `localStorage` inside try/catch; `sizes` is rewritten per level.
- [ ] Gallery JS ≤6 KB gzip (command below); `/gallery/[slug]/` ships the viewer only; Home, About, Now, articles unaffected (0 KB).
- [ ] Viewer: swipe/arrows, caption + "from Set →", Esc/backdrop/close button, pinch zoom 1–4×, double-tap 2×, `touch-action: none` on the stage only, focus returns to the thumbnail of the current photo.
- [ ] No `backdrop-filter`, shadow, gradient, hover filter or motion in `Lightbox.astro`, `gallery/index.astro`, `gallery/[slug].astro` (`grep -n "backdrop-filter\|box-shadow\|gradient\|transition" ...` reviewed).
- [ ] `ImageGallery` JSON-LD on set pages and `CollectionPage` on the index still present; no peso figures; one `h1` per page.
- [ ] Axe clean on `/gallery/` and one set page ([README](README.md) rule 9) plus the keyboard pass.
- [ ] `git diff v2-final -- src/content/pages/about.md src/content/now src/content/thoughts src/assets/thoughts` is empty.
- [ ] **Paul:** pinch + viewer verified on a real iPhone (Safari) and a real Android phone (Chrome).
- [ ] `plan.md` boxes 35.1–35.7 and the Phase 35 DoD marked `[x] (YYYY-MM-DD)`.

## Verification

```
npm test && npx astro check && npm run build
```

```
# 95 anchors, newest set first
grep -o 'class="photo-trigger' dist/client/gallery/index.html | wc -l
grep -o 'href="/gallery/[a-z-]*/"' dist/client/gallery/index.html | uniq | head
```

```
# Script inventory and gzip size of everything the gallery page loads
grep -o '<script[^>]*>' dist/client/gallery/index.html
for f in $(grep -o '/_astro/[^"]*\.js' dist/client/gallery/index.html | sort -u); do printf '%s ' "$f"; gzip -c "dist/client$f" | wc -c; done
```

```
# Dead code and dead fields are gone
grep -rn "masonryLayout\|widthFactor\|featured\|licensingAvailable" src keystatic.config.ts | grep -v "^src/pages/projects\|^src/pages/sitemap"
```

```
npx serve dist/client -l 4321 &   # astro preview is unsupported by @astrojs/vercel (core/preview/index.js:45); serve the build
npx @axe-core/cli http://localhost:4321/gallery/ http://localhost:4321/gallery/honne-at-wanderland/
```

## Risks & notes

- **Disabling browser pinch-zoom over the grid** (`touch-action: pan-x pan-y`) is required for the density pinch to receive pointer events; the viewer is where full zoom lives, and text zoom still works. If this feels hostile on the real devices, the fallback is to drop grid pinch and keep buttons/keys.
- **iOS Safari** is the likely failure surface: `pointercancel` mid-pinch, `dialog` focus restoration, dynamic toolbar height (`dvh`). Test on hardware; do not trust emulation for the pinch.
- **Viewer ground is white.** §10 forbids a dark theme, so the viewer follows the site (Photos' light mode). If Paul wants a dark viewer for the photographs, it is one token on `.lightbox-dialog`; it would be the only dark surface, so ask rather than assume.
- **`sizes` rewriting** is the one trick that keeps 12 columns light and 4 columns sharp without JS-built `srcset`s; if the browser ignores `sizes` changes on already-loaded images, the visible cost is a slightly soft thumbnail until the next load, not a failure.
- **Eager count.** `index < 12` loads 12 thumbnails (~tens of KB total) on first paint; do not raise it.
- **Ties on equal dates** are broken by set slug, deliberately, so a rebuild never reshuffles the wall.
- **One script file, two exports.** Do not split `gallery.ts` into two files; the shared pointer helper is the reason it is one.
- Out of scope (do not build): month separators, an aspect-ratio toggle, a Cloudflare Images migration, any caption in the grid ([rebuild-plan §5.8](../../rebuild-plan.md), §10).

## Blocked on Paul

- Real-device test (35.7 step 5): iPhone Safari and Android Chrome, pinch on the grid and pinch/double-tap/pan in the viewer.
- Confirm the white viewer ground, or ask for a dark one.
- Optional: per-photo dates for any new shoot he adds (the field exists; the 95 existing photos use their set's date).
