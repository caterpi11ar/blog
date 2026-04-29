import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import rehypeMathjax from 'rehype-mathjax'
import remarkCollapse from 'remark-collapse'
import remarkMath from 'remark-math'
import remarkToc from 'remark-toc'
import { SITE } from './src/config'
import remarkRewriteAssetUrls from './src/plugins/remark-rewrite-asset-urls'

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    mdx(),
    react(),
    sitemap(),
  ],
  markdown: {
    rehypePlugins: [rehypeMathjax],
    remarkPlugins: [
      [
        remarkRewriteAssetUrls,
        {
          base: '/assets/threejs/',
          target: 'https://caterpi11ar.tos-s3-cn-beijing.volces.com/blog/threejs/',
        },
      ],
      remarkToc,
      remarkMath,
      [
        remarkCollapse,
        {
          test: 'Table of contents',
        },
      ],
    ],
    shikiConfig: {
      theme: 'one-dark-pro',
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['@resvg/resvg-js'],
    },
  },
})
