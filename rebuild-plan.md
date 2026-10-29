# janpaulfernandez.com v3 — rebuild plan

**Owner:** Jan Paul Fernandez · **Drafted:** 2026-10-29 · **Status:** approved by Paul 2026-10-29 (answers folded into §11); Phase 31 may start
**Supersedes, once approved:** `spec.md` (v1, July 2026) and the visual rules in `CLAUDE.md` that describe the Phase 20–29 dark build. `plan.md` stays the tracker; Phase 31 points here.
**Source material:** the AI-Resilient Organisation program spec (`~/Downloads/ai-program-spec/00–09`), the current repo, oddhalls.janpaulfernandez.com, and a Mobbin pass (references in §12).

---

## 1. Why rebuild, in one paragraph

The current site is a personal site that happens to have a workshops page. Paul now wants the inverse: a site about what he offers (consultation, building, advising, and a corporate AI-resilience program) with the writing, the timeline and the photography kept as proof of who is offering it. The pages are the seven Paul named; the content on About, Now and Thoughts is kept as-is; everything else — palette, type, layout, the Work-with-me offer, the Projects model, the Gallery — is rebuilt.

**What stays untouched (hard constraint from Paul):** `src/content/pages/about.md`, every entry in `src/content/now/`, every post in `src/content/thoughts/` and its assets, the custom article blocks (KeyTakeaway, Callout, PullQuote, Embed). Two lines in `about.md` are stale ("currently taking my Master's"; MMDC present tense) — flagged in §11, not edited.

**What also stays, because it works:** Astro 5 + Tailwind 4 + Keystatic + Vercel; the JSON-LD graph with the single Person `@id`; sitemap, robots, RSS, `llms.txt`, OG-image route; the `src/lib/*` helpers and their vitest tests; the Web3Forms contact form; the build-time image pipeline.

---

## 2. Decisions

### 2.1 Locked (from Paul's brief)

| # | Decision |
|---|---|
| D1 | Seven pages: Home, About, Now, Projects, Work with me, Thoughts, Gallery. |
| D2 | Brand = Oddhalls palette with **red primary, blue secondary, white base**. |
| D3 | Work with me offers three engagement modes (with you / for you / advising) focused on **AI and service design**, plus the **AI-Resilient Organisation** workshop program. |
| D4 | Gallery = one flat, date-sorted photo library, newest first, with zoom in/out, like iOS Photos. |
| D5 | Thoughts keeps its current structure (essay/note, topics, stage, filters, article layout). |

### 2.2 Recommended — **all approved by Paul, 2026-10-29**

