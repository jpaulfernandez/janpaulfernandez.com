# janpaulfernandez.com — Implementation Plan

Source of truth for build order and completion status. Derived from [spec.md](spec.md).

## How to use this file (for any coding agent: Claude, Gemini, GPT)

1. Find the first unchecked task below. Tasks within a phase run in order; do not start a phase before the previous one is checked off.
2. Open the linked task file in `tasks/`. It contains full context, steps, and a **Definition of Done**.
3. Do only what the task file says. If a task seems to require work not listed, stop and flag it — don't expand scope.
4. When every Definition of Done item passes, mark the checkbox here `[x]` and append the completion date, e.g. `[x] (2026-07-08)`.
5. Never check a box with failing builds, failing tests, or partial work.

Phases are vertical slices: each ends with a deployable, visibly-improved site — never a pile of disconnected scaffolding.

---

## Phase 1 — Foundation

**Slice delivered:** branded site shell (tokens, fonts, nav, footer) live on Vercel at janpaulfernandez.com.

- [x] (2026-07-05) [T01 — Scaffold Astro 5 + Tailwind 4](tasks/task-01-scaffold.md)
- [x] (2026-07-05) [T02 — Design tokens & typography](tasks/task-02-tokens-typography.md)
- [x] (2026-07-05) [T03 — Base layout, nav, footer, SEO head](tasks/task-03-base-layout.md)
- [x] (2026-07-05) [T04 — Keystatic setup](tasks/task-04-keystatic.md)
- [ ] [T05 — Deploy pipeline, robots.txt, sitemap](tasks/task-05-deploy.md)

## Phase 2 — Core pages

**Slice delivered:** Home, About, and Now pages live with real content, all CMS-editable, with Person/WebSite/ProfilePage JSON-LD.

- [x] (2026-07-05) [T06 — Core content collections (career, now, pages)](tasks/task-06-core-collections.md)
- [x] (2026-07-05) [T07 — JSON-LD schema library](tasks/task-07-schema-jsonld.md)
- [x] (2026-07-05) [T08 — Home page](tasks/task-08-home.md)
- [x] (2026-07-05) [T09 — About & Now pages](tasks/task-09-about-now.md)

## Phase 3 — Thoughts

**Slice delivered:** full publishing system — filterable index, article pages with custom blocks, topic archives, RSS, OG images, seed posts.

- [x] (2026-07-05) [T10 — Thoughts collection & custom blocks](tasks/task-10-thoughts-collection-blocks.md)
- [x] (2026-07-05) [T11 — Article layout & BlogPosting schema](tasks/task-11-article-layout.md)
- [x] (2026-07-05) [T12 — Thoughts index, topic archives, filters](tasks/task-12-thoughts-index.md)
- [x] (2026-07-05) [T13 — RSS feed & OG image generation](tasks/task-13-rss-og.md)
- [x] (2026-07-05) [T14 — Seed content (2–3 posts)](tasks/task-14-seed-content.md)

## Phase 4 — Work with me + launch

**Slice delivered:** lead-gen page with form, FAQ schema, accessibility pass, Lighthouse ≥ 95, launched.

- [x] (2026-07-05) [T15 — Work with me page](tasks/task-15-work-with-me.md)
- [x] (2026-07-05) [T16 — Polish, accessibility, launch](tasks/task-16-launch.md)

---

## Blocked-on-Paul items (spec §10)

- **Cloudflare Images migration for the gallery (not started — needs credentials).** `src/assets/gallery` is 68 MB across 100 files and `.git` is 310 MB; every future photo permanently inflates clone time. Recommended target is Cloudflare **Images** rather than plain R2, so the `/w=800,f=auto` transform pipeline replaces the build-time optimisation Astro currently does. Blocked on Paul supplying a Cloudflare account ID and an API token (`wrangler` is installed globally but not authenticated, and there are no Cloudflare keys in `.env`). Touches `keystatic.config.ts` and `src/content.config.ts` together — the gallery `image` field becomes an image ID — so both schemas must change in the same commit.

Track here; tasks note where these are needed. Use placeholders until provided, never invent real data.

