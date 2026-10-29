# T01 — Scaffold Astro 5 + Tailwind 4

**Phase:** 1 · **Depends on:** nothing · **Spec:** §8, §8.2

## Goal

A running Astro 5 project with Tailwind CSS 4, TypeScript strict, static output, and the repo layout from spec §8.2.

## Context you need

- Astro 5 is content-driven and outputs static HTML by default (`output: 'static'` is the default; do not set it explicitly unless the default changes).
- Tailwind 4 integrates via the **Vite plugin** (`@tailwindcss/vite`), NOT the legacy `@astrojs/tailwind` integration. Tailwind 4 is configured in CSS with `@theme`, not `tailwind.config.js`.
- Do not install React, Keystatic, sitemap, RSS, or anything else yet. Later tasks add dependencies when they need them (YAGNI).

## Steps

1. Scaffold in the repo root: `npm create astro@latest . -- --template minimal --typescript strict --no-git --no-install`, then `npm install`. Preserve existing `spec.md`, `plan.md`, `tasks/`, `CLAUDE.md`, `.claude/` — if the scaffolder refuses a non-empty dir, scaffold in a temp dir and move files in.
2. `npm install tailwindcss @tailwindcss/vite`. Add the plugin to `astro.config.mjs` under `vite.plugins`.
3. Create `src/styles/global.css` containing `@import "tailwindcss";`. (Tokens come in T02 — leave it minimal.)
4. Create empty directory structure: `src/components/`, `src/layouts/`, `src/content/`, `src/lib/`, `public/`.
5. Move `image_3.webp` (if present in root) to `src/assets/paul.webp`.
6. Replace the default index page with a minimal `src/pages/index.astro` that imports the global css and renders `<h1>Jan Paul Fernandez</h1>`.
7. Add `.gitignore` (node_modules, dist, .astro, .vercel, .env*).

## Definition of Done

- [ ] `npm run dev` serves the index page without errors or warnings
- [ ] `npm run build` succeeds and emits static HTML to `dist/`
- [ ] A Tailwind utility class (e.g. `text-red-500` on the h1, then remove) visibly applies in dev — proves the Vite plugin works
- [ ] `npx astro check` passes
- [ ] Repo layout matches spec §8.2 (dirs may be empty)
- [ ] No dependencies beyond astro, tailwindcss, @tailwindcss/vite, typescript-related
