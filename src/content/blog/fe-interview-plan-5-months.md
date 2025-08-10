---
title: 5个月大厂前端面试学习计划（3年React经验）
author: caterpillar
pubDatetime: 2025-08-10T00:00:00
featured: false
draft: false
tags:
  - 学习计划
  - 面试
  - React
  - TypeScript
  - 算法
  - 浏览器
  - 计算机网络
  - 工程化
  - 系统设计
description: 面向3年经验React前端的5个月系统化面试学习路线与周计划，覆盖算法、JS/TS、浏览器与网络、React原理、工程化、系统设计与项目呈现。
---

## 目标与产出

- 核心目标：5个月后获得大厂前端（React方向）Offer。
- 可量化产出：
  - 算法：≥ 200 题（Top100 + 高频专题），能现场口述思路与复杂度。
  - 基础：JS/TS/浏览器/网络/安全 体系化笔记 ≥ 80 页，手写题库 ≥ 30 个。
  - React：实现 1 套轻量组件库 + 1 个 SSR/同构实战（Next.js）。
  - 工程化：从零搭 1 套前端工程脚手架（Lint/格式化/测试/CI/监控）。
  - 系统设计：3 个中型方案题（如实时聊天、可观测平台、Feed 流）。
  - 简历与项目：1 份面向 JD 的高亮简历 + 2 个可演示项目链接。

## 总体方法论（70/20/10）

- 70% 刻意练习：算法 + 手写 + 系统设计，严格计时与复盘。
- 20% 架构输入：源码/官方文档/最佳实践沉淀成体系化笔记。
- 10% 模拟面试：每两周邀请同事/朋友或使用平台进行 Mock。

## 月度路线图（5 个月）

### 第1月：基础打底 + 习惯养成

- JavaScript/TypeScript：
  - 原型链、作用域/闭包、this、事件循环、异步并发、深浅拷贝。
  - TS 类型系统（泛型、条件类型、映射与模板字面量、类型体操 10 题）。
- 浏览器与网络：
  - 渲染流水线、回流与重绘、缓存体系、跨域、安全（XSS/CSRF/CSP）。
  - TCP/TLS/HTTP1.1/2/3、QUIC、CDN、DNS 解析、连接复用。
- 数据结构与算法：
  - 基础数据结构与复杂度；数组/链表/哈希/栈队列/二叉树入门 60 题。
- 手写题（每周 2-3 个）：
  - Promise/A+、节流防抖、深拷贝、发布订阅、LRU、并发调度器。

### 第2月：React 核心与算法进阶

- React 原理：
  - Fiber 模型、调度与优先级、Diff、渲染与提交阶段。
  - Hooks 原理与规则、Context、Concurrent Features、Suspense。
  - 性能优化：memo/useMemo/useCallback、列表虚拟化、懒加载与切片渲染。
- 算法进阶：
  - 二叉树/回溯/双指针/滑动窗口/二分/前缀和/单调栈 80 题。
- 实战输出：
  - 用 React 搭建 10+ 组件（输入框、下拉、虚拟列表、表格、图表壳）。

### 第3月：工程化与质量体系

- 构建与打包：Webpack/Vite/Rollup 原理、Tree-Shaking、代码分割、SourceMap。
- 质量与自动化：ESLint/Prettier/commitlint/husky、Vitest/Jest、Playwright。
- 监控与可观测：前端埋点、性能指标（FP/FCP/LCP/CLS/TTI）、错误上报。
- Monorepo & 发布：pnpm workspace + changesets；包语义化版本与发布流程。
- SSR/同构：Next.js 路由与数据获取、CS/SSR/SSG/ISR、Hydration 与边界。

### 第4月：系统设计与项目亮点

- 典型题：
  - 实时聊天（WebSocket/心跳重连/消息有序与幂等/离线与漫游）。
  - 大型列表/Feed 流（分页与增量、缓存与预取、骨架屏与容灾）。
  - 可观测平台（采集 SDK、上报协议、压缩与采样、存储检索）。
