import type { CollectionEntry } from 'astro:content'
import type { SatoriOptions } from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import satori from 'satori'
import postOgImage from './og-templates/post'
import siteOgImage from './og-templates/site'

function toArrayBuffer(buffer: Buffer) {
  const arrayBuffer = new ArrayBuffer(buffer.byteLength)
  new Uint8Array(arrayBuffer).set(buffer)
  return arrayBuffer
}

async function loadFonts() {
  const fontRegular = toArrayBuffer(
    await readFile(
      path.join(process.cwd(), 'node_modules/katex/dist/fonts/KaTeX_Main-Regular.ttf'),
    ),
  )
  const fontBold = toArrayBuffer(
    await readFile(
      path.join(process.cwd(), 'node_modules/katex/dist/fonts/KaTeX_Main-Bold.ttf'),
    ),
  )

  return { fontRegular, fontBold }
}

const { fontRegular, fontBold } = await loadFonts()

const options: SatoriOptions = {
  width: 1200,
  height: 630,
  embedFont: true,
  fonts: [
    {
      name: 'KaTeX Main',
      data: fontRegular,
      weight: 400,
      style: 'normal',
    },
    {
      name: 'KaTeX Main',
      data: fontBold,
      weight: 600,
      style: 'normal',
    },
  ],
}

function svgBufferToPngBuffer(svg: string) {
  const resvg = new Resvg(svg)
  const pngData = resvg.render()
  return pngData.asPng()
}

export async function generateOgImageForPost(post: CollectionEntry<'blog'>) {
  const svg = await satori(postOgImage(post), options)
  return svgBufferToPngBuffer(svg)
}

export async function generateOgImageForSite() {
  const svg = await satori(siteOgImage(), options)
  return svgBufferToPngBuffer(svg)
}
