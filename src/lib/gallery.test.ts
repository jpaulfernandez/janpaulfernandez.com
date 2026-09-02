import { describe, expect, it } from 'vitest';
import { lightboxWidth } from './gallery';

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
