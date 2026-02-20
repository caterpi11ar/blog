---
title: AI Coding 方法论：Context Engineering
author: caterpi11ar
pubDatetime: 2025-09-12T00:00:00
featured: true
draft: false
tags:
  - AI
  - AI Coding
description: 了解如何通过Context Engineering 解决AI 对大型项目处理较差的问题
---

在AI辅助编程领域，我们已经熟悉了Prompt Engineering（提示工程）的概念，即通过精心设计的提示来引导AI生成更好的代码。然而，随着AI编码工具的发展，一种新的方法论——Context Engineering（上下文工程）正在成为更有效的实践。

## 什么是Context Engineering

Context Engineering是一种系统化的方法，通过为AI编码助手提供全面的上下文信息，使其能够更好地理解和完成任务。与传统的Prompt Engineering不同，Context Engineering不仅仅是关于如何措辞提示，而是构建一个完整的上下文系统，包括文档、示例、规则、模式和验证机制。

### Prompt Engineering vs Context Engineering

| 维度 | Prompt Engineering | Context Engineering |
|------|-------------------|-------------------|
| **方法本质** | 专注于巧妙的措辞和特定的表达方式 | 完整的系统，提供全面的上下文 |
| **信息提供** | 仅限于如何描述任务 | 包括文档、示例、规则、模式和验证 |
| **类比** | 就像给某人一张便签 | 就像编写完整的剧本，包含所有细节 |
| **系统性** | 缺乏系统性，每次重新开始 | 结构化、规范化的完整体系 |
| **上下文管理** | 上下文信息有限，无法持久化 | 全面的上下文信息，支持长期记忆 |
| **质量控制** | 缺乏验证机制，质量不稳定 | 内置验证门，确保输出质量 |
| **可重复性** | 重复劳动，难以标准化 | 可复用的模板和流程 |
| **学习曲线** | 需要大量试验和技巧积累 | 清晰的模板和最佳实践 |
| **错误处理** | 难以诊断和优化问题 | 系统化的错误处理模式 |
| **扩展性** | 难以扩展到复杂项目 | 天然支持大型复杂项目 |
| **团队协作** | 个人技巧，难以分享 | 标准化流程，易于团队采用 |
| **维护成本** | 需要持续优化提示词 | 一次设置，长期受益 |

## Context Engineering的核心原则

### 1. 全面的上下文提供

Context Engineering强调为AI提供尽可能多的相关上下文信息，包括：
- 项目结构和架构
- 编码规范和风格指南
- 相关的代码示例
- 技术文档和API参考
- 测试要求和质量标准

### 2. 结构化信息组织

通过结构化的方式组织上下文信息，使其易于AI理解和使用：
- 使用清晰的文档结构
- 提供可参考的代码示例
- 定义明确的规则

## Context Engineering模板结构

一个典型的Context Engineering模板包含以下组件：

```
context-engineering-intro/
├── .claude/
│   ├── commands/
│   │   ├── generate-prp.md    # 生成综合PRPs
│   │   └── execute-prp.md     # 执行PRPs以实现功能
│   └── settings.local.json    # Claude Code权限设置
├── PRPs/
│   ├── templates/
│   │   └── prp_base.md       # PRP基础模板
│   └── EXAMPLE_multi_agent_prp.md  # 完整PRP示例
├── examples/                  # 代码示例（关键！）
├── CLAUDE.md                 # AI助手的全局规则
├── INITIAL.md               # 功能请求模板
├── INITIAL_EXAMPLE.md       # 功能请求示例
└── README.md                # 说明文件
```

## 实施步骤

### 1. 设置全局规则（CLAUDE.md）

CLAUDE.md文件包含AI助手在每次对话中都会遵循的项目级规则，包括：
- 项目意识：阅读规划文档、检查任务
- 代码结构：文件大小限制、模块组织
- 测试要求：单元测试模式、覆盖率期望
- 风格约定：语言偏好、格式规则
- 文档标准：文档字符串格式、注释实践

### 2. 创建初始功能请求

编辑INITIAL.md来描述想要构建的内容：

```
## FEATURE:
[描述要构建的内容 - 对功能和要求要具体]

## EXAMPLES:
[列出examples/文件夹中的示例文件并解释如何使用]

## DOCUMENTATION:
[包含相关文档、API或MCP服务器资源的链接]

## OTHER CONSIDERATIONS:
[提及任何需要注意的事项、特定要求或AI助手常忽略的内容]
```

### 3. 生成PRP（Product Requirements Prompt）

PRP是包含以下内容的综合实现蓝图：
- 完整的上下文和文档
- 带验证的实施步骤
- 错误处理模式
- 测试要求

在Claude Code中运行：
```
/generate-prp INITIAL.md
```

### 4. 执行PRP

生成后，执行PRP来实现功能：
```
/execute-prp PRPs/your-feature-name.md
```

## 最佳实践

### 1. 在INITIAL.md中明确表达

- 不要假设AI了解你的偏好
- 包含具体要求和约束
- 自由引用示例

### 2. 提供全面的示例

- 更多示例 = 更好的实现
- 展示要做什么和不要做什么
- 包含错误处理模式

### 3. 使用验证门

- PRP包含必须通过的测试命令
- AI将持续迭代直到所有验证通过
- 确保第一次就生成可工作的代码

### 4. 利用文档

- 包含官方API文档
- 添加MCP服务器资源
- 引用特定文档部分

### 5. 自定义CLAUDE.md

- 添加你的约定
- 包含项目特定规则
- 定义编码标准

Context Engineering代表了从传统提示工程的范式转变。大多数AI代理失败不是模型失败，而是上下文失败。通过实施Context Engineering，我们可以确保AI具有完成端到端任务所需的信息，从而显著提高成功率和代码质量。