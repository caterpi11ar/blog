---
title: 前端面试知识点检查清单
author: caterpi11ar
pubDatetime: 2025-08-10T06:00:00
featured: false
draft: true
tags:
  - 面试
  - JavaScript
  - React
  - 算法
description: 前端面试必备知识点检查清单，覆盖 JavaScript、React、浏览器、网络、算法、工程化等核心领域。
---

## 使用说明

本检查清单旨在帮你系统性地自检前端面试核心知识点掌握情况。建议：

- **每周自检**：选择 1-2 个模块进行深度检查
- **口述练习**：尝试不看资料口述每个知识点
- **时间控制**：每个问题控制在 3-5 分钟内回答完成
- **查漏补缺**：标记薄弱环节，制定针对性学习计划

评分标准：
- ✅ **掌握**：能够清晰解释原理，举出实际案例，分析优缺点
- ⚠️ **部分掌握**：理解基本概念，但细节不够清楚或缺乏实践经验
- ❌ **需要学习**：概念模糊或完全不了解

## JavaScript 核心

### 数据类型与类型检测

#### 基础数据类型

- [x] **Number** - 数字类型，IEEE 754 双精度浮点数
  ```javascript
  Number.parseInt(string, radix) // 解析字符串为整数，radix为进制(2-36)
  Number.parseFloat(string) // 解析字符串为浮点数
  Number.isNaN() // 检查是否为 NaN
  Number.isFinite() // 检查是否为有限数值
  ```

- [x] **String** - 字符串类型，UTF-16 编码
  ```javascript
  const str = String(value)
  // 返回指定索引处的字符，支持负数索引
  str.at(index)

  // 支持负数索引从后往前数，end省略则到末尾，start > end 时返回空字符串
  str.slice(start, end) // 返回子字符串（不修改原字符串）

  // 自动交换 start/end 顺序，end省略则到末尾
  str.substring(start, end) // 回子字符串（不修改原字符串）
  ```

- [x] **Boolean** - 布尔类型
  ```javascript
  true
  false
  ```

- [x] **undefined** - 未定义值，表示变量声明但未赋值
  ```javascript
  // 不是保留字，使用 -2^30（超出整数范围的数字）表示
  let value // undefined
  ```

- [x] **null** - 空值，表示空对象引用
  ```javascript
  // 早期版本中表示为全零（0x00 机器码）
  // typeof null 返回 "object"（历史遗留问题，null 的二进制前三位全为 0）
  const value = null
  ```

- [x] **Symbol** - 唯一且不可变的数据类型
  ```javascript
  // 实例是唯一的，常用于对象属性键避免命名冲突
  const key = Symbol('description')
  ```

- [x] **BigInt** - 大整数类型，可以表示任意大小的整数
  ```javascript
  // 不能使用 new，不能与 Number 混合运算
  const bigIntValue = 1234567890123456789012345678901234567890n
  const bigIntFromNumber = BigInt(123)
  ```

#### 引用数据类型

- [ ] **Object** - 对象类型，所有对象的基类
  ```javascript
  Object.defineProperty(obj, prop, {
    value: 'value',
    writable: true,
    enumerable: true,
    configurable: true
  }) // 定义对象属性（Vue2 中使用）
  Object.fromEntries(iterable) // 将键值对列表转换为对象
  Object.hasOwn(obj, prop) // 检查自身属性（属性继承或不存在时返回 false）
  Object.is(value1, value2) // 判断值相等性（基本类型直接比较，对象比较引用）
  ```

- [ ] **Array** - 数组类型，有序集合
  ```javascript
  // 类数组对象转数组，mapFn可选处理函数，thisArg可选this值
  Array.from(arrayLike, mapFn, thisArg)

  // 稀疏数组：空位（empty slots）行为规范明确
  // .map(), .forEach(), .filter() 等方法跳过空位
  const sparseArray = [1, , 3] // 稀疏数组示例

  // 就地移除/替换/添加元素（修改原数组）
  Array.splice(start, deleteCount, ...items)

  // 返回新数组（不修改原数组），start > end 时返回空数组
  Array.slice(start, end)

  // 排序数组（修改原数组），默认按 Unicode 码位顺序
  Array.sort(compareFunction)
  ```

