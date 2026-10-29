# Phase 36 notes

## 36.1
- Phase-file drift (scout, confirmed): KeyTakeaway was already blue-100 + red-700 label with no gradient; only the stale "wine" comment, the 0.18em tracking and the missing 3px red-500 left rule changed. Embed already had `bg-paper-100`; only the border moved from `--line` to the explicit `blue-200` utility (same colour).
- PullQuote: italic was **not** loaded (global.css imports only `fraunces/opsz.css`), so the browser was synthesising one and the block rendered `font-style: normal` anyway. Now `font-style: italic` + an italic import in PullQuote's frontmatter, not preloaded. 36.1 first used `opsz-italic.css` (81 KB latin, matches the roman's opsz axis); 36.3 switched to the phase file's `wght-italic.css` (46 KB) after Lighthouse showed the italic, which every article with a pull quote requests at load, costing ~0.3 s of simulated mobile LCP. Verified in the pane: one `Fraunces Variable` italic face `loaded`, computed `italic`. Rule is now `border-left: 2px solid blue-200` (was a 1px `::before`).
- Callout: idea rule `ink-600` (was ink-900, label now ink-400 like note), warning rule `red-500` (was red-700), label `red-700` unchanged; tracking 0.14em; body explicitly ink-900. Variant prop and labels unchanged.
- ArticleLayout: `.prose` max-width is lifted in the layout's scoped style and `p, ul, ol, blockquote, h2, h3, h4` children get `--measure` (38rem). Other `.prose` users (About, Now, Work with me, projects, Timeline) are untouched. Extra rule beyond the phase: Markdown wraps each diagram in a bare `<p>`, so `p:has(> img)` gets `max-width: none` — without it the five diagrams in `a-quick-map-on-large-language-models` stayed at 608px. At 1280: text 608px (38rem), table and diagrams 848px (the 58rem container), KeyTakeaway/Callout full container.
- Cover: `<figure class="shell">`, `widths={[800,1200,1600]}`, `sizes="(min-width: 84rem) 80rem, 100vw"`, eager + `fetchpriority="high"`, no border/radius. 1200px wide at 1280 (shell edge to edge).
- Masthead: back link "← Thoughts"; metadata line all `ink-400` mono with the author as a `.link` (red-700 underline). Breadcrumb JSON-LD name `Writing` → `Thoughts` (blogPosting unchanged). TOC: blue-200 hairline, `.toc-mark` swaps `+`/`−` via `::before` content (no transition, no rotate). Prev/next are `.rows` / `.row-link` ruled rows (title + "← Previous"/"Next →" meta), no `.card`.
- Embed checked on a throwaway `zz-embed-check` page (paper-100 ground, 1px blue-200, 2px radius, youtube embed URL), deleted before commit.
- Article built HTML: only the 45 B `.js` class script, gtag (async src + 173 B config) and JSON-LD — no module script on any of the six thoughts.

