import type { AnyPost, ColumnPost } from './postTypes'
import { getColumnSlug } from '@utils/columns'
import slugify from '@utils/slugify'

export interface AdjacentPosts {
  prevPost?: AnyPost
  nextPost?: AnyPost
}

function getPostKey(post: AnyPost) {
  return `${post.collection}/${post.id}`
}

function getPostDirectory(post: AnyPost) {
  const index = post.id.lastIndexOf('/')
  const directory = index === -1 ? '' : post.id.slice(0, index)

  return `${post.collection}/${directory}`
}

function getBasename(value: string) {
  const normalized = value.replace(/\\/g, '/')
  const filename = normalized.slice(normalized.lastIndexOf('/') + 1)

  return filename.replace(/\.(mdx?|astro)$/i, '')
}

function getNumericPrefix(post: AnyPost) {
  const filePrefix = getBasename(post.filePath ?? post.id).match(/^(\d+)(?:\.|\s|$)/)
  if (filePrefix) {
    return Number(filePrefix[1])
  }

  const titlePrefix = post.data.title.match(/^(\d+)(?:\.|\s|$)/)
  return titlePrefix ? Number(titlePrefix[1]) : undefined
}

function compareByDateAndTitle(a: AnyPost, b: AnyPost) {
  const dateA = new Date(a.data.pubDatetime).getTime()
  const dateB = new Date(b.data.pubDatetime).getTime()

  if (dateA !== dateB) {
    return dateA - dateB
  }

  return a.data.title.localeCompare(b.data.title, 'zh-CN')
}

function comparePostsInSeries(a: AnyPost, b: AnyPost) {
  const numberA = getNumericPrefix(a)
  const numberB = getNumericPrefix(b)

  if (numberA !== undefined && numberB !== undefined && numberA !== numberB) {
    return numberA - numberB
  }

  if (numberA !== undefined && numberB === undefined) {
    return -1
  }

  if (numberA === undefined && numberB !== undefined) {
    return 1
  }

  return compareByDateAndTitle(a, b)
}

export function getAdjacentPosts(posts: AnyPost[]) {
  const groups = new Map<string, AnyPost[]>()

  posts.forEach((post) => {
    const directory = getPostDirectory(post)
    const group = groups.get(directory) ?? []

    group.push(post)
    groups.set(directory, group)
  })

  const adjacentPosts = new Map<string, AdjacentPosts>()

  groups.forEach((group) => {
    const sortedGroup = [...group].sort(comparePostsInSeries)

    sortedGroup.forEach((post, index) => {
      adjacentPosts.set(getPostKey(post), {
        prevPost: sortedGroup[index - 1],
        nextPost: sortedGroup[index + 1],
      })
    })
  })

  return adjacentPosts
}

export function getAdjacentPost(post: AnyPost, adjacentPosts: Map<string, AdjacentPosts>) {
  return adjacentPosts.get(getPostKey(post))
}

export function getPostHref(post: AnyPost) {
  if (post.collection === 'columns') {
    return `/${getColumnSlug(post as ColumnPost)}/${slugify(post.data)}`
  }
  return `/posts/${slugify(post.data)}`
}
