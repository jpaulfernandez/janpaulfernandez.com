# T09 — About & Now pages

**Phase:** 2 · **Depends on:** T06, T07, T08 · **Spec:** §5.2, §5.4

## Goal

/about and /now pages live, CMS-driven, with ProfilePage JSON-LD.

## About (/about)

1. First-person narrative from `about` singleton (markdown-rendered), photo (reuse optimized paul.webp), then full career story rendered from the `career` collection — richer than the home Timeline: org, role, period, full `story` markdown per entry. Reuse `Timeline.astro` with a `variant="full"` prop ONLY if the markup genuinely overlaps; otherwise a separate simple block — don't force abstraction.
2. Ends with soft CTA to /work-with-me + social links (placeholders until Paul provides).
3. JSON-LD: `profilePage()` + full `person()` + breadcrumbs. About is the page where Person carries the most detail (alumniOf, worksFor, knowsAbout).

## Now (/now)

1. Intro paragraph: what a Now page is + "Last updated: {date}" where date = max date across `now` entries.
2. Reverse-chron timeline of `now` entries: date shown as "Month Year", markdown blurb, optional link/image.
3. JSON-LD: `profilePage(dateModified = latest entry date)` + breadcrumbs — freshness matters for GEO (spec §7.3).
4. Sanity-check the 2-minute-update workflow: add an entry via /keystatic, rebuild, confirm it appears with updated "last updated".

## Definition of Done

- [ ] /about renders narrative + photo + all 5 career entries with stories, soft CTA at end
- [ ] /now renders intro, correct "last updated", entries newest-first with Month-Year dates
- [ ] ProfilePage JSON-LD on both; /now `dateModified` equals latest entry date (verify in view-source)
- [ ] Adding a Now entry via Keystatic → visible after rebuild, "last updated" moves
- [ ] One h1 per page; article measure ≤68ch on About narrative; build + check pass
