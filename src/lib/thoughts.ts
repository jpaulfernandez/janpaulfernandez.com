import { getCollection, type CollectionEntry } from 'astro:content';

export type ThoughtEntry = CollectionEntry<'thoughts'>;

/**
 * Retrieves all published thoughts, filtering out drafts and sorting by publishedDate desc.
 */
export async function getPublishedThoughts(): Promise<ThoughtEntry[]> {
  const thoughts = await getCollection('thoughts');
  return thoughts
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.publishedDate.localeCompare(a.data.publishedDate));
}

/**
 * Finds up to 3 related thoughts that share at least one topic, sorted by publishedDate desc, excluding the current post.
 */
export function getRelatedThoughts(currentPost: ThoughtEntry, allPosts: ThoughtEntry[]): ThoughtEntry[] {
  const currentTopics = currentPost.data.topics || [];
  if (currentTopics.length === 0) return [];

  return allPosts
    .filter((post) => post.id !== currentPost.id)
    .filter((post) => post.data.topics?.some((topic) => currentTopics.includes(topic)))
    .sort((a, b) => b.data.publishedDate.localeCompare(a.data.publishedDate))
    .slice(0, 3);
}
