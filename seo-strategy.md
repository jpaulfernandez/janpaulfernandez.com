# SEO & GEO Strategy — janpaulfernandez.com

**Audited:** 2026-09-20 · **Against:** build at `d7afb0a` · **Auditor:** Claude (Opus 5)

This is an audit and a plan, not a changelog. Nothing in the codebase was modified.
Fixes worth doing should be logged as tasks in `plan.md` before anyone writes code
(see [CLAUDE.md](CLAUDE.md) — plan.md is the tracker).

**Update 2026-09-20:** now tracked as **Phase 30** in [plan.md](plan.md), with full
implementation detail in [tasks/task-30-seo-entity.md](tasks/task-30-seo-entity.md).
Two findings below carry inline corrections (§3.4 and §5) after inspecting the
courses collection and re-verifying the live `robots.txt`.

---

## 0. Executive summary

The site is in the **top few percent of personal sites** on technical SEO. Static
HTML, canonical discipline, a content-derived sitemap, a single `@id` for the
Person entity, and eleven distinct schema types already shipped. There is very
little left to fix at the "technical hygiene" layer.

The gap is not technical. It is **entity thinness and off-site absence**:

- The `Person` entity that the whole graph keys on carries no `description`, two
  `sameAs` links, and a vague `jobTitle`. It is a stub that every other node points at.
- Every article page references `author` by `@id` but never defines that Person on
  the page, so each article publishes an author with **no name**.
- The `/about/` page — the strongest entity page on the site — declares its
  `ProfilePage` URL as the homepage, colliding with the homepage's own.

And the strategic finding: **the site's largest GEO investment (`llms.txt` +
`llms-full.txt`) has no measurable effect.** Independent 2026 data shows AI
crawlers essentially never fetch it. Keep it (it is already built and costs
nothing) but stop treating it as the GEO strategy. The real GEO lever for a
personal brand is off-site entity corroboration, which currently does not exist.

**Grade: SEO A− / GEO C+.**

---

## 1. Research basis — the rubric

Before scoring, here is what the scoring is grounded in. Two of these findings
directly contradict assumptions baked into the current build.

### 1.1 What Google actually requires (schema.org)

| Type | Google's position | Relevance here |
|---|---|---|
| `Article` / `BlogPosting` | **No required properties.** Recommended: `author`, `datePublished`, `dateModified`, `headline`, `image`. `author.name` is recommended, and `author.url` or `sameAs` is "strongly encouraged" for disambiguation. | Site emits all but a resolvable `author.name` |
| `ProfilePage` | **One required property: `mainEntity`** (a `Person` or `Organization`). Explicitly valid for "'About Me' pages on blogs." Recommended: `dateCreated`, `dateModified`, `name`, `image`, `description`, `sameAs`. | Valid use case — but wired to the wrong URL |
| `Person` | Not a standalone rich result. Feeds the Knowledge Graph. `sameAs` is the verification mechanism. | Thin |
| `Course` | Needs `hasCourseInstance` (mode, duration, schedule) and `offers` to be eligible for the Course rich result. | Missing both |
| `FAQPage` | Rich result now heavily restricted, but still parsed as structured content by AI systems. | Correctly used |

The governing principle from Google's own general guidance: *"The more recommended
properties that you provide, the higher quality the result is to users."* There is
no checklist to pass — completeness is the metric.

### 1.2 What actually drives AI citations (GEO)

This is where conventional wisdom is wrong, and where this site has spent effort
in the wrong place.

**`llms.txt` does not work.** Across a 90-day window monitoring ~500M AI bot
visits, only **408 requests** targeted `/llms.txt` at all. GPTBot, ClaudeBot,
PerplexityBot, OAI-SearchBot and Google-Extended overwhelmingly skip it and crawl
HTML directly. Google confirmed in July 2025 it does not support the file and has
no plans to; John Mueller compared it to the keywords meta tag. One citation model
trained on AI-citation data **improved when the `llms.txt` variable was removed** —
it added noise, not signal. No major provider has committed to it.

**AI citation is a different index from Google.** Only ~12% of URLs cited by AI
tools overlap with Google's top-10 organic results — **88% of AI citations come
from pages that do not rank on page one.** Ranking well and being cited are
substantially separate problems.

