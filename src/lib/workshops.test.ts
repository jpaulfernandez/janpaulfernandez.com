import { describe, it, expect } from 'vitest';
import {
  availability,
  enquireLabel,
  faqItems,
  fit,
  landingSections,
  marketStats,
  process,
} from './workshops';

describe('availability', () => {
  it('reframes booking to 1-on-1s and small groups, not a cohort', () => {
    const note = availability.note.toLowerCase();
    expect(note).toMatch(/1-on-1|one-on-one/);
    expect(note).toMatch(/group/);
    expect(note).not.toMatch(/cohort|seat/);
  });

  it('does not claim a public schedule is published', () => {
    expect(availability.note.toLowerCase()).toMatch(/not up|no date|hold a date/);
    expect(typeof availability.window).toBe('string');
  });

  it('states no invented cadence', () => {
    expect(availability.note.toLowerCase()).not.toMatch(/a month|per month|each month|one or two/);
  });
});

describe('the landing router', () => {
  it('splits into exactly two audience sections', () => {
    expect(landingSections).toHaveLength(2);
  });

  it('signals a personal floor and an org ask, and nothing else priced', () => {
    const [personal, org] = landingSections;
    expect(personal.signal).toMatch(/₱2,500/);
    expect(org.signal.toLowerCase()).toMatch(/minimum/);
    // No per-door prices on the landing — only the section signal carries one.
    for (const s of landingSections) {
      for (const door of s.doors) {
        expect(`${door.label} ${door.clarifier}`).not.toMatch(/₱/);
      }
    }
  });

  it('carries three personal doors and four org doors', () => {
    expect(landingSections[0].doors).toHaveLength(3);
    expect(landingSections[1].doors).toHaveLength(4);
  });

  it('points course doors at trailing-slashed /workshops/[slug]/ pages', () => {
    const courseDoors = landingSections.flatMap((s) => s.doors).filter((d) => d.href.startsWith('/'));
    expect(courseDoors.length).toBeGreaterThanOrEqual(4);
    for (const d of courseDoors) {
      expect(d.href).toMatch(/^\/workshops\/[a-z-]+\/$/);
    }
  });

  it('sends the custom and speaker doors to the enquiry form with a preset', () => {
    const enquireDoors = landingSections.flatMap((s) => s.doors).filter((d) => d.href === '#enquire');
    expect(enquireDoors).toHaveLength(2);
    for (const d of enquireDoors) {
      expect(d.enquire && d.enquire.length).toBeGreaterThan(3);
    }
  });

  it('carries no per-seat or cohort language anywhere', () => {
    const blob = landingSections
      .flatMap((s) => [s.heading, s.signal, ...s.doors.flatMap((d) => [d.label, d.clarifier])])
      .join(' ')
      .toLowerCase();
    expect(blob).not.toMatch(/\bseat\b|\bcohort\b|25 seats/);
  });
});

describe('who this is for', () => {
  it('says who should not come, not just who should', () => {
    expect(fit.forYou.length).toBeGreaterThanOrEqual(3);
    expect(fit.notForYou.length).toBeGreaterThanOrEqual(3);
  });

  it('keeps the scope boundaries the honesty pass established', () => {
    const blob = fit.notForYou.join(' ').toLowerCase();
    expect(blob).toMatch(/certificat/);
    expect(blob).toMatch(/roi|guarantee/);
    expect(blob).toMatch(/build it for you/);
  });
});

describe('how it works', () => {
  it('is one ladder, not two competing ones', () => {
    expect(process.length).toBeGreaterThanOrEqual(3);
    expect(process.length).toBeLessThanOrEqual(4);
  });

  it('starts with a conversation rather than a checkout', () => {
    expect(process[0].body.toLowerCase()).not.toMatch(/pay|checkout|card/);
  });
});

describe('market stats', () => {
  it('attributes every figure to a source with a URL', () => {
    expect(marketStats.length).toBeGreaterThanOrEqual(3);
    for (const s of marketStats) {
      expect(s.figure).toMatch(/%/);
      expect(s.sourceUrl).toMatch(/^https:\/\//);
      expect(s.sourceLabel.length).toBeGreaterThan(4);
    }
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

  it('drops the per-seat cohort framing', () => {
    expect(blob).not.toMatch(/\bcohort\b|open-cohort|seat in a cohort/);
  });

  it('covers language, tools, receipts, refunds, and the 30-day check-in', () => {
    expect(blob).toMatch(/english|tagalog/);
    expect(blob).toMatch(/chatgpt|copilot|claude/);
    expect(blob).toMatch(/official receipt/);
    expect(blob).toMatch(/refund|payment is not taken|no payment/);
    expect(blob).toMatch(/30-day|thirty-day|check-in/);
  });

  it('does not use a purchase verb for a form scroll', () => {
    expect(enquireLabel.toLowerCase()).not.toMatch(/reserve|buy|checkout/);
  });

  it('does not promise an official receipt it cannot yet issue', () => {
    // BIR registration / ORs are still blocked-on-Paul (see plan.md).
    expect(blob).not.toMatch(/official receipts? can be issued|can issue an? official receipt/);
    expect(blob).toMatch(/cannot issue a bir official receipt|no bir/);
  });
});