- [ ] **Function** - 函数类型
  ```javascript

  ```
- [ ] **Date** - 日期时间类型
- [ ] **RegExp** - 正则表达式类型
- [ ] **Error** - 错误对象类型
- [ ] **Promise** - 异步操作结果类型
- [ ] **Proxy** - 代理对象类型
- [ ] **Reflect** - 反射API对象
- [ ] **Map** - 键值对映射类型
- [ ] **Set** - 唯一值集合类型
- [ ] **WeakMap** / **WeakSet** - 弱引用集合类型

#### 类型检测与转换

- [ ] **类型检测方法**
  ```javascript
  // typeof 操作符
  typeof undefined     // "undefined"
  typeof null         // "object" (历史遗留问题)
  typeof []           // "object"
  typeof function(){} // "function"

  // instanceof 操作符
  [] instanceof Array           // true
  {} instanceof Object         // true
  new Date() instanceof Date   // true

  // Object.prototype.toString
  Object.prototype.toString.call([])     // "[object Array]"
  Object.prototype.toString.call({})     // "[object Object]"
  Object.prototype.toString.call(null)   // "[object Null]"
  ```

- [ ] **类型转换规则**
  ```javascript
  // 隐式转换
  const result1 = `${1 }2`; // '12' (数字转字符串)
  const result2 = '2' * 3 // 6 (字符串转数字)
  const result3 = 0 == false // true (数字转布尔)
  const result4 = undefined == null // true (特殊情况)

  // == vs === 的区别
  consteq1 = 0ffalse == 0      // true (类型转换)
  consteq2 = 0ffalse === 0     // false (严格相等)

  // + 操作符的类型转换
  constum1 = + 23';  23 (字符串转数字)
  const num2 = + ue;   (布尔转数字)
  const num3 = + ll;   (null转数字)
  const num4 = + defined;  aN (undefined转数字)
  ```

- [ ] **判断数组的方法**
  ```javascript
  // 1. Array.isArray() (推荐)
  const isArray1 = Array.isArray([])  // true

  // 2. instanceof
  constarr = []]
  constisArray2 = aArray.isArray(arr)  / true

  // 3. constructor
  const isArray3 = [].constructor === ArArray  // true

  // 4. Object.prototype.toString
  constArray4 = Object.prototype.toString.call([]) === '[o'[object Array]'  // true

  // 5. 鸭子类型判断
  functionrrayLike(obj) {
    return obj && typeof obj.length === 'num'number'
  }`

- [ ] **null vs undefined**
  ```javascript
  // undefined 的场景
  let value                    // 未初始化
  function fn(param) { } // 缺少参数
  // return;                      // 没有返回值的函数
  const obj = {}
  // obj.nonExistentProperty      // 不存在的属性

  // null 的场景
  letnullValue = nnull            // 明确表示空值
  JSONstringify({k ey: null} ))     // 序列化时的空值
  Objectcreate(null))             // 创建无原型对象

  // 区别
  constypeUndefined = typeof unundefined  // "undefined"
  constypeNull = typeof nunull            // "object"
  constq1 = undefined == nunull   // true
  constq2 = undefined === nunull// false
  ```

### [迭代协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols)

### 作用域与闭包
- [ ] 词法作用域 vs 动态作用域的概念
- [ ] 执行上下文、作用域链的工作机制
- [ ] 变量提升（hoisting）的原理和注意事项
- [ ] 暂时性死区（TDZ）及其作用
- [ ] 闭包的形成条件、应用场景和潜在问题
- [ ] 立即执行函数（IIFE）的作用和使用场景

### this 绑定机制
- [ ] this 的四种绑定规则：默认、隐式、显式、new 绑定
- [ ] 箭头函数的 this 绑定特点
- [ ] `call`、`apply`、`bind` 的区别和实现原理
- [ ] 严格模式对 this 的影响
- [ ] 在不同场景下 this 的指向判断

