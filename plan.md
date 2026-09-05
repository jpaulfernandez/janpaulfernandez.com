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

- **Cloudflare is blocking the AI crawlers the spec targets (Critical, 2026-09-04 review, not fixable in this repo).** `public/robots.txt` correctly allows GPTBot / ClaudeBot / PerplexityBot / Google-Extended, but Cloudflare (which now fronts Vercel) injects a managed block **above** those rules that disallows `GPTBot`, `ClaudeBot`, `CCBot`, `Google-Extended`, `meta-externalagent`, `Amazonbot`, `Applebot-Extended`, `Bytespider`, plus `Content-Signal: ai-train=no`. Verified live 2026-09-04 by fetching the served robots.txt. The duplicate `Allow` groups below do not reliably win — merged-group behaviour is crawler-defined. This directly contradicts spec §1 ("ranking/cited in ChatGPT, Perplexity, AI Overviews") and §7.1. **Paul must fix this in the Cloudflare dashboard (AI Audit / managed robots.txt settings)** — no repo change can override it. Once cleared, optionally name the additional crawlers explicitly in `public/robots.txt`.
- **GA4 vs. spec §8 (decision needed, not a bug).** `BaseLayout` ships the gtag script on every page. Added deliberately in Phase 6, but spec §8 calls for Plausible/Umami with "no cookie banner", it conflicts with the zero-client-JS stance, and GA4 technically wants consent under ePrivacy/GDPR. Left in place pending Paul's call; the colophon copy was corrected to describe what actually ships.
- **Unconsumed CMS fields (content-model decision, not a bug).** `services.icon`, `gallery.featured`, `gallery.licensingAvailable`, and `thoughts.stage` (passed to `PostListItem`, then ignored) are authored but never rendered, and the `seo` singleton is read by nothing. Each should be either rendered or deleted from `keystatic.config.ts` and `src/content.config.ts` **together** — schema parity is a hard constraint.

- **Cloudflare Images migration for the gallery (not started — needs credentials).** `src/assets/gallery` is 68 MB across 100 files and `.git` is 310 MB; every future photo permanently inflates clone time. Recommended target is Cloudflare **Images** rather than plain R2, so the `/w=800,f=auto` transform pipeline replaces the build-time optimisation Astro currently does. Blocked on Paul supplying a Cloudflare account ID and an API token (`wrangler` is installed globally but not authenticated, and there are no Cloudflare keys in `.env`). Touches `keystatic.config.ts` and `src/content.config.ts` together — the gallery `image` field becomes an image ID — so both schemas must change in the same commit.

Track here; tasks note where these are needed. Use placeholders until provided, never invent real data.

- [x] Social profile URLs for `sameAs` (needed by T07)
- [x] Contact email for form (needed by T15)
- [x] Exact PSBank / RightCrowd / Rappler dates (needed by T06)
- [x] Topics for seed essays (needed by T14)
- [x] **Deploy wiring for T05** — DONE (2026-09-02). Repo lives at `github.com:jpaulfernandez/janpaulfernandez.com`; Vercel project `janpaulfernandez-com` is Git-connected — push-to-main triggers a production deploy (verified with Phase 13: commit `c20c9f0` deployed and aliased to janpaulfernandez.com + www in ~2 min). Prod checks: all routes 200, robots 200, sitemap 200, apex → www 308 (single canonical host: **www**, note this supersedes the original "www→apex" note). `/keystatic` serves 200 in prod **by intent** — `KEYSTATIC_URL` + `KEYSTATIC_GITHUB_CLIENT_ID/SECRET` + `KEYSTATIC_SECRET` were configured on 2026-07-06, making it the live git-based CMS dashboard; the earlier "keystatic should 404" expectation is superseded. A `SKIP_KEYSTATIC=1` production env var was briefly added by mistake and removed after confirming the auth setup.

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

## Phases 11–13 REVERTED — live design is the Phase 10 state, commit `31e2448` (Paul's direct request, 2026-09-02)

Paul asked to go back from the Phase 13 look, initially to the pre-Phase-9 site
(`e76ec2a`), then settled two commits forward: the live design is now the
**Phase 10 state** — Phase 8 sidebar shell + wine palette / display type /
Mobbin structure (Phase 9) + the `/now` timeline and flat `/gallery` photo
wall (Phase 10), i.e. commit `31e2448`. Phase 14 (below) tunes that look —
type scale and motion only — without changing its structure. The phase
records below are kept as history. Phases 9–10 code was restored from `31e2448`; Phases 11–13 (swipeable
work cards/left-edge rail, top-nav bold-minimalist skin, ruled-ledger skin)
remain reverted — their code lives only in git history `31e2448..899041a`.
Content was untouched throughout — every Now/thoughts/gallery entry survived.
Do not treat the Phase 11–13 checked boxes below as the current design; to
revive any of it, pull from that range.

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

## Phase 13 — Ruled ledger: wine + two, line-drawn, quiet type (Paul's direct request, 2026-09-02)

Requested by Paul via chat: revise the entire UI/UX with wine + up to four complementary colours, minimalist text-based UI/UX, lines as the visualization, same pages. Confirmed direction: ruled-ledger line language, quieter type hierarchy, complement set trimmed. Supersedes Phase 12 visuals (fills → lines). Decisions path: brainstorming skill, bounded-classified (whole-site skin, no IA change), design approved in chat before implementation.

