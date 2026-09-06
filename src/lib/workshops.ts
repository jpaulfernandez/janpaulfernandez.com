/**
 * The /workshops offer.
 *
 * One idea — demystifying AI — sold through two doors: yourself, or your
 * organisation. Prices were set against PH market anchors in September 2026
 * (see `business/workshops-gtm.md` §4–§5 and the pricing note in plan.md):
 *
 *   Public seminars, PH norm        ₱2,500–₱15,000 / participant / day
 *   In-house sessions, PH norm      ₱40,000–₱280,000 / session
 *   LOKAL, public AI workshop       from ₱3,500 / seat
 *   Nexacu PH, AI for Leaders       ₱32,600 / person, 1 day, max 8
 *   AIM, AI for Business Leaders    ₱80,000–₱200,000+ / person, 3–5 days
 *
 * Every price here is still a hypothesis until paid delivery tests it against
 * real hours.
 */

export const availability = {
  window: 'September – October 2026',
  note: 'One or two team engagements a month. Open cohort dates are not up yet — ask if you want a seat.',
};

export const enquireLabel = 'Talk to me';

export type Track = 'personal' | 'enterprise';

export type Format = {
  /** How you buy it: an open seat, a one-on-one, a private group, a keynote. */
  label: string;
  /** Length, place, cap. */
  detail: string;
  price: string;
  priceNote?: string;
};

export type RundownRow = {
  time: string;
  item: string;
};

export type Offering = {
  id: string;
  track: Track;
  title: string;
  tagline: string;
  who: string;
  /** What you leave holding. Kept to one scannable line each. */
  outcomes: string[];
  formats: Format[];
  /** The honest ceiling on what this format can do. */
  caveat?: string;
  rundown?: RundownRow[];
};

export type AudienceRoute = {
  id: string;
  label: string;
  line: string;
  href: string;
};

export type ProcessStep = {
  title: string;
  body: string;
};

export type MarketStat = {
  figure: string;
  body: string;
  sourceLabel: string;
  sourceUrl: string;
};

export type WorkshopFaq = {
  q: string;
  a: string;
};

/* ---------------------------------------------------------------------------
 * Three audiences, two doors. Leadership and L&D both land on enterprise.
 * ------------------------------------------------------------------------ */

export const audienceRoutes: AudienceRoute[] = [
  {
    id: 'upskiller',
    label: 'You want to get good at this yourself',
    line: 'Everyone around you is using AI and you cannot tell whether you are doing it right — or being fooled by it.',
    href: '#personal',
  },
  {
    id: 'leader',
    label: 'You are deciding what your company should do about AI',
    line: 'Every vendor is pitching you a platform and you need to know where this actually pays in your operation.',
    href: '#enterprise',
  },
  {
    id: 'org',
    label: 'You need to train a team',
    line: 'Output quality depends on whoever happens to be good at prompting, and nobody can see what has been pasted into a chatbot.',
    href: '#enterprise',
  },
];

/* ---------------------------------------------------------------------------
 * The offer.
 * ------------------------------------------------------------------------ */

