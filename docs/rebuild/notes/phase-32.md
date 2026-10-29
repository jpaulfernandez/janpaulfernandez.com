# Phase 32 — working notes

Records the phase file asks to put "in the PR". Work is on `main` (no PR, per
Paul's override), so they live here.

## 32.1 Schemas

- `program` collection (Astro + Keystatic "Program tiers"): `label, title,
  tagline, audience, duration, leavesWith[], problem, happens[], outcomes,
  artefacts[], faq[{q,a}], order`. No price field. `label` is an addition to
  rebuild-plan §5.6's list (kickers and tables need "Tier 2.5").
- `programPage` singleton (Astro collection `programPage`, entry id `program`;
  Keystatic singleton `programPage`; file `src/content/pages/program.json`).
  Additions beyond §5.6: `promise`, `steps[]`, `proofPoints[]`, `addOns[]`,
  `bundles[].tiers`.
- `workWithMe` gains `modes[]` and `faq[]` (`faq` is an addition). The Astro
  schema requires both, so the file now has a frontmatter block (it had none).
- Drift: `workWithMe.md` had no frontmatter before this task.
- Keystatic's reader returns `null` for the `workWithMe` and `about` singletons
  (`.md` file + `format.contentField`) — pre-existing, identical for `about`; not
  changed here. Collection and `programPage` read fine.

## 32.2 Copy entry

**Tier set.** Champions kept as its own page (fold test passed: ~560 words of
non-repeating copy from doc 09 Tier 2.5 + doc 04 Part B). Five slugs.

**Choices that differ from the source** (conservative, flagged for Paul):
- Clock times from doc 09's Tier 1 vignette ("9:35 am", "1:30 pm" ...) removed;
  run-of-show times stay in the spec folder.
- Founding discount keeps "25%"; the price table is not copied. Terms text is
  the spec's, unconfirmed (see Blocked in plan.md).
- Add-ons: names only. The "credited against Tier 1 within 60 days" credit and
  every peso figure were dropped. "Travel outside Luzon at cost" dropped.
- Tier 3 FAQ "A tested no-go for P220,000 costs less than..." rewritten without
  the figure. All "[Name]" replaced by first person.
- The AWS source's report title contains "Unlocking"; the stat source line says
  "Strand Partners study of Philippine AI adoption, 2026, commissioned by AWS" so
  the banned-word grep stays clean. Full title: *Unlocking the Philippines' AI
  Potential 2026*.
- **D-09 wording.** Doc 07 says "24% of leaders are confident staff can judge...".
  The cited page (NewsBytes) says businesses *estimated* 24% of their employees are
  confident judging whether sensitive information may go into an AI tool. The stat
  follows the page, not the spec's paraphrase.
- D-06 and D-09 URL is NewsBytes (200 OK; the page states both figures). PNA, the
  JD Neer blog (404) and Philstar Tech do not carry them. D-01 and D-02 use the
  Philstar article (200; states 78% and 35%).
- Proof points use only claims `about.md`/career support: Head of Tech Operations
  at Rappler 2018-2023, PHVote in the 2019 and 2022 elections, systems analyst at
  PSBank. **Omitted:** "Former IT Manager at Mapua Malayan Digital College" and
  "Master's in Innovation and Business" (about.md says he is still at MMDC and
  still studying) — TODO(Paul).
- Header "Eleven years": not used on these pages.
- Mode `whoFor` is not in rebuild-plan §5.5's table; drafted from each mode's one
  line. All six FAQ answers and the mode copy are drafted, for Paul's review.
- Regulatory names on tier pages (Data Privacy Act, NPC Advisory 2024-04, BSP
  STARS, PSF-AAI) follow doc 09/04/03 and carry no claim beyond "maps what they ask
  of you". Sources (doc 07 §13): NPC advisories
  https://privacy.gov.ph/pips-and-pics/advisories-circulars/ ; BSP AI rules
  https://www.gmanetwork.com/news/money/economy/994812/bsp-lays-down-rules-on-ai-use-to-guide-banks-financial-institutions/story/ ;
  PSF-AAI https://thepost.net.ph/news/nation/skills-map-for-careers-in-analytics-and-artificial-intelligence-launched/

**Trace table (done = yes):** programPage.headline (doc 09 option 1) yes · sub yes ·
stats[0..3] yes (D-01, D-02, D-06, D-09) · promise yes · steps yes · proofPoints yes
(trimmed, see above) · addOns yes · bundles yes · founding* yes · pulse / leadership-day /
fluency / champions / agent-sprint yes · tier faq[] yes (price answers rewritten) ·
workWithMe.modes yes (§5.5) · intro yes · faq yes (drafted).

## 32.3 service()

`ServiceInput` gains `url?` (resolved via `abs()`) and `areaServed?: string | string[]`
(schema.org/Service `areaServed` accepts Text, Place, AdministrativeArea, GeoShape;
Text kept as the simplest). `name` is always emitted (= title, existing
`serviceType` unchanged); `url` / `areaServed` only when given. No Offer, price or
Course markup. Tests were written first and failed 3/3 before the change.

## 32.4 `/work-with-me/`

- Four sections inside one `.shell` (section rules sit within the gutters, as on
  About): Head `.section` → Three ways in / The program / Enquire, each
  `.section.section-ruled`. The program block is the one `.panel-tint`.
- **Red fills.** The form's submit is `.btn-primary` (far below the fold, where
  the header button is off-screen). No other page button. Mode rows link to
  `#enquire` with a `.link-arrow` ("Enquire about this", plus an sr-only mode
  name so the three links are distinguishable).
