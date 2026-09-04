// Production canonicalises to www (apex 308s), so every emitted URL uses www.
export const SITE_URL = 'https://www.janpaulfernandez.com';

// PERSON_ID is a stable identifier, NOT a fetchable URL, and it is pinned to the
// apex literal on purpose: it is the one @id every knowledge graph keys Paul's
// entity on, so it must never move with the canonical host. See CLAUDE.md.
export const PERSON_ID = 'https://janpaulfernandez.com/#person';

/** Site-relative paths become absolute; anything already absolute is left alone. */
function abs(url: string) {
  return url.startsWith('http') ? url : `${SITE_URL}${url}`;
}

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
      item: abs(item.url),
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
    ...(post.cover ? { image: abs(post.cover) } : {}),
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

export interface ImageObjectInput {
  /** Site-relative or absolute source URL. */
  url: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface ImageGalleryInput {
  title: string;
  description?: string;
  /** Site-relative canonical path, e.g. `/gallery/honne-at-wanderland/`. */
  url: string;
  datePublished?: string;
  images: ImageObjectInput[];
}

/**
 * ImageGallery (a MediaGallery, itself a CollectionPage) for the photo sets.
 * Every frame carries creator + creditText so the photographs stay attributed
 * to Paul once they are lifted out of the page and into an image index.
 */
export function imageGallery(g: ImageGalleryInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: g.title,
    ...(g.description ? { description: g.description } : {}),
    url: abs(g.url),
    ...(g.datePublished ? { datePublished: g.datePublished } : {}),
    author: { '@id': PERSON_ID },
    image: g.images.map((img) => ({
      '@type': 'ImageObject',
      contentUrl: abs(img.url),
      ...(img.caption ? { caption: img.caption } : {}),
      ...(img.width !== undefined ? { width: img.width } : {}),
      ...(img.height !== undefined ? { height: img.height } : {}),
      creator: { '@id': PERSON_ID },
      creditText: 'Paul Fernandez',
    })),
  };
}

export interface BlogPostSummary {
  title: string;
  excerpt?: string;
  /** Site-relative canonical path. */
  url: string;
  publishedDate: string;
  updatedDate?: string;
}

export interface BlogInput {
  title: string;
  description: string;
  /** Site-relative canonical path, e.g. `/thoughts/`. */
  url: string;
  posts: BlogPostSummary[];
}

/** Blog schema for the /thoughts hub — the entry point every post links back to. */
export function blog(b: BlogInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: b.title,
    description: b.description,
    url: abs(b.url),
    author: { '@id': PERSON_ID },
    blogPost: b.posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      ...(post.excerpt ? { description: post.excerpt } : {}),
      url: abs(post.url),
      datePublished: post.publishedDate,
      dateModified: post.updatedDate ?? post.publishedDate,
      author: { '@id': PERSON_ID },
    })),
  };
}

export interface CollectionPageInput {
  title: string;
  description: string;
  /** Site-relative canonical path, e.g. `/topics/ai/`. */
  url: string;
  items: { name: string; url: string }[];
}

/** CollectionPage + ItemList for the topic archives and the gallery index. */
export function collectionPage(c: CollectionPageInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: c.title,
    description: c.description,
    url: abs(c.url),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: c.items.length,
      itemListElement: c.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: abs(item.url),
      })),
    },
  };
}
