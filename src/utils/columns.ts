import type { ColumnPost } from './postTypes'

export interface Column {
  slug: string
  title: string
}

export function getColumnSlug(post: ColumnPost) {
  return post.id.split('/')[0] ?? post.id
}

function getBasename(value: string) {
  const normalized = value.replace(/\\/g, '/')
  const filename = normalized.slice(normalized.lastIndexOf('/') + 1)

  return filename.replace(/\.(mdx?|astro)$/i, '')
}

function getNumericPrefix(post: ColumnPost) {
  const filePrefix = getBasename(post.filePath ?? post.id).match(/^(\d+)(?:\.|\s|$)/)
  if (filePrefix) {
    return Number(filePrefix[1])
  }

  const titlePrefix = post.data.title.match(/^(\d+)(?:\.|\s|$)/)
  return titlePrefix ? Number(titlePrefix[1]) : undefined
}

function compareByDateAndTitle(a: ColumnPost, b: ColumnPost) {
  const dateA = new Date(a.data.pubDatetime).getTime()
  const dateB = new Date(b.data.pubDatetime).getTime()

  if (dateA !== dateB) {
    return dateA - dateB
  }

  return a.data.title.localeCompare(b.data.title, 'zh-CN')
}

function comparePostsInColumn(a: ColumnPost, b: ColumnPost) {
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

export function getColumns(posts: ColumnPost[]) {
  const columns = new Map<string, Column>()

  posts.forEach((post) => {
    if (post.data.draft) {
      return
    }

    const slug = getColumnSlug(post)

    if (!columns.has(slug)) {
      columns.set(slug, { slug, title: slug })
    }
  })

  return [...columns.values()].sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))
}

export function getColumnPosts(posts: ColumnPost[], slug: string) {
  return posts
    .filter(post => getColumnSlug(post) === slug && !post.data.draft)
    .sort(comparePostsInColumn)
}
