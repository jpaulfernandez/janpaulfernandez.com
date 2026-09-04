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
import { readdirSync, readFileSync } from 'node:fs';

// react() + keystatic() power the /keystatic admin UI. The Vercel adapter
// enables serverless functions for the Keystatic dashboard and auth routes
// while keeping all public pages pre-rendered as 100% static HTML.
const skipKeystatic = /** @type {any} */ (globalThis).process?.env?.SKIP_KEYSTATIC;

// Sitemap <lastmod>. The dates already live in the content, but the sitemap
// integration runs in this config and cannot reach astro:content — so the two
// date fields are read straight off disk. Only pages with a real, content-owned
// date get a lastmod; the static pages get none, because a build-time timestamp
// on every URL is a worse signal than no timestamp at all.
function contentLastmod() {
  /** @type {Record<string, string>} */
  const dates = {};
  /**
   * Keep the newest of any two dates for a hub URL.
   * @param {string} path
   * @param {string | undefined} date
   */
  const bump = (path, date) => {
    if (date && (!dates[path] || date > dates[path])) dates[path] = date;
  };

  /**
   * @param {string} src
   * @param {string} name
   */
  const field = (src, name) => {
    const m = src.match(new RegExp(`^${name}:\\s*'?"?([0-9]{4}-[0-9]{2}-[0-9]{2})`, 'm'));
    return m ? m[1] : undefined;
  };

  for (const file of readdirSync('src/content/thoughts').filter((f) => /\.mdx?$/.test(f))) {
    const src = readFileSync(`src/content/thoughts/${file}`, 'utf-8');
    if (/^draft:\s*true\s*$/m.test(src)) continue;
    const date = field(src, 'updatedDate') ?? field(src, 'publishedDate');
    const slug = file.replace(/\.mdx?$/, '');
    bump(`/thoughts/${slug}/`, date);
    bump('/thoughts/', date);

    // A topic archive is only as fresh as the newest post carrying that tag.
    const topicBlock = src.match(/^topics:\n((?:\s+-\s+.+\n)+)/m);
    if (topicBlock) {
      for (const line of topicBlock[1].trim().split('\n')) {
        bump(`/topics/${line.replace(/^\s*-\s*/, '').trim()}/`, date);
      }
    }
  }

  for (const file of readdirSync('src/content/gallery').filter((f) => f.endsWith('.json'))) {
    const data = JSON.parse(readFileSync(`src/content/gallery/${file}`, 'utf-8'));
    const date = String(data.publishedDate ?? '').slice(0, 10);
    bump(`/gallery/${file.replace(/\.json$/, '')}/`, date);
    bump('/gallery/', date);
  }

  return dates;
}

const lastmodByPath = contentLastmod();

// https://astro.build/config
export default defineConfig({
  site: 'https://www.janpaulfernandez.com',
  // Canonical URLs carry the trailing slash, so the bare form must redirect to
  // it rather than serve a second 200 at a URL the page tells Google to ignore.
  trailingSlash: 'always',
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
      serialize: (item) => {
        const lastmod = lastmodByPath[new URL(item.url).pathname];
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
});
