# Language review — janpaulfernandez.com

Date: 2026-09-06
Reviewer: Claude (Opus 5)
Purpose: audit the site's non-article copy against a researched rubric, find where it reads robotic, and give concrete rewrites.

---

## 1. Scope

### In scope (scored)

| Surface | Files |
|---|---|
| Home — hero, section headings, teasers | `src/pages/index.astro`, `src/content/pages/home.json` |
| Workshops offer page | `src/pages/workshops.astro` |
| Work with me — page chrome, steps, contact | `src/pages/work-with-me.astro` |
| Service descriptions + FAQs | `src/content/services/*.json` |
| Index page leads and empty states | `thoughts/`, `projects/`, `gallery/`, `now`, `topics/[topic]` |
| Colophon | `src/pages/colophon.astro` |
| 404 and thanks | `src/pages/404.astro`, `src/pages/thanks.astro` |
| Nav, footer, article chrome | `src/layouts/BaseLayout.astro`, `src/layouts/ArticleLayout.astro` |
| Meta descriptions and SEO defaults | all `description=` props, `src/content/pages/seo.json` |
| Machine-readable bio | `src/pages/llms.txt.ts`, `src/pages/rss.xml.ts` |
| Gallery set descriptions | `src/content/gallery/*.json` |

### Excluded at your request

- Article bodies in `src/content/thoughts/` (five essays and notes)
- `src/content/now/` entry bodies
- `src/content/pages/about.md`
- `src/content/pages/workWithMe.md` (your intro paragraph)
- `src/content/career/*.md` blurbs — reviewed for voice calibration only, not scored

`about.md` earns a special role below: it is the **voice reference**. It is the longest sample of you writing as yourself with nothing to sell, so the rubric measures every other surface against it rather than against a generic style guide.

---

## 2. Research

Six sources, weighted toward things with evidence behind them rather than listicles.

**Nielsen Norman Group — writing for the web.** Users scan; they want text short and to the point; they "detest overly hyped promotional writing." Rewriting to concise/scannable/objective guidelines improved measured usability by 124–159%. Practical rule: write about 50% of the words you'd use in print. ([Concise, SCANNABLE, and Objective](https://www.nngroup.com/articles/concise-scannable-and-objective-how-to-write-for-the-web/), [Be Succinct!](https://www.nngroup.com/articles/be-succinct-writing-for-the-web/), [Applying writing guidelines to web pages](https://www.nngroup.com/articles/applying-writing-guidelines-web-pages/))

