import type { APIRoute } from 'astro';
import { getCollection, getEntry } from 'astro:content';
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
  const wwm = await getEntry('workWithMe', 'workWithMe');
  const modes = wwm?.data.modes ?? [];
  const tiers = (await getCollection('program')).sort((a, b) => a.data.order - b.data.order);

  // Offer facts only: no prices exist on the site, and the FAQs stay on the pages.
  const offer = `---

# Work with me

URL: ${siteUrl}/work-with-me/

${modes.map((m) => `## ${m.name}\n${m.line}\nWho it is for: ${m.whoFor}\nHow it runs: ${m.runsAs}\nPrice: ${m.priceSignal}`).join('\n\n')}

---

# AI-Resilient Organisation

URL: ${siteUrl}/work-with-me/ai-resilient-organisation/

${tiers
  .map(
    (t) => `## ${t.data.label}: ${t.data.title}
URL: ${siteUrl}/work-with-me/ai-resilient-organisation/${t.id}/
${t.data.tagline}
For: ${t.data.audience}
Duration: ${t.data.duration}
You leave with: ${t.data.leavesWith.join('; ')}`
  )
  .join('\n\n')}`;

  const content = `# Paul Fernandez — full text

> The Work with me offer, and every published essay and note from ${siteUrl}, inline. The site index with
> services, pages, and contact details lives at ${siteUrl}/llms.txt.

Author: Paul Fernandez (also Jan Paul Fernandez)
Entity ID: https://janpaulfernandez.com/#person
Generated: ${new Date().toISOString().slice(0, 10)}

${offer}

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
