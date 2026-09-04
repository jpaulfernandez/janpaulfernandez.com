/**
 * Date formatting for content dates.
 *
 * Content dates are bare calendar days (`YYYY-MM-DD`). `new Date('2026-09-04')`
 * parses those as UTC midnight, so anywhere west of UTC `toLocaleDateString`
 * renders the *previous* day — a post dated Sep 4 shows as Sep 3. Pinning to
 * local noon puts the instant far enough from either midnight that no timezone
 * can shift the calendar day.
 */
export function parseDateSafe(date: string | Date): Date {
  // Zod may hand back a Date for `z.coerce.date()` fields; normalise to the
  // calendar day it represents before pinning.
  const str = typeof date === 'string' ? date : date.toISOString().slice(0, 10);
  // Bare calendar day → pin to local noon. Anything carrying a time already
  // means a specific instant and is passed through untouched.
  return /^\d{4}-\d{2}-\d{2}$/.test(str) ? new Date(`${str}T12:00:00`) : new Date(str);
}

/** "Sep 4, 2026" — articles, post lists, gallery sets. */
export function formatDate(dateStr: string | Date): string {
  return parseDateSafe(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** "September 4, 2026" — the /now page's "last updated" line. */
export function formatDateLong(dateStr: string | Date): string {
  return parseDateSafe(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
