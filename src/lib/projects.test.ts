import { describe, it, expect, vi } from 'vitest';
import { getProjects, groupProjectsByYear, type ProjectEntry } from './projects';

vi.mock('astro:content', () => {
  const mockProjects = [
    {
      id: 'older-project',
      data: {
        title: 'Older Project',
        year: '2024',
        description: 'An older thing.',
      },
    },
    {
      id: 'newest-project',
      data: {
        title: 'Newest Project',
        year: '2026',
        description: 'The newest thing.',
        link: 'https://example.com',
      },
    },
    {
      id: 'another-recent',
      data: {
        title: 'Another Recent',
        year: '2026',
        description: 'Also recent.',
      },
    },
  ];

  return {
    getCollection: async (collection: string) => {
      if (collection === 'projects') {
        return mockProjects;
      }
      return [];
    },
  };
});

describe('projects helper logic', () => {
  it('getProjects should sort by year desc', async () => {
    const projects = await getProjects();

    expect(projects).toHaveLength(3);
    // Both 2026 entries come before 2024; same-year order is stable.
    expect(projects[0].id).toBe('newest-project');
    expect(projects[1].id).toBe('another-recent');
    expect(projects[2].id).toBe('older-project');
  });

  it('groupProjectsByYear should group by year with newest year first', () => {
    const projects = [
      { id: 'a', data: { title: 'A', year: '2026', description: 'a' } },
      { id: 'b', data: { title: 'B', year: '2024', description: 'b' } },
      { id: 'c', data: { title: 'C', year: '2026', description: 'c' } },
    ] as unknown as ProjectEntry[];

    const groups = groupProjectsByYear(projects);

    expect(groups).toHaveLength(2);
    expect(groups[0].year).toBe('2026');
    expect(groups[0].items.map((p) => p.id)).toEqual(['a', 'c']);
    expect(groups[1].year).toBe('2024');
    expect(groups[1].items.map((p) => p.id)).toEqual(['b']);
  });

  it('groupProjectsByYear should return an empty array for no projects', () => {
    expect(groupProjectsByYear([])).toEqual([]);
  });
});
