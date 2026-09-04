import { describe, it, expect } from 'vitest';
import { parseDateSafe, formatDate, formatDateLong } from './dates';

describe('parseDateSafe', () => {
  it('pins a bare YYYY-MM-DD to local noon so the day never shifts', () => {
    const d = parseDateSafe('2026-09-04');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(8);
    expect(d.getDate()).toBe(4);
    expect(d.getHours()).toBe(12);
  });

  it('keeps the same calendar day that new Date() would lose behind UTC', () => {
    // `new Date('2026-09-04')` parses as UTC midnight; west of UTC that renders
    // as Sep 3 in local time. The helper must always render Sep 4.
    expect(formatDate('2026-09-04')).toContain('Sep 4');
  });

  it('normalises a Date to the calendar day it represents', () => {
    const d = parseDateSafe(new Date('2026-09-04T00:00:00Z'));
    expect(d.getDate()).toBe(4);
    expect(d.getHours()).toBe(12);
  });

  it('leaves timestamps that already carry a time component alone', () => {
    const d = parseDateSafe('2026-09-04T08:30:00');
    expect(d.getHours()).toBe(8);
    expect(d.getMinutes()).toBe(30);
  });
});

describe('formatDate', () => {
  it('renders the short article/list format', () => {
    expect(formatDate('2026-01-09')).toBe('Jan 9, 2026');
  });
});

describe('formatDateLong', () => {
  it('renders the long /now format', () => {
    expect(formatDateLong('2026-01-09')).toBe('January 9, 2026');
  });
});