**Citation is extremely concentrated, and off-site.** The top 15 domains capture
~68% of consolidated AI citation share. Reddit alone is ~40%. Wikipedia is 47.9%
of ChatGPT's top-10 citations. Platform overlap is ~11% — being cited by ChatGPT
barely predicts being cited by Perplexity.

**Original data outperforms explainers.** Across all three major platforms,
proprietary research, case studies and pricing pages beat top-of-funnel "what is"
and "how to" content for AI-referred traffic.

**Entity verification is the mechanical core of 2026 E-E-A-T.** A `Person` node
with a rich, verifiable `sameAs` chain — Wikidata Q-ID carrying the highest
weight — is what resolves an author into a confident entity. Roughly half of
personal Knowledge Panels no longer depend on Wikipedia, so an individual
practitioner can now qualify without an encyclopedia entry.

### 1.3 The scoring rubric

Each dimension scored 0–5. **Weight** reflects impact for a personal site whose
goal is credibility and inbound consulting work — not traffic volume.

| # | Dimension | Weight | What a 5 looks like |
|---|---|---|---|
| 1 | Crawlability & indexation | 3 | Static HTML, clean canonicals, accurate sitemap, no crawl traps |
| 2 | Structured data correctness | 5 | Valid, resolvable, no conflicts, no dangling references |
| 3 | Entity strength | 5 | Rich Person node, deep `sameAs`, consistent naming everywhere |
| 4 | On-page semantics | 3 | One h1, real heading hierarchy, descriptive titles/descriptions |
| 5 | Content extractability | 4 | Answers reachable without reading the whole page |
| 6 | Freshness signals | 3 | `dateModified` real, sitemap `lastmod` complete |
| 7 | AI crawler access | 2 | Not blocked, not JS-gated, not paywalled |
| 8 | Off-site corroboration | 5 | Third-party mentions repeating the same facts |
| 9 | Performance / CWV | 2 | Fast, stable, light |
| 10 | Media & accessibility | 2 | Alt text, dimensions, lazy loading |

---

## 2. Scorecard

| # | Dimension | Wt | Score | Weighted | Notes |
|---|---|---:|---:|---:|---|
| 1 | Crawlability & indexation | 3 | 5 | 15 | Exemplary |
| 2 | Structured data correctness | 5 | 3 | 15 | Two real defects (§3.1, §3.2) |
| 3 | Entity strength | 5 | 2 | 10 | Thin Person node |
| 4 | On-page semantics | 3 | 4 | 12 | Thin descriptions, `#ai` titles |
| 5 | Content extractability | 4 | 2 | 8 | Narrative-first by design |
| 6 | Freshness signals | 3 | 4 | 12 | 21/32 URLs have `lastmod` |
| 7 | AI crawler access | 2 | 5 | 10 | Perfect |
| 8 | Off-site corroboration | 5 | 1 | 5 | Effectively nonexistent |
| 9 | Performance / CWV | 2 | 4 | 8 | One 49KB gzip bundle, sitewide |
| 10 | Media & accessibility | 2 | 5 | 10 | Clean |
| | **Total** | **34** | | **105 / 170** | **62%** |

Split out: **technical SEO ≈ 88%** (dims 1, 2, 4, 6, 7, 9, 10).
**GEO ≈ 33%** (dims 3, 5, 8). That asymmetry is the whole story.

---

## 3. Findings

Ordered by severity. Every item below was verified against built output in
`dist/client/`, not inferred from source.

### 3.1 🔴 `ProfilePage` URL collision — `/about/` claims to be the homepage

`profilePage()` in [src/lib/schema.ts](src/lib/schema.ts) hardcodes `url: SITE_URL`.
It is called from **both** [src/pages/index.astro](src/pages/index.astro) and
[src/pages/about.astro](src/pages/about.astro). Verified in the build:

```
index.html       → ProfilePage | url = https://www.janpaulfernandez.com
about/index.html → ProfilePage | url = https://www.janpaulfernandez.com
```

Two separate documents assert they are the `ProfilePage` for the same URL. That is
a contradictory signal at exactly the node Google uses to resolve the person.

