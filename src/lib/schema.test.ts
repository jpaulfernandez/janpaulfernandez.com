import { describe, it, expect } from 'vitest';
import {
  PERSON_ID,
  SITE_URL,
  person,
  webSite,
  profilePage,
  breadcrumbs,
  blogPosting,
  faqPage,
  service,
  imageGallery,
  blog,
  collectionPage,
} from './schema';

describe('JSON-LD schema library', () => {
  it('should generate valid Person schema referencing stable PERSON_ID', () => {
    const p = person();
    expect(p['@context']).toBe('https://schema.org');
    expect(p['@type']).toBe('Person');
    expect(p['@id']).toBe(PERSON_ID);
    expect(p.name).toBe('Paul Fernandez');
    expect(p.alternateName).toEqual(['Jan Paul Fernandez', 'Jan Paul']);
    expect(p.url).toBe(SITE_URL);
    expect(p.sameAs).toContain('https://www.linkedin.com/in/jpaulfernandez/');

    // JSON serialization check
    expect(() => JSON.stringify(p)).not.toThrow();
  });

  it('should support overrides in Person builder', () => {
    const p = person({ name: 'Other Name', jobTitle: 'Consultant' });
    expect(p.name).toBe('Other Name');
    expect(p.jobTitle).toBe('Consultant');
  });

  it('should generate WebSite referencing stable PERSON_ID as publisher', () => {
    const w = webSite();
    expect(w['@context']).toBe('https://schema.org');
    expect(w['@type']).toBe('WebSite');
    expect(w.name).toBe('Paul Fernandez');
    expect(w.alternateName).toBe('Jan Paul Fernandez');
    expect(w.publisher['@id']).toBe(PERSON_ID);
    expect(w.url).toBe(SITE_URL);

    expect(() => JSON.stringify(w)).not.toThrow();
  });

  it('should generate ProfilePage referencing stable PERSON_ID', () => {
    const dateStr = '2026-07-05T12:00:00Z';
    const pp = profilePage(dateStr);
    expect(pp['@context']).toBe('https://schema.org');
    expect(pp['@type']).toBe('ProfilePage');
    expect(pp.mainEntity['@id']).toBe(PERSON_ID);
    expect(pp.dateModified).toBe(dateStr);

    expect(() => JSON.stringify(pp)).not.toThrow();
  });

  it('should generate BreadcrumbList with relative and absolute URLs resolved', () => {
    const items = [
      { name: 'Home', url: '/' },
      { name: 'About', url: '/about' },
      { name: 'External', url: 'https://example.com/external' },
    ];
    const bc = breadcrumbs(items);
    expect(bc['@context']).toBe('https://schema.org');
    expect(bc['@type']).toBe('BreadcrumbList');
    expect(bc.itemListElement).toHaveLength(3);
    expect(bc.itemListElement[0]).toEqual({
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${SITE_URL}/`,
    });
    expect(bc.itemListElement[2].item).toBe('https://example.com/external');

    expect(() => JSON.stringify(bc)).not.toThrow();
  });

  it('should emit url + mainEntityOfPage when a canonical path is given', () => {
    const bp = blogPosting({
      title: 'A Great Blog Post',
      excerpt: 'Summary.',
      url: '/thoughts/a-great-blog-post/',
      publishedDate: '2026-07-01',
    });
    expect(bp.url).toBe(`${SITE_URL}/thoughts/a-great-blog-post/`);
    expect(bp.mainEntityOfPage).toEqual({
      '@type': 'WebPage',
      '@id': `${SITE_URL}/thoughts/a-great-blog-post/`,
    });
  });

  it('should omit url + mainEntityOfPage when no path is given', () => {
    const bp = blogPosting({
      title: 'A Great Blog Post',
      excerpt: 'Summary.',
      publishedDate: '2026-07-01',
    });
    expect(bp).not.toHaveProperty('url');
    expect(bp).not.toHaveProperty('mainEntityOfPage');
  });

  it('should keep PERSON_ID on the apex host even though SITE_URL is www', () => {
    // The @id is the entity key every knowledge graph consolidates on; it must
    // not move when the canonical host changes. See CLAUDE.md.
    expect(PERSON_ID).toBe('https://janpaulfernandez.com/#person');
    expect(SITE_URL).toBe('https://www.janpaulfernandez.com');
  });

  it('should generate BlogPosting referencing person ID as author and including dateModified', () => {
    const post = {
      title: 'A Great Blog Post',
      excerpt: 'This is a summary of the post.',
      publishedDate: '2026-07-01',
      updatedDate: '2026-07-05',
      cover: '/assets/post-cover.jpg',
      topics: ['technology', 'psychology'],
      wordCount: 1200,
    };
    const bp = blogPosting(post);
    expect(bp['@context']).toBe('https://schema.org');
    expect(bp['@type']).toBe('BlogPosting');
    expect(bp.headline).toBe(post.title);
    expect(bp.description).toBe(post.excerpt);
    expect(bp.datePublished).toBe(post.publishedDate);
    expect(bp.dateModified).toBe(post.updatedDate);
    expect(bp.author['@id']).toBe(PERSON_ID);
    expect(bp.image).toBe(`${SITE_URL}/assets/post-cover.jpg`);
    expect(bp.keywords).toBe('technology, psychology');
    expect(bp.wordCount).toBe(1200);

    // Test fallback for dateModified
    const bpNoUpdate = blogPosting({
      title: 'A Post',
      excerpt: 'Excerpt',
      publishedDate: '2026-07-01',
    });
    expect(bpNoUpdate.dateModified).toBe('2026-07-01');

    expect(() => JSON.stringify(bp)).not.toThrow();
  });

  it('should generate FAQPage', () => {
    const questions = [
      { q: 'What is 1+1?', a: '2' },
      { q: 'Is this static?', a: 'Yes.' },
    ];
    const faq = faqPage(questions);
    expect(faq['@context']).toBe('https://schema.org');
    expect(faq['@type']).toBe('FAQPage');
    expect(faq.mainEntity).toHaveLength(2);
    expect(faq.mainEntity[0].name).toBe('What is 1+1?');
    expect(faq.mainEntity[0].acceptedAnswer.text).toBe('2');

    expect(() => JSON.stringify(faq)).not.toThrow();
  });

  it('should generate Service referencing person ID as provider', () => {
    const sInput = {
      title: 'Digital Consulting',
      description: 'Roadmaps and transformation.',
    };
    const sv = service(sInput);
    expect(sv['@context']).toBe('https://schema.org');
    expect(sv['@type']).toBe('Service');
    expect(sv.serviceType).toBe(sInput.title);
    expect(sv.description).toBe(sInput.description);
    expect(sv.provider['@id']).toBe(PERSON_ID);

    expect(() => JSON.stringify(sv)).not.toThrow();
  });

  it('should generate ImageGallery with ImageObject entries and absolute URLs', () => {
    const g = imageGallery({
      title: 'HONNE at Wanderland',
      description: 'Warm synths, intimate vocals.',
      url: '/gallery/honne-at-wanderland/',
      datePublished: '2024-03-09',
      images: [
        { url: '/_astro/honne-01.webp', caption: 'HONNE mid-set under blue wash', width: 1600, height: 1200 },
        { url: 'https://cdn.example.com/honne-02.webp' },
      ],
    });

    expect(g['@context']).toBe('https://schema.org');
    expect(g['@type']).toBe('ImageGallery');
    expect(g.name).toBe('HONNE at Wanderland');
    expect(g.description).toBe('Warm synths, intimate vocals.');
    expect(g.url).toBe(`${SITE_URL}/gallery/honne-at-wanderland/`);
    expect(g.datePublished).toBe('2024-03-09');
    expect(g.author['@id']).toBe(PERSON_ID);

    expect(g.image).toHaveLength(2);
    expect(g.image[0]['@type']).toBe('ImageObject');
    expect(g.image[0].contentUrl).toBe(`${SITE_URL}/_astro/honne-01.webp`);
    expect(g.image[0].caption).toBe('HONNE mid-set under blue wash');
    expect(g.image[0].width).toBe(1600);
    expect(g.image[0].height).toBe(1200);
    expect(g.image[0].creditText).toBe('Paul Fernandez');
    expect(g.image[0].creator['@id']).toBe(PERSON_ID);

    // Already-absolute URLs pass through untouched; absent fields are omitted
    // rather than emitted as undefined (which JSON.stringify would drop, but
    // which reads as a bug in the object).
    expect(g.image[1].contentUrl).toBe('https://cdn.example.com/honne-02.webp');
    expect(g.image[1]).not.toHaveProperty('caption');
    expect(g.image[1]).not.toHaveProperty('width');

    expect(() => JSON.stringify(g)).not.toThrow();
  });

  it('should omit optional ImageGallery fields when not supplied', () => {
    const g = imageGallery({ title: 'Untitled Set', url: '/gallery/untitled/', images: [] });
    expect(g).not.toHaveProperty('description');
    expect(g).not.toHaveProperty('datePublished');
    expect(g.image).toEqual([]);
  });

  it('should generate Blog with blogPost entries authored by PERSON_ID', () => {
    const b = blog({
      title: 'Thoughts',
      description: 'Essays and notes.',
      url: '/thoughts/',
      posts: [
        {
          title: 'What Is a Token, Anyway?',
          excerpt: 'On the wrong unit of measurement.',
          url: '/thoughts/what-is-a-token-anyway/',
          publishedDate: '2026-08-01',
          updatedDate: '2026-08-14',
        },
        {
          title: 'Jack and the Snack Culture',
          url: '/thoughts/jack-and-the-snack-culture/',
          publishedDate: '2026-07-02',
        },
      ],
    });

    expect(b['@context']).toBe('https://schema.org');
    expect(b['@type']).toBe('Blog');
    expect(b.name).toBe('Thoughts');
    expect(b.url).toBe(`${SITE_URL}/thoughts/`);
    expect(b.author['@id']).toBe(PERSON_ID);

    expect(b.blogPost).toHaveLength(2);
    expect(b.blogPost[0]['@type']).toBe('BlogPosting');
    expect(b.blogPost[0].headline).toBe('What Is a Token, Anyway?');
    expect(b.blogPost[0].url).toBe(`${SITE_URL}/thoughts/what-is-a-token-anyway/`);
    expect(b.blogPost[0].datePublished).toBe('2026-08-01');
    expect(b.blogPost[0].dateModified).toBe('2026-08-14');
    expect(b.blogPost[0].author['@id']).toBe(PERSON_ID);

    // dateModified falls back to datePublished, matching blogPosting().
    expect(b.blogPost[1].dateModified).toBe('2026-07-02');
    expect(b.blogPost[1]).not.toHaveProperty('description');

    expect(() => JSON.stringify(b)).not.toThrow();
  });

  it('should generate CollectionPage wrapping an ItemList', () => {
    const c = collectionPage({
      title: '#ai',
      description: 'Posts tagged #ai.',
      url: '/topics/ai/',
      items: [
        { name: 'What Is a Token, Anyway?', url: '/thoughts/what-is-a-token-anyway/' },
        { name: 'Day 1', url: '/thoughts/day-1-building-our-capstone-product/' },
      ],
    });

    expect(c['@context']).toBe('https://schema.org');
    expect(c['@type']).toBe('CollectionPage');
    expect(c.name).toBe('#ai');
    expect(c.url).toBe(`${SITE_URL}/topics/ai/`);

    expect(c.mainEntity['@type']).toBe('ItemList');
    expect(c.mainEntity.numberOfItems).toBe(2);
    expect(c.mainEntity.itemListElement[0]).toEqual({
      '@type': 'ListItem',
      position: 1,
      name: 'What Is a Token, Anyway?',
      url: `${SITE_URL}/thoughts/what-is-a-token-anyway/`,
    });
    expect(c.mainEntity.itemListElement[1].position).toBe(2);

    expect(() => JSON.stringify(c)).not.toThrow();
  });
});
