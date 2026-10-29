import { config, fields, collection, singleton } from '@keystatic/core';
import { block, wrapper } from '@keystatic/core/content-components';

// Shared by thoughts and projects: same toolbar, same four components.
const articleBody = (assetDir: string) =>
  fields.mdx({
    label: 'Body',
    options: {
      bold: true,
      italic: true,
      heading: [2, 3, 4],
      blockquote: true,
      orderedList: true,
      unorderedList: true,
      table: true,
      link: true,
      divider: true,
      codeBlock: true,
      image: {
        directory: `src/assets/${assetDir}`,
        publicPath: `../../assets/${assetDir}`,
      },
    },
    components: {
      KeyTakeaway: wrapper({
        label: 'Key Takeaway',
        schema: {
          content: fields.child({ kind: 'block', placeholder: 'Key takeaway text...' }),
        },
      }),
      Callout: wrapper({
        label: 'Callout',
        schema: {
          variant: fields.select({
            label: 'Variant',
            options: [
              { label: 'Note', value: 'note' },
              { label: 'Idea', value: 'idea' },
              { label: 'Warning', value: 'warning' },
            ],
            defaultValue: 'note',
          }),
          content: fields.child({ kind: 'block', placeholder: 'Callout text...' }),
        },
      }),
      PullQuote: wrapper({
        label: 'Pull Quote',
        schema: {
          content: fields.child({ kind: 'block', placeholder: 'Pull quote text...' }),
        },
      }),
      Embed: block({
        label: 'Embed',
        schema: {
          url: fields.url({ label: 'Embed URL', validation: { isRequired: true } }),
          title: fields.text({ label: 'Title', validation: { isRequired: true } }),
        },
      }),
    },
  });

