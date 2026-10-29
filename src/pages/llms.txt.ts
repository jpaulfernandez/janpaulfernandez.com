import type { APIRoute } from 'astro';
import { getCollection, getEntry } from 'astro:content';
import { getPublishedThoughts } from '../lib/thoughts';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site ? site.origin : 'https://www.janpaulfernandez.com';

  // Fetch collections
  const wwm = await getEntry('workWithMe', 'workWithMe');
  const modes = wwm?.data.modes ?? [];
  const tiers = (await getCollection('program')).sort((a, b) => a.data.order - b.data.order);

  const thoughts = await getPublishedThoughts();
  const recentThoughts = thoughts.slice(0, 10);

  const nowEntries = await getCollection('now');
  const sortedNow = [...nowEntries].sort((a, b) => b.data.date.localeCompare(a.data.date)).slice(0, 5);

  const content = `# Paul Fernandez

> Technologist in the Philippines. Ran tech operations at Rappler through two national elections, built banking software at PSBank, and is now IT manager at MMDC. Helps teams figure out what to build.

## About Paul Fernandez
Paul Fernandez is a technologist in the Philippines. He turns vague business goals into specs a development team can build from. He ran tech operations at Rappler through the 2019 and 2022 Philippine elections, built account-opening software at PSBank, and is now IT manager at Mapúa Malayan Digital College. He writes about technology, money, and psychology, and teaches AI to organisations in Manila and remotely.

## Work with me
Three ways in, all priced by quote: [Work With Me](${siteUrl}/work-with-me/)
${modes.map((m) => `- **${m.name}**: ${m.line}`).join('\n')}

## AI-Resilient Organisation
A vendor-neutral AI program for Philippine organisations, in five tiers: [overview](${siteUrl}/work-with-me/ai-resilient-organisation/)
${tiers.map((t) => `- [${t.data.title}](${siteUrl}/work-with-me/ai-resilient-organisation/${t.id}/): ${t.data.tagline}`).join('\n')}

## Site Navigation & Main Pages
- [Home](${siteUrl}/): Overview and recent writings.
- [About](${siteUrl}/about/): Comprehensive background, philosophy, and career history.
- [Writing](${siteUrl}/thoughts/): Essays and notes on technology, economics, and psychology.
- [Now](${siteUrl}/now/): Public journal and timeline of what Paul is currently focused on, building, and learning.
- [Gallery](${siteUrl}/gallery/): Concert and live music photography in Manila.
- [Projects](${siteUrl}/projects/): Things Paul has built, shipped, and tinkered with, including Oddhalls.
- [Work With Me](${siteUrl}/work-with-me/): Three ways to work together, the AI-Resilient Organisation program, and the enquiry form.

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
