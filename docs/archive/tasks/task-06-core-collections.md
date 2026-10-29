# T06 — Core content collections (career, now, pages)

**Phase:** 2 · **Depends on:** T04 · **Spec:** §5.2, §8.1

## Goal

Keystatic collections + Astro content collections for `career` and `pages` singletons (`now` exists from T04), seeded with real content from the spec so Phase 2 pages have data.

## Schemas (mirror in keystatic.config.ts and src/content.config.ts)

**career** (collection): `org` (string, req), `role` (string, req), `period` (string, req — freeform like "2018–2023"; exact dates blocked on Paul, use spec approximations), `story` (markdown, req), `order` (number, req — sort ascending, oldest first), `logo` (image, optional).

**pages** (Keystatic singletons, one file each under `src/content/pages/`):
- `home`: heroHeadline, heroSubhead, ctaPrimaryLabel, ctaSecondaryLabel
- `about`: intro (markdown narrative)
- `workWithMe`: intro (markdown)
- `seo`: defaultDescription, siteName

## Steps

1. Add the schemas to `keystatic.config.ts` (career as collection; pages as four singletons).
2. Mirror in `src/content.config.ts` with zod. Keep field names identical in both — mismatches are the #1 Keystatic/Astro bug source.
3. Seed career entries from spec §5.2 (5 entries: NEUST BSIT → PSBank ~3yrs System Analyst → RightCrowd 5mos → Rappler 2018– → MMDC now). Story beats verbatim from the spec table; keep the RightCrowd "Australian hours weren't for him" beat human, not corporate.
4. Seed pages singletons with spec §5.1 draft hero copy (marked placeholder in spec — copy as-is, refinement is a human job).
5. Prove round-trip: edit a career entry in `/keystatic`, confirm the file changes and `getCollection('career')` reflects it.

## Definition of Done

- [ ] All collections/singletons editable in `/keystatic` and readable via typed `getCollection`/`getEntry`
- [ ] 5 career entries seeded, sorted correctly by `order`
- [ ] 4 pages singletons seeded with spec copy
- [ ] `npx astro check` and `npm run build` pass
- [ ] No schema drift between keystatic.config.ts and content.config.ts (field-by-field review)
