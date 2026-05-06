import type { AnyPost } from '@utils/postTypes'
import type { APIRoute } from 'astro'
import { generateOgImageForPost } from '@utils/generateOgImages'
import { slugifyStr } from '@utils/slugify'
import { getCollection } from 'astro:content'

export async function getStaticPaths() {
  const posts = await getCollection('blog').then(p =>
    p.filter(({ data }) => !data.draft && !data.ogImage),
  )

  return posts.map(post => ({
    params: { slug: slugifyStr(post.data.title) },
    props: post,
  }))
}

export const GET: APIRoute = async ({ props }) =>
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-ignore
  new Response(await generateOgImageForPost(props as AnyPost), {
    headers: { 'Content-Type': 'image/png' },
  })