## 36.2
- `/thoughts/`: `<title>`, h1, `blog()` name and breadcrumb say **Thoughts** (were "Writing"; the nav says Thoughts). Type filter is now three `.chip` buttons (the scoped `.segmented`/`.seg` styles and a duplicate scoped `.sr-only` are gone — Tailwind's `sr-only` utility serves). Buttons gained `type="button"`. `.filter-bar { display: none }` / `:global(.js) .filter-bar { display: block }`. Script untouched: inline module 984 B raw / **492 B gzip** (≤ 2 KB). In the pane: bar `block` with `.js`, `none` without; Notes → 0 rows + empty state, All/All restores 6; built HTML has 6 `post-row`s, none `hidden`.
- **Flag for Paul/reviewer — red fills above the fold on `/thoughts/`:** at 1280×900 the nav CTA, the pressed "All" type chip and the pressed "All topics" chip are three red fills (the selected chip is a sanctioned red fill per §3.1, and `/projects/` has two). Not changed here because it needs a design call (e.g. "All" pressed as a hairline-only state, or one combined group). Also: the "Notes" chip filters to zero today (every thought is an essay).
- PostListItem: title hover is `red-700` + underline (no colour transition); focus ring moved to the stretched `::after` overlay so the whole row gets the `red-700` ring (verified with a real Tab press: `rgb(164,64,47) solid 2px`). The cover's grayscale filter, hover-to-colour and its 0.4s transition are removed (photography in colour at rest, as on the portrait and gallery). `stage` prop untouched.
- Topics: intro `.lead` → `.subtext` capped at `--measure`; back link "← All thoughts"; breadcrumb "Thoughts". `<title>` and CollectionPage name stay "Writing on {Topic}" (T30 titles are on the phase's must-not-change list).
- 404: destinations Home, Work with me, Projects, Thoughts, Gallery, About, Now as a ruled `.rows` list (title + path), no pills; copy, `noindex`, one h1 unchanged.
- Thanks: already read "probably mid-session" and the back link is already the hairline `.btn btn-ghost`; no edit. Still flag the line for Paul's approval.
- Colophon: no Switzer/Courier/GSAP/Lenis; credits are Fraunces, Inter, JetBrains Mono, Astro, Tailwind, Keystatic, Vercel (+ Web3Forms). The "~96/~111 utility lines" are clean v3 utilities; no edit.
- HTML sitemap: sections reordered to Pages, Program, Projects, Thoughts, Topics, Photo sets (+ Feeds); "Writing" → "Thoughts", "Core Pages" → "Pages", "AI-Resilient Organisation" → "Program", "Photo Galleries" → "Photo sets"; `subtext text-sm/text-xs` → `subtext` (reading copy at body size). Counts read from the collections: 9 pages, 5 tiers, 1 case study, 6 thoughts, 9 topics, 4 sets.
- Outside the listed files (logged in plan.md): global `.rail-item:first-child::before` red-500 removed — only About's career Timeline uses `.rail` (Now draws its own `.tl` rail and keeps its red dot), so it was a stray red fill flagged by Phase 34.
- Checked, not changed: `/work-with-me/` FAQ `.faq-mark` does rotate to × when open (computed `matrix(0.707…)`); the "stays +" report was likely read mid-transition. It still animates (0.3s rotate); the TOC lost its rotate in 36.1, so Paul may want the FAQ to match.

## 36.3 (local only — not ticked)
Built site served with `npx serve dist/client -l 4400`, `npx lighthouse@12.8.2` (Chrome 156, headless=new, default simulated throttling), mobile = default preset, desktop = `--preset=desktop`. Reports: `$SCRATCHPAD/lh/u{1..5}-{mobile,desktop}.report.{json,html}` (session scratchpad, not in the repo).

| URL | Mobile P / A / BP / SEO | Desktop P / A / BP / SEO |
|---|---|---|
| `/` | **87** / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| `/work-with-me/` | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| `/work-with-me/ai-resilient-organisation/` | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| `/thoughts/if-ai-takes-all-the-jobs-what-do-we-actually-do/` | **93** / 100 / 100 / 100 (median of 3, after the italic fix) | 100 / 100 / 100 / 100 |
| `/gallery/` | 95 / 100 / 100 / 100 (median of 3: 94, 95, 95) | 100 / 100 / 100 / 100 |

CLS is 0 on every run, so the metric-matched fallback `@font-face` remedy is not needed. TBT ≤ 30 ms everywhere. Every miss is mobile LCP under Lantern's simulated 1.6 Mbps link, where everything requested before the observed LCP shares the bandwidth.

- **`/` mobile 87 — cause: GA4.** LCP element is the portrait (41 KB, eager, `fetchpriority="high"`, sized `sizes` — already right). With `googletagmanager.com` + `google-analytics.com` blocked: **99**, LCP 4.1 s → 2.3 s. The gtag script is 177 KB and its evaluation (153 ms observed, ×4 simulated) is the largest main-thread item. Per R8 the tag stays; Paul's decision. Delta: −12 points.
- **Article mobile 93 — cause: early bytes on a cover page.** LCP element is the cover (800w, 90 KB, eager, `fetchpriority="high"`). Fix applied: PullQuote italic → `wght-italic` (−36 KB; 92–93 → 93 stable). Diagnosed but not applied: (a) the eight Markdown body images ship one 1600w file each with no `srcset` (02 alone is 178 KB) and three of them start loading at ~27 ms because Chrome's lazy-load margin reaches them; a copy of the page without them scores 95. Setting `image: { layout: 'constrained' }` in `astro.config.mjs` gives every Markdown image a `srcset` (mobile picks 750w: 178 → 61 KB) and measured **94**; it was reverted because it rewrites every `<Image>` on the site (adds `srcset`, inline `--fit/--pos` style and `data-astro-image` to the gallery, PostListItem covers, portrait, logos — new hashes for all) and is a site-wide decision outside 36.3's "no files unless a score fails, fix only the cause". An MDX `img` override component is the narrower alternative. (b) Blocking GA4 did not move this page (91–93, noise). Thought content stays frozen either way.
- `/gallery/` mobile sits on the line (94–95): LCP is the `p.lead` text; the eager first rows of thumbnails share the link. Not changed.
- These are local `serve` numbers (HTTP/1.1, no Vercel headers). The phase records the **Vercel preview** numbers; there is no preview because this work stays local on `main` (no push). 36.3 stays unticked until the preview run and the GA4 call.

axe (`@axe-core/cli` 4.14 via npx, chromedriver 156.0.8078.73): 0 violations on `/thoughts/what-is-a-token-anyway/`, `/thoughts/if-ai-takes-all-the-jobs-what-do-we-actually-do/`, `/thoughts/`, `/topics/ai/`, `/404.html`, `/sitemap/`, `/about/`, `/thanks/`, `/colophon/`.

JS: articles ship only the 45 B `.js` class script + gtag + JSON-LD (0 KB module JS); `/thoughts/` filter inline module 984 B / 492 B gzip.

### 36.3 follow-up: responsive srcset for article body images
Fix (a) above, the narrow way. `src/components/ProseImage.astro` is passed as `img` in the `<Content components>` map on `thoughts/[slug].astro` and `projects/[slug].astro` (one-line reuse). @astrojs/mdx 4.3 rewrites a local `![alt](./x.jpg)` to an `astro-image` element whose component is `components.img ?? __AstroImage__`, with `src` already imported as `ImageMetadata` (read from `node_modules/@astrojs/mdx/dist/rehype-images-to-component.js` + `vite-plugin-mdx-postprocess.js`). The override renders `astro:assets` `<Image>` with `widths={[480, 800, 1200, 1600]}` (widths above the original are dropped, so the 1400w diagrams top out at 1400), `sizes="(min-width: 58rem) 58rem, 100vw"` (image-only paragraphs take the full 58rem `.shell-narrow` container per 36.1, not the 38rem measure), `loading="lazy"`, `decoding="async"`; alt and any other Markdown attributes pass through; a string `src` (remote) falls back to a plain `<img>`. No `image.layout` config, so nothing else on the site changes (no inline style, no `data-astro-image`). There is no figure/caption plugin, so no caption behaviour to preserve. Content diff vs `v2-final` on `src/content/thoughts` + `src/assets/thoughts`: empty.

Built HTML: all 8 body images on the jobs article carry a 4-candidate `srcset` (the cover keeps its own 800/1200/1600 set); the 5 LLM-map diagrams and the 6 Oddhalls screenshots likewise. Diagrams measured at full container width (856 px of an 856 px `.prose` at 1024 px; 335/335 at 375 px mobile, DPR 2 picks the 800w file) and remain legible.

Lighthouse 12.8.2 mobile, `serve dist/client -l 4400`, reports `$SCRATCHPAD/lh/srcset-{jobs,token}-{1,2,3}.report.{json,html}`:

| URL | Before (median of 3) | After |
|---|---|---|
| `/thoughts/if-ai-takes-all-the-jobs-what-do-we-actually-do/` | 93 (93, 93, 93), LCP 3.15 s, 851 KB | two triples: 97, 94, 95 and 94, 98, 94 → **median 94.5**; LCP 3.08 s (2.33 s on the 97/98 runs), 617 KB |
| `/thoughts/what-is-a-token-anyway/` | — | **99** (99, 99, 99), LCP 2.1 s |

A / BP / SEO 100 on every run. The first triple overlapped a concurrent `npm run build` by another agent (one token run 404'd and was rerun); the second triple ran on a stable `dist`. Page weight −234 KB; the three images inside Chrome's lazy-load margin now fetch the 800w files (67 + 26 + 22 KB vs 178 KB for 02 alone). The score now sits on the 95 line rather than clearly over it: what remains is LCP render delay (~1.9 s simulated) behind the four font files (Fraunces opsz 66 KB, Inter 47 KB, Fraunces italic 45 KB, JetBrains Mono 40 KB) and the 177 KB gtag on the 1.6 Mbps Lantern link — not images. Still local numbers; the Vercel preview run (HTTP/2, compression) is what the phase records.

axe 4.14: 0 violations on the jobs article, `/thoughts/a-quick-map-on-large-language-models/`, `/projects/oddhalls/`. `npm run build`, `astro check` (0 errors), `npm test` (64/64) green.
