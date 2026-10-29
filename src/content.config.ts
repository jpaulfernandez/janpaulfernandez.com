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
  schema: z.object({
    modes: z.array(
      z.object({
        name: z.string(),
        line: z.string(),
        whoFor: z.string(),
        runsAs: z.string(),
        priceSignal: z.string(),
        anchor: z.string(),
      })
    ),
    faq: z.array(
      z.object({
        q: z.string(),
        a: z.string(),
      })
    ),
  }),
});

// One JSON per tier of the AI-Resilient Organisation program. The file slug is
// the tier id (pulse, leadership-day, fluency, champions, agent-sprint).
// No price field of any kind: the program is "Enquire" only (rebuild-plan R5).
const program = defineCollection({
  loader: glob({
    pattern: '*.json',
    base: 'src/content/program',
  }),
  schema: z.object({
    label: z.string(),
    title: z.string(),
    tagline: z.string(),
    audience: z.string(),
    duration: z.string(),
    leavesWith: z.array(z.string()),
    problem: z.string(),
    happens: z.array(z.string()),
    outcomes: z.string(),
    artefacts: z.array(z.string()),
    faq: z.array(
      z.object({
        q: z.string(),
        a: z.string(),
      })
    ),
    order: z.number(),
  }),
});

// Program overview copy. Named `programPage` because `program` is the tiers.
const programPage = defineCollection({
  loader: glob({
    pattern: 'program.json',
    base: 'src/content/pages',
  }),
  schema: z.object({
    headline: z.string(),
    sub: z.string(),
    promise: z.string(),
    stats: z.array(
      z.object({
        figure: z.string(),
        claim: z.string(),
        sponsor: z.string(),
        sourceUrl: z.string().url(),
      })
    ),
    steps: z.array(
      z.object({
        name: z.string(),
        line: z.string(),
      })
    ),
    proofPoints: z.array(
      z.object({
        label: z.string(),
        text: z.string(),
      })
    ),
    addOns: z.array(z.string()),
    bundles: z.array(
      z.object({
        name: z.string(),
        contents: z.string(),
        whoFor: z.string(),
        tiers: z.array(z.string()),
      })
    ),
    foundingHeading: z.string(),
    foundingIntro: z.string(),
    foundingDiscount: z.string(),
    foundingGive: z.array(z.string()),
    foundingTerms: z.array(z.string()),
  }),
});

const projects = defineCollection({
  loader: glob({
    pattern: '*.json',
    base: 'src/content/projects',
  }),
  schema: z.object({
    title: z.string(),
    year: z.string(),
    description: z.string(),
    link: z.string().optional(),
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
    coverAlt: z.string().optional(),
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

export const collections = { now, career, home, about, workWithMe, seo, thoughts, projects, gallery, program, programPage };