export const offerings: Offering[] = [
  {
    id: 'fluency',
    track: 'personal',
    title: 'AI fluency & media literacy',
    tagline: 'What AI makes for you, and what AI makes at you.',
    who: 'Professionals in any field. No technical background assumed.',
    outcomes: [
      'One task from your own week, done faster — with the prompt saved so you can run it again.',
      'A check you can run on any image, clip, or claim in under a minute.',
      'A straight answer on where AI is worth your time, and where it is not.',
    ],
    formats: [
      {
        label: 'Open cohort seat',
        detail: '2.5 hours · Zoom · 25 seats',
        price: '₱2,500',
        priceNote: 'per seat',
      },
      {
        label: 'One-on-one',
        detail: '90 minutes · your files, your tools',
        price: '₱7,500',
      },
      {
        label: 'Private group',
        detail: '2.5 hours · 3–8 people you bring',
        price: '₱30,000',
        priceNote: 'flat',
      },
    ],
    rundown: [
      { time: '0:00', item: 'What AI makes for you, and what AI makes at you.' },
      { time: '0:25', item: 'Pick one task from your actual week. We run it with the tools you already have.' },
      {
        time: '1:10',
        item: 'Break a deepfake and catch a hallucination on a live example — the check you will reuse.',
      },
      { time: '1:40', item: 'Turn that check into a daily habit on your own files.' },
      { time: '2:20', item: 'Walk out with the habit, plus a way to spot synthetic content.' },
    ],
  },
  {
    id: 'ship-the-idea',
    track: 'personal',
    title: 'Vibe coding & web basics',
    tagline: 'Ship the idea, not the deck.',
    who: 'Product managers, marketers, founders. Browser only — nothing to install.',
    outcomes: [
      'A working prototype of your own idea, running in a browser before you leave.',
      'Enough web literacy to say what you want without hand-waving at a developer.',
      'A clear line between what a prototype proves and what it does not.',
    ],
    caveat:
      'A prototype is a demo. It is not production, not secure, and not supported — your engineers still build the real thing.',
    formats: [
      {
        label: 'Open cohort seat',
        detail: 'Half day · Zoom · 12 seats',
        price: '₱7,500',
        priceNote: 'per seat',
      },
      {
        label: 'One-on-one',
        detail: 'Half day · we build your idea',
        price: '₱15,000',
      },
      {
        label: 'Private group',
        detail: 'Half day · 3–8 people you bring',
        price: '₱60,000',
        priceNote: 'flat',
      },
    ],
  },
  {
    id: 'team-fluency',
    track: 'enterprise',
    title: 'AI fluency & media literacy',
    tagline: 'The whole team working from the same understanding.',
    who: 'All-staff sessions, departments, schools. Run on your documents and your tools.',
    outcomes: [
      'Everyone in the room working from the same picture of what these tools do and do not do.',
      'One workflow your team actually ran, on your own material.',
      'A shared way to check what you are shown before it gets published or forwarded.',
    ],
    formats: [
      {
        label: 'Half day',
        detail: 'Up to 20 people · Zoom or your office',
        price: 'from ₱90,000',
      },
      {
        label: 'Full day',
        detail: 'Up to 20 people · deeper build time',
        price: 'from ₱160,000',
      },
    ],
  },
  {
    id: 'leadership',
    track: 'enterprise',
    title: 'AI for leadership + policy exercise',
    tagline: 'Where AI pays in your business, and the ground rules your team writes for it.',
    who: 'Owners, founders, GMs and leadership teams deciding what to fund.',
    outcomes: [
      'Two or three ranked use cases, each with a cost range and the assumptions behind it.',
      'A 30-day test for the first one — named owner, success threshold, kill criterion.',
      'A first draft of your AI ground rules, written by your own people, not by me.',
    ],
    caveat:
      'I do not author your policy, approve it, or represent it as compliant. The draft is yours, and it goes to your DPO, Legal and InfoSec.',
    formats: [
      {
        label: 'Open seat — explore first',
        detail: "The owners' table · half day · Zoom · 10 seats",
        price: '₱6,500',
        priceNote: 'per seat',
      },
      {
        label: 'Half day, private',
        detail: 'Up to 12 people · intake questionnaire and scoping call included',
        price: 'from ₱150,000',
      },
      {
        label: 'Two-session standard',
        detail: 'Up to 20 people · drafting, decision log, open-issues list',
        price: 'from ₱250,000',
      },
    ],
  },
  {
    id: 'talk',
    track: 'enterprise',
    title: 'Talk or keynote',
    tagline: 'Sixty to ninety minutes that change the conversation in a room.',
    who: 'Conferences, all-hands, campuses, civic groups. Any audience size.',
    outcomes: [
      'A room that stops treating AI as either magic or apocalypse.',
      'Language your people can use with each other the next morning.',
    ],
    caveat:
      'A keynote is a talk, not a workshop. Nobody walks out holding an artifact — if you need that, book a session above.',
    formats: [
      {
        label: 'Talk or keynote',
        detail: '60–90 minutes · on-site or remote',
        price: 'from ₱45,000',
      },
      {
        label: 'Disinformation, deepfakes and trust',
        detail: '60–90 minutes · drawn from five years of this at Rappler',
        price: 'from ₱75,000',
      },
    ],
  },
];

export const trackIntro: Record<Track, { label: string; heading: string; body: string }> = {
  personal: {
    label: 'For yourself',
    heading: 'Personal',
    body: 'Book a seat in an open cohort, an hour and a half one-on-one, or bring your own small group. You pay, you keep it.',
  },
  enterprise: {
    label: 'For your organisation',
    heading: 'Enterprise',
    body: 'Run on your tools, your documents and your actual bottleneck. Scoping call first, always — I will tell you if a session is the wrong answer.',
  },
};

export function personalOfferings(): Offering[] {
  return offerings.filter((o) => o.track === 'personal');
}

export function enterpriseOfferings(): Offering[] {
  return offerings.filter((o) => o.track === 'enterprise');
}

/**
 * The value that lands in Paul's inbox when someone picks a session. Readable
 * on its own — an id like `ship-the-idea` is not — and unique, which matters
 * because both tracks carry an offering called "AI fluency & media literacy".
 */
export function enquiryValue(offering: Offering): string {
  return `${trackIntro[offering.track].heading} — ${offering.title}`;
}

export function findOffering(id: string): Offering {
  const found = offerings.find((o) => o.id === id);
  if (!found) throw new Error(`Unknown offering: ${id}`);
  return found;
}

/* ---------------------------------------------------------------------------
 * Fit. The second half is the part that converts the buyer who has already sat
 * through a vendor deck.
 * ------------------------------------------------------------------------ */