### 原型与继承
- [ ] `__proto__` 与 `prototype` 的区别和关系
- [ ] 原型链的查找机制和终点
- [ ] `instanceof` 操作符的工作原理
- [ ] 几种继承模式：原型继承、构造函数继承、组合继承、寄生组合继承
- [ ] ES6 class 的本质及与构造函数的区别
- [ ] `Object.create`、`Object.setPrototypeOf` 的使用

### 异步编程
- [ ] JavaScript 运行时模型：Call Stack、Web APIs、Callback Queue、Event Loop
- [ ] 宏任务（macrotask）与微任务（microtask）的执行顺序
- [ ] Promise 的状态机制和链式调用原理
- [ ] `async/await` 的语法糖本质和错误处理
- [ ] 并发控制：`Promise.all`、`Promise.race`、`Promise.allSettled`、`Promise.any`
- [ ] Node.js 事件循环与浏览器的差异

### 函数式编程
- [ ] 高阶函数的概念和应用
- [ ] 柯里化（Currying）和偏应用（Partial Application）
- [ ] 函数组合（Function Composition）
- [ ] 纯函数的概念和优势
- [ ] 防抖（debounce）和节流（throttle）的实现和应用场景

## TypeScript 类型系统

### 基础类型系统
- [ ] 基础类型：`string`、`number`、`boolean`、`array`、`tuple`、`enum`、`any`、`unknown`、`void`、`never`
- [ ] 联合类型和交叉类型的使用场景
- [ ] 类型断言的使用和风险
- [ ] 字面量类型和类型收窄
- [ ] 可选属性和只读属性

### 高级类型特性
- [ ] 泛型的概念、约束和默认类型参数
- [ ] 条件类型的语法和应用场景
- [ ] 映射类型的实现原理
- [ ] 模板字面量类型的使用
- [ ] `infer` 关键字的作用和使用方法

### 工具类型和类型操作
- [ ] 内置工具类型：`Partial`、`Required`、`Pick`、`Omit`、`Exclude`、`Extract`、`NonNullable`、`Record`
- [ ] 自定义工具类型的实现
- [ ] 分布式条件类型的特性
- [ ] 协变和逆变的概念
- [ ] 类型兼容性和结构化类型系统

## React 核心原理

### 组件和生命周期
- [ ] 函数组件 vs 类组件的区别和选择
- [ ] React 生命周期方法及其使用场景
- [ ] `componentDidMount`、`componentDidUpdate`、`componentWillUnmount` 的常见用法
- [ ] `getDerivedStateFromProps` 和 `getSnapshotBeforeUpdate` 的使用场景
- [ ] 错误边界（Error Boundaries）的实现和应用

### Hooks 原理和最佳实践
- [ ] Hooks 的设计动机和解决的问题
- [ ] `useState` 的工作原理和批量更新机制
- [ ] `useEffect` 的执行时机和依赖数组规则
- [ ] `useLayoutEffect` 与 `useEffect` 的区别
- [ ] `useMemo` 和 `useCallback` 的使用场景和注意事项
- [ ] `useRef` 的多种用法：DOM 引用、可变值存储
- [ ] 自定义 Hooks 的设计原则和最佳实践
- [ ] Hooks 规则的原因和底层实现

### 虚拟 DOM 和 Diff 算法
- [ ] 虚拟 DOM 的概念和优势
- [ ] React Diff 算法的三个假设和优化策略
- [ ] key 的作用机制和最佳实践
- [ ] 单节点 Diff 和多节点 Diff 的处理逻辑
- [ ] React 18 中 Diff 算法的改进

### Fiber 架构和调度
- [ ] Fiber 的设计目标和解决的问题
- [ ] Fiber 数据结构：type、key、props、stateNode、alternate
- [ ] 双缓存机制：current 树和 workInProgress 树
- [ ] 时间片调度和可中断渲染
- [ ] 优先级调度：lanes 模型和优先级更新
- [ ] 并发特性：Concurrent Mode、Suspense、startTransition

### 状态管理和数据流
- [ ] React 单向数据流的特点
- [ ] 状态提升和状态下沉的场景
- [ ] Context API 的使用和性能考虑
- [ ] Redux 的设计原则和中间件机制
- [ ] React Query/SWR 的缓存策略和数据同步

