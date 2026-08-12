import { getCollection, type CollectionEntry } from 'astro:content';

export type ProjectEntry = CollectionEntry<'projects'>;

/**
 * Retrieves all projects sorted by year desc (stable within a year).
 */
export async function getProjects(): Promise<ProjectEntry[]> {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => b.data.year.localeCompare(a.data.year));
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
