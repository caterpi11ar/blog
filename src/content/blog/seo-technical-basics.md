---
title: 技术 SEO 基础：robots.txt、meta 信息与 llms.txt
author: caterpi11ar
pubDatetime: 2026-02-24T16:00:00
featured: false
draft: false
tags:
  - SEO
  - 技术SEO
  - 出海
description: 一篇关于技术 SEO 基础设施的实践指南——robots.txt、sitemap、meta 标签、结构化数据，以及面向 AI 爬虫的 llms.txt。
---

做 SEO 有两个层次：内容层（写什么、怎么写）和技术层（让搜索引擎/AI 能正确读懂你的内容）。技术层不是加分项，而是地基——地基打不好，内容再好也白搭。

这篇文章梳理技术 SEO 的核心文件和标签，重点覆盖 `robots.txt`、`sitemap.xml`、meta 标签，以及近两年新出现的 `llms.txt`。

---

## robots.txt

`robots.txt` 放在网站根目录（`https://yoursite.com/robots.txt`），告诉爬虫哪些路径可以访问、哪些不行。

### 基本语法

```
User-agent: *
Disallow: /admin/
Disallow: /private/
Allow: /

Sitemap: https://yoursite.com/sitemap.xml
```

- `User-agent: *` 表示对所有爬虫生效
- `Disallow` 优先级高于 `Allow`
- 文件末尾附上 `Sitemap` 路径是标准做法

### 针对 AI 爬虫

传统 `robots.txt` 配置往往只考虑 Googlebot，但 2023 年之后出现了一批 AI 爬虫。如果你希望内容进入 AI 的知识库或检索池，需要明确允许它们：

```
# 传统搜索引擎
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# AI 爬虫
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: https://yoursite.com/sitemap.xml
```

反过来，如果你**不希望**内容被用于 AI 训练，可以把 `Allow` 改成 `Disallow`。但需要注意：`robots.txt` 只是一个"君子协定"，爬虫可以选择不遵守，对恶意爬虫没有强制效力。

### 常见错误

- `Disallow: /` 禁止所有爬虫——整站从搜索结果消失，但很多人在开发阶段设置了这个，上线后忘记改
- 过度封锁：把 `/api/` 之类的路径 Disallow 掉通常没问题，但不要把包含重要内容的路径也封掉
- 语法错误：每条规则之间要有空行，`User-agent` 和 `Disallow/Allow` 之间不能有多余字符

