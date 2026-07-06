import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';

const thoughts = await getCollection('thoughts');

const pagesObj: Record<string, { title: string; description: string }> = {
  'home': {
    title: 'Paul Fernandez',
    description: 'Technologist from the Philippines helping organizations transform digitally and adopt AI.'
  },
  'about': {
    title: 'About Me',
    description: 'Who I am, what I care about, and my track record building high-stakes software systems.'
  },
  'now': {
    title: 'Now',
    description: 'What I am working on, learning, and focused on right now.'
  },
  'work-with-me': {
    title: 'Work With Me',
    description: 'Digital transformation consulting, web/app development, talks, and AI implementation.'
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
      bgGradient: [[30, 43, 32]], // moss-900 is #1E2B20 -> RGB(30, 43, 32)
      border: {
        color: [232, 161, 60], // citrus-500 is #E8A13C -> RGB(232, 161, 60)
        width: 12,
        side: 'block-end' // Bottom accent bar
      },
      padding: 60,
      font: {
        title: {
          family: 'Archivo Black',
          size: 60,
          weight: 'Normal',
          color: [245, 241, 230] // beige-100 is #F5F1E6 -> RGB(245, 241, 230)
        },
        description: {
          family: 'Lato',
          size: 26,
          color: [205, 217, 198] // moss-200 is #CDD9C6 -> RGB(205, 217, 198)
        }
      },
      fonts: [
        './node_modules/@fontsource/archivo-black/files/archivo-black-latin-400-normal.woff',
        './node_modules/@fontsource/lato/files/lato-latin-400-normal.woff'
      ]
    };
  }
});
