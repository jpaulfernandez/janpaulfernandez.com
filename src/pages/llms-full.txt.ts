import type { APIRoute } from 'astro';
import { getPublishedThoughts } from '../lib/thoughts';

/**
 * llms-full.txt — the whole corpus in one plain-text fetch.
 *
 * /llms.txt is the index (links + descriptions); this is the full body of every
 * published post inline, so an LLM can ingest everything Paul has written in a
 * single request instead of crawling each article.
 *
 * `post.body` is the raw MDX source. That is deliberate: it is already the
 * closest thing to plain prose the repo holds, and stripping the handful of
 * component tags is a regex, not a dependency.
 */

// Strip the MDX component blocks so the output reads as prose. Everything else
// is Markdown, which LLMs read natively.
function toPlainText(body: string): string {
  return body
    .replace(/^import\s.+$/gm, '')                 // MDX imports
    .replace(/<\/?[A-Z][\w]*(\s[^>]*)?\/?>/g, '')  // <KeyTakeaway>, <Callout>, …
    // Image paths are repo-relative and meaningless outside the build; keep the
    // alt text, which is the only part that carries meaning in plain text.
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, (_m, alt) => (alt ? `[Figure: ${alt}]` : ''))
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site ? site.origin : 'https://www.janpaulfernandez.com';
  const thoughts = await getPublishedThoughts();

  const content = `# Paul Fernandez — full text

> Every published essay and note from ${siteUrl}, inline. The site index with
> services, pages, and contact details lives at ${siteUrl}/llms.txt.

Author: Paul Fernandez (also Jan Paul Fernandez)
Entity ID: https://janpaulfernandez.com/#person
Generated: ${new Date().toISOString().slice(0, 10)}

${thoughts
  .map(
    (post) => `---

# ${post.data.title}

URL: ${siteUrl}/thoughts/${post.id}/
Type: ${post.data.type}
Published: ${post.data.publishedDate}${post.data.updatedDate ? `\nUpdated: ${post.data.updatedDate}` : ''}${post.data.topics?.length ? `\nTopics: ${post.data.topics.join(', ')}` : ''}

${post.data.excerpt}

${toPlainText(post.body ?? '')}`
  )
  .join('\n\n')}
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