- [x] (2026-09-02) Palette trimmed to wine + two complements: slate (writing), olive (projects); clay and ochre retired. Tokens rewritten in oklch(); paper-50 shifted off #FFF to #FCFAF9; dark shell shifted off #000 to a wine-tinted near-black (--color-night) with AA re-measured (wine-300 4.6, slate-300 9.1, olive-300 9.9). Contrast table in the token block updated.
- [x] (2026-09-02) Quieter type: --text-display (48→96) and the .display class removed; h1 32→48, h2 24→32 clamps re-derived for a 375–1280 viewport. Three faces and their jobs unchanged (Archivo Black / Lato / Courier Prime).
- [x] (2026-09-02) Lines carry every structural moment: solid NOW slab → ruled band (2px wine top rule + hairline bottom); num-row accent-flood hover → drawn title rule that wipes in from the left on hover; filled .btn → 1px outlined box; side-stripe callout/prose blockquote borders → full or top/bottom hairlines.
- [x] (2026-09-02) Ledger header rule: new .kicker-meta element sits past the kicker's trailing rule carrying real metadata (service/thought/project counts, steps, questions, roles, sets). Applied on home, /work-with-me, /about, /projects, /gallery, article "related".
- [x] (2026-09-02) Nav bar: backdrop blur removed (solid paper + hairline); NOW tab redrawn as a 1px wine outline with the pulsing dot; dark-shell variants re-tinted via --color-night and color-mix hairlines.
- [x] (2026-09-02) PostListItem rows + /thoughts filter chips: active/pressed states are drawn (accent ink + 2px rule or accent underline), not filled. Writing/topic pages set --accent to slate via the existing --accent mechanism.
- [x] (2026-09-02) Callout block: stale Phase-8 green classes replaced with olive (idea variant) / wine (warning) / ink (note), full-border boxes. KeyTakeaway full wine box, PullQuote framed with top/bottom hairlines.
- [x] (2026-09-02) `npm run build` ✓ · `npx astro check` 0 errors (4 pre-existing keystatic deprecation hints) · `npm test` 18/18 ✓ · all 9 shell routes return 200 with exactly one `<h1>` · rendered-browser verification at 390px and 1280px on /, /work-with-me, /thoughts, /colophon (dark shell).

## Phase 14 — Quieter pass: type compression, decorative motion removed (Paul's direct request, 2026-09-02)

Requested by Paul via chat ("make it less loud"). Offered four levers —
display type, wine density, solid fills, motion; Paul chose **display type +
motion**, applied substantially. Wine density and solid fills are untouched
on purpose. The Phase 10 structure (sidebar shell, hairline rows, rail
timelines, gallery wall, flare words) is unchanged — only the volume came
down. Supersedes the Phase 9 type scale.

- [x] (2026-09-02) Type scale compressed in `src/styles/global.css`, still on the 8-pt grid and ≥1.25 between steps: `--text-display` 56→112 becomes 40→56, `--text-h1` 40→72 becomes 32→40, `--text-h2` 24→40 becomes 24→32; h3/body/small untouched. Every `.display` h1 (all 11 pages) and every prose h2 quiets with the tokens. `.display` leading relaxes 1.02→1.1 and tracking -0.03em→-0.02em, retuned for the new size range.
- [x] (2026-09-02) Decorative motion removed: the `.row-link` hover-nudge (padding-left shift), the gallery hover zoom (`scale(1.04)` on the `/gallery` wall and set pages), and the `.fade-rise` intro animation (deleted outright — nothing referenced it). Hover colour on rows/links and the gallery hover dim stay as the only feedback; the lightbox fade and disclosure-chevrons remain, still covered by the blanket `prefers-reduced-motion` guard.
- [x] (2026-09-02) Deployed to prod: commit `8345b77` pushed to main, Vercel build live within ~1 min — new stylesheet (compressed display clamp) served on www, all 8 main routes 200 (`/`, about, work-with-me, thoughts, projects, gallery, now, colophon)
- [ ] Paul's visual review in-browser (build/check/tests deliberately not run, per Paul's manual-review workflow)

## Phase 15 — Now rail on the homepage (Paul's direct request, 2026-09-02)

Requested by Paul via chat: NOW was barely visible on the homepage (a truncated
grey one-liner under the hero), and nothing hinted that /now is a timeline.
Direction confirmed in chat: **mini timeline section** — chosen over a
featured-entry block and a ruled band above the hero (too loud post-Phase-14).

- [x] (2026-09-02) `src/pages/index.astro`: the hero one-liner (and its ~12 lines of markdown-stripping) is removed. In its place, a `now` kicker section directly under the hero: the 3 latest entries rendered on the existing `.rail` primitive — date gutter, wine node per entry, halo on the newest, same flare /now gives the live entry. Each title links to /now; the section closes with a "see the full timeline →" link. Zero new CSS, zero JS (rendering-ladder rung 1). Writing section spacing steps down to the standard `mt-16 md:mt-20` now that `now` takes the post-hero gap.
- [x] (2026-09-02) Deployed to prod: commit `5e5fa25` pushed to main, Vercel build live within ~1 min — new `now` rail section served on www with `see the full timeline →` link, all 8 main routes 200 (`/`, about, work-with-me, thoughts, projects, gallery, now, colophon), exactly one `<h1>` on `/`
- [ ] Paul's visual review in-browser (build/check/tests deliberately not run, per Paul's manual-review workflow)

## Phase 16 — /gallery wall: build-time packed masonry (Paul's direct request, 2026-09-02)

Requested by Paul via chat: the wall read as "just a 3 col grid". Root cause
found by measuring the source: **88 of 95 photos are the identical 2731×2048
(4:3) crop** — equal-width columns can only tile into a grid, and no fill
order fixes that. Fix: vary each photo's width and pack the columns **at
build time** from image metadata — zero JS, zero cropping (Phase 10's true
aspect ratios preserved).

