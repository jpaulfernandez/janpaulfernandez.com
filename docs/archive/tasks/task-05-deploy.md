# T05 — Deploy pipeline, robots.txt, sitemap

**Phase:** 1 · **Depends on:** T03, T04 · **Spec:** §7.1, §8

## Goal

Site auto-deploys to Vercel on push, reachable at janpaulfernandez.com, with sitemap and an AI-crawler-friendly robots.txt.

## Steps

1. `npm install @astrojs/sitemap` and add the integration (requires `site` set in config — done in T03). Filter out `/styleguide` and `/keystatic` from the sitemap.
2. robots.txt: prefer a static `public/robots.txt` over the `astro-robots-txt` package (YAGNI — it's static text). Content: allow all, then explicit `User-agent` allow blocks for `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`; `Sitemap: https://janpaulfernandez.com/sitemap-index.xml`.
3. Push repo to GitHub (if not already). Import into Vercel: framework preset Astro, static output — no adapter needed. Confirm preview deploy on a PR branch works.
4. Domain: janpaulfernandez.com apex + `www` → apex redirect via Vercel domain settings. (If DNS access is unavailable, do everything else, deploy to the `.vercel.app` URL, and leave a note in plan.md that domain wiring is pending.)
5. Verify production: `curl -s https://<domain>/robots.txt`, `/sitemap-index.xml`, and `/` return 200; `/keystatic` returns 404 in production.

## Definition of Done

- [ ] Push to main triggers a Vercel production deploy; PRs get preview URLs
- [ ] `/robots.txt` served with the four AI crawler allows + sitemap line
- [ ] `/sitemap-index.xml` valid, lists real pages, excludes styleguide/keystatic
- [ ] `/keystatic` is 404 in production
- [ ] Domain resolves with www→apex redirect (or documented as pending DNS)
