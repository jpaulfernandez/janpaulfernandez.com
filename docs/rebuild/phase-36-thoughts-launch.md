# Phase 36 — Thoughts re-skin + launch

**Slice:** every page speaks the same visual language, the five representative URLs score ≥95 on all four Lighthouse categories, the docs describe the site that exists, and the rebuild is launched · **Depends on:** Phase 35 · **Spec:** [rebuild-plan.md §5.7, §8, §9](../../rebuild-plan.md)

## Context

Thoughts content is frozen (the only content-side rule that matters here): no file under `src/content/thoughts/` or `src/assets/thoughts/` changes, so this phase touches only the *presentation* of articles, the index and the leftover utility pages. By now Phase 31 has already swapped colours mechanically and Phase 32 has removed the workshop links; what is left is the design work §5.7 asks for — the four article blocks, the reading column, covers — plus the pages nobody redesigned (404, thanks, colophon, HTML sitemap), the proof (Lighthouse, whole-rebuild DoD) and the hand-over (docs, memory, launch).

Must not change: thought bodies, the Thoughts filter's behaviour (its script stays ≤2 KB gzip), RSS, OG cards, `blogPosting` JSON-LD, topic archive titles from T30. JS budget: **0 KB on articles, ≤2 KB on `/thoughts/`** ([README](README.md) rule 7).

## Read first

- [rebuild-plan.md](../../rebuild-plan.md) §5.7 (Thoughts re-skin), §9 (the DoD this phase checks off), §3.1 (token pairs).
- `src/components/blocks/{KeyTakeaway,PullQuote,Callout,Embed}.astro` (33 / 40 / 48 / 45 lines; each has a scoped `<style>` that may still carry old `var(--color-…)` tokens, `linear-gradient`, translucent fills), `src/layouts/ArticleLayout.astro` (236 lines: masthead ~64–110, cover `<figure>` ~114–125, TOC `<details>` styles ~195–225, prev/next `.card` links ~150–170, Related `.rows`).
- `src/pages/thoughts/index.astro`, `src/components/PostListItem.astro`, `src/pages/topics/[topic].astro`, `src/pages/colophon.astro`, `src/pages/404.astro`, `src/pages/thanks.astro`, `src/pages/sitemap.astro`.
- `.shell` is 84rem; `.shell-narrow` is **58rem** since commit `d7afb0a` (widened because 44rem crushed tables and diagrams). The v3 spec's 38rem is a *measure* for text, not a container — see 36.1.
- Docs to update: `CLAUDE.md` (66 lines; `AGENTS.md` and `GEMINI.md` are one-line `@CLAUDE.md` imports, so they follow automatically), `spec.md` (276 lines, v1 July 2026), `voice.md` (126 lines), `.claude/skills/fable-frontend-developer/SKILL.md`, `rebuild-plan.md` header, `plan.md`.
- Memory (outside the repo): `~/.claude/projects/-Users-polaris-projects-janpaulfernandez-com/memory/v3-rebuild-direction.md` and its line in `MEMORY.md`.

## Tasks

### 36.1 Article blocks + ArticleLayout

**Files:** `src/components/blocks/KeyTakeaway.astro`, `PullQuote.astro`, `Callout.astro`, `Embed.astro`, `src/layouts/ArticleLayout.astro`.
**Test-first?** No (UI; the contrast table below is the check).

Contrast pairs used (measured; keep them): `red-700` on `blue-100` 5.27:1, `ink-900` on `blue-100` 12.9:1, `ink-600` on `blue-100` 6.8:1, `ink-400` on `blue-100` 4.8:1, `ink-400` on white 5.7:1, `red-700` on white 6.26:1, `ink-900` on `red-500` 5.0:1.