## 浏览器原理

### 渲染流水线
- [ ] 浏览器渲染过程：解析 → 样式 → 布局 → 绘制 → 合成
- [ ] HTML 解析和 DOM 构建过程
- [ ] CSS 解析和 CSSOM 构建
- [ ] 渲染树（Render Tree）的构建过程
- [ ] 布局（Layout/Reflow）的触发条件和优化
- [ ] 绘制（Paint）和复合（Composite）的层级关系

### 性能优化
- [ ] 回流（Reflow）和重绘（Repaint）的区别和优化策略
- [ ] CSS 包含块和层叠上下文的概念
- [ ] 硬件加速和合成层的触发条件
- [ ] `will-change` 属性的使用和注意事项
- [ ] 关键渲染路径的优化策略
- [ ] Web Vitals 指标：LCP、FID、CLS、FCP、TTFB

### 缓存机制
- [ ] 强缓存：`Cache-Control` 和 `Expires` 的区别
- [ ] 协商缓存：`ETag`/`If-None-Match` 和 `Last-Modified`/`If-Modified-Since`
- [ ] 缓存策略的选择和最佳实践
- [ ] Service Worker 的缓存控制
- [ ] HTTP/2 的缓存优化

### 跨域和安全
- [ ] 同源策略的定义和作用
- [ ] CORS 的工作机制：简单请求和预检请求
- [ ] 跨域解决方案：JSONP、代理、PostMessage
- [ ] XSS 攻击的类型和防护措施
- [ ] CSRF 攻击的原理和防护策略
- [ ] CSP（Content Security Policy）的配置和作用

## 计算机网络

### HTTP 协议
- [ ] HTTP/1.1 的特性：持久连接、管道化、缓存控制
- [ ] HTTP/2 的改进：二进制帧、多路复用、服务端推送、头部压缩
- [ ] HTTP/3 和 QUIC 的特点：UDP 传输、连接迁移、0-RTT
- [ ] HTTPS 和 TLS 握手过程
- [ ] HTTP 状态码的分类和常见状态码含义

### TCP/IP 协议栈
- [ ] OSI 七层模型和 TCP/IP 四层模型
- [ ] TCP 三次握手和四次挥手的过程
- [ ] TCP 的可靠性保证：确认机制、重传机制、流量控制、拥塞控制
- [ ] UDP 的特点和适用场景
- [ ] DNS 解析过程和优化策略

### 网络优化
- [ ] CDN 的工作原理和优势
- [ ] DNS 预解析和域名分片
- [ ] 连接复用和 Keep-Alive
- [ ] 首包时间（TTFB）的优化
- [ ] 资源压缩：Gzip、Brotli
- [ ] 图片优化：WebP、响应式图片、懒加载

## 算法与数据结构

### 时间复杂度和空间复杂度
- [ ] Big O 表示法的含义和计算方法
- [ ] 常见算法的时间复杂度：O(1)、O(log n)、O(n)、O(n log n)、O(n²)、O(2ⁿ)
- [ ] 最好、最坏、平均时间复杂度的区别
- [ ] 空间复杂度的计算和优化策略
- [ ] 时间空间复杂度的权衡和优化思路

### 基础数据结构
- [ ] 数组：动态数组、稀疏数组、环形数组
- [ ] 链表：单链表、双链表、循环链表、跳表
- [ ] 栈：单调栈、表达式求值、括号匹配
- [ ] 队列：普通队列、双端队列、优先队列、单调队列
- [ ] 哈希表：冲突解决、负载因子、扩容策略
- [ ] 堆：最大堆、最小堆、堆排序、TopK 问题

### 树结构
- [ ] 二叉树：完全二叉树、满二叉树、平衡二叉树
- [ ] 二叉搜索树：插入、删除、查找、平衡操作
- [ ] AVL 树：旋转操作、平衡因子、插入删除
- [ ] 红黑树：性质、插入、删除、颜色调整
- [ ] B 树和 B+ 树：多路平衡树、数据库索引
- [ ] 字典树（Trie）：字符串匹配、前缀查询
- [ ] 并查集：路径压缩、按秩合并、连通性问题

