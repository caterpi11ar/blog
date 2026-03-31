---
title: Skill 编写指南：把 Skill 当工程对象来设计
author: caterpi11ar
pubDatetime: 2026-03-30T00:00:00
featured: false
draft: false
tags:
  - AI
  - AI Coding
  - Skill Engineering
  - Workflow
description: 面向工程师的 Skill 编写指南，聚焦触发语义、输入输出契约、执行占位规范与 Skill 生命周期管理
---

# Skill 编写指南：把 Skill 当工程对象来设计

Skill 写到后来容易失控，通常不是因为模型不行，而是 Skill 本身缺少结构。触发条件说不清、输入靠猜、输出格式随缘——这些问题在单人单次调用时不明显，一旦多人协作或高频调用就全暴露了。

这篇文章只聊 Skill 层面的设计问题，不重复通用的软件工程实践（重试策略、可观测性、测试方法论等）。目标是让一个 Skill 做到：

- 触发边界清晰，不误触也不漏触
- 输入输出有契约，能被机器和人同时消费
- 在不同环境下都能保持可用

## 1. Skill 是什么

在工程语境下，Skill 不是一段提示词，而是一个有契约的执行单元：

> 在特定触发条件下执行，消费结构化输入，产出可验证结果的任务能力封装。

一个可维护的 Skill 至少要把这四件事说清楚：

1. **触发语义**：什么时候该触发，什么时候不该触发
2. **输入契约**：需要哪些信息，缺失怎么处理
3. **执行规范**：步骤怎么编排，环境不可用时怎么降级
4. **输出契约**：输出什么结构，错误怎么表达

哪项靠"经验判断"，哪项就会在协作时出问题。

## 2. Skill 的生命周期

把 Skill 看成一个状态机，而不是一次性脚本：

```text
idle -> matched -> hydrated -> executing -> validating -> completed
                            |                |
                            v                v
                          rejected          failed
```

每个状态对应 Skill 执行中的一个阶段：

- `idle`：等待触发
- `matched`：触发命中，但输入还没准备好
- `hydrated`：输入补全完毕，校验通过
- `executing`：正在执行
- `validating`：对输出做结构和语义验证
- `completed`：输出满足契约
- `rejected`：触发不匹配或输入不合法
- `failed`：执行或验证失败

这套状态的价值在于：出问题时能定位到具体阶段（是触发错了、输入不全、还是执行失败），而不是笼统地说"这个 Skill 不稳定"。

## 3. 触发语义：精确命中，避免误触

触发写得越宽，误触越多；写得越死，漏触越多。要做的是**可解释的匹配**，不是"感觉差不多就行"。

建议用三层模型：

### 硬条件（Hard Constraints）

必须满足的关键词、上下文或资源前置条件。任一不满足就直接拒绝，不进入执行。

### 软信号（Soft Signals）

提升匹配置信度的信号，比如场景词、动作词、历史意图。只用于排序，不做最终放行依据。

### 排除条件（Negative Guards）

明确不该触发的场景。和硬条件同优先级，先判排除再判命中。

示例（伪配置）：

```yaml
trigger:
  hard:
    - contains_any: ["写技能", "skill", "工作流封装"]
    - context_any: ["工程文档", "技术文章", "开发规范"]
  soft:
    - contains_any: ["模板", "最佳实践", "调试", "发布"]
    - user_intent: "implementation_or_guideline"
  negative:
    - contains_any: ["随便聊聊", "仅要一句话定义"]
```

几个实操要求：

- 每条规则要能说清"为什么加这条"
- 每条排除要有实际误触案例支撑，不要凭空猜
- 触发结果要记录命中了哪条规则路径，方便复盘

## 4. 输入契约：从"能跑"到"可验证"

Skill 执行失败，大部分时候原因是输入不完整。把输入显式建模出来是最有效的防线。

### 4.1 输入的三个层次

- **用户输入**：用户显式提供的文本或参数
- **环境输入**：运行上下文、仓库结构、可用命令、权限范围
- **推导输入**：系统从前两者补全出的默认值

Skill 和普通 API 的区别在于：用户输入经常是不完整的，需要靠环境输入和推导输入来补全。这个补全过程本身需要设计，不能交给模型"自由发挥"。

### 4.2 输入契约示例

```json
{
  "topic": "string, required",
  "audience": "string, optional, default=engineer",
  "depth": "enum(short|detailed|comprehensive), default=detailed",
  "must_include": "array<string>, optional",
  "constraints": {
    "offline_only": "boolean, default=false",
    "no_file_write": "boolean, default=false"
  }
}
```

### 4.3 缺失输入的处理顺序

输入不全时，处理顺序要固定：

1. 先用确定性默认值补全
2. 再用低风险推断补全
3. 仍不足时返回可执行的错误，而不是"尽量猜"

错误输出要对调用方友好，告诉它缺什么、怎么补：

```json
{
  "error_code": "INPUT_MISSING_REQUIRED",
  "message": "字段 topic 缺失，无法确定文档主题",
  "action": "请补充 topic，或提供目标受众与领域关键字"
}
```

## 5. 执行占位规范

Skill 经常需要调用 CLI 工具，但目标 CLI 在当前环境不一定可用。这时仍然要保留完整的命令模板，用占位变量标记可替换部分：

```bash
# 查看子命令帮助（占位）
<CLI_BIN> <SUBCOMMAND> --help

# 执行前置检查（占位）
<CLI_BIN> doctor --check-env

# 执行主流程（占位）
<CLI_BIN> run --config <CONFIG_PATH>
```

占位规范要求：

- 占位变量统一用尖括号命名（`<VAR_NAME>`）
- 每个占位命令要说明预期输入和预期输出
- 命令结构保持真实可执行，不写伪语法

这样做的好处是：Skill 文档即使在 CLI 不可用时也保持完整性，实际部署时只需替换占位变量。

## 6. 输出契约：让结果可以被机器和人同时消费

Skill 的输出不能只是一段自然语言。它至少要同时满足两类消费者：

- **机器消费者**：后续流程自动读取字段
- **人类消费者**：快速理解结果和下一步

建议输出分为 4 个部分：

1. `summary`：一句话结果
2. `artifacts`：核心产物清单（文件路径、对象引用等）
3. `checks`：验证项与状态
4. `next_actions`：下一步动作建议

示例：

```json
{
  "summary": "已生成 Skill 技术文档初稿并通过内容校验",
  "artifacts": [
    {"type": "file", "path": "src/content/blog/ai/skill-authoring-engineering-guide.md"}
  ],
  "checks": [
    {"name": "frontmatter_schema", "status": "passed"},
    {"name": "markdown_parse", "status": "passed"}
  ],
  "next_actions": [
    "补充真实 CLI 帮助输出后替换占位命令",
    "执行一次发布前技术审校"
  ]
}
```

错误输出也要结构化，不要混在正文里——调用方拿到错误后需要能程序化处理，而不是解析一段自然语言。
