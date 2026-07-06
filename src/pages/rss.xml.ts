import rss from '@astrojs/rss';
import { getCollection, render } from 'astro:content';
import { experimental_AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { getContainerRenderer as getMDXRenderer } from '@astrojs/mdx';
import KeyTakeaway from '../components/blocks/KeyTakeaway.astro';
import Callout from '../components/blocks/Callout.astro';
import PullQuote from '../components/blocks/PullQuote.astro';
import Embed from '../components/blocks/Embed.astro';

const components = {
  KeyTakeaway,
  Callout,
  PullQuote,
  Embed,
};

export async function GET(context: any) {
  const posts = await getCollection('thoughts');
  const published = posts
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.publishedDate.localeCompare(a.data.publishedDate));

  const htmlContent: Record<string, string> = {};
  
  try {
    const renderers = await loadRenderers([getMDXRenderer()]);
    const container = await experimental_AstroContainer.create({ renderers });
    
    for (const post of published) {
      const { Content } = await render(post);
      const html = await container.renderToString(Content, {
        props: { components },
      });
      
      // Sanitize/rewrite relative links to absolute
      const siteOrigin = context.site ? context.site.origin : 'https://janpaulfernandez.com';
      const absoluteHtml = html
        .replaceAll('src="/', `src="${siteOrigin}/`)
        .replaceAll('href="/', `href="${siteOrigin}/`);
        
      htmlContent[post.id] = absoluteHtml;
    }
  } catch (e) {
    console.error('Error rendering full content RSS, falling back to excerpt', e);
  }

  return rss({
    title: 'Paul Fernandez · Thoughts',
    description: 'Opinions, notes, and lessons from shipping national scale platforms.',
    site: context.site || 'https://janpaulfernandez.com',
    items: published.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.publishedDate),
      description: post.data.excerpt,
      link: `/thoughts/${post.id}`,
      ...(htmlContent[post.id] ? { content: htmlContent[post.id] } : {}),
    })),
  });
}