- 状态管理与数据层：Redux/RTK、Zustand、SWR/React Query、BFF 模式。
- 项目呈现：将第2-3月产物整合为可演示站点 + 技术方案文档。

### 第5月：冲刺与面试节奏

- 高频八股强化：每天 30-45 分钟快问快答 + 口述推导。
- 算法热身：每日 2 题 + 1 道 10 分钟手写（无提示编程）。
- 模拟面试：每 3-4 天 1 次，涵盖行为面/项目面/系统设计/白板。
- 简历与投递：按 JD 关键词重写，强调指标与影响力；滚动投递与跟进。

## 每周节奏模版（建议）

- 周一：算法 3 题 + JS/TS 专题 1.5h + 手写 1 题
- 周二：React 原理 2h + 源码走读 1h + 组件库实现
- 周三：浏览器/网络 2h + 算法 2 题
- 周四：工程化 2h（构建/测试/监控）+ 项目推进
- 周五：系统设计 1.5h + 算法 2 题 + 复盘
- 周末：
  - 半天：模拟面试/面经复盘/简历维护
  - 半天：补缺与输出文章（至少 1 篇）

## 高频知识点 Checklist（抽查自检）

- JS/TS：
  - 事件循环与微宏任务、原型链与继承、this 绑定、柯里化、深拷贝边界；
  - TS 条件/分布式条件类型、infer、可辨识联合、类型收窄、实用类型实现。
- 浏览器/网络/安全：
  - 渲染与优化、缓存（强/协商）、跨域方案、CSP、XSS/CSRF、Service Worker；
  - TCP/TLS 与 HTTP2/3、首包优化、连接复用、CDN、DNS、QUIC。
- React：
  - Fiber/调度、Diff、并发特性、Suspense、Hydration、性能优化手段；
  - 表单/列表/图表性能、受控与非受控、错误边界、SSR 数据水合策略。
- 工程化：
  - 构建原理、Tree-Shaking 限制、代码分割策略、SourceMap 风险；
  - 测试金字塔、E2E 稳定性、灰度发布、监控指标与告警。
- Node/BFF：Koa/Express、鉴权（JWT/Session）、防刷与限流、GraphQL/REST 对比。

## 手写题清单（至少实现并口述思路）

- Promise.all/any/race、手写 new/call/apply/bind、深拷贝、节流/防抖、
  柯里化、并发控制器、EventEmitter、LRU、模板解析、Virtual List。

## 系统设计题清单（画图 + 关键权衡）

- 实时聊天室、埋点与可观测平台、组件库发布系统、图片上传/处理平台、
  搜索自动补全、低代码页面渲染与权限系统。

## 资源建议

- 官方文档：React、TypeScript、Next.js、Vite、Redux/RTK、React Query。
- 算法：LeetCode 热题 100、代码随想录、labuladong；
- 书籍：你不知道的JS、深入浅出 TypeScript、HTTP 权威指南、图解 TCP/IP；
- 工程化：Webpack/rollup 源码、Vitest/Jest/Playwright 文档；
- 监控/性能：Web Vitals、Performance API、sentry；
- 系统设计：System Design Primer（前端视角自拟边界）。

## 面试策略与复盘

- STAR 法则讲项目与影响力；量化指标（性能提速、故障率、覆盖率）。
- 每次面试后 24h 内复盘：题目、薄弱点、改进计划；每周一次大复盘。
- 建立题库与面经索引，滚动训练，避免“只做不记”。

## 风险与应对

- 疲劳/拖延：番茄钟 + 计划看板；完成即奖励。
- 过度输入：以输出为驱动（文章/组件/演示/Mock），周周可见产物。
- 心态波动：维持运动与作息，固定社交复盘搭子，保持可持续节奏。

---

如果你已在某一模块较强，可适度拉高另一个短板模块的时间占比。计划重在坚持与复盘，保证“高质量输入 + 高强度输出 + 高频反馈”的闭环。预祝拿下心仪 Offer！
