# Phase 33 notes

## 33.1
- Helpers in `src/lib/projects.ts`: `PROJECT_KINDS`, `ProjectKind`, `KIND_LABEL`, `KIND_NOUN`, `sortProjects`, `getProjects`, `groupProjectsByYear`, `projectsByKind`, `hasPage`, `relatedProjects`, `recentProjects`. `sortProjects` copies before sorting (the old `getProjects` sorted the collection array in place); there is a no-mutation test.
- Tests were run red (13 failing) before the implementation. `astro check` was not run at 33.1 (types need the 33.2 schema), per the phase file.

## 33.2
- Schema: `kind`, `period`, `role`, `summary` (replaces `description`), `metaDescription`, `cover`, `tags`, `featured`, `order`, plus `body` in Keystatic. Both config files carry the same field list.
- Out-of-list edits so the build stays green after `description` became `summary` (also a plan.md checkbox): `src/pages/index.astro` (summary), `src/pages/sitemap.astro` (summary), `src/pages/og/[...route].ts` (`metaDescription ?? summary`, one line), `src/pages/projects/index.astro` (summary; rewritten in 33.4).
- `keystatic.config.ts`: the thoughts `body: fields.mdx(...)` block moved into a shared `articleBody(assetDir)` helper so projects and thoughts cannot drift; thoughts output is unchanged.
- Oddhalls MDX is at `src/content/projects/oddhalls.mdx`; the six images are relative `../../assets/projects/oddhalls/*.png` and are optimised by Astro (same six webp outputs as before).
- `[slug].astro` is an interim stub (about 45 lines): filters `hasPage`, renders `<Content>` with the four blocks inside `.prose`, back link, h1, summary. 33.3 replaces it. The stub has no "Visit" button yet (the CTA links inside the body remain).
- Text parity (built page text before/after, markup stripped): all sentences identical. Differences: `<title>` (now `Oddhalls — Paul Fernandez`, the known conscious change), the old inline tag line and lead paragraph moved into the body unchanged, summary line added by the template, table header words added (`Fact / Detail / Note`, `Spec / Detail`) because markdown tables need a header row, caption label and text joined in one italic paragraph (`Cull Stage. Cull stage: ...`), the head "Visit" button absent until 33.3, and line-wrapping.
