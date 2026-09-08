# Course — AI Fluency & Digital Media Literacy → `/workshops/ai-fluency`

**Phase:** 27 · **Route:** `src/pages/workshops/[slug].astro` · **Reads:** [overview](00-overview.md)
**slug:** `ai-fluency` · **audiences:** `personal`, `business`, `org` · **duration:** 2 hrs (personal) · 3 hrs (team)

This file also defines the **shared course-page template** (ASCII at the bottom); the
other three course briefs reuse it and only swap content.

## Who it's for / the confusion it answers

Professionals, students, parents, teachers — anyone. **No technical background assumed.**
It answers the actual grassroots questions in the PH: *"What even is this? Is it safe to
use for work? Is my company okay with it? How do I tell if a photo or video is fake?"*
High usage, low readiness is the whole problem — people already use AI daily and were
never shown where it helps, where it wastes their time, or how it's used against them.

## The interactive approach (state it up front)

Hands-on the whole way. You bring a real task from your own week and run it live with the
tool you already have (ChatGPT, Claude, Copilot, Gemini). You break an actual deepfake and
catch a real hallucination on a live example. You leave having *done* it, not watched it.

## Learning goals

Taught as plain habits (the Anthropic 4D spine underneath — never named on the page):
- **Aim it** — decide what's worth handing to AI and ask for it clearly. *(Delegation + Description)*
- **Judge it** — catch a confident wrong answer before you trust it. *(Discernment)*
- **Own it** — know that whatever it makes in your name is yours to check. *(Diligence)*
- **Spot the fake** — run a 60-second check on any image, clip, or claim.
- **Draw the line** — a straight answer on where AI is worth your time and where it is not.

## Simplified outline (3 movements)

1. **What it is, and what it isn't.** For-you vs at-you, in plain language, with a live demo.
2. **Do one real task.** Pick something from your actual week; run it with your own tool.
3. **Spot the fake, keep the habit.** Break a deepfake, catch a hallucination, turn the
   check into something you'll still do next month.

*(Team 3-hr format: same arc, more hands-on time + a short "what this means for our team".)*

## You'll leave with

- One task from your week done faster — with the prompt saved so you can run it again.
- A check you can run on any image, clip, or claim in under a minute.
- A straight answer on where AI is worth your time, and where it isn't.

## Formats & price (placeholders — Paul confirms)

| Format | Detail | Price |
|---|---|---|
| 1-on-1 | 90 min · your files, your tools | from ₱2,500 |
| Small group | 2.5 hrs · 3–8 people you bring | from ₱2,500 /person |
| Team | 3 hrs · your org, your material | Ask for our minimum |

`priceSignal`: **from ₱2,500** (personal) — landing lists this in both the personal and
org sections (org points at the team format).

---

## SHARED COURSE-PAGE TEMPLATE (ASCII) — used by all four course pages

```
┌──────────────────────────────────────────────────────────────┐
│ Workshops  /  AI Fluency & Digital Media Literacy             │  breadcrumb (JSON-LD)
│                                                                │
│ COURSE · INTERACTIVE · 2 HOURS                                 │  kicker meta (mono)
│ AI Fluency & Digital Media Literacy                            │  h1
│ What AI makes for you, and what it makes at you.              │  tagline / lead
│                                                                │
│ [ Talk to me → ]                                               │  primary CTA → /workshops#enquire
├──────────────────────────────────────────────────────────────┤
│ Duration   │ Format          │ Who it's for   │ Approach       │  HAIRLINE META STRIP
│ 2 hours    │ 1-on-1 / group  │ any field      │ hands-on       │  (Codecademy pattern)
├──────────────────────────────────────────────────────────────┤

  YOU'LL LEAVE WITH                                (outcomes — hairline rows)
  ─ one task from your week, done faster + the prompt saved
  ─ a 60-second check for any image, clip, or claim
  ─ a straight answer on where AI helps and where it doesn't

  WHAT WE COVER                                    (simplified outline)
  01  What it is, and what it isn't — for you vs at you   (demo)
  02  Do one real task with the tool you already have     (hands-on)
  03  Spot the fake — break a deepfake, catch a mistake   (hands-on)
  › Interactive throughout — you work on your own task, not slides.

  FORMATS & PRICE                                  (from-price only, no full ladder)
  1-on-1        90 min · your files          from ₱2,500
  Small group   2.5 hrs · 3–8 you bring      from ₱2,500 /person
  Team          3 hrs · your org             ask for our minimum

  [ Talk to me → ]         ← Back to all workshops (/workshops)
```

Every element maps to existing hairline CSS: kicker/`.kicker`, the meta strip is a
`border-block` grid like `.avail`, outcomes/outline reuse `.offer__take-list` / `.rundown`,
formats reuse the `.ladder` rows. No new visual vocabulary, no cards, no accent fills.

## Definition of Done

- [ ] `/workshops/ai-fluency` renders from the `courses` collection via `[slug].astro`.
- [ ] Meta strip states **Interactive / hands-on**; the approach line appears in the body too.
- [ ] Outcomes, 3-movement outline, and from-price formats all present; **no full price
      ladder or per-seat/cohort language**.
- [ ] `Course` + `BreadcrumbList` JSON-LD valid; H1 is the only `h1`; AA contrast.
- [ ] "Talk to me" → `/workshops#enquire`; "Back to all workshops" → `/workshops`.
- [ ] `npx astro check`, `npm test`, `npm run build` pass; verified 375px + 1440px.
