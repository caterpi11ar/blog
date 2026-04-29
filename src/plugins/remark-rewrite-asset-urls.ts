import type { Root } from 'mdast'
import { visit } from 'unist-util-visit'

export interface RewriteOptions {
  /** 本地 URL 前缀（即 public/ 下某个子目录对应的 URL），例如 '/assets/' */
  base: string
  /** 替换后的远端根 URL，例如 'https://caterpi11ar.tos-s3-cn-beijing.volces.com/blog/' */
  target: string
}

export default function remarkRewriteAssetUrls(options: RewriteOptions) {
  const { base, target } = options

  return (tree: Root) => {
    visit(tree, 'image', (node) => {
      if (node.url.startsWith(base)) {
        node.url = target + node.url.slice(base.length)
      }
    })
  }
}
