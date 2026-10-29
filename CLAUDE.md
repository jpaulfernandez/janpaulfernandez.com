# CLAUDE.md — how to work on janpaulfernandez.com

Personal site for Jan Paul Fernandez: Astro 5 + Tailwind 4 + Keystatic (git-based CMS), fully static, deployed on Vercel. The v3 rebuild (phases 31–36) is built. **spec.md** is the short current spec (purpose, stack, content model, constraints); **rebuild-plan.md** records what was decided and why and wins where the two disagree; **plan.md** is the tracker and the Blocked-on-Paul list; `docs/rebuild/phase-NN-*.md` hold task detail and `docs/rebuild/notes/` record what was actually built. The v1 spec is in git history (tag `v2-final`).

These rules apply to any coding agent (Claude, Gemini, GPT) and to humans.

## Workflow — plan.md is the tracker

1. **Always start at plan.md.** Work the first unchecked task, in order. Don't skip ahead or parallelize phases.
2. Read the task's phase file in `docs/rebuild/phase-NN-*.md` completely before writing code (finished v1/v2 task files are in `docs/archive/`, not `tasks/`). It has context, steps, and a **Definition of Done**.
3. A task is complete ONLY when every DoD checkbox passes. Then mark it in plan.md: `[x] (YYYY-MM-DD)`. Never check a box with failing builds/tests or partial work.
4. If a task is blocked (missing info from Paul, upstream bug), don't improvise around it silently: log it under "Blocked-on-Paul items" in plan.md, use an obvious placeholder, and say so.
5. If you discover necessary work no task covers, don't just do it — add it to plan.md (new checkbox + task file if non-trivial) so the tracker stays truthful.
6. **Branches and deploys.** The v3 rebuild was worked directly on local `main` at Paul's choice, not branch-per-phase. Nothing is pushed until he says so: pushing or merging to `main` deploys production on Vercel, and that is Paul's call.

## YAGNI — the decision ladder

Before adding ANY dependency, abstraction, component, or config, ask in order:

1. Does this need to exist at all?
2. Is it already in the codebase?
3. Does the stdlib / language do it?
4. Does the platform do it natively? (Astro built-ins, native HTML — `<details>` before a JS accordion, CSS before JS, static HTML before an island)
5. Does an already-installed dependency do it?
6. Is it one line of code?

Only after all six: add the minimum that works. Concrete house examples: reading time is `Math.ceil(words/200)`, not a package; robots.txt is a static file, not an integration; filters are ~30 lines of vanilla JS, not a React island.

## Working principles

- **Think before coding.** State your understanding of the task and intended approach first. If the task file and reality disagree, or you're unsure — **say so and ask; never assume, never hide confusion.** A wrong guess buried in a diff costs more than a question.
- **Simplicity first.** The boring, obvious solution wins. No speculative abstraction; extract a component on the second use, not the first.
- **Surgical changes.** Touch only files the task requires. No drive-by refactors, renames, or formatting sweeps. Diffs should read as exactly one intention.
- **Goal-driven / TDD where it pays.** Pure logic (`src/lib/`: schema builders, thoughts helpers) gets vitest tests written FIRST. UI work is verified against the DoD checklist instead — run the checks, don't eyeball.
- **Don't trust memory over docs.** Astro 5 / Tailwind 4 / Keystatic APIs move fast; when wiring integrations, verify against current official docs rather than recalled API shapes.

## Hard constraints (from spec — violating these is a bug)

