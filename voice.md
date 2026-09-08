# voice.md — how the copy on janpaulfernandez.com sounds

This is the voice guide for every word on the site: page copy, course and service
descriptions, microcopy, meta descriptions, error pages. It exists so the writing
stays Paul's and never drifts into the generic register that AI writing tools
default to.

It applies to any coding agent (Claude, Gemini, GPT) and to humans. If you are
writing or editing copy here, read this first. The design rule is already in
[CLAUDE.md](CLAUDE.md): *design like a document, not a funnel.* The copy rule is
the same. Write like a person who has done the work, not a landing page selling it.

---

## Who is talking

Paul Fernandez. Filipino technologist — eleven years shipping things that broke in
public when they broke. Built account-opening software at a bank, ran election-night
results at Rappler through two national votes, now keeps the systems standing at a
college full of working students. Teaches AI workshops while being openly
ambivalent about AI. Has a dry, honest, slightly self-deprecating register and
nothing to sell you afterward.

The voice follows from that: **plain, specific, a little blunt, quietly funny, and
allergic to hype.** It trusts the reader. It would rather under-claim than oversell.

---

## The seven house rules

1. **Say the true, specific thing.** "PHVote had to publish results live while the
   country watched" beats "delivered high-stakes, mission-critical systems."
   Concrete nouns, real numbers, named places. If you can't point at it, cut it.

2. **Short words, short sentences — then vary.** Use *use*, not *utilize*; *help*,
   not *facilitate*; *where it pays*, not *leverage value*. Mix a four-word sentence
   against a long one. Uniform rhythm is the clearest tell of machine prose.

3. **Have a point of view.** The copy is allowed to be ambivalent, irritated, or
   funny. "My relationship with AI is complicated. I teach it anyway." Neutral,
   opinion-free copy reads as assembled, not written.

4. **Admit the limit.** The site's most persuasive move is naming what it *won't*
   do: "This makes you dangerous, not a software engineer." "There is no
   certificate, and I would not trust a two-hour one either." Keep the caveats.
   They are the voice, not a disclaimer to smooth over.

5. **No funnel language.** No "unlock," "elevate," "transform your business," "take
   it to the next level," "in today's fast-paced world," "exciting times ahead."
   No urgency, no trust badges, no "100% guaranteed." The memory note stands: pill
   nav, glass cards, gradient glows *and* this register all read as "AI."

6. **Cut the scaffolding.** Delete "it is important to note that," "in order to,"
   "at this point in time," "when it comes to." Say the sentence without the
   run-up. If a phrase could be removed and the meaning survives, remove it.

7. **Let it be a little messy.** An aside, a dash, a half-joke ("send it again, I
   won't mind") is more human than a perfectly balanced paragraph. Don't sand the
   personality off in the name of polish.

---

## The slop checklist (run before committing copy)

Based on Wikipedia's *Signs of AI writing* and the repo's `humanizer` skill.
Scan new or edited copy for these and rewrite the hits:

- **Significance puffery** — "stands as a testament," "marks a pivotal moment,"
  "plays a crucial role," "reflects a broader shift." Arbitrary things don't need a
  legacy. State what it is and move on.
- **Copula avoidance** — "serves as," "boasts," "features," "represents." Usually
  just means *is* or *has*. Use the plain verb.
- **-ing tails that fake depth** — "…, highlighting its importance," "…, ensuring a
  seamless experience," "…, reflecting the community's values." Cut the tail or make
  it a real clause with a real fact.
- **Rule of three** — "faster, smarter, and more efficient." Forced triples sound
  comprehensive and say nothing. Two is fine. One is often better.
- **Negative parallelism** — "It's not just X, it's Y." "It's not merely a tool,
  it's a partner." Almost always deletable. Say the Y.
- **Vague authority** — "experts say," "studies show," "industry reports suggest."
  On this site a stat needs a named source and a URL (see `marketStats` in
  [src/lib/workshops.ts](src/lib/workshops.ts)) or it doesn't appear.
- **Inflated vocabulary** — delve, robust, leverage, harness, seamless, vibrant,
  landscape (figurative), tapestry, realm, myriad, bespoke, curated, cutting-edge,
  game-changing. If one shows up, you're writing like the tool, not like Paul.
- **Em-dash note** — the site uses em dashes deliberately and they are fine. The
  tell isn't the dash, it's the *breathless* rhythm it props up. Keep the dash,
  lose the hype.
- **Generic upbeat closer** — "The future looks bright." "Exciting times lie
  ahead." End on a fact or a plain next step instead.
- **Chatbot residue** — "I hope this helps," "Great question," "Certainly!,"
  "feel free to." Never ships.

---

## Before / after, from this codebase

These are the register, pulled from copy that already lives on the site.

> **Slop:** "In today's rapidly evolving landscape, our groundbreaking AI workshops
> empower you to unlock your full potential and take your business to the next level."
>
> **House:** "You already use AI. This is where you get good at it. A few hours on
> the work you actually have open, until it stops feeling like a magic trick and
> starts doing something useful."

> **Slop:** "With a proven track record of delivering robust, scalable solutions,
> I leverage cutting-edge technology to drive transformative outcomes."
>
> **House:** "Eleven years shipping things that broke in public when they broke.
> PHVote had to publish results live while the country watched."

> **Slop:** "Our comprehensive program offers innovation, inspiration, and
> industry-leading insights, ensuring a seamless learning journey for all."
>
> **House:** "This makes you dangerous, not a software engineer. You'll ship real
> things and you'll also hit walls where you need someone who actually writes
> code — knowing that line is part of the point."

---

## When unsure

Read it aloud. If it sounds like something Paul would actually say to one person
across a table, it passes. If it sounds like a brochure, a pitch deck, or a
chatbot being helpful, rewrite it shorter and truer.
