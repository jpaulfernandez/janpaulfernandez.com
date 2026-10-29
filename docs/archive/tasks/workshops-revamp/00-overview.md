# Phase 27 — Workshops revamp: personal reframe + course detail pages

**Phase:** 27 · **Depends on:** existing `/workshops` (Phase 22) · **Spec:** Paul's direct request (2026-09-08)

This folder is the plan for one change delivered as six independent files. Read this
overview first — it holds the architecture, the routing, the collection schema, and
the research that every page brief leans on. Then the five page files stand alone:

- [`01-page-workshops.md`](01-page-workshops.md) — the revised `/workshops` landing
- [`02-course-ai-fluency.md`](02-course-ai-fluency.md) — `/workshops/ai-fluency`
- [`03-course-ai-for-business.md`](03-course-ai-for-business.md) — `/workshops/ai-for-business`
- [`04-course-vibe-coding.md`](04-course-vibe-coding.md) — `/workshops/vibe-coding`
- [`05-course-leadership-ai.md`](05-course-leadership-ai.md) — `/workshops/leadership-ai`

---

## The two moves

**1. Reframe — kill the per-seat webinar.** Everything on the personal side becomes
**1-on-1 or a small private group you bring**. This is Paul's core ask: make it
personal, not a per-seat cohort. Consequences that ripple through the copy:

- Drop "open cohort seat · 25 seats", "Open-cohort dates are not up yet", and the
  seat-vs-cohort framing everywhere it appears.
- `availability.note` and two FAQ items ("when is the next open session", "one-on-one
  vs a seat in a cohort") lose their reason to exist — trim/merge them.

**2. Split — landing vs catalog.** Today `/workshops` both *pitches* and *catalogs*
(price ladders + rundowns per offering). Pull the catalog out to per-course pages:

- **`/workshops`** = the argument + a two-audience router. Each audience section is a
  short stack of **doors** (a plain-language pain line + where it goes). **No prices,
  no ladders, no rundowns on this page** — only the two signals below.
- **`/workshops/[course]`** = the catalog, one page per course. Duration, format, the
  interactive approach, learning goals, a simplified outline, what you leave with, and
  a single **from-price**. Reached only from `/workshops`; **not** in the top nav.

Price signals on the landing: personal = **from ₱2,500**; org = **ask for our minimum**.
(Decision confirmed with Paul: "signals only" — the full ladder does not go public.)

---

## Routing / architecture

```
/workshops                     src/pages/workshops.astro      (revised)
/workshops/ai-fluency          src/pages/workshops/[slug].astro  ─┐
/workshops/ai-for-business             ""                          │ one dynamic route,
/workshops/vibe-coding                 ""                          │ getStaticPaths over
/workshops/leadership-ai               ""                        ─┘ the `courses` collection
```

- New Keystatic + Astro content collection **`courses`** (git-based, Paul edits it).
  Keystatic and `src/content.config.ts` schemas MUST stay field-identical (house rule).
- One `src/pages/workshops/[slug].astro` renders every course via `getStaticPaths()`.
- The offering data currently hard-coded in `src/lib/workshops.ts` (`offerings[]`,
  rundowns, outcomes, formats) **migrates into the collection**. What stays in the lib:
  the router doors, the thesis, `fit`, `marketStats`, `process`, `faqItems`. Update
  [`src/lib/workshops.test.ts`](../../src/lib/workshops.test.ts) to match the reshaped data.
- Each course page emits `Course` JSON-LD (schema.org) + a `BreadcrumbList`
  (Home → Workshops → course). Add a `course()` builder to `src/lib/schema.ts`.

### `courses` collection schema (proposed)

Field-identical in `keystatic.config.ts` and `src/content.config.ts`:

| field | type | notes |
|---|---|---|
| `slug` | slug | `ai-fluency`, etc. — the URL segment |
| `title` | text | "AI Fluency & Digital Media Literacy" |
| `tagline` | text | one line under the H1 |
| `audiences` | multiselect | `personal` \| `business` \| `org` — drives which landing section lists it |
| `duration` | text | "2 hours" / "6–8 hours" |
| `interactive` | text | the one-line "hands-on" promise shown in the meta strip |
| `whoFor` | text | who should book it (+ the confusion it answers) |
| `outcomes` | array(text) | "You'll leave with" — one scannable line each |
| `outline` | array({ step, item }) | the simplified arc; keep it to 3–4 movements |
| `formats` | array({ label, detail, price, priceNote? }) | 1-on-1 / small group / team + a **from** price |
| `priceSignal` | text | "from ₱2,500" or "Ask for our minimum" — echoes the landing |
| `caveat` | text (optional) | the honest ceiling (vibe-coding, leadership policy) |
| `order` | number | sort within a landing section |

> **YAGNI note:** one shared `[slug].astro` template, not a bespoke file per course
> (extract on the second divergence, not the first). No per-course hero art — the
> hairline system carries it. No new dependency; this is Astro content + one route.

---

## The offer, after the reframe

**For you & business owners** — *from ₱2,500* (1-on-1 or small group you bring)

| Door (the pain, plain) | Course |
|---|---|
| "I don't get AI and I want to understand it" | [AI Fluency & Digital Media Literacy](02-course-ai-fluency.md) |
| "I run a business — where does AI actually pay?" | [AI Business Application Consultation](03-course-ai-for-business.md) |
| "I want to learn to build — vibe code with AI" | [Vibe Coding with Basic Web Development](04-course-vibe-coding.md) |

**For your organization** — *ask for our minimum*

| Door | Course |
|---|---|
| "Align our leadership and set our AI ground rules" | [Leadership AI Training + Policy Exercise](05-course-leadership-ai.md) |
| "Train the whole team to a standard" | [AI Fluency for teams](02-course-ai-fluency.md) (3-hr team format) |
| "Something specific to our department" | → `#enquire` (custom, preset the form) |
| "Invite me as a speaker" | → `#enquire` (speaker, preset the form) |

AI Fluency is **one page** listed as a door in *both* sections: a 2-hr personal format
and a 3-hr team format live on the same page. Custom and Speaker are enquiry CTAs, not
pages — they jump to the form with `data-enquire` preset.

Every course states an **interactive, hands-on approach** up front — you work on your
own task/files/operation in the room. This is the through-line and the differentiator
(see research: buyers are drowning in generic awareness decks).

---

## Research that shaped this (Sept 2026)

**Grassroots confusion, PH / SEA.** High usage, low readiness: ~42% of Filipino
internet users touched ChatGPT last month and PH ranks among the top ChatGPT markets,
yet excitement and organisational maturity lag the global average. The questions
ordinary people actually ask run "what even is this / is it safe to use for work / is
my company okay with it / how do I tell if a photo or video is AI-made." DepEd's Feb
2026 guidance permits AI in basic ed under human-centred use — so "is it allowed" is
live for parents, teachers, students. → The fluency course answers *understanding +
safety + spotting fakes*, not tool trivia.

**SME / business owners, SEA.** Top adoption barriers are **cost, talent/skills, and
governance**; fewer than 30% of AI-adopting SMEs have a named person accountable for
AI accuracy; cultural resistance and fear of displacement persist. Owners don't need a
tools tour — they need "where does this pay in *my* operation, what will it cost, and
who owns it." → The business consultation is a working session that outputs ranked use
cases + a 30-day test with a named owner.

**Competitor offerings.**
- **LOKAL (lkl.ai)** — a 6-rung ladder from ₱3,500/seat: AI Foundations (½-day),
  ChatGPT & Claude for Daily Work (1-day), Copilot for Business, AI for Marketing/Sales/Ops,
  AI Champions Program (4–6 wk), Executive AI Briefing (2–3 hr). Certificates, workbook,
  prompt library, 30-day support, English/Taglish.
- **Jerry Ilao** — "4A Blueprint" maturity framework; corporate deliverables are a
  **one-page signed AI policy**, prompting standards (RTC), a prompt vault, and a
  **30-day scoreboard with named owners**. Modules by role (Employees/Managers/Executives).
  This is the direct positional competitor for the leadership + policy course.
- Both compete on *volume and certificates*. Paul's differentiators to hold: a published
  **price floor**, an **interactive/own-work** format, media-literacy (the "at you" half
  nobody else teaches), and the honest "nothing to sell you afterwards" stance.

**Pedagogy spine.** Anthropic's **4D AI-fluency framework** — Delegation (what to give
AI), Description (how to ask), Discernment (catching confident wrong answers), Diligence
(you own the output) — is the backbone under the fluency and business courses. We don't
name-drop it on the page; we teach it as plain habits.

