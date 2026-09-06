import { describe, it, expect } from 'vitest';
import {
  availability,
  featuredOpenSession,
  otherOpenSessions,
  featuredTeamSession,
  otherTeamSessions,
  teamSessions,
  openProcess,
  teamProcess,
  faqItems,
  openEnquireLabel,
} from './workshops';

describe('availability', () => {
  it('does not claim open-cohort dates are published', () => {
    const blob = `${availability.window} ${availability.note}`.toLowerCase();
    expect(blob).not.toMatch(/published below|dates open|dates published/);
    expect(availability.note.toLowerCase()).toMatch(/not up|no date|when .{0,40}ask/);
  });

  it('states team capacity instead of fake scarcity', () => {
    expect(availability.note.toLowerCase()).toMatch(/one or two/);
  });
});

describe('open sessions', () => {
  it('defaults to fluency as the starting offer', () => {
    expect(featuredOpenSession().id).toBe('fluency');
  });

  it('keeps the other two sessions behind the default', () => {
    expect(otherOpenSessions().map((s) => s.id)).toEqual(['owners-table', 'ship-the-idea']);
  });

  it('does not use a purchase verb for a form scroll', () => {
    expect(openEnquireLabel.toLowerCase()).not.toMatch(/reserve/);
    expect(openEnquireLabel.toLowerCase()).toMatch(/ask for the next date/);
  });

  it('does not advertise an early-bird price without an end date', () => {
    expect(featuredOpenSession().priceNote.toLowerCase()).not.toMatch(/early bird/);
  });

  it('includes a Fluency rundown a buyer can screenshot', () => {
    const rundown = featuredOpenSession().rundown ?? [];
    expect(rundown.length).toBeGreaterThanOrEqual(4);
    expect(rundown.some((row) => /deepfake|hallucin/i.test(row.item))).toBe(true);
  });
});

describe('team sessions', () => {
  it('defaults to the half-day workshop', () => {
    expect(featuredTeamSession().id).toBe('half-day');
  });

  it('has one talk/keynote, not two competing SKUs', () => {
    const talks = teamSessions.filter((s) => /talk|keynote/i.test(s.title));
    expect(talks).toHaveLength(1);
    expect(talks[0].detail.toLowerCase()).toMatch(/deepfake|disinformation|rappler/);
  });

  it('gives the default a walkout, not just an activity', () => {
    expect(featuredTeamSession().walkout).toBeTruthy();
    expect(featuredTeamSession().walkout!.length).toBeGreaterThan(40);
  });

  it('hides the rest of the catalog behind the default', () => {
    expect(otherTeamSessions().length).toBeGreaterThanOrEqual(3);
    expect(otherTeamSessions().some((s) => s.id === 'half-day')).toBe(false);
  });
});

describe('how it works', () => {
  it('describes an open-cohort path that does not involve IT or discovery', () => {
    const blob = openProcess.map((s) => `${s.title} ${s.body}`).join(' ').toLowerCase();
    expect(blob).not.toMatch(/firewall|discovery|intake/);
    expect(blob).toMatch(/zoom/);
  });

  it('keeps discovery and pre-flight on the team path only', () => {
    const blob = teamProcess.map((s) => `${s.title} ${s.body}`).join(' ').toLowerCase();
    expect(blob).toMatch(/call|scope/);
    expect(blob).toMatch(/pre-flight|preflight/);
  });
});

describe('faq', () => {
  const blob = faqItems.map((i) => `${i.q} ${i.a}`).join('\n').toLowerCase();

  it('does not open by arguing with free online courses', () => {
    expect(faqItems[0].q.toLowerCase()).not.toMatch(/free ai courses/);
  });

  it('answers when the next session is without inventing a date', () => {
    expect(blob).toMatch(/when is the next|next fluency|next session/);
    expect(blob).toMatch(/not up|no date|when .{0,80}ask/);
  });

  it('covers language, tools, receipts, refunds, and the 30-day check-in', () => {
    expect(blob).toMatch(/english|tagalog/);
    expect(blob).toMatch(/chatgpt|copilot|claude/);
    expect(blob).toMatch(/official receipt|\bor\b/);
    expect(blob).toMatch(/refund|payment is not taken|no payment/);
    expect(blob).toMatch(/30-day|thirty-day|check-in/);
  });
});