- [x] (2026-09-02) `src/lib/gallery.ts`: new `masonryLayout()` — each shot gets a deterministic pseudo-random width factor (0.75 / 1 / 1.25 of column width, FNV-1a hash of the shot id → stable across builds), then a shortest-column-first pass packs everything into 3 near-equal-height columns. Pure function, vitest-covered (`masonryLayout` + `widthFactor` describe blocks: determinism, coverage, balance, factor set, empty, clamp).
- [x] (2026-09-02) `src/pages/gallery/index.astro`: the single CSS-columns wall becomes two trees at the 640px cutover — mobile keeps the original 2-col flow untouched (`sm:hidden`), desktop (`hidden sm:flex`) renders the packer's three columns as flex columns with per-shot `width: 75–125%` inline. Sets still interleave via the spread key; lightbox markup unchanged; `display` deliberately left to Tailwind so the scoped stylesheet can't leak the wall onto mobile.
- [x] (2026-09-02) Deployed to prod: commit `cf6e221` pushed to main, Vercel build live within ~1 min — `/gallery` serves the packed wall (43 full / 26 wide / 26 narrow shots across 3 columns), all 8 main routes 200, exactly one `<h1>` on `/gallery`
- [ ] Paul's visual review in-browser (build/check/tests deliberately not run, per Paul's manual-review workflow)

## Phase 17 — SEO / GEO / a11y remediation from the 2026-09-04 review

Source: `code-review-2026-09-04.md` (full-site review + SEO/GEO audit). Each
finding was re-verified against the source and live production before being
actioned; three were rejected as incorrect or not worth the churn (noted at the
bottom). Build, `astro check`, and vitest all pass.

- [x] (2026-09-04) **Canonical host → www.** Prod 308s apex → www, so `site`, `SITE_URL`, the sitemap, `og:url`, all `llms.txt` links, the Web3Forms redirect, and the RSS fallback pointed at the host that redirects. All now emit www. `PERSON_ID` is deliberately **pinned to the apex literal** (`https://janpaulfernandez.com/#person`) and decoupled from `SITE_URL` — it is the entity key knowledge graphs consolidate on, and CLAUDE.md makes it a hard constraint. Covered by a new schema test.
- [x] (2026-09-04) **`og:image` 404 on 10 of 14 routes.** `BaseLayout` fell back to `/og-default.png`, which does not exist. Fallback is now `/og/home.png` (real, build-generated, 1200×630); `/about`, `/now`, `/work-with-me` wired to their own already-generated cards; articles use `/og/<slug>.png`.
- [x] (2026-09-04) **Person JSON-LD `image` was a dead URL.** `/assets/paul.webp` 404s (the file lives in `src/assets/` and nothing imported it). Added `public/paul.jpg` — the source 4128×6192 downscaled to 800×1200, 157 KB — at a stable URL that will not move with content hashes.
- [x] (2026-09-04) **`/thanks/` removed from the sitemap** — it is `noindex`, so listing it was a contradictory signal. The `/styleguide` filter was dropped at the same time; that page does not exist.
- [x] (2026-09-04) **Article JSON-LD gained `image`, `url`, and `mainEntityOfPage`** — Google Article rich results require an image, and no post has a cover, so the per-post OG card is used. Two new schema tests cover present/absent `url`.
- [x] (2026-09-04) **Branded `src/pages/404.astro`** — prod was serving Vercel's bare `NOT_FOUND` body with an internal region ID.
- [x] (2026-09-04) **`/gallery` lightbox double-binding fixed.** The page renders both walls (mobile flow + desktop masonry) and hides one with CSS, so binding every `.photo-trigger` in DOM order gave **190 triggers for 95 photos** — counter read 2×, prev/next cycled each image twice. Verified live before the fix. The list is now rebuilt from visible triggers (`offsetParent !== null`) on each open; verified in-browser at both breakpoints — reads `4 / 95` on desktop, `1 / 95` on mobile.
- [x] (2026-09-04) **Draft leakage in the OG route.** `src/pages/og/[...route].ts` used raw `getCollection('thoughts')`, publishing OG cards for drafts at guessable URLs. Now uses `getPublishedThoughts()`; `rss.xml.ts` had the same rule violation filtered inline and now shares the helper.
- [x] (2026-09-04) **Gallery photos work with JS off.** Triggers were `<button>`s, so nothing on the wall opened without JS. They are now `<a href={fullSrc}>` with `preventDefault()` in the lightbox — progressive enhancement, rung 2 → 4.
- [x] (2026-09-04) **Article covers use `<Image>`** rather than a raw `<img>` with no dimensions, and `og:image` no longer derives from `cover.src` (arbitrary ratio). Latent today — no post has a cover.
- [x] (2026-09-04) **Heading anchors.** Classes were `text-moss-200 hover:text-moss-500`, dead since the Phase 9 token rename, so the anchors were completely unstyled; and the literal `#` was a text node, so anything extracting heading text read "My Heading#". The glyph moved to `.anchor-icon::after` in CSS and real `.anchor-link` styles were added (ink-200, hidden until hover/focus, reduced-motion respected).
- [x] (2026-09-04) **`h1 → h3` heading skip** on `/thoughts` and `/topics/[topic]` — `PostListItem` hardcoded `<h3>` with no `<h2>` between. Now `<h2>`; verified in-browser that the level sequence has no skip and there is still exactly one `h1`.
- [x] (2026-09-04) **Trailing-slash consistency.** Breadcrumb JSON-LD, RSS item links, and `llms.txt` links now carry the slash that canonicals and the sitemap use.
- [x] (2026-09-04) **OG/meta gaps filled:** `og:site_name`, `og:locale`, `og:image:alt`, `og:image:width/height`, `twitter:image:alt`, `theme-color`.
- [x] (2026-09-04) **RSS items gained `categories` (from topics) and `author`.**
- [x] (2026-09-04) **Timezone-fragile dates.** `new Date('2026-09-04')` parses as UTC midnight, so west of UTC every content date rendered one day early. New `src/lib/dates.ts` (`parseDateSafe` / `formatDate` / `formatDateLong`, vitest-covered, 6 tests) generalises the noon pin `/now` already used; adopted in `ArticleLayout`, `PostListItem`, `gallery/[slug]`, and `now`.
- [x] (2026-09-04) **Contact form `autocomplete`** on name/email (WCAG 1.3.5 Identify Input Purpose, AA).
- [x] (2026-09-04) **GEO: `llms-full.txt`** — the whole corpus (28 KB) inline in one fetch, linked from `llms.txt`, discoverable via `<link rel="alternate">` and a robots.txt comment. Also a **visible byline** on articles (`rel="author"` → `/about`), which previously existed only in JSON-LD.
- [x] (2026-09-04) **Cleanup:** off-palette `green-*` in the Callout "idea" variant → ink; gallery set titles no longer double the suffix ("BINI: Asiya — Gallery — Paul Fernandez"); colophon's "zero client JS" claim corrected (GA4 ships on every page); deleted `src/assets/gallery/bini/bini-01.webp.tmp.jpg`; removed the unused `@fontsource/archivo-black` and `@fontsource/lato` deps (dead since the Phase 11–13 revert to Courier Prime only).