- Fully static output. React exists ONLY for the Keystatic admin and must never ship to the public site.
- **Client JS: zero by default.** The public site ships no JavaScript except the Thoughts and Projects index filters (inline in their pages) and the Gallery (`src/scripts/gallery.ts`: density control + viewer, imported only by the gallery pages), each within its budget: 0 KB on Home, About, Now, Work with me, program pages and articles; ≤ 2 KB on the Thoughts and Projects indexes; ≤ 6 KB on the Gallery. The inline `.js` class script in `<head>` and the GA4 tag are the only exceptions. Everything else climbs the YAGNI ladder: vanilla before a framework, CSS before JS, static HTML before an island. There is no animation library and no scroll-triggered motion, and none comes back. Any hidden resting state lives only behind the `.js` ancestor class, so the page reads fully with scripts blocked.
- One `h1` per page. Semantic landmarks. WCAG AA contrast.
- **Component CSS in `global.css` must sit inside `@layer components`.** Tailwind emits utilities in `@layer utilities`, and an unlayered rule beats any layered one regardless of specificity — an unlayered `.btn { display: inline-flex }` silently defeats `hidden sm:inline-flex` in the markup. Same trap in Astro `<style>` blocks, which scope selectors with an attribute and so outrank a single utility class: hide with a media query there, not with `lg:hidden`.
- **Palette is white (v3), nine tokens and no others.** `paper` `#FFFFFF` is the ground (`paper-100` `#F7F8FA` an alternate section ground, at most once per page). Type is `ink-900` (headings, body, nav) → `ink-600` → `ink-400`. `red-500` is for fills, display words ≥ 24px and rules — never body-size text; `red-700` is for inline links, small accent text and the focus ring. `blue-100` / `blue-200` are grounds and hairlines only: blue is a ground, not a type colour, so no blue text. Tailwind's default colours are reset, so an off-palette class is a dead class.
- **`ink-900` is the darkest value.** No pure black; no white type on red; red fills carry `ink-900` type (5.0:1). Red is scarce: more than one red fill above the fold means one is wrong.
- **The type ramp has three tiers, and subtext is not metadata.** `ink-900` headings and body → `ink-600` secondary reading copy (8.09:1) → `ink-400` metadata **only** — dates, counters, kickers, separators. A sentence someone is meant to read never gets `ink-400` or `--text-small`; it gets `.subtext` (body size, `ink-600`).
- **A hairline is the only surface.** If a block must be distinguished from the page it gets a 1px `--line` rule (`--line` is `blue-200`) — radius ≤ 4px, no shadow, no `backdrop-filter`, no gradients, no glows. The one tinted block is `.panel-tint` (`blue-100`), at most once per page. Glass cards, pill buttons, floating blurred chrome and ambient glows read as a SaaS landing page; they do not come back.
- **Section rhythm carries the structure, not fills (Phase 29).** `.section` + `.section-ruled` opens a new argument; a bare `.section-tight` continues the one before it. Before Phase 29 `.section-tight` was used 22 times against `.section`'s 3, with a `border-t` on every one, so every page read as an undifferentiated wall. Don't default new sections to tight-and-ruled — decide which of the two a section is. A rule marks a turn in the argument, not an interval.
- Three families, self-hosted via `@fontsource-variable/*`: **Fraunces** (h1, h2, display), **Inter** (body, h3, UI) and **JetBrains Mono** (`.mono`, `.kicker`, dates, code).
- Keystatic and Astro content schemas must stay field-identical — check both files in any schema change.
- Person JSON-LD `@id` is `https://janpaulfernandez.com/#person`, defined once, referenced everywhere.
- v2 backlog items (search, graveyard, backlinks…) are out of scope. Don't build them "while you're in there." (Dark mode is not on the list: the site is white, full stop; there is no toggle and no dark theme to maintain.)

## Commands

```
npm run dev        # dev server + /keystatic admin
npm run build      # static build to dist/
npx astro check    # type-check .astro files
npm test           # vitest run (pure logic in src/lib/)
```

`npm run preview` does not work with the Vercel adapter. To look at the built site, serve the static output: `npx serve dist/client -l 4321`. Redirects only exist on a Vercel preview.

Definition of done for any code change, beyond the task's own DoD: build passes, check passes, tests pass.

## Standards

Frontend patterns, a11y checklist, and problem-solving approach: see `.claude/skills/fable-frontend-developer/SKILL.md`.