It is also backwards. Per Google's own guidance an "About Me" page on a blog is
the canonical `ProfilePage`; the homepage here is a hub (recent writing, now-feed,
workshops teaser), not a profile.

**Fix:** give `profilePage()` a `url` parameter. Emit it on `/about/` only, with
`url: ${SITE_URL}/about/`. Keep `WebSite` + `Person` on the homepage. Add the
recommended `dateModified` and `name` while in there.

### 3.2 🔴 Dangling `author` reference — every article publishes an unnamed author

Article pages emit exactly two nodes: `Article` and `BreadcrumbList`. The author is:

```json
"author": { "@id": "https://janpaulfernandez.com/#person" }
```

Nothing on that page defines that `@id`. Google resolves structured data
per-document, so on all six article pages the author is a node with no `name`, no
`url`, no `sameAs` — which is precisely the disambiguation signal Google says is
"strongly encouraged."

The `@id` discipline itself is correct and worth keeping. The `@id` just needs to
resolve *locally* too.

**Fix:** include the full `person()` node in the `JsonLd` array in
[src/layouts/ArticleLayout.astro](src/layouts/ArticleLayout.astro). Same `@id`, so
the graph still collapses to one entity — it simply also resolves standalone.
Do the same on `/workshops/[slug]/` (`Course.provider`), `/work-with-me/`
(`Service.provider`) and `/gallery/[slug]/` (`ImageGallery.author`), all of which
have the same dangling reference.

### 3.3 🔴 The Person entity is a stub

This is the single highest-leverage item on the list, because §1.2 establishes
that the `Person` node with its `sameAs` chain *is* the mechanism of 2026 E-E-A-T.

Current node:

```json
{
  "jobTitle": "Tech Leader",
  "knowsAbout": ["Technology","Digital Transformation","AI Implementation","Economy","Psychology"],
  "sameAs": ["linkedin.com/in/jpaulfernandez/", "instagram.com/goofffball/"],
  "worksFor": { "@type": "EducationalOrganization", "name": "Mapúa Malayan Digital College (under MMCL)" },
  "alumniOf": { "@type": "EducationalOrganization", "name": "Nueva Ecija University of Science and Technology" }
}
```

Problems:

- **No `description`.** A one-to-two sentence substantive bio is a baseline
  recommended field and the thing an LLM quotes when asked "who is Paul Fernandez."
- **`jobTitle: "Tech Leader"` is vague and contradicts the site.** `llms.txt` and
  the About page both say *IT Manager at Mapúa Malayan Digital College*. §1.2:
  identical naming across every surface is what builds entity confidence;
  inconsistency actively erodes it.
- **`sameAs` has two entries, one of which is a personal Instagram.** No GitHub, no
  X, no Google Scholar, no Wikidata Q-ID. The Wikidata Q-ID is described as the
  highest-weight reference available because Wikidata is the canonical graph Google
  resolves knowledge panels against.
- **`worksFor` / `alumniOf` are bare name strings.** No `url`, no `sameAs`, no
  `@id`. These are unlinkable strings, not entity references — so the
  Rappler / PSBank / MMDC associations (Paul's actual credibility) never connect to
  anything in the graph.
- **`knowsAbout` is five generic nouns.** "Technology" and "Economy" carry almost no
  discriminating signal. This should name the specific things he is credible on:
  election-night technology operations, banking account-opening systems, AI literacy
  training, product discovery, requirements elicitation.

**Fix:** enrich `person()` with `description`, a corrected `jobTitle`, `address`
(`Country: Philippines` — he is positioned as a Philippines-based technologist and
nothing in the graph says so), specific `knowsAbout`, and expanded `sameAs`.
Give `worksFor` / `alumniOf` real `url`s. Separately: create a Wikidata item.

### 3.4 🟡 Course schema cannot produce a rich result

Workshop pages emit `Course` with `name`, `description`, `url`, `provider` — and
nothing else. Google's Course rich result needs `hasCourseInstance` (delivery mode,
duration, schedule) and `offers` (price, currency, availability).

The pricing already exists in prose — `llms.txt` states "from ₱2,500." It is simply
not in the structured data, so the four workshop pages are the most commercially
valuable URLs on the site and the least machine-legible.

