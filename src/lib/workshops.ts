export const availability = {
  window: 'September – October 2026',
  note: 'One or two team engagements a month. Open cohort dates are not up yet — ask if you want a seat.',
};

export const openEnquireLabel = 'Ask for the next date';
export const teamEnquireLabel = 'Start a conversation';

export type RundownRow = {
  time: string;
  item: string;
};

export type OpenSession = {
  id: string;
  title: string;
  tagline: string;
  who: string;
  format: string;
  price: string;
  priceNote: string;
  walkout: string;
  featured?: boolean;
  rundown?: RundownRow[];
};

export type TeamSession = {
  id: string;
  title: string;
  detail: string;
  price: string;
  walkout?: string;
  featured?: boolean;
};

export type ProcessStep = {
  title: string;
  body: string;
};

export type WorkshopFaq = {
  q: string;
  a: string;
};

export const openSessions: OpenSession[] = [
  {
    id: 'fluency',
    title: 'AI fluency & media literacy',
    tagline: 'What AI makes for you, and what AI makes at you.',
    who: 'Professionals across all fields. No technical background assumed.',
    format: '2.5 hours · Zoom · 25 seats',
    price: '₱1,500',
    priceNote: 'per seat',
    walkout:
      'A practical daily workflow habit and a reliable framework for checking synthetic content and spotting AI hallucinations.',
    featured: true,
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
    id: 'owners-table',
    title: "The owners' table",
    tagline: 'Where AI pays in a business — and where it does not.',
    who: 'Owners, founders, and operators weighing where to invest.',
    format: 'Half day · Zoom · 10 seats',
    price: '₱6,500',
    priceNote: 'per seat',
    walkout:
      'Two or three prioritized AI use cases for your business, each with realistic cost ranges, operational requirements, and immediate next steps.',
  },
  {
    id: 'ship-the-idea',
    title: 'Ship the idea, not the deck',
    tagline: 'Vibe coding and rapid prototyping for non-engineers.',
    who: 'Product managers, marketers, and founders. Browser only, nothing to install.',
    format: 'Half day · Zoom · 12 seats',
    price: '₱7,500',
    priceNote: 'per seat',
    walkout:
      'A functional interactive web prototype of your product concept built in the browser to validate directly with stakeholders.',
  },
];

export const teamSessions: TeamSession[] = [
  {
    id: 'half-day',
    title: 'Half-day team workshop',
    detail: "Up to 20 people. Interactive problem-solving run on your team's tools, workflows, and real documents.",
    price: 'from ₱90,000',
    walkout:
      'A ranked list of where AI pays in your operation this quarter, and one workflow the room actually ran.',
    featured: true,
  },
  {
    id: 'talk',
    title: 'Talk or keynote',
    detail:
      '60–90 minutes for a conference, all-hands, or institution. Grounded perspective on applied AI. If the brief is disinformation, deepfakes, and trust, I draw from five years running tech operations at Rappler.',
    price: 'from ₱45,000',
  },
  {
    id: 'full-day',
    title: 'Full-day team intensive',
    detail: 'Up to 20 people. Dedicated building time to work through complex workflows and set team-wide standards.',
    price: 'from ₱140,000',
    walkout: 'Mapped operations and a shared way of working the team can keep using the next week.',
  },
  {
    id: 'leadership',
    title: 'AI for leadership',
    detail:
      'Half day, up to 12 executives. Intake questionnaire and scoping included to weigh real risks, prioritize investments, and separate hype from leverage.',
    price: 'from ₱120,000',
    walkout: 'A decision memo: where to invest, where not to, and what the next 90 days actually look like.',
  },
  {
    id: 'shared-standard',
    title: 'From shadow AI to a shared standard',
    detail:
      'Two facilitated sessions (up to 20 people). Best-practice guidance and structured collaboration so your team drafts its own operational AI policy.',
    price: 'from ₱250,000',
    walkout: 'A draft operational AI policy your team wrote, ready to take to a board or leadership meeting.',
  },
];

