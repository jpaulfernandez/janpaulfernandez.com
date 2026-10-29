# T14 — Seed content

**Phase:** 3 · **Depends on:** T11, T12 · **Spec:** §7.3, §9

## Goal

2–3 real posts published so the site launches alive, exercising the full pipeline and GEO conventions.

## Context

Seed essay topics are a blocked-on-Paul item (plan.md). If Paul has provided topics, use them. If not: draft 1 essay + 2 notes on topics squarely in his lane (e.g., essay drawing on PHVote 2019 / elections tech, notes on AI adoption or digital education) — clearly framed as drafts for his review, published with `draft: true` until he approves. Do not fabricate personal anecdotes, opinions, or facts about Paul's life beyond what spec.md states.

## GEO writing rules (spec §7.3 — apply to the essay)

- Open with a Key Takeaway block: 2–3 sentence extractable answer within the first 200 words
- Descriptive, question-shaped h2s where natural
- Honest dates; author credibility flows from the author card (already built)

## Steps

1. Author via /keystatic (dogfood the CMS — friction found here is a bug to fix, not work around silently).
2. Essay: 800+ words, ≥3 h2s (exercises TOC), at least one Callout and the Key Takeaway. Notes: short, low-polish by design, one with an external link + commentary.
3. Assign topics from technology/economy/psychology; give the essay a stage (`budding` is honest for a first essay).
4. Verify each post end-to-end: index card, article page, topic archive, related posts, prev/next, RSS item, OG image, BlogPosting JSON-LD.

## Definition of Done

- [ ] 1 essay + 2 notes exist; essay follows all three GEO rules
- [ ] All posts authored through Keystatic UI (not hand-written files)
- [ ] Each verified across: index, article, topic page, RSS, OG image, JSON-LD
- [ ] If Paul hasn't approved topics: posts are `draft: true` and plan.md notes approval pending
- [ ] Build passes
