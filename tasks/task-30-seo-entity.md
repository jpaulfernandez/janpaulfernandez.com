# T30 — SEO/GEO correctness & entity pass

**Phase:** 30 · **Source:** [seo-strategy.md](../seo-strategy.md) (audit, 2026-09-20)
**Depends on:** nothing. All work is additive to `src/lib/schema.ts` and its callers.

## Context

The 2026-09-20 audit scored the site **SEO A− / GEO C+**. Technical hygiene is
already excellent; the gap is entity thinness. Three defects were verified against
built output in `dist/client/`, not inferred from source:

1. `/about/` and `/` both emit a `ProfilePage` claiming `url` = the homepage.
2. Article, workshop, service and gallery pages reference `author`/`provider` by
   `@id` but never define that `Person` on the page — so every article publishes an
   author with no name.
3. The `Person` node itself is a stub: no `description`, two `sameAs`, a `jobTitle`
   that contradicts the site's own prose.

This task covers **A (correctness)** and **B (entity)**. Both are surgical — one
library file, its tests, and five call sites. **C (Course offers)** is specified in
§4 below but is **gated** and must not be built in this task.

`src/lib/schema.ts` is pure logic with existing coverage (`schema.test.ts`, 16
tests). Per CLAUDE.md, **write the failing assertions first** for every change in
§1–§3.

---

## Part A — correctness

### 1. Fix the ProfilePage URL collision

`profilePage()` hardcodes `url: SITE_URL`.

- Add a `url` parameter (site-relative, resolved through the existing `abs()`
  helper) and a `name` parameter. Keep `dateModified` optional as it is today.
- Add the recommended `mainEntity` → already present as `{ '@id': PERSON_ID }`; leave it.
- **Remove the `profilePage()` call from `src/pages/index.astro`.** The homepage is
  a hub (now-feed, recent writing, workshops teaser), not a profile. It keeps
  `webSite()`, `person()` and `breadcrumbs()`.
- In `src/pages/about.astro`, call `profilePage({ url: '/about/', name: 'Jan Paul Fernandez' })`.

Google's ProfilePage docs name "'About Me' pages on blogs" as a valid use case, so
`/about/` is the correct home for this node — the current wiring is backwards.

**Tests first:** `profilePage()` resolves a relative `url` to absolute; defaults to
`SITE_URL` when omitted (so nothing silently breaks); still carries `mainEntity.@id`.

### 2. Make the `@id` reference resolve locally

Every page that references `PERSON_ID` must also define the `Person` node. Same
`@id`, so the graph still collapses to one entity — it simply also resolves
standalone, which is how Google parses per-document.

Add `person()` to the JSON-LD array in:

| File | Dangling reference |
|---|---|
| `src/layouts/ArticleLayout.astro` | `Article.author` |
| `src/pages/workshops/[slug].astro` | `Course.provider` |
| `src/pages/work-with-me.astro` | `Service.provider` |
| `src/pages/gallery/[slug].astro` | `ImageGallery.author` + per-image `creator` |
| `src/pages/thoughts/index.astro` | `Blog.author` + each `blogPost.author` |

No change to `schema.ts` is needed for this — it is a call-site fix. Verify no page
ends up emitting `person()` twice.

### 3. Prefer the real cover over the generated OG card

`ArticleLayout.astro` sets `cover: /og/${post.id}.png` unconditionally. Two posts
(`morty-without-the-crystal`, `if-ai-takes-all-the-jobs-what-do-we-actually-do`)
have real cover photographs with authored `coverAlt`, and those are being
overridden by a 1200×630 text card.

- Use `post.data.cover` when present, fall back to the OG card.
- Keep the OG card for `ogImage` in `BaseLayout` — the share card should stay the
  share card. Only `Article.image` changes.

### 4. Nine topic archive titles

`src/pages/topics/[topic].astro` emits `<title>#ai — Paul Fernandez</title>`.
`#ai` is not a phrase anyone types or an LLM matches. Change the `<title>` only —
if the `#ai` treatment in the visible `h1` is deliberate, leave it alone.

Target: `AI — Writing by Paul Fernandez`. Needs a display-name map for the nine
topics (`ai`, `culture`, `engineering`, `media`, `philosophy`, `product`,
`psychology`, `technology`, `workflows`) since `ai` → `AI` is not title-case.

