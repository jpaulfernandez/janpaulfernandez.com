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

## 33.3
- `src/pages/projects/[slug].astro` is generic (73 lines): `getStaticPaths` filters `hasPage` and passes `relatedProjects(project, withPages, 3)`. Head: visible `Breadcrumbs` (same trail as the JSON-LD, the Phase 32 tier-page pattern; it replaces the stub's ad-hoc back link), kicker `{KIND_NOUN} · {period ?? year}{ · role}`, one `h1`, summary as `.subtext`, then `Visit {hostname} ↗` when `link` is set. Body in `.prose` in its own ruled section; "Related" only when `related.length > 0` (absent for Oddhalls today).
- The Visit button is `btn-ghost`, not `btn-primary`: the header CTA is already the one red fill above the fold (same call as the tier pages).
- New `src/components/ProjectRow.astro` (the row: title · kind noun · summary · arrow; destination page → link → inert). Extracted now because Related and the 33.4 index both use it, and Phase 34's Home "Recent projects" is a third caller. Its scoped CSS is inlined on every project page (~600 B) even when Related is absent; Astro includes an imported component's styles regardless.
- Oddhalls text vs the 33.2 `oddhalls-after.txt`: only additions in the head (breadcrumb "Home / Projects", kicker "Product · 2026", "Visit oddhalls.janpaulfernandez.com ↗" restored) and the back link replaced by the breadcrumb. Same six images. Scripts on the page: the `.js` inline, GA4 (two tags) and JSON-LD only.