**Rejected findings** (verified as incorrect or not worth the churn):
- *"Honeypot is `display:none` but keyboard-focusable"* — false. `display: none` removes an element from the tab order entirely; `tabindex="-1"` would add nothing. Only the `autocomplete` half of that finding was valid.
- *"`cover.src` isn't a public URL"* — imprecise. `image()` fields resolve to `/_astro/…` in the build and would serve fine. The real defects (unoptimised raw `<img>`, arbitrary-ratio OG image) were fixed instead.
- *"Both inline scripts exceed the ~40-line budget"* — the review itself calls this "a budget breach, not a ladder break". Rewriting working enhancement code to hit a line count is churn.

- [ ] Paul's visual review in-browser
- [ ] Deploy to prod + verify

## Phase 18 — SEO audit remediation (2026-09-04, second pass)

Source: a fresh technical SEO audit run against the live site and a clean build
(27 pages parsed for title/description/canonical/robots/OG/heading structure/
alt coverage/JSON-LD, cross-checked against production redirects and headers).
14 findings; 13 actioned here, one deliberately deferred. Build, `astro check`
and vitest all pass; a scripted re-audit of the new build reports zero issues.

- [x] (2026-09-04) **Cloudflare's managed robots.txt was blocking the AI crawlers the repo welcomes.** Production served a Cloudflare-injected block (`Content-Signal: ai-train=no` plus `Disallow: /` for GPTBot, ClaudeBot, CCBot, Google-Extended, Amazonbot, Applebot-Extended, Bytespider, meta-externalagent) *above* `public/robots.txt`, which then allowed those same agents — two contradictory groups per user-agent, and the pessimistic reading is the one a first-match parser takes. It also silently defeated the `llms.txt` work. **Fixed by Paul in the Cloudflare dashboard**; production now serves the repo's file only. Not a code change — nothing in this repo could have overridden it.
- [x] (2026-09-04) **Every internal link pointed at a non-canonical URL.** Canonicals declared `/about/`; every nav and post link used `/about`, and both served 200 with no redirect between them — so the entire link graph landed one hop short of the indexed URL. `trailingSlash: 'always'` in `astro.config.mjs` (the Vercel adapter now emits 308s for the bare form, leaving file extensions alone) and every internal href updated to the slash form. `isNavActive()` rewritten as a prefix match now that each href ends in `/`.
- [x] (2026-09-04) **Gallery structured data.** Five pages and ~95 photographs carried no JSON-LD at all — not even the BreadcrumbList every other section had. New `imageGallery()` builder emits `ImageGallery` + per-frame `ImageObject` (contentUrl, caption, dimensions, `creator`/`creditText` → `PERSON_ID`) on each set; `collectionPage()` indexes the sets on `/gallery`. Both TDD'd in `schema.test.ts`.
- [x] (2026-09-04) **Blog-index and topic structured data.** `/thoughts` — the hub every post's breadcrumb points back to — declared nothing; nor did the nine `/topics/*` archives. New `blog()` and `collectionPage()` builders, plus BreadcrumbList on both. Site-wide JSON-LD blocks went 13 → 25.
- [x] (2026-09-04) **All 95 gallery photos had generated boilerplate alt text** (`"HONNE at Wanderland photo 14"`) because every caption in the content files was empty. Real per-frame captions written for all 95 across the four sets; they feed the `alt`, the lightbox label, and the `ImageObject` markup from one `altFor()` helper. **These are drafted captions, not Paul's own words — worth a read-through in Keystatic.**
- [x] (2026-09-04) **Bug found while captioning: photo 1 of every set silently lost its caption.** The cover is pushed into `photoList` with a hardcoded `caption: ''`, and the matching `photos[0]` entry is then dropped by the dedupe — so the first frame could never show a caption. The cover now inherits its own photo entry's caption, in both `gallery/[slug].astro` and `gallery/index.astro`.
- [x] (2026-09-04) **OG cards for the 15 pages sharing the site-wide fallback.** `/og/[...route].ts` now generates cards for the four gallery sets, `/gallery`, `/thoughts`, `/projects` and `/colophon`, all wired through. (Photo-backed cards for the sets were considered and skipped — a legibility problem for another day.)
- [x] (2026-09-04) **Thin, near-duplicate topic archives.** All nine shipped the same templated "Posts tagged #x by Paul Fernandez." Each now carries a hand-written one-line intro, used as both the meta description and a visible lead. **Chosen over `noindex`-ing the five single-post topics deliberately:** the noindex route needs the sitemap filter to know post counts, and `astro.config.mjs` cannot reach `astro:content` — the coupling was worse than the problem. Revisit if the archives stay thin.
- [x] (2026-09-04) **Sitemap `lastmod`.** All 25 URLs were bare `<loc>`s. A `serialize` hook now attaches content-derived dates to posts, gallery sets, the two hubs and the topic archives (newest tagged post). Static pages get none on purpose — a build timestamp on every URL is a worse signal than none.
- [x] (2026-09-04) **Titles over the ~60-char SERP cut.** Two posts truncated mid-headline. `BaseLayout` now drops the ` — Paul Fernandez` suffix when it is what pushes a title past 60, keeping the headline — which is what earns the click — intact.
- [x] (2026-09-04) **Descriptions over the ~160-char snippet limit** on `/` (175) and the Wanderland set (168), both cut mid-clause. Rewritten to 147 and 133.
- [x] (2026-09-04) **The two most important `h1`s did not carry the name.** Home was "Hi, I'm Paul." and `/about` was "Me" — both competing for "Jan Paul Fernandez" with neither containing it. Home is now "Hi, I'm Paul Fernandez." (greeting rhythm and the trailing wine flare both preserved); `/about` is "Jan Paul Fernandez", which is the site's only on-page use of the full name. **A taste call as much as an SEO one — easy to revert if Paul prefers the old voice.**
- [x] (2026-09-04) **404 declared a canonical URL** (`/404/`). Harmless while noindexed, but an error page should not nominate itself as the canonical version of anything. New `noCanonical` prop on `BaseLayout`.
- [x] (2026-09-04) **Essay cover images were unconditionally decorative** (`alt=""`), so each post's lead image contributed nothing to image search. New optional `coverAlt` field — added to **both** `content.config.ts` and `keystatic.config.ts` (field-identical, per CLAUDE.md) — falling back to `alt=""` when absent, so an undescribed cover stays decorative rather than repeating the `h1` to a screen reader. Written for the one post that currently has a cover.

