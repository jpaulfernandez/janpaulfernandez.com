# Phase 31 — Foundation
**Slice:** the new brand (white ground, tangerine/cool-blue accents, Fraunces + Inter + JetBrains Mono, no motion library) is live on every existing page and nothing else has changed · **Depends on:** the approved plan (no earlier phase) · **Spec:** [rebuild-plan.md](../../rebuild-plan.md) §3, §7, §8 (Phase 31); [README](README.md) rules 2, 4, 5, 7, 9

## Context

Phases 20–29 built a dark site: `ink-*` is the ground, `paper-*` is the type, `wine-*` the accent, Switzer + Courier Prime, GSAP on every page. v3 inverts it: `paper` is the ground, `ink-*` is the type, `red-*` the accent, `blue-*` the secondary. **Token names collide and meanings invert** — `text-paper-100` was the body colour and is now a barely-visible alternate ground; `bg-ink-900` was a dark section and is now the darkest type colour. Tailwind silently drops unknown classes, so a missed class is invisible text, never a build error. That is why the sweep (31.5) is mechanical, gated by greps, and checklisted file by file.

This phase changes how every page *looks* and removes the motion bundle. It must not change what any page *says*, its URLs, its schema, or any content file. Pages that Phase 32 deletes (`/workshops/*`) are still re-skinned here so the preview is coherent. The branch is **not deployable between 31.2 and 31.5** (old utilities resolve to nothing); only the finished phase goes to a PR.

## Read first

