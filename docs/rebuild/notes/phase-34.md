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

## 34.3 Portrait crop

- `.portrait` defined once in `global.css` `@layer components`: hairline `--line` border, `--radius-sm` (2px), overflow hidden; `img` 4:5, `object-fit: cover`, `object-position: 50% 18%`. No grayscale, no hover transition. About's scoped `.portrait`, `:global(img)` grayscale/hover and reduced-motion rules deleted.
- Home hero: portrait first in the DOM, left column (`28rem` from 64rem, `40vw` from 48rem); below 48rem it stacks above the h1 at `70vw` (max 22rem). At 375px the h1 starts at ~483px, inside the first screen.
- Home `<Image>`: `widths={[320, 480, 640, 800]}`, the phase file's `sizes`, `loading="eager"`, `fetchpriority="high"`. Added `width={800}` (and `width={720}` on About, whose `widths`/`sizes` are unchanged): without it Astro's fallback `src` is the 4128px original (762 KB) and the `width`/`height` attributes say 4128×6192. With it the fallback is the largest srcset variant.
- Bytes: 320w 13 KB, 480w 26 KB, 640w 42 KB, 800w 59 KB (Home); About 480w 26 KB, 720w 51 KB. The 799 KB original is still emitted to `_astro/` by the build but referenced by no page.
- `object-position: 50% 18%` checked at 375, 768 and 1280: the face sits in the upper third at all three. Paul's visual review on the preview still stands (Blocked).
- Checks: build/check/test green; axe 0 violations on `/` and `/about/`; no horizontal scroll at 375/1280; Home scripts are the `.js` class script, GA4 and JSON-LD only.

## 34.4 About

- Order: page head (h1, `about.md` prose, portrait) → Experience `.section` (no rule) → How I work `.section-tight` → Connect `.section.section-ruled`. `about.md`, the Timeline, `ProfilePage`, `person()` and breadcrumbs untouched.
- h1 stays "Jan Paul Fernandez", not "About": step 2 says h1 "About" but the phase file's Risks note relies on the name living in the About h1 (Home's h1 has no name), and the Done-when asks that About render the same sentences as before. One-word change if Paul prefers "About".
- Portrait is About's LCP element at 1024 and 1280 (PerformanceObserver), so it got `fetchpriority="high"`; `widths`/`sizes`/`width` unchanged.
- How I work: three `.rows` items, h3 label + `.subtext` sentence (label left of sentence from 768px). Copy, for Paul's review:
  - "Simplify, then do." / "I simplify until someone can retell it at dinner, then put them to work on their own documents. People forget slides. They remember what they did." (label: doc 09 §1 proof point "Method"; sentence: doc 09 §4 "Why I teach it this way", unchanged apart from "I").
  - "Artefacts leave the room." / "Every session produces something you keep: a draft AI policy, process maps, vendor scorecards, prompt libraries, a working automation, a tested prototype agent." (label: rebuild-plan §5.2, not verbatim in doc 09; sentence: doc 09 §1 proof point "Artefacts", verbatim).
  - "Vendor-neutral." / "I build with Claude and Codex but teach the concepts rather than a product. You get the same advice whichever tools you choose." (doc 09 §4, third person turned first; "The program is" became "You get").
- Connect: "Available for consultation, talks, and fractional product ownership." replaced by "I work with teams three ways: with you, for you, or as an adviser." (phase file's wording; matches the `workWithMe` modes With you / For you / Advising). The two buttons (red `btn-primary` "Work with me", ghost LinkedIn) became two `.link` text links; LinkedIn carries an sr-only "(opens in a new tab)". `<main>` has no `.btn-primary`: the header's is the only red fill.
- Scoped `.statement-sm` deleted (the global one in `@layer components` is identical). The last How I work row drops its bottom border so it doesn't double Connect's rule.
- Left for Phase 36: the career `.rail` (global) paints its first dot `red-500`, so About's MMDC entry has a small red node below the fold; it was written for the Now rail, which now uses its own `.tl` styles. Not touched (global, outside 34.4's files).
- Checks: build/check/test green; one h1; `ProfilePage` ×1; scripts are `.js` class, GA4, JSON-LD; `grep "paper-\|ink-9\|wine-\|data-reveal"` → nothing; no banned words; no horizontal scroll at 375/1280.
