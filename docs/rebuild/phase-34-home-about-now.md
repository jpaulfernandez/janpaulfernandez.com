# Phase 34 — Home + About + Now

**Slice:** the front door matches the offer: Home states what Paul does for people and routes to Work with me, Projects and Thoughts; About and Now carry the same content in the new skin · **Depends on:** Phase 33 · **Spec:** [rebuild-plan.md §5.1–§5.3, §6](../../rebuild-plan.md)

## Context

Phase 31 re-skinned these three pages mechanically and Phase 32 removed their workshops/services sections. Phase 34 is where they are *redesigned*: Home gets the §5.1 order (hero → three ways → program band → recent projects → latest thoughts → Now → closing CTA), About gets "How I work", Now gets its final skin. Home is now a router, not a biography: the old `heroIntro` bio is simply deleted, because `about.md` already holds the longer version.

Must not change: `src/content/pages/about.md`, every file in `src/content/now/`, `src/content/thoughts/` (byte-identical to `v2-final`, see [README](README.md) rule 2); the Person `@id` and the About `ProfilePage` (T30); Now's `dateModified` feeding from the newest entry; **0 KB client JS on all three pages** ([README](README.md) rule 7). Home runs after Projects because section 4 calls `recentProjects` from Phase 33.

## Read first

- [rebuild-plan.md](../../rebuild-plan.md) §5.1 (Home order and draft hero copy), §5.2, §5.3, §3.1–§3.3 (the one-red-fill rule, tint rules).
- `src/pages/index.astro` (state after Phase 32; originally 486 lines: hero at ~108, then sections at 168/262/286/328/360/409 in the v2 order — all being replaced), `src/pages/about.astro` (131 lines), `src/pages/now.astro` (296 lines, scoped `.tl*` styles from ~line 195), `src/components/Timeline.astro`, `src/components/PostListItem.astro`.
- `src/lib/projects.ts` (Phase 33: `recentProjects`, `hasPage`), `src/lib/thoughts.ts` (`getPublishedThoughts`), `src/pages/thoughts/index.astro` (how reading time is computed for `PostListItem`: `Math.max(1, Math.ceil(words / 200))`).
- Phase 32 outputs this phase reads: the `workWithMe` singleton `modes[]` (`name`, `line`, `anchor`; look it up with `getEntry('workWithMe', 'workWithMe')` as `work-with-me.astro` does), the `program` singleton and `program` collection, and whatever component or constant 32.4/32.5 used for the six-step strip.
- `~/Downloads/ai-program-spec/09-marketing-and-pitch` §4 (About copy) — outside the repo; read it there, copy only the three "How I work" lines, nothing private (no pricing tables, pitch deck or outreach).
- `voice.md` and the doc 00 style rules ([README](README.md) rule 8).

## Tasks

### 34.1 `home` singleton fields

**Files:** `src/content.config.ts:43–44`, `keystatic.config.ts:298–299`, `src/content/pages/home.json`.
**Test-first?** No (config + content).

Steps:
1. In **both** config files replace `heroGreeting` / `heroIntro` with `heroStatement` (text, required) and `heroWho` (text, required, multiline). No `selectedProjects[]` — Home uses `recentProjects(all, 3)` ([README](README.md) deviation 4).
2. Rewrite `src/content/pages/home.json` with the §5.1 drafts, then refine in `voice.md` register:
   - `heroStatement`: "I help organisations decide what to build with AI, then build it with them — or for them."
   - `heroWho`: "Eleven years shipping under pressure: a bank, two election nights at Rappler, a college of working students. Based in Manila; working in Metro Manila, Clark, Cebu and online."
   Check "eleven years" against `src/content/career/psbank.md` (2015 start) before keeping it; use the verified number. No peso figures, Manila (not Angeles/Clark) as base.
3. `git grep -n "heroGreeting\|heroIntro"` → only `index.astro` should remain; it is rewritten in 34.2. Run the parity check on the two config files (same two field names, same required flags).

**Done when:** `home.json` validates against the new schema in both configs and `git grep "heroGreeting\|heroIntro"` returns nothing after 34.2.

