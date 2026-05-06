import type { AnyPost } from './postTypes'
import { slugifyAll } from './slugify'

function getPostsByTag<TPost extends AnyPost>(posts: TPost[], tag: string) {
  return posts.filter(post => slugifyAll(post.data.tags).includes(tag))
}

export default getPostsByTag
