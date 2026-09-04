// Production canonicalises to www (apex 308s), so every emitted URL uses www.
export const SITE_URL = 'https://www.janpaulfernandez.com';

// PERSON_ID is a stable identifier, NOT a fetchable URL, and it is pinned to the
// apex literal on purpose: it is the one @id every knowledge graph keys Paul's
// entity on, so it must never move with the canonical host. See CLAUDE.md.
export const PERSON_ID = 'https://janpaulfernandez.com/#person';

export interface PersonOverrides {
  name?: string;
  url?: string;
  image?: string;
  jobTitle?: string;
  alumniOf?: string;
  worksFor?: string;
  knowsAbout?: string[];
  sameAs?: string[];
}

export function person(overrides?: PersonOverrides) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: overrides?.name ?? 'Paul Fernandez',
    alternateName: ['Jan Paul Fernandez', 'Jan Paul'],
    url: overrides?.url ?? SITE_URL,
    image: overrides?.image ?? `${SITE_URL}/paul.jpg`,
    jobTitle: overrides?.jobTitle ?? 'Tech Leader',
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: overrides?.alumniOf ?? 'Nueva Ecija University of Science and Technology',
    },
    worksFor: {
      '@type': 'EducationalOrganization',
      name: overrides?.worksFor ?? 'Mapúa Malayan Digital College (under MMCL)',
    },
    knowsAbout: overrides?.knowsAbout ?? [
      'Technology',
      'Digital Transformation',
      'AI Implementation',
      'Economy',
      'Psychology',
    ],
    sameAs: overrides?.sameAs ?? [
      'https://www.linkedin.com/in/jpaulfernandez/',
      'https://www.instagram.com/goofffball/',
    ],
  };
}

export function webSite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: SITE_URL,
    name: 'Paul Fernandez',
    alternateName: 'Jan Paul Fernandez',
    publisher: {
      '@id': PERSON_ID,
    },
  };
}

export function profilePage(dateModified?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: SITE_URL,
    mainEntity: {
      '@id': PERSON_ID,
    },
    ...(dateModified ? { dateModified } : {}),
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbs(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export interface BlogPostInput {
  title: string;
  excerpt: string;
  /** Site-relative canonical path, e.g. `/thoughts/slug/`. */
  url?: string;
  publishedDate: string;
  updatedDate?: string;
  cover?: string;
  topics?: string[];
  wordCount?: number;
  type?: 'essay' | 'note';
}

export function blogPosting(post: BlogPostInput) {
  const schemaType = post.type === 'essay' ? 'Article' : 'BlogPosting';
  return {
    '@context': 'https://schema.org',
    '@type': schemaType,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedDate,
    dateModified: post.updatedDate ?? post.publishedDate,
    author: {
      '@id': PERSON_ID,
    },
    ...(post.url
      ? {
          url: `${SITE_URL}${post.url}`,
          mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${post.url}` },
        }
      : {}),
    ...(post.cover ? { image: post.cover.startsWith('http') ? post.cover : `${SITE_URL}${post.cover}` } : {}),
    ...(post.topics ? { keywords: post.topics.join(', ') } : {}),
    ...(post.wordCount !== undefined ? { wordCount: post.wordCount } : {}),
  };
}

export interface FAQItem {
  q: string;
  a: string;
}

export function faqPage(questions: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

export interface ServiceInput {
  title: string;
  description: string;
}

export function service(s: ServiceInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: s.title,
    description: s.description,
    provider: {
      '@id': PERSON_ID,
    },
  };
}