**Deferred:**
- *`/projects` is an empty page that is indexable and in the sitemap* — 56 words including chrome, "Nothing on the shelf… yet.", in the primary nav: a textbook soft 404. Paul asked to leave it. The fix when wanted is `noindex` on the page plus `/projects` in the sitemap `filter`, reversed the moment the first project lands.

- [x] (2026-09-04) **Deployed to prod:** commit `2d9ee1c` pushed to main, Vercel build live in ~50s. Verified against production, not just the build: apex still 308s to www; the bare form of all nine section URLs now 308s to the canonical trailing-slash form, while `/rss.xml`, `/llms.txt`, `/sitemap-index.xml` and the OG PNGs are untouched by the rule; an unknown path costs one normalising redirect and then returns a real 404. `robots.txt` serves our file alone. Sitemap carries 19 `<lastmod>` entries across 25 URLs (the six dateless ones are the static pages, by design). A scripted sweep of all 25 live pages: 25 JSON-LD blocks, BreadcrumbList on every page, 306 images with zero boilerplate alt, no title over 60 chars, no description over 160, exactly one `h1` each, and no internal link pointing at a non-canonical URL.
- [ ] Paul's visual review in-browser (deployed ahead of it at Paul's request — the two `h1` changes and the 95 drafted gallery captions are the parts most worth a look)

## Phase 19 — no AI-generated imagery on the site (2026-09-04)

Paul's call, applied to the one post that had it. Not a build phase; logged
here so the tracker stays truthful about what is live.

- [x] (2026-09-04) **The nine illustrations on "If AI Takes All the Jobs" were AI-generated** — shipped with `b374ea3` and given away by the batch fingerprint: nine files, all exactly 1376x768 at 300 DPI. Replaced with nine Unsplash photographs, each opened and checked individually (no AI-generated flag; real EXIF camera data on seven of nine), selection biased toward pre-2023 uploads since Unsplash's recent intake carries generated work of its own. Alt text rewritten against the frame that actually shipped. Body images normalised to 3:2 so the column keeps one rhythm. Source set 7.9MB -> 2.3MB.
- [x] (2026-09-04) **The Maslow pyramid is gone rather than replaced.** It was a diagram, and no stock photograph can be one. The slot moved down one paragraph to a station-platform shot, which sits against "our identity is now welded to our work… What do you do?" — the claim that passage is actually making. **If a Maslow pyramid is wanted back it needs a hand-drawn SVG, not a photo.**
- [x] (2026-09-04) **New "Photographs" credit section** naming all nine photographers. Unsplash does not require attribution; the essay already cites its sources, and on this subject the "none of these are AI-generated" line earns its place. **Easy to cut if Paul disagrees.**
- [x] (2026-09-04) **Footer copyright line removed** at Paul's request. It was the footer's only content at lg+ (the secondary links beside it are `lg:hidden`, the sidebar owns them there), so removing it alone would have left an empty ruled band with 32px of padding under every desktop page. The footer is now `lg:hidden` too and survives below lg, where it still carries the links.

