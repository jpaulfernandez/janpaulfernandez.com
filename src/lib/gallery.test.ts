import { describe, expect, it } from 'vitest';
import { libraryOrder, lightboxWidth } from './gallery';

describe('lightboxWidth', () => {
  it('caps a landscape image at the long edge', () => {
    expect(lightboxWidth({ width: 2731, height: 2048 })).toBe(1600);
  });

  it('scales a portrait image so its HEIGHT hits the long edge', () => {
    // 2048x2731 → height 1600 means width 1600 * 2048/2731 ≈ 1200.
    expect(lightboxWidth({ width: 2048, height: 2731 })).toBe(1200);
  });

  it('never upscales a source smaller than the long edge', () => {
    expect(lightboxWidth({ width: 900, height: 600 })).toBe(900);
    expect(lightboxWidth({ width: 400, height: 900 })).toBe(400);
  });

  it('treats a square image as landscape', () => {
    expect(lightboxWidth({ width: 2000, height: 2000 })).toBe(1600);
  });

  it('honours a custom long edge', () => {
    expect(lightboxWidth({ width: 3000, height: 2000 }, 1000)).toBe(1000);
  });
});

describe('libraryOrder', () => {
  const img = (src: string) => ({ src, width: 2731, height: 2048 });
  const photo = (src: string, extra: { caption?: string; date?: string } = {}) => ({
    image: img(src),
    ...extra,
  });
  const set = (
    id: string,
    publishedDate: string,
    photos: ReturnType<typeof photo>[],
    cover?: ReturnType<typeof img>
  ) => ({ id, data: { title: `Title ${id}`, publishedDate, cover, photos } });

  it('flattens every set into one array of photo records', () => {
    const out = libraryOrder([set('a', '2024-01-01', [photo('a1', { caption: 'one' })])]);
    expect(out).toEqual([
      {
        image: img('a1'),
        caption: 'one',
        setSlug: 'a',
        setTitle: 'Title a',
        date: '2024-01-01',
      },
    ]);
  });

  it('sorts by photo date falling back to set date, newest first', () => {
    const out = libraryOrder([
      set('old', '2024-01-01', [photo('o1')]),
      set('new', '2024-10-15', [photo('n1')]),
      set('mid', '2024-03-22', [photo('m1')]),
    ]);
    expect(out.map((p) => p.setSlug)).toEqual(['new', 'mid', 'old']);
  });

  it('lets a per-photo date override the set date and split a set', () => {
    const out = libraryOrder([
      set('a', '2024-03-01', [photo('a1'), photo('a2', { date: '2024-05-01' })]),
      set('b', '2024-04-01', [photo('b1')]),
    ]);
    expect(out.map((p) => p.image.src)).toEqual(['a2', 'b1', 'a1']);
    expect(out[0].date).toBe('2024-05-01');
  });

  it('keeps authored order within a set', () => {
    const out = libraryOrder([set('a', '2024-01-01', [photo('a3'), photo('a1'), photo('a2')])]);
    expect(out.map((p) => p.image.src)).toEqual(['a3', 'a1', 'a2']);
  });

  it('breaks date ties by set slug ascending and keeps each set contiguous', () => {
    const out = libraryOrder([
      set('wanderland-music-festival', '2024-03-22', [photo('w1'), photo('w2')]),
      set('daniel-caesar-at-wanderland', '2024-03-22', [photo('d1'), photo('d2')]),
    ]);
    expect(out.map((p) => p.image.src)).toEqual(['d1', 'd2', 'w1', 'w2']);
  });

  it('emits the cover once and gives it the matching photo caption', () => {
    const out = libraryOrder([
      set('a', '2024-01-01', [photo('a1', { caption: 'cap' }), photo('a2')], img('a1')),
    ]);
    expect(out.map((p) => p.image.src)).toEqual(['a1', 'a2']);
    expect(out[0].caption).toBe('cap');
  });

  it('includes a cover that is not in photos[], with no caption', () => {
    const out = libraryOrder([set('a', '2024-01-01', [photo('a2')], img('a1'))]);
    expect(out.map((p) => p.image.src)).toEqual(['a1', 'a2']);
    expect(out[0].caption).toBe('');
  });

  it('returns [] for no sets, and nothing for a set with no photos', () => {
    expect(libraryOrder([])).toEqual([]);
    expect(libraryOrder([set('a', '2024-01-01', [])])).toEqual([]);
  });
});
