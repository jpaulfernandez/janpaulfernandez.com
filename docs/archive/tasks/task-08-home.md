# T08 — Home page

**Phase:** 2 · **Depends on:** T06, T07 · **Spec:** §5.1

## Goal

The full home page, sections in spec order, all copy from CMS singletons, JSON-LD wired.

## Section order (spec §5.1 — do not reorder)

1. **Hero** — `src/assets/paul.webp` via Astro `<Image>` (responsive, webp), Archivo Black headline + subhead from `home` singleton, primary CTA (citrus) → /work-with-me, secondary (moss outline) → /thoughts.
2. **Latest thoughts** — 3 most recent. The thoughts collection doesn't exist until T10: build `PostCard.astro` against a typed placeholder array now, and leave a `// TODO(T10): swap to getCollection('thoughts')` marker. Card: type badge, title, topic tags, date, 1-line excerpt.
3. **Now snapshot** — 2–3 latest `now` entries + link to /now.
4. **Work with me teaser** — four service-area cards (hardcode the four titles from spec §5.5 for now; T15 migrates to the services collection) + "What I bring to the table" 3 proof points (national scale, PHVote 2019, CMS migration w/ ontology) + CTA.
5. **Employment timeline** — compact vertical `Timeline.astro` from `career` collection (logos/years, link to /about).
6. **Footer CTA** — one-liner + email link.

## Steps

1. Build section components in `src/components/`: `Hero.astro`, `PostCard.astro`, `Timeline.astro`, `ServiceCard.astro`. Only extract a component when it's reused or the page file gets unwieldy — sections used once can stay inline in the page.
2. Assemble `src/pages/index.astro`; apply rhythm/measure conventions from T03.
3. JSON-LD: `webSite()` + `profilePage()` + `person()` + `breadcrumbs([Home])` via JsonLd component.
4. Check both breakpoint extremes: 375px and 1440px.

## Definition of Done

- [ ] All 6 sections render in order with real CMS/collection data (thoughts placeholder allowed, marked TODO(T10))
- [ ] Editing hero copy in /keystatic changes the page after rebuild
- [ ] Hero image is optimized by Astro (`<img>` with generated srcset in view-source; no raw webp passthrough)
- [ ] One h1 (the hero headline); h2 for each section; validator.schema.org clean on the page's JSON-LD
- [ ] No layout break at 375px; no console errors; build + check pass
