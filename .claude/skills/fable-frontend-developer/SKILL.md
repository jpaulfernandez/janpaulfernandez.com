---
name: fable-frontend-developer
description: >
  Frontend engineering approach and standards for the janpaulfernandez.com codebase
  (Astro 5, Tailwind 4, Keystatic, fully static). Use this skill whenever writing,
  reviewing, or debugging any frontend code in this repo — components, layouts, pages,
  styles, content collections, JSON-LD, or client-side scripts — even if the task
  doesn't mention "frontend" explicitly. Also use it when deciding whether to add a
  dependency, an island, or an abstraction.
---

# Fable Frontend Developer

How to tackle coding problems in this codebase, and the standards the output must meet. spec.md defines what to build; plan.md defines when; CLAUDE.md defines workflow. This file defines *how*.

## Problem-solving approach

**1. Restate the goal before touching code.** One sentence: what must be true when you're done, and how you'll verify it. If you can't write that sentence, you don't understand the task yet — re-read the task file or ask. Confusion voiced early is cheap; confusion buried in a diff is expensive.

**2. Read before you write.** Look at neighboring components and existing helpers first. Match existing patterns even when you'd personally structure it differently — consistency beats local elegance in a codebase multiple models will touch.

**3. For bugs: reproduce → isolate → fix → verify.** Get a failing state you can trigger on demand before changing anything. Isolate by removing variables (does it happen in a fresh build? with the block removed?). Fix the cause, not the symptom — if a wrong date renders, the bug is likely in data or schema, not the template that shows it. Verify the reproduction now passes, and check the fix didn't break adjacent behavior.

**4. For features: walk the rendering ladder, stopping at the first rung that works.**

1. Static HTML rendered at build (Astro component, no JS)
2. Native HTML behavior (`<details>` for accordions, `<dialog>`, form validation attributes, CSS `:hover`/`:focus-within`)
3. CSS only (transitions, sticky positioning, scroll behavior)
4. A few lines of vanilla JS in an inline `<script>`
5. A framework island — requires justification in the PR/commit message; there is currently no legitimate use for one on the public site

This ladder exists because the site's value proposition (Lighthouse ≥ 95, zero JS-gated content, AI-crawler-readable) dies by a thousand small scripts.

**5. When stuck between two designs, pick the one that's easier to delete.** Most decisions here are reversible if kept small and local. The expensive mistakes are dependencies and abstractions that spread.

## Standards

### Astro

- Data fetching (`getCollection`, filtering, sorting) happens in frontmatter or `src/lib/` helpers — never in client scripts.
- Shared list logic lives in `src/lib/` as pure functions with vitest tests. Components stay thin.
- Use `getPublishedThoughts()` (draft-filtered, sorted) — raw `getCollection('thoughts')` in a page is a bug.
- Images always via `astro:assets` `<Image>` with meaningful `alt` (or `alt=""` if decorative). Never a raw `<img>` to a source file.
- Props get TypeScript interfaces. `npx astro check` must pass — types are how the next model avoids misusing your component.

### Components

- Extract a component on the **second** use, not the first. A one-page section stays inline in the page.
- Props over slots for data; slots for composition of markup. Avoid boolean-flag props that fork rendering into two unrelated trees — that's two components.
- Name by role, not appearance: `PostCard`, not `GreenCard`.

### Styling

- Tailwind utilities in markup; design tokens only from the `@theme` block (moss/beige/citrus/ink, font vars). A hardcoded hex or px font-size in a component is a defect.
- If a utility string needs the same 6+ classes in many places, that's a component signal, not an `@apply` signal.
- Respect the palette contract: beige = canvas, moss = workhorse, citrus = scarce (CTAs, Key Takeaway, one hero accent — never body text).
- Mobile-first: write the 375px layout, then add `md:`/`lg:` upward. Check both extremes before calling it done.

### Client-side JS (when the ladder reaches rung 4)

- Inline `<script>` in the .astro file, vanilla, no build-step dependencies.
- Progressive enhancement is non-negotiable: the page must be complete and correct with JS disabled — JS may only enhance (filter, toggle), never gate content.
- Keep scripts under ~40 lines. Bigger means the design is wrong: reconsider the ladder.

### Accessibility (checked per task, not deferred to launch)

- Keyboard first: everything interactive is reachable and operable via keyboard, with visible focus.
- Semantic elements before ARIA; ARIA only to fill real gaps (`aria-pressed` on filter chips, `aria-current` on nav, `aria-live` for dynamic counts).
- One `h1` per page; heading levels never skip; landmarks (`header`/`nav`/`main`/`footer`) once each.
- Motion inside `prefers-reduced-motion: no-preference`. Contrast AA minimum — verify, don't eyeball, whenever creating a new text/bg pairing.

### SEO / structured data

- Every page: unique title + meta description through BaseLayout props, canonical, OG tags.
- JSON-LD only via `src/lib/schema.ts` builders — never hand-write a `<script type="application/ld+json">` in a page. The Person `@id` must stay `https://janpaulfernandez.com/#person`, referenced, never duplicated.
- New/changed structured data gets pasted through validator.schema.org before the task is closed.

### Dependencies

Walk CLAUDE.md's YAGNI ladder before any `npm install`. Additionally: prefer packages already blessed by spec §8 (astro integrations, fontsource, keystatic); anything else needs a one-line justification comment in the commit. A dependency for something expressible in ≤10 lines of code is the wrong trade.

### Testing & verification

- Pure functions in `src/lib/` → vitest, test-first. Good targets: schema builders, related-posts logic, date/sort helpers. Don't unit-test Astro templates — verify those against the task's Definition of Done.
- Before declaring any task done: `npm run build` && `npx astro check` && `npm test`, plus a view-source sanity check of the affected page (correct head tags, no unexpected `<script>`).
- If Keystatic schemas changed, confirm `keystatic.config.ts` and `src/content.config.ts` still agree field-by-field — silent drift is this stack's classic failure.

## Example: applying the ladder

Task: "make the FAQ collapsible."
Wrong: install an accordion component library, or write a React island with open-state.
Right: rung 2 — `<details><summary>` pairs, styled with Tailwind. Zero JS, keyboard accessible for free, works for every crawler.

Task: "filter the thoughts index by topic."
Wrong: React island with filter state (rung 5) — it's show/hide, not state management.
Right: render all posts statically, `data-*` attributes on cards, ~30 lines of vanilla JS toggling a hidden class (rung 4), full list visible without JS.
