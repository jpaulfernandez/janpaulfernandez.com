import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';
import { getPublishedThoughts } from '../../lib/thoughts';

// Published only — a raw getCollection() here would emit OG cards for drafts at
// guessable /og/<slug>.png URLs, leaking unpublished titles and excerpts.
const thoughts = await getPublishedThoughts();
const gallerySets = await getCollection('gallery');

const pagesObj: Record<string, { title: string; description: string }> = {
  'home': {
    title: 'Paul Fernandez',
    description: 'Technologist from the Philippines — banking, election-night newsrooms, national-scale education, and AI adoption.'
  },
  'about': {
    title: 'About',
    description: 'Who I am, what I care about, and my track record building high-stakes systems.'
  },
  'now': {
    title: 'Now',
    description: 'What I am working on, learning, and focused on right now.'
  },
  'work-with-me': {
    title: 'Work With Me',
    description: 'Consultation, workshops, and fractional product ownership.'
  },
  'thoughts': {
    title: 'Thoughts',
    description: 'Essays and half-formed notes — on technology, economy, and psychology.'
  },
  'gallery': {
    title: 'Gallery',
    description: 'Photography — concerts, festivals, places.'
  },
  'projects': {
    title: 'Projects',
    description: "Things I've built, shipped, and tinkered with, indexed by year."
  },
  'colophon': {
    title: 'Colophon',
    description: 'How this site is built — the stack, the type, and the rules it follows.'
  }
};

thoughts.forEach((post) => {
  pagesObj[post.id] = {
    title: post.data.title,
    description: post.data.excerpt
  };
});

// Each photo set gets its own card. Without these, four pages of photography
// shared as the generic site card, which named none of them.
gallerySets.forEach((set) => {
  pagesObj[`gallery-${set.id}`] = {
    title: set.data.title,
    description: set.data.description ?? 'Photography by Paul Fernandez.'
  };
});

export const { getStaticPaths, GET } = await OGImageRoute({
  pages: pagesObj,
  getImageOptions: (_path, page) => {
    const pageData = page as { title: string; description: string };

    return {
      title: pageData.title,
      description: pageData.description,
      bgGradient: [[250, 246, 244]],       // paper-100 is #FAF6F4
      border: {
        color: [142, 27, 63],              // wine-500 is #8E1B3F
        width: 12,
        side: 'block-end'
      },
      padding: 60,
      font: {
        title: {
          family: 'Courier Prime',
          size: 60,
          weight: 'Normal',
          color: [28, 10, 16]              // ink-900 is #1C0A10
        },
        description: {
          family: 'Courier Prime',
          size: 26,
          color: [110, 90, 96]             // ink-500 is #6E5A60
        }
      },
      fonts: [
        './node_modules/@fontsource/courier-prime/files/courier-prime-latin-400-normal.woff'
      ]
    };
  }
});