### 图算法
- [ ] 图的表示：邻接矩阵、邻接表、边列表
- [ ] 图的遍历：DFS、BFS、拓扑排序
- [ ] 最短路径：Dijkstra、Floyd、Bellman-Ford
- [ ] 最小生成树：Prim、Kruskal 算法
- [ ] 强连通分量：Tarjan、Kosaraju 算法
- [ ] 网络流：最大流、最小割、费用流
- [ ] 二分图：匹配、匈牙利算法、KM 算法

### 动态规划
- [ ] 动态规划的基本思想：最优子结构、重叠子问题
- [ ] 状态定义和转移方程的设计思路
- [ ] 记忆化搜索和自底向上的实现方式
- [ ] 经典问题：斐波那契、爬楼梯、背包问题
- [ ] 线性 DP：最长递增子序列、最大子数组和
- [ ] 区间 DP：石子合并、回文串、括号匹配
- [ ] 树形 DP：树的最大独立集、树的重心
- [ ] 状态压缩 DP：旅行商问题、棋盘覆盖
- [ ] 数位 DP：数字统计、区间计数问题
- [ ] 概率 DP：期望值计算、概率递推

### 搜索算法
- [ ] 深度优先搜索（DFS）：递归实现、栈实现、剪枝优化
- [ ] 广度优先搜索（BFS）：队列实现、层次遍历、最短路径
- [ ] 回溯算法：全排列、子集、组合、N 皇后
- [ ] 剪枝策略：可行性剪枝、最优性剪枝、记忆化剪枝
- [ ] 双向搜索：双向 BFS、双向 DFS、Meet in Middle
- [ ] A* 算法：启发式搜索、估价函数、最优路径

### 贪心算法
- [ ] 贪心选择性质和最优子结构
- [ ] 经典问题：活动选择、霍夫曼编码、最小生成树
- [ ] 区间问题：区间调度、区间覆盖、区间合并
- [ ] 分配问题：任务分配、资源分配、负载均衡
- [ ] 贪心算法的正确性证明和反例构造

### 分治算法
- [ ] 分治思想：分解、解决、合并
- [ ] 经典算法：归并排序、快速排序、二分查找
- [ ] 最近点对问题：平面分治、时间复杂度分析
- [ ] 大整数乘法：Karatsuba 算法、FFT 优化
- [ ] 矩阵乘法：Strassen 算法、分块优化

### 高级数据结构
- [ ] 线段树：区间查询、区间更新、懒标记
- [ ] 树状数组：前缀和、区间和、逆序对
- [ ] 平衡树：Splay 树、Treap、替罪羊树
- [ ] 块状数组：分块思想、区间操作优化
- [ ] 可持久化数据结构：主席树、可持久化数组
- [ ] 离线算法：莫队算法、整体二分、CDQ 分治

### 字符串算法
- [ ] 字符串匹配：KMP、Rabin-Karp、Boyer-Moore
- [ ] 后缀数组：构建、应用、最长公共前缀
- [ ] 后缀自动机：构建、应用、子串统计
- [ ] 回文串：Manacher 算法、回文树
- [ ] 字符串哈希：多项式哈希、双哈希、滚动哈希
- [ ] AC 自动机：多模式串匹配、fail 指针

### 数学算法
- [ ] 数论基础：质数、约数、欧拉函数
- [ ] 快速幂：矩阵快速幂、大数取模
- [ ] 扩展欧几里得：线性同余方程、逆元
- [ ] 中国剩余定理：同余方程组求解
- [ ] 容斥原理：集合计数、概率计算
- [ ] 生成函数：组合数学、递推数列

### 算法思维和解题技巧
- [ ] 问题建模：抽象化、数学化、图论化
- [ ] 算法选择：时间复杂度、空间复杂度、实现难度
- [ ] 优化技巧：预处理、离线处理、在线处理
- [ ] 边界处理：特殊情况、极限情况、异常输入
- [ ] 调试技巧：对拍、小数据测试、复杂度分析
- [ ] 常见模板：滑动窗口、双指针、单调栈/队列

