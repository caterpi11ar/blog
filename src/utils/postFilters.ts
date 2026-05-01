import type { CollectionEntry } from 'astro:content'

type BlogPost = CollectionEntry<'blog'>

export function isThreejsPost(post: BlogPost) {
  return post.id.startsWith('threejs/')
}

export function isRegularPost(post: BlogPost) {
  return !isThreejsPost(post)
}