### 34.2 Home sections

**Files:** `src/pages/index.astro` (rewrite), `src/components/ProjectRow.astro` (new, extracted), `src/pages/projects/index.astro` (swap its inline row for the component), `src/styles/global.css` (only if a needed `@layer components` class from 31.3 is missing).
**Test-first?** No; the logic used (`recentProjects`, `getPublishedThoughts`) is already tested.

Section order and **ruled vs tight decision** (a rule marks a turn in the argument, per [CLAUDE.md](../../CLAUDE.md); write this table into a comment at the top of the page):

| # | Section | Class | Why |
|---|---|---|---|
| 1 | Hero | `.hero` (page top, no rule) | opens the page |
| 2 | Three ways to work | `.section-tight` | continues the hero's argument: what I do |
| 3 | Program band | `.section.section-ruled` | new argument: the packaged offer. Contains the page's **only** `.panel-tint` |
| 4 | Recent projects | `.section.section-ruled` | new argument: proof |
| 5 | Latest thoughts | `.section-tight` | continues the proof: the thinking behind it |
| 6 | Now, briefly | `.section-tight` | continues it: what is live this month |
| 7 | Closing CTA | `.section.section-ruled` | the turn to action |

Three ruled, three tight, plus the hero. Do not default any section to tight-and-ruled.

Steps:
1. Frontmatter: delete the `availability`/workshops/services imports and the `cleanSnippet`/`withInlineLinks` helpers (nothing in the new page uses them). Keep `getEntry('home','home')` → `{ heroStatement, heroWho }`. Load: `modes` from the `workWithMe` singleton; `program` singleton + collection (sorted by `order`); `recentProjects(await getProjects(), 3)`; `(await getPublishedThoughts()).slice(0, 3)`; the three newest `now` entries (the existing `latestNowEntries` sort, without the `snippet`).
2. **Hero** (`<section class="hero">`, no `data-hero`): left column the portrait (34.3), right column the single `h1` = `heroStatement` (Fraunces, display step), `heroWho` as a `.subtext` paragraph, then two actions. Decision on the red fill: the nav already carries the one red "Book a scoping call" button (31.8), and rebuild-plan §3.1 says a second red fill above the fold is wrong, so the hero's primary action is a hairline `.btn` "Work with me" → `/work-with-me/` and the second is a text `.link` "See the program" → `/work-with-me/ai-resilient-organisation/`. (If Paul's visual review wants §5.1's red hero button, it is a one-class change; the nav button then goes hairline on Home only.) The h1 no longer contains the name; the name lives in `<title>`, the nav wordmark and the Person JSON-LD (see Risks).
3. **Three ways:** a `.rows` ruled list of three `.row-link` rows built from `modes` — mode `name` (Inter 500), `line` (`ink-600`), `→`; each links to `/work-with-me/#{mode.anchor}`. No copy is typed into Home: Work with me owns it.
4. **Program band:** one `.panel-tint` (`blue-100`, hairline, radius ≤4px, no shadow) inside the ruled section: mono kicker "Program", `h2` = `program.headline`, `program.sub` as the one sentence, the six-step strip, and a `.link` "See the program". The strip is Pulse → Leadership day → Fluency → Champions → Agent sprint → 30/60/90. Reuse the strip component or constant from 32.4/32.5; if the strip is still inline in two pages, this is the third use — extract `src/components/ProgramStrip.astro` now and replace the other uses in the same commit. If `champions` was folded into `fluency` in 32.2, the strip follows the collection.
5. **Recent projects:** `recentProjects(...)` → `.rows` list. This markup is the second use of the Projects index row, so extract `src/components/ProjectRow.astro` (props: `entry`; renders the `hasPage` → internal link / `link` → external link / inert `div` logic from 33.4, plus year · kind · title · summary) and make `projects/index.astro` use it too (pass-through `data-kind` attribute). Header row: `h2` "Projects" + link "All projects".
6. **Latest thoughts:** three `PostListItem`s with the same props `thoughts/index.astro` passes (including `readingTime`). Header row: `h2` "Thoughts" + link "All thoughts". Do not edit `PostListItem` (36.2 owns it).
7. **Now, briefly:** two-column on `md+`: left `h2` "Now" + "Full timeline" link to `/now/`; right a hairline list of the three newest entries (mono date `ink-400`, title as a link to `/now/`). No snippet, no dot (the dot belongs to the Now page).
8. **Closing CTA:** one sentence in Paul's voice, the email as a `mailto:` link (reuse the address constant the footer / Work with me uses: `grep -rn "mailto:" src`), and the one red `.btn-primary` "Book a scoping call" → `/work-with-me/#enquire`. This is the only red fill on the page below the fold; the nav button is the only one above it.
9. Remove the photo strip entirely (`stripShots`, `gallerySets`, `photo-sheet__frame`, the `getCollection('gallery')` call): Home does not import gallery.
10. `BaseLayout` props: `title="Paul Fernandez"`, `isHome`, and a new `description` of 140–160 characters, e.g. "Paul Fernandez helps Philippine organisations decide what to build with AI, then builds it with them or for them. Consulting, building and advising from Manila." (160 chars; `voice.md` check). JSON-LD stays exactly `webSite()`, `person()`, `breadcrumbs([{ name: 'Home', url: '/' }])` — **no `ProfilePage`** (Phase 30 A1).
11. No `<script>` in the page, no `data-reveal*`/`data-hero`/`data-brighten`, no `style` blocks that re-hide with `lg:hidden` against a scoped rule.

