// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import vercel from '@astrojs/vercel';

// react() + keystatic() power the /keystatic admin UI. The Vercel adapter
// enables serverless functions for the Keystatic dashboard and auth routes
// while keeping all public pages pre-rendered as 100% static HTML.
const skipKeystatic = /** @type {any} */ (globalThis).process?.env?.SKIP_KEYSTATIC;

// https://astro.build/config
export default defineConfig({
  site: 'https://www.janpaulfernandez.com',
  adapter: vercel(),
  security: {
    allowedDomains: [
      { hostname: 'janpaulfernandez.com' },
      { hostname: 'www.janpaulfernandez.com' },
      { hostname: 'localhost' },
      { hostname: '127.0.0.1' },
      { hostname: '*.vercel.app' },
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          // The "#" glyph is drawn by CSS (.anchor-icon::after in global.css),
          // not emitted as a text node — otherwise every crawler and LLM that
          // extracts heading text reads "My Heading#".
          content: {
            type: 'element',
            tagName: 'span',
            properties: { className: ['anchor-icon'] },
            children: []
          },
          properties: {
            ariaHidden: true,
            tabIndex: -1,
            className: ['anchor-link'],
          },
        },
      ],
    ],
  },
  integrations: [
    mdx(),
    ...(skipKeystatic ? [] : [react(), keystatic()]),
    sitemap({
      // Exclude the Keystatic admin UI and /thanks from the public sitemap —
      // neither is a real content page, and /thanks is explicitly noindexed
      // (listing a noindexed URL is a contradictory signal to crawlers).
      filter: (page) =>
        !page.includes('/keystatic') && !page.includes('/thanks'),
    }),
  ],
});
