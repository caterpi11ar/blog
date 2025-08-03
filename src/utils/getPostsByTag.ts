import type { CollectionEntry } from 'astro:content'
import { slugifyAll } from './slugify'

function getPostsByTag(posts: CollectionEntry<'blog'>[], tag: string) {
  return posts.filter(post => slugifyAll(post.data.tags).includes(tag))
}

export default getPostsByTag
