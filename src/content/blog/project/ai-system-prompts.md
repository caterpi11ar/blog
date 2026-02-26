---
title: 我把 30+ AI 编程工具的系统提示词做成了一个网站
author: caterpi11ar
pubDatetime: 2026-02-26T10:00:00
featured: true
draft: false
tags:
  - 产品
  - AI
  - 开源项目
description: Claude Code、Cursor、Devin、Windsurf、v0……这些 AI 编程工具背后的系统提示词，全部收录在一个可搜索的网站里。
---

## 起因

用 Claude Code 写代码的时候，我经常好奇一件事：**它到底被灌了什么指令？**

AI 编程工具越来越多——Cursor、Devin、Windsurf、Replit、v0、Augment Code——每个产品的能力和性格都不一样。有的擅长补全，有的擅长多文件重构，有的会主动帮你写测试。这些差异不完全是模型能力的差异，很大程度上取决于系统提示词（System Prompt）的设计。

系统提示词就是产品的灵魂。同样的底座模型，换一套提示词，输出风格就完全不同。

我想看看这些工具的提示词长什么样，于是在 GitHub 上找到了 [x1xhlol](https://github.com/x1xhlol) 维护的 [system-prompts-and-models-of-ai-tools](https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools) 仓库——收录了 30 多个 AI 工具的提示词，数据非常全。但原始仓库是 Markdown 文件的合集，阅读体验一般，搜索也不方便。

于是我决定把它做成一个网站。

---

## 做了什么

[AI System Prompts Playground](https://ai.caterpi11ar.com/) 做的事情很直接：**把 30+ AI 编程工具的系统提示词，以可搜索、可浏览的方式呈现出来**。

### 收录的工具

| 类别 | 工具 |
|------|------|
| **代码助手** | Claude Code, Cursor, Windsurf, Augment Code, CodeBuddy, VSCode Agent, Z.ai Code, Trae |
| **AI Agent** | Devin AI, Manus Agent, Junie, Traycer AI, Kiro, Amp |
| **应用构建** | v0, Lovable, Replit, Same.dev, Leap.new, Bolt |
| **搜索与对话** | Perplexity, NotionAI, Comet Assistant, Cluely |
| **平台工具** | Google Gemini, Xcode AI, Warp.dev, Qoder, Poke |
| **开源项目** | Cline, Codex CLI, Gemini CLI, Lumo, RooCode |

每个工具的页面包含：
- **系统提示词原文**（`.txt`）——模型收到的核心指令
- **工具定义**（`.json`）——模型可以调用的工具和函数
- **配置信息**（`.yaml` / `.md`）——额外的设置和文档

### 核心功能

- **全文搜索**：跨所有提示词内容搜索关键词
- **分类导航**：按类别浏览和筛选
- **语法高亮**：提示词内容高亮显示
- **SEO 友好**：每个工具都有独立的静态页面，方便搜索引擎收录

---

## 技术实现

技术栈选的是 Next.js 15 + React 19 + Tailwind CSS 4 + shadcn/ui，Vercel 部署。

内容驱动是这个项目的核心特点。所有提示词数据存在 `docs/` 目录下，按工具名分文件夹组织。构建时通过 SSG（静态站点生成）把 Markdown 内容编译成静态页面，既保证加载速度，又对 SEO 友好。

目录结构大致长这样：

```
docs/
├── Anthropic/
│   ├── Claude Code/          # Prompt.txt, Tools.json
│   └── Claude for Chrome/    # Prompt.txt
├── Cursor Prompts/           # Chat, Agent, Background Agent
├── Devin AI/                 # System Prompt.txt
├── Google/
│   ├── Antigravity/
│   └── Gemini/
├── Open Source prompts/
│   ├── Bolt/
│   ├── Cline/
│   ├── Codex CLI/
│   └── ...
└── ... (30+ tools)
```

没有数据库，没有后端 API，纯静态站。内容更新只需要往 `docs/` 里加文件，重新构建即可。简单直接。

---

## 一些有趣的发现

读完这些提示词之后，有几个观察：

**1. 提示词比想象中长得多**

Claude Code 的系统提示词加上工具定义，轻松超过万字。Cursor 的更夸张，按场景拆成了好几个独立的提示词文件（Chat、Agent、Background Agent）。这些不是简单的几句话，是精心设计的工程文档。

**2. 好的提示词都在做同一件事：划清边界**

什么该做、什么不该做、什么情况下要问用户、什么情况下可以自己决定——这些边界条件占了提示词的大部分篇幅。模型的能力是基础，但边界设计才决定了产品的可靠性。

**3. 工具定义是被低估的部分**

大多数人关注提示词文本本身，但工具定义（Tool Definitions）同样重要。它们决定了模型能"做"什么——读文件、写文件、执行命令、搜索代码。不同工具给模型开放的能力范围差异很大，这直接影响了产品的上限。

---

## 为什么做成网站而不是 GitHub 仓库

原始数据已经在 GitHub 上了，为什么还要再做一个网站？

**搜索体验**。在 GitHub 上搜一个关键词，跨文件跳来跳去非常痛苦。网站提供全文搜索，一秒找到你要的内容。

**SEO 收录**。GitHub 仓库的内容不会被搜索引擎深度索引。做成独立网站后，每个工具的提示词都有独立 URL，搜索「Claude Code system prompt」就能直接找到。

**阅读体验**。语法高亮、分类导航、响应式布局——这些都是 GitHub 原生 Markdown 渲染做不到的。

---

## 后续计划

- **持续更新**：AI 工具迭代速度很快，提示词也在不断变化，保持跟进
- **版本对比**：同一个工具不同版本的提示词对比，看看它们是怎么进化的
- **社区贡献**：开放提交通道，让更多人参与收录新工具

---

## 最后

系统提示词是 AI 产品的源代码。看懂了提示词，就看懂了产品的设计意图。

如果你也对 AI 编程工具的工作原理感兴趣，去翻翻这些提示词，会有很多收获。

> 网站地址：[ai.caterpi11ar.com](https://ai.caterpi11ar.com/)
