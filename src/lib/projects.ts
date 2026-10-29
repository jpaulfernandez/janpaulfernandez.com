import { getCollection, type CollectionEntry } from 'astro:content';

export type ProjectEntry = CollectionEntry<'projects'>;

export const PROJECT_KINDS = ['product', 'work', 'talk', 'side'] as const;
export type ProjectKind = (typeof PROJECT_KINDS)[number];

/** Plural, for filter chips. */
export const KIND_LABEL: Record<ProjectKind, string> = {
  product: 'Products',
  work: 'Work',
  talk: 'Talks',
  side: 'Side projects',
};

/** Singular, for rows and kickers. */
export const KIND_NOUN: Record<ProjectKind, string> = {
  product: 'Product',
  work: 'Work',
  talk: 'Talk',
  side: 'Side project',
};

/**
 * Year desc; within a year `order` asc with undefined last; other ties keep
 * input order. Returns a new array.
 */
export function sortProjects(projects: ProjectEntry[]): ProjectEntry[] {
  return [...projects].sort((a, b) => {
    const byYear = b.data.year.localeCompare(a.data.year);
    if (byYear !== 0) return byYear;
    const ao = a.data.order ?? Infinity;
    const bo = b.data.order ?? Infinity;
    if (ao === bo) return 0;
    return ao < bo ? -1 : 1;
  });
}

/** Retrieves all projects, sorted with sortProjects. */
export async function getProjects(): Promise<ProjectEntry[]> {
  return sortProjects(await getCollection('projects'));
}

/**
 * Groups projects by year, preserving input order within each year.
 * Feed it the output of getProjects() to get newest-year-first groups.
 */
export function groupProjectsByYear(
  projects: ProjectEntry[]
): { year: string; items: ProjectEntry[] }[] {
  const groups = new Map<string, ProjectEntry[]>();
  for (const project of projects) {
    const items = groups.get(project.data.year) ?? [];
    items.push(project);
    groups.set(project.data.year, items);
  }
  return [...groups.entries()].map(([year, items]) => ({ year, items }));
}

export function projectsByKind(projects: ProjectEntry[], kind: ProjectKind): ProjectEntry[] {
  return projects.filter((p) => p.data.kind === kind);
}

/** An entry has a case-study page only when its body has content. */
export function hasPage(entry: ProjectEntry): boolean {
  return (entry.body ?? '').trim().length > 0;
}

/** Same-kind entries other than `entry`, sorted, at most n. */
export function relatedProjects(entry: ProjectEntry, all: ProjectEntry[], n = 3): ProjectEntry[] {
  return sortProjects(all.filter((p) => p.id !== entry.id && p.data.kind === entry.data.kind)).slice(0, n);
}

/** Featured first, then the rest, each group via sortProjects; first n. */
export function recentProjects(all: ProjectEntry[], n: number): ProjectEntry[] {
  const featured = sortProjects(all.filter((p) => p.data.featured));
  const rest = sortProjects(all.filter((p) => !p.data.featured));
  return [...featured, ...rest].slice(0, n);
}
