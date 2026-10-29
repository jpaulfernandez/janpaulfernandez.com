# Phase 34 notes

## 34.1 Home singleton fields

- `home` is now `heroStatement` (text, required) + `heroWho` (text, multiline, required) in `keystatic.config.ts` and `src/content.config.ts`; `home.json` rewritten with the rebuild-plan section 5.1 drafts, unchanged.
- "Eleven years": PSBank starts 2015 (`src/content/career/psbank.md`), 2015 to 2026 is 11. Kept.
- Base is Manila. Program spec doc 09 line 199 says Angeles City; not used (README rule 8). Delivery-area list follows the phase file; doc 09 lines 199 and 305 give two other variants. Logged under Blocked-on-Paul.
- "A college of working students" is from the plan draft; no other source checked. Flagged for Paul.
- Minimal `index.astro` edit to keep the build green: destructure `heroStatement`/`heroWho`, h1 = `heroStatement`, hero lead paragraph = `heroWho`, and the "Who I am" (`heroIntro`) section and its manifesto comment deleted. `cleanSnippet`/`withInlineLinks` and the rest of the page are left for 34.2.
- CTA wording conflict (20-minute vs plain "scoping call") logged; 34.2 uses the phase file's wording.

## 34.2 Home sections

- Section map (also the comment table at the top of `index.astro`): hero (no rule) → Three ways `.section-tight` → Program band `.section.section-ruled` (the one `.panel-tint`) → Projects `.section.section-ruled` → Thoughts `.section-tight` → Now `.section-tight` → Closing CTA `.section.section-ruled`.
- Reused, not recreated: `ProgramSteps.astro` (third caller; the phase file's `ProgramStrip` already exists under this name) and `ProjectRow.astro` (prop is `project`, it renders its own `<li>`). `projects/index.astro` already used `ProjectRow`, so it was not touched. ProjectRow shows title · kind · summary, no year; the phase file's "year · kind" is not added (the component is 33's, and Home stays a caller).
- Program singleton is `getEntry('programPage', 'program')`; the band reads `headline`, `sub`, `steps` from it. Nothing typed into Home except section labels and the closing sentence.
- Hero h1 runs at `--text-h1` (step-4), not `.display`'s step-5: the statement is 17 words and at 6rem it ran six lines and pushed `heroWho` below the fold at 1280. Still Fraunces via `.display`; one scoped override.
- Hero primary is a hairline `.btn.btn-ghost` "Work with me"; second action is a `.link` "See the program". The `<main>` has exactly one `.btn-primary` (closing CTA); the built file counts 3 because the header carries the desktop and mobile copies of the nav button.
- Thoughts reuse `PostListItem` unedited, inside `<ul class="rows">`. Its titles are `h2` (the component's own choice), so the Home outline is h1 → h2 section labels / h2 post titles; no level skip.
- Now, briefly: label + "Full timeline" left, three rows right on md+; mono date `ink-400`, title links to `/now/`. No snippet, no dot.
- Closing CTA: new sentence "Not sure which of these you need? That's what the first call is for." (logged for Paul), email as `mailto:` (same address as the footer and Work with me), red "Book a scoping call" → `/work-with-me/#enquire`.
- Description 160 characters, from the phase file's example.
- Removed: gallery strip and `getCollection('gallery')`, `cleanSnippet`, `withInlineLinks`, the 32.6 program and "What I do" placeholders, the hero Now rail, the `.statement` / `.photo-sheet__frame` styles. `git grep "heroGreeting\|heroIntro" -- src` → nothing.
- Checks: build/check/test green; one `h1`, one `panel-tint`, no `ProfilePage`, scripts are the inline `.js` class script, GA4 (two tags) and JSON-LD only; no `_astro/*.js`; no banned words or peso figures; no horizontal scroll at 1280.