### 实际应用场景
- [ ] 前端性能优化：防抖节流、虚拟滚动、懒加载
- [ ] 数据处理：去重、排序、过滤、聚合、分页
- [ ] 缓存策略：LRU、LFU、FIFO、2Q、ARC
- [ ] 文本处理：模糊匹配、自动补全、拼写检查、相似度计算
- [ ] 图形算法：碰撞检测、路径规划、布局算法、几何计算
- [ ] 网络优化：路由算法、负载均衡、流量控制
- [ ] 机器学习：特征选择、模型优化、参数调优

## 设计模式

### 创建型模式
- [ ] 单例模式：实现方式、线程安全、应用场景
- [ ] 工厂模式：简单工厂、工厂方法、抽象工厂的区别
- [ ] 建造者模式：链式调用、参数校验、对象构建
- [ ] 原型模式：浅拷贝、深拷贝、性能考虑
- [ ] 对象池模式：内存管理、性能优化、使用场景

### 结构型模式
- [ ] 适配器模式：接口适配、数据转换、兼容性处理
- [ ] 装饰器模式：功能扩展、组合优于继承、AOP 思想
- [ ] 代理模式：虚拟代理、保护代理、缓存代理、远程代理
- [ ] 外观模式：子系统封装、接口简化、依赖倒置
- [ ] 桥接模式：抽象与实现分离、多维度变化处理
- [ ] 组合模式：树形结构、统一接口、递归处理
- [ ] 享元模式：内存共享、对象复用、内部状态与外部状态

### 行为型模式
- [ ] 观察者模式：事件驱动、发布订阅、解耦设计
- [ ] 策略模式：算法族、运行时切换、消除条件分支
- [ ] 命令模式：请求封装、队列管理、撤销重做
- [ ] 状态模式：状态转换、行为变化、状态机实现
- [ ] 责任链模式：请求传递、处理链、异常处理
- [ ] 模板方法模式：算法骨架、钩子方法、继承复用
- [ ] 迭代器模式：集合遍历、内部迭代器、外部迭代器
- [ ] 中介者模式：对象通信、解耦设计、协调控制
- [ ] 备忘录模式：状态保存、撤销恢复、快照管理
- [ ] 访问者模式：操作分离、数据结构稳定、扩展开放

### 前端特定设计模式
- [ ] 模块模式：命名空间、私有方法、闭包应用
- [ ] 发布订阅模式：事件总线、消息队列、组件通信
- [ ] 策略模式：表单验证、路由匹配、算法选择
- [ ] 装饰器模式：高阶组件、中间件、功能增强
- [ ] 工厂模式：组件创建、配置对象、动态实例化
- [ ] 单例模式：全局状态、工具类、缓存管理

### 设计模式应用原则
- [ ] SOLID 原则：单一职责、开闭原则、里氏替换、接口隔离、依赖倒置
- [ ] DRY 原则：避免重复、抽象复用、配置化设计
- [ ] KISS 原则：简单优先、过度设计避免、可读性考虑
- [ ] 组合优于继承：灵活性、可扩展性、维护性
- [ ] 面向接口编程：解耦、测试友好、扩展开放

## 开源项目实战

### ROSBag Engine - 浏览器环境 ROSBag 解析引擎
- [ ] ROSBag 文件格式理解和二进制数据解析原理
- [ ] 浏览器环境下的文件读取和流式处理技术
- [ ] Web Workers 在数据解析中的应用和性能优化
- [ ] 内存管理和大数据集处理策略
- [ ] 实时数据播放和渲染引擎架构设计
- [ ] 跨浏览器兼容性和性能基准测试
- [ ] 模块化设计和插件化架构实现

### React 多重筛选条件组件
- [ ] 复杂表单状态管理和数据流设计
- [ ] 动态筛选条件的增删改查交互设计
- [ ] 筛选条件组合逻辑和查询构建器
- [ ] 性能优化：虚拟滚动、懒加载、防抖节流
- [ ] 组件复用性和可配置性设计
- [ ] 无障碍访问和键盘导航支持
- [ ] 单元测试和集成测试策略

