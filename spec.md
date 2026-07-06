# janpaulfernandez.com — Website Specification

**Owner:** Jan Paul Fernandez
**Version:** 1.0 — July 2026
**Status:** Approved for build

---

## 1. Purpose & Goals

1. **Personal brand** — a place for people to know who Paul is and what he's done.
2. **Publishing** — a home for his thoughts at the intersection of technology, economy, and psychology (expandable to other topics).
3. **Lead generation** — attract clients for consulting, development, talks/workshops, and AI implementation work.

**Success metrics (12 months):**

- 2+ published thoughts per month sustained
- Ranking/cited for "Jan Paul Fernandez" across Google and AI engines (ChatGPT, Perplexity, AI Overviews)
- 1+ qualified inquiry per month via the Work With Me page

---

## 2. Inspiration & Positioning

| Source | What we take |
|---|---|
| [maggieappleton.com](https://maggieappleton.com) | Digital-garden ethos: content types instead of a flat blog, growth stages, a Now page, personality-first IA |
| [understory.io](https://understory.io) | Bold display typography, confident whitespace, earthy warmth |
| [whitewidget.com](https://whitewidget.com) | Clean agency-style services presentation, PH-rooted credibility |
| [manychat.com](https://manychat.com) | Punchy hero copy, clear CTAs, playful accent color used sparingly |

Positioning statement (informs all copy): *Technologist from the Philippines who has shipped under pressure — banking, election-night newsrooms, national-scale education — now helping organizations transform digitally and adopt AI.*

---

## 3. Information Architecture

```
/                   Home
/about              About
/thoughts           Thoughts (index, filterable)
/thoughts/[slug]    Individual post
/topics/[topic]     Topic archive (technology, economy, psychology, …)
/now                Now (timeline)
/work-with-me       Services + contact
/rss.xml            RSS feed
/sitemap.xml        Sitemap
```

Global nav: Home · About · Thoughts · Now · Work with me
Footer: social links, email, RSS, colophon line ("Built with Astro + Keystatic"), © year.

### 3.1 Thoughts — content organization (decision)

**Decision: launch with two content types, not three, and add structure only when content demands it.**

- **Essays** — polished, opinionated longform. The SEO/GEO workhorses.
- **Notes** — brain dumps, half-formed ideas, links with commentary. Low friction so publishing never stalls.

**Idea Graveyard** is deferred: it's a great personality feature but needs a corpus of dead ideas to be worth a section. Revisit after ~15 published pieces; until then, a dead idea is just a Note tagged `graveyard`.

Two cross-cutting axes instead of more categories:

- **Topics** (tags): `technology`, `economy`, `psychology` — freely extendable.
- **Growth stage** (Maggie-style, optional per post): `seedling` → `budding` → `evergreen`. Signals "this may be unfinished" and permits publishing imperfect thinking.

The Thoughts index shows everything by default with filters for type, topic, and stage.

---

## 4. Design System

### 4.1 Color — moss, beige, citrus

| Token | Hex | Usage |
|---|---|---|
| `--color-moss-900` | `#1E2B20` | Headings, footer bg, near-black text |
| `--color-moss-700` | `#3B5240` | Primary brand, links, buttons |
| `--color-moss-500` | `#5F7D5C` | Hover states, secondary UI |
| `--color-moss-200` | `#CDD9C6` | Borders, dividers, subtle fills |
| `--color-beige-100` | `#F5F1E6` | Page background |
| `--color-beige-50` | `#FBF9F2` | Cards, elevated surfaces |
| `--color-ink` | `#26251F` | Body text (warm near-black) |
| `--color-citrus-500` | `#E8A13C` | Accent: CTAs, highlights, key-takeaway blocks |
| `--color-citrus-300` | `#F4C566` | Accent hover / tints |

Rules: beige is the canvas, moss does the work, citrus is scarce — CTAs, the Key Takeaway block, and one hero accent. Never citrus for body text. All text/background pairs must pass WCAG AA (4.5:1 body, 3:1 large text). Dark mode: v2, not launch.

### 4.2 Typography

- **Display / H1–H2:** Archivo Black (weight 400 only — it's a one-weight face). Tight tracking, generous size.
- **Body / UI / H3+:** **Lato** (decision: Lato over Poppins — better long-form readability; Poppins' geometric roundness fights Archivo Black's boldness).
- Scale (fluid, `clamp()`): H1 40–64px, H2 28–40px, H3 22–26px (Lato Bold), body 17–18px/1.7, small 14px.
- Self-host via `@fontsource` packages (no Google Fonts request — faster, no consent banner needed). `font-display: swap`, preload the two critical files.
- Reading measure: max 68ch for article body.

### 4.3 Layout & feel

- Max content width 1140px; article column ~720px.
- Airy sections (96–128px vertical rhythm on desktop), understory-style oversized headings.
- Soft organic touches: slightly rounded cards (8–12px), subtle grain or leaf-vein SVG motif allowed but optional.
- Motion: minimal — fade/rise on scroll for section entrances, respect `prefers-reduced-motion`.
- Mobile-first; nav collapses to a simple menu, no hamburger mega-menus.

---

## 5. Pages

### 5.1 Home

Section order (as agreed):

1. **Hero** — photo (crop from `image_3.webp`, moved to `src/assets/paul.webp`), Archivo Black headline, one-line subhead, primary CTA → Work with me, secondary → Thoughts.
   - Draft headline: **"I build technology that holds up when it matters."**
   - Draft subhead: "Tech leader from the Philippines — banking systems, election-night platforms, digital education. I write about technology, economy, and psychology, and help organizations transform."
   - (Copy is placeholder — refine during build.)
2. **Latest thoughts** — 3 most recent posts (title, type badge, topic tags, date, 1-line excerpt).
3. **Now snapshot** — 2–3 latest timeline entries + link to /now.
4. **Work with me teaser** — the four service areas as cards + "What I bring to the table" (3 proof points drawn from track record: led tech at national scale, shipped PHVote 2019, CMS migration w/ ontology) + CTA.
5. **Employment history** — compact vertical timeline (see §5.2 data) with logos/years; links to About for the full story.
6. **Footer CTA** — one-liner + email link.

### 5.2 About

Narrative first-person page: who Paul is, what he cares about (tech × economy × psychology), photo, then the full career story:

| Period | Role | Story beats |
|---|---|---|
| — | **BSIT, Nueva Ecija University of Science and Technology** | Where it started |
| ~3 yrs | **System Analyst, PSBank** | Accounts-opening solution, deployed to 3 branches |
| 5 mos | **RightCrowd** | Embedded security systems; Australian hours weren't for him — honest beat, keep it human |
| 2018– | **Rappler** | Joined at the height of the press-freedom attacks; rose to lead the tech team; **PHVote 2019** election-results tracking + canvassing coverage; as Head of Tech Operations led the Rappler CMS migration incl. ontology |
| Now | **Mapúa Malayan Digital College (under MMCL)** | Newly established school serving thousands of working students across the Philippines |

Ends with a soft CTA to /work-with-me and links to socials.

### 5.3 Thoughts

- Index: filter chips (type: Essay/Note; topic; stage), reverse-chron list, card shows type badge, title, excerpt, topics, date, reading time.
- Post page: title, meta (type, stage, topics, published + **updated** dates, reading time), optional TOC for essays (h2 anchors), body blocks (§6), author card at end (photo + bio + Work-with-me link), "Related thoughts" (same topic, max 3), prev/next.

### 5.4 Now

- Maggie-style reverse-chron timeline. Each entry: date (month + year), short markdown blurb, optional link/image.
- Page intro: one paragraph on what a Now page is + "last updated" date (feeds `dateModified`).
- Entries are a CMS collection, so updating Now takes 2 minutes — critical for it staying alive.

### 5.5 Work with me

1. Intro: who Paul helps and how.
2. **Four service cards:**
   - Digital Transformation Consulting — assess, roadmap, execute
   - Web & App Development — from banking-grade to newsroom-fast
   - Talks & Workshops — tech leadership, elections tech, digital education
   - AI Implementation — practical AI tool adoption inside companies
3. **What I bring to the table** — proof points tied to history (scale, pressure, cross-industry: finance, media, education).
4. **How it works** — simple 3-step engagement (Call → Proposal → Build), sets expectations.
5. **FAQ** (5–6 questions) — doubles as FAQPage schema for GEO.
6. **Contact** — since the site is fully static: a form via **Formspree free tier** (or Tally embed) posting to Paul's email, plus a plain `mailto:` and optional Cal.com booking link. No backend.

---

## 6. Article Building Blocks

Authored in Keystatic (MDX under the hood). Primitives:

- Headings (h2/h3 with auto-anchors), paragraphs, bold/italic, links
- Lists, blockquote, divider
- Images with caption + alt (processed by Astro `<Image>`: responsive, lazy, WebP/AVIF)
- Code blocks with syntax highlighting (Shiki, built into Astro)
- Tables

Custom blocks (Keystatic component blocks → Astro components):

- **Key Takeaway** — the signature block: citrus-accented card (left border + tinted bg, small "KEY TAKEAWAY" label in Archivo Black). Placeable anywhere; typically one near the top of essays (helps GEO extraction) and/or a closing summary.
- **Callout** — variants: note / idea / warning (moss-toned).
- **Pull quote** — oversized Archivo Black quote for essays.
- **Embed** — YouTube/generic iframe wrapper.

Deferred to v2: backlinks/hover previews (Maggie-style tooltips), footnotes/sidenotes.

---

## 7. SEO & GEO

### 7.1 Technical SEO

- Fully static output (`output: 'static'`) — everything server-rendered at build, zero JS-gated content.
- One `h1` per page, semantic heading hierarchy, semantic HTML5 landmarks.
- `@astrojs/sitemap` + `astro-robots-txt`; **robots.txt explicitly allows AI crawlers** (GPTBot, ClaudeBot, PerplexityBot, Google-Extended).
- Canonical URLs, Open Graph + Twitter cards; auto-generated OG images (satori/`astro-og-canvas`) with Archivo Black + moss/citrus branding.
- RSS full-content feed (`@astrojs/rss`) — also aids AI ingestion.
- Performance budget: Lighthouse ≥ 95 all categories; fonts self-hosted & preloaded; images optimized; near-zero JS by default (Astro islands only where needed).

### 7.2 Schema.org (JSON-LD)

| Page | Types |
|---|---|
| All pages | `WebSite` (with `publisher` → Person) + `BreadcrumbList` |
| Home + About | `ProfilePage` wrapping `Person` — name, image, `jobTitle`, `alumniOf` (NEUST), `worksFor` (MMDC), `knowsAbout` (technology, digital transformation, AI implementation, economy, psychology), `sameAs` (LinkedIn, GitHub, X, etc.) |
| Thoughts posts | `BlogPosting` (or `Article` for essays) — headline, description, `author` → Person, `datePublished`, **`dateModified`**, image, `keywords`, `wordCount` |
| Work with me | `Service` (one per offering) + `FAQPage` from the FAQ section |
| Now | `ProfilePage` with fresh `dateModified` |

Person entity is defined once (single `@id`, e.g. `https://janpaulfernandez.com/#person`) and referenced everywhere — consistent entity = better AI/knowledge-graph recognition.

### 7.3 GEO writing conventions (editorial rules, not code)

- Essays open with a 2–3 sentence extractable answer/summary in the first 200 words (the Key Takeaway block serves this).
- Descriptive, question-shaped H2s where natural.
- Keep `dateModified` honest — update posts and Now regularly; freshness within ~90 days gets priority for time-sensitive queries.
- Author credibility on every post (author card → About), verifiable credentials on About.

---

## 8. Stack & Architecture

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Astro 5** | Content-driven, islands architecture, best-in-class static output |
| CMS | **Keystatic** (git-based, free, MIT) | Admin UI at `/keystatic`; content committed to the repo via GitHub App; local mode for dev |
| Styling | **Tailwind CSS 4** | Design tokens from §4 as CSS variables/theme |
| Content | MDX + Keystatic component blocks | Type-safe via Astro content collections + Keystatic reader |
| Hosting | **Vercel** | Free tier, preview deploys per PR; Keystatic saves → commit → auto-rebuild |
| Forms | Formspree (or Tally) | Keeps the site fully static |
| Analytics | Plausible or Umami | Privacy-friendly, no cookie banner |
| Domain | janpaulfernandez.com → Vercel DNS/alias | Apex + www redirect |

### 8.1 Content collections (Keystatic config)

- `thoughts` — title, slug, type (essay/note), topics[], stage (seedling/budding/evergreen, optional), excerpt, cover?, publishedDate, updatedDate, draft flag, MDX body
- `now` — date, body (short md), link?
- `services` — title, description, icon, order, FAQ entries
- `career` — org, role, period, story (powers About table + Home timeline)
- `pages` (singletons) — home hero copy, about narrative, work-with-me intro, SEO defaults

This makes "update most, if not all, of the content" real: hero copy, timeline, services, and posts are all editable in the Keystatic UI without touching code.

### 8.2 Repo layout

```
/
├─ keystatic.config.ts
├─ astro.config.mjs
├─ src/
│  ├─ assets/paul.webp          ← moved from root image_3.webp
│  ├─ components/               (Hero, PostCard, KeyTakeaway, Callout, Timeline, …)
│  ├─ layouts/ (Base, Article)
│  ├─ content/ (thoughts/, now/, services/, career/, pages/)
│  ├─ pages/ (index, about, thoughts/, topics/, now, work-with-me, rss.xml)
│  └─ lib/schema.ts             (JSON-LD builders)
└─ public/ (favicon, robots.txt)
```

---

## 9. Build Roadmap

**Phase 1 — Foundation (week 1):** Astro + Tailwind + Keystatic scaffold, design tokens, fonts, Base layout, nav/footer, deploy pipeline to Vercel with domain.

**Phase 2 — Core pages (week 2):** Home, About, Now (+ collections), career timeline, JSON-LD Person/WebSite/ProfilePage.

**Phase 3 — Thoughts (week 3):** collections, index + filters, article layout, custom blocks (Key Takeaway, Callout, Pull quote), RSS, OG image generation, BlogPosting schema, 2–3 seed posts.

**Phase 4 — Work with me + polish (week 4):** services, FAQ (+ schema), form, accessibility pass, Lighthouse ≥ 95, submit sitemap to Search Console, launch.

**v2 backlog:** dark mode, Idea Graveyard, backlinks/hover previews, search (Pagefind), library/reading page, webmentions, newsletter.

---

## 10. Open items for Paul

- Social profile URLs for `sameAs` (LinkedIn, GitHub, X/Twitter, etc.)
- Preferred contact email for the form
- Exact PSBank/RightCrowd/Rappler dates for the timeline
- 2–3 topics for the first seed essays