| # | Decision | Why |
|---|---|---|
| R1 | **Drop GSAP and `motion.ts`.** Back to zero client JS by default; three small vanilla scripts only (Thoughts filters, Projects filter, Gallery zoom + lightbox). | 49 KB gzip on every page for scroll reveals that a white, document-like site does not need. The `.js`-guard rule survives for the gallery script. |
| R2 | **Adopt the Oddhalls type trio**: Fraunces (display), Inter (body/UI), JetBrains Mono (kickers, dates, code). Self-hosted via `@fontsource-variable/*`. | The brand is "the Oddhalls colours"; borrowing its type makes the two sites read as one person's. Switzer + Courier Prime files are removed. |
| R3 | **Blue is a ground, not a type colour.** Cool-blue tints and hairlines only; no blue text at launch. | Oddhalls has no dark blue; inventing one adds a fourth voice. Red + cherry carry everything. |
| R4 | **Retire the four per-person course pages** (`/workshops/*`). Tier 2 of the program supersedes AI Fluency; Tier 1 supersedes Leadership AI; AI-for-business becomes the advisory mode; vibe coding goes to a one-line "I also do 1-on-1 sessions — ask" on Work with me. Course files stay in git history. | One offer page with one program is clearer than two overlapping catalogues at two price scales (₱2,500 vs ₱65,000+). |
| R5 | **Program gets its own page + one page per tier**, under `/work-with-me/ai-resilient-organisation/`. **Prices are not published** — every tier, add-on and bundle reads "Enquire" (Paul's call, 2026-10-29); the price tables in doc 09 stay in the proposal template, not on the site. | The program copy is already written (doc 09). Tier pages carry the FAQs that double as FAQPage schema. |
| R6 | **Projects becomes a typed collection**: kind ∈ product · work · talk · side. Index is a year-grouped ruled list with a kind filter; a project may have a long-form MDX case study (Oddhalls keeps its page). | Paul asked for "past work, talks, topics, side projects" in one place. |
| R7 | **New file is `rebuild-plan.md`; `plan.md` gets a Phase 31 pointer**; task files are written per phase when Paul says go, not now. | Keeps the tracker truthful without writing twenty task files for an unapproved plan. |
| R8 | **GA4 stays until Paul decides** (it is a plan.md blocked item already). | Not a rebuild question. |

---

## 3. Brand

### 3.1 Colour tokens (measured on `#FFFFFF`)

| Token | Hex | Contrast on white | Use |
|---|---|---|---|
| `--red-500` | `#FF5C34` (Oddhalls tangerine) | 3.07:1 | **Primary.** Fills (buttons, the selected filter chip, the Now rail dot), display headline words ≥ 24px, rules and markers. **Never body-size text, never white text on it.** |
| `--red-700` | `#A4402F` (Oddhalls light-mode `accent-strong`) | 6.26:1 | Inline links, small accent text, focus ring, link underline. |
| `--blue-100` | `#D7EFFF` (Oddhalls cool-blue) | — (ground) | **Secondary.** Tinted panels: the program band on Home, the KeyTakeaway block, the "founding client" box, `<code>`/`kbd` backgrounds. |
| `--blue-200` | `#BAC9D8` (Oddhalls light hairline) | 1.69:1 (non-text) | Hairlines, table rules, input borders. |
| `--ink-900` | `#351E28` (Oddhalls cherry) | 15.35:1 | Headings, body, nav, button text on red (5.0:1 ✓). |
| `--ink-600` | `#594C57` (Oddhalls light `ink-muted`) | 8.09:1 | Secondary reading copy: subtext, lead paragraphs, FAQ answers. |
| `--ink-400` | `#6B6470` | 5.71:1 | **Metadata only**: dates, counters, kickers. (Oddhalls' `#8A8D9A` fails at 3.3:1 and does not ship.) |
| `--paper` | `#FFFFFF` | — | Page ground. |
| `--paper-100` | `#F7F8FA` | — | Alternate section ground, used at most once per page. |

Rules carried over from the current build and still right: a hairline is the only surface (1px `--blue-200`, no fills beyond the blue tint, radius ≤ 4px, no shadows, no `backdrop-filter`, no gradients, no glows); one `h1` per page; WCAG AA everywhere; no pure black (`--ink-900` is the darkest value). Red-on-white is scarce — if a screen has more than one red fill above the fold, one of them is wrong.

### 3.2 Type

| Role | Face | Notes |
|---|---|---|
| Display / h1 / h2 | **Fraunces** variable, optical size on, weight 450–600, `-0.02em` tracking | The one expressive element. Display runs `clamp(2.6rem, 1.7rem + 4.6vw, 6rem)` as on Oddhalls. |
| Body / h3 / UI | **Inter** variable, 17px/1.6 body, measure 38rem (≈ 68ch) | |
| Kicker / date / counter / code | **JetBrains Mono** variable, 12–13px, `0.14em` tracking, uppercase for kickers | Replaces Courier Prime's job one-for-one. |

Scale: the Oddhalls `--step--2 … --step-5` clamp ladder, copied verbatim (it is already tuned). Spacing: the Oddhalls `--space-3xs … --space-3xl` ladder.

### 3.3 Feel

Document, not funnel (Paul's standing note). White page, cherry type, red used like a highlighter — the one word in a headline, the one button, the one rule that marks a turn. Tables and ruled lists over cards. Photography does the visual work on Home, About and Gallery; nothing else decorates. The two Mobbin references that match this best are COLLINS' ruled "Programs" list and OpenAI's year-grouped index (§12).

---

## 4. Information architecture

```
/                                   Home
/about/                             About (content retained)
/now/                               Now (content retained)
/projects/                          Projects index (kinds: product · work · talk · side)
/projects/[slug]/                   Project page (short, or long-form MDX case study)
/work-with-me/                      The offer: three modes + the program + contact
/work-with-me/ai-resilient-organisation/            Program overview, bundles, founding offer
/work-with-me/ai-resilient-organisation/[tier]/     pulse · leadership-day · fluency · champions · agent-sprint
/thoughts/, /thoughts/[slug]/, /topics/[topic]/     unchanged
/gallery/                           One photo library
/gallery/[slug]/                    Set page (kept; linked from the lightbox caption)
/colophon/, /thanks/, /404, /sitemap/, rss.xml, llms.txt, llms-full.txt, /og/*   kept
```

**Nav (desktop, left to right):** Work with me · Projects · Thoughts · Gallery · About · Now, wordmark on the left, "Book a scoping call" as the one red button on the right. Mobile: `<details>` sheet, no JS. Seven links is the ceiling; Home is the wordmark.

**Footer:** email, LinkedIn, GitHub, Instagram, RSS · Sitemap · Colophon · © year. Plus the one-line Person summary that feeds the JSON-LD.

**Redirects (astro.config `redirects`, 301):** `/workshops/` → `/work-with-me/ai-resilient-organisation/`; `/workshops/ai-fluency/` → `…/fluency/`; `/workshops/leadership-ai/` → `…/leadership-day/`; `/workshops/ai-for-business/` → `/work-with-me/#advise`; `/workshops/vibe-coding/` → `/work-with-me/`.

---

## 5. Pages

### 5.1 Home

Order, top to bottom. Every section is either `.section` + rule (a new argument) or `.section-tight` (continues the one before) — decide per section, never default to ruled.

1. **Hero** — portrait (`src/assets/paul.webp`, new crop) on the left third; on the right, a Fraunces statement of what Paul does *for* people, then one line of who. Two actions: red "Work with me" button, text link "See the program". The current `heroIntro` bio moves to About's top (its content is already there in longer form) — Home stops being a biography.
   Draft (house voice; refine in build): *"I help organisations decide what to build with AI, then build it with them — or for them."* / *"Eleven years shipping under pressure: a bank, two election nights at Rappler, a college of working students. Based in Manila; working in Metro Manila, Clark, Cebu and online."*
2. **Three ways to work** (ruled list, not cards): With you · For you · Advising — one line each, link to the section on Work with me.
3. **The program band** (blue tint, the only tinted block on the page): "AI-Resilient Organisation" — tagline, the six-step strip (Pulse → Leadership day → Fluency → Champions → Agent sprint → 30/60/90), one sentence, link.
4. **Recent projects** — the three newest entries from the `projects` collection, automatic (Paul hasn't picked a curated three; a `featured` flag can override later), year · kind · one line.
5. **Latest thoughts** — three `PostListItem`s, unchanged component re-skinned.
6. **Now, briefly** — the three latest Now entries beside a "Now" link (the current rail, re-skinned).
7. **Closing CTA** — one sentence + email + the red button. No "latest photos" strip; the gallery is a destination, not a teaser.

JSON-LD: WebSite + ProfilePage/Person (unchanged builders).

### 5.2 About

`about.md` rendered verbatim as prose, portrait, then the career timeline from the `career` collection (unchanged data), then a short "How I work" block (three lines: simplify then do; artefacts leave the room; vendor-neutral — lifted from doc 09 §4), then a soft link to Work with me. Keep ProfilePage schema and `sameAs`.

### 5.3 Now

Unchanged content and timeline behaviour; re-skinned (mono dates in `--ink-400`, cherry body, red dot on the newest). `dateModified` keeps feeding from the newest entry.

### 5.4 Projects

**Index:** intro line, a kind filter (All · Products · Work · Talks · Side projects — vanilla JS, ~30 lines, same pattern as Thoughts), then a year-grouped ruled list: year in mono on the left, rows of *title · kind · one line · →* on the right (OpenAI-index pattern). Rows with a `body` link to `/projects/[slug]/`; rows without link out (`link`) or are inert.

**Project page:** kicker (kind · year · role), h1, summary, meta facts table (optional), MDX body with the article blocks, "Related" (same kind, ≤3). The Oddhalls case study's hard-coded content in `src/pages/projects/[slug].astro` moves into `src/content/projects/oddhalls.mdx` so the page template is generic.

**Seed entries** (Paul confirms the list; placeholders where I'm guessing):
- Oddhalls — product, 2026 (existing case study)
- Eyelicium — side, 2026 (thumbnail evaluator; from Now)
- Anakloud — work, 2026 (capstone tech lead; from Now)
- AIM capstone — work, 2025–26 (Paul to name it)
- PHVote 2019 and 2022 — work (Rappler)
- Rappler CMS migration + ontology / knowledge graph — work
- PSBank account-opening system — work, 2015–18
- Talks — the `talk` kind exists in the schema but ships with **no entries** (Paul: no talks list for now)

### 5.5 Work with me

One page, four sections, each ruled. (A "Topics I speak on" section was considered and dropped: Paul has no talks list yet; add it when there is one.)

1. **Head** — "Work with me", then the fit statement: AI and service design for Philippine organisations; what Paul will not do (write your production code alone, certify your policy, sell you a tool).
2. **Three ways in** — ruled rows (COLLINS-style), each with name, one line, *who it's for*, *how it runs*, *price signal*, link to `#enquire` with the mode preset. Working names (not product names; Paul's own words were "do it with me / I'll do it for you / do it, I'll advise"):

   | Mode | One line | Runs as | Price signal |
   |---|---|---|---|
   | **With you** | We build it together: I join your team as the product owner / service designer for a defined piece of work. | Fractional, 1–3 days a week, 4–12 weeks; sprints with your people on your processes. | Message for a quote |
   | **For you** | I build it: a prototype, an internal tool, an agent on one process, a website. Shipped, documented, handed over. | Fixed scope, fixed price, 2–8 weeks. Client owns the code. | Message for a quote |
   | **Advising** | You build it, I check your work: a scoping session, a monthly hour, a second opinion before you sign a vendor. | 2-hour working session (the existing AI-for-business format), or a monthly retainer. | Message for a quote |

3. **The program** — AI-Resilient Organisation: tagline, the strip, the five-tier table (promise · for · duration · "Enquire") from doc 09 §2, link to the program page. This is the only block on the page with a blue tint.
4. **Enquire** — the Web3Forms form (name, email, organisation, "interested in" preset by the row clicked, message), `mailto:` beside it, the three-step "what happens next" (call → one-page proposal in two working days → start). FAQ (6 items, FAQPage schema) under it.

JSON-LD: `Service` ×3 + `Service` for the program + `FAQPage` + Person.

### 5.6 The program pages

**`/work-with-me/ai-resilient-organisation/`** — copy from doc 09 §1–2 and §5, in this order: headline ("Your people are already using AI. Make it safe, then make it useful."), sub-headline, the problem (three sourced figures, each with its URL in a footnote — doc 07 D-01, D-02, D-06, D-09; name the sponsor as doc 07 §1.1 requires), the promise, how it works (the strip with the artefact under each step), the five-tier table (no prices; "Enquire" column), add-ons line, bundles table (contents and who-for only, no figures), founding-client offer (blue tint box: "25% off any bundle, first three clients", the four "what you give" items, terms — no price table), three proof points about the facilitator, CTA "Book a 20-minute scoping call" → `#enquire` on Work with me (the form; no Cal.com).

**Tier pages** (one each: `pulse`, `leadership-day`, `fluency` (Tier 2 + 2.5 together, as doc 04 pairs them), `champions` optional split, `agent-sprint`) — copy from doc 09 §3: the problem, what happens (the bulleted vignettes), outcomes, artefacts, FAQ (FAQPage schema), "Enquire for pricing", "part of" bundle links, CTA. Any FAQ answer in doc 09 that quotes a peso figure is rewritten without it. A tier page is ~600 words; no run-of-show tables on the site (those are delivery documents).

**Content model:** a `program` collection, one JSON per tier (`title, tagline, audience, duration, leavesWith[], problem, happens[], outcomes, artefacts[], faq[], order` (no price field)) plus a `program.json` singleton for the overview (headline, sub, stats[] with sourceUrl, bundles[] without prices, founding offer). All Keystatic-editable; schemas mirrored in `keystatic.config.ts` and `src/content.config.ts` in the same commit.

**Copy rules on these pages:** doc 00 §Style rules apply on top of `voice.md` — no "leverage/unlock/empower", say "aligned to PSF-AAI" never "certified", say "not legal advice" out loud on Tier 1, name survey sponsors. **Location:** the spec's "based in Angeles City / Clark" line is wrong for the site — Paul is based in Manila. Delivery areas (Metro Manila, Clark/Pampanga, Cebu, online) are fine to keep.

### 5.7 Thoughts

Index, filters, topic archives, article layout, blocks, RSS, OG — all kept. Re-skin: KeyTakeaway becomes a blue-tint panel with a red left rule and a mono "KEY TAKEAWAY" kicker; PullQuote in Fraunces italic; Callout keeps its three variants on hairlines. Reading column 38rem; covers full-bleed to the shell.

### 5.8 Gallery — the iOS-Photos library

**Behaviour**

- One page, one grid, every photo from every set, **sorted newest first** by `photo.date ?? set.publishedDate`.
- **Square thumbnails** in a uniform grid (Apple Photos' default "Square" view), 2px gaps, no captions in the grid. An "Aspect ratio" toggle is *not* built (YAGNI; the set page still shows frames in full).
- **Zoom levels** change the column count: phone 3 → 5 → 7 (default 3); tablet/desktop 4 → 6 → 8 → 12 (default 6). Controls: **pinch** on touch (two-pointer distance via Pointer Events, ~40 lines), **⌘/Ctrl + wheel** and **− / +** buttons in a small mono control at the top-right, keyboard `-`/`=`. Level persists in `localStorage` behind try/catch. Implementation is one CSS custom property (`--cols`) on the grid; the script only changes that number. Images are served with `sizes` tuned so the 12-column level doesn't fetch 800px files.
- **Tap a photo** → full-screen viewer (`<dialog>`, kept from `Lightbox.astro`): swipe/arrow to move, caption + "from *Set name* →" link, close on Esc/backdrop. **Pinch-zoom inside the viewer** scales the image with `transform` (same pointer math reused), double-tap toggles 2×; `touch-action: none` on the stage only so page zoom stays available elsewhere.
- **Month separators** (mono, `--ink-400`) between groups when scrolled at the two densest levels are *not* built at launch; add if the wall passes ~300 photos.
- Motion: none. Loading: `loading="lazy"` with `decoding="async"`; first two rows eager.
- With JS blocked: the grid renders at the default density and each thumbnail is a plain link to the set page — fully usable.

**Data changes:** add optional `date` (YYYY-MM-DD) per photo in the gallery schema (Keystatic + content config together) so a set shot across days sorts honestly; the 95 existing shots keep the set-date fallback (the four sets were each shot on one day, so it is already accurate) and the field is for new shots; `featured` and `licensingAvailable` fields are deleted (never rendered — already a plan.md item). The build-time masonry packer in `src/lib/gallery.ts` is removed with its test; a `libraryOrder()` helper (sort + flatten) replaces it, tested first.

**Storage:** the 68 MB `src/assets/gallery` stays in the repo for now; the Cloudflare Images migration remains a plan.md blocked item and is not part of this rebuild.

---

## 6. Content model changes (both schema files, same commit)

| Collection | Change |
|---|---|
| `projects` | **Replace.** `title, kind (product|work|talk|side), year, period?, role?, summary, link?, cover?, tags[], featured, order?` + MDX body. Oddhalls' page content migrates into `oddhalls.mdx`. |
| `program` (new) | One JSON per tier, fields in §5.6. |
| `pages/program.json` (new singleton) | Overview copy, stats with sources, bundles, founding offer. |
| `pages/workWithMe.md` | Keep the singleton; add `modes[]` (name, line, whoFor, runsAs, priceSignal, anchor) and `topics[]`. |
| `pages/home.json` | Replace `heroGreeting/heroIntro` with `heroStatement, heroWho, selectedProjects[]`. |
| `gallery` | `photos[].date?` added; `featured`, `licensingAvailable` removed. |
| `services` | **Delete** (replaced by `modes[]`); `courses` **delete** (R4). |
| `now`, `career`, `about`, `thoughts`, `seo` | Unchanged. |

---

## 7. Tech decisions

- **Stack unchanged:** Astro 5, Tailwind 4, Keystatic (GitHub mode), Vercel static. React stays admin-only.
- **Client JS budget:** 0 KB on Home, About, Now, Work with me, program pages, article pages. ≤ 2 KB each on Thoughts index and Projects index (filters). ≤ 6 KB on Gallery (density + viewer). `motion.ts`, GSAP and the `data-reveal` vocabulary are deleted (R1).
- **Fonts:** `@fontsource-variable/fraunces`, `@fontsource-variable/inter`, `@fontsource-variable/jetbrains-mono`; preload the two body/display files; Switzer and Courier Prime files and packages removed.
- **CSS:** `global.css` is rewritten from the tokens in §3 — `@theme` block, `@layer components` for `.shell, .section, .section-ruled, .section-tight, .rows/.row-link, .kicker, .mono, .btn, .btn-primary, .link, .panel-tint, .prose, .faq, .field`. Nothing unlayered. Component `<style>` blocks hide with media queries, never `lg:hidden` against a scoped rule.
- **Forms:** Web3Forms kept, and it is the scoping-call mechanism (no Cal.com); the "interested in" select gains the three modes + program tiers.
- **OG images:** `src/pages/og/[...route].ts` re-themed (white ground, cherry type, red rule, Fraunces).
- **SEO/GEO:** every current structured-data builder kept; new `Service` entries for the modes; `Course`-type markup for tiers is **not** added (plan.md C1 is on hold for the same reason). `llms.txt` gains the Work-with-me and program sections.
- **Analytics:** GA4 as-is (R8).

---

## 8. Build order (phases are vertical slices; each ends deployable)

The implementation plan — one file per phase with tasks and a Definition of Done — is in [docs/rebuild/](docs/rebuild/README.md) (written 2026-10-29; it runs Projects before Home/About/Now and lists its other departures from this file). Housekeeping first: the uncommitted T30 diff (`astro.config.mjs`, `robots.txt`, `BaseLayout.astro`, `og/[...route].ts`, `sitemap.astro`) is committed or stashed before Phase 31 touches those files.

| Phase | Slice delivered | Scope |
|---|---|---|
| **31 — Foundation** | New brand live on every existing page, nothing else changed. | Tokens, fonts, `global.css` rewrite, BaseLayout (nav, footer, head), OG route re-theme, GSAP removed, `.js` guard kept. DoD: build/check/tests pass; every page AA (axe); 0 KB JS on article pages; Paul's visual review. |
| **32 — Work with me + program** | The offer is live. | `workWithMe` fields, `program` collection + singleton, the page, overview page, tier pages, redirects from `/workshops/*`, Service/FAQPage schema, form presets, `llms.txt`. Courses/services collections deleted. DoD: all program copy traceable to doc 09; every stat has a URL; redirects return 301; FAQPage validates. |
| **33 — Home + About + Now** | The front door matches the offer. | New `home.json` fields, hero, sections in §5.1; About with timeline and "how I work"; Now re-skin. About/Now content byte-identical to today. |
| **34 — Projects** | A real portfolio. | New schema, Oddhalls migration to MDX, index with filter, seed entries (placeholders where Paul hasn't confirmed), project template. `src/lib/projects.ts` tests updated first. |
| **35 — Gallery** | The photo library. | Schema change, `libraryOrder()` + tests, grid + density control, viewer with pinch-zoom, set pages re-skinned, masonry packer removed. DoD in §5.8; tested on iOS Safari and Android Chrome, not just desktop. |
| **36 — Thoughts re-skin + launch** | Everything consistent; launch. | Block re-skins, index/article polish, Lighthouse ≥ 95 ×4 on five representative URLs, Search Console sitemap resubmit, `spec.md`/`CLAUDE.md` updated to describe the v3 rules, memory note. |

Estimated size: 31 and 35 are the big ones (a full CSS rewrite; a touch-tested interaction). 32 is copy-heavy but the copy exists. 33, 34, 36 are a day each.

---

## 9. Definition of done for the whole rebuild

- All seven pages live; About, Now, Thoughts content identical to the pre-rebuild commit (diff the content directories: empty).
- No `#000`, no `#fff` type on red, no text below 4.5:1; red fills carry cherry text only.
- `npm run build`, `npx astro check`, `npm test` green; Lighthouse ≥ 95 in all four categories on `/`, `/work-with-me/`, `/work-with-me/ai-resilient-organisation/`, a thought, `/gallery/`.
- Gallery pinch and viewer verified on a real phone.
- `/workshops/*` 301s; no 404s in Search Console for old URLs after a week.
- `spec.md`, `CLAUDE.md` and `voice.md` describe the site that exists.

---

## 10. Out of scope (do not build while in there)

Search, backlinks, graveyard, newsletter, dark mode (still none; the site is white, full stop), a booking widget beyond a link, a CMS for the program's delivery documents (run-of-shows stay in the spec folder), Cloudflare Images migration, light/dark toggle, map/location block, testimonials section (there are none yet — the founding-client offer exists to produce them).

---

## 11. Open items — resolved by Paul, 2026-10-29

| # | Item | Answer | Where it landed |
|---|---|---|---|
| 1 | Prices for the three modes | "Message for a quote" on all three | §5.5 table |
| 2 | Talks list and speaking topics | None for now | "Topics" section dropped from Work with me; `talk` kind kept in schema, no entries |
| 3 | Three selected projects on Home | No pick yet | Home shows the three newest projects automatically |
| 4 | Stale lines in `about.md` | Leave until graduation in December 2026 | Unchanged; revisit then |
| 5 | Location line | Based in Manila (the Pampanga line came from the program spec, doc 00, and does not apply) | Hero draft and §5.6 copy rule |
| 6 | Program prices | On enquiry | R5, §5.6: no peso figures anywhere on the site |
| 7 | Scoping-call mechanism | The form | §5.6 CTA, §7 Forms |
| 8 | R1 drop GSAP · R2 Oddhalls fonts · R4 retire courses | Approved | §2.2 |
| 9 | Portrait | Recrop the existing `paul.webp` | §5.1 |
| 10 | Per-photo dates | Set-date fallback is fine for the existing 95; field used for new shots | §5.8 |

Still pending from plan.md, unchanged by this plan: BIR registration before the first corporate invoice, MMDC clearance, GA4 decision, Cloudflare Images migration.

---

## 12. Mobbin references consulted

Patterns taken, with the link so the build can look again:

- Ruled "programs" list, name + one line, no cards — [COLLINS](https://mobbin.com/sites/sections/07fc5573-f47f-4232-863a-997f6a5b4472) → Work with me §5.5 rows.
- Year-grouped index with mono years on the left — [OpenAI](https://mobbin.com/sites/sections/1e4d6891-db02-4b62-8ae8-8addb56aa87e) → Projects index.
- Three-column text-only project table — [Locomotive](https://mobbin.com/sites/sections/280c1a2d-41d4-4495-a4bd-816763c93ad3) → Projects index fallback at narrow widths.
- Big word + description + sub-list per offering — [Instrument](https://mobbin.com/sites/sections/d0850530-6f9d-4590-83bc-baa018680be2) → the three-mode rows' expanded state on desktop.
- Numbered service with `<details>` sub-items — [YLLW](https://mobbin.com/sites/sections/c838e6c7-2e50-40c5-8b29-f61445fd5bc0) → tier list on the program page.
- Tiered program with criteria/benefits columns — [Cloudflare](https://mobbin.com/sites/sections/01d9761d-3fbd-461e-9e25-306380dde88d), [Apollo](https://mobbin.com/sites/sections/a6b2ed95-96c1-45b8-9928-b8d2a850bd3a) → bundles table (as a table, not cards).
- Founding-customer discount shown beside list price — [Humble](https://mobbin.com/sites/sections/e9df3537-2b5d-4399-883b-f916424c6e3d) → founding-client box.
- Library grid, sort by date captured, zoom in/out in View Options — [Apple Photos](https://mobbin.com/screens/b83829a3-4ce6-4755-b53e-165252dd54e4) → Gallery §5.8.

Rejected on sight: card grids with illustrations (Intercom, Maze, Glide), gradient or glow heroes (Contra, Craft), pill navs (Trawelt) — all read as SaaS, which Paul has ruled out.