- [ ] Paul's visual review in-browser — the nine photographs and the dropped Maslow diagram are the parts worth a look

## Phase 20 — "NOCTURNE": full visual redesign (2026-09-05)

Branch `redesign/midu-dark`. Paul's brief: redesign the whole site based on
[midu.design](https://midu.design/), free to start from scratch, with GSAP
motion. Three calls made up front and confirmed by Paul: **dark ground with
wine kept as the accent** (not pure monochrome), **Switzer for display + prose
with Courier Prime retained for metadata**, and **"loose inspiration"** — take
midu's mood and motion, design the page flow from Paul's content rather than
from midu's studio-shaped outline (no invented pricing, testimonials, or
client logos).

What midu.design actually is, for the record: a Framer site on `#050505`,
Switzer 500 at −4% tracking on 82px display type, `rgba(255,255,255,.05–.07)`
glass surfaces, 16–24px radii, a floating pill nav with a live clock, one
inverted `#E6E6E6` section, Lenis smooth scroll, and scroll-driven word-by-word
text brightening. The inverted light section is the one signature move
deliberately **not** taken — it belongs to a studio site with case studies to
frame, and this site has essays.

- [x] (2026-09-05) **Design system rewritten** (`src/styles/global.css`). Ground inverted: `ink-*` now means surfaces and `paper-*` means type, the reverse of Phase 9–19. Wine lifted two stops for the dark ground — `#8E1B3F` scores 2.0:1 on `#050505` and was unusable as text; the ramp is now `wine-300 #F0658A` (6.5:1) and `wine-400 #E0446F` (4.9:1) for type, with `wine-500 #B02A52` as a fill carrying white at 6.4:1. Every colour used at body size is measured in the file header. Type scale un-compressed: Phase 14 pulled display down to 56px because the light layout could not carry it; on black it runs 48 → 104 at −4% tracking.
- [x] (2026-09-05) **Switzer self-hosted** from Fontshare (ITF, free for commercial use) — 400/500 upright + italic and 600, five faces, 92KB total in `public/fonts`. No 700: the design leans on 500/600 and a fifth weight was 20KB for nothing. Courier Prime survives for `.kicker`, `.mono`, dates, counters and code — every place the old site's mono voice was doing real work rather than just being the only option.
- [x] (2026-09-05) **Motion runtime** (`src/scripts/motion.ts`) — GSAP + ScrollTrigger + SplitText + Lenis behind a small `data-*` vocabulary (`data-reveal`, `data-reveal-stagger`, `data-split`, `data-parallax`, `data-hero`, `data-lenis-stop`). One file owns every animation on the site; nothing else imports GSAP. Lenis drives ScrollTrigger rather than the reverse, so scrubbed timelines read the eased scroll position. Chose Lenis over GSAP's own ScrollSmoother (also free since 3.13) because ScrollSmoother needs a wrapper/content DOM structure that fights the fixed nav and the lightbox `<dialog>`.
- [x] (2026-09-05) **Shell replaced.** The Phase 8 sidebar is gone — it worked at a 736px reading column but capped the page there forever, and a 104px display face needs the viewport. Now a floating pill nav (wordmark + live Manila clock + CTA), a full-screen mobile menu, and a statement footer. Full-bleed sections can run edge to edge underneath.
- [x] (2026-09-05) **Every page rebuilt**: home (hero → scroll-brightened bio → writing → services → now → projects → full-bleed photo marquee), about (portrait beside the display name), thoughts index (segmented type filter + topic chips), article layout, topic archives, now, projects, gallery index + sets, work-with-me, colophon, 404, thanks, and the four MDX blocks.

**Bugs found and fixed during the redesign** (all three are cascade traps that
would have shipped silently):

- [x] (2026-09-05) **Unlayered component CSS was defeating Tailwind utilities.** `global.css` declared `.btn`, `.card`, `.display` etc. outside any cascade layer, and an unlayered rule beats a layered one *regardless of specificity* — so `.btn { display: inline-flex }` silently overrode `hidden sm:inline-flex`, and the "Work with me" button would not hide on mobile. Everything from `SHELL` down is now inside `@layer components`, deliberately excluding the `prefers-reduced-motion` block, which has to beat utilities too. Recorded as a hard constraint in CLAUDE.md — this is a whole class of bug, not one button.
- [x] (2026-09-05) **The same trap in Astro scoped styles.** Astro scopes a component `<style>` with a `[data-astro-cid-*]` attribute, giving `.menu-toggle[data-astro-cid]` specificity (0,2,0) against `.lg\:hidden`'s (0,1,0) — so the hamburger stayed visible at 1280px next to the desktop nav. Those elements now hide with a media query in the scoped block rather than a utility class.
- [x] (2026-09-05) **`.prose p { margin: 0 }` outranked `.prose > * + *`** (0,1,1 vs 0,1,0), so every paragraph in every article collapsed against the next with zero gap. Rewritten as flow spacing: `.prose > *` resets, `.prose > * + *` sets the gap, and the more specific heading/list rules override it on purpose.
- [x] (2026-09-05) **The mobile menu could open invisible-but-focusable.** The fade used `requestAnimationFrame` to get a start frame after un-hiding, but rAF is throttled to nothing in a backgrounded tab — leaving the panel at `opacity: 0` with `hidden` removed and every link still in the tab order. Now forces a synchronous reflow instead.
- [x] (2026-09-05) **GSAP cannot interpolate `var()` colours.** The word-brightening scrub was tweening `color: 'var(--color-paper-600)'` → `var(--color-paper-50)`; GSAP interpolates channel by channel and cannot read through a custom property. Now literal hex, with a comment tying the two values back to the tokens they mirror.