**Fix — but see the correction below.** Add `hasCourseInstance` + `offers` to
`course()` in schema.ts.

> **Corrected 2026-09-20, after inspecting the collection.** Two things I got wrong
> above. First, this needs **no schema change** — `courses` already carries
> `duration` (`"2 hours"`), `formatLabel` and `formats[].price`, so it is a parser
> in `schema.ts` and nothing else; there is no keystatic/content parity risk.
> Second, and more important: `plan.md` records BIR registration, official receipts
> and MMDC employer clearance as still open, and **every price as an untested
> hypothesis**. Prices sit in prose today; `offers` makes them machine-readable and
> rich-result eligible. That is a business escalation, not an SEO fix. **Held in
> [T30](tasks/task-30-seo-entity.md) Part C, specified but not authorised.**
> Note also that `"from ₱2,500"` is a minimum, so the honest construct is
> `priceSpecification.minPrice`, not a flat `offers.price`.

### 3.5 🟡 Article `image` is the generated OG card, not the photograph

`ArticleLayout` sets `cover: /og/${post.id}.png` unconditionally, with the comment
that rich results need an image and not every post has a cover. Sound reasoning —
but two posts (`morty-without-the-crystal`, `if-ai-takes-all-the-jobs`) *do* have
real cover photographs with written `coverAlt`, and those are being overridden by a
1200×630 text card.

**Fix:** prefer the real cover when present, fall back to the OG card. One ternary.

### 3.6 🟡 Eleven URLs have no `lastmod` — including every commercial page

`contentLastmod()` only reads `src/content/thoughts` and `src/content/gallery`.
Verified missing: `/`, `/about/`, `/colophon/`, `/now/`, `/projects/`,
`/work-with-me/`, `/workshops/`, and all four `/workshops/*`.

The existing reasoning — "a build-time timestamp on every URL is a worse signal than
no timestamp" — is **correct and should be preserved.** But `/now/` and the
workshop pages have genuine content-owned dates (`src/content/now/*.md` carries
`date`; workshop JSON is versioned in git). Those are real signals being discarded.

**Fix:** extend `contentLastmod()` to the `now` and `courses` collections. Leave
`/about/`, `/colophon/`, `/projects/` bare — that judgment call was right.

### 3.7 🟡 Topic archive titles are slugs

```
<title>#ai — Paul Fernandez</title>
<title>#culture — Paul Fernandez</title>
```

`#ai` is not a phrase anyone types, and it is not a phrase an LLM matches against a
topical query. Nine pages affected.

**Fix:** `"AI — Writing by Paul Fernandez"`. Keep the `#ai` styling in the visible
h1 if it is a deliberate design choice; the `<title>` is a different surface.

### 3.8 🟡 Seven meta descriptions are too thin

| Page | Length |
|---|---|
| `/thanks/` | 36 (noindexed — fine) |
| `/workshops/ai-fluency/` | **48** |
| `/now/` | **54** |
| `/gallery/` | **60** |
| `/workshops/ai-for-business/` | **61** |
| `/workshops/vibe-coding/` | **66** |
| `/workshops/leadership-ai/` | **78** |
| `/colophon/` | 82 |

Under ~120 characters wastes the snippet and, more importantly, wastes the
`description` field that AI systems lift as the page's summary. The three workshop
pages under 70 characters are commercial pages.

**Fix:** rewrite to 140–160 characters. The article descriptions (129–148) are
already well-tuned — match that.

### 3.9 🟡 Content is not answer-first (and mostly should not be)

GEO orthodoxy says open every page with a 40–60 word extractable answer. **Applying
that here would wreck the site's voice**, which is its actual differentiator —
`voice.md` and the Phase 21/29 design history make clear this is a document, not a
funnel, and the memory note records that funnel-shaped output reads as AI slop.

So this is a genuine trade-off, not an oversight. The nuanced position:

- **Leave the personal essays alone.** *Jack and the Snack Culture*,
  *Morty Without the Crystal*, *If AI Takes All the Jobs* are narrative arguments.
  Their value is that they are not listicles. The `excerpt` field already provides an
  extractable summary and already lands in JSON-LD `description` — that is sufficient.
