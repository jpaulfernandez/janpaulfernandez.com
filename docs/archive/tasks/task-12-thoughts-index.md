# T12 — Thoughts index, topic archives, filters

**Phase:** 3 · **Depends on:** T11 · **Spec:** §3, §3.1, §5.3

## Goal

/thoughts filterable index + static /topics/[topic] archives. Home page's TODO(T10) placeholder swapped for real posts.

## Filter architecture (decided — don't redesign)

All posts render in the static HTML (SEO: content must not be JS-gated). Filter chips (type: Essay/Note · topic · stage) work via a small **vanilla JS** inline script (~30 lines): each card carries `data-type`, `data-topics`, `data-stage`; chips toggle a hidden class. No framework island — this is DOM show/hide, not state management. Progressive enhancement: without JS the full unfiltered list is visible and correct.

## Steps

1. `src/pages/thoughts/index.astro`: chip row + reverse-chron `PostCard` list from `getPublishedThoughts()`. Chips derived from actual content (topics present in posts), not hardcoded.
2. Chip a11y: `<button aria-pressed>`, visible focus style, filtering announced via a `aria-live="polite"` count ("12 thoughts").
3. `src/pages/topics/[topic].astro`: `getStaticPaths` from the union of all topics; h1 "Thoughts on {topic}"; same card list, no client filters needed here.
4. Update `PostCard.astro` if T08's placeholder version needs fields it lacked; then replace the home page placeholder with the real 3 latest posts and delete the TODO(T10) marker.
5. Empty state: friendly line when a filter combo matches nothing.

## Definition of Done

- [ ] /thoughts lists all published posts newest-first; each card: type badge, title, excerpt, topics, date, reading time
- [ ] Filters combine correctly (type ∩ topic ∩ stage); count updates; empty state shows
- [ ] With JS disabled, the full list renders and every post is reachable
- [ ] /topics/technology (etc.) build statically for every topic in use; unknown topic = 404
- [ ] Home page shows real latest 3; TODO(T10) marker gone (grep confirms)
- [ ] Chips keyboard-operable with aria-pressed; build + check pass