**Verified, not assumed:**

- `npm run build`, `npx astro check` (0 errors), and `npm test` (38 tests) all pass.
- **JS-off contract holds.** Removing the `.js` class the head script sets leaves every `[data-reveal]` and `[data-split]` at `opacity: 1`, `visibility: visible`, no transform — confirmed in-browser. The hidden states are CSS-owned and `.js`-gated precisely so a failed or blocked bundle cannot make the site unreadable.
- **A scripted audit of all 27 built pages**: exactly one `h1` each, 25 JSON-LD blocks, 331 images with **zero** missing alt (309 described, 22 deliberately decorative), no title over 60 chars, no description over 160, canonical on every indexable page, and no internal link pointing at a non-canonical URL. The Phase 18 SEO work survived the rebuild intact.
- **React still never reaches the public site** — grepped the build: no public page references the Keystatic or React chunks.
- Lightbox verified live: 95 visible triggers out of 190 in the DOM (the Phase 18 double-binding fix still holds), counter reads `4 / 95`, and `data-lenis-stop` correctly parks smooth scroll while the dialog is open.
- Thoughts filters verified functionally: 4 → 0 (notes) → 4 (essays) → 1 (essays + #philosophy), with the counter tracking.
- Mobile (375px) verified: nav collapses to wordmark + hamburger, full-screen menu opens opaque with the five links and the CTA.

**Worth Paul's attention:**

- **The motion bundle is 54KB gzip on every page** (GSAP core + ScrollTrigger + SplitText + Lenis). The site previously shipped almost nothing. This is the real price of the brief and it is not reducible by much — GSAP core + ScrollTrigger alone is ~45KB. Dropping Lenis for native scroll saves ~7KB; hand-rolling the word split saves SplitText. Say the word if the trade isn't worth it.
- **Home-page hero copy is new and unreviewed.** "I help teams work out what to build — then make sure the people building it and the people asking for it are describing the same thing." replaced nothing — the old hero had only the Keystatic bio under it. The `heroGreeting`/`heroIntro` singletons are untouched and still drive the `h1` and the scroll-brightened statement.
- **The footer statement is new copy too**: "Figuring out what to build, with the people who have to build it."
- **The colophon was rewritten because the old one had become false** — it claimed one typeface and "two small vanilla enhancement scripts" of client JS. It now names Switzer + Courier Prime and the GSAP/Lenis layer honestly.
- Nav labels went from lowercase (`me`, `work`, `thoughts`) to sentence case (`About`, `Writing`, `Projects`). URLs are unchanged. Easy to revert if the lowercase voice mattered.

**Follow-up pass (2026-09-05), on Paul's note — "remove the Manila time and
other unnecessary text, smoothen and fasten the animation":**

- [x] (2026-09-05) **Clock removed** from the nav and the footer; the footer's "Local time" column went with it (four columns -> three). The pulsing status dot beside the wordmark went too — it read as a "live" signal paired with the clock and announced nothing without it. The dot survives as a mark, the pulse does not.
- [x] (2026-09-05) **"Scroll to explore" marquee cut.** It labelled a gesture the page already invites and was the only thing above the fold that said nothing.
- [x] (2026-09-05) **All nine page-head kickers cut** — each restated the h1 directly beneath it ("Writing" over "Thoughts", "Photography" over "Gallery", "Dead end" over "404"). Section kickers further down each page are untouched: those label content that is otherwise unlabelled, which is what the class is for. **This one was my judgement call on "other unnecessary text" — easy to restore individually.**
- [x] (2026-09-05) **Motion retuned.** Reveals 0.9s -> 0.55s on power2.out instead of power3.out (power3 decelerates hard and long, so it reads sluggish even at a short duration); travel 2rem -> 1.25rem; stagger 0.08 -> 0.045; hero 1.1s -> 0.7s; line splits 1s -> 0.7s; triggers at 92% rather than 85–88%. The word scrub now finishes at 70% of the viewport instead of 55%, so a sentence is fully lit while you are reading it rather than as it leaves.
- [x] (2026-09-05) **Lenis switched from `duration` + easing to `lerp: 0.14`.** A timed tween restarts on every wheel event, so a burst of scrolling stacked eases and felt rubbery; lerp chases the target continuously — smoother under fast scrolling and tighter overall.
- [x] (2026-09-05) **Hover transitions retuned per property** rather than by one blanket number: 0.22s for colour/border/background, 0.3s for transforms, 0.4s for the image grayscale-to-colour filters, which cover a far larger perceptual change and look abrupt any faster. (First attempt at this was a bug — a dict-based find/replace chained its own substitutions, 0.5s -> 0.3s -> 0.2s -> 0.15s, collapsing every duration to near-nothing. Redone as a single pass that picks the duration from the property being transitioned.)
- Re-audited after the cuts: 27 pages, 25 JSON-LD blocks, one h1 each, 331 images with zero missing alt, no over-length titles or descriptions.

- [x] (2026-09-05) Paul's visual review in-browser — verdict: "too SaaS, too AI". See Phase 21.
- [x] (2026-09-05) Decide: keep the 54KB motion bundle, or trim Lenis/SplitText — trimmed in Phase 21.
- [x] (2026-09-05) Merge to main + deploy

## Phase 21 — de-SaaS pass (Paul's direct request, 2026-09-05)

Paul liked NOCTURNE but read it as "too SaaS, too AI". The diagnosis was that
the dark ground and the display type were never the problem — the problem was
roughly ten pieces of **product-marketing furniture** that arrived with the
aesthetic, plus the fact that the home page is shaped like a **funnel**
(hero → proof → services → gallery → CTA) rather than an **index**.

Reference direction, from Mobbin: OpenAI's *Index* (year in the margin, plain
rows, hairlines, no cards), In Common With's press list (a table, not a grid),
MOUTHWASH Studio (dark chrome as small corner labels, not a floating glass
pill). Deliberately **not** taken: Linear's "Designed in California" — the
word-by-word scroll brightening was a near-copy of it, and Linear is the origin
of the dark-SaaS look, so the borrowed move imported the whole association.