export const openProcess: ProcessStep[] = [
  {
    title: 'Ask for the next date',
    body: 'Tell me which session. There is no checkout on this page — you are asking to be notified.',
  },
  {
    title: 'Date and Zoom link',
    body: 'When a cohort is set I email you the evening, the link, and how to pay.',
  },
  {
    title: 'Show up with real work',
    body: 'A document, a bottleneck, something already on your desk. Not a demo file.',
  },
  {
    title: 'Leave with the walkout',
    body: 'The habit, the use cases, or the prototype named on the session you picked.',
  },
];

export const teamProcess: ProcessStep[] = [
  {
    title: 'Discovery and scope',
    body: 'A 30-minute call to understand the bottleneck and what you want to walk away with.',
  },
  {
    title: 'Pre-flight check',
    body: 'We test tool access and sample data beforehand so the session starts without IT delays.',
  },
  {
    title: 'Hands-on session',
    body: 'Capped at 12–20 people, working on your real documents and everyday problems.',
  },
  {
    title: '30-day check-in',
    body: 'We reconnect a month later to check whether the workflows are still in daily use.',
  },
];

export const faqItems: WorkshopFaq[] = [
  {
    q: 'When is the next Fluency session, in PHT?',
    a: 'A date is not up yet. Ask and I will email you when the first cohort is set. Open sessions run live on Zoom in Philippine Time (PHT, UTC+8).',
  },
  {
    q: 'English or Tagalog? What does remote mean if I am in Cebu or Dubai?',
    a: 'English. I switch to Tagalog in the room when it helps. Remote means Zoom in PHT — Cebu or Dubai is fine; the clock is still Manila.',
  },
  {
    q: 'Do I need a ChatGPT Plus account, and who pays?',
    a: 'Bring whatever you already use — ChatGPT, Copilot, Claude, or Gemini. A Microsoft-only shop can still sit at the owners\' table. You use your own account. Team sessions confirm tools on the pre-flight.',
  },
  {
    q: 'How do I pay? Can I get an official receipt for ₱1,500?',
    a: 'Payment is not taken on this page. Once a date is set I email you how to pay, with cancellation terms in that email. Official receipts can be issued for open seats and for team engagements. Corporate procurement (BIR, vendor accreditation) is arranged on that email, not guessed from a Gmail address.',
  },
  {
    q: 'If I cannot attend, do I get a refund?',
    a: 'Payment is not taken on this page — you are asking to be notified, not buying a ticket. Cancellation terms go out with the payment email once a date is set.',
  },
  {
    q: 'Is the 30-day check-in included?',
    a: 'Included in team engagements. Not included in an open-cohort seat.',
  },
  {
    q: 'What if IT blocks the tools on the day?',
    a: 'Team sessions resolve that before you sign. The pre-flight check covers firewall rules, tool access, and account provisioning. Open cohorts run on whatever you can already open in a browser.',
  },
  {
    q: 'Can I see a sample agenda before I loop in my VP?',
    a: 'The Fluency rundown is on this page. For a team session I send a scoped agenda after the call.',
  },
  {
    q: 'Will my competitors be in the Owners\' table Zoom?',
    a: 'Possibly. It is a public cohort of owners. Do not bring confidential numbers — we work at the level of use-case shape, not your books.',
  },
];

export function featuredOpenSession(): OpenSession {
  return openSessions.find((s) => s.featured) ?? openSessions[0];
}

export function otherOpenSessions(): OpenSession[] {
  return openSessions.filter((s) => !s.featured);
}

export function featuredTeamSession(): TeamSession {
  return teamSessions.find((s) => s.featured) ?? teamSessions[0];
}

export function otherTeamSessions(): TeamSession[] {
  return teamSessions.filter((s) => !s.featured);
}
