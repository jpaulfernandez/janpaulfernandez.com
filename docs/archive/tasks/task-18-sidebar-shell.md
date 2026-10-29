# T18 — Sidebar shell: nav, footer, zero-JS

**Phase:** 7 · **Depends on:** T03, T16 · **Spec:** Paul's minimalist redesign request (2026-08-12)

## Goal

Replace the notch nav and bento footer with a text-only shell: a fixed sidebar on desktop, a compact static header block on mobile, and a slim text footer. Zero client-side JS for navigation.

## Architecture & Rules

- **Rendering ladder rung 1–3 only.** No `<script>` for nav/menu state. Active page indicated with `aria-current="page"` + CSS (a `●` marker or bold), never JS.
- **Sidebar (md+):** fixed/sticky left column (~220px). Top: site name (display font). Middle: primary nav — Work (`/work-with-me`), Me (`/about`), Projects (`/projects`), Thoughts (`/thoughts`), Now (`/now`). Bottom: secondary links (Gallery, RSS, Email, LinkedIn, Instagram) + copyright.
- **Mobile (<md):** static top block — name, then nav links as wrapping text row(s). No hamburger, no drawer.
- **Footer:** slim text-only (copyright + secondary links if not already in the sidebar). No images, no gradients, no grain.
- **Tokens:** beige canvas, ink text, moss for links, citrus only for the active marker/hover accent. No hardcoded hex.
- **Landmarks:** one `header` (contains the `nav`), one `main`, one `footer`. Skip link stays.
- **Removed:** notch nav markup + scroll/menu JS + `.nav-shell` styles; bento footer markup and its gallery fetch; `main` notch clearance (`padding-top: 4.75rem`) replaced by sidebar clearance.

## Steps

1. Rewrite `src/layouts/BaseLayout.astro`: body-level layout (CSS grid `md:grid-cols-[220px_1fr]` or equivalent), sticky sidebar, mobile top block, slim footer.
2. Delete the notch scroll/menu `<script>` and scoped `<style>`; keep head (SEO/fonts/gtag) and skip link unchanged.
3. Adjust `src/styles/global.css`: drop notch clearance; keep anchor `scroll-margin-top` tuned for the new layout.
4. Verify every page renders without overlap/clipping at 375px and 1440px; keyboard tab order sane; focus visible.

## Definition of Done

- [x] No navigation JS ships; menu works with JS disabled (it's plain links)
- [x] `aria-current="page"` marks the active nav item on all pages
- [x] Bento footer gone; slim text footer on every page
- [x] Gallery still reachable via a footer/sidebar secondary link (page itself untouched)
- [x] `npm run build`, `npx astro check`, and `npm test` all pass cleanly
