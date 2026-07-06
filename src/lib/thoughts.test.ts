import { describe, it, expect, vi } from 'vitest';
import { getPublishedThoughts, getRelatedThoughts, type ThoughtEntry } from './thoughts';

vi.mock('astro:content', () => {
  const mockThoughts = [
    {
      id: 'post-1',
      data: {
        title: 'Draft Post',
        draft: true,
        publishedDate: '2026-07-03',
        topics: ['technology'],
      },
    },
    {
      id: 'post-2',
      data: {
        title: 'Tech and Economy Post',
        draft: false,
        publishedDate: '2026-07-02',
        topics: ['technology', 'economy'],
      },
    },
    {
      id: 'post-3',
      data: {
        title: 'Psychology Post',
        draft: false,
        publishedDate: '2026-07-01',
        topics: ['psychology'],
      },
    },
    {
      id: 'post-4',
      data: {
        title: 'Latest Tech Post',
        draft: false,
        publishedDate: '2026-07-04',
        topics: ['technology'],
      },
    },
  ];

  return {
    getCollection: async (collection: string) => {
      if (collection === 'thoughts') {
        return mockThoughts;
      }
      return [];
    },
  };
});

describe('thoughts helper logic', () => {
  it('getPublishedThoughts should filter drafts and sort by date desc', async () => {
    const posts = await getPublishedThoughts();
    
    // Should filter out post-1 because it's a draft
    expect(posts).toHaveLength(3);
    
    // Should be sorted: post-4 (July 4) -> post-2 (July 2) -> post-3 (July 1)
    expect(posts[0].id).toBe('post-4');
    expect(posts[1].id).toBe('post-2');
    expect(posts[2].id).toBe('post-3');
  });

  it('getRelatedThoughts should find overlap, exclude self, sort desc, limit to 3', () => {
    const allPosts: ThoughtEntry[] = [
      {
        id: 'post-2',
        data: {
          title: 'Tech and Economy Post',
          draft: false,
          publishedDate: '2026-07-02',
          topics: ['technology', 'economy'],
          excerpt: 'desc',
        },
      } as any,
      {
        id: 'post-3',
        data: {
          title: 'Psychology Post',
          draft: false,
          publishedDate: '2026-07-01',
          topics: ['psychology'],
          excerpt: 'desc',
        },
      } as any,
      {
        id: 'post-4',
        data: {
          title: 'Latest Tech Post',
          draft: false,
          publishedDate: '2026-07-04',
          topics: ['technology'],
          excerpt: 'desc',
        },
      } as any,
      {
        id: 'post-5',
        data: {
          title: 'Older Tech Post',
          draft: false,
          publishedDate: '2026-06-30',
          topics: ['technology'],
          excerpt: 'desc',
        },
      } as any,
    ];

    // Related to post-2 (topics: ['technology', 'economy'])
    // Should match post-4, post-5 (topic 'technology' overlap), and exclude post-2 (self) and post-3 (no topic overlap)
    const current = allPosts[0]; // post-2
    const related = getRelatedThoughts(current, allPosts);

    expect(related).toHaveLength(2);
    // Should be sorted by date desc: post-4 (July 4) -> post-5 (June 30)
    expect(related[0].id).toBe('post-4');
    expect(related[1].id).toBe('post-5');
  });
});
