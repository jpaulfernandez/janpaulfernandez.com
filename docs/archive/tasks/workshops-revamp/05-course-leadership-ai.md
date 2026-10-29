# Course — Leadership AI Training + Policy Making Exercise → `/workshops/leadership-ai`

**Phase:** 27 · **Route:** `src/pages/workshops/[slug].astro` · **Template:** [02](02-course-ai-fluency.md)
**slug:** `leadership-ai` · **audiences:** `org` · **duration:** 6–8 hrs (can split into two sessions)

## Who it's for / the confusion it answers

Owners, founders, GMs, and leadership/department heads deciding what their company should
*do* about AI. It answers: *"Every vendor is pitching us a platform. What do we actually
fund, and what are our ground rules before people paste the wrong thing into a chatbot?"*
This maps to the governance barrier in the research and is the **direct competitor
surface** to Jerry Ilao's corporate offering (signed one-page policy + 30-day scoreboard).
Paul's edge: a published floor, an interactive own-work format, and no platform to sell.

## The interactive approach (state it up front)

Your team does the work in the room. We map where AI pays in your business together, and
**your own people write the first draft of your AI ground rules** — not me, and not a
template. You leave with decisions you made, not a consultant's deck.

## Learning goals

- A shared, hype-free picture across leadership of what AI does and doesn't do.
- **2–3 ranked use cases** for your business, each with a cost range.
- A **30-day test** for the first one: named owner, success threshold, kill criterion.
- A **first-draft AI policy** — ground rules your team wrote, ready for review.

## Simplified outline (4 movements)

1. **Level-set, honestly.** What this is and isn't, for a leadership audience.
2. **Where it pays in your business.** Working session — rank 2–3 use cases by payoff.
3. **The policy exercise.** Your team drafts the ground rules together, in the room.
4. **The 30-day test + decision log.** Owner, threshold, kill criterion; open-issues list.

## You'll leave with

- Two or three ranked use cases, each with a cost range and its assumptions.
- A 30-day test for the first one — named owner, success threshold, kill criterion.
- A first draft of your AI ground rules, written by your own people, plus an open-issues list.

## Honest caveat (keep the existing one)

I do not author your policy, approve it, or represent it as compliant. The draft is
yours, and it goes to your DPO, Legal, and InfoSec. What I run is the exercise that gets
your people to write a real first draft instead of nothing.

## Formats & price (placeholders — Paul confirms)

| Format | Detail | Price |
|---|---|---|
| Full session | 6–8 hrs · leadership + key staff · your tools & documents | Ask for our minimum |
| Two-session | drafting + decision log across two days | Ask for our minimum |

`priceSignal`: **Ask for our minimum** (org — no public floor per Paul's "signals only";
prior internal floor was ₱150k). Scoping call + pre-flight included, as with all team work.

## ASCII (content-filled template)

```
 Workshops / Leadership AI Training + Policy Making Exercise
 COURSE · INTERACTIVE · 6–8 HOURS
 Leadership AI Training + Policy Making Exercise
 Where AI pays in your business — and the ground rules your team writes for it.
 [ Talk to me → ]
 ┌────────────┬──────────────────┬─────────────────┬───────────────┐
 │ 6–8 hours  │ team / on-site   │ owners & leaders│ your team drafts│
 └────────────┴──────────────────┴─────────────────┴───────────────┘
   YOU'LL LEAVE WITH
   ─ 2–3 ranked use cases with cost ranges
   ─ a 30-day test: owner, threshold, kill criterion
   ─ a first-draft AI policy your team wrote + open-issues list
   WHAT WE COVER
   01  Level-set, honestly (leadership)
   02  Where it pays in your business (working session)
   03  The policy exercise — your team drafts the ground rules
   04  The 30-day test + decision log
   › Interactive: your people write the first draft, not me.
   ⚠ I don't author, approve, or certify your policy — it goes to DPO/Legal/InfoSec.
   FORMATS & PRICE
   Full session   6–8 hrs · your tools & docs    Ask for our minimum
   Two-session    drafting + decision log        Ask for our minimum
   [ Talk to me → ]     ← Back to all workshops
```

## Definition of Done

- [ ] `/workshops/leadership-ai` renders from the collection; meta strip flags Interactive/team-drafts.
- [ ] The policy caveat renders (reuse `.offer__caveat`); outline is the 4 movements;
      price shows **Ask for our minimum**, no public floor.
- [ ] `Course` + `BreadcrumbList` JSON-LD valid; one `h1`; AA contrast; CTAs wired.
- [ ] `npx astro check`, `npm test`, `npm run build` pass; verified 375px + 1440px.