**Done when:** all seven sections render from live data, `dist/client/index.html` has one `h1`, one `.panel-tint`, no `<script` beyond the two [README](README.md) exceptions, and the page has no import from `gallery` or `workshops`.

### 34.3 Portrait crop

**Files:** `src/styles/global.css` (new `.portrait` in `@layer components`), `src/pages/index.astro`, `src/pages/about.astro` (drop its scoped `.portrait` rules).
**Test-first?** No.

Steps:
1. The asset is `src/assets/paul.webp`, 4128×6192 (2:3), ~800 KB — it is processed at build, never shipped raw. No new asset ([README](README.md) deviation 8).
2. Define once (second use — Home and About): `.portrait` = hairline `border-blue-200`, radius ≤4px, overflow hidden; `.portrait img { width:100%; aspect-ratio: 4 / 5; object-fit: cover; object-position: 50% 18%; }`. **No** grayscale filter or hover transition (the v2 About crop had both; they are decoration and a motion the new build does not keep). Tune `object-position` on the PR preview so the face sits in the upper third at 375px and 1280px.
3. Home: `<Image src={portrait} alt="Paul Fernandez" widths={[320, 480, 640, 800]} sizes="(min-width: 64rem) 28rem, (min-width: 48rem) 40vw, 70vw" loading="eager" fetchpriority="high" />` — it is the LCP element. On narrow screens it stacks above the statement at ≤70vw so the h1 stays near the top. About: keep its existing `widths`/`sizes`, eager.
4. Delete the scoped `.portrait` block in `about.astro` and any `:global(img)` filter rules.

**Done when:** `dist/client/index.html` serves a `srcset` of ≤800px variants (no multi-megabyte image), and the crop looks right at 375px, 768px, 1280px on the preview.

### 34.4 About

**Files:** `src/pages/about.astro` (re-skin + two additions). `src/content/pages/about.md` is **not touched**.
**Test-first?** No.