Steps:
1. **KeyTakeaway:** a `blue-100` panel, `border: 1px solid var(--blue-200)`, `border-left: 3px solid var(--red-500)` (the red rule is a fill, non-text), radius ≤4px, **no gradient, no glow**. Label: mono, uppercase, `0.14em`, text "Key takeaway" in `red-700`. Body `ink-900`. Delete the wine border, the `linear-gradient` and the "only place wine appears" comment; replace with one line saying this is the block the v3 tint exists for. Keep the `<aside>` + `<slot />` API unchanged (MDX and Keystatic depend on it).
2. **PullQuote:** Fraunces **italic**, `ink-900`, display step `h3`, max-width ~30ch, a 2px `blue-200` rule on the left. Fraunces italic is a separate file in `@fontsource-variable/fraunces`: check what Phase 31.1 imported; if the italic axis is not loaded, add `import '@fontsource-variable/fraunces/wght-italic.css'` (**verify the exact file name in `node_modules/@fontsource-variable/fraunces/`**) in the frontmatter of `PullQuote.astro` itself so only pages that use the block carry it. Do not preload it. Without it the browser fakes an italic, which is the failure to avoid.
3. **Callout:** three variants carried by the hairline alone: all get `1px solid var(--blue-200)`, a 2px left rule, no fill, radius ≤4px, body `ink-900`, label in mono `ink-400`. `note` rule `blue-200`; `idea` rule `ink-600`; `warning` rule `red-500` and label `red-700` (the only accent spend, as before). Keep the `variant` prop and labels exactly.
4. **Embed:** replace `bg-ink-800` with `bg-paper-100`, border `blue-200`, radius ≤4px; the wrapper may use the full `.shell-narrow` width. No thought currently uses `<Embed>`, so check it with a throwaway `src/pages/zz-embed-check.astro` that renders one `<Embed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="check" />`, look at it, and **delete the file before committing** (`git status` must not list it).
5. **ArticleLayout column and measure:** keep the container `.shell-narrow` (58rem — tables and diagrams need it), but set the *text* measure to 38rem: in the scoped style (or the `.prose` rules in `global.css` `@layer components`) give `.prose > p, > ul, > ol, > blockquote, > h2, > h3, > h4` `max-width: 38rem`, and leave `table`, `figure`, `img`, `pre`, `.callout`, `.key-takeaway`, `iframe` free to use the container width. Body is Inter 17px/1.6 ([README](README.md) rule 5), so 38rem is ~68ch. Open `what-is-a-token-anyway` (tables, blocks) and `a-quick-map-on-large-language-models` (diagram) at 1280px to confirm nothing crushes — this reverses nothing from `d7afb0a`, it only narrows the paragraphs.
6. **Covers:** `<figure class="shell">` (not narrow) so the cover runs to the shell edge; `<Image src={cover} alt={coverAlt ?? ''} widths={[800, 1200, 1600]} sizes="(min-width: 84rem) 80rem, 100vw" loading="eager" fetchpriority="high" />`; drop the `rounded-[var(--radius-lg)] border` classes (radius ≤4px, no border). Keep the empty-`alt` rule for undescribed covers. Only `if-ai-takes-all-the-jobs-what-do-we-actually-do` and `morty-without-the-crystal` have covers.
7. **Masthead/nav:** metadata line (type, author, dates, reading time) in mono; the labels `ink-400`, the author link `red-700`-underlined (an inline link). TOC `<details>`: hairline `blue-200` border, no `--surface-1` fill, delete the `transition`/`rotate` on `.toc-mark` (no motion). Prev/next links: replace the `.card card-interactive` anchors with two `.row-link`-style ruled links (no card). The back link reads "← Thoughts" (the nav calls it Thoughts; v2 said "Writing"). Strip leftover `data-reveal*`/`data-hero`.
8. `grep -n "paper-\|ink-[0-9]\|wine-\|--color-\|gradient\|box-shadow\|backdrop" src/components/blocks src/layouts/ArticleLayout.astro` and review every hit against the v3 tokens.

**Done when:** the four blocks render in v3 tokens on `what-is-a-token-anyway` (all of KeyTakeaway, Callout, PullQuote), `if-ai-takes-all-the-jobs-what-do-we-actually-do` (cover + KeyTakeaway + PullQuote) and a plain essay; the cover is full shell width; paragraphs measure ~68ch; no `<script` in any article's built HTML beyond the two [README](README.md) exceptions.

### 36.2 Thoughts index, topics, PostListItem, remaining pages

