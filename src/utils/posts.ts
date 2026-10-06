import { getCollection, type CollectionEntry } from 'astro:content';

/** Published notes, newest first. Drafts show only in dev. */
export async function getPosts() {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Minutes to read at roughly 220 words a minute, never less than one. */
export function readingTime(post: CollectionEntry<'blog'>): number {
  const words = (post.body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
