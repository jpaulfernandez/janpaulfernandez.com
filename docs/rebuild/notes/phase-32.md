# Phase 32 — working notes

Records the phase file asks to put "in the PR". Work is on `main` (no PR, per
Paul's override), so they live here.

## 32.1 Schemas

- `program` collection (Astro + Keystatic "Program tiers"): `label, title,
  tagline, audience, duration, leavesWith[], problem, happens[], outcomes,
  artefacts[], faq[{q,a}], order`. No price field. `label` is an addition to
  rebuild-plan §5.6's list (kickers and tables need "Tier 2.5").
- `programPage` singleton (Astro collection `programPage`, entry id `program`;
  Keystatic singleton `programPage`; file `src/content/pages/program.json`).
  Additions beyond §5.6: `promise`, `steps[]`, `proofPoints[]`, `addOns[]`,
  `bundles[].tiers`.
- `workWithMe` gains `modes[]` and `faq[]` (`faq` is an addition). The Astro
  schema requires both, so the file now has a frontmatter block (it had none).
- Drift: `workWithMe.md` had no frontmatter before this task.
- Keystatic's reader returns `null` for the `workWithMe` and `about` singletons
  (`.md` file + `format.contentField`) — pre-existing, identical for `about`; not
  changed here. Collection and `programPage` read fine.
