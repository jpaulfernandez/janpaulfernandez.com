# Website review — janpaulfernandez.com

**Date:** 2026-09-04
**Scope:** Full-site code review (layouts, components, styles, client JS, a11y, content collections, Keystatic parity) + SEO audit + GEO audit. Findings verified against the repo source and live production (curl checks of served HTML, robots.txt, llms.txt, sitemap, OG images, 404 behavior). Read-only review; no files modified, no builds run.

**Verdict:** The codebase is genuinely healthy — React never reaches public pages, Keystatic ↔ Astro schemas are field-identical, the `src/lib/` layer is pure and well-tested, and the static/zero-JS-gated-content promise holds. The real damage is in **production plumbing**: one Critical GEO blocker fixable only in the Cloudflare dashboard, and a handful of cheap SEO fixes.

---

## 🔴 Critical — fix now

**1. Cloudflare is blocking the AI crawlers you explicitly want.** The repo `public/robots.txt` correctly allows GPTBot/ClaudeBot/PerplexityBot/Google-Extended — but in production, Cloudflare (which now fronts Vercel) injects a managed block **above** those rules that disallows `GPTBot`, `ClaudeBot`, `CCBot`, `Google-Extended`, `meta-externalagent`, `Amazonbot`, `Applebot-Extended`, `Bytespider`, plus `Content-Signal: ai-train=no`. This directly contradicts spec §1 ("ranking/cited in ChatGPT, Perplexity, AI Overviews") and §7.1. The duplicate `Allow` groups below don't reliably win — behavior is crawler-defined. **Fix in the Cloudflare dashboard (AI Audit / managed robots.txt settings), not in the repo.**

**2. `og:image` is a 404 on 10 of 14 routes.** `src/layouts/BaseLayout.astro:24` falls back to `/og-default.png`, which doesn't exist in `public/`. Every page without an explicit `ogImage` (home, about, work-with-me, now, projects, colophon, gallery index + sets, thoughts index, topics) ships a broken share image. The kicker: the OG route already generates `/og/home.png`, `/og/about.png`, `/og/now.png`, `/og/work-with-me.png` — all 200 in prod, referenced by nothing. Wire the pages to their existing images or ship a real `og-default.png`.

**3. Person JSON-LD `image` is a dead URL.** `src/lib/schema.ts:23` defaults to `${SITE_URL}/assets/paul.webp` — that route doesn't exist (404 verified live; the file lives in `src/assets/` and nothing imports it). Your single most important entity has a broken image in every knowledge graph that reads it. Put a copy in `public/` or import via `astro:assets`.

## 🟠 High

**4. Canonical-host mismatch.** `site: 'https://janpaulfernandez.com'` (`astro.config.mjs:19`) but prod canonicalizes to **www** (apex 308s). So canonicals, `og:url`, the sitemap, `schema.ts`'s `SITE_URL`, and all `llms.txt` links point at the host that redirects. Pick one: set `site` (and `SITE_URL`) to www, or flip the redirect.

**5. `/thanks/` is noindexed but listed in the sitemap.** Add it to the sitemap filter (`astro.config.mjs:61`).

**6. Article JSON-LD has no `image`, `url`, or `mainEntityOfPage`** (`src/lib/schema.ts:101-121` — image only when a post has a cover; none do). Google Article rich results require an image; a stable 1200×630 one already exists per post at `/og/<slug>.png`. Pass it from `src/layouts/ArticleLayout.astro`.

**7. No custom 404 page.** Verified live: `/anything-broken` serves Vercel's bare `NOT_FOUND` with an internal region ID. Add a branded `src/pages/404.astro`.

**8. `/gallery` lightbox double-binds every photo.** The page renders each shot twice (mobile wall `sm:hidden` at `src/pages/gallery/index.astro:109` + masonry wall at `:135`); `src/components/Lightbox.astro:173-178` binds all `.photo-trigger`s in DOM order. Result: the counter shows 2× the photos and prev/next cycles every image twice. Dedupe by `data-src` or scope to the visible wall.

**9. Draft leakage in the OG route.** `src/pages/og/[...route].ts:4` uses raw `getCollection('thoughts')` — draft posts get published OG images at guessable URLs. (`src/pages/rss.xml.ts:19` has the same rule violation, filtered inline.) Use `getPublishedThoughts()`.

**10. Gallery photos are JS-only buttons** — with JS disabled, nothing on the wall opens. Make triggers `<a href={fullSrc}>` and `preventDefault()` in the lightbox script (progressive enhancement, rung 2→4).

**11. Raw `<img>` for article covers** (`src/layouts/ArticleLayout.astro:87`, `alt=""`), with `cover.src` reused for `og:image` — content-collection `image()` fields aren't public URLs, so this breaks whenever a post gets a cover. Latent today (no covers).

## 🟡 Medium