- **Select not preset** (README departure 3). Options: Not sure yet · With you ·
  For you · Advising · the five tier titles in `order` · Something else (10).
- Form hidden inputs (`access_key`, `redirect`, `subject`, `from_name`,
  `botcheck`) carried over byte-for-byte; new visible fields `organisation`
  (`autocomplete="organization"`, optional) and `interested_in`.
- **Shared pieces (second use → extracted):** `src/components/TierTable.astro`
  (Work with me + overview; `linkTitles` / `enquireHref` props cover the two
  link schemes the task specifies), `src/components/ProgramSteps.astro` (the
  six-step `<ol>`; Phase 34 reuses it on Home). `global.css` gains `.table-wrap`
  and `.data-table` in `@layer components` (tier table + bundles table). Both
  are outside 32.4's file list; noted here.
- **Bug found and fixed:** `.table-wrap` needs `position: relative`. Without it
  the absolutely positioned `.sr-only` caption/header text escapes the scroll
  box and widened the 375px page to 685px (mobile browsers then zoom out).
- JSON-LD: `WebPage`, `Service` ×3 (`url` `/work-with-me/#<anchor>`), `Service`
  for the program (`url` = overview), `FAQPage` (6), `BreadcrumbList`, one
  `Person`. `areaServed: 'Philippines'` on all four (copy says "Philippine
  organisations"; Text is valid per 32.3).
- Meta description drafted now (163 chars, 3 over); 32.7 owns the 140–160 fix.
- BaseLayout: the header-CTA comment ("#enquire lands in 32.4") updated; no
  markup change.
- Done-when: one `<h1>`, one `.panel-tint`, ids `enquire` / `with-you` /
  `for-you` / `advise`, 10 `<option>`s, `<script>` tags = `.js` class + two GA4 +
  the JSON-LD data block, no `/_astro/*.js`. axe 0 violations. Viewed at 1280
  and 375 (no horizontal page scroll; the tier table scrolls inside its box).
- **Not done:** the Web3Forms test submission → `/thanks/`. It must run on a
  Vercel preview and sends Paul an email; there is no preview (work is on
  `main`, unpushed). Left for 32.8 / Paul.

## 32.5 Program overview and tier pages

- Rhythm exactly as the task file fixes it (overview: Head `.section` → Problem
  ruled → Promise + how it works tight → Five tiers ruled → Add-ons and bundles
  tight → Founding ruled (the one `.panel-tint`) → Who is teaching ruled → CTA
  tight; tier: Head → Problem tight → What happens ruled → Outcomes/Artefacts
  tight → FAQ ruled → Part of + CTA tight).
- **Red fills.** The overview's head button "Book a 20-minute scoping call" is
  `.btn-ghost` (hairline): the header's red button is already above the fold
  (§3.1, same call as README's note for the Home hero in 34.2). The closing CTA
  on the overview and "Enquire for pricing" on tier pages are `.btn-primary` —
  bottom of page, the header is out of view. Paul to confirm with the 34.2 one.
- Stats: `<ol>`, figure in Fraunces at h1 size (ink, not red), claim, then
  "Source: <sponsor>" as the link to `sourceUrl` (`rel="noopener"`). 4 stats, 4
  hrefs, every one with a named sponsor.
- Add-ons: one line, names joined by " · ", then "Enquire". Bundles: `<table>`
  Bundle · Contents · Who it's for, `id="bundles"` on its heading, then one
  "Enquire about a bundle" link. The add-ons/bundles section has an sr-only
  `h2` so its two `h3` kickers don't sit under the tiers' `h2`.
- `src/components/Breadcrumbs.astro` (new; overview + tier pages): a visible
  trail built from the same array passed to `breadcrumbs()`, so the page and the
  JSON-LD cannot drift. Separators trail each item so wrapped lines at 375px
  never start with "/".
- Tier kicker is `{label} · {duration}` (e.g. "Tier 1 · 1 day"). `entry.id` is
  the bare file slug (pulse, leadership-day, fluency, champions, agent-sprint).
- Microcopy written here (not from the spec, no facts): overview CTA heading
  "Start with a 20-minute scoping call."; tier CTA heading "Prices are by
  quote." — flag for Paul with the other drafted copy.
- Tier meta description is derived (`tagline` + label + audience); several
  exceed 160 chars (156–215) — 32.7 owns the 140–160 fix. The overview's is 152. No
  `ogImage` passed yet (32.7 adds the program cards).
- Done-when: overview + five tier HTML files exist; one `<h1>` each; overview
  has one `.panel-tint` (tier pages none); `<script>` tags = `.js` + two GA4 +
  JSON-LD; JSON-LD parses on all seven (`node`): overview `WebPage, Service,
  BreadcrumbList, Person`; tiers `WebPage, BreadcrumbList, FAQPage, Person`. No
  `₱`/`PHP `, banned-word grep clean over `dist/client/work-with-me`. axe 0
  violations on `/work-with-me/`, the overview and all five tiers. Viewed at
  1280 and 375; no horizontal page scroll.

## 32.6 Retire workshops

- Deleted: `src/pages/workshops.astro`, `src/pages/workshops/[slug].astro`,
  `src/lib/workshops.ts` + test, `src/content/courses`, `src/content/services`;
  `course()` / `CourseInput` and its test; the `courses` and `services`
  collections in both `keystatic.config.ts` and `src/content.config.ts`.
  `global.css` had no class used only by the deleted pages (checked class by class),
  so nothing to remove there.
- **Redirects** (`astro.config.mjs`; `/workshop` retargeted, no chains):
  `/workshop`, `/workshops/` -> `/work-with-me/ai-resilient-organisation/`;
  `/workshops/ai-fluency/` -> `.../fluency/`; `/workshops/leadership-ai/` ->
  `.../leadership-day/`; `/workshops/ai-for-business/` -> `/work-with-me/#advise`;
  `/workshops/vibe-coding/` -> `/work-with-me/`. Built config emits slash-less
  sources behind the adapter's 308 trailing-slash rule; live check is Blocked
  (needs a preview).
- **Outside the task text (plan.md 32.6a):**
  - `index.astro`: workshop block rewritten as a short "The program" section
    (no cards, no peso, no availability), hero button -> program, "What I do" now
    lists the three Work with me modes (read from the `workWithMe` singleton, not
    static copy). Home rewrite stays 34.2.
  - `thanks.astro`: "mid-workshop" -> "mid-session".
  - `schema.ts`: Person description "teaches AI workshops" -> "teaches AI to
    organisations"; `knowsAbout` comments re-pointed. `llms.txt.ts` About line the same.
  - `sitemap.astro`: workshop block and nav entry removed (needed for the build);
    program entries come in 32.7. `og/[...route].ts`: courses loop and `workshops`
    card removed, `work-with-me` description rewritten (cards in 32.7).
  - `contentLastmod()` never read `courses`/`services`; only a stale comment removed.
- Frozen thought `jack-and-the-snack-culture.mdx` untouched; rule 2 diff empty.

## 32.7 Discovery surfaces

- `llms.txt`: "Core Services" replaced by **Work with me** (three modes, from the
  `workWithMe` singleton) and **AI-Resilient Organisation** (overview + five tier
  links with taglines). `llms-full.txt`: same two blocks ahead of the essays, with
  tier facts (for, duration, you leave with) and mode facts incl. "Message for a
  quote"; no FAQs, no prices. Neither file contains "workshop" or a peso sign.
- HTML sitemap: "AI-Resilient Organisation" added to main pages plus a five-tier
  block (the 32.6 commit had already removed the workshops block for the build).
  XML sitemap lists `/work-with-me/`, the overview and five tiers (7 URLs) unchanged
  by code.
- **lastmod not added for the program.** `contentLastmod()` only emits a date a
  content file owns; the program JSON has no date field, and file mtimes are the
  checkout time on Vercel, i.e. the build-date signal the function exists to avoid.
  Same as the other static pages, so no `<lastmod>`. Say so if Paul wants an
  `updated` field (it would be a schema addition).
- OG: `program` + `program-<slug>` cards (title / tagline); `work-with-me`
  description rewritten; `ogImage` passed on the overview and tier pages. Viewed
  `program-leadership-day.png`: legible, two lines of title, ends on the red rule.
- Descriptions (chars): `/work-with-me/` 147 (dropped "while you build"); overview
  152 (unchanged); tiers authored in a `DESCRIPTIONS` map in `[tier].astro` (no new
  field): pulse 155, leadership-day 155, fluency 159, champions 158, agent-sprint 141.
  Not derived: tagline + audience ran to 215.

## 32.8 Verify (local; 2026-10-29)

- Gates green: build, `astro check` 0 errors, 50 tests.
- axe (`@axe-core/cli`, chromedriver 156, `serve dist/client -l 4400`, server stopped):
  0 violations on Home, `/work-with-me/`, the overview, all five tiers, `/sitemap/`,
  `/thanks/`.
- JS: every program page has `<script>` = `.js` class + two GA4 + the JSON-LD block;
  no `/_astro/*.js`. One `<h1>` per page; `.panel-tint` once on `/work-with-me/` and
  the overview, none on tiers. 10 `<option>`s; `#with-you/#for-you/#advise/#enquire`
  present.
- JSON-LD parses on all seven: `/work-with-me/` WebPage + Service x4 + FAQPage +
  BreadcrumbList + Person; tiers WebPage + FAQPage + BreadcrumbList + Person.
- Greps: peso/`PHP ` over all of `dist/client` -> nothing (Home included); banned words
  and "Angeles" over `dist/client/work-with-me` -> nothing; `workshop` in
  src/config -> redirect map only; `getCollection('courses'|'services')` -> 0; rule 2
  diff empty; every `href` on Home, the program pages, `/thanks/` and `/sitemap/` resolves
  in `dist/client`. Stats: 4 `sourceUrl`s, 4 linked sources on the overview.
- Redirects read from `.vercel/output/config.json`: six 301 routes, targets exactly as
  in 32.6 (the `/workshops/` form folds into the `^/workshops$` source). Live one-hop
  check not possible without a preview.
- **Not run:** Web3Forms submission, live redirects, validator.schema.org / Rich Results,
  manual keyboard pass. All logged in plan.md Blocked. The Phase 32 DoD box is left
  unchecked for that reason.

## Keyboard pass on /work-with-me/ (run in 34.6, 2026-10-29, local build at 1280)

- Tab order follows the DOM: skip link → nav (8) → three "Enquire about this: …" links → the tier table's scroll region (`div[role=region][tabindex=0]`, labelled by its caption) → five tier "Enquire about …" links → "See the program" → email → name, email, organisation, interested in, message → "Send it" → six FAQ `<summary>`s → footer. 47 stops, no traps, no stop on the `display:none` honeypot.
- Every stop shows the 2px `red-700` outline.
- Every field has a `<label>`; required fields are name, email, message (native `required`, the form is not `novalidate`).
- The select changes value by keyboard type-ahead. The FAQ `<details>` open on Enter and close on Space, focus ring around the summary row.
- Not exercised: submitting the form (it posts to Web3Forms and would email Paul). That stays Blocked item (a).
- Minor, not a failure: the FAQ marker stays "+" when an item is open.
- Result: pass. Removed item (d) from plan.md Blocked.
