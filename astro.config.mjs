// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// react() + keystatic() power the /keystatic admin UI only (Keystatic's
// Admin UI is a React app; its routes need server rendering). To keep
// production output fully static (output: 'static', no adapter, zero
// client-side React), both integrations are skipped when
// SKIP_KEYSTATIC=true is set in the build environment (e.g. Vercel, or
// via the "build" script in package.json for local builds).
// https://keystatic.com/docs/recipes/astro-disable-admin-ui-in-production
const skipKeystatic = /** @type {any} */ (globalThis).process?.env?.SKIP_KEYSTATIC;

// https://astro.build/config
export default defineConfig({
  site: 'https://janpaulfernandez.com',
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
