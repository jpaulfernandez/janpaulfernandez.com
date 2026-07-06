# T13 — RSS feed & OG image generation

**Phase:** 3 · **Depends on:** T11 · **Spec:** §7.1

## Goal

Full-content RSS at /rss.xml; branded auto-generated OG images for posts and core pages.

## RSS

1. `npm install @astrojs/rss`. Create `src/pages/rss.xml.ts`.
2. **Full content** feed (spec: aids AI ingestion): render each post's MDX body to HTML using Astro's Container API (`experimental_AstroContainer`) with the same block components as T11, or the documented current approach for rendering collections outside pages — check Astro 5 docs, don't guess. Fallback if Container proves fragile: excerpt-only feed + note in plan.md; but attempt full-content first.
3. Items: title, link, pubDate, description=excerpt, full HTML in `content` (sanitize relative URLs to absolute).

## OG images

1. Use `astro-og-canvas` (spec-suggested): generates PNG endpoints at build for each thought + core pages (home, about, now, work-with-me).
2. Design: moss-900 bg, title in Archivo Black (register the local font file with the library), citrus accent bar, "janpaulfernandez.com" small in Lato. 1200×630.
3. Wire generated URLs into BaseLayout's `ogImage` prop from [slug].astro and core pages. A post with a `cover` image still uses the generated card (consistent branding) unless this looks worse in practice — judgment call, note the decision.

## Definition of Done

- [ ] /rss.xml validates (https://validator.w3.org/feed/); items contain full HTML content with absolute URLs; drafts excluded
- [ ] Custom blocks (Key Takeaway etc.) render acceptably in feed HTML (graceful degradation to plain divs is fine)
- [ ] Every thought + 4 core pages have a generated OG image; spot-check one renders with correct fonts/colors
- [ ] `og:image` on a post page points at the generated image with absolute URL
- [ ] Footer RSS link works; build passes