- **GA4 gtag on every page** (`src/layouts/BaseLayout.astro:84-92`). Added deliberately (Phase 6), so it's a decision, not an accident — but it conflicts with spec §8 (Plausible/Umami, "no cookie banner"), the zero-client-JS stance, and GA4 technically wants a consent banner under ePrivacy/GDPR. Also makes the colophon's "zero client JS" claim inaccurate (`src/pages/colophon.astro:17`). Decide and align.
- **Heading anchors inject a literal `#` into heading text** (crawlers/AI parsers extracting H2s pick it up) **and use stale `text-moss-200` classes** that no longer exist after the token rename — so they're also unstyled (`astro.config.mjs:39-50`).
- **h1 → h3 heading skip** on `/thoughts` and `/topics/[topic]` — `src/components/PostListItem.astro:31` hardcodes `<h3>` with no `<h2>` between.
- **Trailing-slash inconsistency:** breadcrumb JSON-LD URLs lack the slash canonicals/sitemap use; both slash variants of articles serve 200 (canonical saves you, but consolidate).
- **OG gaps:** no `og:site_name`, `og:locale`, `og:image:alt`, or width/height; SVG-only favicon (no PNG/`apple-touch-icon` fallback); no `theme-color`.
- **RSS items omit `categories` and `author`** though topics are available (`src/pages/rss.xml.ts:52-57`). Feed content itself is excellent (full text, absolute URLs).
- **Timezone-fragile dates** in `src/layouts/ArticleLayout.astro:22`, `src/components/PostListItem.astro:22-24`, `src/pages/gallery/[slug].astro:18-21` (local-time formatting of UTC-midnight dates can shift the day; `src/pages/now.astro` already pins noon — extract that helper).
- **Contact-form a11y:** honeypot is `display:none` but keyboard-focusable (needs `tabindex="-1" autocomplete="off"`); name/email inputs missing `autocomplete` attributes (WCAG 1.3.5).
- **Both inline scripts exceed the ~40-line budget** (`src/components/Lightbox.astro` ~66, thoughts filter ~57) — vanilla and enhancement-only, so a budget breach, not a ladder break.

## ⚪ Minor / cleanup

- Dead `seo` singleton (both configs, nothing reads it); unconsumed CMS fields: `services.icon`, `gallery.featured`, `gallery.licensingAvailable`, and `thoughts.stage` (passed to `PostListItem` then ignored). Render or delete from both configs together.
- Dead code/files: `src/components/Timeline.astro` compact variant; `@fontsource/archivo-black` + `@fontsource/lato` deps unused since the Phase 11–13 revert (Courier Prime only); `src/assets/gallery/bini/bini-01.webp.tmp.jpg` (referenced nowhere — safe delete); `public/logo-ouroboros-{1,2,3}.svg` drafts; `/styleguide` filter for a page that doesn't exist; Courier Prime italic imported but never preloaded (FOUT); `src/components/blocks/Embed.astro` unused `catch (e)`, no Shorts URL support; `--spacing: 0` makes off-scale utilities silently render 0.
- Gallery set titles double the suffix → "BINI: Asiya — Gallery — Paul Fernandez" (SERP truncation).
- Callout "idea" variant (`src/components/blocks/Callout.astro:22-23`) uses off-palette Tailwind `green-*` classes.
- `plan.md` still shows T05 unchecked though deploy is recorded done.
- Repo weight (`.git` ~310 MB from 68 MB of gallery assets) — already tracked as blocked on Cloudflare Images credentials.

## GEO summary

Beyond the Critical Cloudflare block: foundations are strong — comprehensive dynamic `llms.txt`, single-source JSON-LD with a stable Person `@id`, full-content RSS, zero JS-gated content. Cheapest wins:

1. **`llms-full.txt`** (~30 lines of code; with 3 posts an LLM ingests the whole corpus in one fetch).
2. A discovery `<link rel="llms.txt">` on the home page or a mention in robots.txt.
3. A visible byline on articles (author currently only in JSON-LD/sidebar — E-E-AT extraction).
4. Fixes #2/#3/#6 above (broken/missing images also weaken machine-readable entity data).
5. Once Cloudflare is fixed: optionally name additional crawlers explicitly in `public/robots.txt` (wildcard already allows them).

## What's done well

- Zero `client:*` directives anywhere — React is confined to Keystatic, exactly per the hard constraint.
- Native HTML first: `<details>` FAQ/TOC, native `<dialog>` lightbox with proper focus/Esc/arrows, filters as enhancement over fully static lists.
- Keystatic ↔ Astro schema parity verified field-identical across all 10 collections/singletons — no drift.
- JSON-LD discipline: one `@id` for Person (`https://janpaulfernandez.com/#person`), referenced everywhere, no hand-written blocks, builders unit-tested.
- Unique titles/descriptions and self-referencing canonicals on all 14 pages; `/thanks` correctly noindexed.

## Suggested fix order

1. #1 — Cloudflare dashboard (AI Audit / managed robots.txt)
2. #2 + #3 — OG fallback + Person image
3. #4–#6 — canonical host, sitemap filter, Article JSON-LD image
4. #7–#11 — 404 page, lightbox dedupe, draft filter, progressive enhancement, cover image path
5. Medium items as a polish pass