**Files:** `src/pages/thoughts/index.astro`, `src/components/PostListItem.astro`, `src/pages/topics/[topic].astro`, `src/pages/404.astro`, `src/pages/thanks.astro`, `src/pages/colophon.astro`, `src/pages/sitemap.astro`.
**Test-first?** No.

Steps:
1. **Thoughts index:** if 33.4 already moved the chip styles to `global.css` as `.chip`, finish the job (delete the scoped `.segmented/.seg/.tag/.filter-chip` rules; markup uses `.chip`). Hide the filter bars unless `.js` (they are dead buttons without JS today): `.filter-bar { display: none }` / `:global(.js) .filter-bar { display: block }` in the scoped style. **Do not edit the filter `<script>`** — it is the behaviour the phase must preserve; measure it (Verification) and keep ≤2 KB gzip. All rows remain visible without JS.
2. **PostListItem:** type and date in mono `ink-400`, title `ink-900` with hover `red-700` underline (a link affordance, not a fill), excerpt `ink-600`; hairline `blue-200` between rows. Do not touch the unused `stage` prop (a Blocked-on-Paul decision in `plan.md`, not part of the rebuild).
3. **Topic archives:** `topics/[topic].astro` keeps `TOPIC_INTROS`, `TOPIC_NAMES` and the `#tag` h1; sweep any leftover old token, intro as `.subtext`. Titles must still not start with `#` (T30).
4. **404:** destinations follow the v3 IA — Home, Work with me, Projects, Thoughts, Gallery, About, Now — rendered as a ruled `.rows` list, not `.tag` pills (pills are out). Copy stays in Paul's voice; one `h1`; `noindex` kept; remove `data-hero`/`data-reveal*`.
5. **Thanks:** the copy says "I'm probably mid-workshop" — workshops are retired (32.6). Reword to the same register without the word ("probably mid-session" or similar) and flag the line in the PR; back link becomes a hairline `.btn`.
6. **Colophon:** confirm the credits Phase 31.7 wrote — Fraunces, Inter, JetBrains Mono, Astro, Tailwind, Keystatic, Vercel — and that nothing still says Switzer, Courier Prime, GSAP or Lenis (`grep -n -i "switzer\|courier\|gsap\|lenis" src/pages/colophon.astro` → nothing). Sweep the two old utility lines (~96, ~111).
7. **HTML sitemap:** it was the heaviest token user (27 lines, swept in 31.5); polish only: the intro sentence (line ~61) must stop saying "workshop"; sections are Pages, Program, Projects (only `hasPage`, per 33.6), Thoughts, Topics, Photo sets; counts truthful.

**Done when:** `grep -rn -i "workshop" src/pages/sitemap.astro src/pages/thanks.astro src/pages/404.astro` → nothing; `grep -rn "data-reveal\|data-hero\|wine-\|gsap" src` → nothing; `/thoughts/` works with and without JS.

### 36.3 Lighthouse ≥95 × 4 on five URLs

**Files:** none unless a score fails (then the fix is its own commit, named after the cause).
**Test-first?** No.

Steps:
1. `npm run build`, serve the output (`astro preview` is unsupported by the Vercel adapter): `npx serve dist/client -l 4321 &`. Run Lighthouse ad hoc (never added to `package.json`), mobile preset (the default), for these five URLs: `/`, `/work-with-me/`, `/work-with-me/ai-resilient-organisation/`, `/thoughts/if-ai-takes-all-the-jobs-what-do-we-actually-do/` (cover + blocks: the worst case for LCP), `/gallery/`:
   ```
   for u in / /work-with-me/ /work-with-me/ai-resilient-organisation/ /thoughts/if-ai-takes-all-the-jobs-what-do-we-actually-do/ /gallery/; do
     npx lighthouse "http://localhost:4321$u" --only-categories=performance,accessibility,best-practices,seo --quiet --chrome-flags="--headless=new" --output=json --output-path="${TMPDIR:-/tmp}/lh.json"
     node -e "const r=require('${TMPDIR:-/tmp}/lh.json');console.log('$u',Object.entries(r.categories).map(([k,v])=>k+' '+Math.round(v.score*100)).join('  '))"
   done
   ```
