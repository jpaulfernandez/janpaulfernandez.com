/**
 * The /workshops landing.
 *
 * One idea — demystifying AI — routed through two audiences: you (or a business
 * owner), or your organisation. Personal work is 1-on-1 or a small group you
 * bring; there is no per-seat cohort. The catalog itself — durations, formats,
 * outlines, and the from-price for each course — lives in the `courses`
 * content collection and is rendered by `/workshops/[slug]`. This file keeps
 * only the argument around it: the router doors, the fit boundary, the sourced
 * stats, the process, and the FAQ.
 *
 * Price signals on the landing are signals only (decision confirmed with Paul):
 * personal = from ₱2,500; org = ask for our minimum. The full ladder lives on
 * each course page, and every number is still a hypothesis until paid delivery
 * tests it against real hours.
 */

export const availability = {
  window: 'September – October 2026',
  note: 'Booking 1-on-1s and small groups now — message me to hold a date. A fixed public schedule is not up yet.',
};

export const enquireLabel = 'Talk to me';

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
 * The router. Two audiences, a stack of plain-language doors each. A door is a
 * pain line + where it goes: a course page, or the enquiry form preset via
 * `enquire`. The only price on the whole landing is the per-section signal.
 * ------------------------------------------------------------------------ */

export type LandingDoor = {
  /** The pain, in plain language. */
  label: string;
  /** Where it goes, named short. */
  clarifier: string;
  /** A `/workshops/<slug>/` course page, or `#enquire`. */
  href: string;
  /** For `#enquire` doors: the value to preset in the form's "interested in". */
  enquire?: string;
};

export type LandingSection = {
  /** Anchor id, also the homepage deep-link target. */
  id: string;
  heading: string;
  /** from ₱2,500 · … / ask for our minimum — the section's only price. */
  signal: string;
  doors: LandingDoor[];
};

export const landingSections: LandingSection[] = [
  {
    id: 'for-you',
    heading: 'For you & business owners',
    signal: 'from ₱2,500 · 1-on-1 or a small group you bring',
    doors: [
      {
        label: 'New to AI and want to actually understand it',
        clarifier: 'AI Fluency & Media Literacy',
        href: '/workshops/ai-fluency/',
      },
      {
        label: 'You run a business and want to know where AI pays',
        clarifier: 'AI for Business',
        href: '/workshops/ai-for-business/',
      },
      {
        label: 'You want to build things yourself — vibe code with AI',
        clarifier: 'Vibe Coding',
        href: '/workshops/vibe-coding/',
      },
    ],
  },
  {
    id: 'for-orgs',
    heading: 'For your organization',
    signal: 'ask for our minimum',
    doors: [
      {
        label: 'Get leadership aligned and set your AI ground rules',
        clarifier: 'Leadership + Policy',
        href: '/workshops/leadership-ai/',
      },
      {
        label: 'Train the whole team to one standard',
        clarifier: 'AI Fluency (team)',
        href: '/workshops/ai-fluency/',
      },
      {
        label: 'Something specific to your department',
        clarifier: 'Custom',
        href: '#enquire',
        enquire: 'Something specific to my department',
      },
      {
        label: 'Invite me as a speaker',
        clarifier: 'Speaking',
        href: '#enquire',
        enquire: 'Invite me as a speaker',
      },
    ],
  },
];

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
 * One ladder, not two. A conversation first, never a checkout.
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
    body: 'Your documents, your tools, your everyday problems. 1-on-1 or a small group, so everyone in the room actually gets their hands on it.',
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
    q: 'When can I book, and what time zone?',
    a: "I'm booking 1-on-1s and small groups now — message me and we'll hold a date. A fixed public schedule is not up yet; ask and I'll tell you the next session I can run. Everything runs in Philippine Time (PHT, UTC+8), remote or in Manila.",
  },
  {
    q: 'Do I need a ChatGPT or any AI subscription?',
    a: 'A paid subscription helps, but it is not required — the free tiers of ChatGPT, Copilot, Claude, or Gemini are enough to follow along, and a paid plan just gives you more room. Either way you use your own account, whatever you already have. Team sessions confirm tools on the pre-flight.',
  },
  {
    q: 'How do I pay, and can I get an official receipt?',
    a: 'Payment is not taken on this page — you are asking to talk, not buying a ticket. Once we agree a date I email you how to pay, with cancellation terms in that email. One honest caveat: I cannot issue a BIR official receipt yet, so if your finance team needs formal documentation to expense a session, tell me up front and we will sort out what I can provide.',
  },
  {
    q: 'Why is the corporate price a "from"?',
    a: 'Because headcount, travel, extra sessions and custom material genuinely move it. I would rather publish a floor you can budget against than hide the number behind a form. The proposal after the call is a fixed price.',
  },
  {
    q: 'Is the 30-day check-in included?',
    a: 'Included in team engagements. Not included in a 1-on-1 or a small-group session.',
  },
];
