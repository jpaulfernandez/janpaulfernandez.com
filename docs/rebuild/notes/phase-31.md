# Phase 31 — working notes

Records the phase file asks to put "in the PR". Work is happening directly on
`main` (no PR, per Paul's override), so they live here.

## 31.2 Tokens

**Colour reset.** Verified against tailwindcss.com/docs/theme (2026-10-29):
`--color-*: initial` removes every default colour utility in the namespace
(including `white`/`black`), leaving only the declared ones. Built CSS emits
exactly nine `--color-*` variables: red-500, red-700, blue-100, blue-200,
ink-900, ink-600, ink-400, paper, paper-100.

**Ladders.** `--step--2 … --step-5` and `--space-3xs … --space-3xl` copied
verbatim from `https://oddhalls.janpaulfernandez.com/_astro/Base.LfziiOH7.css`
(`:root`). They sit in `:root` as plain custom properties (not `@theme`), so
nothing tree-shakes them. `@theme static` was not needed.

**Step ↔ semantic name.**

| Semantic token | Points at | Range |
|---|---|---|
| `--text-micro` | `--step--2` | 11.5 → 12.5px |
| `--text-small` | `--step--1` | 13.1 → 14.4px |
| `--text-body` | fixed `1.0625rem` (§3.2; not a step) | 17px |
| `--text-lead` | `--step-1` | 18.7 → 22.7px |
| `--text-h3` | `--step-2` | 22.4 → 31.2px |
| `--text-h2` | `--step-3` | 28 → 46.4px |
| `--text-h1` | `--step-4` | 35.2 → 65.6px |
| `--text-display` | `--step-5` (= §3.2 display clamp) | 41.6 → 96px |

`--step-0` (16 → 18px) is defined but unmapped: body stays 17px fixed per the
phase file.

**Other decisions.**
- `--line` = `var(--color-blue-200)`. `--line-strong` and `--surface-1/2/3`
  deleted from `:root` (31.5 sweeps their remaining callers in components and
  pages; until then those declarations resolve to nothing).
- `--measure: 38rem` added to `:root`.
- `--ease-out-quint` kept (used by ~15 scoped `<style>` blocks for hover
  transitions); its GSAP comment deleted.
- `@layer base`: the dark-build webkit scrollbar styling was deleted rather
  than re-coloured (platform default on white). Focus ring moved to `red-700`
  here (it lives in base). Headings: h1/h2 Fraunces 500, `-0.02em`,
  `font-optical-sizing: auto`; h3/h4 Inter 600. Body drops `ss01` and the
  `-0.011em` tracking (31.9 judges by eye).
- `a` in base is now `red-700`, underlined (per 31.2 step 8). Every link that
  is *not* an inline prose link (nav, row links, buttons, cards, tags) must
  override colour and `text-decoration` — components do this in 31.3;
  utility-styled links in markup are 31.5/31.8's concern.
