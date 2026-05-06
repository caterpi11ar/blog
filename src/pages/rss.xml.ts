import rss from '@astrojs/rss'
import { SITE } from '@config'
import { getPostHref } from '@utils/getAdjacentPosts'
import getSortedPosts from '@utils/getSortedPosts'
import { getCollection } from 'astro:content'

export async function GET() {
  const posts = await getCollection('blog')
  const columnPosts = await getCollection('columns')
  const sortedPosts = getSortedPosts([...posts, ...columnPosts])
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: sortedPosts.map(post => ({
      link: getPostHref(post).replace(/^\//, ''),
      title: post.data.title,
      description: post.data.description,
      pubDate: new Date(post.data.pubDatetime),
    })),
  })
}