Steps:
1. Keep: `render(aboutEntry)` → `<AboutIntro/>` inside `.prose` (verbatim), the portrait, the `Timeline` (`variant="full"`), `profilePage({ url: '/about/', name: 'Jan Paul Fernandez' })`, `person()` (defaults, `sameAs` untouched) and breadcrumbs. Leave `about.md`'s two stale lines alone (Master's, MMDC tense): Paul revisits them at graduation in December 2026 ([rebuild-plan §11](../../rebuild-plan.md)).
2. Order: `page-head` (h1 "About", intro prose left, portrait right) → Experience (Timeline) → **How I work** → Connect. Section classes: Experience `.section` (no rule; it follows the head), How I work `.section-tight`, Connect `.section.section-ruled`.
3. **How I work:** a `.rows` or short `<ul>` of three lines — "simplify, then do"; "artefacts leave the room"; "vendor-neutral" — in the wording of doc 09 §4 (read at `~/Downloads/ai-program-spec/`). Hard-code them in `about.astro` — **not** in `about.md` ([README](README.md) deviation 5). Do not paraphrase beyond style-rule fixes; none of the lines may contain a price, a client name or a claim not in the spec.
4. **Connect:** keep the section. Replace the stale sentence "Available for consultation, talks, and fractional product ownership." with a line that matches the three modes ("I work with teams three ways: with you, for you, or as an adviser."), followed by a `.link` to `/work-with-me/`. Keep the LinkedIn link as a text link. Flag the changed sentence in the PR for Paul.
5. Remove `data-reveal*` residue and the scoped `.statement-sm` colour rules that reference old tokens (`grep -n "paper-\|ink-9\|wine-" src/pages/about.astro` → nothing).

**Done when:** `git diff v2-final -- src/content/pages/about.md` is empty, the About page renders the same sentences as before, three "How I work" lines exist, and `grep -c "ProfilePage" dist/client/about/index.html` is 1.

### 34.5 Now re-skin

**Files:** `src/pages/now.astro` (scoped `<style>` and markup only), `src/components/Timeline.astro` (only if its tokens are stale).
**Test-first?** No.

Steps:
1. `grep -n "var(--color-\|paper-\|ink-\|wine-" src/pages/now.astro src/components/Timeline.astro` — Phase 31.5 swept utility classes but scoped `var(--color-…)` references (e.g. `--color-ink-950`, `--color-paper-600`, `--color-paper-400`, `--color-paper-50` in the `.tl-*` rules) may be dangling because token meanings inverted. Replace each by the §3.1 token: dates `ink-400`, body `ink-900`, hairlines `blue-200`.
2. Timeline treatment per §5.3: mono dates in `ink-400` (tabular numerals, uppercase, 0.14em tracking); entry body in `ink-900`; node = hollow `blue-200` ring for past entries; **the newest entry's node is a filled `red-500` dot, no halo, no animation**; year headings mono `ink-400`.
3. `seoData` is not touched: `webPage({ url: '/now/', name: 'Now', description, dateModified })` and the `latestDate` logic stay byte-for-byte. The page's meta description (already 140+ chars, T30) is kept.
4. One `h1`; `Last updated` stays as `.mono` `ink-400`.

**Done when:** `git diff v2-final -- src/content/now` is empty, `dateModified` in the built JSON-LD equals the newest entry's date, and the newest entry's marker is the only red element on the page.

### 34.6 Verify

**Files:** none.

Run Verification, then the manual passes: keyboard through every Home link in DOM order, 375px / 768px / 1280px, Home with JS disabled (identical, since there is none), reading-order check (portrait first in the DOM but the h1 is reachable by heading navigation), and a copy read against `voice.md`.

**Done when:** every Definition of Done box is ticked.

## Definition of Done

