# T15 — Work with me page

**Phase:** 4 · **Depends on:** T06, T07 · **Spec:** §5.5, §7.2

## Goal

/work-with-me: services, proof points, process, FAQ (with FAQPage schema), and a working contact form — the lead-gen page.

## Steps

1. **services collection** (Keystatic + Astro, spec §8.1): title, description, icon (string name or image), order, faq (array of {question, answer}). Seed the four services from spec §5.5 with their taglines (Digital Transformation Consulting — assess/roadmap/execute; Web & App Development — banking-grade to newsroom-fast; Talks & Workshops; AI Implementation). Draft 5–6 FAQ entries total (distributed across services or a shared list — pick whichever structure is simpler to render; note the choice).
2. Page sections in order: intro (from `workWithMe` singleton) → 4 service cards (reuse `ServiceCard.astro` from T08; migrate the home teaser to read from this collection too — removes T08's hardcoding) → "What I bring to the table" proof points → "How it works" 3 steps (Call → Proposal → Build) → FAQ (`<details>/<summary>` — native, accessible, zero JS) → contact.
3. **Contact:** Web3Forms free-tier form (name, email, message) posting to Paul's email using access key; build the form with redirect to `/thanks`, plus always-working `mailto:` link. Include honeypot field. Cal.com link only if Paul provides one (YAGNI otherwise).
4. Form UX: labels (not placeholder-as-label), required indicators, Web3Forms redirect to a simple `/thanks` page (noindex).
5. JSON-LD: `service()` per offering + `faqPage()` from FAQ entries + breadcrumbs.

## Definition of Done

- [x] All 6 sections render; services and FAQ editable in /keystatic
- [x] Home teaser now reads the services collection (T08 hardcoding gone)
- [x] FAQ works keyboard-only, no JS shipped for it
- [x] Form posts to Web3Forms; mailto works regardless
- [x] FAQPage + Service JSON-LD valid on validator.schema.org
- [x] /thanks has noindex; build + check pass
