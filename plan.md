# janpaulfernandez.com — Implementation Plan

Source of truth for build order and completion status. Derived from [spec.md](spec.md).

## How to use this file (for any coding agent: Claude, Gemini, GPT)

1. Find the first unchecked task below. Tasks within a phase run in order; do not start a phase before the previous one is checked off.
2. Open the linked task file in `tasks/`. It contains full context, steps, and a **Definition of Done**.
3. Do only what the task file says. If a task seems to require work not listed, stop and flag it — don't expand scope.
4. When every Definition of Done item passes, mark the checkbox here `[x]` and append the completion date, e.g. `[x] (2026-07-08)`.
5. Never check a box with failing builds, failing tests, or partial work.

Phases are vertical slices: each ends with a deployable, visibly-improved site — never a pile of disconnected scaffolding.

---

## Phase 1 — Foundation

**Slice delivered:** branded site shell (tokens, fonts, nav, footer) live on Vercel at janpaulfernandez.com.

- [x] (2026-07-05) [T01 — Scaffold Astro 5 + Tailwind 4](tasks/task-01-scaffold.md)
- [x] (2026-07-05) [T02 — Design tokens & typography](tasks/task-02-tokens-typography.md)
- [x] (2026-07-05) [T03 — Base layout, nav, footer, SEO head](tasks/task-03-base-layout.md)
- [x] (2026-07-05) [T04 — Keystatic setup](tasks/task-04-keystatic.md)
- [ ] [T05 — Deploy pipeline, robots.txt, sitemap](tasks/task-05-deploy.md)

## Phase 2 — Core pages

**Slice delivered:** Home, About, and Now pages live with real content, all CMS-editable, with Person/WebSite/ProfilePage JSON-LD.

- [x] (2026-07-05) [T06 — Core content collections (career, now, pages)](tasks/task-06-core-collections.md)
- [x] (2026-07-05) [T07 — JSON-LD schema library](tasks/task-07-schema-jsonld.md)
- [x] (2026-07-05) [T08 — Home page](tasks/task-08-home.md)
- [x] (2026-07-05) [T09 — About & Now pages](tasks/task-09-about-now.md)

## Phase 3 — Thoughts

**Slice delivered:** full publishing system — filterable index, article pages with custom blocks, topic archives, RSS, OG images, seed posts.

- [x] (2026-07-05) [T10 — Thoughts collection & custom blocks](tasks/task-10-thoughts-collection-blocks.md)
- [x] (2026-07-05) [T11 — Article layout & BlogPosting schema](tasks/task-11-article-layout.md)
- [x] (2026-07-05) [T12 — Thoughts index, topic archives, filters](tasks/task-12-thoughts-index.md)
- [x] (2026-07-05) [T13 — RSS feed & OG image generation](tasks/task-13-rss-og.md)
- [x] (2026-07-05) [T14 — Seed content (2–3 posts)](tasks/task-14-seed-content.md)

## Phase 4 — Work with me + launch

**Slice delivered:** lead-gen page with form, FAQ schema, accessibility pass, Lighthouse ≥ 95, launched.

- [x] (2026-07-05) [T15 — Work with me page](tasks/task-15-work-with-me.md)
- [x] (2026-07-05) [T16 — Polish, accessibility, launch](tasks/task-16-launch.md)

---

## Blocked-on-Paul items (spec §10)

Track here; tasks note where these are needed. Use placeholders until provided, never invent real data.

