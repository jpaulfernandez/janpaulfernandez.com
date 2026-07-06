# T10 — Thoughts collection & custom blocks

**Phase:** 3 · **Depends on:** T06 · **Spec:** §3.1, §6, §8.1

## Goal

The `thoughts` collection (MDX) with all four custom component blocks authorable in Keystatic and rendering as Astro components.

## Collection schema (both configs, identical fields)

`thoughts`: title (req), slug, type (`essay` | `note`, req), topics (string array, req — free tags; seed vocabulary: technology, economy, psychology), stage (`seedling` | `budding` | `evergreen`, OPTIONAL), excerpt (req, plain text ≤160 chars), cover (image, optional), publishedDate (req), updatedDate (optional), draft (boolean, default false), body (MDX with component blocks).

Astro side: content collection over `src/content/thoughts`, zod schema, and **draft filtering** — a `getPublishedThoughts()` helper in `src/lib/thoughts.ts` that filters `draft` and sorts by publishedDate desc. Every consumer (index, home, RSS, topic pages) must use it — never raw `getCollection('thoughts')`.

## Custom blocks (spec §6) — Keystatic component blocks → Astro components

| Block | Props | Rendering |
|---|---|---|
| `KeyTakeaway` | children | Citrus card: citrus-500 left border, citrus tinted bg (citrus-300 at low opacity or a computed tint passing AA), "KEY TAKEAWAY" label in Archivo Black small caps |
| `Callout` | variant: note/idea/warning, children | Moss-toned card, small icon or label per variant |
| `PullQuote` | children | Oversized Archivo Black quote, essay use |
| `Embed` | url, title | Responsive iframe wrapper (aspect-video), `loading="lazy"`, `title` attr required |

Steps: install `@astrojs/mdx`; define blocks in `keystatic.config.ts` fields; create the four components in `src/components/blocks/`; map them to MDX via the components prop when rendering (T11 wires the page — here, prove rendering on a scratch route or the styleguide).

Standard primitives (headings w/ auto-anchors, images via Astro `<Image>`, code via built-in Shiki, tables, blockquote) come from MDX defaults + `rehype-slug` + `rehype-autolink-headings` (install both).

## Definition of Done

- [ ] Create a draft test post in /keystatic using ALL four blocks + h2/h3, image, code block, table — everything renders styled
- [ ] `getPublishedThoughts()` exists, tested (vitest) for draft-filtering and date sorting
- [ ] h2/h3 get id anchors in output HTML
- [ ] stage is genuinely optional (post without stage builds fine)
- [ ] Keystatic ↔ Astro schema parity reviewed field-by-field; build + check + test pass
