# blog

caterpi11ar 的个人技术博客，基于 [Astro](https://astro.build) 6、React 18 和 Tailwind CSS 4 构建。内容以中文 Markdown / MDX 为主，支持 Giscus 评论、客户端搜索、数学公式、自动目录、RSS、站点地图和 OG 图片生成。

## 特性

- Astro 静态站点生成，页面轻量、构建结果可直接部署
- Markdown / MDX 内容管理，文章位于 `src/content/blog/`
- 独立 Three.js 专栏，普通首页和 `/posts` 列表不会展示 Three.js 文章
- `/assets/threejs/...` 图片在构建时改写到火山引擎 TOS CDN
- Fuse.js 客户端搜索
- Giscus GitHub Discussions 评论
- MathJax 渲染 LaTeX 数学公式
- `remark-toc` 自动目录和 `remark-collapse` 折叠目录
- Satori + resvg-js 生成文章 OG 图片
- RSS、sitemap、robots.txt
- 深色 / 浅色主题切换

## 技术栈

- Astro 6
- React 18
- Tailwind CSS 4
- TypeScript
- MDX / Markdown
- Fuse.js
- Giscus
- MathJax
- Satori / resvg-js

## 开发

本项目使用 pnpm。

```bash
pnpm install
pnpm dev
```

常用命令：

```bash
pnpm dev        # 启动本地开发服务器
pnpm build      # 生产构建
pnpm preview    # 预览生产构建结果
pnpm sync       # 重新生成 Astro content 类型
pnpm typecheck  # TypeScript 检查
pnpm lint:fix   # ESLint 自动修复
pnpm cz         # Commitizen 提交
```

## 内容结构

文章放在 `src/content/blog/` 下，子目录按主题归类，例如：

```text
src/content/blog/
  ai/
  project/
  react/
  seo/
  threejs/
```

普通文章会出现在首页、`/posts` 和标签页中。`src/content/blog/threejs/` 下的文章属于独立 Three.js 专栏：

- 专栏入口：`/threejs`
- 专栏分页：`/threejs/2`、`/threejs/3` ...
- 文章详情仍使用 `/posts/{slug}` 路径
- 首页和普通 `/posts` 列表会通过 `src/utils/postFilters.ts` 排除 Three.js 文章

文章 frontmatter 由 `src/content.config.ts` 校验，常用字段包括：

```yaml
title: "文章标题"
description: "文章摘要"
pubDatetime: 2026-05-02
modDatetime: 2026-05-02
tags: ["Astro"]
featured: false
draft: false
ogImage: ./cover.png
```

修改 content schema 或新增需要类型同步的内容后，运行：

```bash
pnpm sync
```

## Three.js 图片

Three.js 文章中的图片路径写成：

```md
![example](/assets/threejs/example.png)
```

构建时 `src/plugins/remark-rewrite-asset-urls.ts` 会把 `/assets/threejs/...` 改写为配置中的 TOS CDN 地址。图片二进制文件不提交到仓库，需要上传到 TOS 的 `blog/threejs/` 前缀。

CDN 配置在 `astro.config.ts`：

```ts
remarkRewriteAssetUrls({
  rules: [
    {
      base: '/assets/threejs/',
      target: 'https://caterpi11ar.tos-s3-cn-beijing.volces.com/blog/threejs/',
    },
  ],
})
```

## 页面与路由

- `/`：首页，展示 featured 和最近普通文章
- `/posts`：普通文章列表
- `/posts/{slug}`：文章详情
- `/threejs`：Three.js 专栏列表
- `/tags`：标签列表
- `/tags/{tag}`：标签文章列表
- `/search`：客户端搜索
- `/rss.xml`：RSS feed
- `/og.png`、`/posts/{slug}/index.png`：OG 图片

## Giscus 评论配置

评论依赖以下环境变量：

```env
PUBLIC_GISCUS_REPO=owner/repo
PUBLIC_GISCUS_REPO_ID=repo-id
PUBLIC_GISCUS_CATEGORY_ID=category-id
```

配置步骤：

1. 在 GitHub 仓库开启 Discussions
2. 在 [Giscus](https://giscus.app) 选择仓库和分类
3. 将生成的 repo、repo id、category id 写入 `.env`

评论组件在 `src/components/Giscus.tsx`，文章详情页在 `src/layouts/PostDetails.astro` 中加载。

## 构建与检查

提交前建议至少运行：

```bash
pnpm typecheck
pnpm build
```

pre-commit hook 会运行 `pnpm typecheck` 和 lint-staged。项目的 `preinstall` 会限制只能使用 pnpm。

## 许可证

MIT