- [CLAUDE.md](../../CLAUDE.md) "Hard constraints" — you are about to rewrite it (31.7); know what it says now.
- [rebuild-plan.md](../../rebuild-plan.md) §3 (all of it), §4 (nav, footer), §7 (fonts, CSS, OG).
- `src/styles/global.css` — `@theme` (line ~133), `:root` alpha tokens (~line 233), `@layer base` (~242), `@layer components` (~322 and again ~965), the reduced-motion block (~950).
- `src/layouts/BaseLayout.astro` — `navItems`/`elsewhere` (~38–60), the `.js` script (~82), font preloads (~118), header/footer markup (~137–290), scoped `<style>` (~295–365), menu script (~384–405), the motion `<script>` (~407).
- `src/pages/og/[...route].ts` (`getImageOptions`, ~line 85 on) and `src/scripts/motion.ts`.
- Fonts: the `@fontsource-variable/*` READMEs in `node_modules` after 31.1 (axes, file names).
- [Tailwind 4 docs](https://tailwindcss.com/docs/theme) on `@theme` vs `@theme static` — verify against current docs; do not rely on recalled behaviour.

## Tasks

### 31.0 Housekeeping — commit the T30 diff, tag `v2-final`

**Files:** none edited by you; git state only.
**Steps:**
1. `git status --short`. Expected pending (Phase 30 / T30): modified `astro.config.mjs`, `plan.md`, `public/robots.txt`, `src/layouts/BaseLayout.astro`, `src/pages/og/[...route].ts`; untracked `src/pages/sitemap.astro`, `rebuild-plan.md`, `docs/rebuild/`, `docs/archive/plan-phases-1-30.md`; plus the staged renames into `docs/archive/`.
2. **Ask Paul** whether to commit these as they stand (suggested: one commit for the T30 code — `feat(seo): sitemap page, robots, og + layout fixes` — and one for the docs move and the rebuild plan). Do not stash, discard, or "tidy" any of it. Do not commit without his OK.
3. After the commits: `git tag v2-final` on the last commit that contains **no v3 code** (the docs commit is fine; the tag exists to diff content, not to be deployed). Do not push the tag.
4. `git switch -c rebuild/31-foundation`.
5. Prove the baseline: `git diff v2-final -- src/content/pages/about.md src/content/now src/content/thoughts src/assets/thoughts` prints nothing; `npm run build && npx astro check && npm test` are green **before** you change anything. If any is red, stop and tell Paul — Phase 31 can't be measured against a broken baseline.

**Test-first?** No.
**Done when:** `git tag -l v2-final` prints it; `git status --short` is clean on `rebuild/31-foundation`; the three gates are green on that commit.
**Blocked on Paul:** the OK to commit the pending diff.

### 31.1 Fonts — Fraunces, Inter, JetBrains Mono

**Files:** `package.json`, `src/styles/global.css` (imports only), `src/layouts/BaseLayout.astro` (preloads only).
**Steps:**
1. `npm install @fontsource-variable/fraunces @fontsource-variable/inter @fontsource-variable/jetbrains-mono`.
2. Read each package's README and `files/` folder. Record in the PR: the CSS entry to import for each (Fraunces needs the `opsz` axis — the "optical size on" rule from §3.2 — so use whichever entry exposes `opsz` and `wght`; verify it exists), the CSS `font-family` string each declares (expected `Fraunces Variable`, `Inter Variable`, `JetBrains Mono Variable`), and the latin `woff2` file names.
3. In `global.css`, replace the Switzer `@font-face` blocks (lines ~85–109) and the two `@import "@fontsource/courier-prime/…"` lines with `@import`s of the three variable packages, placed at the top of the file with the other imports (CSS requires `@import` before other rules). **Leave the `@fontsource/courier-prime` package installed and the Switzer files in `public/fonts/`** — the OG route still loads Courier until 31.6, then both go (31.6 step 6).
4. Delete the `"Switzer Fallback"` `@font-face` block (~line 124). Do not write replacement fallback faces yet — Lighthouse CLS in 36.3 decides whether they earn their keep (YAGNI).
5. In `BaseLayout.astro`, replace the two Switzer `<link rel="preload">` lines with preloads for **only** the Inter latin woff2 and the Fraunces latin woff2. Vite hashes fontsource assets into `/_astro/`, so import the URL in the frontmatter (`import interUrl from '@fontsource-variable/inter/files/<exact-latin-file>.woff2?url'`, same for Fraunces) and use `href={interUrl}` with `as="font" type="font/woff2" crossorigin`. Verify the import form against current Astro/Vite docs; confirm the built `<head>` contains the hashed URLs. JetBrains Mono is not preloaded (kickers and dates sit below the first paint of most pages).
6. Do not set the `--font-*` variables yet — that is 31.2.

**Test-first?** No.
**Done when:** `npm run build` passes; `grep -rn "switzer-\(400\|500\|600\)" src` shows no `@font-face` or preload remaining (the files themselves stay until 31.6); built `dist/client/index.html` has exactly two `rel="preload" as="font"` links, both `/_astro/…woff2`.

### 31.2 Tokens — rewrite the `@theme` block

**Files:** `src/styles/global.css` (`@theme`, `:root`, `@layer base`).
**Steps:**
1. **Colours.** Delete every `--color-ink*`, `--color-paper-*`, `--color-wine-*` entry and write exactly [§3.1](../../rebuild-plan.md#31-colour-tokens-measured-on-ffffff): `--color-red-500 #FF5C34`, `--color-red-700 #A4402F`, `--color-blue-100 #D7EFFF`, `--color-blue-200 #BAC9D8`, `--color-ink-900 #351E28`, `--color-ink-600 #594C57`, `--color-ink-400 #6B6470`, `--color-paper #FFFFFF`, `--color-paper-100 #F7F8FA`. No `--color-ink` bare, no 700/800/950, no wine. Keep each token's use (from the §3.1 table) in a one-line comment — the same discipline the old block had.
2. **Tailwind built-in palette:** Tailwind 4 ships `red-*` and `blue-*` of its own. Defining `--color-red-500` etc. overrides those keys, but any *other* step (`red-400`, `blue-600`) would still resolve to Tailwind's default. Reset the namespaces first — `--color-red-*: initial; --color-blue-*: initial;`, or `--color-*: initial;` once at the top and then declare only the nine tokens (keep `transparent`/`current`, which Tailwind provides outside the namespace). Dropping Tailwind's `white` and `black` is intended: pure `#FFF` type and pure black are out of the palette, and `--color-paper` is the white. Verify the reset syntax against current Tailwind 4 docs.
3. **Fonts.** `--font-display: "Fraunces Variable", Georgia, "Times New Roman", serif;` `--font-body: "Inter Variable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;` `--font-mono: "JetBrains Mono Variable", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;` — use the family strings you recorded in 31.1.
4. **Type scale.** Obtain the Oddhalls `--step--2 … --step-5` clamp ladder **verbatim**: open `https://oddhalls.janpaulfernandez.com`, find the stylesheet in DevTools / `view-source`, copy the custom-property values. If they can't be read, **ask Paul for the source — do not invent or approximate them** (Blocked on Paul). Put the ladder in `:root` (plain custom properties, no utility namespace; if you prefer `@theme`, use `@theme static` so Tailwind doesn't tree-shake them — check the docs). Then **re-point the existing semantic names** `--text-micro/small/body/lead/h3/h2/h1/display` at the nearest step (`--text-display: clamp(2.6rem, 1.7rem + 4.6vw, 6rem)` as §3.2 specifies; `--text-body` stays 17px = 1.0625rem). This keeps the `text-h2`, `text-small`… utilities that ~20 files already use working with zero churn. Write the step↔name table in the PR.
5. **Spacing.** Leave the 8-pt `--spacing-*` map exactly as it is (utilities depend on it). Add the Oddhalls `--space-3xs … --space-3xl` ladder as `:root` variables, read from the same source as step 4; `.section`/`.shell` (31.3) consume them.
6. **Radius:** `--radius-sm/md/lg` stay at 2px (the cap is 4px; 2px already complies). **Motion:** keep `--ease-out-quint` only if 31.3 still uses it; delete the GSAP comment.
7. **`:root` non-theme properties.** Delete `--surface-1/2/3` (alpha-white fills — invisible on white and forbidden by "hairline is the only surface"). Redefine `--line: var(--color-blue-200)`; delete `--line-strong` (or make it `--color-ink-400` if 31.3 needs a stronger rule — decide there). Keep `--shell-x`.
8. **`@layer base`:** `html`/`body` ground → `var(--color-paper)`, text → `var(--color-ink-900)`; body `font-size: var(--text-body)` (17px), `line-height: 1.6`, drop the `ss01` Switzer feature setting and the `letter-spacing: -0.011em` unless Inter looks wrong without it (judge by eye in 31.9). `h1`/`h2` → `--font-display`, weight 450–600, tracking `-0.02em`, `font-optical-sizing: auto`; `h3`/`h4` → `--font-body`. `a` → `--color-red-700`, underlined (offset/thickness set once here). `::selection` → `blue-100` ground with `ink-900` text. Measure token `--measure: 38rem` (§3.2) in `:root`.

**Test-first?** No (CSS) — but gate with the grep in "Done when".
**Done when:** `grep -nE "wine|ink-(950|800|700)\b|paper-(50|200|400|600)\b|--surface-|Switzer|Courier" src/styles/global.css` prints only lines inside the 31.3 rewrite region you haven't reached yet (note which); the `@theme` block lists exactly the nine colours; `npm run build` passes (pages will look wrong — expected until 31.5).

### 31.3 `global.css` rewrite — `@layer components` only

**Files:** `src/styles/global.css` only.
**Steps:**
1. **Inventory first.** For every class selector now in `@layer components` (today: `.anchor-icon .anchor-link .brighten-line .btn .btn-ghost .btn-primary .card .display .faq .faq-mark .field .field-label .kicker .lead .link .link-arrow .mono .mono-micro .panel .prose .rail .rail-compact .rail-date .rail-item .row-link .row-meta .row-title .rows .section .section-ruled .section-tight .shell .shell-narrow .skip-link .statement-sm .subtext .tag`) run `grep -rn "class=.*\bNAME\b\|class:list.*NAME" src --include=*.astro --include=*.mdx` and record usage count in the PR. **Zero uses ⇒ delete.** Used ⇒ keep, restyled from the tokens. Expect `.brighten-line` and the `[data-brighten]` rules to die; `.btn-ghost`, `.card`, `.statement-sm` are decided by their counts, not by taste. `.panel` stays (restyled as a 1px `--line` box, no fill) until 32.6 removes its last callers.
2. **Required classes** (§7): `.shell, .section, .section-ruled, .section-tight, .rows/.row-link, .kicker, .mono, .btn, .btn-primary, .link, .panel-tint, .prose, .faq, .field`. `.panel-tint` is new: `background: var(--color-blue-100)`, 1px `--line` border, padding from `--space-*`, radius ≤ 4px, no shadow. `.btn-primary`: `background: var(--color-red-500); color: var(--color-ink-900)` (5.0:1) — never white text on red; no pill radius. `.kicker`/`.mono`: `--font-mono`, 12–13px, `0.14em` tracking, uppercase for kickers, `color: var(--color-ink-400)`. `.link`: `red-700`, underline. `.section` = `padding-block` from `--space-*`; `.section-ruled` adds `border-top: 1px solid var(--line)`; `.section-tight` = smaller padding, no rule. `.prose` = measure `38rem`, Inter 17px/1.6, `h2/h3` spacing, `code`/`kbd` on `--color-blue-100`.
3. **Delete all motion CSS:** every `.js [data-reveal…]`, `[data-hero]`, `[data-brighten]`, `[data-revealed]`, `.brighten-line` rule, and the lines in the reduced-motion block that name them. Keep the generic `prefers-reduced-motion` rule that zeroes `animation`/`transition` durations — it is harmless and cheap.
4. **Structure:** merge the two `@layer components` blocks (~322–948 and ~965–985) into one; the reduced-motion `@media` stays at top level after it. Nothing else may be unlayered except `@theme`, `:root` and `@layer base`.
5. **Colour/hex/alpha audit inside the file:** `grep -nE "rgba\(|#[0-9A-Fa-f]{3,8}\b|color-(ink|paper|wine)" src/styles/global.css` — every hit is either a v3 token or a deliberate exception noted in a comment. No gradients, no `box-shadow`, no `backdrop-filter`, no `radial-gradient` (the old ambient glows).
6. **Keep the `.js` guard pattern documented:** leave the `.js` ancestor class contract (set by the blocking inline script in `<head>`; any hidden resting state sits behind `.js`) as a short comment block at the top of `@layer components`, for the Phase 35 gallery controls. Write no CSS for it now.
7. `.rail*` (Now timeline) and `.row-*` keep working as-is structurally; their colours follow the map in 31.5.

**Test-first?** No.
**Done when:** `grep -c "data-reveal\|data-hero\|data-brighten\|data-revealed" src/styles/global.css` → 0; `grep -n "^@layer" src/styles/global.css` shows `base` and exactly one `components`; `grep -nE "box-shadow|backdrop-filter|gradient" src/styles/global.css` → 0; every class in the final file has ≥ 1 usage in `src` (list the check in the PR).

### 31.4 Remove motion

**Files:** `src/scripts/motion.ts` (delete), `src/layouts/BaseLayout.astro`, `package.json`/`package-lock.json`, and every file the grep finds.
**Steps:**
1. `git rm src/scripts/motion.ts`; delete the `<script> import '../scripts/motion.ts'; </script>` block at the end of `BaseLayout.astro` (~line 407).
2. `npm uninstall gsap`.
3. Strip attributes from every `.astro`/`.ts`/`.mdx` under `src`: `data-reveal`, `data-reveal-delay`, `data-reveal-stagger`, `data-hero`, `data-brighten`, `data-parallax`, `data-revealed`. Values can be `="up"`, `={i * 80}` or bare. Suggested: `perl -0pi -e 's/\s+data-(?:reveal(?:-delay|-stagger)?|hero|brighten|parallax|revealed)(?:="[^"]*"|=\{[^{}]*\})?//g' $(grep -rlE "data-(reveal|hero|brighten|parallax|revealed)" src)` — then `git diff --stat` and read the diff of at least five files; the regex must not eat a following attribute or leave `class=""` orphans. Inspect any file with an expression containing braces by hand. Wrappers that existed only to carry the attribute are left alone (surgical; cleaning them is not this task).
4. Keep the inline `<script is:inline>document.documentElement.classList.add('js');</script>`; rewrite its comment (~lines 76–81), which says it arms animations: it now exists for progressive-enhancement scripts (Thoughts/Projects filters, Gallery) and the Phase 35 controls.
5. Confirm nothing under `src/content/**` contained the attributes (`git diff v2-final -- src/content` must remain empty; if a thought contains one, stop and ask — thoughts are frozen).

**Test-first?** No.
**Done when:** `grep -rEn "data-(reveal|hero|brighten|parallax|revealed)|gsap|ScrollTrigger|SplitText|motion\.ts" src package.json` → 0 hits; `ls dist/client/_astro | grep -i gsap` → nothing after a build; `npm run build && npx astro check && npm test` green.

### 31.5 Utility sweep — old ink/paper/wine → v3 tokens

**Files:** the checklist below. Decide per usage whether it is **text, fill or border** — the same old class maps differently by role.
**Steps:** apply the map, file by file, in this order (utilities **and** `var(--color-…)` references in scoped `<style>` blocks **and** arbitrary values like `border-[var(--line)]`):

| old | new |
|---|---|
| `text-paper-50`, `text-paper-100` | `text-ink-900` |
| `text-paper-200` | `text-ink-600` |
| `text-paper-400` | `text-ink-400` |
| `paper-600` (rules, separators — non-text) | `blue-200` (borders) / `ink-400` (decorative glyphs) |
| `bg-ink`, `bg-ink-950/900/800` | `bg-paper` |
| `bg-ink-700`, raised/hover grounds | `bg-paper-100` (once per page at most) or remove |
| `border-ink-700/800`, hairlines | `border-blue-200` |
| `text-wine-400`, link colour | `text-red-700` |
| `ring-wine-300` (focus) | `ring-red-700` |
| `bg-wine-500/600` fills | `bg-red-500` with `text-ink-900` |
| `shadow-*`, `bg-gradient-*`, `backdrop-blur`, glows | delete |

Rules that go with the map: red never carries body-size text except `red-700`; red fills carry `ink-900` text, never white; `ink-400` is metadata only (a sentence someone is meant to read gets `ink-600`); inside a `blue-100` tint use `ink-600`, not `ink-400` (the tightest pair). The `Lightbox.astro` dialog keeps a dark scrim (`var(--color-ink-900)` at ~0.94 alpha, `paper` text) — it is rebuilt in 35.5; make it legible, change nothing else.

**Checklist — tick each in the PR** (union of the 15 utility files and the files with scoped `var(--color-…)`; re-derive with `grep -rlE "(ink|paper|wine)-[0-9]|var\(--color-(ink|paper|wine)|--surface-|--line" src`):
- [ ] `src/styles/global.css` (finished in 31.2–31.3) · [ ] `src/layouts/BaseLayout.astro` · [ ] `src/layouts/ArticleLayout.astro`
- [ ] `src/components/PostListItem.astro` · [ ] `Timeline.astro` · [ ] `Lightbox.astro` · [ ] `blocks/Embed.astro` · [ ] `blocks/Callout.astro` · [ ] `blocks/KeyTakeaway.astro` · [ ] `blocks/PullQuote.astro`
- [ ] `src/pages/index.astro` · [ ] `about.astro` · [ ] `now.astro` · [ ] `colophon.astro` · [ ] `sitemap.astro` · [ ] `404.astro` · [ ] `thanks.astro`
- [ ] `src/pages/projects/index.astro` · [ ] `projects/[slug].astro` · [ ] `gallery/index.astro` · [ ] `gallery/[slug].astro` · [ ] `thoughts/index.astro` · [ ] `thoughts/[slug].astro` · [ ] `topics/[topic].astro`
- [ ] `src/pages/work-with-me.astro` · [ ] `workshops.astro` · [ ] `workshops/[slug].astro` (both deleted in 32.6; swept now so the preview is readable)

KeyTakeaway / PullQuote / Callout only need to be *legible* here (map applied); their v3 design is task 36.1. Check the same for `src/content/**/*.mdx` — blocks are used there, but classes are not (frozen; verify with the grep, do not edit).

**Test-first?** No.
**Done when** (all greps over `src`, all must print nothing, except noted):
- `grep -rn "wine-" src` → 0
- `grep -rnE "(text|decoration|fill|stroke)-paper" src` → 0 (paper is a ground, never type)
- `grep -rnE "(bg|border|ring|divide|outline)-ink" src` → 0 except `Lightbox.astro` (until 35.5)
- `grep -rnE "(ink-(950|800|700)|paper-(50|200|400|600))\b" src` → 0
- `grep -rnE "var\(--color-(wine|ink-(950|800|700)|paper-(50|200|400|600))|--surface-|--line-strong" src` → 0
- `grep -rnE "rgba\(255|shadow-|backdrop-|bg-gradient|radial-gradient" src` → 0 (Lightbox scrim excepted, with a comment)
- Every remaining `ink-`/`paper-`/`text-ink-400` usage was reviewed against the map (the checklist is the proof). Open every route type once and look.

### 31.6 OG route re-theme

**Files:** `src/pages/og/[...route].ts`; `public/fonts/og/` (only if the fallback is needed); `package.json`; `public/fonts/switzer-*` (delete).
**Steps:**
1. In `getImageOptions`: `bgGradient: [[255, 255, 255]]` (paper), `border` colour `[255, 92, 52]` (red-500), `side: 'block-end'`, width 12 — the red rule; title colour `[53, 30, 40]` (ink-900), description colour `[89, 76, 87]` (ink-600). Title family Fraunces, description family Inter. Keep sizes (60/26) unless the faces look off.
2. **Font loading — the risk.** `astro-og-canvas` renders with CanvasKit from font files passed in `fonts:`. Read its README for which formats it accepts (TTF/OTF/WOFF/WOFF2?) and whether **variable fonts** work. Do not assume. The `@fontsource-variable/*` files are variable woff2. If they load and render the right weight, point `fonts:` at `./node_modules/@fontsource-variable/…/files/…-latin-wght-normal.woff2` (and Fraunces likewise) and the `family` strings must match each font's internal family name.
3. **Fallback if not:** use one static instance of each face. Without adding a dependency: `npm install --no-save @fontsource/fraunces @fontsource/inter`, copy the latin 400 `.woff` (or TTF if the package ships one) for each into `public/fonts/og/`, `npm uninstall` them (they must not appear in `package.json`), and reference `./public/fonts/og/…`. Commit only the copied files.
4. Leave the `courses` collection loop in the file — it is removed with the rest of the workshops code in 32.6.
5. `npm run build`; open **three generated PNGs** from `dist/client/og/` (suggest `home.png`, a thought, a gallery set) and look at them: white ground, cherry title in a serif face (not a fallback sans), red rule at the bottom, nothing clipped. Attach them to the PR.
6. Now that nothing references them: `npm uninstall @fontsource/courier-prime`; `git rm public/fonts/switzer-*.woff2`; confirm `grep -rniE "switzer|courier" src public package.json astro.config.mjs` shows only `colophon.astro` (rewritten in 31.7).

**Test-first?** No.
**Done when:** three PNGs reviewed and attached; `ls public/fonts` has no `switzer-*`; `grep -n courier package.json` → nothing; build green.

### 31.7 Docs — CLAUDE.md and the colophon

**Files:** `CLAUDE.md`, `src/pages/colophon.astro` (and read `AGENTS.md`, `GEMINI.md`: both are one-line `@CLAUDE.md` imports, nothing to edit).
**Steps:**
1. `CLAUDE.md` — rewrite **only** the brand/motion/type bullets under "Hard constraints" and the lines that point at dead things; keep the YAGNI ladder, workflow, commands and the surviving rules (README rule 5):
   - Intro line and "Workflow": `spec.md` is v1 (rewritten in 36.4); full requirements are [rebuild-plan.md](rebuild-plan.md), build order is `plan.md`, task detail is `docs/rebuild/phase-NN-*.md` (not `tasks/`, which moved to `docs/archive/`).
   - YAGNI paragraph: delete the "GSAP is the standing exception" sentence and the Lenis note.
   - "Client JS": replace with the rule-7 budget: zero JS by default; the only client scripts are the Thoughts/Projects filters and the Gallery; nothing imports GSAP (it is gone).
   - "Motion must be removable": delete. Keep the `.js` guard sentence in a shorter form (hidden resting states only behind `.js`).
   - "Palette is dark": replace with the v3 palette (paper ground; ink-900/600/400 type; red-500 fills and ≥24px display words, red-700 for links/small accent/focus; blue-100/200 as ground and hairlines only, no blue text; blue is a ground, not a type colour).
   - "Contrast has a ceiling": delete; replace with "`ink-900` is the darkest value; no pure black; no white type on red; red fills carry `ink-900`".
   - "Four tiers" bullet: new names (`ink-900` headings/body → `ink-600` secondary reading copy → `ink-400` metadata only).
   - "Hairline" bullet: `--line` is `blue-200`; the only tinted block is `.panel-tint`, at most once per page.
   - "Two families": three — Fraunces (h1/h2/display), Inter (body/h3/UI), JetBrains Mono (`.mono`, `.kicker`, dates, code), via `@fontsource-variable/*`.
   - "v2 backlog… Dark mode" parenthetical: "the site is white, full stop; there is no toggle and no dark theme to maintain."
2. `colophon.astro` — update the font and tool credits (the "Switzer + Courier Prime" row ~line 37 and the "GSAP + ScrollTrigger" row ~line 42; the header comment ~line 17 that explains them). State only facts: the three typefaces and their sources, no motion library. Read the whole page for other claims the build has made false (dark palette, "five faces total").
3. Check `.claude/skills/fable-frontend-developer/SKILL.md` for dark-build/GSAP/Switzer rules (`grep -inE "wine|switzer|gsap|dark|data-reveal" …`). If a line contradicts v3, fix just that line; if it is large, add a Phase 36 task to `plan.md` instead.
4. The memory-note pointer is Phase 36's job (36.4).

**Test-first?** No.
**Done when:** `grep -niE "wine|switzer|courier|gsap|lenis|data-reveal|dark|#FFF|paper-50|ink-950" CLAUDE.md` returns only intentional historical mentions (list them in the PR) or nothing; colophon builds and `grep -n "Switzer\|Courier\|GSAP" src/pages/colophon.astro` → 0; `grep -rniE "switzer|courier|gsap" src package.json` → 0.

### 31.8 BaseLayout chrome — nav and footer

**Files:** `src/layouts/BaseLayout.astro` only.
**Steps:**
1. `navItems` → `Work with me /work-with-me/ · Projects /projects/ · Thoughts /thoughts/ · Gallery /gallery/ · About /about/ · Now /now/` (§4 order and wording — "Thoughts", not "Writing"). Workshops leaves the nav now; its pages still exist until 32.6. Wordmark = link to `/` (it already is the Home link).
2. The one red button on the right: "Book a scoping call" → `/work-with-me/#enquire`, `.btn .btn-primary`, shown in the header at `md` and above. The anchor doesn't exist until 32.4; until then it lands at the top of the page — acceptable, noted in Risks.
3. **Mobile sheet with no JS:** replace the button + `aria-expanded` machinery with `<details class="mobile-nav"><summary>Menu</summary>…</details>` containing the six links and the button. Delete the inline menu `<script is:inline>` block (~lines 384–405) and any `.menu-toggle` CSS. The sheet closes on navigation because the page reloads. Keep `isNavActive` and `aria-current="page"`; extend the Thoughts rule only if needed (topics already match).
4. Hide the desktop row on small screens and the `<details>` on large with **`@media` queries in the scoped `<style>`**, not `hidden md:flex` against a scoped rule (CLAUDE.md trap).
5. Footer per §4: email (`mailto:jpaul.fernandez18@gmail.com`), LinkedIn, Instagram, RSS · Sitemap · Colophon · `llms.txt` (kept; §4 lists it as kept) · `© {year}`, plus the one-line Person summary (reuse the first sentence of the `person()` description constant in `schema.ts` — do not write a second bio; export it if needed, which is a `src/lib` change: add a one-line test that the export is non-empty). **GitHub:** no profile URL exists anywhere in the repo (only the Keystatic repo slug `jpaulfernandez/janpaulfernandez.com`). Omit the link and ask Paul to confirm `https://github.com/jpaulfernandez`; adding it is one line.
6. Re-style the scoped `<style>` with tokens (31.5 already swept the colours; here remove glow/blur/sticky-pill remnants — the header is a plain bar with a 1px `--line` bottom rule). Skip link stays first in `<body>`.
7. GA4 tag and the `.js` script remain untouched (README rule 7).

**Test-first?** No (the `schema.ts` export, if made, gets its test first).
**Done when:** built `dist/client/index.html` contains no `<script` other than the `.js` class script and the two GA4 tags; `grep -c "aria-expanded" dist/client/index.html` → 0; header shows six links + one red button at 1280px and `<details>` Menu at 375px (check in the browser pane); keyboard: `Tab` reaches skip link → wordmark → nav → button, `summary` toggles with `Enter`/`Space`, focus ring is red-700.

### 31.9 Verify and review

**Files:** none (PR description).
**Steps:**
1. Gates: `npm run build && npx astro check && npm test`.
2. **Axe per route type** (README rule 9): `npx serve dist/client -l 4321`, then `npx @axe-core/cli` on `/`, `/about/`, `/now/`, `/projects/`, `/projects/oddhalls/`, `/work-with-me/`, `/workshops/`, `/workshops/ai-fluency/`, `/thoughts/`, one thought that uses all four blocks, one `/topics/<t>/`, `/gallery/`, one `/gallery/<set>/`, `/colophon/`, `/sitemap/`, `/thanks/`, a 404 URL. Zero violations; fix, don't suppress.
3. **No JS:** `grep -c "<script" dist/client/thoughts/<an-article>/index.html` — only the `.js` class script and the two GA4 `<script`s; no `/_astro/*.js` reference on any page except those that already carry a filter script (Thoughts index, Projects index, Gallery) — list them.
4. **Contrast spot-check** of the token pairs (compute with a throwaway script in the scratchpad or an online checker; record the numbers): `ink-900/paper` 15.35, `ink-600/paper` 8.09, `ink-400/paper` 5.71, `red-700/paper` 6.26, `red-700/paper-100`, `ink-900/red-500` 5.0, `ink-900/blue-100`, `ink-600/blue-100`, `ink-400/paper-100`, `ink-400/blue-100` (expected ≈ 4.8 — closest to the 4.5 line; if < 4.5 forbid `ink-400` inside `.panel-tint`). Every pair used for text ≥ 4.5; `blue-200`/`red-500` only as non-text.
5. Content untouched: README rule 2 diff is empty. Final grep gates from 31.4/31.5/31.7 re-run.
6. PR description: task checklist with usage counts (31.3), the step↔name table (31.2), the three OG PNGs (31.6), axe summary, JS list. Hand the preview URL to Paul.

**Done when:** every item above passes and Paul has reviewed the Vercel preview (his review is the last box).

## Definition of Done

- [x] `v2-final` tag exists; content-diff command (README rule 2) is empty (`git diff v2-final -- src/content/pages/about.md src/content/now src/content/thoughts src/assets/thoughts`)
- [x] `npm run build`, `npx astro check`, `npm test` green
- [x] `grep -rEn "data-(reveal|hero|brighten|parallax)|gsap|motion\.ts" src package.json` → 0; `src/scripts/motion.ts` gone; `gsap` not in `package.json`
- [x] `grep -rn "wine-" src` → 0; all other 31.5 grep gates clean (Lightbox scrim the one commented exception)
- [x] `@theme` defines exactly the nine v3 colours; `global.css` has one `@layer components`, no `box-shadow`/`backdrop-filter`/gradient
- [x] No `switzer`/`courier` in `src`, `public`, `package.json`; fonts are the three `@fontsource-variable/*` packages; two font preloads on the home page
- [x] OG cards re-themed; three PNGs checked by eye
- [x] CLAUDE.md and `colophon.astro` describe v3; the nav and footer match §4 (GitHub link pending Paul)
- [x] `npx @axe-core/cli` clean on every route type listed in 31.9; token-pair contrast numbers recorded, all text pairs ≥ 4.5
- [x] No `<script` in built article HTML beyond the `.js` class script and the GA4 tags
- [ ] Paul has reviewed the PR's Vercel preview

## Verification

```bash
npm run build && npx astro check && npm test
git diff v2-final -- src/content/pages/about.md src/content/now src/content/thoughts src/assets/thoughts   # empty
```
```bash
grep -rEn "data-(reveal|hero|brighten|parallax)|gsap|ScrollTrigger|SplitText|motion\.ts" src package.json   # nothing
grep -rn "wine-" src                                                                                       # nothing
grep -rnE "(text|decoration|fill|stroke)-paper|(bg|border|ring|divide|outline)-ink|(ink-(950|800|700)|paper-(50|200|400|600))\b" src   # nothing (Lightbox excepted)
grep -rniE "switzer|courier" src public package.json astro.config.mjs                                     # nothing
```
```bash
grep -c "<script" dist/client/thoughts/*/index.html | sort -u        # same small count everywhere: .js script + GA4
npx serve dist/client -l 4321 &   # then: npx @axe-core/cli http://localhost:4321/ http://localhost:4321/work-with-me/ …
```

## Risks & notes

- **Name collisions are the whole risk.** `text-paper-100`/`bg-ink-900` etc. exist before and after with opposite meanings, so a half-swept file builds clean and renders wrong. The grep gates catch old-only names and old-role usages; the per-file checklist and a visual pass catch the rest. Don't batch-`sed` the map — decide text/fill/border per usage.
- Tailwind's default `red-*`/`blue-*` palettes survive unless the namespaces are reset (31.2 step 2); an unreset `bg-red-400` would silently work and be off-palette. Grep for any red/blue step other than `red-500`, `red-700`, `blue-100`, `blue-200`.
- Oddhalls values are not in this repo. If the served CSS can't be read, the step/space ladders are Blocked on Paul — use the §3.2 display clamp, keep today's other `--text-*` values as placeholders, log it in `plan.md`, and say so in the PR.
- `astro-og-canvas` + variable fonts is the one genuinely unknown integration (31.6); the fallback is specified, don't improvise a new dependency.
- `Fraunces Variable` + `font-display: swap` will shift layout slightly on first load; metric-matched fallbacks are deliberately deferred to Lighthouse (36.3).
- `/workshops/*` pages are swept but will be deleted in 32.6 — don't polish them.
- The header button links to `/work-with-me/#enquire` before that anchor exists (32.4). That is intentional and harmless.

## Blocked on Paul

- OK to commit the pending T30 diff (31.0).
- Oddhalls `--step-*` / `--space-*` source, if not readable from the live CSS (31.2).
- GitHub profile URL for the footer (31.8).
- Visual review of the PR preview (31.9) — merge is his call.
