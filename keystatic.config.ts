import { config, fields, collection, singleton } from '@keystatic/core';
import { block, wrapper } from '@keystatic/core/content-components';

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
        body: fields.mdx({
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
              directory: 'src/assets/thoughts',
              publicPath: '../../assets/thoughts',
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
        }),
      },
    }),
    services: collection({
      label: 'Services',
      slugField: 'slug',
      path: 'src/content/services/*',
      format: { data: 'json' },
      schema: {
        slug: fields.slug({ name: { label: 'Slug', description: 'Used for filename' } }),
        title: fields.text({ label: 'Title', validation: { isRequired: true } }),
        description: fields.text({ label: 'Description', multiline: true, validation: { isRequired: true } }),
        icon: fields.text({ label: 'Icon Name (e.g. transform, development, talks, ai)', validation: { isRequired: false } }),
        order: fields.number({ label: 'Order', validation: { isRequired: true } }),
        faq: fields.array(
          fields.object({
            q: fields.text({ label: 'Question', validation: { isRequired: true } }),
            a: fields.text({ label: 'Answer', multiline: true, validation: { isRequired: true } }),
          }),
          {
            label: 'FAQ Entries',
            itemLabel: (item) => item.fields.q.value || 'FAQ Item',
          }
        ),
      },
    }),
    courses: collection({
      label: 'Courses',
      slugField: 'slug',
      path: 'src/content/courses/*',
      format: { data: 'json' },
      schema: {
        slug: fields.slug({ name: { label: 'Slug', description: 'URL segment, e.g. ai-fluency' } }),
        title: fields.text({ label: 'Title', validation: { isRequired: true } }),
        tagline: fields.text({ label: 'Tagline (one line under the H1)', validation: { isRequired: true } }),
        audiences: fields.multiselect({
          label: 'Audiences',
          description: 'Drives which landing section lists it and how the form groups it',
          options: [
            { label: 'Personal', value: 'personal' },
            { label: 'Business', value: 'business' },
            { label: 'Organization', value: 'org' },
          ],
        }),
        duration: fields.text({ label: 'Duration (e.g. "2 hours")', validation: { isRequired: true } }),
        formatLabel: fields.text({ label: 'Format (meta strip, e.g. "1-on-1 / group")', validation: { isRequired: true } }),
        whoFor: fields.text({ label: "Who it's for (meta strip, short)", validation: { isRequired: true } }),
        approach: fields.text({ label: 'Approach (meta strip, e.g. "hands-on")', validation: { isRequired: true } }),
        approachNote: fields.text({ label: 'Approach note (one line in the body)', multiline: true, validation: { isRequired: true } }),
        outcomes: fields.array(fields.text({ label: 'Outcome' }), {
          label: "You'll leave with",
          itemLabel: (item) => item.value || 'Outcome',
        }),
        outline: fields.array(
          fields.object({
            step: fields.text({ label: 'Step', validation: { isRequired: true } }),
            item: fields.text({ label: 'What happens', multiline: true, validation: { isRequired: true } }),
          }),
          {
            label: 'What we cover (outline)',
            itemLabel: (item) => item.fields.step.value || 'Step',
          }
        ),
        formats: fields.array(
          fields.object({
            label: fields.text({ label: 'Format', validation: { isRequired: true } }),
            detail: fields.text({ label: 'Detail (length, place, cap)', validation: { isRequired: true } }),
            price: fields.text({ label: 'Price', validation: { isRequired: true } }),
            priceNote: fields.text({ label: 'Price note (optional)', validation: { isRequired: false } }),
          }),
          {
            label: 'Formats & price',
            itemLabel: (item) => item.fields.label.value || 'Format',
          }
        ),
        priceSignal: fields.text({ label: 'Price signal (e.g. "from ₱2,500")', validation: { isRequired: true } }),
        caveat: fields.text({ label: 'Honest caveat (optional)', multiline: true, validation: { isRequired: false } }),
        order: fields.number({ label: 'Order', validation: { isRequired: true } }),
      },
    }),
    projects: collection({
      label: 'Projects',
      slugField: 'slug',
      path: 'src/content/projects/*',
      format: { data: 'json' },
      schema: {
        slug: fields.slug({ name: { label: 'Slug', description: 'Used for filename' } }),
        title: fields.text({ label: 'Title', validation: { isRequired: true } }),
        year: fields.text({ label: 'Year', description: 'Display year, e.g. 2026', validation: { isRequired: true } }),
        description: fields.text({ label: 'Description (one line)', validation: { isRequired: true } }),
        link: fields.url({ label: 'Link (optional external URL)', validation: { isRequired: false } }),
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
