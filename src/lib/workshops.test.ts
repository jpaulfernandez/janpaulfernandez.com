import { describe, it, expect } from 'vitest';
import {
  availability,
  audienceRoutes,
  enquireLabel,
  enterpriseOfferings,
  faqItems,
  fit,
  marketStats,
  offerings,
  personalOfferings,
  process,
  findOffering,
  enquiryValue,
} from './workshops';

describe('availability', () => {
  it('does not claim open-cohort dates are published', () => {
    const blob = `${availability.window} ${availability.note}`.toLowerCase();
    expect(blob).not.toMatch(/published below|dates open|dates published/);
    expect(availability.note.toLowerCase()).toMatch(/not up|no date|when .{0,40}ask/);
  });

  it('states team capacity instead of fake scarcity', () => {
    const note = availability.note.toLowerCase();
    expect(note).toMatch(/limited number/);
    // No invented cadence — the first run hasn't happened yet.
    expect(note).not.toMatch(/a month|per month|each month|one or two/);
  });
});

describe('the audience router', () => {
  it('names three audiences but sends them to two doors', () => {
    expect(audienceRoutes).toHaveLength(3);
    const doors = new Set(audienceRoutes.map((r) => r.href));
    expect(doors).toEqual(new Set(['#personal', '#enterprise']));
  });

  it('routes the individual upskiller to the personal track', () => {
    expect(audienceRoutes[0].href).toBe('#personal');
  });

  it('routes both leadership and company training to the enterprise track', () => {
    expect(audienceRoutes.slice(1).every((r) => r.href === '#enterprise')).toBe(true);
  });
});

