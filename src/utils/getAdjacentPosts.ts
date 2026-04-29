import type { CollectionEntry } from 'astro:content'
import slugify from '@utils/slugify'

type BlogPost = CollectionEntry<'blog'>

export interface AdjacentPosts {
  prevPost?: BlogPost
  nextPost?: BlogPost
}

function getPostDirectory(post: BlogPost) {
  const index = post.id.lastIndexOf('/')
  return index === -1 ? '' : post.id.slice(0, index)
}

function getBasename(value: string) {
  const normalized = value.replace(/\\/g, '/')
  const filename = normalized.slice(normalized.lastIndexOf('/') + 1)

  return filename.replace(/\.(mdx?|astro)$/i, '')
}

function getNumericPrefix(post: BlogPost) {
  const filePrefix = getBasename(post.filePath ?? post.id).match(/^(\d+)(?:\.|\s|$)/)
  if (filePrefix) {
    return Number(filePrefix[1])
  }

  const titlePrefix = post.data.title.match(/^(\d+)(?:\.|\s|$)/)
  return titlePrefix ? Number(titlePrefix[1]) : undefined
}

function compareByDateAndTitle(a: BlogPost, b: BlogPost) {
  const dateA = new Date(a.data.pubDatetime).getTime()
  const dateB = new Date(b.data.pubDatetime).getTime()

  if (dateA !== dateB) {
    return dateA - dateB
  }

  return a.data.title.localeCompare(b.data.title, 'zh-CN')
}

function comparePostsInSeries(a: BlogPost, b: BlogPost) {
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

export function getAdjacentPosts(posts: BlogPost[]) {
  const groups = new Map<string, BlogPost[]>()

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
      adjacentPosts.set(post.id, {
        prevPost: sortedGroup[index - 1],
        nextPost: sortedGroup[index + 1],
      })
    })
  })

  return adjacentPosts
}

export function getPostHref(post: BlogPost) {
  return `/posts/${slugify(post.data)}`
}
