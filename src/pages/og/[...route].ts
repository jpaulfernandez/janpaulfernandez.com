import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';
import { getPublishedThoughts } from '../../lib/thoughts';
import { getProjects } from '../../lib/projects';

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
    description: 'Three ways to work together, and the AI-Resilient Organisation program.'
  },
  'thoughts': {
    title: 'Writing',
    description: 'Essays and half-formed notes — on technology, money, and psychology.'
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
  },
  'sitemap': {
    title: 'Sitemap',
    description: 'An overview of all pages, essays, projects, and photo galleries.'
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

// Each project page gets its own card, keyed projects-<slug>.
const projectsList = await getProjects();
projectsList.forEach((p) => {
  pagesObj[`projects-${p.id}`] = {
    title: p.data.title,
    description: p.data.description,
  };
});

export const { getStaticPaths, GET } = await OGImageRoute({
  pages: pagesObj,
  getImageOptions: (_path, page) => {
    const pageData = page as { title: string; description: string };

    return {
      title: pageData.title,
      description: pageData.description,
      bgGradient: [[255, 255, 255]],       // paper is #FFFFFF
      border: {
        color: [255, 92, 52],              // red-500 is #FF5C34
        width: 12,
        side: 'block-end'
      },
      padding: 60,
      font: {
        title: {
          families: ['Fraunces'],
          size: 60,
          weight: 'Normal',
          color: [53, 30, 40]              // ink-900
        },
        description: {
          families: ['Inter'],
          size: 26,
          color: [89, 76, 87]              // ink-600
        }
      },
      fonts: [
        './node_modules/@fontsource-variable/fraunces/files/fraunces-latin-opsz-normal.woff2',
        './node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'
      ]
    };
  }
});
