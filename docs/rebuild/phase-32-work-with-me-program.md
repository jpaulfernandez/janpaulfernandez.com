# Phase 32 — Work with me + program
**Slice:** the offer is live — `/work-with-me/` (three ways in, the program block, the enquiry form), the AI-Resilient Organisation overview and five tier pages, and every old `/workshops/*` URL 301s to the right place · **Depends on:** Phase 31 merged · **Spec:** [rebuild-plan.md](../../rebuild-plan.md) §4 (redirects), §5.5, §5.6, §6, §7; README rules 6, 7, 8

## Context

Today `/work-with-me/` is a short pitch plus a three-field form, and `/workshops/*` is four per-person course pages with peso prices (₱2,500 …). v3 replaces both with one offer: three engagement modes (With you · For you · Advising) and one corporate program, **AI-Resilient Organisation**, five tiers deep. Per R5 **no prices are published anywhere** — modes say "Message for a quote", every tier, add-on and bundle says "Enquire". The program copy already exists in the private spec (`~/Downloads/ai-program-spec/`, doc 09 Part 1); this phase moves it into Keystatic-editable content and templates. It does not invent facts.

Changes: two schemas + one singleton edit (32.1), copy entry (32.2), `schema.ts` (32.3), three page templates (32.4–32.5), deletion of the whole workshops stack with redirects (32.6), discovery files (32.7). **Must not change:** About/Now/Thoughts content, the Person `@id`, anything outside the files named below. Home still builds after 32.6 but gets only the minimum repair (its full rewrite is 34.2).

## Read first

