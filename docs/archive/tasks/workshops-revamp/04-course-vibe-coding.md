# Course — Vibe Coding with Basic Web Development → `/workshops/vibe-coding`

**Phase:** 27 · **Route:** `src/pages/workshops/[slug].astro` · **Template:** [02](02-course-ai-fluency.md)
**slug:** `vibe-coding` · **audiences:** `personal`, `business` · **duration:** 4 hrs

## Who it's for / the confusion it answers

Non-coders who want to **build**, not just prompt — creators, business owners,
students, people with an idea and no dev. It answers: *"Can I actually make a working
app or website with AI without learning to code? And what am I even looking at when it
spits out code?"* Vibe coding (describe what you want in plain English, AI writes the
code, you review and ship) is the on-ramp — but beginners stumble where nobody warned
them, so this course pairs it with just enough web basics to steer and to know when
something's broken.

## The interactive approach (state it up front)

You build the whole time. By the end of the session you've **shipped one real, working
thing** — your idea, live on the internet — using AI tools (Claude, Cursor, v0, Replit,
etc.). Not a lecture about building; the building *is* the session.

## Learning goals

- Understand what vibe coding is — and its **honest limits** (where it bites beginners).
- Enough **web basics in plain language** to know what a page is, what "deploy" means,
  and what broke when something breaks.
- Run the loop: **describe → generate → review → fix** until it works.
- **Ship one real thing live** and know how to keep going after the session.

## Simplified outline (4 movements — it's a 4-hour build)

1. **What vibe coding is — and where it bites.** The honest version, up front.
2. **Web basics, plainly.** Just enough vocabulary to steer the AI and read what it made.
3. **Build your thing.** Describe → generate → review → fix, on your own idea. (hands-on)
4. **Ship it + keep going.** Deploy it live; the setup you reuse tomorrow.

## You'll leave with

- One real thing you built, deployed live — a page, a tool, a small app.
- A reusable setup (tools + a working loop) so you can build the next one alone.
- A clear-eyed sense of what to hand to AI and what still needs a real engineer.

## Honest caveat (put it on the page)

This makes you *dangerous*, not a software engineer. You'll ship real things and you'll
also hit walls where you need someone who actually writes code. Knowing that line is part
of the point — and it's the media-literacy habit applied to your own builds.

## Formats & price (placeholders — Paul confirms)

| Format | Detail | Price |
|---|---|---|
| 1-on-1 | 4 hrs · your idea, start to shipped | from ₱? |
| Small group | 4 hrs · 3–8 you bring | from ₱? /person |

`priceSignal`: **from ₱2,500** on the landing for consistency, **but flag:** a 4-hour
build session almost certainly warrants a higher floor than the 2-hr fluency session.
Paul sets the real number before launch; mark it clearly as a placeholder in the entry.

## ASCII (content-filled template)

```
 Workshops / Vibe Coding with Basic Web Development
 COURSE · INTERACTIVE · 4 HOURS
 Vibe Coding with Basic Web Development
 Describe what you want. Ship it live. No coding background needed.
 [ Talk to me → ]
 ┌────────────┬──────────────────┬───────────────┬───────────┐
 │ 4 hours    │ 1-on-1 / group   │ non-coders    │ you build │
 └────────────┴──────────────────┴───────────────┴───────────┘
   YOU'LL LEAVE WITH
   ─ one real thing, built and deployed live
   ─ a reusable setup + a working build loop
   ─ a clear line: AI's job vs a real engineer's
   WHAT WE COVER
   01  What vibe coding is — and where it bites
   02  Web basics, in plain language
   03  Build your thing: describe → generate → review → fix
   04  Ship it live + how to keep going
   › You build the whole time. You leave with something shipped.
   ⚠ Makes you dangerous, not a software engineer — and that's the point.
   FORMATS & PRICE
   1-on-1        4 hrs · your idea        from ₱?  (placeholder)
   Small group   4 hrs · 3–8 you bring    from ₱?  (placeholder)
   [ Talk to me → ]     ← Back to all workshops
```

## Definition of Done

- [ ] `/workshops/vibe-coding` renders from the collection; meta strip flags Interactive/you-build.
- [ ] The honest caveat renders (reuse `.offer__caveat`); outline is the 4 movements; from-price only.
- [ ] Price is clearly marked a placeholder in the collection entry (not silently ₱2,500).
- [ ] `Course` + `BreadcrumbList` JSON-LD valid; one `h1`; AA contrast; CTAs wired.
- [ ] `npx astro check`, `npm test`, `npm run build` pass; verified 375px + 1440px.
