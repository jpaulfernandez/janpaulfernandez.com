# janpaulfernandez.com — spec (v3)

**Owner:** Jan Paul Fernandez · **Built:** October 2026 · **Decisions and rationale:** [rebuild-plan.md](rebuild-plan.md) · **Build record:** [docs/rebuild/](docs/rebuild/README.md)

This file says what the site is and what must stay true. It does not restate decisions: palette, type, page layouts, the offer and the gallery behaviour live in `rebuild-plan.md` (§3, §5) and are the reference when this file is silent. The v1 spec (July 2026) is in git history at tag `v2-final`.

## 1. Purpose

1. **Offer** — a site about what Paul does for organisations: three engagement modes (with you, for you, advising) focused on AI and service design, and the AI-Resilient Organisation workshop program.
2. **Proof** — the writing, the projects, the career timeline, the Now log and the photography show who is offering it.
3. **Discoverability** — be found and cited for "Jan Paul Fernandez" in Google and AI engines (JSON-LD graph, `llms.txt`, RSS, AI crawlers allowed in `robots.txt`).

Success metrics: 2+ published thoughts a month; 1+ qualified enquiry a month through Work with me; Lighthouse ≥ 95 in all four categories.

## 2. Pages

Seven pages: Home, About, Now, Projects, Work with me, Thoughts, Gallery. The full IA (program and tier pages, project and thought pages, topic archives, set pages, utility pages, redirects) is [rebuild-plan.md §4](rebuild-plan.md). Per-page content is §5 there.

## 3. Stack

| Layer | Choice |
|---|---|
| Framework | Astro 5, fully static output (`@astrojs/vercel` adapter; React only for the Keystatic admin) |
| Styling | Tailwind 4, tokens in the `@theme` block of `src/styles/global.css`; component CSS in `@layer components` |
| Type | Fraunces, Inter, JetBrains Mono, self-hosted via `@fontsource-variable/*` |
| CMS | Keystatic (git-based, admin at `/keystatic`); content is MDX/Markdown/JSON under `src/content/` |
| Hosting | Vercel; a push to `main` deploys production |
| Forms | Web3Forms, posting from `/work-with-me/#enquire` to `/thanks/` |
| Analytics | GA4 as-is (open decision, see plan.md Blocked-on-Paul) |
| Tests | vitest on pure logic in `src/lib/` |

## 4. Content model

Both `keystatic.config.ts` and `src/content.config.ts` must carry the same fields. Fields below are as in `src/content.config.ts`.

| Collection | Fields |
|---|---|
| `thoughts` | title, type (essay\|note), topics[], stage (seedling\|budding\|evergreen\|none, optional), excerpt (≤160), cover?, coverAlt?, publishedDate, updatedDate?, draft; MDX body with the four article blocks |
| `projects` | title, kind (product\|work\|talk\|side), year, period?, role?, summary, metaDescription?, link?, cover?, tags[], featured, order?; MDX body (optional: a project with a body gets its own page) |
| `program` (one JSON per tier) | label, title, tagline, audience, duration, leavesWith[], problem, happens[], outcomes, artefacts[], faq[{q,a}], order. No price field |
| `now` | title?, slug?, date, link?; Markdown body |
| `career` | org, role, period, order, logo?; Markdown body |
| `gallery` (one JSON per set) | title, publishedDate, cover?, description?, tags[], photos[{image, caption?, date?}] |
| `home` (singleton) | heroStatement, heroWho |
| `about` (singleton) | no fields; Markdown body |
| `workWithMe` (singleton) | modes[{name, line, whoFor, runsAs, priceSignal, anchor}], faq[{q,a}] |
| `programPage` (singleton, `program.json`) | headline, sub, promise, stats[{figure, claim, sponsor, sourceUrl}], steps[{name,line}], proofPoints[{label,text}], addOns[], bundles[{name, contents, whoFor, tiers[]}], foundingHeading, foundingIntro, foundingDiscount, foundingGive[], foundingTerms[] |
| `seo` (singleton) | defaultDescription, siteName |

`thoughts.stage` and the `seo` singleton are authored but not rendered (plan.md, Blocked-on-Paul). Collection name `programPage` exists because `program` is the tier collection.

## 5. Structured data and discovery

- JSON-LD only through the builders in `src/lib/schema.ts`. The Person `@id` is `https://janpaulfernandez.com/#person`, defined once and referenced everywhere.
- Per page: Home and About `ProfilePage` + `Person`; Thoughts articles `BlogPosting`; Work with me `Service` (modes) + `FAQPage`; program overview `Service`; tier pages `FAQPage`; project pages `WebPage` + `Person`; most pages add `BreadcrumbList`. No `Course` markup and no prices in any of it.
- Also shipped: sitemap (XML via `@astrojs/sitemap`, with content-owned `lastmod`), an HTML sitemap, full-content RSS, `llms.txt` and `llms-full.txt`, generated OG images (`/og/*`), canonical URLs with trailing slash.
- Retired `/workshops/*` URLs return 301 to the program or Work with me (`redirects` in `astro.config.mjs`).

## 6. Hard constraints

Violating any of these is a bug. The working detail is in [CLAUDE.md](CLAUDE.md).

- Fully static. React never reaches the public site.
- Client JS budget: 0 KB on Home, About, Now, Work with me, program pages and articles; ≤ 2 KB on the Thoughts and Projects indexes; ≤ 6 KB on the Gallery. The inline `.js` class script and the GA4 tag are the only other scripts. Nothing is hidden without the `.js` class, so every page reads with scripts blocked.
- The palette has nine tokens and no others; the type ramp has three tiers; a hairline is the only surface; no gradients, shadows or blurred chrome. See CLAUDE.md and rebuild-plan.md §3.
- One `h1` per page, semantic landmarks, WCAG AA contrast, visible keyboard focus.
- Copy follows [voice.md](voice.md). Every factual claim has a source URL. No peso figures on the site. "Aligned to PSF-AAI", never "certified".
- Content in `src/content/pages/about.md`, `src/content/now/`, `src/content/thoughts/` and `src/assets/thoughts/` is Paul's and is not edited by the build.
- Schema parity between Keystatic and Astro, one Person `@id`, YAGNI ladder before any dependency.

## 7. Out of scope

Search, backlinks and hover previews, the Idea Graveyard, a newsletter, webmentions, a booking widget beyond a link, testimonials (there are none yet), a light/dark toggle (the site is white), the Cloudflare Images migration for the gallery (blocked on credentials), and any published prices. The full list is [rebuild-plan.md §10](rebuild-plan.md).
