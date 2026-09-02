import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';

const thoughts = await getCollection('thoughts');

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
  }
};

thoughts.forEach((post) => {
  pagesObj[post.id] = {
    title: post.data.title,
    description: post.data.excerpt
  };
});

export const { getStaticPaths, GET } = await OGImageRoute({
  pages: pagesObj,
  getImageOptions: (_path, page) => {
    const pageData = page as { title: string; description: string };

    return {
      title: pageData.title,
      description: pageData.description,
      bgGradient: [[250, 250, 248]],       // beige-100 is #FAFAF8
      border: {
        color: [255, 0, 110],              // citrus-500 (magenta) is #FF006E
        width: 12,
        side: 'block-end'
      },
      padding: 60,
      font: {
        title: {
          family: 'Courier Prime',
          size: 60,
          weight: 'Normal',
          color: [14, 14, 14]              // moss-900 is #0E0E0E
        },
        description: {
          family: 'Courier Prime',
          size: 26,
          color: [107, 107, 107]           // moss-500 is #6B6B6B
        }
      },
      fonts: [
        './node_modules/@fontsource/courier-prime/files/courier-prime-latin-400-normal.woff'
      ]
    };
  }
});