**Design references (Mobbin).** The course-page skeleton is Codecademy's — kicker
"Course" + title + one-line desc + primary CTA, then a **hairline meta strip**
(level · time · projects · prerequisites) and "Skills you'll gain". Uxcel and Podia
confirm the two-column details grid + module outline. The landing router is Intercom's
two-column hairline split ("Need more than one solution? / Early stage company?") — which
is the `.fork` pattern already in this codebase. Ditto's "Startup $250 / Custom → Talk to
Sales" mirrors personal-priced vs org-ask-for-minimum. All of it maps onto the existing
hairline vocabulary — **no glass cards, no gradient chrome** (house palette rules).

Sources: [LOKAL courses](https://www.lkl.ai/ai-courses-philippines) ·
[Jerry Ilao](https://jerryilao.com/ai-training-philippines/) ·
[Anthropic AI Fluency](https://academy.claude.com/courses/ai-fluency-framework-foundations) ·
[Pinoys top ChatGPT users](https://www.philstar.com/headlines/2025/10/20/2481133/pinoys-top-chatgpt-users-worldwide) ·
[AI in PH 2026 (LOKAL)](https://www.lkl.ai/ai-in-the-philippines-2026) ·
[SEA SME adoption barriers](https://www.marketscale.com/industries/software-and-technology/southeast-asias-enterprise-ai-push-hits-a-familiar-wall-data-talent-and-integration-debt) ·
[Vibe coding for non-coders](https://www.coursera.org/learn/non-coders-guide-to-vibe-coding)

---

## Build order (each = its own DoD in the page file)

1. **Collection + route infra** — `courses` collection (Keystatic + content.config,
   field-identical), `src/pages/workshops/[slug].astro` with `getStaticPaths`, `course()`
   schema builder. Seed the 4 course entries from the page briefs.
2. **`/workshops` revision** — see [`01-page-workshops.md`](01-page-workshops.md).
3. **Course content** — fill the 4 entries from files 02–05.
4. **Migrate + trim `workshops.ts`** — move `offerings[]` out, delete cohort/seat copy,
   update `workshops.test.ts`.
5. **Verify** — `npx astro check`, `npm test`, `npm run build`; spot-check every new
   route at 375px and 1440px; view-source the JSON-LD.

## Blocked / needs Paul

- **All from-prices are placeholders.** Carrying the current hypotheses forward:
  fluency personal **from ₱2,500**, business consult **from ₱2,500** (2 hr), vibe coding
  **from ₱?** (4 hr — almost certainly above ₱2,500; Paul to set), leadership **ask for
  minimum** (floor was ₱150k). The 1-on-1 / group numbers were already the least-evidenced
  on the site (see Phase 22 blocked note). Paul sets real numbers before launch.
- Same launch blockers still stand: BIR registration / official receipts, MMDC employer
  clearance, and the availability window is still a placeholder, not a calendar.
