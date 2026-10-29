# Page — `/workshops` (revised landing)

**Phase:** 27 · **File:** `src/pages/workshops.astro` · **Reads:** [overview](00-overview.md)

## Goal

Turn the landing from a pitch-plus-catalog into a **pitch plus a two-audience router**.
The page keeps the argument (thesis, why-now stats, Paul, "why I'm doing this") and the
contact form; it loses every price ladder, rundown, and per-offering card. Those move to
the four `/workshops/[course]` pages, which the router links to. The personal side is
reframed from per-seat cohort to **1-on-1 / small group**.

## What changes

**Keep, mostly as-is:** hero, `01 · The two halves` thesis diagram, `Why this keeps
coming up` stats, `Who this is for` (book it if / don't), `How it works`, `Who's in the
room` (bio + data/security baseline), `Why I'm doing this`, `Talk to me` form.

**Replace:** the whole `02 · What you can book` fork (the two columns of price ladders +
rundowns) becomes the **two-audience router** — plain hairline door rows, no prices
beyond the section signal, each row linking to a course page or `#enquire`.

**Trim for the reframe:**
- Hero sub-CTA: `Seats and one-on-ones from ₱2,500` → `1-on-1 & group sessions from ₱2,500`.
- `availability` block: drop "Open-cohort dates are not up yet"; reframe to
  "Booking 1-on-1s and small groups now — message me to hold a date."
- FAQ: merge/remove the two cohort-seat questions; keep payment/OR, remote/PHT, and the
  "why is the corporate price a 'from'" answers.
- `src/lib/workshops.ts`: `offerings[]` migrates to the `courses` collection; keep
  `audienceRoutes` (repurposed as the section intros), `thesis`, `fit`, `marketStats`,
  `process`, `faqItems`. Reshape door data into a small `landingDoors` structure grouped
  by section. Update `workshops.test.ts`.

## The router (replaces the fork)

Two sections split the same way the `.fork` hairline already splits the page. Each door
is one row: a plain pain-line label + a short clarifier + an arrow. The **only** price on
this whole page is the per-section signal.

- **For you & business owners** · *from ₱2,500 · 1-on-1 or a small group you bring*
  - New to AI and want to actually understand it → `/workshops/ai-fluency`
  - You run a business and want to know where AI pays → `/workshops/ai-for-business`
  - You want to build things yourself — vibe code with AI → `/workshops/vibe-coding`
- **For your organization** · *ask for our minimum*
  - Get leadership aligned and set your AI ground rules → `/workshops/leadership-ai`
  - Train the whole team to one standard → `/workshops/ai-fluency`
  - Something specific to your department → `#enquire` (custom)
  - Invite me as a speaker → `#enquire` (speaker)

Reuse `data-enquire` so the org custom/speaker rows preset the form's "interested in".

## ASCII layout

```
┌──────────────────────────────────────────────────────────────┐
│ ── Demystifying AI · Manila & remote · English · PHT          │  data-hero
│                                                                │
│ You already use AI.                                            │  h1
│ This is where you get good at it.                             │
│                                                                │
│ No hype, no doomsaying — a few hours on the work you already   │  lead
│ have open. 1-on-1, or a small group you bring.                 │
│                                                                │
│ [ Talk to me ]      1-on-1 & group sessions from ₱2,500 →     │
└──────────────────────────────────────────────────────────────┘

01 · THE TWO HALVES                                    (KEEP — thesis)
┌───────────────────────────┬───────────────────────────┐
│  What AI makes FOR you    │  What AI makes AT you      │
│  · drafts, summaries      │  · a speech never given    │
│  · code you didn't write  │  · a citation that's fake  │
│  · a prototype by lunch   │  · a scam in a known voice │
│        ← you aim it       │       it arrives anyway →  │
└───────────────────────────┴───────────────────────────┘
  Same tech, two different skills. Most training teaches only the left.

── Booking 1-on-1s and small groups now — message me to hold a date ──   (avail, reframed)

02 · WHAT YOU CAN BOOK                                 (NEW — router, no prices)

  For you & business owners            from ₱2,500 · 1-on-1 or small group
  ┌────────────────────────────────────────────────────────────────────┐
  │ New to AI, want to understand it            AI Fluency & Media Lit → │
  │ You run a business — where does AI pay?     AI for Business       → │
  │ You want to build it yourself               Vibe Coding           → │
  └────────────────────────────────────────────────────────────────────┘

  For your organization                                ask for our minimum
  ┌────────────────────────────────────────────────────────────────────┐
  │ Align leadership + set your AI ground rules Leadership + Policy    → │
  │ Train the whole team to one standard        AI Fluency (team)      → │
  │ Something specific to your department        Custom               → │  (#enquire)
  │ Invite me as a speaker                       Speaking             → │  (#enquire)
  └────────────────────────────────────────────────────────────────────┘

  Each door → a course page with the outline, format and a "from" price.

── "The test isn't the session. It's whether you're still using it a month later." ──  (breaker, KEEP)

03 · WHY THIS KEEPS COMING UP     65% / 78% / 28%      (KEEP — sourced stats)
04 · WHO THIS IS FOR              book it if / don't   (KEEP)
05 · HOW IT WORKS                 (KEEP, trim seat language)
06 · WHO'S IN THE ROOM            Paul + data baseline (KEEP)
07 · WHY I'M DOING THIS           (KEEP)
08 · QUESTIONS                    (KEEP, trim cohort FAQs)
09 · TALK TO ME                   form — "interested in" grouped by course (KEEP)
```

The router rows reuse `.route` / `.fork` hairline CSS already in the page — a section
label + signal, then rows with `border-top: 1px var(--line)`, an arrow `→` mark, no fill.

## Definition of Done

- [ ] `/workshops` shows two router sections; **no price ladder, rundown, or per-offering
      card remains on the page** — only the two section signals (from ₱2,500 / ask for minimum).
- [ ] Every door links to the correct `/workshops/[course]` or presets `#enquire`.
- [ ] No "seat", "cohort", or "25 seats" copy remains anywhere on the page or in the
      surviving FAQ; availability + hero sub-CTA reflect 1-on-1 / small group.
- [ ] Form "interested in" options are generated from the `courses` collection, grouped
      by audience; custom/speaker rows preset via `data-enquire`.
- [ ] `src/lib/workshops.ts` no longer holds `offerings[]`; `workshops.test.ts` updated
      and green.
- [ ] `npx astro check`, `npm test`, `npm run build` all pass; page verified at 375px and
      1440px with AA contrast intact.
