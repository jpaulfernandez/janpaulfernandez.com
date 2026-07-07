import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const dateSchema = z.union([z.string(), z.date()]).transform((val) =>
  val instanceof Date ? val.toISOString().slice(0, 10) : val
);

const now = defineCollection({
  loader: glob({
    pattern: '*.md',
    base: 'src/content/now',
    generateId: ({ entry }) => entry.replace(/\.[^/.]+$/, ''),
  }),
  schema: z.object({
    title: z.string().optional(),
    slug: z.string().optional(),
    date: dateSchema,
    link: z.string().optional(),
  }),
});

const career = defineCollection({
  loader: glob({
    pattern: '*.md',
    base: 'src/content/career',
    generateId: ({ entry }) => entry.replace(/\.[^/.]+$/, ''),
  }),
  schema: ({ image }) => z.object({
    org: z.string(),
    role: z.string(),
    period: z.string(),
    order: z.number(),
    logo: image().optional(),
  }),
});

const home = defineCollection({
  loader: glob({
    pattern: 'home.json',
    base: 'src/content/pages',
  }),
  schema: z.object({
    heroGreeting: z.string(),
    heroIntro: z.string(),
    ctaPrimaryLabel: z.string(),
    ctaSecondaryLabel: z.string(),
  }),
});

const about = defineCollection({
  loader: glob({
    pattern: 'about.md',
    base: 'src/content/pages',
  }),
  schema: z.object({}),
});

const workWithMe = defineCollection({
  loader: glob({
    pattern: 'workWithMe.md',
    base: 'src/content/pages',
    generateId: () => 'workWithMe',
  }),
  schema: z.object({}),
});

const services = defineCollection({
  loader: glob({
    pattern: '*.json',
    base: 'src/content/services',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
    order: z.number(),
    faq: z.array(
      z.object({
        q: z.string(),
        a: z.string(),
      })
    ).optional(),
  }),
});

const seo = defineCollection({
  loader: glob({
    pattern: 'seo.json',
    base: 'src/content/pages',
  }),
  schema: z.object({
    defaultDescription: z.string(),
    siteName: z.string(),
  }),
});

const thoughts = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: 'src/content/thoughts',
    generateId: ({ entry }) => entry.replace(/\.[^/.]+$/, '').replace(/\/index$/, ''),
  }),
  schema: ({ image }) => z.object({
    title: z.string(),
    type: z.enum(['essay', 'note']),
    topics: z.array(z.string()),
    stage: z.enum(['seedling', 'budding', 'evergreen', 'none']).optional().transform((v) => v === 'none' ? undefined : v),
    excerpt: z.string().max(160),
    cover: image().optional(),
    publishedDate: dateSchema,
    updatedDate: dateSchema.optional(),
    draft: z.boolean().default(false),
  }),
});

const gallery = defineCollection({
  loader: glob({
    pattern: '*.json',
    base: 'src/content/gallery',
  }),
  schema: ({ image }) => z.object({
    title: z.string(),
    publishedDate: dateSchema,
    cover: image().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    licensingAvailable: z.boolean().default(true),
    photos: z.array(
      z.object({
        image: image(),
        caption: z.string().optional(),
      })
    ).default([]),
  }),
});

export const collections = { now, career, home, about, workWithMe, seo, thoughts, services, gallery };

