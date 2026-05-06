import type { AnyPost } from './postTypes'
import { slugifyStr } from './slugify'

function getUniqueTags<TPost extends AnyPost>(posts: TPost[]) {
  const filteredPosts = posts.filter(({ data }) => !data.draft)
  const tags: string[] = filteredPosts
    .flatMap(post => post.data.tags)
    .map(tag => slugifyStr(tag))
    .filter(
      (value: string, index: number, self: string[]) =>
        self.indexOf(value) === index,
    )
    .sort((tagA: string, tagB: string) => tagA.localeCompare(tagB))
  return tags
}

export default getUniqueTags
