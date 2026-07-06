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
  site: 'https://janpaulfernandez.com',
  adapter: vercel(),
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
          content: {
            type: 'element',
            tagName: 'span',
            properties: { className: ['anchor-icon'] },
            children: [{ type: 'text', value: '#' }]
          },
          properties: {
            ariaHidden: true,
            tabIndex: -1,
            className: ['anchor-link ml-2 text-moss-200 hover:text-moss-500 transition-colors'],
          },
        },
      ],
    ],
  },
  integrations: [
    mdx(),
    ...(skipKeystatic ? [] : [react(), keystatic()]),
    sitemap({
      // Exclude the internal styleguide and the Keystatic admin UI from
      // the public sitemap — neither is a real content page.
      filter: (page) =>
        !page.includes('/styleguide') && !page.includes('/keystatic'),
    }),
  ],
});
