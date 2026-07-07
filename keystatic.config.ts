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
      format: { contentField: 'body' },
      schema: {
        slug: fields.slug({ name: { label: 'Slug', description: 'Used for the filename only' } }),
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
      format: { contentField: 'story' },
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
        ctaPrimaryLabel: fields.text({ label: 'CTA Primary Label', validation: { isRequired: true } }),
        ctaSecondaryLabel: fields.text({ label: 'CTA Secondary Label', validation: { isRequired: true } }),
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