- [rebuild-plan.md](../../rebuild-plan.md) §5.5 (page), §5.6 (program + content model), §4 (redirect table), §6.
- Program spec, read **in place**, copy nothing private into the repo: `~/Downloads/ai-program-spec/09-marketing-and-pitch.md` Part 1 — §1 Home (headline, sub-headline, problem, promise, proof points, how it works, CTA), §2 Program (tiers, add-ons, bundles — **ignore the price columns**), §3 Tier pages (Tier 0, 1, 2, 2.5, 3), §5 Founding-client offer (ignore the price table); `07-research-appendix.md` §2 (figures D-01, D-02, D-06, D-09 and each row's sponsor) and §13 "Demand" source list (URLs); `04-tier2-fluency-and-champions.md` Part B (B1 outcomes, B3 artefacts, B4 pre-work, B5 variants) for Champions; `00-program-spec.md` lines 81–86 (style rules).
- [voice.md](../../voice.md). README rules 6 and 8.
- Current code: `src/pages/work-with-me.astro` (form at ~line 152), `src/content.config.ts` (`workWithMe` ~56, `services` ~65, `courses` ~97, `export const collections` ~193), `keystatic.config.ts` (`courses` ~177, `workWithMe` singleton ~314), `src/lib/schema.ts` (`service` ~255, `faqPage` ~235, `course` ~278), `astro.config.mjs` (`redirects` ~90, `contentLastmod` ~23), `src/pages/index.astro` (reads `services`, ~line 63).

## Tasks

### 32.1 Schemas — `program` collection, `programPage` singleton, `workWithMe` fields

**Files:** `keystatic.config.ts`, `src/content.config.ts` (**one commit**), `src/content/pages/workWithMe.md` (frontmatter skeleton only).
**Steps:**
1. **`program` collection** (one JSON per tier; `slug` = tier id). Astro: `glob({ pattern: '*.json', base: 'src/content/program' })`. Fields: `label` (e.g. "Tier 2.5"), `title`, `tagline` (the table's "promise"), `audience` (the table's "for"), `duration`, `leavesWith: string[]`, `problem: string`, `happens: string[]`, `outcomes: string`, `artefacts: string[]`, `faq: {q, a}[]`, `order: number`. **No price field of any kind.** (`label` is an addition to §5.6's list — the tables and kickers need "Tier 2.5"; note it in the PR.) Keystatic: `collection` with `slugField: 'slug'` and `fields.slug(...)` exactly like `courses` does, so slugs are `pulse`, `leadership-day`, `fluency`, `champions`, `agent-sprint` rather than title-derived.
2. **`programPage` singleton** at `src/content/pages/program.json`. The Astro collection name is `programPage` (the name `program` is taken by the tiers); Keystatic singleton key `programPage`. Fields: `headline`, `sub`, `promise`, `stats: {figure, claim, sponsor, sourceUrl}[]`, `steps: {name, line}[]` (the six-step strip — Phase 34 reuses it on Home, so it lives here once), `proofPoints: {label, text}[]`, `addOns: string[]` (names only), `bundles: {name, contents, whoFor, tiers: string[]}[]` (`tiers` = tier slugs, a `multiselect`; the tier pages use it for "part of" links), and the founding offer: `foundingHeading`, `foundingIntro`, `foundingDiscount`, `foundingGive: string[]`, `foundingTerms: string[]`. `steps`, `promise`, `proofPoints`, `addOns` and `bundles[].tiers` go beyond the §5.6 field list; §5.6's page order needs them. No price fields.
3. **`workWithMe`**: keep the markdown singleton (body = `intro`); add `modes: {name, line, whoFor, runsAs, priceSignal, anchor}[]` and `faq: {q, a}[]` (`faq` is an addition — the six items feed FAQPage and must be editable like every other FAQ). No `topics[]` (README deviation 4). In `content.config.ts` the schema is currently `z.object({})`; replace with the real shape. Keystatic's `workWithMe` singleton gets the same two arrays beside the existing `intro` document field.
4. Register `program` and `programPage` in `export const collections`. Do **not** touch `courses` or `services` (deleted in 32.6).
5. Create empty-but-valid files so the build passes: `src/content/program/<slug>.json` ×5 with placeholder strings, `src/content/pages/program.json`, and the `modes`/`faq` skeleton in `workWithMe.md`. Real copy is 32.2.

**Test-first?** No (config). Schema parity is checked by reading both files side by side: same field names, same optionality, same arrays.
**Done when:** `npm run build` and `npx astro check` pass; `/keystatic` (run `npm run dev`) lists "Program" tiers and the singletons and saves one edit without error; `grep -n "price" keystatic.config.ts src/content.config.ts` shows nothing inside the new collection/singleton definitions (`priceSignal` on modes is the only allowed hit).

### 32.2 Copy entry

**Files:** `src/content/program/{pulse,leadership-day,fluency,champions,agent-sprint}.json`, `src/content/pages/program.json`, `src/content/pages/workWithMe.md`.
**Steps:**
1. **Fill from doc 09 §1–3 and §5**, lightly edited to the house voice — see the trace table (appendix) and fill it as you go. Rewrite every FAQ answer that quotes a peso figure; replace "[Name]" with first person ("I") or "Paul"; no price, no "from ₱…", no VAT line.
2. **Stats** (`programPage.stats`): 78% use AI at work and 35% get role-specific training (Sprout Solutions, *State of HR 2026*, July 2026 — doc 07 D-01, D-02); 12% have a formal responsible-AI framework and 24% of leaders are confident their staff can judge whether sensitive data may go into an AI tool (AWS / Strand Partners, 2026 — D-06, D-09). **Name the sponsor** in `sponsor` exactly as doc 07 §2 does (Sprout: HR and payroll software vendor; AWS: commissioned by AWS, which sells cloud and AI services). `sourceUrl` comes from doc 07 §13 "Demand" — pick the URL that reports that exact figure, open it to confirm, and do not guess. Doc 09 §1's "The problem" cites exactly these four; add no others.
3. **Tier set.** Default: `fluency` = Tier 2 (doc 09 "Tier 2 · AI Fluency & Digital Self-Defence"), `champions` = Tier 2.5 as its own page. The fluency page names Champions as the next step; the bundles table shows them together. **Fold test:** write the champions page from doc 09 "Tier 2.5" plus doc 04 Part B (outcomes, artefacts, pre-work, variants). If it can't reach ~400 words of non-repeating copy without padding, fold Tier 2.5 into `fluency`, delete the `champions` slug and file, remove it from `bundles[].tiers`, and log the choice in the PR. (README departure list: the brief says "Tier 2 + 2.5 together on `fluency`"; this is the interpretation that keeps the §4 five-slug IA.)
4. **Tier copy** — ~600 words per page across `problem`, `happens`, `outcomes`, `artefacts`, `faq`. Hours-and-minutes run-of-show tables stay in the spec folder (§5.6). Tier 1's FAQ keeps "Do you give legal advice? No." in plain words; every FAQ about certificates says "of participation" and "aligned to PSF-AAI, not an accreditation".
5. **Proof points** (`proofPoints`): doc 09 §1 lists credentials, method, artefacts. The credentials line says "Former IT Manager at Mapúa Malayan Digital College" and "Master's in Innovation and Business" — but `about.md` and `person()` currently say Paul is *at* MMDC and still taking the Master's (graduation December 2026, rebuild-plan §11 item 4). **Do not publish an employment or degree claim the site contradicts.** Use only claims already true in `about.md`/`career` (Rappler, PSBank, the program-relevant facts), mark the MMDC/Master's wording `TODO(Paul)` in the PR, and list it under Blocked.
6. **`workWithMe.md`:** `modes` from the [§5.5 table](../../rebuild-plan.md#55-work-with-me) (names With you / For you / Advising; `anchor` = `with-you`, `for-you`, `advise` — `advise` is the target of the `/workshops/ai-for-business/` redirect; `priceSignal` = "Message for a quote"). Body (`intro`) = the fit statement: AI and service design for Philippine organisations; what Paul will not do (write your production code alone, certify your policy, sell you a tool). `faq`: six items — suggested topics: how an engagement starts; who owns the code/artefacts; what Paul needs from the client; vendor-neutrality; working outside Metro Manila; what happens if the client isn't ready. Draft in Paul's voice from `voice.md` and flag all six for his review.
7. Location: "Based in Manila"; delivery areas (Metro Manila, Clark/Pampanga, Cebu, online) may appear. Never "Angeles City".

**Test-first?** No.
**Done when:** the trace table in the appendix has no empty "Done" cell; `grep -rn "₱\|PHP \|\[Name\]" src/content/program src/content/pages/program.json src/content/pages/workWithMe.md` → nothing; `grep -rniE "leverage|unlock|empower|genuinely|honestly|straightforward|certified" src/content/program src/content/pages/program.json src/content/pages/workWithMe.md` → nothing (the word "certificate(s)" in FAQ answers is fine; "certified" is not); every `stats[].sourceUrl` returns 200 (`curl -sIL -o /dev/null -w "%{http_code}\n" <url>`).

### 32.3 `schema.ts` — Service for modes and program

**Files:** `src/lib/schema.test.ts` (first), `src/lib/schema.ts`.
**Steps:**
1. **Tests first**, in `schema.test.ts`: (a) `service({title, description})` keeps `@type: 'Service'`, `serviceType`, `description`, `provider['@id'] === PERSON_ID` (existing assertions must still pass untouched); (b) new optional `url` is resolved through `abs()` and emitted as `url`; (c) new optional `areaServed` is emitted as given; (d) `name` equals `title`; (e) omitted optionals emit no keys. Watch them fail.
2. Extend `ServiceInput` with `url?: string` and `areaServed?: string | string[]`; emit `name`, `url`, `areaServed` only when provided. Verify `areaServed` value shapes against schema.org's `Service` page (text, `AdministrativeArea` and `Place` are valid). Do **not** add `Offer`, `price` or `hasOfferCatalog` — prices are unpublished; do **not** add `Course` markup (plan.md C1 is on hold).
3. Leave `course()` and its tests for 32.6.

**Test-first?** Yes — step 1 precedes step 2.
**Done when:** `npm test` shows the new assertions failing before the change and passing after; existing `service()` tests unchanged and green.

### 32.4 `/work-with-me/` rewrite

**Files:** `src/pages/work-with-me.astro` (stays at this path; the program pages live in a sibling directory `src/pages/work-with-me/` — confirm the build emits `/work-with-me/` and the children, not a conflict).
**Steps:** four sections per [§5.5](../../rebuild-plan.md#55-work-with-me); rhythm decided now — **Head** `.section` (no rule), **Three ways in** `.section.section-ruled`, **The program** `.section.section-ruled`, **Enquire** `.section.section-ruled`.
1. Frontmatter: `getEntry('workWithMe', 'workWithMe')` → `render()` the intro; `getCollection('program')` sorted by `order`; `getEntry('programPage', …)`. Hero `h1` "Work with me" (the only `h1`) + intro.
2. **Three ways in:** `modes.map` → one ruled row each (`.rows`/`.row-link` rhythm, 1px `--line` between rows — not cards): `id={mode.anchor}`, name as `h3`, one line, then a `<dl>` with *Who it's for* / *How it runs* / *Price* (`priceSignal`), and a link "Enquire about this →" to `#enquire`. No preset (README deviation 3). Under the rows, one `.subtext` line: "I also do 1-on-1 sessions — ask." (R4: the vibe-coding line.)
3. **The program:** the **only `.panel-tint` on the page** — tagline, the six-step strip (`programPage.steps`, rendered as a plain `<ol>`), the five-tier table from the `program` collection (columns: Tier · Promise · For · Duration · "Enquire" — no price column, the last cell is a link to the tier page labelled "Enquire"), link "See the program →" to `/work-with-me/ai-resilient-organisation/`. A real `<table>` with `<caption class="sr-only">`, header cells scoped; on narrow screens let it scroll horizontally inside its wrapper (`overflow-x: auto`) rather than reflow with JS.
4. **Enquire** (`id="enquire"`): Web3Forms form — keep `action`, the `access_key`, `redirect` (`…/thanks/`), `subject`, `from_name` hidden inputs and the `botcheck` honeypot exactly as in the current file (copy them; don't retype the key). Visible fields: Name, Email, Organisation (optional), **Interested in** (`<select name="interested_in">`: *Not sure yet · With you · For you · Advising · each tier by its `title` (generated from the collection, in `order`) · Something else*), Message. Labels bound with `for`/`id`, `autocomplete` on name/email/organization. `mailto:jpaul.fernandez18@gmail.com` beside it; the three steps (call → one-page proposal within two working days → start) as an `<ol>`; then the six-item FAQ as `<details class="faq">` rows. Submit button `.btn .btn-primary`.
5. JSON-LD: `service()` for each mode (`url` = `/work-with-me/#<anchor>`), `service()` for the program (`url` = overview), `faqPage(faq)`, `webPage`, `breadcrumbs`, `person()`. One `person()` only.
6. Zero client JS: no `<script>` in the page or its components.

**Test-first?** No.
**Done when:** built `dist/client/work-with-me/index.html` has exactly one `<h1>`, one `.panel-tint`, `id="enquire"`, `id="with-you"`, `id="for-you"`, `id="advise"`, the `interested_in` select with 10 `<option>`s ("Not sure yet", 3 modes, 5 tiers, "Something else"; 9 if `champions` was folded), and no `<script` besides the `.js` and GA4 tags; the form posts a test submission to the Web3Forms test flow and lands on `/thanks/` (do this once on the preview; it sends one email to Paul — tell him first).

### 32.5 Program overview and tier pages

**Files:** `src/pages/work-with-me/ai-resilient-organisation/index.astro`, `src/pages/work-with-me/ai-resilient-organisation/[tier].astro`.
**Steps — overview**, order per §5.6, rhythm decided now: **Head** (`h1` = `programPage.headline`, sub, button "Book a 20-minute scoping call" → `/work-with-me/#enquire`) `.section`; **The problem** (stats) `.section.section-ruled`; **The promise + how it works** `.section-tight`; **Five tiers** table `.section.section-ruled`; **Add-ons and bundles** `.section-tight`; **Founding clients** `.section.section-ruled` containing the **only `.panel-tint`**; **Who is teaching** (three proof points) `.section.section-ruled`; **CTA** `.section-tight`.
1. Stats: an `<ol>`; each item = large figure, claim, then the sponsor-named source as a link to `sourceUrl` (`rel="noopener"`). Every stat has an `href`; no stat without a named sponsor. Doc 07 requires the sponsor be named wherever the figure is used.
2. Tier table as in 32.4, but each row links to `/work-with-me/ai-resilient-organisation/<slug>/` from the tier title; the "Enquire" cell links to `/work-with-me/#enquire`. Add-ons as a one-line list (names only, "Enquire"). Bundles as a `<table>` (Name · Contents · Who it's for; no figure column), "Enquire" link.
3. Founding box: heading, intro, `foundingDiscount`, "What you give" (4 items), "Terms" (4 items) — **no price table**, no peso. The percentage (25%) is allowed; the amounts are not.
4. JSON-LD: `service()` (program), `webPage`, `breadcrumbs` (Home › Work with me › AI-Resilient Organisation), `person()`.

**Steps — tier page** (`[tier].astro`): `getStaticPaths` over `getCollection('program')`, `params: { tier: entry.id }`, `props: { entry, all }`; verify the `entry.id` equals the file slug (no extension). Sections (rhythm decided): kicker `Tier N · duration`, `h1` title, `tagline` as lead, a two-item fact strip (*For* / *You leave with*) — `.section`; **The problem** `.section-tight`; **What happens** (`happens` bullets) `.section.section-ruled`; **Outcomes** and **Artefacts** `.section-tight`; **FAQ** `<details class="faq">` `.section.section-ruled`; **Part of** (bundles from `programPage.bundles` where `tiers` includes this slug → link to `…/ai-resilient-organisation/#bundles`) and CTA "Enquire for pricing" → `/work-with-me/#enquire` `.section-tight`. Breadcrumbs Home › Work with me › AI-Resilient Organisation › {title}. JSON-LD: `webPage`, `breadcrumbs`, `faqPage(entry.data.faq)`, `person()`. No `Course`, no per-tier `Service`.
- Add `id="bundles"` to the overview's bundles heading so the "part of" links resolve.
- Run-of-show tables, times and prices do not appear.

**Test-first?** No.
**Done when:** `dist/client/work-with-me/ai-resilient-organisation/index.html` and one HTML per tier slug exist; each has one `<h1>`; the overview has one `.panel-tint`; no `<script` beyond the allowed two; the FAQ JSON-LD on a tier page parses (`node -e` on the extracted `<script type="application/ld+json">`).

### 32.6 Retire workshops (one commit)

**Files:** see the list; **everything in a single commit** so no intermediate state has a dangling reference.
**Steps:**
1. `git rm src/pages/workshops.astro 'src/pages/workshops/[slug].astro' src/lib/workshops.ts src/lib/workshops.test.ts` and `git rm -r src/content/courses src/content/services`.
2. `schema.ts`: delete `course()` and `CourseInput`; delete the `course()` tests in `schema.test.ts`. Leave `service()`.
3. Remove the `courses` and `services` collections from **both** `keystatic.config.ts` and `src/content.config.ts` (and from `export const collections`).
4. `astro.config.mjs`: replace `redirects` with — keep `'/sitemap.xml': '/sitemap-index.xml'`; **retarget** `'/workshop'` and add `'/workshops/'` → `'/work-with-me/ai-resilient-organisation/'`; `'/workshops/ai-fluency/'` → `'/work-with-me/ai-resilient-organisation/fluency/'`; `'/workshops/leadership-ai/'` → `…/leadership-day/`; `'/workshops/ai-for-business/'` → `'/work-with-me/#advise'`; `'/workshops/vibe-coding/'` → `'/work-with-me/'`. Verify against current Astro docs how `redirects` treat trailing-slash variants under `trailingSlash: 'always'`; add the no-slash forms only if the check in 32.8 shows they don't resolve in one hop. Check `contentLastmod()` for any `courses`/`services` reads and remove them.
5. Remove every remaining reference — find them with `grep -rniE "workshop|courses|services|course\(" src astro.config.mjs keystatic.config.ts`: `BaseLayout.astro` (any left after 31.8), `src/pages/index.astro` (it reads `services`, ~line 63, and has workshops buttons ~lines 128 and 245 — **minimum repair only**: static copy for the old "What I do" block or remove it, and point the buttons at `/work-with-me/ai-resilient-organisation/`; the real Home is 34.2), `llms.txt.ts`, `llms-full.txt.ts` (rewritten in 32.7), `og/[...route].ts` (drop the `courses` import and loop; 32.7 adds program cards), `sitemap.astro` (32.7), `global.css` (classes now unused — delete per the 31.3 rule).
6. **Do not edit** `src/content/thoughts/jack-and-the-snack-culture.mdx` (frozen; it links to `/workshops`, the 301 covers it).

**Test-first?** No (deletion); the existing suite proves the rest.
**Done when:** `grep -rniE "workshop" src astro.config.mjs keystatic.config.ts` leaves only the redirect map, the frozen thought, and nothing else; `grep -rn "getCollection('\(courses\|services\)')" src` → 0; build, check, tests green; `git diff v2-final -- src/content/thoughts` empty.

### 32.7 Discovery surfaces

**Files:** `src/pages/llms.txt.ts`, `src/pages/llms-full.txt.ts`, `src/pages/sitemap.astro`, `src/pages/og/[...route].ts`, `astro.config.mjs` (lastmod), meta descriptions on the new pages.
**Steps:**
1. `llms.txt`: replace the workshops/services section with a **Work with me** section (three modes, one line each, link) and an **AI-Resilient Organisation** section (program link + five tier links). `llms-full.txt`: the same plus the tier-level facts (audience, duration, what you leave with) from the collection — no prices, no FAQ dump. Follow the existing file's formatting.
2. `sitemap.astro` (HTML sitemap): list `/work-with-me/`, the program overview and the tier pages, and drop the workshops block. The XML sitemap needs nothing — `@astrojs/sitemap` picks the routes up; add the program content directory to `contentLastmod()` (file mtimes or the existing date-field approach used for thoughts — follow what the function does for other collections) so `lastmod` isn't the build date.
3. OG: add `pagesObj['program']` (overview) and `pagesObj['program-<slug>']` for each tier (title, tagline as description); update the `work-with-me` entry's description. Pass `ogImage={`/og/program-${slug}.png`}` on the matching pages (same pattern thoughts use). Look at one generated PNG.
4. Meta descriptions **140–160 characters** for `/work-with-me/`, the overview, and each tier (`description` prop on `BaseLayout`; for tiers derive from `tagline` + audience, or add an authored string — no new field). Write a one-off check: `grep -ho 'name="description" content="[^"]*"' dist/client/work-with-me/**/index.html` and measure lengths with `awk`.

**Test-first?** No.
**Done when:** `curl`/`cat` of the built `llms.txt` shows the new sections and no "workshop"; `dist/client/sitemap-index.xml` → child sitemap lists all seven new URLs; every new page's description length is 140–160; `dist/client/og/program*.png` exist.

### 32.8 Verify

**Steps** (on the PR's Vercel preview where redirects are involved):
1. Gates: `npm run build && npx astro check && npm test`.
2. Redirects: for each of `/workshop`, `/workshops`, `/workshops/`, `/workshops/ai-fluency/`, `/workshops/leadership-ai/`, `/workshops/ai-for-business/`, `/workshops/vibe-coding/` run `curl -sI https://<preview>/<path>` → `HTTP/2 301` and the `location` from the 32.6 table, **one hop** (`curl -sIL … | grep -ci '^location'` = 1). Locally, confirm the same from `.vercel/output/config.json` after a build. The `#advise` fragment must survive in `location`.
3. Structured data: paste the built `/work-with-me/` and a tier page into validator.schema.org (and Google's Rich Results Test); `Service` ×4 and `FAQPage` parse with no errors.
4. Copy greps over `dist/client` (v3 pages only — `work-with-me/**`): `grep -rn "₱\|PHP " dist/client/work-with-me` → nothing; `grep -rniE "certified|leverage|unlock|empower|genuinely|honestly|straightforward|Angeles" dist/client/work-with-me` → nothing.
5. Stats: the overview's stat list has as many `href`s as `stats` entries; each names a sponsor.
6. Axe on `/work-with-me/`, the overview and two tier pages; keyboard pass through the form and the `<details>` FAQs.
7. JS: `grep -c "<script" dist/client/work-with-me/index.html dist/client/work-with-me/ai-resilient-organisation/index.html` = the `.js` script + GA4 only; no `/_astro/*.js`.
8. Content untouched: README rule 2 diff empty.

**Done when:** every command above gives the stated result; results pasted in the PR.

## Definition of Done

- [ ] `keystatic.config.ts` and `src/content.config.ts` agree field for field (`program`, `programPage`, `workWithMe.modes/faq`); `courses` and `services` gone from both
- [ ] All program copy traceable to doc 09/07/04 (appendix table complete); no invented fact; MMDC/Master's wording resolved or left `TODO(Paul)` in the PR
- [ ] Every stat has a `sourceUrl` (200 OK) and a named sponsor
- [ ] `/work-with-me/` has the four sections, one `.panel-tint`, the select options per 32.4, six FAQ items, `#advise`/`#enquire` anchors
- [ ] Overview + one page per tier slug build; breadcrumbs and FAQPage JSON-LD valid
- [ ] `grep -rn "₱\|PHP " dist/client/work-with-me` → nothing; banned-word grep → nothing
- [ ] Seven old URLs return one-hop 301 to the table's targets (preview); `/workshop` no longer chains
- [ ] `grep -rniE workshop src astro.config.mjs keystatic.config.ts` → redirect map and the frozen thought only
- [ ] `llms.txt`, `llms-full.txt`, HTML + XML sitemap, OG cards cover the new routes; descriptions 140–160 chars
- [ ] 0 KB page JS on `/work-with-me/**` (README rule 7); axe clean
- [ ] `npm run build`, `npx astro check`, `npm test` green; content diff vs `v2-final` empty

## Verification

```bash
npm run build && npx astro check && npm test
grep -rn "₱\|PHP " dist/client/work-with-me                # nothing
grep -rniE "certified|leverage|unlock|empower|genuinely|honestly|straightforward|Angeles" dist/client/work-with-me   # nothing
grep -rniE "workshop" src astro.config.mjs keystatic.config.ts   # redirect map + frozen thought only
```
```bash
for p in workshop workshops workshops/ workshops/ai-fluency/ workshops/leadership-ai/ workshops/ai-for-business/ workshops/vibe-coding/; do
  echo "== /$p"; curl -sI "https://<preview-host>/$p" | grep -iE "^(HTTP|location)"; done
```
```bash
node -e "const h=require('fs').readFileSync('dist/client/work-with-me/index.html','utf8');for(const m of h.matchAll(/<script type=\"application\/ld\+json\">(.*?)<\/script>/gs))JSON.parse(m[1]);console.log('jsonld ok')"
```

## Risks & notes

- **Merging publishes the offer.** The pages are indexable and in the sitemap the moment this merges. Paul's blockers (BIR, MMDC) gate *announcing*, not merging — but he should know that "live" means findable.
- The brief-level interpretation of Tier 2/2.5 (32.2 step 3) and the extra fields (`label`, `steps`, `promise`, `proofPoints`, `addOns`, `bundles[].tiers`, `workWithMe.faq`) go beyond §5.6's list. They are listed in the PR so Paul can object; none adds a price.
- Doc 09 FAQ answers and "problem" text were written for a pitch; edit for the page, keep every claim traceable. Do not paste doc 09 sections wholesale.
- `redirects` with a hash target (`#advise`) and trailing-slash variants are the fiddly part; the check is the preview, not the config.
- Keystatic slug fields are title-derived by default; the `fields.slug` + `slugField: 'slug'` pattern in `courses` is how tiers keep short slugs — copy it, don't reinvent it.
- The form posts to a third party with an access key already public in the current page; carry it over, don't generate a new one.

## Blocked on Paul

- **Founding-offer terms text** — confirm wording before the PR is marked ready (32.2).
- **MMDC / Master's wording** in the facilitator proof points (32.2 step 5).
- **BIR registration and written MMDC clearance** — gate *announcing* the offer, not merging (already in `plan.md`).
- Review of the six Work-with-me FAQ answers and the mode copy (drafted, not authored by him).

## Appendix — copy trace table (fill during 32.2; "Done" = yes/no + note)

| Field | Source | Done |
|---|---|---|
| `programPage.headline` | doc 09 §1 "Headline options" — the chosen option | |
| `programPage.sub` | doc 09 §1 "Sub-headline" | |
| `programPage.stats[0..3]` | doc 07 §2 D-01, D-02, D-06, D-09 (figure, sponsor); URLs doc 07 §13 "Demand" | |
| `programPage.promise` | doc 09 §1 "The promise" | |
| `programPage.steps[]` | doc 09 §1 "How it works" (six steps, verb line under each) | |
| `programPage.proofPoints[]` | doc 09 §1 "Three proof points" — cross-checked against `about.md`/`career` | |
| `programPage.addOns[]` | doc 09 §2 "Add-ons" (names only) | |
| `programPage.bundles[]` | doc 09 §2 "Bundles" (name, contents, who it's for; no figures) | |
| `programPage.founding*` | doc 09 §5 (heading, give ×4, terms ×4; no price table) | |
| `pulse.json` | doc 09 §3 "Tier 0" | |
| `leadership-day.json` | doc 09 §3 "Tier 1" | |
| `fluency.json` | doc 09 §3 "Tier 2"; doc 04 Part A for outcomes/artefacts only | |
| `champions.json` | doc 09 §3 "Tier 2.5"; doc 04 Part B (B1, B3, B4, B5) | |
| `agent-sprint.json` | doc 09 §3 "Tier 3"; doc 05 for facts only | |
| tier `faq[]` | the "FAQ" lists under each doc 09 §3 tier, price answers rewritten | |
| `workWithMe.modes[]` | rebuild-plan §5.5 table | |
| `workWithMe.intro` | rebuild-plan §5.5 "Head" (fit statement, what Paul won't do) | |
| `workWithMe.faq[]` | drafted (topics in 32.2 step 6); reviewed by Paul | |
