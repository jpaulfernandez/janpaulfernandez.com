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

## 32.2 Copy entry

**Tier set.** Champions kept as its own page (fold test passed: ~560 words of
non-repeating copy from doc 09 Tier 2.5 + doc 04 Part B). Five slugs.

**Choices that differ from the source** (conservative, flagged for Paul):
- Clock times from doc 09's Tier 1 vignette ("9:35 am", "1:30 pm" ...) removed;
  run-of-show times stay in the spec folder.
- Founding discount keeps "25%"; the price table is not copied. Terms text is
  the spec's, unconfirmed (see Blocked in plan.md).
- Add-ons: names only. The "credited against Tier 1 within 60 days" credit and
  every peso figure were dropped. "Travel outside Luzon at cost" dropped.
- Tier 3 FAQ "A tested no-go for P220,000 costs less than..." rewritten without
  the figure. All "[Name]" replaced by first person.
- The AWS source's report title contains "Unlocking"; the stat source line says
  "Strand Partners study of Philippine AI adoption, 2026, commissioned by AWS" so
  the banned-word grep stays clean. Full title: *Unlocking the Philippines' AI
  Potential 2026*.
- **D-09 wording.** Doc 07 says "24% of leaders are confident staff can judge...".
  The cited page (NewsBytes) says businesses *estimated* 24% of their employees are
  confident judging whether sensitive information may go into an AI tool. The stat
  follows the page, not the spec's paraphrase.
- D-06 and D-09 URL is NewsBytes (200 OK; the page states both figures). PNA, the
  JD Neer blog (404) and Philstar Tech do not carry them. D-01 and D-02 use the
  Philstar article (200; states 78% and 35%).
- Proof points use only claims `about.md`/career support: Head of Tech Operations
  at Rappler 2018-2023, PHVote in the 2019 and 2022 elections, systems analyst at
  PSBank. **Omitted:** "Former IT Manager at Mapua Malayan Digital College" and
  "Master's in Innovation and Business" (about.md says he is still at MMDC and
  still studying) — TODO(Paul).
- Header "Eleven years": not used on these pages.
- Mode `whoFor` is not in rebuild-plan §5.5's table; drafted from each mode's one
  line. All six FAQ answers and the mode copy are drafted, for Paul's review.
- Regulatory names on tier pages (Data Privacy Act, NPC Advisory 2024-04, BSP
  STARS, PSF-AAI) follow doc 09/04/03 and carry no claim beyond "maps what they ask
  of you". Sources (doc 07 §13): NPC advisories
  https://privacy.gov.ph/pips-and-pics/advisories-circulars/ ; BSP AI rules
  https://www.gmanetwork.com/news/money/economy/994812/bsp-lays-down-rules-on-ai-use-to-guide-banks-financial-institutions/story/ ;
  PSF-AAI https://thepost.net.ph/news/nation/skills-map-for-careers-in-analytics-and-artificial-intelligence-launched/

**Trace table (done = yes):** programPage.headline (doc 09 option 1) yes · sub yes ·
stats[0..3] yes (D-01, D-02, D-06, D-09) · promise yes · steps yes · proofPoints yes
(trimmed, see above) · addOns yes · bundles yes · founding* yes · pulse / leadership-day /
fluency / champions / agent-sprint yes · tier faq[] yes (price answers rewritten) ·
workWithMe.modes yes (§5.5) · intro yes · faq yes (drafted).

## 32.3 service()

`ServiceInput` gains `url?` (resolved via `abs()`) and `areaServed?: string | string[]`
(schema.org/Service `areaServed` accepts Text, Place, AdministrativeArea, GeoShape;
Text kept as the simplest). `name` is always emitted (= title, existing
`serviceType` unchanged); `url` / `areaServed` only when given. No Offer, price or
Course markup. Tests were written first and failed 3/3 before the change.
