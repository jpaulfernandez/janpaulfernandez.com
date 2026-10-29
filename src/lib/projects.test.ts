import { describe, it, expect, vi } from 'vitest';
import {
  getProjects,
  groupProjectsByYear,
  projectsByKind,
  hasPage,
  relatedProjects,
  recentProjects,
  sortProjects,
  PROJECT_KINDS,
  KIND_LABEL,
  KIND_NOUN,
  type ProjectEntry,
} from './projects';

type Fixture = {
  id: string;
  year?: string;
  kind?: 'product' | 'work' | 'talk' | 'side';
  order?: number;
  featured?: boolean;
  body?: string;
};

function entry(f: Fixture): ProjectEntry {
  return {
    id: f.id,
    body: f.body,
    data: {
      title: f.id,
      kind: f.kind ?? 'work',
      year: f.year ?? '2026',
      summary: `${f.id} summary`,
      featured: f.featured ?? false,
      order: f.order,
      tags: [],
    },
  } as unknown as ProjectEntry;
}

const ids = (list: ProjectEntry[]) => list.map((p) => p.id);

vi.mock('astro:content', () => {
  const mk = (id: string, year: string) => ({
    id,
    data: { title: id, kind: 'work', year, summary: id, featured: false, tags: [] },
  });
  const mockProjects = [mk('older-project', '2024'), mk('newest-project', '2026'), mk('another-recent', '2026')];
  return {
    getCollection: async (collection: string) => (collection === 'projects' ? mockProjects : []),
  };
});

describe('kind constants', () => {
  it('lists the four kinds with a plural label and a singular noun each', () => {
    expect(PROJECT_KINDS).toEqual(['product', 'work', 'talk', 'side']);
    expect(KIND_LABEL).toEqual({
      product: 'Products',
      work: 'Work',
      talk: 'Talks',
      side: 'Side projects',
    });
    expect(KIND_NOUN).toEqual({
      product: 'Product',
      work: 'Work',
      talk: 'Talk',
      side: 'Side project',
    });
  });
});

describe('sortProjects', () => {
  it('sorts year descending', () => {
    const out = sortProjects([entry({ id: 'a', year: '2022' }), entry({ id: 'b', year: '2026' }), entry({ id: 'c', year: '2024' })]);
    expect(ids(out)).toEqual(['b', 'c', 'a']);
  });

  it('within a year sorts order ascending, undefined order last', () => {
    const out = sortProjects([
      entry({ id: 'none' }),
      entry({ id: 'three', order: 3 }),
      entry({ id: 'one', order: 1 }),
      entry({ id: 'two', order: 2 }),
    ]);
    expect(ids(out)).toEqual(['one', 'two', 'three', 'none']);
  });

  it('keeps input order for remaining ties (stable)', () => {
    const out = sortProjects([entry({ id: 'x' }), entry({ id: 'y' }), entry({ id: 'z' })]);
    expect(ids(out)).toEqual(['x', 'y', 'z']);
  });

  it('does not mutate its input', () => {
    const input = [entry({ id: 'old', year: '2020' }), entry({ id: 'new', year: '2026' })];
    const copy = [...input];
    const out = sortProjects(input);
    expect(input).toEqual(copy);
    expect(out).not.toBe(input);
  });
});

describe('getProjects', () => {
  it('returns the collection through sortProjects', async () => {
    const projects = await getProjects();
    expect(ids(projects)).toEqual(['newest-project', 'another-recent', 'older-project']);
  });
});

describe('groupProjectsByYear', () => {
  it('groups by year, newest first, preserving input order inside a group', () => {
    const groups = groupProjectsByYear([
      entry({ id: 'a', year: '2026' }),
      entry({ id: 'c', year: '2026' }),
      entry({ id: 'b', year: '2024' }),
    ]);
    expect(groups).toHaveLength(2);
    expect(groups[0].year).toBe('2026');
    expect(ids(groups[0].items)).toEqual(['a', 'c']);
    expect(groups[1].year).toBe('2024');
    expect(ids(groups[1].items)).toEqual(['b']);
  });

  it('returns [] for no projects', () => {
    expect(groupProjectsByYear([])).toEqual([]);
  });
});

describe('projectsByKind', () => {
  it('returns only that kind, preserving order', () => {
    const all = [
      entry({ id: 'a', kind: 'work' }),
      entry({ id: 'b', kind: 'side' }),
      entry({ id: 'c', kind: 'work' }),
    ];
    expect(ids(projectsByKind(all, 'work'))).toEqual(['a', 'c']);
    expect(ids(projectsByKind(all, 'side'))).toEqual(['b']);
    expect(projectsByKind(all, 'talk')).toEqual([]);
  });
});

describe('hasPage', () => {
  it('is true when body has non-whitespace content', () => {
    expect(hasPage(entry({ id: 'a', body: '## Hello' }))).toBe(true);
  });
  it('is false for empty, whitespace-only and undefined bodies', () => {
    expect(hasPage(entry({ id: 'a', body: '' }))).toBe(false);
    expect(hasPage(entry({ id: 'b', body: ' \n\t ' }))).toBe(false);
    expect(hasPage(entry({ id: 'c', body: undefined }))).toBe(false);
  });
});

describe('relatedProjects', () => {
  const all = [
    entry({ id: 'self', kind: 'product', year: '2026' }),
    entry({ id: 'p-old', kind: 'product', year: '2020' }),
    entry({ id: 'p-new', kind: 'product', year: '2025' }),
    entry({ id: 'w', kind: 'work', year: '2026' }),
    entry({ id: 'p-mid', kind: 'product', year: '2023' }),
    entry({ id: 'p-mid2', kind: 'product', year: '2022' }),
  ];

  it('returns same-kind entries, excluding the entry itself, sorted, capped at 3 by default', () => {
    expect(ids(relatedProjects(all[0], all))).toEqual(['p-new', 'p-mid', 'p-mid2']);
  });

  it('honours n', () => {
    expect(ids(relatedProjects(all[0], all, 1))).toEqual(['p-new']);
  });

  it('returns [] when nothing else shares the kind', () => {
    expect(relatedProjects(all[3], all)).toEqual([]);
  });
});

describe('recentProjects', () => {
  it('puts featured first (sorted), then the rest sorted, sliced to n', () => {
    const all = [
      entry({ id: 'new', year: '2026' }),
      entry({ id: 'feat-old', year: '2020', featured: true }),
      entry({ id: 'feat-new', year: '2024', featured: true }),
      entry({ id: 'mid', year: '2025' }),
    ];
    expect(ids(recentProjects(all, 3))).toEqual(['feat-new', 'feat-old', 'new']);
    expect(ids(recentProjects(all, 10))).toEqual(['feat-new', 'feat-old', 'new', 'mid']);
  });

  it('with no featured entries is just the newest n', () => {
    const all = [entry({ id: 'a', year: '2022' }), entry({ id: 'b', year: '2026' }), entry({ id: 'c', year: '2024' })];
    expect(ids(recentProjects(all, 2))).toEqual(['b', 'c']);
  });
});