- **The two explainers are different.** *What Is a Token, Anyway?* and *A Quick Map
  on Large Language Models* are reference content answering real questions. These
  genuinely benefit from a definition paragraph near the top and from `<h2>`s phrased
  as questions. That is not a voice compromise — it is what an explainer should do.
- **`/work-with-me/` and `/workshops/` should be unambiguous.** Price, format,
  duration, location, and what is out of scope, stated plainly. §1.2: pricing pages
  and case studies are the highest-converting content type in AI search.

### 3.10 🟢 `llms.txt` — keep, but stop investing

Per §1.2 the evidence against it is strong: ~408 targeted fetches across 500M AI bot
visits, no provider commitment, no measurable citation lift, and one model that got
*better* when the variable was dropped.

The implementation here is genuinely good — `llms-full.txt` inlines the whole corpus
with a regex-based MDX stripper and no dependency, which is exactly the YAGNI ladder
working. It costs nothing to keep and it is already built.

**Recommendation: keep both, change nothing, add nothing.** Do not build a
`/llms.txt` variant per section, do not add markdown-alternate endpoints, do not
spend another hour here. The two `<link rel="alternate">` tags in `<head>` are fine.
This is a correct decision that simply turned out not to matter.

### 3.11 🟢 Empty `alt` on listing thumbnails — verify intent, probably correct

Post cover images in `/thoughts/` and the topic archives render `alt` with no value.
For a thumbnail sitting inside a link whose text is the post title, empty alt is the
*correct* accessibility choice — announcing it twice is worse.

Flagging only because `coverAlt` is authored in frontmatter and unused here. If that
is deliberate, it deserves a one-line comment so the next audit does not re-flag it.

### 3.12 🟢 Off-site presence — the actual ceiling

Nothing on this site can fix this, which is why it is last, but it is the
highest-weighted dimension at 5 and the lowest-scoring at 1.

§1.2: 88% of AI citations come from pages outside Google's top 10; the top 15
domains hold 68% of citation share; Reddit is ~40%; ChatGPT leans on Wikipedia for
nearly half its top-10 citations. For a personal entity, that means **corroboration
lives off-site.** Currently: two `sameAs` links, no Wikidata, no press, no GitHub in
the graph.

The good news from §1.2 — roughly half of personal Knowledge Panels no longer
require Wikipedia — means this is achievable for an individual practitioner.

---

## 4. Roadmap

### Phase A — correctness (half a day, high confidence)

1. Fix the `ProfilePage` URL collision — §3.1
2. Define `Person` locally on article, workshop, service and gallery pages — §3.2
3. Prefer real cover images over OG cards in `Article.image` — §3.5
4. Rewrite the seven thin meta descriptions — §3.8
5. Fix the nine topic archive `<title>`s — §3.7

All five are small, mechanical, and independently verifiable. `src/lib/schema.ts`
already has vitest coverage (`schema.test.ts`), so 1–3 are TDD per CLAUDE.md:
write the failing assertions first.

### Phase B — entity (a day, plus off-site time)

6. Enrich the `Person` node: `description`, corrected `jobTitle`, `address`,
   specific `knowsAbout`, expanded `sameAs`, linked `worksFor` / `alumniOf` — §3.3
7. Add `hasCourseInstance` + `offers` to `Course` — §3.4 (schema change: update
   `keystatic.config.ts` and `content.config.ts` together)
8. Extend sitemap `lastmod` to `now` and `courses` — §3.6
9. **Create a Wikidata item** and add the Q-ID to `sameAs` — §3.3. Highest-leverage
   single action available, and it is off-site.

### Phase C — content (ongoing)

10. Add definition-first openers to the two explainer posts only — §3.9
11. Make `/work-with-me/` and `/workshops/` state price, format and scope plainly — §3.9
12. Publish at least one piece of **original data** — §1.2 names this the
    highest-leverage content type on every platform. Paul has material nobody else
    has: election-night operations at Rappler across two national cycles, and
    outcome data from the AI workshops. A written case study with real numbers would
    outperform any amount of schema tuning.
13. Off-site corroboration — §3.12. Consistent naming on LinkedIn/GitHub, technical
    community participation, anything that repeats the same facts on a domain that
    is not this one.

### Explicitly not doing

