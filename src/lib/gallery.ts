/**
 * Gallery helpers.
 */

/**
 * Width that puts the long edge of an image at `long` px, never upscaling.
 *
 * The lightbox shows a full-screen photo, so it needs far more than the grid
 * thumbnail — but nowhere near the ~1.5 MB, 2731px originals. 1600px on the
 * long edge covers a retina full-screen view at roughly a tenth of the bytes.
 */
export function lightboxWidth(
  image: { width: number; height: number },
  long = 1600
): number {
  return image.width >= image.height
    ? Math.min(long, image.width)
    : Math.min(Math.round((long * image.width) / image.height), image.width);
}

export type MasonryInput = { id: string; width: number; height: number };
export type MasonrySlot = { column: number; widthFactor: number };

/**
 * The gallery wall is 95 photos, 88 of them the same 4:3 crop — equal-width
 * columns can only tile into a grid. This breaks the grid by varying each
 * photo's width (0.75 / 1 / 1.25 of the column) and packing everything into
 * columns of roughly equal height before the page is built. Every dimension
 * comes from image metadata and a string hash, never randomness, so the wall
 * is identical on every build. The browser merely flexes the buckets.
 */
export function masonryLayout(
  items: MasonryInput[],
  columnCount: number
): MasonrySlot[] {
  const columns = Math.max(1, columnCount);
  const heights = new Array<number>(columns).fill(0);
  return items.map((item) => {
    const factor = widthFactor(item.id);
    let column = 0;
    for (let c = 1; c < columns; c++) {
      if (heights[c] < heights[column]) column = c;
    }
    heights[column] += factor * (item.height / item.width);
    return { column, widthFactor: factor };
  });
}

/** Pseudo-random width factor for a shot id: FNV-1a hash bucketed 30/40/30. */
export function widthFactor(id: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < id.length; i++) {
    hash ^= id.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const r = hash >>> 0;
  if (r % 100 < 30) return 0.75;
  if (r % 100 < 70) return 1;
  return 1.25;
}
