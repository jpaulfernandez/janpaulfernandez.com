# T07 — JSON-LD schema library

**Phase:** 2 · **Depends on:** T01 · **Spec:** §7.2

## Goal

`src/lib/schema.ts`: pure functions that build JSON-LD objects, unit-tested, plus a tiny Astro component that renders them. No page wiring yet (pages consume these in T08+).

## Context you need

- The Person entity must have ONE stable `@id`: `https://janpaulfernandez.com/#person`, referenced (not duplicated) everywhere. Consistent entity = knowledge-graph recognition (spec §7.2).
- These are pure data functions — the ideal TDD target in this codebase. Write tests first.

## Steps

1. `npm install -D vitest`. Add `"test": "vitest run"` script. (First test dependency in the repo — that's fine, it's earned here.)
2. Write `src/lib/schema.test.ts` FIRST, asserting on output shape of each builder below.
3. Implement in `src/lib/schema.ts`:
   - `PERSON_ID` const and `SITE_URL` const
   - `person(overrides?)` → Person: name, url, image, jobTitle, `alumniOf` (NEUST), `worksFor` (MMDC), `knowsAbout` [technology, digital transformation, AI implementation, economy, psychology], `sameAs` (empty array until Paul provides URLs — see plan.md blocked items; structure must accept them without code change)
   - `webSite()` → WebSite with `publisher: { '@id': PERSON_ID }`
   - `profilePage(dateModified)` → ProfilePage wrapping a `{ '@id': PERSON_ID }` mainEntity
   - `breadcrumbs(items: {name, url}[])` → BreadcrumbList
   - `blogPosting(post)` → BlogPosting: headline, description, author `@id` ref, datePublished, dateModified, image, keywords, wordCount (accept a plain object arg; don't couple to Astro types)
   - `faqPage(questions: {q, a}[])` → FAQPage
   - `service(s)` → Service
4. Key test cases: person `@id` equals PERSON_ID; webSite/profilePage/blogPosting reference the id rather than embedding a second person; blogPosting includes dateModified; every builder output survives `JSON.stringify` and has `@context`/`@type`.
5. `src/components/JsonLd.astro`: takes `data` prop (object or array), renders `<script type="application/ld+json">` with `JSON.stringify` via `set:html`.

## Definition of Done

- [ ] `npm test` passes; every builder has at least one test; `@id` referencing tested explicitly
- [ ] All spec §7.2 types covered: WebSite, BreadcrumbList, ProfilePage/Person, BlogPosting, Service, FAQPage
- [ ] Builders are pure (no Astro imports in schema.ts)
- [ ] JsonLd.astro renders valid JSON-LD (paste output into https://validator.schema.org — zero errors)
- [ ] `npm run build` passes