### 5. Seven thin meta descriptions

Rewrite to 140–160 characters. The article descriptions (129–148) are already
well-tuned; match that register — this is copy, not filler.

| Page | Now | Source |
|---|---|---|
| `/workshops/ai-fluency/` | 48 | `src/content/courses/ai-fluency.json` |
| `/now/` | 54 | `src/pages/now.astro` |
| `/gallery/` | 60 | `src/pages/gallery/index.astro` |
| `/workshops/ai-for-business/` | 61 | `src/content/courses/ai-for-business.json` |
| `/workshops/vibe-coding/` | 66 | `src/content/courses/vibe-coding.json` |
| `/workshops/leadership-ai/` | 78 | `src/content/courses/leadership-ai.json` |
| `/colophon/` | 82 | `src/pages/colophon.astro` |

`/thanks/` (36) is noindexed — leave it.

### 6. Extend sitemap `lastmod` to `now` and `courses`

`contentLastmod()` in `astro.config.mjs` reads only `thoughts` and `gallery`, so 11
URLs ship without `lastmod` — including all four workshop pages and `/workshops/`.

- Add `src/content/now/*.md` (has a `date` field) → bumps `/now/`.
- Add `src/content/courses/*.json` → needs a date. **There is no date field on
  courses**, so either add one to both configs (schema parity is a hard constraint)
  or skip courses. **Prefer skipping** unless Paul wants course freshness tracked —
  inventing a date defeats the purpose.
- **Keep `/`, `/about/`, `/colophon/`, `/projects/` bare.** The existing reasoning
  in that file — a build-time timestamp is a worse signal than none — is correct
  and must survive this change.

---

## Part B — entity enrichment

### 7. Enrich the `Person` node

Highest-leverage item in the audit. The `Person` node with its `sameAs` chain is
the mechanism 2026 E-E-A-T actually runs on, and right now it is a stub.

Add to `person()` in `schema.ts`:

- **`description`** — 1–2 substantive sentences. **Needs Paul** (§ Blocked below).
- **`jobTitle`** — currently `'Tech Leader'`, which is vague and contradicts
  `llms.txt` and `/about/`, both of which say *IT Manager at Mapúa Malayan Digital
  College*. Consistent naming across surfaces is what builds entity confidence;
  this inconsistency actively erodes it. **Needs Paul** to confirm the canonical string.
- **`address`** — `{ '@type': 'PostalAddress', addressCountry: 'PH' }`. He is
  positioned throughout as a Philippines-based technologist and nothing in the
  graph says so.
- **`knowsAbout`** — replace five generic nouns ("Technology", "Economy") with the
  specific things he is credible on: election-night technology operations, banking
  account-opening systems, AI literacy training, product discovery, requirements
  elicitation. Draft from `/about/` and the career collection; **Paul approves**.
- **`sameAs`** — expand beyond LinkedIn + personal Instagram. **Needs Paul** for
  which profiles are public-facing (GitHub at minimum).
- **`worksFor` / `alumniOf`** — currently bare name strings, unlinkable. Add `url`
  (`https://mmdc.mcl.edu.ph/`, NEUST) so the MMDC / Rappler / PSBank associations —
  Paul's actual credibility — connect to something in the graph.

**Tests first:** `person()` emits `description`, `address.addressCountry`, and
linked `worksFor.url`; overrides still win; `PERSON_ID` stays pinned to the apex
literal (existing test at `schema.test.ts:107` must keep passing).

### 8. Create a Wikidata item — **off-site, Paul**

The single highest-leverage action available, and no code. A Wikidata Q-ID is the
highest-weight `sameAs` reference because Wikidata is the canonical entity graph
Google resolves knowledge panels against. Roughly half of personal Knowledge Panels
no longer require Wikipedia, so an individual practitioner can now qualify.

Once the Q-ID exists it goes into `sameAs` — a one-line change.

---

## Part C — Course offers — **SPECIFIED, NOT AUTHORISED**

The audit recommended adding `hasCourseInstance` + `offers` to `course()`.
**Two things changed on inspection, and the second one blocks it.**