2. Repeat on the **Vercel preview URL** of the PR (real compression, HTTP/2 and cache headers) — those are the numbers recorded. Take the median of three runs if a score is within 2 points of the threshold.
3. Record the 5 × 4 scores in the PR description (table).
4. If a score is under 95, diagnose in this order and fix only the cause: LCP element (Home portrait and thought cover need `fetchpriority="high"`, eager, sized `sizes`); font loading (only the two preloads from 31.1; `font-display` and fallback metrics for CLS); image dimensions; render-blocking CSS; the GA4 tag. **The GA4 `gtag` script is Paul's call (R8):** if it alone holds a score under 95, report it with the measured delta; do not remove it.

**Done when:** every cell of the table is ≥95 on the Vercel preview, or each miss is explained with its cause and Paul's decision.

### 36.4 Docs, voice, memory

**Files:** `spec.md`, `CLAUDE.md`, `voice.md`, `.claude/skills/fable-frontend-developer/SKILL.md`, `rebuild-plan.md`, `plan.md`, and the memory note (outside the repo).
**Test-first?** No.

Steps:
1. **`spec.md`:** replace the v1 text with a short v3 spec (target ≤120 lines): purpose and success metrics (keep §1's three goals if still true), the seven pages and IA (a pointer to [rebuild-plan.md §4](../../rebuild-plan.md), not a copy), stack, content model summary (a table of collections with their fields as they are in `content.config.ts` *now*), hard constraints, out-of-scope. Decisions stay in `rebuild-plan.md`; `spec.md` links to it and does not restate it. The v1 text remains in git history (`v2-final`).
2. **`CLAUDE.md` final pass** (31.7 already rewrote the brand/type/motion bullets): re-read top to bottom and check — the Workflow section points to `plan.md` and `docs/rebuild/`; no GSAP/motion vocabulary, `#FFF` ceiling, wine, Switzer, Courier, "site is dark, full stop" lines; the YAGNI ladder, `@layer components`, scoped-style trap, one-h1, schema parity, single Person `@id` rules all survive; "Commands" is accurate (add that `npm run preview` does not work with the Vercel adapter; serve `dist/client`); the "Standards" pointer still resolves. `AGENTS.md`/`GEMINI.md` need no edit.
3. **`.claude/skills/fable-frontend-developer/SKILL.md`:** line ~54 still lists the v1 tokens "moss/beige/citrus/ink"; rewrite it to the v3 token names; line ~70 ("Motion inside `prefers-reduced-motion: no-preference`") becomes "no client motion; the only scripts are the filters and the gallery". Touch nothing else.
4. **`voice.md` check:** (a) line ~82 links to `src/lib/workshops.ts` (`marketStats`), deleted in 32.6 — repoint the rule to the program stats (`stats[].sourceUrl` in the `program` singleton); (b) line ~20 "Teaches AI workshops" and the before/after example at ~100 quote copy that no longer exists — replace with a line of live v3 copy (from Home or the program page) and flag the swap to Paul; (c) confirm the banned-vocabulary list matches [README](README.md) rule 8.
5. **`rebuild-plan.md`:** header `Status:` → "built, launched YYYY-MM-DD (see docs/rebuild/)" and the "Supersedes, once approved" line → past tense. No other edit.
6. **`plan.md`:** mark 36.x as they pass; move any still-open items (GA4, Cloudflare Images, Wikidata, `stage`/`seo` unused fields) under "Blocked-on-Paul items" with their current wording.
7. **Memory note:** update `v3-rebuild-direction.md` — description and body say the rebuild is built and live as of the launch date, that the dark-build rules are gone from CLAUDE.md, and that `docs/rebuild/` is now the record; update its line in `MEMORY.md` to match. Keep `paul-rejects-saas-and-ai-aesthetics.md` as is.

**Done when:** `grep -n -i "gsap\|lenis\|switzer\|courier\|wine\|moss\|citrus" CLAUDE.md spec.md voice.md .claude/skills/fable-frontend-developer/SKILL.md` → nothing, no dead links in `voice.md`, `rebuild-plan.md` status reads "built".

### 36.5 Whole-rebuild Definition of Done

**Files:** none; this is the [rebuild-plan.md §9](../../rebuild-plan.md) checklist, run against the final branch. Record the output of each command in the PR.

Steps: run every command under Verification ("Whole-rebuild") and tick the matching box below. Anything failing blocks 36.6.

**Done when:** every box in "Whole-rebuild DoD" below is ticked.

### 36.6 Launch (Paul)

**Files:** none (Paul's actions; the agent prepares the checklist in the PR).

Steps:
1. Confirm every phase PR (31–35) is merged and the Phase 36 PR's Vercel preview passes 36.3 and 36.5. Merging to `main` deploys production — Paul's call.
2. **Announcement gate (separate from merging):** BIR registration and written MMDC employer clearance are required before the program is *announced* or invoiced ([plan.md](../../plan.md) Blocked-on-Paul). The pages may be live; do not promote them until both clear.
3. After deploy, check redirects on production: `curl -sI https://www.janpaulfernandez.com/workshops/ | head -3` expects `301` and the program URL; repeat for the other four old paths.
4. **Search Console:** open the property → Sitemaps → resubmit `https://www.janpaulfernandez.com/sitemap-index.xml`; URL Inspection → request indexing for `/`, `/work-with-me/`, `/work-with-me/ai-resilient-organisation/`.
5. **One week later:** Search Console → Pages: look at "Not found (404)" and "Page with redirect". Old `/workshops/*` URLs must sit under *redirect*, not 404. Any 404 on a still-linked URL gets a `redirects` entry in `astro.config.mjs` (a new `plan.md` task).
6. Optional hygiene: `git push origin v2-final` so the baseline tag is not only local; create the Wikidata item (Phase 30 B2).

**Done when:** Paul ticks steps 1–5; step 5 is dated a week after the deploy.

## Definition of Done

- [ ] `npm run build`, `npx astro check`, `npm test` green ([README](README.md) rule 4).
- [ ] KeyTakeaway, PullQuote, Callout (3 variants), Embed re-skinned to v3 tokens; no gradient, shadow or blur; `what-is-a-token-anyway` and `if-ai-takes-all-the-jobs-what-do-we-actually-do` reviewed by eye at 375px and 1280px.
- [ ] Article text measure ~68ch (38rem) while tables and diagrams still use the 58rem container; covers span the shell.
- [ ] `/thoughts/` filter works with and without JS, its bundle ≤2 KB gzip, filter bars absent without JS.
- [ ] 404, thanks, colophon and HTML sitemap carry no "workshop", Switzer, Courier, GSAP or Lenis, and list the v3 routes.
- [ ] Lighthouse mobile ≥95 in Performance, Accessibility, Best Practices and SEO on the five URLs on the Vercel preview, scores recorded in the PR (or each miss explained, GA4 aside).
- [ ] `spec.md`, `CLAUDE.md`, `voice.md`, the frontend skill file describe the built site; `rebuild-plan.md` status is "built"; the memory note is updated.
- [ ] Whole-rebuild DoD (below) all ticked.
- [ ] `plan.md` boxes 36.1–36.5 and the Phase 36 DoD marked `[x] (YYYY-MM-DD)`; 36.6 marked by Paul.

### Whole-rebuild DoD ([rebuild-plan §9](../../rebuild-plan.md))

- [ ] All seven pages live (Home, About, Now, Projects, Work with me, Thoughts, Gallery): each returns 200 from the build output.
- [ ] `git diff v2-final -- src/content/pages/about.md src/content/now src/content/thoughts src/assets/thoughts` is empty.
- [ ] No `#000` and no white type on red: `grep -rniE "#000\b|#000000|color: ?white|text-white|bg-black" src` reviewed, every hit justified or removed; red fills carry `ink-900` text only.
- [ ] No text under 4.5:1: axe clean on every route type (home, about, now, work-with-me, program overview, a tier page, projects index, a project, thoughts index, an article, a topic, gallery, a set, colophon, 404).
- [ ] `grep -rn "wine-" src` → 0; `grep -rn "data-reveal\|data-hero\|data-brighten\|data-parallax" src` → 0; `gsap` absent from `package.json` and `package-lock.json`.
- [ ] JS budget: 0 KB on Home, About, Now, Work with me, program pages, articles; ≤2 KB `/thoughts/` and `/projects/`; ≤6 KB `/gallery/`.
- [ ] `/workshops/*` return 301 with the five Locations from [rebuild-plan §4](../../rebuild-plan.md) on the preview; `/workshop` goes straight to the program page (no chains).
- [ ] No peso figures in the build (`grep -rn "₱\|PHP " dist/client` → nothing on v3 pages).
- [ ] Gallery pinch and viewer verified on a real iPhone and Android phone (Phase 35, Paul).
- [ ] One Person `@id`, one `ProfilePage` (on `/about/`), no dangling `@id` in any page's JSON-LD.

## Verification

```
npm test && npx astro check && npm run build
```

```
# Thoughts filter budget and article script inventory
for f in $(grep -o '/_astro/[^"]*\.js' dist/client/thoughts/index.html | sort -u); do printf '%s ' "$f"; gzip -c "dist/client$f" | wc -c; done
grep -o '<script[^>]*>' dist/client/thoughts/if-ai-takes-all-the-jobs-what-do-we-actually-do/index.html
```

```
# Whole-rebuild checks
git diff v2-final -- src/content/pages/about.md src/content/now src/content/thoughts src/assets/thoughts
grep -rn "wine-\|data-reveal\|data-hero\|data-brighten\|data-parallax" src
grep -c gsap package.json package-lock.json
grep -rn "₱\|PHP " dist/client | head
grep -rniE "#000\b|#000000|color: ?white|text-white|bg-black" src
```

```
# Every route type under axe (serve the build first; axe runs via npx, never added to package.json)
npx serve dist/client -l 4321 &
npx @axe-core/cli http://localhost:4321/ http://localhost:4321/about/ http://localhost:4321/now/ http://localhost:4321/work-with-me/ http://localhost:4321/work-with-me/ai-resilient-organisation/ http://localhost:4321/projects/ http://localhost:4321/thoughts/ http://localhost:4321/thoughts/what-is-a-token-anyway/ http://localhost:4321/topics/ai/ http://localhost:4321/gallery/ http://localhost:4321/colophon/ http://localhost:4321/404.html
```

```
# Redirects (on the Vercel preview URL, then on production at launch)
for p in /workshops/ /workshops/ai-fluency/ /workshops/leadership-ai/ /workshops/ai-for-business/ /workshops/vibe-coding/ /workshop; do echo "$p"; curl -sI "https://<preview-host>$p" | grep -iE "^HTTP|^location"; done
```

Lighthouse commands are in 36.3.

## Risks & notes

- **38rem vs the 58rem container.** Commit `d7afb0a` widened `.shell-narrow` for tables and diagrams; the v3 measure is a text rule. 36.1 step 5 keeps both. If a table or diagram is cramped on the preview, widen *that element's* allowance, not the paragraph measure.
- **Fraunces italic** is a second font file; if the PullQuote renders with a synthesized italic, the import in 36.1 step 2 is missing.
- **Lighthouse on a static `serve` is optimistic** (no Vercel headers). The recorded numbers come from the preview URL.
- **GA4 can cap Performance.** It is Paul's pending decision (R8); the phase reports the delta, never removes the tag.
- **Embed has no live use**; the throwaway check page must not be committed.
- **Memory file is outside the repo.** It is edited by the agent but not committed; mention the change in the PR so Paul knows.
- Not in scope here: the unused `thoughts.stage` field and `seo` singleton (decision pending in `plan.md`), a booking widget, search, backlinks ([rebuild-plan §10](../../rebuild-plan.md)).

## Blocked on Paul

- Merge decisions, in order, for each phase PR and the final one (production deploys on merge).
- Announcement gate: BIR registration and MMDC written clearance before the offer is promoted.
- GA4 keep/replace decision if it is what holds Lighthouse under 95.
- Approve the thanks-page and voice.md example rewrites (copy changes in his voice).
- Search Console actions (steps 4–5 of 36.6) and the one-week 404 review; the Wikidata item.
