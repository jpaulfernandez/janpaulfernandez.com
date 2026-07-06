# T03 — Base layout, nav, footer, SEO head

**Phase:** 1 · **Depends on:** T02 · **Spec:** §3, §4.3, §7.1

## Goal

`BaseLayout.astro` used by every page: full `<head>` SEO plumbing, global nav, footer, layout rhythm.

## Steps

1. Create `src/layouts/BaseLayout.astro` with props: `title` (required), `description` (required), `ogImage?`, `type?` ('website' | 'article', default 'website'). Head must include: charset, viewport, `<title>` as `{title} · Jan Paul Fernandez` (plain title on home), meta description, canonical URL built from `Astro.site` + `Astro.url.pathname`, Open Graph (title, description, url, type, image) and Twitter card tags, favicon link, RSS `<link rel="alternate">` (points to `/rss.xml`; fine to add now, feed ships in T13). Set `site: 'https://janpaulfernandez.com'` in `astro.config.mjs`.
2. Preload the two critical font files (Archivo Black 400 woff2, Lato 400 woff2) with `<link rel="preload" as="font" crossorigin>` — find exact paths in `node_modules/@fontsource/*/files/`.
3. Header nav: Home · About · Thoughts · Now · Work with me. Semantic `<header><nav>`. `aria-current="page"` on active link (compare pathnames). Mobile: simple collapse — a `<details>`/checkbox pattern or a ≤10-line inline script; no framework, no mega-menu.
4. Skip link (`href="#main"`, visually hidden until focused). Wrap page content in `<main id="main">`.
5. Footer: moss-900 bg, light text. Social links (placeholder `#` hrefs — real URLs blocked on Paul, see plan.md), email, RSS link, colophon "Built with Astro + Keystatic", `© {new Date().getFullYear()}`.
6. Layout primitives as Tailwind conventions (documented in a comment or small component): content max-width 1140px, article measure ~720px/68ch, section vertical rhythm 96–128px desktop.
7. Motion: add a tiny `fade-rise` CSS utility for section entrances, wrapped in `@media (prefers-reduced-motion: no-preference)`. CSS-only (animation triggered on load is fine; IntersectionObserver only if a later task demands scroll-triggering).
8. Convert `index.astro` and `styleguide.astro` to use BaseLayout.

## Definition of Done

- [ ] View-source on `/` shows: one `<h1>`, title, description, canonical, OG + Twitter tags, font preloads
- [ ] Nav works with keyboard only; skip link appears on first Tab; `aria-current` set on active page
- [ ] Nav usable at 375px width without horizontal scroll
- [ ] Landmarks present: header, nav, main, footer (one each)
- [ ] `prefers-reduced-motion: reduce` disables the entrance animation (test in devtools emulation)
- [ ] `npm run build` + `npx astro check` pass
