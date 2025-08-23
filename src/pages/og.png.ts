import type { APIRoute } from 'astro'
import { generateOgImageForSite } from '@utils/generateOgImages'

export const GET: APIRoute = async () =>
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-ignore
  new Response(await generateOgImageForSite(), {
    headers: { 'Content-Type': 'image/png' },
  })
