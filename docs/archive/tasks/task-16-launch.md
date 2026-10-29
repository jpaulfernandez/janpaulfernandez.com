# T16 — Polish, accessibility, launch

**Phase:** 4 · **Depends on:** T05, T08–T15 · **Spec:** §7.1, §9

## Goal

Launch-ready: accessibility pass, Lighthouse ≥ 95 everywhere, Keystatic GitHub mode, analytics, Search Console.

## Steps

1. **Accessibility pass** (every page): keyboard-only walkthrough; focus visible everywhere; one h1 + logical heading order; images have alt (empty alt for decorative); form labels; contrast re-check on interactive/badge states; reduced-motion respected. Run axe (`npx @axe-core/cli` against local build or browser extension) — zero critical/serious issues.
2. **Lighthouse ≥ 95 all four categories** on: home, a thoughts post, thoughts index, work-with-me. Run against a production/preview URL, not dev. Fix in order of impact; typical suspects — image sizes, font preload correctness, unused JS (there should be almost none: audit dist/_astro).
3. **Keystatic GitHub mode:** switch storage to `kind: 'github'` with the Keystatic GitHub App per current docs, so Paul edits from the deployed /keystatic → commits → Vercel rebuilds. Verify an edit round-trips. Keep local mode working for dev (env-based switch).
4. **Analytics:** Plausible or Umami — one script tag in BaseLayout, production-only. Needs Paul's account; placeholder + note if absent.
5. Delete `/styleguide`. Sweep for TODO markers, placeholder copy, `#` hrefs — resolve or log in plan.md under blocked items.
6. **Search Console:** verify domain, submit sitemap. Confirm robots.txt + sitemap fetchable in production.
7. Final content check: meta descriptions unique per page; OG images render in a card preview tool.

## Definition of Done

- [ ] axe: zero critical/serious on all pages
- [ ] Lighthouse ≥ 95 × 4 categories × 4 page types (record scores in plan.md next to this task)
- [ ] Paul can edit content at production /keystatic and see it deploy (or GitHub-mode blocker documented)
- [ ] Analytics live (or documented pending account)
- [ ] No styleguide, TODOs, or dead placeholder links in production
- [ ] Sitemap submitted to Search Console; site live at janpaulfernandez.com