Paul chose, from three options each: **strip the furniture** (keep the ground,
the face and the scale), **demote wine to links only**, **cut the scrub and
keep quiet reveals**.

- [x] (2026-09-05) **Chrome.** The floating, blurred, glass pill nav that solidified on scroll and hid itself on the way down is now a masthead: static, in normal flow, a rule underneath, name left and sections right. "Work with me" stopped being a filled CTA pinned top-right and became the sixth nav item. The hamburger became the word "Menu". `initNav()` deleted — there is no scroll state left to track.
- [x] (2026-09-05) **Buttons.** `--radius-pill` deleted outright, everything to 2px. `.btn-primary` went from a solid white pill to an outline that fills on hover; `.btn-wine` deleted (nothing referenced it). The hero's white-pill + ghost-pill pair became two `.link-arrow` links — a personal site has places to go, not a primary and secondary conversion action.
- [x] (2026-09-05) **Surfaces.** `.card` went from a white-alpha fill with a 16px radius and a 1px border to a single hairline above the block; `.panel` kept its border and lost its fill. New house rule, recorded in CLAUDE.md: **a hairline is the only surface.**
- [x] (2026-09-05) **Accent.** All 15 `.flare` spans stripped and the class deleted. Also gone: the kicker's glowing wine dot, the timeline's wine milestone and haloed live node, the wine "live" badge, the wine `::marker` and blockquote rule, the wine em-dash on /colophon, the wine step counters and section labels, the wine pull-quote bar, and the wine active-filter chip (now inverted paper-on-ink). Wine survives on inline links, the focus ring, and `KeyTakeaway` — which carries its own literal rgba now that `--wine-glow` is deleted.
- [x] (2026-09-05) **Glow.** `.hero__glow` and the footer's wine radial gradient both deleted. An ambient coloured bloom behind a section is the most legible "AI-generated page" tell there is.
- [x] (2026-09-05) **Services.** The 3-up numbered glass-card grid became the same ruled list the writing and projects indexes use. The framing line above it ("Three ways in, depending on how deep you need me") was cut rather than rewritten. On /work-with-me the three steps stayed in three columns but became a ruled spread rather than a card grid.
- [x] (2026-09-05) **Gallery teaser.** The full-bleed infinite marquee — the logo-wall pattern, pointed at concert photographs — became a static six-frame contact sheet inside the page column, square-cornered and in colour at rest. The old strip desaturated every frame and gave the colour back only on hover.
- [x] (2026-09-05) **Motion.** The word-by-word scroll brightening and the line-mask splits are gone, and with them SplitText and the `fonts.ready` race that gated real copy. Lenis went too — smooth scroll is the strongest "template" signal left, and it overrides a preference the reader set in their OS. `data-parallax` was dead code and is deleted. Bundle: **54KB → 45.7KB gzip** (40.9KB brotli). GSAP core + ScrollTrigger is the floor.
- [x] (2026-09-05) **Hero shape.** Dropped `min-height: 88svh`. A hero sized to hold the fold is a landing page; without it the page opens as a document.
- [x] (2026-09-05) **Copy.** Hero intro rewritten off the consultant register. Colophon corrected — it claimed "GSAP + Lenis … split-text statements, and smooth scrolling", all of which is now false.
- [x] (2026-09-05) **Verified.** `npm run build`, `npx astro check` (0 errors), `npm test` (38 tests) all pass. Re-audited all 27 built pages: exactly one `h1` each, 25 JSON-LD blocks, 313 images with **zero** missing alt (303 described, 10 deliberately empty), no title over 60 chars, no description over 160, and no public page referencing the React/Keystatic chunks. JS-off contract re-confirmed in-browser: with `.js` removed, 0 of 23 `[data-reveal]` elements stay hidden. Mobile menu verified at 375px.

**Worth Paul's attention:**

- **The hero copy is new again.** "I help teams figure out what to build. Most of that work turns out to be getting everyone to agree on what the words mean." The Phase 20 line was flagged as reading like a landing page — it did, because it was built like one. This is a first pass in a plainer register and it is still my words, not Paul's.
- **Removing Lenis was my call**, not one of the three options Paul picked; the option text said "possibly Lenis". It is a one-line revert plus reinstating `data-lenis-stop` on the lightbox, but the modal `<dialog>` blocks background scroll natively so nothing needs it back.
- **`.claude/launch.json` gained `"autoPort": true`** so a second session can start a dev server while port 4321 is taken. Unrelated to the design; revert freely.
- **Section spacing was left alone.** With the cards and glass gone, the Phase 20 vertical rhythm now reads as more empty space than it used to. That may want tightening once Paul has seen it — it is a one-token change (`.section` / `.section-tight`).

- [x] (2026-09-05) Paul's visual review of the de-SaaS pass — approved via chat; merged to main and deployed.

## Out of scope (v2 — do not build)

Idea Graveyard, backlinks/hover previews, search, library page, webmentions, newsletter, footnotes/sidenotes.

("Dark mode" left this list in Phase 20 by being resolved rather than built — the site is dark, full stop. There is no toggle and no light theme to maintain.)

