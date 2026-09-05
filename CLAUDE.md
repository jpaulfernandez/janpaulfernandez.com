# CLAUDE.md — how to work on janpaulfernandez.com

Personal site for Jan Paul Fernandez: Astro 5 + Tailwind 4 + Keystatic (git-based CMS), fully static, deployed on Vercel. Full requirements live in **spec.md**. Build order lives in **plan.md**.

These rules apply to any coding agent (Claude, Gemini, GPT) and to humans.

## Workflow — plan.md is the tracker

1. **Always start at plan.md.** Work the first unchecked task, in order. Don't skip ahead or parallelize phases.
2. Read the task's file in `tasks/` completely before writing code. It has context, steps, and a **Definition of Done**.
3. A task is complete ONLY when every DoD checkbox passes. Then mark it in plan.md: `[x] (YYYY-MM-DD)`. Never check a box with failing builds/tests or partial work.
4. If a task is blocked (missing info from Paul, upstream bug), don't improvise around it silently: log it under "Blocked-on-Paul items" in plan.md, use an obvious placeholder, and say so.
5. If you discover necessary work no task covers, don't just do it — add it to plan.md (new checkbox + task file if non-trivial) so the tracker stays truthful.

## YAGNI — the decision ladder

Before adding ANY dependency, abstraction, component, or config, ask in order:

1. Does this need to exist at all?
2. Is it already in the codebase?
3. Does the stdlib / language do it?
4. Does the platform do it natively? (Astro built-ins, native HTML — `<details>` before a JS accordion, CSS before JS, static HTML before an island)
5. Does an already-installed dependency do it?
6. Is it one line of code?

Only after all six: add the minimum that works. Concrete house examples: reading time is `Math.ceil(words/200)`, not a package; robots.txt is a static file, not an integration; filters are ~30 lines of vanilla JS, not a React island. GSAP and Lenis are the standing exception, added deliberately in Phase 20 and scoped to one file — they are not a precedent for the next dependency.

## Working principles

- **Think before coding.** State your understanding of the task and intended approach first. If the task file and reality disagree, or you're unsure — **say so and ask; never assume, never hide confusion.** A wrong guess buried in a diff costs more than a question.
- **Simplicity first.** The boring, obvious solution wins. No speculative abstraction; extract a component on the second use, not the first.
- **Surgical changes.** Touch only files the task requires. No drive-by refactors, renames, or formatting sweeps. Diffs should read as exactly one intention.
- **Goal-driven / TDD where it pays.** Pure logic (`src/lib/`: schema builders, thoughts helpers) gets vitest tests written FIRST. UI work is verified against the DoD checklist instead — run the checks, don't eyeball.
- **Don't trust memory over docs.** Astro 5 / Tailwind 4 / Keystatic APIs move fast; when wiring integrations, verify against current official docs rather than recalled API shapes.

## Hard constraints (from spec — violating these is a bug)

- Fully static output. React exists ONLY for the Keystatic admin and must never ship to the public site.
- **Client JS (amended in Phase 20).** The site is no longer zero-JS: `src/scripts/motion.ts` (GSAP + ScrollTrigger + SplitText + Lenis, ~54KB gzip) loads on every page. That is the *only* sanctioned bundle. Everything else still climbs the YAGNI ladder — vanilla before a framework, CSS before JS, static HTML before an island. **Nothing else may import GSAP:** a page asks for motion with a `data-*` attribute and `motion.ts` decides what it means.
- **Motion must be removable.** Every hidden resting state lives behind a `.js` ancestor class set by a blocking inline script in `<head>`, so a page with the bundle blocked, broken, or still loading renders fully legible. `prefers-reduced-motion` bails out of the runtime entirely. Never put an animation's start state in CSS unguarded by `.js`.
- One `h1` per page. Semantic landmarks. WCAG AA contrast.
- **Component CSS in `global.css` must sit inside `@layer components`.** Tailwind emits utilities in `@layer utilities`, and an unlayered rule beats any layered one regardless of specificity — an unlayered `.btn { display: inline-flex }` silently defeats `hidden sm:inline-flex` in the markup. Same trap in Astro `<style>` blocks, which scope selectors with an attribute and so outrank a single utility class: hide with a media query there, not with `lg:hidden`.
- Palette is dark (Phase 20). `ink-*` is the ground, `paper-*` is the type, `wine-*` is the accent — the inverse of the Phase 9–19 meanings. Wine is never body text: CTAs, Key Takeaway, kicker dots, and hand-placed `.flare` words only. On the `#050505` ground use `wine-300`/`wine-400` for type (6.5:1 / 4.9:1); `wine-500`/`wine-600` are fills only. `paper-600` is non-text.
- Two families: Switzer (display, headings, prose) and Courier Prime (`.mono`, `.kicker`, dates, code). Both self-hosted from `public/fonts` and `@fontsource`.
- Keystatic and Astro content schemas must stay field-identical — check both files in any schema change.
- Person JSON-LD `@id` is `https://janpaulfernandez.com/#person`, defined once, referenced everywhere.
- v2 backlog items (search, graveyard, backlinks…) are out of scope. Don't build them "while you're in there." ("Dark mode" left this list in Phase 20 by being resolved, not built: the site is dark, full stop. There is no toggle and no light theme to maintain.)

## Commands

```
npm run dev        # dev server + /keystatic admin
npm run build      # static build to dist/
npx astro check    # type-check .astro files
npm test           # vitest (from T07 onward)
```

Definition of done for any code change, beyond the task's own DoD: build passes, check passes, tests pass.

## Standards

Frontend patterns, a11y checklist, and problem-solving approach: see `.claude/skills/fable-frontend-developer/SKILL.md`.
