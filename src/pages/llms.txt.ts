import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getPublishedThoughts } from '../lib/thoughts';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site ? site.origin : 'https://janpaulfernandez.com';

  // Fetch collections
  const services = await getCollection('services');
  const sortedServices = [...services].sort((a, b) => a.data.order - b.data.order);

  const thoughts = await getPublishedThoughts();
  const recentThoughts = thoughts.slice(0, 10);

  const nowEntries = await getCollection('now');
  const sortedNow = [...nowEntries].sort((a, b) => b.data.date.localeCompare(a.data.date)).slice(0, 5);

  const content = `# Paul Fernandez

> Technologist from the Philippines who has shipped under pressure — banking, election-night newsrooms, national-scale education — now offering product consultation, workshops, and fractional product ownership.

## About Paul Fernandez
Paul Fernandez is a product technologist, consultant, and builder based in the Philippines. He specializes in turning complex, ambiguous business goals into clear, actionable technical and product specifications for engineering teams. With extensive experience shipping national-scale systems under intense pressure—including banking platforms, election-night newsrooms, and national education infrastructure—Paul helps organizations build the right product without wasting engineering bandwidth or losing focus.

## Core Services & Ways to Work Together
${sortedServices.map(s => `- **${s.data.title}**: ${s.data.description}`).join('\n')}

## Site Navigation & Main Pages
- [Home](${siteUrl}/): Overview, services, and recent writings.
- [About](${siteUrl}/about): Comprehensive background, philosophy, and career history.
- [Thoughts](${siteUrl}/thoughts): Blog and notes on product leadership, engineering, and technology.
- [Now](${siteUrl}/now): Public journal and status board of what Paul is currently focused on, building, and learning.
- [Gallery](${siteUrl}/gallery): Visual log of projects, workspace setups, and life moments.
- [Work With Me](${siteUrl}/work-with-me): Booking information, consultation packages, and direct contact form.

## Recent Thoughts & Articles
${recentThoughts.map(t => `- [${t.data.title}](${siteUrl}/thoughts/${t.id}): ${t.data.excerpt || ''}`).join('\n')}

## What Paul is Doing Now (Recent Highlights)
${sortedNow.map(n => {
  const title = n.data.title || n.data.slug || n.id;
  return `- [${title}](${siteUrl}/now) (${n.data.date})`;
}).join('\n')}

## Contact & Connect
- **Website**: ${siteUrl}
- **Email**: jpaul.fernandez18@gmail.com
- **LinkedIn**: https://www.linkedin.com/in/jpaulfernandez/
- **Instagram**: https://www.instagram.com/goofffball/
- **RSS Feed**: ${siteUrl}/rss.xml
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