- [x] Social profile URLs for `sameAs` (needed by T07)
- [x] Contact email for form (needed by T15)
- [x] Exact PSBank / RightCrowd / Rappler dates (needed by T06)
- [x] Topics for seed essays (needed by T14)
- [ ] **Deploy wiring for T05** (needs Paul's GitHub + Vercel + DNS access). Code parts of T05 are DONE (sitemap integration excluding /styleguide + /keystatic; static `public/robots.txt` with GPTBot/ClaudeBot/PerplexityBot/Google-Extended allows + Sitemap line). Still pending Paul: (1) push repo to GitHub; (2) import to Vercel — framework preset Astro, static, no adapter; (3) confirm push-to-main deploys + PR preview URLs; (4) point janpaulfernandez.com apex + www→apex redirect via Vercel domains; (5) verify in prod: `/robots.txt`, `/sitemap-index.xml`, `/` return 200 and `/keystatic` returns 404. Also: `/keystatic` admin UI should be clicked through once in `npm run dev` to confirm it writes entries to `src/content/now/`.

Social profiles
Linkedin - https://www.linkedin.com/in/jpaulfernandez/
Instagram - https://www.instagram.com/goofffball/
Contact email - jpaul.fernandez18@gmail.com
Dates - Psbank, 2015 - 2018, Rightgrowd, 2018, Rappler 2018 - 2023

Topic Seeds
AI (artificial intelligence)
Technology
Economics
Psychology

## Phase 5 — UI/UX redesign (Paul's direct request, 2026-07-05)

Requested by Paul via Cowork session; supersedes parts of T03/T08/T12/T15 visuals. Build + astro check + vitest all pass.

- [x] (2026-07-05) Notch nav: fixed header docked as a "MacBook notch" at page top, detaches into a floating pill on scroll (vanilla JS toggle + CSS transitions, reduced-motion safe)
- [x] (2026-07-05) Brand logo: ouroboros-vine mark (death of self / renewal / plants) — `src/components/LogoMark.astro`, 3 drafts in `public/logo-ouroboros-{1,2,3}.svg`, favicon updated
- [x] (2026-07-05) Hero: conversational intro ("Hi, I'm Paul.") + "Invite me to coffee" CTA → /work-with-me#contact; home singleton fields renamed heroGreeting/heroIntro (Keystatic + content.config kept field-identical)
- [x] (2026-07-05) Now on homepage: one-liner inside hero pulled from latest now entry (standalone section removed)
- [x] (2026-07-05) Thoughts listing: PostCard grid → PostListItem rows (title, excerpt, date, tags, optional cover) on home, /thoughts, /topics; PostCard deleted
- [x] (2026-07-05) Services: consulting-only lineup (Product Consultation / Talks & Workshops / Fractional Product Owner), rendered as sticky stacking color cards (`ServiceStack.astro`); dev services + "What I bring to the table" removed; ServiceCard deleted
- [x] (2026-07-05) Employment history removed from homepage (Timeline stays on /about)
- [x] (2026-07-05) Bento footer: tiled grid on green gradient + SVG grain
- [x] (2026-07-05) /thoughts filters: boxed 3-group panel → compact toolbar (type segmented control + topic chips; stage filter dropped, stage badge kept on rows)
- [x] (2026-07-06) Article page redesign: screenshot-inspired header, centralized left-margin TOC with subtle hover states, mobile bottom pill TOC accordion, smooth scroll animations, solid terracotta/color callouts, generous prose line-height and kerning

## Phase 6 — Photo Gallery & Visual Extensions (Paul's direct request, 2026-07-07)

Requested by Paul via chat; adds photo gallery with tag filtering, licensing CTA, and dynamic Bento footer.

- [x] [T17 — Photo Gallery (/gallery), Licensing CTA, & Bento Footer Integration](tasks/task-17-gallery.md)
- [x] (2026-07-07) Now timeline end node: added a quirky "End of timeline" node to `/now` that displays at the bottom of the timeline or when the timeline is empty.
- [x] (2026-07-07) Thoughts cleanup & zero states: removed seed/test articles in `src/content/thoughts/` and added quirky, cohesive zero states to both `/thoughts` and Home (`/`).

## Out of scope (v2 — do not build)

Dark mode, Idea Graveyard, backlinks/hover previews, search, library page, webmentions, newsletter, footnotes/sidenotes.

