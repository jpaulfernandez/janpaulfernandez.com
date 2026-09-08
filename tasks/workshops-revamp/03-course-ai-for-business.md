# Course — AI Business Application Consultation → `/workshops/ai-for-business`

**Phase:** 27 · **Route:** `src/pages/workshops/[slug].astro` · **Template:** [02](02-course-ai-fluency.md)
**slug:** `ai-for-business` · **audiences:** `personal`, `business` · **duration:** 2 hrs

## Who it's for / the confusion it answers

Business owners, founders, GMs of small and mid-size companies. It answers the question
under every SME's AI anxiety: *"Everyone says use AI — but where does it actually help
MY business without wasting money, and who's supposed to run it?"* This maps straight to
the SEA SME barriers in the research: **cost, unclear ROI, governance, and no named
owner** (fewer than 30% of AI-adopting SMEs have anyone accountable for AI accuracy).

Not a tools tour. Not a generic awareness deck. A working consultation on your operation.

## The interactive approach (state it up front)

We work on **your** business, not slides. You (and a key person or two) bring how your
shop actually runs — where time and money go — and we map it together. You leave with a
plan you helped build, not a report handed to you.

## Learning goals

- Name **2–3 places AI actually pays** in your operation, ranked — not twenty maybes.
- Put a rough **cost range** and the assumption behind each one.
- Design a **30-day test** for the first: named owner, success threshold, kill criterion.
- Know what to **ignore** — the hype that doesn't fit your business.

## Simplified outline (3 movements)

1. **Your operation on one page.** Where time, money, and repeat work actually go.
2. **Find the real use cases.** Working session on your numbers — rank 2–3 by payoff.
3. **Design the 30-day test.** Pick one; give it an owner, a threshold, and a stop rule.

## You'll leave with

- Two or three ranked use cases, each with a cost range and the assumption behind it.
- A 30-day test for the first one — named owner, success threshold, kill criterion.
- A short list of what to ignore, so you stop paying attention to the wrong pitches.

## Formats & price (placeholders — Paul confirms)

| Format | Detail | Price |
|---|---|---|
| 1-on-1 consultation | 2 hrs · you + a key person or two | from ₱2,500 |

`priceSignal`: **from ₱2,500**. *(Flag: a 2-hr owner consultation may warrant a higher
floor than the fluency session — Paul to set. Placeholder carries the ₱2,500 signal.)*

## ASCII (content-filled template)

```
 Workshops / AI Business Application Consultation
 COURSE · INTERACTIVE · 2 HOURS
 AI Business Application Consultation
 Where AI actually pays in your business — and what to ignore.
 [ Talk to me → ]
 ┌────────────┬──────────────────┬───────────────┬───────────┐
 │ 2 hours    │ 1-on-1           │ owners / GMs  │ working   │
 └────────────┴──────────────────┴───────────────┴───────────┘
   YOU'LL LEAVE WITH
   ─ 2–3 ranked use cases, each with a cost range
   ─ a 30-day test: owner, threshold, kill criterion
   ─ a short list of what to ignore
   WHAT WE COVER
   01  Your operation on one page — where time & money go
   02  Find the real use cases (your numbers, ranked)
   03  Design the 30-day test
   › We work on your business, not slides.
   FORMATS & PRICE
   1-on-1 consultation   2 hrs · you + key people   from ₱2,500
   [ Talk to me → ]      ← Back to all workshops
```

## Definition of Done

- [ ] `/workshops/ai-for-business` renders from the collection; meta strip flags Interactive.
- [ ] Outcomes are the ranked-use-cases + 30-day-test deliverables; outline is the 3
      movements above; from-price only.
- [ ] `Course` + `BreadcrumbList` JSON-LD valid; one `h1`; AA contrast; CTAs wired to
      `/workshops#enquire` and `/workshops`.
- [ ] `npx astro check`, `npm test`, `npm run build` pass; verified 375px + 1440px.
