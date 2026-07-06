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
});
