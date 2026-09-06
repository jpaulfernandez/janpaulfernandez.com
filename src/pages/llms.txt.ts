import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getPublishedThoughts } from '../lib/thoughts';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site ? site.origin : 'https://www.janpaulfernandez.com';

  // Fetch collections
  const services = await getCollection('services');
  const sortedServices = [...services].sort((a, b) => a.data.order - b.data.order);

  const thoughts = await getPublishedThoughts();
  const recentThoughts = thoughts.slice(0, 10);

  const nowEntries = await getCollection('now');
  const sortedNow = [...nowEntries].sort((a, b) => b.data.date.localeCompare(a.data.date)).slice(0, 5);

  const content = `# Paul Fernandez

> Technologist in the Philippines. Ran tech operations at Rappler through two national elections, built banking software at PSBank, and is now IT manager at MMDC. Helps teams figure out what to build.

## About Paul Fernandez
Paul Fernandez is a technologist in the Philippines. He turns vague business goals into specs a development team can build from. He ran tech operations at Rappler through the 2019 and 2022 Philippine elections, built account-opening software at PSBank, and is now IT manager at Mapúa Malayan Digital College. He writes about technology, money, and psychology, and runs AI workshops for teams in Manila and remotely.

## Core Services & Ways to Work Together
${sortedServices.map(s => `- **${s.data.title}**: ${s.data.description}`).join('\n')}

## Site Navigation & Main Pages
- [Home](${siteUrl}/): Overview, services, and recent writings.
- [About](${siteUrl}/about/): Comprehensive background, philosophy, and career history.
- [Writing](${siteUrl}/thoughts/): Essays and notes on technology, money, and psychology.
- [Now](${siteUrl}/now/): Public journal and timeline of what Paul is currently focused on, building, and learning.
- [Gallery](${siteUrl}/gallery/): Concert and live music photography in Manila.
- [Workshops](${siteUrl}/workshops/): AI talks, open Zoom cohorts and in-house workshops — sessions, pricing, scope boundaries, and the inquiry form.
- [Work With Me](${siteUrl}/work-with-me/): Booking information, consultation packages, and direct contact form.

## Recent Thoughts & Articles
${recentThoughts.map(t => `- [${t.data.title}](${siteUrl}/thoughts/${t.id}/): ${t.data.excerpt || ''}`).join('\n')}

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

## Full Text
- [llms-full.txt](${siteUrl}/llms-full.txt): The complete text of every published essay and note, inline, in one fetch.
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
