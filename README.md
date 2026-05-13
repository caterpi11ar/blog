# caterpi11ar blog

[![Website](https://img.shields.io/badge/website-caterpi11ar.com-0A66C2?style=flat-square)](https://caterpi11ar.com)
[![GitHub License](https://img.shields.io/github/license/caterpi11ar/blog?style=flat-square)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/caterpi11ar/blog?style=flat-square&logo=github)](https://github.com/caterpi11ar/blog/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/caterpi11ar/blog?style=flat-square&logo=github)](https://github.com/caterpi11ar/blog/forks)
[![GitHub Issues](https://img.shields.io/github/issues/caterpi11ar/blog?style=flat-square&logo=github)](https://github.com/caterpi11ar/blog/issues)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/caterpi11ar/blog/main?style=flat-square&logo=github)](https://github.com/caterpi11ar/blog/commits/main)
[![Astro](https://img.shields.io/badge/Astro-6-BC52EE?style=flat-square&logo=astro&logoColor=fff)](https://astro.build/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=000)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=fff)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-required-F69220?style=flat-square&logo=pnpm&logoColor=fff)](https://pnpm.io/)

个人技术博客，基于 [Astro](https://astro.build) 6、React 18 和 Tailwind CSS 4 构建。内容以中文 Markdown / MDX 为主，支持 Giscus 评论、客户端搜索、数学公式、自动目录、RSS、站点地图和 OG 图片生成。

## 特性

- Astro 静态站点生成，页面轻量、构建结果可直接部署
- Markdown / MDX 内容管理，普通文章位于 `src/content/blog/`
- 专栏文章独立位于 `src/content/columns/`，自动生成专栏列表页
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

普通文章放在 `src/content/blog/` 下，子目录按主题归类，例如：

```text
src/content/blog/
  ai/
  project/
  react/
  seo/
```

专栏文章放在 `src/content/columns/` 下，每个一级目录对应一个专栏：

```text
src/content/columns/
  threejs/
  webgl/
```

普通文章会出现在首页和 `/posts` 中。专栏目录会独立生成专栏列表页和文章详情：

- `src/content/columns/threejs/` 会生成 `/threejs`
- `src/content/columns/webgl/` 会生成 `/webgl`
- 专栏分页：`/{column}/2`、`/{column}/3` ...
- 专栏文章详情：`/{column}/{slug}`，例如 `/threejs/2-实战列表`
- 普通文章详情：`/posts/{slug}`
- 标签页、搜索和 RSS 会包含普通文章和专栏文章

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
- `/posts/{slug}`：普通文章详情
- `/{column}`：专栏列表，例如 `/threejs`
- `/{column}/{slug}`：专栏文章详情，例如 `/threejs/2-实战列表`
- `/{column}/{page}`：专栏分页，例如 `/threejs/2`
- `/tags`：标签列表
- `/tags/{tag}`：标签文章列表
- `/search`：客户端搜索
- `/rss.xml`：RSS feed
- `/og.png`、`/posts/{slug}/index.png`、`/{column}/{slug}/index.png`：OG 图片

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
