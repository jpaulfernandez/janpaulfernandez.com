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