export default config({
  storage: {
    kind: 'github',
    repo: 'jpaulfernandez/janpaulfernandez.com'
  },
  collections: {
    now: collection({
      label: 'Now',
      slugField: 'slug',
      path: 'src/content/now/*',
      format: { data: 'yaml', contentField: 'body' },
      schema: {
        slug: fields.slug({ name: { label: 'Slug / Title', description: 'Used for the entry title and filename' } }),
        title: fields.text({ label: 'Title (optional override)', description: 'If left blank, the Slug / Title above will be used as the display title', validation: { isRequired: false } }),
        date: fields.date({ label: 'Date', validation: { isRequired: true } }),
        body: fields.document({
          label: 'Body',
          formatting: true,
          links: true,
        }),
        link: fields.url({ label: 'Link', validation: { isRequired: false } }),
      },
    }),
    career: collection({
      label: 'Career',
      slugField: 'slug',
      path: 'src/content/career/*',
      format: { data: 'yaml', contentField: 'story' },
      schema: {
        slug: fields.slug({ name: { label: 'Slug', description: 'Used for the filename only' } }),
        org: fields.text({ label: 'Organization', validation: { isRequired: true } }),
        role: fields.text({ label: 'Role', validation: { isRequired: true } }),
        period: fields.text({ label: 'Period', validation: { isRequired: true } }),
        story: fields.document({
          label: 'Story',
          formatting: true,
          links: true,
        }),
        order: fields.number({ label: 'Order', validation: { isRequired: true } }),
        logo: fields.image({
          label: 'Logo',
          directory: 'src/assets/career',
          publicPath: '../../assets/career',
        }),
      },
    }),
    thoughts: collection({
      label: 'Thoughts',
      slugField: 'slug',
      path: 'src/content/thoughts/*',
      format: { contentField: 'body' },
      schema: {
        slug: fields.slug({ name: { label: 'Slug', description: 'Used for the filename only' } }),
        title: fields.text({ label: 'Title', validation: { isRequired: true } }),
        type: fields.select({
          label: 'Type',
          options: [
            { label: 'Essay', value: 'essay' },
            { label: 'Note', value: 'note' },
          ],
          defaultValue: 'essay',
        }),
        topics: fields.array(fields.text({ label: 'Topic' }), {
          label: 'Topics',
          itemLabel: (item) => item.value || 'Topic',
        }),
        stage: fields.select({
          label: 'Growth Stage',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Seedling🌱', value: 'seedling' },
            { label: 'Budding🌿', value: 'budding' },
            { label: 'Evergreen🌳', value: 'evergreen' },
          ],
          defaultValue: 'none',
        }),
        excerpt: fields.text({
          label: 'Excerpt (max 160 chars)',
          validation: { length: { max: 160 }, isRequired: true },
        }),
        cover: fields.image({
          label: 'Cover Image',
          directory: 'src/assets/thoughts',
          publicPath: '../../assets/thoughts',
        }),
        coverAlt: fields.text({
          label: 'Cover Alt Text',
          description:
            'Describes the cover image for screen readers and image search. Leave empty only if the image is purely decorative.',
        }),
        publishedDate: fields.date({ label: 'Published Date', validation: { isRequired: true } }),
        updatedDate: fields.date({ label: 'Updated Date (Optional)' }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        body: articleBody('thoughts'),
      },
    }),
    program: collection({
      label: 'Program tiers',
      slugField: 'slug',
      path: 'src/content/program/*',
      format: { data: 'json' },
      schema: {
        slug: fields.slug({ name: { label: 'Slug', description: 'URL segment = tier id, e.g. leadership-day' } }),
        label: fields.text({ label: 'Label (kicker, e.g. "Tier 2.5")', validation: { isRequired: true } }),
        title: fields.text({ label: 'Title', validation: { isRequired: true } }),
        tagline: fields.text({ label: 'Tagline (the promise, one line)', validation: { isRequired: true } }),
        audience: fields.text({ label: 'For (who attends)', validation: { isRequired: true } }),
        duration: fields.text({ label: 'Duration', validation: { isRequired: true } }),
        leavesWith: fields.array(fields.text({ label: 'Item' }), {
          label: 'You leave with',
          itemLabel: (item) => item.value || 'Item',
        }),
        problem: fields.text({ label: 'The problem', multiline: true, validation: { isRequired: true } }),
        happens: fields.array(fields.text({ label: 'Step', multiline: true }), {
          label: 'What happens',
          itemLabel: (item) => item.value.slice(0, 60) || 'Step',
        }),
        outcomes: fields.text({ label: 'Outcomes', multiline: true, validation: { isRequired: true } }),
        artefacts: fields.array(fields.text({ label: 'Artefact' }), {
          label: 'Artefacts',
          itemLabel: (item) => item.value || 'Artefact',
        }),
        faq: fields.array(
          fields.object({
            q: fields.text({ label: 'Question', validation: { isRequired: true } }),
            a: fields.text({ label: 'Answer', multiline: true, validation: { isRequired: true } }),
          }),
          {
            label: 'FAQ (specific to this tier)',
            itemLabel: (item) => item.fields.q.value || 'FAQ Item',
          }
        ),
        order: fields.number({ label: 'Order', validation: { isRequired: true } }),
      },
    }),
    projects: collection({
      label: 'Projects',
      slugField: 'slug',
      path: 'src/content/projects/*',
      format: { contentField: 'body' },
      schema: {
        slug: fields.slug({ name: { label: 'Slug', description: 'Used for filename and URL' } }),
        title: fields.text({ label: 'Title', validation: { isRequired: true } }),
        kind: fields.select({
          label: 'Kind',
          options: [
            { label: 'Product', value: 'product' },
            { label: 'Work', value: 'work' },
            { label: 'Talk', value: 'talk' },
            { label: 'Side project', value: 'side' },
          ],
          defaultValue: 'product',
        }),
        year: fields.text({
          label: 'Year',
          description: 'The year it shipped or was last worked on, e.g. 2026. Groups the index.',
          validation: { isRequired: true },
        }),
        period: fields.text({ label: 'Period (display only)', description: 'e.g. 2018–2023' }),
        role: fields.text({ label: 'Role' }),
        summary: fields.text({ label: 'Summary (one line)', validation: { isRequired: true } }),
        metaDescription: fields.text({
          label: 'Meta description (optional, 140–160 chars)',
          description: 'SEO description for the case-study page. Falls back to the summary.',
          multiline: true,
        }),
        link: fields.url({ label: 'Link (optional external URL)', validation: { isRequired: false } }),
        cover: fields.image({
          label: 'Cover Image',
          directory: 'src/assets/projects',
          publicPath: '../../assets/projects',
        }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (item) => item.value || 'Tag',
        }),
        featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
        order: fields.integer({ label: 'Order', description: 'Within a year, lowest first. Blank sorts last.' }),
        body: articleBody('projects'),
      },
    }),
    gallery: collection({
      label: 'Gallery',
      slugField: 'slug',
      path: 'src/content/gallery/*',
      format: { data: 'json' },
      schema: {
        slug: fields.slug({ name: { label: 'Slug', description: 'Used for filename' } }),
        title: fields.text({ label: 'Title', validation: { isRequired: true } }),
        publishedDate: fields.date({ label: 'Published Date', validation: { isRequired: true } }),
        cover: fields.image({
          label: 'Cover Image',
          directory: 'src/assets/gallery',
          publicPath: '../../assets/gallery',
        }),
        description: fields.text({ label: 'Description', multiline: true }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (item) => item.value || 'Tag',
        }),
        featured: fields.checkbox({ label: 'Featured in Footer', defaultValue: false }),
        licensingAvailable: fields.checkbox({ label: 'Licensing Available', defaultValue: true }),
        photos: fields.array(
          fields.object({
            image: fields.image({
              label: 'Image',
              directory: 'src/assets/gallery',
              publicPath: '../../assets/gallery',
            }),
            caption: fields.text({ label: 'Caption' }),
          }),
          {
            label: 'Photos in this Collection',
            itemLabel: (item) => item.fields.caption.value || 'Photo',
          }
        ),
      },
    }),
  },
  singletons: {
    home: singleton({
      label: 'Home Page',
      path: 'src/content/pages/home',
      format: { data: 'json' },
      schema: {
        heroGreeting: fields.text({ label: 'Hero Greeting (e.g. "Hi, I\'m Paul.")', validation: { isRequired: true } }),
        heroIntro: fields.text({ label: 'Hero Intro Statement', multiline: true, validation: { isRequired: true } }),
      },
    }),
    about: singleton({
      label: 'About Page',
      path: 'src/content/pages/about',
      format: { data: 'yaml', contentField: 'intro' },
      schema: {
        intro: fields.document({
          label: 'Intro',
          formatting: true,
          links: true,
        }),
      },
    }),
    workWithMe: singleton({
      label: 'Work With Me Page',
      path: 'src/content/pages/workWithMe',
      format: { data: 'yaml', contentField: 'intro' },
      schema: {
        intro: fields.document({
          label: 'Intro',
          formatting: true,
          links: true,
        }),
        modes: fields.array(
          fields.object({
            name: fields.text({ label: 'Name', validation: { isRequired: true } }),
            line: fields.text({ label: 'One line', multiline: true, validation: { isRequired: true } }),
            whoFor: fields.text({ label: "Who it's for", multiline: true, validation: { isRequired: true } }),
            runsAs: fields.text({ label: 'How it runs', multiline: true, validation: { isRequired: true } }),
            priceSignal: fields.text({ label: 'Price signal (e.g. "Message for a quote")', validation: { isRequired: true } }),
            anchor: fields.text({ label: 'Anchor (id, e.g. with-you)', validation: { isRequired: true } }),
          }),
          {
            label: 'Three ways in',
            itemLabel: (item) => item.fields.name.value || 'Mode',
          }
        ),
        faq: fields.array(
          fields.object({
            q: fields.text({ label: 'Question', validation: { isRequired: true } }),
            a: fields.text({ label: 'Answer', multiline: true, validation: { isRequired: true } }),
          }),
          {
            label: 'FAQ (six items)',
            itemLabel: (item) => item.fields.q.value || 'FAQ Item',
          }
        ),
      },
    }),
    programPage: singleton({
      label: 'Program Overview (AI-Resilient Organisation)',
      path: 'src/content/pages/program',
      format: { data: 'json' },
      schema: {
        headline: fields.text({ label: 'Headline (h1)', multiline: true, validation: { isRequired: true } }),
        sub: fields.text({ label: 'Sub-headline', multiline: true, validation: { isRequired: true } }),
        promise: fields.text({ label: 'The promise', multiline: true, validation: { isRequired: true } }),
        stats: fields.array(
          fields.object({
            figure: fields.text({ label: 'Figure (e.g. 78%)', validation: { isRequired: true } }),
            claim: fields.text({ label: 'Claim', multiline: true, validation: { isRequired: true } }),
            sponsor: fields.text({ label: 'Source and sponsor (named in full)', multiline: true, validation: { isRequired: true } }),
            sourceUrl: fields.url({ label: 'Source URL', validation: { isRequired: true } }),
          }),
          {
            label: 'The problem (sourced figures)',
            itemLabel: (item) => item.fields.figure.value || 'Stat',
          }
        ),
        steps: fields.array(
          fields.object({
            name: fields.text({ label: 'Step', validation: { isRequired: true } }),
            line: fields.text({ label: 'Verb line', validation: { isRequired: true } }),
          }),
          {
            label: 'How it works (six steps)',
            itemLabel: (item) => item.fields.name.value || 'Step',
          }
        ),
        proofPoints: fields.array(
          fields.object({
            label: fields.text({ label: 'Label', validation: { isRequired: true } }),
            text: fields.text({ label: 'Text', multiline: true, validation: { isRequired: true } }),
          }),
          {
            label: 'Who is teaching (proof points)',
            itemLabel: (item) => item.fields.label.value || 'Proof point',
          }
        ),
        addOns: fields.array(fields.text({ label: 'Add-on (name only)' }), {
          label: 'Add-ons',
          itemLabel: (item) => item.value || 'Add-on',
        }),
        bundles: fields.array(
          fields.object({
            name: fields.text({ label: 'Name', validation: { isRequired: true } }),
            contents: fields.text({ label: 'Contents', multiline: true, validation: { isRequired: true } }),
            whoFor: fields.text({ label: "Who it's for", multiline: true, validation: { isRequired: true } }),
            tiers: fields.multiselect({
              label: 'Tiers in this bundle (drives "part of" links)',
              options: [
                { label: 'Pulse', value: 'pulse' },
                { label: 'Leadership day', value: 'leadership-day' },
                { label: 'Fluency', value: 'fluency' },
                { label: 'Champions', value: 'champions' },
                { label: 'Agent sprint', value: 'agent-sprint' },
              ],
            }),
          }),
          {
            label: 'Bundles (no figures)',
            itemLabel: (item) => item.fields.name.value || 'Bundle',
          }
        ),
        foundingHeading: fields.text({ label: 'Founding offer: heading', validation: { isRequired: true } }),
        foundingIntro: fields.text({ label: 'Founding offer: intro', multiline: true, validation: { isRequired: true } }),
        foundingDiscount: fields.text({ label: 'Founding offer: what you get', multiline: true, validation: { isRequired: true } }),
        foundingGive: fields.array(fields.text({ label: 'Item', multiline: true }), {
          label: 'What you give',
          itemLabel: (item) => item.value.slice(0, 60) || 'Item',
        }),
        foundingTerms: fields.array(fields.text({ label: 'Term', multiline: true }), {
          label: 'Terms',
          itemLabel: (item) => item.value.slice(0, 60) || 'Term',
        }),
      },
    }),
    seo: singleton({
      label: 'SEO Configuration',
      path: 'src/content/pages/seo',
      format: { data: 'json' },
      schema: {
        defaultDescription: fields.text({ label: 'Default Description', validation: { isRequired: true } }),
        siteName: fields.text({ label: 'Site Name', validation: { isRequired: true } }),
      },
    }),
  },
});