describe('every offering', () => {
  it('belongs to exactly one of the two tracks', () => {
    expect(offerings.length).toBe(personalOfferings().length + enterpriseOfferings().length);
    expect(offerings.every((o) => o.track === 'personal' || o.track === 'enterprise')).toBe(true);
  });

  it('has a unique id', () => {
    const ids = offerings.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('names who it is for and what you leave with', () => {
    for (const o of offerings) {
      expect(o.who.length).toBeGreaterThan(10);
      expect(o.outcomes.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('prices every format in pesos', () => {
    for (const o of offerings) {
      expect(o.formats.length).toBeGreaterThan(0);
      for (const f of o.formats) {
        expect(f.price).toMatch(/₱[\d,]+/);
      }
    }
  });

  it('keeps outcomes short enough to scan', () => {
    for (const o of offerings) {
      for (const line of o.outcomes) {
        expect(line.length).toBeLessThanOrEqual(130);
      }
    }
  });
});

describe('the personal track', () => {
  it('leads with the single fluency offering for the first run', () => {
    expect(personalOfferings().map((o) => o.id)).toEqual(['fluency']);
  });

  it('offers both a one-on-one and a group price on each session', () => {
    for (const o of personalOfferings()) {
      const labels = o.formats.map((f) => f.label.toLowerCase()).join(' | ');
      expect(labels).toMatch(/one[- ]on[- ]one|1[- ]on[- ]1/);
      expect(labels).toMatch(/group|cohort/);
    }
  });

  it('never prices a private group below the equivalent open seat per head', () => {
    const peso = (s: string) => Number(s.replace(/[^\d]/g, ''));
    for (const o of personalOfferings()) {
      const seat = o.formats.find((f) => /open cohort/i.test(f.label));
      const group = o.formats.find((f) => /private group/i.test(f.label));
      if (!seat || !group) continue;
      const cap = Number(group.detail.match(/(\d+)\s*(?:people|pax)/i)?.[1] ?? group.detail.match(/–(\d+)/)?.[1]);
      expect(cap).toBeGreaterThan(0);
      expect(peso(group.price) / cap).toBeGreaterThanOrEqual(peso(seat.price));
    }
  });
});

describe('the enterprise track', () => {
  it('keeps talks and keynotes on this page', () => {
    const talks = enterpriseOfferings().filter((o) => /talk|keynote/i.test(o.title));
    expect(talks).toHaveLength(1);
  });

  it('never promises a keynote audience an artifact', () => {
    const talk = enterpriseOfferings().find((o) => /talk|keynote/i.test(o.title))!;
    expect(talk.caveat?.toLowerCase()).toMatch(/artifact|artefact|not a workshop/);
    expect(talk.outcomes.join(' ').toLowerCase()).not.toMatch(/prototype|policy|draft|ranked list/);
  });

  it('folds the policy exercise into the leadership session', () => {
    const leadership = findOffering('leadership');
    expect(`${leadership.title} ${leadership.tagline}`.toLowerCase()).toMatch(/polic/);
    expect(leadership.outcomes.join(' ').toLowerCase()).toMatch(/polic|ground rules/);
  });

  it('gives leaders a low-commitment open seat before the private engagement', () => {
    const leadership = findOffering('leadership');
    const open = leadership.formats.find((f) => /open seat/i.test(f.label));
    expect(open).toBeTruthy();
    const peso = (s: string) => Number(s.replace(/[^\d]/g, ''));
    const cheapest = Math.min(...leadership.formats.map((f) => peso(f.price)));
    expect(peso(open!.price)).toBe(cheapest);
  });

  it('prices a full day as a real step up from a half day, not a rounding error', () => {
    const peso = (s: string) => Number(s.replace(/[^\d]/g, ''));
    const team = findOffering('team-fluency');
    const half = peso(team.formats.find((f) => /half day/i.test(f.label))!.price);
    const full = peso(team.formats.find((f) => /full day/i.test(f.label))!.price);
    expect(full - half).toBeGreaterThanOrEqual(half * 0.7);
  });

  it('quotes corporate work as a floor, not a fixed price', () => {
    for (const o of enterpriseOfferings()) {
      for (const f of o.formats) {
        if (/open seat/i.test(f.label)) continue;
        expect(f.price.toLowerCase()).toMatch(/^from /);
      }
    }
  });
});

describe('market positioning', () => {
  const peso = (s: string) => Number(s.replace(/[^\d]/g, ''));

  it('prices the open fluency seat inside the PH public-seminar band once normalised to a day', () => {
    // PH norm is ₱2,500–₱15,000 per participant per day (Rainmaker Mastery, 2026).
    // Fluency is 2.5 hrs, so the day-equivalent is roughly 3x the seat.
    const seat = peso(findOffering('fluency').formats[0].price);
    const dayEquivalent = seat * 3;
    expect(dayEquivalent).toBeGreaterThanOrEqual(2500);
    expect(dayEquivalent).toBeLessThanOrEqual(15000);
  });

  it('keeps every in-house session inside the PH in-house band', () => {
    // PH norm is ₱40,000–₱280,000 per in-house session.
    for (const o of enterpriseOfferings()) {
      for (const f of o.formats) {
        if (/open seat/i.test(f.label)) continue;
        expect(peso(f.price)).toBeGreaterThanOrEqual(40000);
        expect(peso(f.price)).toBeLessThanOrEqual(280000);
      }
    }
  });

  it('undercuts Nexacu per head on the leadership session', () => {
    // Nexacu PH: AI for Business Leaders and Managers, 1 day, max 8 pax, ₱32,600/person.
    const leadership = findOffering('leadership');
    const halfDay = leadership.formats.find((f) => /half day/i.test(f.label))!;
    const cap = Number(halfDay.detail.match(/up to (\d+)/i)![1]);
    expect(peso(halfDay.price) / cap).toBeLessThan(32600);
  });

  it('does not advertise an early-bird price without an end date', () => {
    const notes = offerings.flatMap((o) => o.formats.map((f) => f.priceNote ?? ''));
    expect(notes.join(' ').toLowerCase()).not.toMatch(/early bird|early-bird/);
  });
});

describe('the enquiry value', () => {
  it('is readable in an inbox rather than a slug', () => {
    for (const o of offerings) {
      expect(enquiryValue(o)).not.toBe(o.id);
      expect(enquiryValue(o)).not.toMatch(/^[a-z0-9]+(-[a-z0-9]+)+$/);
      expect(enquiryValue(o)).toContain(o.title);
    }
  });

  it('disambiguates the offering both tracks share', () => {
    const shared = offerings.filter((o) => o.title === 'AI fluency & media literacy');
    expect(shared).toHaveLength(2);
    expect(new Set(shared.map(enquiryValue)).size).toBe(2);
  });

  it('is unique across every offering', () => {
    const values = offerings.map(enquiryValue);
    expect(new Set(values).size).toBe(values.length);
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
    expect(blob).toMatch(/build (it|the thing)/);
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
