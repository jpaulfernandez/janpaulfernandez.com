# T11 — Article layout & BlogPosting schema

**Phase:** 3 · **Depends on:** T10 · **Spec:** §5.3, §7.2, §7.3

## Goal

`/thoughts/[slug]` pages: full article layout with meta, optional TOC, author card, related posts, prev/next, BlogPosting JSON-LD.

## Steps

1. `src/layouts/ArticleLayout.astro` (wraps BaseLayout) + `src/pages/thoughts/[slug].astro` using `getStaticPaths` over `getPublishedThoughts()`.
2. Header block: title (h1), meta line — type badge, stage badge (if set), topic tags (link to `/topics/[topic]`), published date, **updated date if present**, reading time.
3. Reading time: one-liner — `Math.ceil(words / 200)` on the raw body. No dependency (YAGNI: it's one line).
4. TOC for essays only: extract h2s from `render()`'s headings data; anchor links; hide when < 3 h2s. Static HTML, no JS (a `<nav aria-label="Table of contents">` list; sticky-positioning optional).
5. Body: article measure ~720px/68ch, MDX rendered with the T10 block component mapping, prose styling for all primitives (spacing, blockquote, tables, code).
6. Author card at end: photo, 2-line bio, link to /about and /work-with-me.
7. Related thoughts: same topic overlap, exclude self, max 3, newest first — pure function in `src/lib/thoughts.ts`, unit-tested.
8. Prev/next links by publishedDate across all published thoughts.
9. JSON-LD: `blogPosting()` (headline, description=excerpt, datePublished, dateModified=updatedDate ?? publishedDate, image=cover, keywords=topics, wordCount) + breadcrumbs (Home › Thoughts › title). Type `Article` when type=essay, `BlogPosting` when note — pass a type param to the builder.
10. OG: pass excerpt as description, cover (or future generated OG from T13) as ogImage, `type="article"` to BaseLayout.

## Definition of Done

- [ ] Test post from T10 renders fully: meta line, TOC (when ≥3 h2s), all blocks, author card, related, prev/next
- [ ] Draft posts get no route (build output has no /thoughts/<draft-slug>/)
- [ ] `relatedThoughts()` unit tests: topic overlap, self-exclusion, max 3
- [ ] JSON-LD valid on validator.schema.org; dateModified logic correct in view-source
- [ ] Zero client JS on article pages (check dist output for the route)
- [ ] Build + check + test pass