export const fit = {
  forYou: [
    'You have a real task you are stuck on — a document, a bottleneck, a decision someone keeps asking you about.',
    'You have tried the free courses and still cannot tell which part applies to your job.',
    'You need to decide what to fund, and every vendor in your inbox is selling a platform.',
    'You keep seeing things online you are no longer sure are real.',
  ],
  notForYou: [
    'You want a certificate. There is not one, and I would not trust a two-hour one either.',
    'You want me to build it for you. That is real work, but it is a different conversation.',
    'You want a guaranteed ROI number. Nobody can honestly give you one before the work.',
    'You want a tools tour. The tools change every quarter; the judgment does not.',
  ],
};

/* ---------------------------------------------------------------------------
 * One ladder, not two. Open seats skip step 2 and nobody needs telling.
 * ------------------------------------------------------------------------ */

export const process: ProcessStep[] = [
  {
    title: 'Tell me what you are stuck on',
    body: 'Thirty minutes, costs nothing. If a session is the wrong answer I will say so on that call rather than in a proposal.',
  },
  {
    title: 'Scope and pre-flight',
    body: 'For team work: we agree the bottleneck, then test tool access and sample data beforehand so the day does not start with IT.',
  },
  {
    title: 'The session',
    body: 'Your documents, your tools, your everyday problems. Capped so everyone in the room actually gets their hands on it.',
  },
  {
    title: 'Thirty days later',
    body: 'For team engagements, we reconnect a month on to check whether any of it is still in daily use. That is the only measure that counts.',
  },
];

/* ---------------------------------------------------------------------------
 * Only figures with a source URL and a stated population belong here.
 * ------------------------------------------------------------------------ */

export const marketStats: MarketStat[] = [
  {
    figure: '65%',
    body: 'of Philippine organisations that have used AI never moved past pilot — while 92% have used it in some form.',
    sourceLabel: 'Philippine AI Report, 175 organisations',
    sourceUrl:
      'https://bworldonline.com/technology/2026/03/16/736555/ai-deployment-for-organizations-still-shallow-philippine-ai-report/',
  },
  {
    figure: '78%',
    body: 'of employees use AI daily. 35% get training for their actual role.',
    sourceLabel: 'Sprout, State of HR 2026',
    sourceUrl: 'https://sprout.ph/thought-leadership/2026-state-of-hr/',
  },
  {
    figure: '28%',
    body: 'trust in news in the Philippines, down ten points — the steepest fall of 48 markets.',
    sourceLabel: 'Reuters Digital News Report 2026',
    sourceUrl:
      'https://verafiles.org/articles/filipino-trust-in-news-posts-biggest-fall-digital-news-report-2026',
  },
];

export const faqItems: WorkshopFaq[] = [
  {
    q: 'When is the next open session, in PHT?',
    a: 'A date is not up yet. Ask and I will email you when the first cohort is set. Open sessions run live on Zoom in Philippine Time (PHT, UTC+8).',
  },
  {
    q: 'English or Tagalog? What does remote mean if I am in Cebu or Dubai?',
    a: 'English. I switch to Tagalog in the room when it helps. Remote means Zoom in PHT — Cebu or Dubai is fine; the clock is still Manila.',
  },
  {
    q: 'What is the difference between a one-on-one and a seat in a cohort?',
    a: 'Same material, different attention. A cohort seat is cheaper and you learn from other people\'s questions. A one-on-one runs entirely on your own files and goes wherever you need it to go — worth it if your work is unusual or confidential.',
  },
  {
    q: 'Do I need a ChatGPT Plus account, and who pays?',
    a: 'Bring whatever you already use — ChatGPT, Copilot, Claude, or Gemini. A Microsoft-only shop can still sit at the owners\' table. You use your own account. Team sessions confirm tools on the pre-flight.',
  },
  {
    q: 'How do I pay? Can I get an official receipt?',
    a: 'Payment is not taken on this page. Once a date is set I email you how to pay, with cancellation terms in that email. Official receipts can be issued for open seats and for team engagements. Corporate procurement — BIR, vendor accreditation — is arranged on that email, not guessed from a Gmail address.',
  },
  {
    q: 'If I cannot attend, do I get a refund?',
    a: 'Payment is not taken on this page — you are asking to be notified, not buying a ticket. Cancellation terms go out with the payment email once a date is set.',
  },
  {
    q: 'Why is the corporate price a "from"?',
    a: 'Because headcount, travel, extra cohorts and custom material genuinely move it. I would rather publish a floor you can budget against than hide the number behind a form. The proposal after the call is a fixed price.',
  },
  {
    q: 'Is the 30-day check-in included?',
    a: 'Included in team engagements. Not included in an open-cohort seat or a one-on-one.',
  },
  {
    q: 'What if IT blocks the tools on the day?',
    a: 'Team sessions resolve that before you sign — the pre-flight covers firewall rules, tool access and account provisioning. Open cohorts run on whatever you can already open in a browser.',
  },
  {
    q: 'Will my competitors be in the owners\' table Zoom?',
    a: 'Possibly. It is a public cohort of owners. Do not bring confidential numbers — we work at the level of use-case shape, not your books.',
  },
];