- Anything further with `llms.txt` — §3.10
- Keyword-targeted content. The site's advantage is a specific voice; generic
  "what is AI" posts would compete against the entire internet and lose.
- Any v2 backlog item (search, backlinks, graveyard) — out of scope per CLAUDE.md.

---

## 5. What is already right

Worth recording so nobody "improves" it later:

- **Fully static, server-rendered.** Zero content behind JavaScript — the single
  most common GEO failure, absent here by construction.
- **Canonical discipline.** `trailingSlash: 'always'`, internal hrefs carry the
  slash, apex 308s to www, canonical matches. The link graph lands on the indexed URL.
- **Content-derived sitemap `lastmod`.** Real dates from real content, and the
  deliberate refusal to emit build timestamps is the correct call.
- **`robots.txt` names AI crawlers explicitly and the live file now serves clean.**
  GPTBot, ClaudeBot, PerplexityBot, Google-Extended all allowed. Worth recording
  *why* this scored 5/5: `plan.md` had logged a Critical blocker from 2026-09-04 —
  a Cloudflare managed block injected above these rules, plus
  `Content-Signal: ai-train=no`. I re-verified the served file and headers on
  2026-09-20 and **it is gone**: 200, repo content exactly, no `Content-Signal`, no
  `X-Robots-Tag`, apex 308s to www. That blocker is now marked resolved in the
  tracker. Had it still been live, dimension 7 would have scored 0 and the GEO
  grade would have been materially worse.
- **Eleven schema types.** `Person`, `WebSite`, `ProfilePage`, `Article`,
  `BlogPosting`, `Blog`, `BreadcrumbList`, `FAQPage`, `Course`, `Service`,
  `ImageGallery`, `CollectionPage`. Far beyond typical.
- **One `h1` per page, alt text everywhere, correct landmarks.** 34/34 pages.
- **The 60-character title logic** in `BaseLayout.astro` — dropping the site-name
  suffix rather than letting the headline truncate is a genuinely thoughtful detail.
- **The anchor-link comment in `astro.config.mjs`** — drawing the `#` glyph in CSS
  so extractors do not read "My Heading#". Exactly the right instinct.
- **RSS with full `content:encoded`.**
- **`/thanks/` noindexed *and* excluded from the sitemap**, with the contradiction
  reasoned about in a comment.

---

## 6. Sources

Google (authoritative):
- [General Structured Data Guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [ProfilePage structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [Course structured data](https://developers.google.com/search/docs/appearance/structured-data/course)
- [schema.org/Person](https://schema.org/Person)

GEO practice and evidence:
- [Mastering generative engine optimization in 2026 — Search Engine Land](https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142)
- [Generative engine optimization — Wikipedia](https://en.wikipedia.org/wiki/Generative_engine_optimization)
- [GEO Best Practices Checklist 2026 — Superlines](https://www.superlines.io/articles/generative-engine-optimization-best-practices-checklist)
- [llms.txt Zero Usage: Proof AI Bots Ignore It — aeoengine](https://aeoengine.ai/blog/llms-txt-zero-usage-ai-bots-ignore)
- [llms.txt in 2026: The Evidence Says It Does Nothing — 1ClickReport](https://www.1clickreport.com/blog/llms-txt-evidence-2026)
- [The State of AI Citations 2026 — 5WPR](https://www.5wpr.com/research/state-of-ai-citations-2026/)
- [Which Sites Do AI Engines Actually Cite? 2026 Index](https://everything-pr.com/ai-platform-citation-source-index-2026)
- [AI Search Ranking Factors 2026 — Attrifast](https://attrifast.com/blog/ai-search-ranking-factors-2026)
- [E-E-A-T in 2026: Author-Entity Verification](https://www.leadgen-economy.com/blog/eeat-author-entity-verification-ai-overviews/)
- [Person Schema for Knowledge Graph (2026) — Stackmatix](https://www.stackmatix.com/blog/person-schema-knowledge-graph)

Third-party GEO/SEO vendor sources are marketing content and were treated as
directional, not authoritative. Where a vendor claim conflicted with Google's
documentation, Google's documentation won. The `llms.txt` finding is included
because multiple independent analyses converge on it and Google has confirmed
non-support on the record.