**The data already exists.** The audit assumed this needed a schema change touching
`keystatic.config.ts` and `content.config.ts` together. It does not — `courses`
already carries `duration` (`"2 hours"`), `formatLabel` (`"1-on-1 / group"`) and
`formats[]` with `price` / `priceNote`. Implementation would be a parser in
`schema.ts`, no config change, no schema-parity risk.

**But it escalates an uncleared commercial claim.** `plan.md` → *Blocked-on-Paul*
→ */workshops launch blockers* records that BIR registration and official receipts
are outstanding, written MMDC employer clearance is outstanding, and that **every
price is an untested hypothesis**. Prices sit in prose today. Emitting `offers`
makes them machine-readable and potentially rich-result eligible — a louder,
more durable commercial claim than the page currently makes.

That is a business decision, not an SEO one. **Do not build this until those
blockers clear.** When they do:

- `price` is a human string. `"from ₱2,500"` is a *minimum*, so the honest
  construct is `offers.priceSpecification` with `minPrice` + `priceCurrency: "PHP"`,
  **not** a flat `offers.price` — Google's structured data policy requires markup
  to match visible content, and `price: 2500` would misstate "from".
- `"Message to quote"` formats must emit **no** `offers` at all.
- `duration: "2 hours"` → ISO 8601 (`PT2H`) for `hasCourseInstance.courseWorkload`.
- `hasCourseInstance.courseMode` → `"Online"` / `"Onsite"` from `formats[].detail`.

---

## Out of scope

- **Anything further with `llms.txt`.** The audit found ~408 targeted fetches across
  ~500M AI bot visits, no provider commitment, and no measurable citation lift.
  The existing implementation is good and costs nothing to keep. Keep it, change
  nothing, add nothing.
- Answer-first rewrites of the personal essays. That would wreck the voice
  `voice.md` and Phases 21/29 exist to protect. The explainer-post openers are
  Phase C content work, tracked separately.
- Any v2 backlog item (search, backlinks, graveyard).

---

## Blocked on Paul

Part A is fully unblocked and should ship on its own. Part B needs:

1. **Canonical `jobTitle`** — "IT Manager, Mapúa Malayan Digital College"? The
   current `'Tech Leader'` contradicts the rest of the site.
2. **A 1–2 sentence `description`** for the Person node — this is what an LLM
   quotes when asked "who is Paul Fernandez". Can be drafted from `/about/` for approval.
3. **Which profiles belong in `sameAs`** — GitHub? X? Is the `goofffball` Instagram
   intended as a professional identity signal, or should it come out?
4. **`knowsAbout` approval** — draftable, needs a yes.
5. **Wikidata item** (§8) — off-site, only Paul can do it.
6. **Part C authorisation** — gated on the existing workshop launch blockers.

---

## Definition of Done

Part A:

- [ ] Exactly one `ProfilePage` exists sitewide, on `/about/`, with `url` = `/about/`.
- [ ] Homepage emits `WebSite` + `Person` + `BreadcrumbList`, no `ProfilePage`.
- [ ] Every page referencing `PERSON_ID` also defines the `Person` node; no page emits it twice.
- [ ] `Article.image` is the real cover where one exists, OG card otherwise.
- [ ] No `<title>` contains a `#`-prefixed slug.
- [ ] All seven descriptions are 140–160 chars; `/thanks/` untouched.
- [ ] `/now/` has a `lastmod`; `/`, `/about/`, `/colophon/`, `/projects/` still do not.
- [ ] New vitest assertions written **before** implementation for every `schema.ts` change.

Part B:

- [ ] `person()` emits `description`, `address`, specific `knowsAbout`, expanded
      `sameAs`, and linked `worksFor` / `alumniOf`.
- [ ] `jobTitle` matches `/about/` and `llms.txt` exactly.
- [ ] `PERSON_ID` still pinned to the apex literal (`schema.test.ts:107` green).

Verification (all parts):

- [ ] `npx astro check` — 0 errors
- [ ] `npm test` — all green (59 baseline + new)
- [ ] `npm run build` — passes
- [ ] Built output re-audited in `dist/client/`: extract every `ld+json` block and
      confirm no dangling `@id`, no duplicate `ProfilePage`, no `@type` regressions.
      This is how the original defects were found — source inspection missed them.
- [ ] Sample pages pass [Google's Rich Results Test](https://search.google.com/test/rich-results)
      and the [Schema Markup Validator](https://validator.schema.org/).
