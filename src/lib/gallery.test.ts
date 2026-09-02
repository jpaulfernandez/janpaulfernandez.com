import { describe, expect, it } from 'vitest';
import { lightboxWidth, masonryLayout, widthFactor, type MasonryInput, type MasonrySlot } from './gallery';

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

describe('masonryLayout', () => {
  // Mirrors the real wall: mostly identical 4:3 shots, a few portraits.
  const landscape = (i: number): MasonryInput => ({
    id: `wanderland-${i}`,
    width: 2731,
    height: 2048,
  });
  const portrait = (i: number): MasonryInput => ({
    id: `portrait-${i}`,
    width: 2048,
    height: 2731,
  });

  it('assigns every item to exactly one valid column', () => {
    const layout = masonryLayout([landscape(1), landscape(2), portrait(3)], 3);
    expect(layout).toHaveLength(3);
    layout.forEach((slot) => {
      expect(slot.column).toBeGreaterThanOrEqual(0);
      expect(slot.column).toBeLessThan(3);
    });
  });

  it('is deterministic: identical input yields an identical wall', () => {
    const items = Array.from({ length: 12 }, (_, i) => landscape(i));
    expect(masonryLayout(items, 3)).toEqual(masonryLayout(items, 3));
  });

  it('keeps column heights roughly balanced', () => {
    const items = Array.from({ length: 30 }, (_, i) =>
      i % 5 === 0 ? portrait(i) : landscape(i)
    );
    const layout = masonryLayout(items, 3);
    const heights = [0, 0, 0];
    layout.forEach((slot, i) => {
      heights[slot.column] += slot.widthFactor * (items[i].height / items[i].width);
    });
    const max = Math.max(...heights);
    const min = Math.min(...heights);
    expect(max / min).toBeLessThan(1.75);
  });

  it('only ever uses the three width factors', () => {
    const items = Array.from({ length: 30 }, (_, i) => landscape(i));
    const factors = new Set(masonryLayout(items, 3).map((s) => s.widthFactor));
    [...factors].forEach((f) => expect([0.75, 1, 1.25]).toContain(f));
  });

  it('each width factor is hit across enough ids', () => {
    // 30/40/30 bucket split — with 300 ids every bucket must appear.
    const seen = new Set(
      Array.from({ length: 300 }, (_, i) => widthFactor(`shot-${i}`))
    );
    expect(seen).toEqual(new Set([0.75, 1, 1.25]));
  });

  it('returns an empty layout for no items', () => {
    expect(masonryLayout([], 3)).toEqual([]);
  });

  it('clamps a column count below 1 to a single column', () => {
    const slots: MasonrySlot[] = masonryLayout([landscape(1), landscape(2)], 0);
    slots.forEach((slot) => expect(slot.column).toBe(0));
  });
});
