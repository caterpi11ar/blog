---
title: SEO/AEO/GEO 优化
author: caterpi11ar
pubDatetime: 2026-02-24T14:00:00
featured: false
draft: false
tags:
  - SEO
  - AEO
  - GEO
  - 出海
description: SEO、AEO（Answer Engine Optimization）与 GEO（Generative Engine Optimization）的区别与实践。
---

## 用 skills.sh 做 SEO Audit 的经历

一直知道 SEO 重要，但自己做 audit 总是无从下手——不知道该查哪些维度，查了也不知道优先级。偶然发现 [skills.sh](https://skills.sh) 上有一个专门的 SEO audit skill，安装后直接在 Claude Code 里调用，体验比想象中好很多。

安装命令：

```bash
npx skills add https://github.com/coreyhaines31/marketingskills --skill seo-audit
```

### Skill 做了什么

这个 skill 的核心是把一次完整的 SEO 审查结构化成几个固定维度，避免凭感觉乱查。调用时它会先问几个前置问题：

- 网站类型和业务目标是什么
- 当前自然流量表现如何、近期有没有明显变化
- 这次是全站 audit 还是针对某几个页面

这个"先收集上下文"的步骤很关键，不同类型的网站优化重点差异很大。

### 覆盖的检查维度

**技术 SEO**

- `robots.txt` 和 XML sitemap 是否正确配置
- 站点架构的可爬取性
- 索引状态（哪些页面被收录、哪些没有，可在 [Google Search Console](https://search.google.com/search-console) 查看）
- Canonical 标签是否规范
- [Core Web Vitals](https://pagespeed.web.dev/) 性能指标
- 移动端适配
- HTTPS
- URL 结构是否干净

**页面层面**

- Title tag：50–60 字符，包含核心关键词
- Meta description：150–160 字符
- 标题层级：每页只有一个 H1
- 内容深度和关键词分布
- 图片 alt 文字
- 内链结构
- 关键词定向是否一致

**内容质量（E-E-A-T）**

这部分是 Google 近年来越来越看重的信号（参考 [Google 搜索质量评估指南](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)），skill 把它拆成四个维度：

- **Experience（经验）**：内容中有没有原创观点和第一手经历
- **Expertise（专业度）**：作者背景和资质是否可信
- **Authoritativeness（权威性）**：有没有外链和行业认可
- **Trustworthiness（可信度）**：网站透明度和安全性

### 一个有意思的局限性

Skill 里有一条特别直诚的说明：

> `web_fetch` 和 `curl` 无法可靠检测结构化数据 / Schema Markup，因为客户端 JavaScript 注入的内容抓不到。建议用 [Google Rich Results Test](https://search.google.com/test/rich-results) 或浏览器开发工具补充检查。

这个限制提醒了我：AI 辅助工具不是万能的，它擅长覆盖宽度，但涉及到需要真实浏览器渲染的内容（比如动态注入的 JSON-LD），还是得靠专门工具。

### 跑完之后的收获

跑完这个 skill，最大的感受是：SEO 问题往往不是缺少某一个"大招"，而是一堆小细节没做到位的累积。title tag 写得不够精确、内链分布不均、图片没有 alt——每一项单独看都影响不大，但加在一起就是 Google 看到的那个"不值得排在前面"的信号。

结构化审查的好处是强迫自己逐项过一遍，而不是凭直觉觉得"应该没问题"。

---

## 用 ai-seo skill 理解 AEO 和 GEO

跑完传统 SEO audit 后，我又接入了另一个 skill：

```bash
npx skills add https://github.com/coreyhaines31/marketingskills --skill ai-seo
```

这个 skill 的出发点完全不同——传统 SEO 的目标是让 Google 把你排在前面，而 AEO / GEO 的目标是让 AI 系统（ChatGPT、Perplexity、Claude、Gemini、Google AI Overviews）在回答问题时**引用你**。

一个让我印象深刻的数据：AI Overviews 现在出现在约 **45% 的 Google 搜索结果**中。如果你的内容没有为 AI 引用做优化，流量损失可能远比想象的大。

### AEO vs GEO：有什么区别

- **AEO（Answer Engine Optimization）**：针对问答型搜索引擎（如 Perplexity），让内容成为直接答案的来源
- **GEO（Generative Engine Optimization）**：针对生成式 AI（如 ChatGPT、Gemini），让内容在生成回答时被引用

两者的优化逻辑高度重叠，skill 把核心拆成三个支柱：

### 三个优化支柱

**1. 结构（可提取性）**

AI 提取信息时偏好结构清晰的内容：

- 开头直接给出答案，不要绕弯子
- 关键段落控制在 40–60 词以内
- H2/H3 标题直接对应用户的提问语言
- 对比类内容优先用表格，而不是散文

**2. 权威性（可引用性）**

根据普林斯顿 GEO 研究（KDD 2024），以下内容能显著提升 AI 引用率：

| 手段 | 引用率提升 |
|------|-----------|
| 添加数据来源引用 | +40% |
| 包含具体统计数字 | +37% |
| 引用专家观点 | +30% |
| 关键词堆砌 | **-10%**（反效果） |

**3. 存在感（可发现性）**

AI 训练数据和检索来源中，第三方平台的权重远高于品牌自己的域名——数据显示品牌通过第三方被引用的概率是自有域名的 **6.5 倍**。值得布局的平台：

- Wikipedia（占 ChatGPT 引用来源约 7.8%）
- Reddit 讨论帖
- G2、Capterra、TrustRadius 等评测平台
- YouTube 和 Quora

### 最容易被引用的内容类型

| 类型 | 引用占比 |
|------|---------|
| 对比类文章 | ~33% |
| 权威指南（Definitive Guide） | ~15% |
| 原创研究 | ~12% |
| 产品页面 | ~10% |

### 一个容易忽略的技术细节

在 `robots.txt` 中需要明确允许 AI 爬虫访问，否则内容根本进不了 AI 的检索池：

```
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bingbot
Allow: /
```

很多站点的 `robots.txt` 是早年配置的，没有考虑这些新爬虫，值得专门检查一遍。

### 和传统 SEO 的本质差异

传统 SEO 是在**争排名**，核心是让自己比竞争对手排得靠前。AEO/GEO 是在**争引用**，核心是让 AI 认为你的内容值得作为答案的来源。

前者的竞争是零和的（第一名只有一个），后者的竞争相对宽松——AI 回答一个问题可以同时引用多个来源，结构清晰、数据可靠的内容都有机会出现在引用列表里。

---

## 容易被忽略的曝光渠道

做完技术层面的优化，很多人就停在这里了。但对于出海产品来说，有几个渠道的曝光价值很高，且往往被低估。

### Product Hunt

[Product Hunt](https://www.producthunt.com/) 是出海产品的标配发布平台，但发布质量参差不齐。容易忽略的细节：

**面向用户的文案**

- Tagline 只有一行，要直接说"你能做什么"，而不是技术实现。`Turn your photos into AI portraits` 比 `AI-powered image generation platform` 有效得多
- Description 的第一段决定大多数人要不要继续读，用场景开头比用功能列表开头转化更好
- Gallery 图片顺序有讲究：第一张是"结果"，而不是界面截图——用户看到自己能得到什么，才会往下翻

**面向社区的互动**

- 发布时间选太平洋时间凌晨 12:01，与其他产品同场竞争一整天
- Hunter 和 Maker 都填完整，有个人主页和历史记录的账号权重更高
- 发布当天主动在评论区回复每一条提问，算法会给活跃帖更多曝光

**SEO 价值**

Product Hunt 的产品页面在 Google 有不错的排名权重。产品名、描述、标签都会被索引——这意味着即便发布期已过，一个写得好的 PH 页面仍然持续为你带来长尾搜索流量。

---

### GitHub README

如果你的产品是开发者工具或者有开源仓库，README 是最容易被忽视的 SEO 和转化页面。

**面向开发者**

```markdown
# 工具名

一句话说清楚它解决什么问题。

## Installation

\`\`\`bash
npm install your-tool
\`\`\`

## Quick Start

最简单的可运行示例，复制即用。
```

开发者的耐心极短，看不到 5 秒内能运行的示例就会离开。`Installation` + `Quick Start` 放在 README 最前面，不要让人翻过一大段介绍才找到怎么用。

**面向普通用户**

如果工具面向非技术用户，README 同样是流量入口：

- 放演示 GIF 或截图——GitHub 原生支持，加载快
- 加 badges：构建状态、版本号、License、下载量——建立基础可信度
- 写清楚"这不是什么"，帮用户快速判断是否适合自己

**SEO 角度**

GitHub README 的内容会被 Google 索引，且 GitHub 域名权重极高。仓库名、描述（About 字段）、README 的 H1/H2 标题都是关键词布局的机会。很多人在仓库 About 里只写了两个字，是明显的浪费。

---

### 国际化：容易踩的坑

出海产品做国际化，不只是翻译文字这么简单。

**i18n 的 SEO 影响**

- 多语言页面要用 `hreflang` 标签告诉 Google 每个语言版本对应哪个地区，否则不同语言版本会互相竞争排名
- URL 结构选择：`/en/`、`/zh/` 子目录比子域名（`en.yoursite.com`）更容易维护，SEO 权重也更集中
- 不要用机器翻译直接上线——Google 能识别低质量翻译，会降低整站权重

**内容本地化 vs 文字翻译**

关键词在不同语言里的搜索习惯完全不同。"project management tool" 在英文里搜索量很高，但日文用户可能搜的是完全不同的词。每个目标市场建议单独做关键词调研，而不是直接翻译中文关键词。

**时区、货币、日期格式**

这类细节影响信任感，进而影响转化：

- 价格页面显示本地货币（或至少显示 USD + 汇率）
- 日期格式：美国是 MM/DD/YYYY，欧洲是 DD/MM/YYYY，日本是 YYYY年MM月DD日
- 客服时间用用户时区显示

**法律合规**

- GDPR（欧盟）：需要 Cookie banner、隐私政策、数据删除机制
- CCPA（加州）：类似 GDPR 但不完全一样
- 这些页面不仅是法律要求，也是 Google E-E-A-T 中"Trustworthiness"的评分项

---

## Roadmap

以下是我计划逐步落地的优化清单，按优先级排序：

### 阶段一：基础补全（当前）

- [x] 接入 Google Search Console，确认索引状态
- [x] 检查 `robots.txt`，允许主流 AI 爬虫
- [ ] 修复 Core Web Vitals 中的 LCP 和 CLS 问题
- [ ] 补全所有页面的 meta description
- [ ] 为图片添加 alt 文字

### 阶段二：内容结构优化

- [ ] 改写高流量页面的 title tag，控制在 50–60 字符
- [ ] 在关键文章开头增加"直接答案段"（40–60 词），提升 AI 引用率
- [ ] 对比类内容改为表格形式
- [ ] 梳理内链结构，确保重要页面有足够的内部链接指向

### 阶段三：第三方存在感

- [ ] 在 Product Hunt 发布，优化 Tagline 和 Gallery
- [ ] 更新 GitHub README：加 Quick Start、演示 GIF、About 关键词
- [ ] 在 Reddit 相关 subreddit 发布使用案例
- [ ] 注册并完善 G2 / Capterra 产品页面

### 阶段四：国际化

- [ ] 为多语言页面添加 `hreflang` 标签
- [ ] 针对英文市场单独做关键词调研（不直接翻译中文关键词）
- [ ] 补全隐私政策、Cookie 声明（GDPR 合规）
- [ ] 价格页面添加本地货币显示

---

### 相关工具汇总

**Google 生态**

| 工具 | 用途 |
|------|------|
| [Google Search Console](https://search.google.com/search-console) | 查看索引状态、搜索曝光、爬取问题 |
| [PageSpeed Insights](https://pagespeed.web.dev/) | Core Web Vitals 检测与优化建议 |
| [Rich Results Test](https://search.google.com/test/rich-results) | 检测结构化数据 / Schema Markup |
| [Google Analytics](https://analytics.google.com/) | 流量分析与用户行为追踪 |
| [Google Trends](https://trends.google.com/) | 关键词热度趋势分析 |

**Skills**

| 资源 | 说明 |
|------|------|
| [skills.sh](https://skills.sh) | Claude Code 的 skill 市场 |
| [seo-audit skill](https://skills.sh/coreyhaines31/marketingskills/seo-audit) | 传统 SEO 审查 |
| [ai-seo skill](https://skills.sh/coreyhaines31/marketingskills/ai-seo) | AEO / GEO 优化 |