### Studio - 机器人调试和自主性开发平台
- [ ] 基于 ROSBag Engine 的数据可视化集成
- [ ] 实时数据流处理和状态同步机制
- [ ] 机器人状态监控和调试工具设计
- [ ] 自主性算法调试和参数调优界面
- [ ] 多机器人协同调试和场景模拟
- [ ] 插件系统和第三方集成能力
- [ ] 用户权限管理和团队协作功能

### 开源项目技术架构
- [ ] 微前端架构在复杂平台中的应用
- [ ] 数据流管理和状态同步策略
- [ ] 实时通信和 WebSocket 集成
- [ ] 大文件处理和内存优化技术
- [ ] 跨平台兼容性和响应式设计
- [ ] 国际化支持和多语言切换
- [ ] 错误处理和用户反馈机制

### 开源项目工程化实践
- [ ] 多包管理策略和 Monorepo 架构
- [ ] 自动化测试和持续集成流程
- [ ] 文档生成和 API 文档维护
- [ ] 版本管理和发布流程自动化
- [ ] 依赖管理和安全漏洞扫描
- [ ] 性能监控和错误追踪系统
- [ ] 社区贡献指南和开发规范

## 工程化体系

### 构建工具
- [ ] Webpack 的核心概念：entry、output、loader、plugin
- [ ] 模块化规范：CommonJS、ES Module、AMD、UMD
- [ ] Tree Shaking 的原理和限制
- [ ] 代码分割的策略：入口分割、动态导入、SplitChunks
- [ ] SourceMap 的类型和选择
- [ ] Vite 的优势和与 Webpack 的区别
- [ ] Rollup 的特点和适用场景

### 质量保障
- [ ] ESLint 的配置和自定义规则
- [ ] Prettier 的代码格式化原理
- [ ] TypeScript 的编译配置和严格模式
- [ ] 测试分层：单元测试、集成测试、E2E 测试
- [ ] Jest/Vitest 的配置和使用
- [ ] React Testing Library 的测试理念
- [ ] Playwright/Cypress 的 E2E 测试策略

### 部署和监控
- [ ] CI/CD 流水线的设计和实践
- [ ] 容器化部署：Docker、Kubernetes
- [ ] 灰度发布和蓝绿部署的策略
- [ ] 前端监控的实现：错误监控、性能监控、用户行为分析
- [ ] 日志收集和分析
- [ ] 告警机制和故障排查

### 微前端和架构
- [ ] 微前端的概念和解决的问题
- [ ] Single-SPA、qiankun 的实现原理
- [ ] Module Federation 的使用和优势
- [ ] Monorepo 的管理策略：Lerna、Nx、Rush
- [ ] 组件库的设计和发布
- [ ] BFF（Backend for Frontend）模式

## 系统设计

### 设计思路
- [ ] 系统设计的基本步骤：需求分析、架构设计、详细设计、权衡分析
- [ ] 可扩展性、可用性、一致性的权衡
- [ ] 负载均衡和水平扩展策略
- [ ] 缓存策略的设计和一致性保证
- [ ] 数据库的选择和分库分表

### 前端系统设计
- [ ] 大型 SPA 应用的架构设计
- [ ] 组件库和设计系统的架构
- [ ] 状态管理的架构选择
- [ ] 路由设计和权限控制
- [ ] 性能优化的整体策略
- [ ] 可观测性的设计：监控、日志、链路追踪

### 具体场景
- [ ] 实时聊天系统的设计：WebSocket、消息队列、离线消息
- [ ] 大型列表/Feed 流的优化：虚拟滚动、分页、缓存
- [ ] 文件上传系统：分片上传、断点续传、进度显示
- [ ] 搜索系统：自动完成、搜索建议、结果排序
- [ ] 可视化大屏：数据处理、实时更新、性能优化

## 手写题实现

难度等级：
- 🟢 **基础**：初级前端必须掌握
- 🟡 **中等**：有一定经验要求，考查深度理解
- 🔴 **困难**：高级面试题，考查架构思维和极端情况处理