- [ ] `npm run build`, `npx astro check`, `npm test` green ([README](README.md) rule 4).
- [ ] `home` singleton is `heroStatement` + `heroWho` in both config files and `home.json`; `git grep "heroGreeting\|heroIntro"` → nothing.
- [ ] Home renders the seven sections in §5.1 order; ruled/tight classes match the table in 34.2; exactly one `.panel-tint`; exactly one `.btn-primary` in the page body (the closing CTA).
- [ ] Home recent projects come from `recentProjects(…, 3)`; no project is hard-coded; Home imports nothing from `gallery` or `workshops`.
- [ ] Home JSON-LD: `WebSite` + `Person` + `BreadcrumbList`; **no** `ProfilePage` (`grep -c ProfilePage dist/client/index.html` → 0). About: exactly one `ProfilePage`.
- [ ] `git diff v2-final -- src/content/pages/about.md src/content/now src/content/thoughts src/assets/thoughts` is empty.
- [ ] 0 KB JS: `grep -c '<script' dist/client/index.html dist/client/about/index.html dist/client/now/index.html` shows only the inline `.js` class script (and GA4 if still present).
- [ ] `grep -rn "data-reveal\|data-hero\|data-brighten\|gsap\|wine-" src/pages/index.astro src/pages/about.astro src/pages/now.astro` → nothing.
- [ ] Meta description on Home is 140–160 characters; no peso figures (`grep -n "₱\|PHP " dist/client/index.html` → nothing); no banned words (`leverage|unlock|empower|genuinely|honestly|straightforward`) in the new Home/About copy.
- [ ] Portrait: LCP image has `fetchpriority="high"`, `srcset` max width ≤800, hairline border, no grayscale filter.
- [ ] Axe clean on `/`, `/about/`, `/now/` ([README](README.md) rule 9) plus a keyboard pass.
- [ ] `plan.md` boxes 34.1–34.6 and the Phase 34 DoD marked `[x] (YYYY-MM-DD)` as each passes.

## Verification

```
npm test && npx astro check && npm run build
```

```
# Content frozen
git diff v2-final -- src/content/pages/about.md src/content/now src/content/thoughts src/assets/thoughts
```

```
# JSON-LD: no ProfilePage on Home, exactly one on About
grep -c '"ProfilePage"' dist/client/index.html dist/client/about/index.html
```

```
# No script tags beyond the inline .js class script / GA4
for f in dist/client/index.html dist/client/about/index.html dist/client/now/index.html; do echo "== $f"; grep -o '<script[^>]*>' "$f"; done
```

```
# One h1, one tint, one primary button on Home
grep -o '<h1' dist/client/index.html | wc -l
grep -o 'panel-tint' dist/client/index.html | wc -l
grep -o 'btn-primary' dist/client/index.html | wc -l
```

```
# Banned words and peso figures in the three pages
grep -inE "leverage|unlock|empower|genuinely|honestly|straightforward|₱|PHP " dist/client/index.html dist/client/about/index.html
```

```
npx serve dist/client -l 4321 &   # astro preview is unsupported by @astrojs/vercel (core/preview/index.js:45); serve the build
npx @axe-core/cli http://localhost:4321/ http://localhost:4321/about/ http://localhost:4321/now/
```

## Risks & notes

- **One red fill above the fold.** §5.1 asks for a red hero button while §4 puts a red button in the nav; §3.1 says two red fills above the fold is wrong. 34.2 resolves it in favour of §3.1 (hairline hero button). It is a Paul-review item, cheap to flip.
- **Home h1 has no name.** The statement is the h1 by design. The name is in `<title>`, the wordmark, Person JSON-LD and the About h1; if search snippets under-represent the name after launch, add it to `heroWho`, not the h1.
- **`recentProjects` ties.** With `featured` unset on every seed, Home shows the three 2026 entries ordered by `order` (Oddhalls, Anakloud, Eyelicium). Setting `featured: true` on any project in Keystatic overrides this with no code change.
- **Strip duplication.** The six-step strip appears on Home, Work with me and the program page; if it is still copy-pasted when you reach 34.2, extract the component in this task (third use), not later.
- **Scoped-style trap again.** Hide-at-breakpoint rules in the page's `<style>` must be media queries, not `hidden lg:block` utilities (they lose to the scoped attribute selector).
- **Stale tokens in scoped `<style>` blocks** are invisible to the `wine-` grep and to Tailwind (Phase 31 note). `now.astro` and `about.astro` are the two known carriers; check by looking at the page, not just the grep.
- The old `heroIntro` is not migrated anywhere. It is recoverable from git (`v2-final`).

## Blocked on Paul

- Approve the Home hero copy (`heroStatement`, `heroWho`), including the "eleven years" figure and the delivery-area list.
- Approve the replacement "Connect" sentence on About and the three "How I work" lines as they appear on the page.
- Visual review of the hero (hairline vs red primary button) and the portrait crop on the PR preview.
- Optional: choose a featured project for Home (`featured: true`) if the three newest are not the three he wants first.