用 [Google Search Console](https://search.google.com/search-console) 里的"robots.txt 测试器"可以快速验证配置是否正确。

---

## sitemap.xml

`sitemap.xml` 是一个索引文件，列出你希望搜索引擎抓取的所有 URL。它不是强制要求，但能加速新内容被发现，尤其是对于内链结构薄弱或者新站点。

### 基本格式

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yoursite.com/</loc>
    <lastmod>2026-02-24</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yoursite.com/blog/post-1/</loc>
    <lastmod>2026-02-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

- `changefreq` 和 `priority` 是提示性字段，Google 不一定遵守
- 真正有用的是 `lastmod`，帮助爬虫判断内容是否更新过
- 把 sitemap 地址写进 `robots.txt` 的 `Sitemap` 字段，并在 Google Search Console 里手动提交

### 大型站点

如果页面超过 50,000 条，需要用 sitemap index 文件把多个子 sitemap 组织起来：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://yoursite.com/sitemap-posts.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://yoursite.com/sitemap-pages.xml</loc>
  </sitemap>
</sitemapindex>
```

现代框架（Next.js、Astro、Nuxt）通常有插件或内置方案自动生成 sitemap，不需要手写。

---

## Meta 标签

meta 标签写在 HTML 的 `<head>` 里，是搜索引擎和社交平台理解页面内容的主要信号。

### title 和 meta description

```html
<title>技术 SEO 基础：robots.txt、meta 标签与 llms.txt | 博客名</title>
<meta name="description" content="一篇关于技术 SEO 基础设施的实践指南，覆盖 robots.txt、sitemap、meta 标签和 llms.txt。">
```

| 字段 | 建议长度 | 说明 |
|------|---------|------|
| title | 50–60 字符 | 超出部分在搜索结果中会被截断；每个页面唯一，包含核心关键词 |
| meta description | 150–160 字符 | 不直接影响排名，但影响搜索结果的点击率（CTR） |

注意：Google 有时会忽略你写的 meta description，自动从页面内容中提取它认为更相关的摘要。所以内容本身的质量比 meta description 更重要。

### Open Graph 标签

Open Graph 协议由 Facebook 制定，控制内容在社交平台分享时的展示形式——标题、描述、缩略图。Twitter/X 有自己的 Twitter Card 格式，但大部分内容和 OG 重叠。

```html
<!-- Open Graph -->
<meta property="og:title" content="技术 SEO 基础：robots.txt、meta 标签与 llms.txt">
<meta property="og:description" content="一篇关于技术 SEO 基础设施的实践指南。">
<meta property="og:image" content="https://yoursite.com/og-image.png">
<meta property="og:url" content="https://yoursite.com/blog/seo-technical-basics/">
<meta property="og:type" content="article">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="技术 SEO 基础：robots.txt、meta 标签与 llms.txt">
<meta name="twitter:description" content="一篇关于技术 SEO 基础设施的实践指南。">
<meta name="twitter:image" content="https://yoursite.com/og-image.png">
```

OG 图片推荐尺寸：1200×630px。用 [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) 或 [Twitter Card Validator](https://cards-dev.twitter.com/validator) 验证效果。

### canonical 标签

canonical 标签告诉搜索引擎，某个页面的"权威版本"是哪个 URL。主要用于处理重复内容问题：

```html
<link rel="canonical" href="https://yoursite.com/blog/seo-technical-basics/">
```

常见场景：
- 分页内容（`/page/1`、`/page/2` 都指向第一页的 canonical）
- URL 参数（`?sort=date`、`?ref=twitter` 产生的重复页面）
- HTTP 和 HTTPS 版本共存
- 跨站内容分发（把原创来源指定为 canonical）

### robots meta 标签

`robots.txt` 控制的是"能不能爬取"，而 `<meta name="robots">` 控制的是"能不能索引和跟踪链接"：

```html
<!-- 允许索引和跟踪链接（默认行为，不需要显式写） -->
<meta name="robots" content="index, follow">

<!-- 不索引这个页面，但跟踪页面上的链接 -->
<meta name="robots" content="noindex, follow">

<!-- 索引但不在搜索结果中显示摘要 -->
<meta name="robots" content="index, nosnippet">
```

`noindex` 常用于：登录页、感谢页、测试页、筛选条件产生的重复内容页。

---

## 结构化数据（JSON-LD）

结构化数据帮助搜索引擎理解页面内容的语义，并可能在搜索结果中触发富媒体展示（Rich Results）——比如文章的发布日期、评分星级、FAQ 展开列表等。

推荐使用 JSON-LD 格式，写在 `<script>` 标签里：

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "技术 SEO 基础：robots.txt、meta 标签与 llms.txt",
  "datePublished": "2026-02-24",
  "dateModified": "2026-02-24",
  "author": {
    "@type": "Person",
    "name": "caterpi11ar"
  },
  "description": "一篇关于技术 SEO 基础设施的实践指南。"
}
</script>
```

常用的 Schema 类型：
- `Article` / `BlogPosting`：文章
- `Product`：产品
- `FAQPage`：FAQ
- `BreadcrumbList`：面包屑导航
- `Organization`：组织信息

用 [Google Rich Results Test](https://search.google.com/test/rich-results) 验证结构化数据是否有效。

---

## llms.txt

`llms.txt` 是 2024 年提出的一个新标准，放在网站根目录（`/llms.txt`），用 Markdown 格式告诉 AI 语言模型你的网站有哪些重要内容、值得优先读取。

定位类似 `robots.txt`，但服务的对象是 LLM，而不是传统搜索爬虫。

### 产生背景

AI 爬虫的上下文窗口有限，无法处理一个网站的全部内容。同时，现代网站充斥着导航、广告、Cookie 声明等噪音，AI 很难从中提取真正有价值的信息。`llms.txt` 提供了一个精简的索引，引导 AI 直接找到核心内容。

### 文件格式

```markdown
# 网站名称

> 一句话描述这个网站是做什么的。

## 文档

- [快速上手](https://yoursite.com/docs/quickstart): 5 分钟内完成基础配置
- [API 参考](https://yoursite.com/docs/api): 完整的接口文档
- [常见问题](https://yoursite.com/docs/faq): 高频问题解答

## 博客

- [技术 SEO 基础](https://yoursite.com/blog/seo-technical-basics): robots.txt、meta 标签与 llms.txt 的完整指南
- [SPA 迁移 Next.js](https://yoursite.com/blog/spa-to-next): 出海应用解决 SEO 问题的路径

## 产品

- [功能介绍](https://yoursite.com/features): 主要功能一览
- [定价](https://yoursite.com/pricing): 套餐方案

## 可选链接

> 以下内容不影响核心理解，但提供额外背景。

- [关于我们](https://yoursite.com/about)
- [更新日志](https://yoursite.com/changelog)
```

格式说明：
- 顶部用 `#` 写网站名，用 `>` 写简介
- 用 `##` 分组内容，每组下面是带描述的链接列表 `[标题](URL): 描述`
- 结尾可以有一个 `## 可选链接` 区块，放次要内容

### 现实情况

截至 2025 年中，已发布 `llms.txt` 的网站约 950 个，主要是开发者工具和技术文档类网站（Hugging Face、Vercel、Zapier 等）。OpenAI、Google、Anthropic 尚未正式确认会使用这个文件来指导爬虫行为。

所以 `llms.txt` 目前是**低成本、低风险的探索性投入**——创建一个文件，几乎没有维护成本，如果标准普及则提前占位，如果不普及也没有损失。

对于博客和内容类网站，更务实的做法是先把内容本身的结构做好（清晰的标题层级、直接的开头段落、准确的描述），而不是依赖 `llms.txt` 来"补救"结构混乱的内容。

---

## 一个检查清单

做完技术 SEO 配置后，可以按这个列表快速验证：

**robots.txt**
- [ ] 文件存在且可访问（`/robots.txt`）
- [ ] 开发/测试环境的 `Disallow: /` 在生产环境已移除
- [ ] 包含主流 AI 爬虫的允许规则（如果希望内容进入 AI 知识库）
- [ ] `Sitemap` 字段指向正确的 sitemap 地址

**sitemap.xml**
- [ ] 文件存在且包含全部重要页面
- [ ] 已在 Google Search Console 提交
- [ ] `lastmod` 字段与实际更新时间一致

**Meta 标签**
- [ ] 每个页面有唯一的 `<title>`，50–60 字符
- [ ] 每个页面有 `meta description`，150–160 字符
- [ ] OG 标签完整（og:title、og:description、og:image、og:url）
- [ ] OG 图片尺寸 1200×630px
- [ ] canonical 标签指向正确的权威 URL

**结构化数据**
- [ ] 文章页有 `BlogPosting` Schema
- [ ] 用 Rich Results Test 验证无错误

**llms.txt（可选）**
- [ ] 文件存在于根目录（`/llms.txt`）
- [ ] 包含关键内容的分组链接和描述

---

## 工具汇总

| 工具 | 用途 |
|------|------|
| [Google Search Console](https://search.google.com/search-console) | 索引状态、robots.txt 测试、sitemap 提交 |
| [Rich Results Test](https://search.google.com/test/rich-results) | 验证结构化数据 |
| [PageSpeed Insights](https://pagespeed.web.dev/) | Core Web Vitals |
| [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) | 验证 OG 标签 |
| [Screaming Frog](https://www.screamingfrog.co.uk/seo-spider/) | 全站爬取，批量检查 meta 标签和链接 |
| [Schema.org](https://schema.org/) | 结构化数据类型参考 |
