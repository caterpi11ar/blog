import type { ColumnPost } from '@utils/postTypes'
import type { APIRoute } from 'astro'
import { getColumnSlug, getColumns } from '@utils/columns'
import { generateOgImageForPost } from '@utils/generateOgImages'
import { slugifyStr } from '@utils/slugify'
import { getCollection } from 'astro:content'

export async function getStaticPaths() {
  const allColumnPosts = await getCollection('columns')
  const publishable = allColumnPosts.filter(
    ({ data }) => !data.draft && !data.ogImage,
  )
  const columnSlugs = new Set(getColumns(allColumnPosts).map(c => c.slug))

  return publishable
    .filter(post => columnSlugs.has(getColumnSlug(post)))
    .map(post => ({
      params: {
        column: getColumnSlug(post),
        slug: slugifyStr(post.data.title),
      },
      props: post,
    }))
}

export const GET: APIRoute = async ({ props }) =>
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-ignore
  new Response(await generateOgImageForPost(props as ColumnPost), {
    headers: { 'Content-Type': 'image/png' },
  })