- [x] Social profile URLs for `sameAs` (needed by T07)
- [x] Contact email for form (needed by T15)
- [x] Exact PSBank / RightCrowd / Rappler dates (needed by T06)
- [x] Topics for seed essays (needed by T14)
- [ ] **Deploy wiring for T05** (needs Paul's GitHub + Vercel + DNS access). Code parts of T05 are DONE (sitemap integration excluding /styleguide + /keystatic; static `public/robots.txt` with GPTBot/ClaudeBot/PerplexityBot/Google-Extended allows + Sitemap line). Still pending Paul: (1) push repo to GitHub; (2) import to Vercel — framework preset Astro, static, no adapter; (3) confirm push-to-main deploys + PR preview URLs; (4) point janpaulfernandez.com apex + www→apex redirect via Vercel domains; (5) verify in prod: `/robots.txt`, `/sitemap-index.xml`, `/` return 200 and `/keystatic` returns 404. Also: `/keystatic` admin UI should be clicked through once in `npm run dev` to confirm it writes entries to `src/content/now/`.

Social profiles
Linkedin - https://www.linkedin.com/in/jpaulfernandez/
Instagram - https://www.instagram.com/goofffball/
Contact email - jpaul.fernandez18@gmail.com
Dates - Psbank, 2015 - 2018, Rightgrowd, 2018, Rappler 2018 - 2023

Topic Seeds
AI (artificial intelligence)
Technology
Economics
Psychology

## Phase 5 — UI/UX redesign (Paul's direct request, 2026-07-05)

Requested by Paul via Cowork session; supersedes parts of T03/T08/T12/T15 visuals. Build + astro check + vitest all pass.

- [x] (2026-07-05) Notch nav: fixed header docked as a "MacBook notch" at page top, detaches into a floating pill on scroll (vanilla JS toggle + CSS transitions, reduced-motion safe)
- [x] (2026-07-05) Brand logo: ouroboros-vine mark (death of self / renewal / plants) — `src/components/LogoMark.astro`, 3 drafts in `public/logo-ouroboros-{1,2,3}.svg`, favicon updated
- [x] (2026-07-05) Hero: conversational intro ("Hi, I'm Paul.") + "Invite me to coffee" CTA → /work-with-me#contact; home singleton fields renamed heroGreeting/heroIntro (Keystatic + content.config kept field-identical)
- [x] (2026-07-05) Now on homepage: one-liner inside hero pulled from latest now entry (standalone section removed)
- [x] (2026-07-05) Thoughts listing: PostCard grid → PostListItem rows (title, excerpt, date, tags, optional cover) on home, /thoughts, /topics; PostCard deleted
- [x] (2026-07-05) Services: consulting-only lineup (Product Consultation / Talks & Workshops / Fractional Product Owner), rendered as sticky stacking color cards (`ServiceStack.astro`); dev services + "What I bring to the table" removed; ServiceCard deleted
- [x] (2026-07-05) Employment history removed from homepage (Timeline stays on /about)
- [x] (2026-07-05) Bento footer: tiled grid on green gradient + SVG grain
- [x] (2026-07-05) /thoughts filters: boxed 3-group panel → compact toolbar (type segmented control + topic chips; stage filter dropped, stage badge kept on rows)
- [x] (2026-07-06) Article page redesign: screenshot-inspired header, centralized left-margin TOC with subtle hover states, mobile bottom pill TOC accordion, smooth scroll animations, solid terracotta/color callouts, generous prose line-height and kerning

## Phase 6 — Photo Gallery & Visual Extensions (Paul's direct request, 2026-07-07)

Requested by Paul via chat; adds photo gallery with tag filtering, licensing CTA, and dynamic Bento footer.

- [x] [T17 — Photo Gallery (/gallery), Licensing CTA, & Bento Footer Integration](tasks/task-17-gallery.md)
- [x] (2026-07-07) Now timeline end node: added a quirky "End of timeline" node to `/now` that displays at the bottom of the timeline or when the timeline is empty.
- [x] (2026-07-07) Thoughts cleanup & zero states: removed seed/test articles in `src/content/thoughts/` and added quirky, cohesive zero states to both `/thoughts` and Home (`/`).
- [x] (2026-07-07) Google Analytics (gtag.js) integration: integrated Google tag G-KJX3LCC0SZ into BaseLayout.astro head section.

## Phase 7 — Minimalist redesign: sidebar shell (Paul's direct request, 2026-08-12)

Requested by Paul via chat; supersedes the Phase 5 notch nav / bento footer / service cards visuals site-wide. Direction: text-minimal in the spirit of luyuhang.net / paco.me / sive.rs, but with a fixed sidebar instead of single-column. Decisions confirmed by Paul: whole-site shell, new /projects page + Keystatic collection, "Work" = /work-with-me, full text-only strip (no photo strips, no magenta theme, no stacking cards).

- [x] (2026-08-12) [T18 — Sidebar shell: nav, footer, zero-JS](tasks/task-18-sidebar-shell.md)
- [x] (2026-08-12) [T19 — Projects collection & /projects page](tasks/task-19-projects.md)
- [x] (2026-08-12) [T20 — Text-minimal homepage](tasks/task-20-home-redesign.md)
- [x] (2026-08-12) [T21 — Remaining pages adoption & cleanup](tasks/task-21-adoption-cleanup.md)

## Phase 8 — Courier + B/W + green/magenta accents (Paul's direct request, 2026-08-12)

Requested by Paul via chat. Direction: merge Madhurima Chatterjee's centered, text-minimal chrome with the existing luhuyang-style sidebar — but flip the palette to white & black with green + magenta as accents only, replace Archivo Black / Lato with Courier Prime (single mono family), drop the favicon to a plain magenta square, soften the sidebar (no hard rail, centered), and remove decorative microcopy. Supersedes Phase 7 visuals (palette + typography only; sidebar IA preserved).

- [x] (2026-08-12) Courier Prime `400` + `700` via `@fontsource`; preload both woff2; theme tokens (`--font-display`/`--font-body`) repointed
- [x] (2026-08-12) `src/styles/global.css`: token palette rewritten — moss/beige/citrus names kept for class compatibility but values shifted to near-black / off-white / magenta; `--color-green-500/700` added (Jamaican-green family, AA-compliant)
- [x] (2026-08-12) `public/favicon.svg` replaced with a single magenta `<rect>` (no logo, no curve, no grain)
- [x] (2026-08-12) `src/layouts/BaseLayout.astro`: sidebar loses `border-r border-moss-200`, gains centering (`md:flex md:flex-col md:items-center`), nav ticks lowercase, secondary links + `site-meta` ("technologist · philippines") sit inside the sidebar; footer collapsed to one row
- [x] (2026-08-12) Active page marker repainted to magenta `●`; link colour shifts from moss to magenta on hover
- [x] (2026-08-12) `src/pages/index.astro`: section headings reduced to lowercase mono kickers (`writing`, `projects`, `work`); chrome tightened (less prose around lists)
- [x] (2026-08-12) About / Now / Work / Projects / Thoughts index / Thoughts topic / Gallery index / Gallery slug / Article / Thanks / Timeline / PostListItem / KeyTakeaway / Callout / PullQuote all rewritten to mono + new palette + minimal text
- [x] (2026-08-12) OG image generator (`src/pages/og/[...route].ts`) repointed to Courier Prime + new palette RGB values
- [x] (2026-08-12) `npm run build` ✓ · `npx astro check` 0 errors / 0 warnings (4 pre-existing keystatic deprecation hints) · `npm test` 13/13 pass · favicon file confirmed `<rect fill="#FF006E">` · `<h1>` on every page renders with new tokens

## Phase 9 — Wine palette, display type, Mobbin-informed page structure (Paul's direct request, 2026-09-01)

Requested by Paul via chat after a Mobbin inspiration pass. Direction: keep the
text-minimal spirit of Phase 8, but (a) repaint to a wine / red-wine shade,
(b) introduce a genuinely huge + bold display step so hierarchy is a jump rather
than a nudge, and (c) let the accent appear as sparse "flares" rather than
uniform colour. Page structure follows specific Mobbin references, noted per
task. Supersedes Phase 8 palette + type scale; sidebar IA preserved.

Mobbin references used: MOUTHWASH Studio (mono chrome), Claude Type (centred
prose), Gumroad + Intercom (hairline row index), Instrument + Aino Agency
(service rows), Stripe + Notion (changelog rail), Studio Freight (dense photo
grid).

- [x] (2026-09-01) Token families renamed to match what they are: `moss-*`→`ink-*`, `beige-*`→`paper-*`, `citrus-*`→`wine-*`; legacy `dark-plum-*` / `alert-*` aliases dropped (nothing referenced them). 20 files, mechanical.
- [x] (2026-09-01) `src/styles/global.css`: wine palette (paper `#FAF6F4`, ink `#1C0A10`, wine `#8E1B3F`); every colour used at or below body size verified ≥ 4.5:1 (measured values documented in the token block)
- [x] (2026-09-01) Type scale gains `--text-display` (56 → 112) and h1 grows 40 → 72; both endpoints stay on the 8-pt grid
- [x] (2026-09-01) Shared primitives extracted (each ≥ 4 uses): `.display`, `.flare`, `.kicker` (wine bullet + trailing rule), `.rows`/`.row-link`/`.row-meta` (hairline index), `.rail`/`.rail-item`/`.rail-date` (timeline gutter)
- [x] (2026-09-01) Blanket `prefers-reduced-motion: reduce` guard neutralising all transitions/transforms (the gallery image scale and row nudge are decorative)
- [x] (2026-09-01) Home: display hero with the greeting's last word as the flare (derived from the Keystatic value, not hardcoded); writing + projects as hairline rows; single wine CTA block
- [x] (2026-09-01) Work: services as full-width Instrument-style rows — wine numeral, h2-scale name left, description right
- [x] (2026-09-01) Now + About career history: shared `.rail` timeline; newest entry gets a wine halo
- [x] (2026-09-01) Gallery: tag filter and its client script removed (4 collections don't earn a filter UI); dense 2/3-col square grid, captions cut to title + year
- [x] (2026-09-01) Gallery promoted from the footer's secondary links into the primary nav — it was previously reachable on mobile only by scrolling to the page bottom
- [x] (2026-09-01) New `/colophon` page (stack, rules, source); takes gallery's old slot in the secondary links
- [x] (2026-09-01) Active nav marker changed from `●` to `■` to match the kicker bullet
- [x] (2026-09-01) `npm run build` ✓ · `npx astro check` 0 errors · `npm test` 13/13 ✓ · all 11 routes return 200 with exactly one `<h1>` each · verified in-browser at 375px and 1280px

### Considered and rejected

- **Prev/next on articles** — already shipped; `ArticleLayout.astro:115` renders it.
- **Corner metadata chrome (MOUTHWASH-style `INDEX` / version stamps)** — decorative only, and the sidebar already carries identity + section state. Would have cost a11y noise for no information gain.

## Phase 10 — /now as a real timeline, /gallery as one flat photo wall (Paul's direct request, 2026-09-01)

Requested by Paul via chat after a second Mobbin pass. Two targeted redesigns:
(a) /now should *read* as a timeline rather than a stack of posts, and
(b) /gallery should show the photographs themselves — one masonry wall, not a
grid of set covers.

Mobbin references used: Plain + Slack API changelog (date gutter, quiet prose,
one node per entry), Stripe changelog (period as a chapter marker), Campsite
(terminal node closing the rail), Cosmos (dense ungrouped image wall).

- [x] (2026-09-01) `/now`: entries grouped into year sections; each year is a solid wine milestone on the rail with a trailing hairline. Entry nodes are hollow; only the newest is filled + haloed and carries a "right now" badge. Heading order fixed to h1 → h2 (year) → h3 (entry) — entry titles were h2 before. Rail closes on a terminal node. Styles are scoped to the page; shared `.rail` is left to `Timeline.astro` (/about).
- [x] (2026-09-01) `/gallery`: set covers replaced by every photograph in one CSS-columns masonry (95 shots, 2 cols → 3 at 640px). Sets are interleaved by a deterministic even-spread key so a 50-shot set and a 12-shot set both run the length of the wall instead of sitting as blocks. Set pages stay reachable from a hairline "Sets" index at the foot and from the lightbox.
- [x] (2026-09-01) `Lightbox.astro` extracted (second use: gallery index + set pages). Binds to any `.photo-trigger`; shows caption, an optional "view set →" link, counter, arrows, Esc.
- [x] (2026-09-01) `src/lib/gallery.ts` `lightboxWidth()` + vitest: lightbox now loads a 1600px-long-edge variant instead of the ~1.5 MB original (wanderland-41: 1165 kB → 61 kB). Grid images dropped their forced 800×600 crop, so photos show at their true aspect ratio.
- [x] (2026-09-01) `npm run build` ✓ · `npx astro check` 0 errors · `npm test` 18/18 ✓ · verified in-browser at 375px and 1280px

## Phase 11 — Swipeable work cards, black colophon, left-edge nav rail (Paul's direct request, 2026-09-02)

Requested by Paul via chat. Four targeted changes to the home page, the
colophon, and the site shell:

- [x] (2026-09-02) Home "work" section: the single CTA block becomes three service cards pulled from the same `services` collection as `/work-with-me`. Mobile: native swipe carousel — CSS `scroll-snap` with the scrollbar suppressed, one 85%-wide card per view with the next card peeking, so the document never grows a horizontal scrollbar. `lg+`: plain three-column grid. Cards link to `/work-with-me`; the wine CTA button is kept below. Zero JS (rung 3).
- [x] (2026-09-02) `/colophon` inverts to pure black: new `dark` prop on `BaseLayout` sets `.dark` on `<body>`; Tailwind 4 `@custom-variant dark` is class-based. Global overrides in `global.css` flip the shared primitives (headings, links, `.display`, `.flare`, `.kicker`, active nav marker). Wine accents step up to `wine-300` on black — `wine-500` only reaches 2.4:1 there; `wine-300` measures 4.8:1 (AA).
- [x] (2026-09-02) Navigation shell: at `lg+` the header is now `fixed` to the left viewport edge (`w-52`, `xl:w-64`), vertically centered, left-aligned — no longer attached to the content column. Content column stays `max-w-3xl`, centered in the remaining width via `lg:pl-52 xl:pl-64`.
- [x] (2026-09-02) Mobile nav redesign: name + meta left-aligned; the six primary links form a 3×2 grid with padded tap rows (~42px) instead of the old right-aligned wrapped rows. Secondary links stay in the mobile footer.
- [x] (2026-09-02) `npm run build` ✓ · `npx astro check` 0 errors (4 pre-existing keystatic deprecation hints) · `npm test` 18/18 ✓ · built HTML verified: 3 work cards + snap CSS on `/`, `dark` body class + `#000`/wine-300 rules on `/colophon` only, `lg:fixed` rail in the shell.

## Phase 12 — Bold minimalist skin: top nav bar, numbered work rows, prominent NOW (Paul's direct request, 2026-09-02)

Requested by Paul via chat: fix the navigation and the work section, make NOW
more prominent, and revamp the skin — bold but minimalist, wine-led with four
complements over neutrals. Mobbin references used: Coda / Handshake / Bird /
Affinity (slim sticky bar, wordmark left, small-caps links, one accented block
right), OFF+BRAND / Koto / Vucko (numbered hairline service rows with a serial
number and a heavy title, no cards).

- [x] (2026-09-02) Navigation: the Phase 11 left-edge rail is replaced by a sticky top bar on every breakpoint — wordmark left, five small-caps mono links right, `/now` as a solid wine block at the end. Active page and hover both draw a wine rule that wipes in from the left. `< md`: wordmark + NOW + a zero-JS `<details>` menu whose panel spans the bar. Content column widens `max-w-3xl` → `max-w-4xl` now that the rail no longer eats 256px.
- [x] (2026-09-02) NOW is promoted twice: a wine block in the nav bar with a pulsing square, and a full-width solid wine slab on the home page directly under the hero carrying the latest entry's title and date. `/now` gains a `live · <date>` badge above the h1. The old truncated grey one-liner (and its 12 lines of markdown-stripping) is gone.
- [x] (2026-09-02) Work section: the Phase 11 swipe-card deck is replaced by `.num-rows` — serial number, heavy title, one line of copy, hovering floods the row with that row's accent. Drops the scroll-snap carousel and its ~45 lines of scoped CSS. `/work-with-me` services use the identical rows, so a service keeps its colour across both pages.
- [x] (2026-09-02) Type: one monospace family becomes three faces, three jobs — Archivo Black (display/h1/h2/h3), Lato (body + prose), Courier Prime (kickers, labels, metadata, numerals). All three were already dependencies; no new packages. `font-synthesis: none` so Archivo Black is never faux-bolded. Display top end drops 112 → 96 because Archivo Black is far wider than Courier.
- [x] (2026-09-02) Palette: wine stays primary; four muted complements join as section accents — clay `#A24A22` (5.5:1), ochre `#7E6220` (5.4:1), olive `#40563C` (7.5:1), slate `#2F4858` (8.9:1) on paper, each ≥4.5:1 under `paper-50` text when used as a fill. Driven by one `--accent` custom property that `.kicker`, `.flare`, `.row-link`, `.num-row`, `.btn` and `.more-link` all read, so a section sets its colour in one place. Wine is still never body text.
- [x] (2026-09-02) `npm run build` ✓ · `npx astro check` 0 errors (4 pre-existing keystatic deprecation hints) · `npm test` 18/18 ✓ · verified in-browser at 390px and 1280px on `/`, `/now`, `/work-with-me`, `/about`, `/colophon` (dark shell) and an article page.

## Out of scope (v2 — do not build)

Dark mode, Idea Graveyard, backlinks/hover previews, search, library page, webmentions, newsletter, footnotes/sidenotes.

