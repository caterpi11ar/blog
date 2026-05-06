import type { CollectionEntry } from 'astro:content'

export type BlogPost = CollectionEntry<'blog'>
export type ColumnPost = CollectionEntry<'columns'>
export type AnyPost = BlogPost | ColumnPost
export type PostData = AnyPost['data']
