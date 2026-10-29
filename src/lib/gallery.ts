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

type PhotoImage = { src: string; width: number; height: number };

/** The slice of a gallery collection entry that libraryOrder reads. */
export type LibrarySet<I extends PhotoImage = PhotoImage> = {
  id: string;
  data: {
    title: string;
    publishedDate: string;
    cover?: I;
    photos: { image: I; caption?: string; date?: string }[];
  };
};

export type LibraryPhoto<I extends PhotoImage = PhotoImage> = {
  image: I;
  caption: string;
  setSlug: string;
  setTitle: string;
  /** YYYY-MM-DD: the photo's own date, else its set's publishedDate. */
  date: string;
};

/**
 * Every photo of every set as one list, newest first. Sorts by
 * `photo.date ?? set.publishedDate` (string compare is correct for
 * YYYY-MM-DD). Ties go to the set slug ascending, so a rebuild never
 * reshuffles the wall and a set stays contiguous; within a set the authored
 * order is kept. The cover is emitted once (dedupe on `image.src`) and
 * inherits the caption of its matching photos[] entry.
 */
export function libraryOrder<I extends PhotoImage>(
  sets: LibrarySet<I>[]
): LibraryPhoto<I>[] {
  const out: LibraryPhoto<I>[] = [];
  const sorted = [...sets].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  for (const set of sorted) {
    const seen = new Set<string>();
    const add = (image: I | undefined, caption: string, date?: string) => {
      if (!image || seen.has(image.src)) return;
      seen.add(image.src);
      out.push({
        image,
        caption,
        setSlug: set.id,
        setTitle: set.data.title,
        date: date ?? set.data.publishedDate,
      });
    };
    const { cover, photos } = set.data;
    if (cover) {
      const match = photos.find((p) => p.image.src === cover.src);
      add(cover, match?.caption || '', match?.date);
    }
    for (const p of photos) add(p.image, p.caption || '', p.date);
  }
  // Array.prototype.sort is stable: equal dates keep the slug-then-authored
  // order built above.
  return out.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}
