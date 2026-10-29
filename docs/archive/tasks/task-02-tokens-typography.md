# T02 — Design tokens & typography

**Phase:** 1 · **Depends on:** T01 · **Spec:** §4.1, §4.2

## Goal

All spec §4 design tokens available as Tailwind 4 theme values / CSS variables; Archivo Black and Lato self-hosted and applied; fluid type scale working.

## Context you need

- Tailwind 4: define tokens in `src/styles/global.css` inside an `@theme { }` block. `--color-moss-700: #3B5240;` becomes utilities like `bg-moss-700`, `text-moss-700` automatically.
- Fonts are self-hosted via `@fontsource` packages — **no Google Fonts requests** (spec: faster, no consent banner).
- Archivo Black has exactly one weight (400). Lato needs 400, 700, and italics.

## Steps

1. `npm install @fontsource/archivo-black @fontsource/lato`.
2. Import in `global.css`: archivo-black 400; lato 400, 700, 400-italic. Set `font-display: swap` (fontsource default — verify in the generated CSS).
3. In `@theme`, define exactly the spec §4.1 colors: `--color-moss-900 #1E2B20`, `--color-moss-700 #3B5240`, `--color-moss-500 #5F7D5C`, `--color-moss-200 #CDD9C6`, `--color-beige-100 #F5F1E6`, `--color-beige-50 #FBF9F2`, `--color-ink #26251F`, `--color-citrus-500 #E8A13C`, `--color-citrus-300 #F4C566`. Also `--font-display: "Archivo Black", sans-serif` and `--font-body: "Lato", sans-serif`.
4. Fluid scale as theme font-size vars using `clamp()`: h1 40→64px, h2 28→40px, h3 22→26px, body 17–18px with line-height 1.7, small 14px. Use rem-based clamp (e.g. `clamp(2.5rem, 1.7rem + 3.5vw, 4rem)`).
5. Base element styles in a `@layer base`: `body` = beige-100 bg, ink text, font-body; `h1,h2` = font-display, moss-900, tight tracking; `h3` = Lato Bold. Links = moss-700, hover moss-500.
6. Create a throwaway page `src/pages/styleguide.astro` rendering all tokens: color swatches, h1–h3, body, small, a link, a citrus CTA button. (Keep it — useful through Phase 4; delete in T16.)

## Rules to encode (do not violate later)

- Citrus never for body text; only CTAs, Key Takeaway, one hero accent.
- Every text/bg pair must pass WCAG AA (4.5:1 body, 3:1 large). Check ink-on-beige-100, moss-700-on-beige-100, moss-900-on-citrus-500 with a contrast tool before finishing.

## Definition of Done

- [ ] `/styleguide` shows all 9 colors and the full type scale correctly
- [ ] Network tab in dev shows fonts served from same origin (no fonts.googleapis.com / gstatic)
- [ ] H1 measurably scales between 40px (375px viewport) and 64px (≥1140px viewport)
- [ ] Contrast pairs listed above verified ≥ AA; note the ratios in a comment in global.css
- [ ] `npm run build` passes