**Nielsen Norman Group — the four tone dimensions.** Any voice sits somewhere on four axes: funny↔serious, formal↔casual, respectful↔irreverent, enthusiastic↔matter-of-fact. Tone becomes measurable once you commit to a coordinate on each. ([The four dimensions of tone of voice](https://www.nngroup.com/articles/tone-of-voice-dimensions/), [Impact of tone of voice on brand perception](https://www.nngroup.com/articles/tone-voice-users/))

**Wikipedia — Signs of AI writing** (WikiProject AI Cleanup), via the `humanizer` skill. The most useful catalogue of what "robotic" concretely looks like: significance inflation, superficial `-ing` analyses, promotional adjectives, vague attribution, rule-of-three overuse, negative parallelism ("not just X, it's Y"), copula avoidance, false ranges, inline-bolded list headers, Title Case headings, elegant variation. ([Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing))

**Conversational copy guidance.** Stiff corporate register is losing ground; address the reader as "you"; read it aloud and cut anything you wouldn't say to a person. The target is "approachable expert," not "oversharing intern" — conversational means clear and human, not careless. ([Indelible Think](https://indeliblethink.co.uk/writing-conversational-copy/), [Peer to Peer Marketing](https://peertopeermarketing.co/website-copywriting/))

**Portfolio-specific copy.** The portfolios that generate work aren't the technically fanciest; they're the ones where a specific person's thinking comes through clearly enough that a reader thinks "I want to work with *this* person." Humor and small human details do more than credential recitation. ([Building a portfolio with personality](https://erwww.in/blog/portfolio-with-personality/), [Mirasee](https://mirasee.com/blog/copywriting-portfolio/))

**Your own spec.** `spec.md` §2 names manychat.com for "punchy hero copy" and maggieappleton.com for "personality-first IA," and sets the positioning line. `CLAUDE.md` records the Phase 21 de-SaaS pass. Both are design constraints; this review extends them to language, because a page can be visually de-SaaS'd and still *read* like a vendor deck. That gap is the central finding.

---

## 3. The voice, defined

Derived from `about.md`, the colophon, and the topic archives — the places where you clearly wrote without a buyer in mind.

**Position on the NN/g axes:**

| Axis | Where this site sits | Evidence |
|---|---|---|
| Funny ←→ Serious | **Dry, 30% toward funny.** Never jokey; occasionally deadpan. | "Australian hours weren't for me." |
| Formal ←→ Casual | **Casual, 75%.** Contractions, fragments, first person. | "Essays and half-formed notes. About things that bother me." |
| Respectful ←→ Irreverent | **Respectful with a hard edge on things that matter.** | "I think of technology as a gun." |
| Enthusiastic ←→ Matter-of-fact | **Matter-of-fact, 85%.** States, doesn't sell. Understates its own credentials. | "usually me, a year from now" |

**Five voice rules the good copy already follows:**

1. **Understate the credential, overstate the specific.** "Australian hours weren't for me" instead of a paragraph on why the role ended.
2. **Name the real thing.** PHVote. PSBank. Switzer. `Math.ceil(words / 200)`. Not "national-scale platforms."
3. **Admit the mixed feeling.** "honestly, part of me hates it."
4. **Fragments are allowed.** "About things that bother me."
5. **Address the reader as a peer, not a lead.** The colophon's "take it — no attribution needed."

---

## 4. Rubric

Eight criteria, scored 1–5 per surface. 40 points total.

**C1 — Voice consistency.** One person, one grammatical person, one register across the whole site.
> **5** First person throughout, including meta. **3** First person visible, third person in meta/schema. **1** Switches person inside a single view.

**C2 — Specificity.** Named things, real numbers, concrete nouns over category words.
> **5** Every claim carries a checkable detail. **3** Mix of concrete and abstract. **1** Abstractions only ("practical capability," "operational excellence").

**C3 — Rhythm and variety.** Sentence length varies; paragraphs don't share a template.
> **5** Lengths vary 5–40 words; at least one fragment or turn. **3** Mild variation. **1** Every sentence 20–30 words with one em dash and one triad.

**C4 — Freedom from AI and marketing tells.** Rule of three, negative parallelism, `-ing` tails, promotional adjectives, Title Case headings, inline-bolded list headers, false ranges, copula avoidance.
> **5** None. **3** Two or three, spread out. **1** Three or more per paragraph.

**C5 — Clarity and scannability.** Front-loaded, plain, half the words of print.
> **5** Answer in the first eight words. **3** One clause of throat-clearing. **1** Buries the point.

**C6 — Reader orientation.** Does the reader know what this is and what to do next?
> **5** Obvious next step, and it's the right one. **3** Present but competing with other links. **1** Dead end.

**C7 — Personality and warmth.** Would you say this out loud? Is there an opinion, an admission, a joke, a person?
> **5** Unmistakably one specific human. **3** Pleasant but interchangeable. **1** Could be any consultant's site.

**C8 — Craft and consistency.** Straight vs curly quotes, en-GB vs en-US, sentence vs Title Case, one name per section, single source of truth for a repeated fact.
> **5** Consistent everywhere. **3** Minor drift. **1** Same fact stated two ways in two files.

---

## 5. Checklist

Run this against any new copy before it ships.

**Voice**
- [ ] Written in first person, and the meta description matches
- [ ] Read aloud without wincing
- [ ] Contains at least one thing only you could have written
- [ ] Says what it is before saying why it's good

**Robotic tells** (each unchecked box is a rewrite)
- [ ] No unearned triads — a list of three because there are three, not for cadence
- [ ] Fewer than two "X, not Y" constructions per page
- [ ] No sentence ends in a floating `-ing` clause ("...ensuring", "...highlighting")
- [ ] No promotional adjectives: vibrant, seamless, robust, cutting-edge, powerful, comprehensive
- [ ] No abstract-noun stacks: capability, alignment, enablement, transformation, bandwidth
- [ ] Headings in sentence case
- [ ] `is`/`are`/`has` where a verb is being avoided ("serves as", "boasts", "represents")
- [ ] Not more than one em dash per paragraph
- [ ] Straight apostrophes and quotes, consistently
- [ ] One spelling convention (en-US) throughout

**Reader**
- [ ] The price, the date, or the number is on the page
- [ ] One clear next action, not three equal ones
- [ ] Empty states and confirmations written by a person, not a framework

---

## 6. Scorecard

| Surface | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 | **/40** |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Colophon | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | **39** |
| Home hero | 5 | 4 | 5 | 5 | 5 | 4 | 5 | 4 | **37** |
| Topic archive intros | 5 | 5 | 4 | 4 | 5 | 5 | 5 | 4 | **37** |
| Thoughts index lead | 5 | 3 | 5 | 5 | 5 | 4 | 5 | 3 | **35** |
| Now — page chrome | 5 | 4 | 4 | 4 | 5 | 4 | 4 | 4 | **34** |
| Footer statement + nav | 5 | 3 | 5 | 5 | 5 | 4 | 4 | 3 | **34** |
| Projects index | 4 | 3 | 4 | 5 | 5 | 4 | 4 | 3 | **32** |
| Gallery — page lead | 5 | 4 | 5 | 5 | 5 | 4 | 4 | 4 | **36** |
| Work with me — chrome | 4 | 3 | 3 | 3 | 5 | 5 | 3 | 4 | **30** |
| Article layout chrome | 4 | 3 | 4 | 4 | 5 | 4 | 2 | 3 | **29** |
| 404 | 3 | 3 | 2 | 4 | 5 | 5 | 1 | 4 | **27** |
| Services JSON | 4 | 3 | 3 | 2 | 4 | 4 | 3 | 3 | **26** |
| **Workshops page** | 2 | 5 | 2 | 1 | 4 | 5 | 2 | 2 | **23** |
| Thanks | 3 | 1 | 2 | 4 | 5 | 3 | 1 | 4 | **23** |
| Home — "Who I am" | 1 | 4 | 2 | 3 | 4 | 3 | 2 | 2 | **21** |
| Home — workshops teaser | 3 | 4 | 2 | 2 | 4 | 4 | 1 | 2 | **22** |
| Meta / SEO set | 1 | 4 | 3 | 3 | 4 | 4 | 2 | 1 | **22** |
| Gallery set descriptions | 2 | 2 | 1 | 1 | 4 | 3 | 1 | 3 | **17** |
| llms.txt bio | 1 | 4 | 2 | 1 | 4 | 4 | 1 | 3 | **20** |

**Site average: 28.9 / 40 (72%)**

The distribution matters more than the average. This isn't a site with mediocre copy. It's a site with **two distinct writers on it**: one scoring 34–39, one scoring 17–23, with almost nothing in between. The high scorers are everywhere you had nothing to sell. The low scorers are everywhere you did.

---

## 7. Findings

### F1 — The site changes person mid-page. Highest priority.

`src/content/pages/home.json` is third person:

> "Paul is a technologist from the Philippines. **He's** worked across industries…"

It renders on the homepage under a heading that says **"Who I am"**, roughly one screen below a first-person hero:

> "**I** help teams figure out what to build."

So within one scroll the reader meets "I", then a heading promising "I", then "he." The effect is a bio written by a publicist pasted into a site written by a person.

Meta descriptions do the same: `/projects` displays "Things **I've** built" while its `<meta description>` says "things **he's** built." Same sentence, two people.

**Fix:** first person everywhere a human reads it. Third person is defensible only in JSON-LD `Person` schema, where it's a data format, not prose.

### F2 — Two voices, and the offer pages have the weaker one

Paul-who-writes: *"Australian hours weren't for me." / "usually me, a year from now" / "half-formed notes. About things that bother me."*

Paul-who-sells: *"practical capability" / "operational roadmaps" / "high-ROI opportunities" / "actionable policy standards" / "map your team's bottlenecks" / "target outcomes" / "real artifacts."*

The second list is B2B enablement English. It is interchangeable with any AI-consulting site on the internet, which is a problem specific to this page, because `/workshops` contains this sentence:

> "A practitioner, not a vendor trainer."

The claim is true. The prose around it is written in vendor-trainer. A reader who has read three of these decks this quarter will pattern-match on the register before they get to the argument.

Note what is *not* wrong here: `/workshops` scores **5 on specificity**. Real prices, real seat caps, real deletion policy, named elections. Do not lose any of that while humanizing. The problem is only the connective tissue between the facts.

### F3 — "X, not Y" is used eleven times

An inventory of shipping instances:

1. "working prototypes … — **not** generic vendor slides" (home teaser)
2. "run on your actual documents and challenges, **not** hypothetical slides" (workshops process)
3. "**no** corporate procurement required" (workshops)
4. "so you leave with real artifacts **rather than just** a completion certificate" (workshops FAQ)
5. "Sessions are interactive, **not** lecture-style" (services)
6. "for the group, **not** per head" (workshops)
7. "I will say so on that call **rather than** in a proposal" (workshops enquiry)
8. "A practitioner, **not** a vendor trainer" (workshops)
9. "Practical direction, **not** a slide deck you'll never open" (services)
10. "sequenced by impact — **not** by what's trendy" (services)
11. "**No** vague retainers" (work with me)

Once it's a voice. Eleven times it's a tic, and it's the exact negative-parallelism pattern flagged in the AI-writing literature. It also means the site spends a large share of its persuasive words describing **what you are not** — defining yourself by the competitor you're distancing from, which quietly makes the competitor the subject.

**Keep #7.** It's the best one: it commits to a specific behaviour at your own cost. Convert the other ten into positive statements.

### F4 — Rule of three, everywhere on the offer pages

Sampling `/workshops` and `services/*.json`:

- "working prototypes, ranked operational use cases, or a team-wide AI standard"
- "your tools, documents, and data policies"
- "goals, users, current systems, and operational bottlenecks"
- "firewall rules, tool access, network allowances, and account provisioning"
- "prototypes, notes, and documents"
- "bottlenecks, current tooling, and target outcomes"
- "workflows, documents, and business context"
- "deliverables, milestones, cadence, and a fixed cost"
- "organizational strategy, risks, and high-ROI opportunities"

Some are legitimate — a security baseline genuinely has four items. Most are cadence. The tell is that they're interchangeable: swap any two lists between paragraphs and nothing breaks. When a triad can be shuffled without loss, it isn't information.

**Fix:** for each list, ask whether the third item earns its comma. Usually two specific things beat three general ones.

### F5 — The gallery set descriptions are the most obviously machine-written text on the site

All four follow one template: `[Artist] [verb]-ing at [Venue]. [Adj] noun, [adj] noun, and [adj] noun.`

> "HONNE performing live at Wanderland Music & Arts Festival. Warm synths, intimate vocals, and dreamy stage lights captured from the crowd."
> "Daniel Caesar's soulful set at Wanderland Music & Arts Festival. Smooth R&B, golden stage lighting, and an electric crowd energy."

Promotional adjectives, forced triad, identical structure, zero information a reader couldn't get from the photographs. And "an electric crowd energy" is ungrammatical.

This matters more than its word count suggests. The gallery is the one section that is purely yours, with nothing being sold. Stock-caption prose there undercuts the personal-site premise harder than the same prose would on a services page.

### F6 — Five different bios, none authoritative

| Where | Version |
|---|---|
| `seo.json` | "Tech leader from the Philippines — banking systems, election-night **platforms**, digital education." |
| `index.astro` meta | "Technologist from the Philippines — banking systems, election-night **newsrooms**, national-scale education." |
| `home.json` | "banking and finance, media, and national-scale digital education — shipping everything from banking systems to election-night platforms" |
| `llms.txt` | "national-scale systems … banking platforms, election-night newsrooms, and national education infrastructure" |
| `/workshops` | "11+ years delivering high-stakes technology: Head of Tech Operations at Rappler…" |

Same three jobs, five phrasings, three different nouns for the same Rappler work ("platforms" / "newsrooms" / "infrastructure"). This is synonym cycling — the pattern where a writer varies a term for freshness and loses precision. A reader hitting three pages reads the same triad three times with the words shuffled, which reads as filler even when each version is individually fine.

**Fix:** write one canonical sentence. Use it verbatim everywhere. Repetition is not a flaw in positioning copy; it's how positioning works.

### F7 — Microcopy is the biggest personality-per-word opportunity, and it's the least invested

`/thanks` in full:

> **Thanks.**
> Your message has been sent. I'll get back to you as soon as I can.

That is the default text of every contact form ever built. It is also the single highest-intent moment on the site — someone just decided to talk to you — and it's the one screen with no you in it. "As soon as I can" is a non-promise; it tells the reader nothing about whether to expect a reply tomorrow or never.

`/404` has the same problem: correct, characterless, indistinguishable from a framework default.

Counter-example already on the site: `/projects` empty state, "Nothing on the shelf… yet." with "Ask me what I'm building." That's the right instinct. It just hasn't been applied to the other four.

### F8 — Rhythm is flat on the offer pages

The `heroIntro` is four sentences of 9, 27, 24, and 10 words, each declarative, each following subject-verb-object. Workshop paragraphs cluster at 22–35 words with one em dash apiece.

`about.md` — your actual writing — runs 8 words, then 45, then 13, then a one-line paragraph that lands like a punch: *"I think of technology as a gun."*

That variation **is** the humanity. Nothing else on this list produces as much of it per unit of effort.

### F9 — Craft inconsistencies

- **Curly and straight apostrophes mixed inside single files.** `workshops.astro` has `team’s` and `I don’t` (curly) alongside `Owners'` (straight); `index.astro` uses straight throughout. Visible as inconsistent glyphs in Courier Prime.
- **en-GB and en-US mixed.** "Organisation" and "Enquire" (workshops form) against "prioritized", "optimizing", "personalized" elsewhere; "optimised" in the `culture` topic intro. Pick en-US and hold it, or pick en-GB — but "prioritized" and "organisation" on the same page is neither.
- **Title Case on the workshops page only.** "Discovery & Scope", "Pre-flight Check", "Hands-on Session", "30-Day Check-in", "Data & Security Baseline", "Frequently Asked Questions" — against the rest of the site's sentence case ("Who I am", "What I do", "How it works", "Get in touch"). Title Case in headings is on the AI-tells list; here it's also just internally inconsistent.
- **One section, three names.** Nav says "Writing", the page `<h1>` says "Thoughts", the topic archives link back as "← All thoughts", the RSS feed is "Paul Fernandez · Thoughts". Pick one.
- **"Frequently Asked Questions"** on `/workshops` vs **"Questions"** on `/work-with-me`. The second is better and in voice.
- **`★ Key takeaway`** in `KeyTakeaway.astro` is the site's only decorative glyph in body copy. It reads as a badge on a page that has otherwise removed every badge.

### F10 — One fact, two files, already drifting

`index.astro` hardcodes:
> "September – October 2026 dates open"
> "In-house engagements **strictly limited to** 1–2 teams per month."

`workshops.astro` has its own `availability` const:
> window: "September – October 2026"
> note: "**One or two** team engagements a month."

Same two facts, two phrasings, two files. They will drift the first time a date changes. Also: "strictly limited to" is scarcity marketing, the exact register the Phase 21 de-SaaS pass removed from the design. The workshops-page phrasing ("One or two team engagements a month") is the honest, in-voice version — it states a capacity rather than manufacturing urgency.

Separately: today is 2026-09-06 and the window closes in under two months, with no "as of" date on the page. Worth a mechanism, not just a rewrite.

---

## 8. Rewrites

Lines marked **[needs your fact]** contain a plausible detail I invented for shape. Replace it with what actually happened — the whole point is that only you have these.

### 8.1 `home.json` → `heroIntro`

**Before** (21/40)
> Paul is a technologist from the Philippines. He's worked across industries — banking and finance, media, and national-scale digital education — shipping everything from banking systems to election-night platforms. These days he helps teams figure out what to build, translating between the people who need it and the people who build it. He writes about technology, economy, and psychology.

**After**
> I'm a technologist from the Philippines.
>
> I built account-opening software for a bank, ran election-night results at Rappler through two national votes, and now keep the systems standing at a college full of working students. What I actually do in every one of those jobs is stand between the people who need something and the people who have to build it.
>
> That gap is where most projects die. I write here about technology, money, and why people do what they do.

Changes: first person; 7 / 55 / 26 / 15-word sentences instead of four even ones; "two national votes" and "a college full of working students" replace "national-scale digital education"; drops the false range ("everything from X to Y"); adds one opinion ("that gap is where most projects die") because the previous version had none.

### 8.2 Homepage — "Who I am" heading

Keep the heading; it's good and it's in voice. It only failed because the paragraph under it was in third person. Fixed by 8.1.

### 8.3 `/thanks`

**Before** (23/40)
> **Thanks.**
> Your message has been sent. I'll get back to you as soon as I can.

**After**
> **Got it.**
> Your message is in my inbox. I read everything and usually reply within two days. If it's been longer than that, I'm probably mid-workshop — send it again, I won't mind. **[needs your fact: is two days true?]**

Changes: an actual commitment instead of "as soon as I can"; permission to nudge, which is a thing a person says and a form never does.

### 8.4 `/404`

**Before** (27/40)
> **404**
> That page doesn't exist. It may have moved, or the link may be wrong.

**After**
> **404**
> Nothing here. Either I moved it and forgot to leave a note, or the link was wrong to begin with. The things that do exist:

Changes: takes responsibility instead of narrating passive possibilities; "and forgot to leave a note" is the admission that makes it sound like a person maintains this site.

### 8.5 `/workshops` lead

**Before** (part of the 23/40 page)
> Hands-on AI sessions for individuals and teams. Run on your actual workflows and tools — ending in working prototypes, operational roadmaps, or team-wide standards.

**After**
> You bring real work — an actual document, an actual bottleneck, something on your desk right now. We spend the session on that instead of a demo dataset, and you leave holding whatever we built.

Changes: cuts the triad; "operational roadmaps" and "team-wide standards" are category words and go; addresses the reader as "you" from the first word; one em dash becomes zero.

### 8.6 `/workshops` — "A practitioner, not a vendor trainer"

**Before**
> **A practitioner, not a vendor trainer.**
> 11+ years delivering high-stakes technology: Head of Tech Operations at Rappler (PHVote election results across two national elections), IT Manager at MMDC, and systems analyst at PSBank.
>
> I don't sell AI subscriptions or pre-packaged enterprise software. My focus is practical capability: leaving your team holding working prototypes, realistic roadmaps, or actionable policy standards.

**After**
> **I've been on the other side of this.**
> Eleven years shipping things that broke in public when they broke. I ran tech operations at Rappler through the 2019 and 2022 elections, where PHVote had to publish results live while the country watched. Before that: IT manager at MMDC, systems analyst at PSBank.
>
> I have nothing to sell you afterwards — no subscription, no platform, no certification. What I know is what happens to a plan once real people and real deadlines get hold of it, and that's what the session is about.

Changes: drops the negative-parallel headline for a claim that does the same work positively; "things that broke in public when they broke" is the specific, self-implicating detail the original was too polished to include; "practical capability" and "actionable policy standards" removed; the triad becomes two clauses.

### 8.7 Services — `product-consultation.json`

**Before** (26/40)
> From martech and digital marketing to product building. I help you map where tech actually moves the needle — optimizing how leads become customers, studying the information architecture behind the journey, and applying a bit of psychology to why people convert. Practical direction, not a slide deck you'll never open.

**After**
> I help you find the two or three places where technology actually changes your numbers, and say plainly which of the other twenty it won't. Usually that means looking hard at where people fall out of your funnel, and why — the answer is more often a confusing page than a missing feature. You get direction you can act on this quarter.

Changes: "moves the needle" gone; the -ing triad gone; the negative parallelism gone; "the answer is more often a confusing page than a missing feature" is an actual opinion, which is what a consultant is selling. Ends on what the reader gets rather than on a competitor.

The FAQ line **"Part of my job is telling you when the boring solution is the right one"** is the best sentence in `services/` — leave it exactly as it is.

### 8.8 Gallery set descriptions

**Before** (17/40)
> Daniel Caesar's soulful set at Wanderland Music & Arts Festival. Smooth R&B, golden stage lighting, and an electric crowd energy.

**After** — pattern, not final text
> Daniel Caesar at Wanderland. Shot from the back half of the field on a 50mm, which is why most of these are silhouettes and I've made peace with it. **[needs your facts: position, lens, what actually went wrong]**

The rule for all four: one line of what it was, one line of something only the person holding the camera would know. Kit, weather, a mistake, why you kept a frame that isn't technically good. That's the difference between a caption and a photographer.

### 8.9 The canonical bio

Write once, use in `seo.json`, `index.astro` meta, `llms.txt`, and anywhere else the sentence is needed. Suggested:

> Technologist from the Philippines. I've shipped banking systems, run election-night results at Rappler through two national votes, and now build for a college serving thousands of working students. I help teams work out what to build.

Then delete the four variants. Consistency here is a feature.

### 8.10 `llms.txt` bio

**Before** (20/40)
> Paul Fernandez is a product technologist, consultant, and builder based in the Philippines. He specializes in turning complex, ambiguous business goals into clear, actionable technical and product specifications for engineering teams. With extensive experience shipping national-scale systems under intense pressure—including banking platforms, election-night newsrooms, and national education infrastructure—Paul helps organizations build the right product without wasting engineering bandwidth or losing focus.

Every tell in one paragraph: third person, three rule-of-three lists, "specializes in" avoiding a plain verb, "extensive experience," "engineering bandwidth," unspaced em dashes.

**After**
> Paul Fernandez is a technologist in the Philippines. He turns vague business goals into specs a development team can build from. He ran tech operations at Rappler through the 2019 and 2022 Philippine elections, built account-opening software at PSBank, and is now IT manager at Mapúa Malayan Digital College. He writes about technology, money, and psychology, and runs AI workshops for teams in Manila and remotely.

Third person is correct here — it's a machine-readable card, and models quoting it should say "Paul is," not "I am." That's the one place F1 doesn't apply. Everything else — the triads, the abstractions, the copula avoidance — still goes.

### 8.11 Home teaser / workshops availability

Delete the hardcoded string in `index.astro` and import the same `availability` object the workshops page uses. Then use the honest phrasing in both:

**Before:** "In-house engagements strictly limited to 1–2 teams per month."
**After:** "I take one or two team engagements a month, which is genuinely all I can run well."

One source of truth, and the constraint reads as a capacity rather than a countdown timer.

---

## 9. Priority order

**Tier 1 — do first, small diffs, biggest effect**

1. F1 — first person everywhere a human reads. `home.json` and every third-person `<meta description>`. *(§8.1)*
2. F6 / 8.9 — write the canonical bio, replace all five variants.
3. F7 — rewrite `/thanks` and `/404`. Two files, maybe 60 words, and they're the two screens with the most attention per word on the site. *(§8.3, §8.4)*
4. F5 — rewrite the four gallery descriptions. *(§8.8)*
5. F10 — de-duplicate the availability fact; drop "strictly limited to". *(§8.11)*

**Tier 2 — the offer pages**

6. F2 / F3 / F4 — a voice pass on `/workshops` and `services/*.json`. Keep every price, cap, and policy. Change only the connective prose. *(§8.5–8.7)*
7. F8 — vary sentence length. Concretely: in each paragraph of five sentences or more, make one of them under eight words.
8. F3 — reduce "X, not Y" from eleven instances to two.

**Tier 3 — craft sweep**

9. Straight apostrophes site-wide.
10. One spelling convention (recommend en-US given "prioritized"/"optimizing" already dominate; then "Organisation" → "Organization", "Enquire" → "Ask", "optimised" → "optimized").
11. Sentence case on the `/workshops` headings; "Frequently Asked Questions" → "Questions".
12. Pick one name for the writing section — nav, `<h1>`, RSS title, and back-links.
13. Drop the `★` from `KeyTakeaway`.

**Do not touch**

The colophon (39/40), the home hero lead (37/40), the nine topic-archive intros (37/40), the thoughts index lead, the footer statement, "Nothing on the shelf… yet.", "Australian hours weren't for me.", and "Part of my job is telling you when the boring solution is the right one." These are the calibration set. Every rewrite above is trying to sound like these already do.

---

## 10. The short version

The site does not have a copywriting problem. It has a **confidence problem that appears only on the pages where money is involved.**

Where you write as yourself, the copy is genuinely good — dry, specific, self-implicating, unmistakably one person. Where you write as a service provider, you switch into an acquired register: triads, "practical capability," "not generic vendor slides," third-person bio. The Phase 21 de-SaaS pass removed the glass cards and the pill nav. The same pass hasn't been run on the sentences.

The fix isn't adding jokes. It's letting the person who wrote *"I think of technology as a gun"* write the workshops page too.

---

*Sources: [NN/g — Concise, SCANNABLE, and Objective](https://www.nngroup.com/articles/concise-scannable-and-objective-how-to-write-for-the-web/) · [NN/g — Be Succinct!](https://www.nngroup.com/articles/be-succinct-writing-for-the-web/) · [NN/g — Applying writing guidelines to web pages](https://www.nngroup.com/articles/applying-writing-guidelines-web-pages/) · [NN/g — The four dimensions of tone of voice](https://www.nngroup.com/articles/tone-of-voice-dimensions/) · [NN/g — Impact of tone of voice on brand perception](https://www.nngroup.com/articles/tone-voice-users/) · [Wikipedia — Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) · [Indelible Think — Writing conversational copy](https://indeliblethink.co.uk/writing-conversational-copy/) · [Peer to Peer Marketing — Website copywriting](https://peertopeermarketing.co/website-copywriting/) · [Building a portfolio with personality](https://erwww.in/blog/portfolio-with-personality/) · [Mirasee — Copywriting portfolios](https://mirasee.com/blog/copywriting-portfolio/)*
