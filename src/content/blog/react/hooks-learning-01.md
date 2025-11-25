---
title: "React Hooks 学习系列 - 学习目录"
pubDatetime: 2025-11-24T00:00:00Z
description: "React Hooks 学习系列目录规划与核心 Hooks 清单"
tags: ["React"]
featured: false
draft: false
---

## 核心 Hooks 清单

### 基础 Hooks（必学）
| Hook | 作用 | 复杂度 | 文章位置 |
|------|------|--------|---------|
| `useState` | 状态管理 | ⭐⭐ | 第一篇 |
| `useEffect` | 副作用处理 | ⭐⭐⭐ | 第二篇 |
| `useContext` | 上下文消费 | ⭐⭐ | 第五篇 |

### 进阶 Hooks
| Hook | 作用 | 复杂度 | 文章位置 |
|------|------|--------|---------|
| `useReducer` | 复杂状态管理 | ⭐⭐⭐ | 第一篇 |
| `useCallback` | 函数缓存 | ⭐⭐ | 第三篇 |
| `useMemo` | 计算值缓存 | ⭐⭐ | 第三篇 |
| `useRef` | 引用对象 | ⭐ | 第五篇 |
| `useLayoutEffect` | 同步副作用 | ⭐⭐⭐ | 第二篇 |
| `useImperativeHandle` | 自定义实例 | ⭐⭐ | 第五篇 |

### React 18 新增 Hooks
| Hook | 作用 | 复杂度 | 文章位置 |
|------|------|--------|---------|
| `useTransition` | 并发更新 | ⭐⭐⭐⭐ | 第四篇 |
| `useDeferredValue` | 延迟值 | ⭐⭐⭐ | 第四篇 |
| `useId` | 唯一 ID | ⭐ | 第六篇 |
| `useSyncExternalStore` | 外部状态同步 | ⭐⭐⭐⭐ | 第六篇 |
| `useInsertionEffect` | CSS-in-JS 优化 | ⭐⭐ | 第二篇 |

### 调试 Hooks
| Hook | 作用 | 复杂度 | 文章位置 |
|------|------|--------|---------|
| `useDebugValue` | 调试信息 | ⭐ | 第六篇 |

---

### 学习路径
1. **第一篇** → 理解 Hooks 基础架构和状态管理
2. **第二篇** → 掌握副作用处理机制
3. **第三篇** → 学习性能优化技巧
4. **第五篇** → 理解引用和上下文
5. **第四篇** → 探索并发特性（需要前置知识）
6. **第六篇** → 补充工具类 Hooks
7. **第七篇** → 实践与总结

### 源码版本
- React 18.2.0+
- 基于最新稳定版本进行分析

---