### 基础实现类（🟢）
- [ ] 实现 `call`、`apply`、`bind` 方法
- [ ] 实现 `new` 操作符
- [ ] 实现 `instanceof` 操作符
- [ ] 深拷贝实现（处理循环引用、特殊对象）
- [ ] 数组扁平化、去重、排序等基础方法
- [ ] 事件总线（EventBus）实现
- [ ] 单例模式实现
- [ ] 防抖（Debounce）和节流（Throttle）

### 异步编程类（🟡）
- [ ] Promise A+ 规范实现
- [ ] `async/await` 的 polyfill 实现
- [ ] 并发控制器（限制并发数量）
- [ ] 异步任务队列实现
- [ ] 超时控制和时间限制
- [ ] 重试机制实现
- [ ] 异步函数组合（pipe/compose）

### 数据结构类（🟡）
- [ ] LRU 缓存实现（Map vs 双向链表）
- [ ] 发布订阅模式（EventEmitter）
- [ ] 观察者模式实现
- [ ] 简单状态管理（Redux 核心）
- [ ] 双向绑定实现
- [ ] 虚拟列表实现
- [ ] 无限滚动实现

### 高阶应用类（🔴）
- [ ] 柯里化函数（支持占位符）
- [ ] 函数组合（pipe/compose）
- [ ] 虚拟 DOM 简单实现
- [ ] 简单路由实现
- [ ] 中间件模式实现
- [ ] 依赖注入容器
- [ ] 简单模板引擎

### 手写题考查要点
- [ ] 代码质量和规范性：变量命名、函数拆分、错误处理
- [ ] 边界情况处理：null/undefined、空数组、类型检查
- [ ] 性能考虑：时间复杂度、内存泄漏、优化策略
- [ ] 扩展性：代码是否易于扩展和维护
- [ ] 理解原理：不仅要会写，更要理解为什么这样实现

## 面试软技能

### 技术沟通
- [ ] 技术方案的表达：背景、方案、权衡、结果
- [ ] 复杂概念的简化解释
- [ ] 技术决策的理由和考量
- [ ] 开放性问题的思考框架

### 项目经验
- [ ] STAR 方法：Situation、Task、Action、Result
- [ ] 项目难点的识别和解决过程
- [ ] 技术选型的依据和权衡
- [ ] 团队协作和冲突处理
- [ ] 持续改进和学习总结

### 问题解决
- [ ] 调试技巧和工具使用
- [ ] 性能问题的定位和优化
- [ ] 线上故障的排查和处理
- [ ] 代码质量的保证和改进
- [ ] 技术债务的识别和清理

## 自检使用指南

### 每日检查（10-15分钟）
选择 3-5 个知识点进行快速自检：
- 能否在 2 分钟内清楚解释概念
- 能否举出 1-2 个实际应用场景
- 能否识别常见的误区或陷阱

### 每周深度检查（1-2小时）
选择 1-2 个模块进行深度检查：
- 画图解释复杂概念的工作原理
- 手写关键算法或代码实现
- 分析不同方案的优缺点和适用场景

### 模拟面试检查
- 随机选择知识点进行 5-10 分钟的详细讲解
- 模拟面试官的追问和深入提问
- 录制视频回放，分析表达的清晰度和逻辑性

### 手写题练习
- **基础题练习**：每天选择 1-2 道基础手写题，限时 15-20 分钟
- **进阶题挑战**：每周选择 1 道中等难度手写题，深入理解原理
- **综合题模拟**：每月进行 1 次完整的手写题模拟面试
- **代码审查**：完成手写题后，自我审查代码质量、边界处理和性能优化

### 查漏补缺计划
- 标记薄弱环节，制定专项学习计划
- 寻找相关资料和实践项目
- 定期重新检查直至完全掌握

---

> 知识点的掌握不在于能背诵概念，而在于能理解原理、分析场景、解决问题。通过持续的自检和实践，建立扎实的技术基础和解决问题的能力。

> **手写题特别提醒**：手写题不仅考查编程能力，更重要的是考查对底层原理的理解。通过大量练习，建立解决问题的思维模式和代码实现的最佳实践。建议从基础题开始，逐步挑战进阶题目，注重代码质量和边界情况处理。
