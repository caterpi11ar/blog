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
  str.substring(start, end) // 返回子字符串（不修改原字符串）
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

- [x] **Object** - 对象类型，所有对象的基类
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

- [x] **Array** - 数组类型，有序集合
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

- [x] **Function** - 函数类型
  - 问：函数本质是什么？为什么 `typeof` 对函数返回 `'function'`？
  - 答：
    - 函数是特殊的对象（Function 实例），可赋值、传参、返回
    - `typeof` 对实现了 `[[Call]]` 内部方法的对象返回 `'function'`，是对象里的唯一特例
    - 三种形态：函数声明（有提升）、函数表达式（无提升）、箭头函数（无自己的 `this`/`arguments`/`prototype`）

- [x] **Date** - 日期时间类型
  - 问：Date 有哪些常见的坑？
  - 答：
    - `new Date('2024-01-01')` 按 UTC 解析，`new Date('2024/01/01')` 按本地时区，结果能差一天
    - 月份从 0 开始：`new Date(2024, 0, 1)` 才是 1 月 1 日
    - `Date.now()` 返回毫秒时间戳；`+date1 - +date2` 直接得毫秒差
    - 复杂场景用 `dayjs` / `date-fns`，别手写时区

- [x] **RegExp** - 正则表达式类型
  - 问：JS 正则有哪些重要标志位和方法？
  - 答：
    - 标志位：`g` 全局、`i` 忽略大小写、`m` 多行、`s` dotAll、`u` Unicode、`y` 粘连
    - 带 `g` 的正则有 `lastIndex` 状态，多次调用 `test`/`exec` 会产生跳跃
    - `str.matchAll(regex)` 强制要求 `g` 标志
    - 命名捕获 `(?<name>...)`、零宽断言 `(?=)`/`(?!)`/`(?<=)`/`(?<!)`

- [x] **Error** - 错误对象类型
  - 问：JS 有哪些内置 Error 类型？自定义错误怎么写？
  - 答：
    - 内置：`Error`、`TypeError`、`RangeError`、`SyntaxError`、`ReferenceError`、`URIError`
    - 自定义继承 `Error` 时手动设置 `this.name`；ES2022 起可 `new Error(msg, { cause: err })` 链接原始错误
    - 异步错误：`try/catch` + `await` 或 `.catch()`；兜底 `onerror` / `onunhandledrejection`
    - `AggregateError` 用于 `Promise.any` 的合并错误

- [x] **Promise** - 异步操作结果类型
  - 问：Promise 有哪几种状态？静态方法有哪些？
  - 答：
    - 状态：`pending` → `fulfilled` / `rejected`，一旦落定不可逆
    - 并发：`Promise.all`（全部成功 / 任一失败短路）、`race`（首个落定）、`allSettled`（全部落定不短路）、`any`（首个成功）
    - `.then` 回调一定走微任务队列，不会同步执行
    - `Promise.resolve(thenable)` 会识别并适配鸭子类型的 thenable

- [x] **Proxy** - 代理对象类型
  - 问：Proxy 能拦截什么？和 `Object.defineProperty` 的区别？
  - 答：
    - 支持 13 种 trap：`get`/`set`/`has`/`deleteProperty`/`apply`/`construct` 等
    - 代理整个对象，新增属性、数组索引、`in`、`delete` 都能捕获；`defineProperty` 只拦截已知属性
    - Vue 3 响应式的核心，解决 Vue 2 数组方法和动态属性无法响应的问题
    - 无法代理 `#private` 字段，有一定性能开销

- [x] **Reflect** - 反射 API 对象
  - 问：Reflect 为什么存在？和直接用 Object 方法有什么区别？
  - 答：
    - 把原先挂在 Object 或语言层的操作收拢到统一命名空间
    - 返回值统一：失败返回布尔而不是抛异常（例如 `Reflect.defineProperty`）
    - 和 Proxy trap 一一对应，trap 内用 `Reflect.get(target, key, receiver)` 保持默认语义最稳
    - 和 Object 功能互补，不是替代关系

- [x] **Map** - 键值对映射类型
  - 问：Map 和 Object 有什么区别？什么时候用 Map？
  - 答：
    - 键可以是任意类型（包括对象、函数），Object 的键会被转成字符串或 Symbol
    - 有 `size`，遍历顺序等于插入顺序，可直接 `for...of`
    - 频繁增删性能优于 Object；键集合动态或不可预知时用 Map
    - 不能被 `JSON.stringify` 直接序列化

- [x] **Set** - 唯一值集合类型
  - 问：Set 常用来干什么？去重时为什么要注意 `NaN`？
  - 答：
    - 存唯一值，数组去重：`[...new Set(arr)]`
    - 相等判断用 SameValueZero：`NaN` 在 Set 里只会出现一次
    - 不能索引访问，只能 `has` 或迭代
    - 保持插入顺序

- [x] **WeakMap** / **WeakSet** - 弱引用集合类型
  - 问：弱引用集合为什么存在？和普通 Map/Set 的区别？
  - 答：
    - 键必须是对象，对键持弱引用，被 GC 回收后条目自动消失
    - 典型场景：给 DOM 节点挂元数据、缓存函数结果、模拟私有属性
    - 不可遍历、没有 `size`（否则会破坏 GC 时机的不确定性）
    - WeakSet 常用于"是否已处理"的标记，避免循环引用导致的内存泄漏

#### 类型检测与转换

- [x] **类型检测方法**
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

- [x] **类型转换规则**
  ```javascript
  // 隐式转换
  const result1 = `${1}2`; // '12' (数字转字符串)
  const result2 = '2' * 3 // 6 (字符串转数字)
  const result3 = 0 == false // true (数字转布尔)
  const result4 = undefined == null // true (特殊情况)

  // == vs === 的区别
  const eq1 = false == 0      // true (类型转换)
  const eq2 = false === 0     // false (严格相等)

  // + 操作符的类型转换
  const num1 = +'23';  // 23 (字符串转数字)
  const num2 = +true;  // 1 (布尔转数字)
  const num3 = +null;  // 0 (null转数字)
  const num4 = +undefined;  // NaN (undefined转数字)
  ```

- [x] **判断数组的方法**
  ```javascript
  // 1. Array.isArray() (推荐)
  const isArray1 = Array.isArray([])  // true

  // 2. instanceof
  const arr = []
  const isArray2 = arr instanceof Array  // true

  // 3. constructor
  const isArray3 = [].constructor === Array  // true

  // 4. Object.prototype.toString
  const isArray4 = Object.prototype.toString.call([]) === '[object Array]'  // true

  // 5. 鸭子类型判断
  function isArrayLike(obj) {
    return obj && typeof obj.length === 'number'
  }
  ```

- [x] **null vs undefined**
  ```javascript
  // undefined 的场景
  let value                    // 未初始化
  function fn(param) { } // 缺少参数
  // return;                      // 没有返回值的函数
  const obj = {}
  // obj.nonExistentProperty      // 不存在的属性

  // null 的场景
  let nullValue = null            // 明确表示空值
  JSON.stringify({key: null})     // 序列化时的空值
  Object.create(null)             // 创建无原型对象

  // 区别
  const typeUndefined = typeof undefined  // "undefined"
  const typeNull = typeof null            // "object"
  const eq1 = undefined == null   // true
  const eq2 = undefined === null  // false
  ```

### [迭代协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols)

- [x] **Iterable / Iterator 协议**
  - 问：`for...of` 是怎么跑起来的？一个对象怎样才算可迭代？
  - 答：
    - Iterable 协议：对象实现了 `[Symbol.iterator]()`，返回一个 Iterator
    - Iterator 协议：对象实现了 `next()`，返回 `{ value, done }`
    - 所有原生可迭代对象（Array、String、Map、Set、TypedArray、arguments、NodeList）都内置了 `[Symbol.iterator]`
    - 生成器函数（`function*`）返回的对象同时满足两个协议，最省事

- [x] **AsyncIterable / AsyncIterator 协议**
  - 问：`for await...of` 用在哪？
  - 答：
    - 异步迭代器 `next()` 返回 `Promise<{ value, done }>`
    - 典型场景：读大文件流、SSE、WebSocket 消息序列、分页接口
    - 异步生成器 `async function*` 天然实现该协议
    - Node.js 的 `Readable` 流实现了 `[Symbol.asyncIterator]`，可直接 `for await` 消费

### 作用域与闭包

- [x] 词法作用域 vs 动态作用域的概念
  - 问：JS 是词法作用域还是动态作用域？区别在哪？
  - 答：
    - 词法作用域（lexical scoping）：查找规则在代码书写位置就确定，JS 采用这种
    - 动态作用域：查找规则由调用栈决定，代表语言是 Bash
    - `this` 是 JS 里的例外，行为接近动态绑定

- [x] 执行上下文、作用域链的工作机制
  - 问：执行上下文里有什么？作用域链怎么形成？
  - 答：
    - 每次函数调用创建一个执行上下文，含变量环境（var/function）、词法环境（let/const）、`this`
    - 作用域链 = 当前词法环境 + 外层环境引用（`[[Environment]]`），一直链到全局
    - 函数的 `[[Environment]]` 在函数创建时就被固定，这就是闭包的底层机制

- [x] 变量提升（hoisting）的原理和注意事项
  - 问：什么是变量提升？`var`、`let`、`const`、`function` 提升行为有什么差异？
  - 答：
    - `var` 声明提升且初始化为 `undefined`；`function` 声明整个函数体提升
    - `let`/`const` 也会被"词法提升"到块顶部，但未初始化前访问即 TDZ 报错
    - 函数表达式（`var f = function...`）只提升变量声明，不提升函数体
    - 同名 `function` 和 `var` 冲突时，函数声明胜出

- [x] 暂时性死区（TDZ）及其作用
  - 问：什么是暂时性死区？它解决了什么问题？
  - 答：
    - 从块起点到 `let`/`const` 声明语句之间访问变量会抛 `ReferenceError`
    - 避免了 `var` 提升后"先用后声明"的隐蔽 bug
    - 对开发者的直接好处：强制声明提前、保证变量在使用时已经初始化

- [x] 闭包的形成条件、应用场景和潜在问题
  - 问：闭包什么时候产生？常见用途和陷阱是什么？
  - 答：
    - 条件：函数访问了外层作用域的变量，并被带出原作用域继续使用
    - 用途：模块私有状态、柯里化、缓存（memoize）、事件回调里保留数据
    - 陷阱：循环里 `var` + setTimeout 捕获同一变量（用 `let` 或 IIFE 解决）、持有 DOM 引用造成内存泄漏

- [x] 立即执行函数（IIFE）的作用和使用场景
  - 问：ES6 模块普及后，IIFE 还有什么用？
  - 答：
    - 经典用途：ES5 时代避免全局污染、模拟块级作用域
    - 现代用途：在顶层立刻跑一段 `async` 逻辑（`(async () => { ... })()`）
    - UMD / 类库打包产物里仍常见

### this 绑定机制

- [x] this 的四种绑定规则：默认、隐式、显式、new 绑定
  - 问：按优先级排列，this 的绑定规则是哪四种？
  - 答：
    - 优先级从高到低：new > 显式（`call`/`apply`/`bind`）> 隐式（`obj.fn()`）> 默认（严格模式 `undefined`，非严格指向全局）
    - `new` 会忽略 bind 之外的显式绑定
    - 箭头函数不参与这套规则，直接沿用外层 `this`

- [x] 箭头函数的 this 绑定特点
  - 问：箭头函数和普通函数在 this 上有什么不同？
  - 答：
    - 箭头函数没有自己的 `this`、`arguments`、`super`、`new.target`、`prototype`，不能 `new`
    - `this` 在定义时就锁定为外层作用域的 `this`
    - 常用于回调里保持外层 `this`，替代 `.bind(this)` 或 `const self = this`

- [x] `call`、`apply`、`bind` 的区别和实现原理
  - 问：这三个方法都能改 this，具体差异是什么？
  - 答：
    - `call(thisArg, a, b)`：立即调用，参数逐个传
    - `apply(thisArg, [a, b])`：立即调用，参数数组传（动态参数场景方便）
    - `bind(thisArg, a)`：返回新函数不立即调用，支持偏应用
    - 手写要点：`Symbol` 做临时属性避免污染、`new` 时忽略 bind 的 this

- [x] 严格模式对 this 的影响
  - 问：严格模式下 this 有什么变化？
  - 答：
    - 默认绑定不再指向全局对象，而是 `undefined`
    - 传入 `call(null)` / `call(undefined)` 不会被强制转成全局对象
    - ES Module 和 class 代码默认就是严格模式

- [x] 在不同场景下 this 的指向判断
  - 问：碰到一段代码怎么快速推断 this？
  - 答：
    - 先看是不是箭头函数——是就找外层
    - 看是不是 `new`——是就指新对象
    - 看有没有 `call`/`apply`/`bind`——有就看传入值（注意 bind 只生效一次）
    - 看调用形式 `obj.fn()`——this 是 `obj`；裸调用 `fn()` 走默认规则
    - 回调独立调用、`setTimeout` 传方法都会丢 this

### 原型与继承

- [x] `__proto__` 与 `prototype` 的区别和关系
  - 问：这两个属性分别属于谁？关系是什么？
  - 答：
    - `prototype` 是函数独有的属性，指向一个对象，用于作为 `new` 出实例的原型
    - `__proto__` 是每个对象都有的访问器，指向其原型（内部 `[[Prototype]]`）
    - 关系：`new Foo()` 实例的 `__proto__ === Foo.prototype`
    - 现代写法用 `Object.getPrototypeOf` / `Object.setPrototypeOf` 替代 `__proto__`

- [x] 原型链的查找机制和终点
  - 问：访问属性是怎么沿原型链查的？终点在哪里？
  - 答：
    - 自身属性优先，找不到沿 `__proto__` 逐级向上
    - 终点：`Object.prototype.__proto__ === null`
    - `Object.create(null)` 创建的对象没有原型，可用作纯字典避免污染

- [x] `instanceof` 操作符的工作原理
  - 问：`a instanceof B` 是怎么判断的？
  - 答：
    - 沿 `a` 的原型链查找，只要某一层 `=== B.prototype` 就返回 true
    - 跨 iframe / Realm 会失效（不同 Realm 的 `Array` 是不同构造函数）
    - 可被 `Symbol.hasInstance` 自定义覆盖
    - 判断数组优先用 `Array.isArray`

- [x] 几种继承模式：原型继承、构造函数继承、组合继承、寄生组合继承
  - 问：ES5 时代的继承方案有哪些？各自的毛病？
  - 答：
    - 原型继承：`Child.prototype = new Parent()`，引用类型共享、无法传参
    - 构造函数继承：子类里 `Parent.call(this)`，能传参但继承不了原型方法
    - 组合继承：两者叠加，缺点是父构造函数被调用两次
    - 寄生组合继承：`Child.prototype = Object.create(Parent.prototype)`，只调一次父构造函数，ES5 最优解

- [x] ES6 class 的本质及与构造函数的区别
  - 问：`class` 是语法糖还是有实质区别？
  - 答：
    - 本质仍是基于原型的构造函数，`typeof Class === 'function'`
    - 实质差异：class 默认严格模式、不可枚举的方法、必须 `new` 调用、存在 TDZ、支持 `extends`/`super`
    - 字段声明和私有字段 `#x` 是语法层面的真正新增（不能用纯原型模拟）

- [x] `Object.create`、`Object.setPrototypeOf` 的使用
  - 问：这两个方法分别什么时候用？
  - 答：
    - `Object.create(proto)`：以 `proto` 为原型创建新对象，做寄生组合继承或无原型字典 `Object.create(null)`
    - `Object.setPrototypeOf(obj, proto)`：运行时修改原型，性能差，除非必要少用
    - 优先在构造阶段用 `Object.create`，不要事后 `setPrototypeOf`

### 异步编程

- [x] JavaScript 运行时模型：Call Stack、Web APIs、Callback Queue、Event Loop
  - 问：一段异步代码是怎么被调度的？
  - 答：
    - 调用栈（Call Stack）同步执行；遇到定时器、IO、fetch 交给宿主的 Web APIs / Node APIs
    - 回调就绪后按类型进宏任务队列或微任务队列
    - Event Loop：调用栈空 → 执行所有微任务 → 取一个宏任务 → 再清空微任务，如此往复

- [x] 宏任务（macrotask）与微任务（microtask）的执行顺序
  - 问：微任务和宏任务分别包含什么？谁先跑？
  - 答：
    - 微任务：`Promise.then`、`queueMicrotask`、`MutationObserver`
    - 宏任务：`setTimeout`、`setInterval`、I/O、`setImmediate`（Node）、UI rendering、`MessageChannel`
    - 每跑完一个宏任务（或首个同步脚本），会清空全部微任务队列再进入下一轮

- [x] Promise 的状态机制和链式调用原理
  - 问：`.then` 怎么实现链式？回调怎么接住上一个结果？
  - 答：
    - `.then` 返回新 Promise，回调返回值会被 `Promise.resolve()` 包装后 resolve 新 Promise
    - 回调抛错会导致新 Promise reject，链式里任意一环可 `.catch`
    - 返回 Promise 会被自动 unwrap（thenable 适配）

- [x] `async/await` 的语法糖本质和错误处理
  - 问：`async/await` 背后是什么？错误怎么处理？
  - 答：
    - 本质是 Promise + 生成器的语法糖，遇到 `await` 把剩余代码挂成回调
    - `async` 函数总是返回 Promise
    - 错误处理用 `try/catch`；多个并发 await 用 `Promise.all` 更快
    - 顶层 await 仅在 ESM 支持

- [x] 并发控制：`Promise.all`、`Promise.race`、`Promise.allSettled`、`Promise.any`
  - 问：这四个方法怎么选？
  - 答：
    - `all`：要求全部成功，任意失败立即短路拒绝，常用于并行请求
    - `race`：首个落定（成功或失败）即结束，常用于加超时
    - `allSettled`：全部等完，返回各自 `{ status, value/reason }`，适合批量任务想看全貌
    - `any`：首个成功即结束，全失败抛 `AggregateError`，适合做 failover

- [x] Node.js 事件循环与浏览器的差异
  - 问：Node.js 的事件循环阶段有哪些？和浏览器有什么不同？
  - 答：
    - 阶段：timers → pending callbacks → idle/prepare → poll → check（`setImmediate`）→ close callbacks
    - 微任务在每个阶段之间清空（Node 11+ 对齐浏览器行为）
    - `process.nextTick` 优先级高于 Promise 微任务
    - `setImmediate` vs `setTimeout(fn, 0)`：在 I/O 回调里 `setImmediate` 总先执行

### 函数式编程

- [x] 高阶函数的概念和应用
  - 问：什么是高阶函数？举几个用处？
  - 答：
    - 接收函数作参数或返回函数的函数
    - 例子：`map`/`filter`/`reduce`、防抖节流、中间件、React HOC、装饰器
    - 好处：把"怎么做"和"做什么"解耦

- [x] 柯里化（Currying）和偏应用（Partial Application）
  - 问：柯里化和偏应用区别是什么？
  - 答：
    - 柯里化：把 `f(a, b, c)` 变成 `f(a)(b)(c)`，每次只接一个参数
    - 偏应用：固定前几个参数，一次调用接剩余多个参数
    - 共同用途：预置参数、配置化 API；`bind` 本质是偏应用

- [x] 函数组合（Function Composition）
  - 问：`compose` 和 `pipe` 有什么区别？
  - 答：
    - `compose(f, g)(x) === f(g(x))`，从右往左执行
    - `pipe(f, g)(x) === g(f(x))`，从左往右，更符合阅读顺序
    - Redux 中间件、Koa 洋葱模型都基于函数组合

- [x] 纯函数的概念和优势
  - 问：纯函数的要求是什么？带来什么好处？
  - 答：
    - 相同输入必然相同输出、无副作用（不改外部状态、不依赖外部可变状态）
    - 好处：可缓存（memoize）、可测试、可并行、可推理
    - React 的函数组件、Redux reducer 都追求纯函数

- [x] 防抖（debounce）和节流（throttle）的实现和应用场景
  - 问：防抖和节流分别是什么？用在哪？
  - 答：
    - 防抖：触发 N ms 内再次触发就重新计时，只有安静 N ms 后才执行——搜索联想、窗口 resize
    - 节流：固定每 N ms 最多执行一次——滚动加载、鼠标拖拽、高频埋点
    - 实现要点：保存 timer、必要时支持 leading/trailing、取消方法

## TypeScript 类型系统

### 基础类型系统

- [x] 基础类型：`string`、`number`、`boolean`、`array`、`tuple`、`enum`、`any`、`unknown`、`void`、`never`
  - 问：`any`、`unknown`、`never`、`void` 怎么选？
  - 答：
    - `any` 关掉类型检查，尽量避免；`unknown` 是安全的 `any`，用前必须先收窄
    - `void` 表示函数无返回值；`never` 表示函数永不返回（抛错 / 死循环）
    - `never` 是所有类型的子类型，常用于穷尽性检查（`exhaustiveness check`）

- [x] 联合类型和交叉类型的使用场景
  - 问：`A | B` 和 `A & B` 有什么区别？
  - 答：
    - 联合：值可以是多种之一，用前需要收窄（typeof / in / 判别式）
    - 交叉：同时满足多个类型（常见于对象合并类型）
    - 对基础类型做交叉会得到 `never`（如 `string & number`）

- [x] 类型断言的使用和风险
  - 问：`as` 断言什么时候用？有什么坑？
  - 答：
    - 使用：你比编译器更了解类型时，比如 DOM API 返回值
    - 风险：绕过检查，断言错就运行时炸
    - `as const`：把字面量类型进一步锁死，常用于枚举替代和 `readonly tuple`
    - 双重断言 `as unknown as T` 是最后手段，代码 review 要警惕

- [x] 字面量类型和类型收窄
  - 问：字面量类型怎么触发类型收窄？
  - 答：
    - 字面量类型：`'success' | 'error'` 这种具体值的类型
    - 收窄手段：`typeof`、`instanceof`、`in`、判别式字段（discriminated union）
    - 判别式联合是建模状态机最干净的方式

- [x] 可选属性和只读属性
  - 问：`?` 和 `readonly` 分别表达什么？
  - 答：
    - `?` 表示属性可能是 `undefined`，访问需要收窄
    - `readonly` 只在编译期阻止赋值，运行时不会阻止
    - `Readonly<T>` / `Required<T>` / `Partial<T>` 可成对使用做类型变换

### 高级类型特性

- [x] 泛型的概念、约束和默认类型参数
  - 问：泛型约束（extends）和默认参数什么时候用？
  - 答：
    - 约束：`<T extends { id: number }>` 保证 T 至少有某些属性才能用
    - 默认参数：`<T = string>` 调用时可省略
    - 多个泛型参数可互相依赖：`<K extends keyof T>`

- [x] 条件类型的语法和应用场景
  - 问：`T extends U ? X : Y` 能解决什么问题？
  - 答：
    - 类型层面的 if-else，配合 `infer` 可做类型抽取
    - 当 T 是联合时会分布式展开（`Distributive Conditional Type`）
    - 用 `[T] extends [U]` 可以关闭分布式

- [x] 映射类型的实现原理
  - 问：`[K in keyof T]` 能做什么？
  - 答：
    - 遍历键，生成新类型：`Readonly`、`Partial`、`Pick` 都是映射类型
    - 修饰符前缀：`+readonly` / `-readonly`、`+?` / `-?` 可增减
    - 结合 `as` 子句可做 key 重映射：`[K in keyof T as \`on\${Capitalize<K & string>}\`]: ...`

- [x] 模板字面量类型的使用
  - 问：模板字面量类型能干什么？
  - 答：
    - 在类型层面拼字符串：`` `get${Capitalize<K>}` ``
    - 配合联合分布可生成大量字面量组合
    - 常用于路径类型、事件名类型、CSS-in-TS 的键名

- [x] `infer` 关键字的作用和使用方法
  - 问：`infer` 一般怎么用？
  - 答：
    - 只能出现在条件类型的 `extends` 右边，用于"占位并推断"
    - 经典例子：`ReturnType<T> = T extends (...args: any) => infer R ? R : never`
    - 可以 `infer` 出数组元素、Promise 解包、函数参数等

### 工具类型和类型操作

- [x] 内置工具类型：`Partial`、`Required`、`Pick`、`Omit`、`Exclude`、`Extract`、`NonNullable`、`Record`
  - 问：这几个工具类型各自干什么？
  - 答：
    - `Partial<T>` / `Required<T>`：所有属性变可选 / 必填
    - `Pick<T, K>` / `Omit<T, K>`：挑选 / 排除若干键
    - `Exclude<T, U>` / `Extract<T, U>`：联合里排除 / 提取
    - `NonNullable<T>`：去掉 `null` 和 `undefined`
    - `Record<K, V>`：构造键类型为 K、值类型为 V 的对象

- [x] 自定义工具类型的实现
  - 问：怎么写自己的工具类型？举个例子。
  - 答：
    - `DeepReadonly<T>`：递归映射所有属性为 `readonly`
    - `Mutable<T>`：去掉 readonly（`-readonly`）
    - `XOR<A, B>`：A、B 二选一
    - 写的时候多利用映射 + 条件 + `infer` 三件套

- [x] 分布式条件类型的特性
  - 问：什么是分布式条件类型？
  - 答：
    - 当条件类型左边是泛型裸参数且是联合类型时，会对联合每个分支分别计算
    - 例子：`Exclude<'a' | 'b', 'a'> = 'b'`
    - 关闭分布式：用 `[T] extends [U]` 包一层

- [x] 协变和逆变的概念
  - 问：函数参数是协变还是逆变？
  - 答：
    - 协变：类型位置跟着子类型走（返回值位置）
    - 逆变：跟子类型相反（函数参数位置，严格模式下）
    - TypeScript 默认函数参数双变（bivariant），开 `strictFunctionTypes` 后参数变逆变
    - 实际意义：确保子类可替代父类时函数调用安全

- [x] 类型兼容性和结构化类型系统
  - 问：TS 的"鸭子类型"是什么意思？
  - 答：
    - 结构化类型：只要形状（属性、方法）兼容就视为兼容，不看名义
    - 后果：完全无关的两个 interface 只要结构一致就能互相赋值
    - 需要名义类型时用品牌类型（`{ __brand: 'UserId' } & string`）模拟

## React 核心原理

### 组件和生命周期

- [x] 函数组件 vs 类组件的区别和选择
  - 问：现在为什么默认选函数组件？
  - 答：
    - 语法更简洁，天生支持 Hooks
    - 没有 `this` 绑定的心智负担
    - 更容易抽象自定义 Hook 和做代码复用
    - 类组件仍用于 Error Boundary（目前 hooks 无替代）

- [x] React 生命周期方法及其使用场景
  - 问：类组件常用生命周期有哪些？分别做什么？
  - 答：
    - 挂载：`constructor` → `getDerivedStateFromProps` → `render` → `componentDidMount`
    - 更新：`getDerivedStateFromProps` → `shouldComponentUpdate` → `render` → `getSnapshotBeforeUpdate` → `componentDidUpdate`
    - 卸载：`componentWillUnmount`
    - 错误：`getDerivedStateFromError` / `componentDidCatch`

- [x] `componentDidMount`、`componentDidUpdate`、`componentWillUnmount` 的常见用法
  - 问：这三个钩子通常干什么？
  - 答：
    - `componentDidMount`：请求数据、订阅事件、初始化第三方库
    - `componentDidUpdate`：依赖 props/state 变化的副作用，需要条件判断避免死循环
    - `componentWillUnmount`：清理定时器、取消订阅、解绑事件
    - 对应到 hooks：`useEffect(() => { ... return cleanup }, deps)`

- [x] `getDerivedStateFromProps` 和 `getSnapshotBeforeUpdate` 的使用场景
  - 问：这两个新生命周期解决了什么问题？
  - 答：
    - `getDerivedStateFromProps`：静态方法，只在 props 改变时同步 state，替代过时的 `componentWillReceiveProps`
    - `getSnapshotBeforeUpdate`：在 DOM 更新前读取旧 DOM 信息（如滚动位置），结果传给 `componentDidUpdate`
    - 二者都是为 Concurrent Mode 设计的纯函数/无副作用钩子

- [x] 错误边界（Error Boundaries）的实现和应用
  - 问：Error Boundary 怎么写？能捕获什么？
  - 答：
    - 必须是类组件，实现 `static getDerivedStateFromError` 或 `componentDidCatch`
    - 捕获子树渲染、生命周期和构造函数里的错误
    - 捕获不了：事件处理、异步代码、服务端渲染、自身错误——需要手动 `try/catch`
    - React 18 支持和 Suspense 联动做渐进降级

### Hooks 原理和最佳实践

- [x] Hooks 的设计动机和解决的问题
  - 问：为什么要引入 Hooks？
  - 答：
    - 类组件复用逻辑难（HOC 嵌套、render props 套娃）
    - 生命周期散落相关逻辑（一个功能要分在 didMount / didUpdate / willUnmount）
    - `this` 绑定 / 类语法对优化不友好
    - Hooks 让副作用按关心的事情分组、让逻辑以自定义 hook 复用

- [x] `useState` 的工作原理和批量更新机制
  - 问：`useState` 怎么在多次渲染间保持状态？批量更新发生在什么时候？
  - 答：
    - React 按调用顺序把 state 存在 fiber 节点上的链表
    - 这就是 Hooks 必须按顺序调用、不能写在条件里的原因
    - React 18 在所有场景（定时器、Promise）默认自动批量更新
    - 连续 `setState(n + 1)` 会合并；要基于最新值用函数式 `setState(prev => prev + 1)`

- [x] `useEffect` 的执行时机和依赖数组规则
  - 问：`useEffect` 什么时候跑？依赖数组怎么写？
  - 答：
    - 在浏览器 paint 之后异步执行，不阻塞渲染
    - 依赖数组：空数组只跑一次、省略每次都跑、列出的变量变更才跑
    - 所有在 effect 内用到的外部值都要放进依赖（用 ESLint 的 `react-hooks/exhaustive-deps` 保底）
    - 返回的 cleanup 函数在下一次 effect 前或卸载时运行

- [x] `useLayoutEffect` 与 `useEffect` 的区别
  - 问：什么时候用 `useLayoutEffect`？
  - 答：
    - `useLayoutEffect` 在浏览器 paint 之前同步执行，可读 DOM 尺寸避免闪烁
    - 常见场景：测量 DOM、调整滚动位置、避免布局跳动
    - 副作用：会阻塞绘制，性能敏感时用 `useEffect`

- [x] `useMemo` 和 `useCallback` 的使用场景和注意事项
  - 问：这两个是不是"默认要加"？
  - 答：
    - 不是默认加。只在有明确收益时用（大列表计算、传给 `React.memo` 子组件的引用）
    - 错误用法：包一个简单对象/函数反而增加内存和比较成本
    - 依赖数组同 `useEffect`，错误依赖导致陈旧闭包
    - React 19 的编译器（React Compiler）能自动帮你做，手写需求会越来越少

- [x] `useRef` 的多种用法：DOM 引用、可变值存储
  - 问：`useRef` 还有什么非 DOM 用途？
  - 答：
    - 挂 DOM 引用：`<input ref={ref} />`
    - 保存跨渲染的可变值（不想触发重渲染时替代 state）
    - 配合 `forwardRef` + `useImperativeHandle` 暴露子组件方法
    - 修改 `ref.current` 不会触发重渲染

- [x] 自定义 Hooks 的设计原则和最佳实践
  - 问：写自定义 Hook 要注意什么？
  - 答：
    - 名字以 `use` 开头（便于 ESLint 识别）
    - 职责单一，返回结构稳定（优先返回对象/数组，便于解构）
    - 副作用隔离、清理干净
    - 不要在自定义 hook 里吞掉错误，让调用方处理

- [x] Hooks 规则的原因和底层实现
  - 问：为什么 Hooks 必须在顶层按相同顺序调用？
  - 答：
    - React 用"调用顺序"作为 state 的标识键（链表索引）
    - 条件调用会导致索引错位，拿到别的 state
    - 规则由 ESLint 插件 `react-hooks/rules-of-hooks` 静态校验

### 虚拟 DOM 和 Diff 算法

- [x] 虚拟 DOM 的概念和优势
  - 问：虚拟 DOM 真的更快吗？它的价值在哪？
  - 答：
    - 不是一定更快，但把 DOM 操作变成"声明式 + 批量化"
    - 核心价值：跨平台（React Native、Canvas 等）、更好的心智模型、允许做并发调度
    - 对比原生操作：精细控制能更快，但开发成本高

- [x] React Diff 算法的三个假设和优化策略
  - 问：React 是怎么把 O(n³) 的 diff 降到 O(n) 的？
  - 答：
    - 假设 1：不同类型节点产生不同子树，不再深入对比
    - 假设 2：同层比较，跨层移动视为删除重建
    - 假设 3：开发者通过 `key` 提示哪些节点保持同一性
    - 优化：按层遍历、用 key 进行索引匹配

- [x] key 的作用机制和最佳实践
  - 问：`key` 为什么不能用 index？
  - 答：
    - `key` 让 React 在同层识别"这还是原来那个节点"
    - 用 index 当列表顺序变化时会导致状态错位、输入框跳失
    - 最佳实践：用稳定的业务 id；静态不变列表用 index 问题不大
    - 动态增删时尤其要用稳定 key

- [x] 单节点 Diff 和多节点 Diff 的处理逻辑
  - 问：单节点和多节点 diff 有什么不同？
  - 答：
    - 单节点：比较 type + key，相同复用、不同删重建
    - 多节点：第一轮按位置逐个对比，遇到 key 不匹配停止；第二轮用 Map 按 key 查找复用
    - 移动判断靠"最后可复用位置"（lastPlacedIndex）

- [x] React 18 中 Diff 算法的改进
  - 问：React 18 对 diff / 调度做了什么？
  - 答：
    - 并发渲染：diff 过程可被中断让高优先级任务插入
    - 自动批处理扩大到异步场景
    - `useTransition` / `useDeferredValue` 让开发者显式标记低优任务
    - `startTransition` 下的渲染可被丢弃

### Fiber 架构和调度

- [x] Fiber 的设计目标和解决的问题
  - 问：为什么要从 Stack Reconciler 换成 Fiber？
  - 答：
    - 老的递归 reconcile 不可中断，长列表会卡主线程
    - Fiber 把组件树变成可遍历的链表节点，渲染可分片、可中断、可恢复
    - 支持优先级调度和并发特性

- [x] Fiber 数据结构：type、key、props、stateNode、alternate
  - 问：Fiber 节点上常见字段有哪些？
  - 答：
    - `type`/`key`/`props`：描述当前节点
    - `stateNode`：宿主实例（DOM 或类组件实例）
    - `child` / `sibling` / `return`：形成链表树
    - `alternate`：指向对方缓存树中的对应节点
    - `flags`（原 effectTag）：标记更新类型（Placement、Update、Deletion）

- [x] 双缓存机制：current 树和 workInProgress 树
  - 问：React 为什么维护两棵 Fiber 树？
  - 答：
    - `current` 树：屏幕当前展示的
    - `workInProgress` 树：正在构建的下一次版本
    - 构建完后整棵替换（commit），避免中间状态被用户看到
    - 两棵树通过 `alternate` 互相指向，节点可复用

- [x] 时间片调度和可中断渲染
  - 问：时间片是怎么实现不卡主线程的？
  - 答：
    - React 在每个 Fiber 单元完成后检查是否超过 5ms 时间片
    - 用 `MessageChannel` 把剩余工作让渡回浏览器，下一帧再继续
    - 高优更新可打断当前渲染，丢弃 WIP 重新开始

- [x] 优先级调度：lanes 模型和优先级更新
  - 问：lanes 模型是什么？
  - 答：
    - 用 31 位位图表示优先级集合（同步、连续输入、过渡、空闲等）
    - 一次渲染可处理多个 lane，通过位运算合并 / 过滤
    - 替代了老的 expirationTime，表达力更强、合并更灵活

- [x] 并发特性：Concurrent Mode、Suspense、startTransition
  - 问：React 18 的并发特性怎么用？
  - 答：
    - `createRoot` 开启并发渲染
    - `Suspense`：声明式异步加载，配合 lazy 或数据库预取库（如 Relay）
    - `useTransition` / `startTransition`：把低优更新打标，给用户输入等高优让路
    - `useDeferredValue`：对某个值做"延迟版本"，减少高频输入的渲染

### 状态管理和数据流

- [x] React 单向数据流的特点
  - 问：单向数据流是什么意思？
  - 答：
    - 数据只能父传子，子通过回调通知父
    - 好处：可预测、调试容易、避免循环依赖
    - 跨层共享需要状态提升或 Context / 第三方状态管理

- [x] 状态提升和状态下沉的场景
  - 问：什么时候提升、什么时候下沉？
  - 答：
    - 多个兄弟组件共享同一状态 → 提升到最近公共祖先
    - 只有某个子组件使用的局部状态 → 下沉到该子组件，减少父重渲染
    - 过度提升会让无关组件跟着重渲染

- [x] Context API 的使用和性能考虑
  - 问：Context 为什么被诟病有性能问题？
  - 答：
    - Context value 变化会让所有消费者重渲染，无法细粒度订阅
    - 缓解：拆分多个 Context、用 `useMemo` 稳定 value、`React.memo` 阻隔
    - 大规模数据建议用专门状态库（Zustand、Jotai、Redux）

- [x] Redux 的设计原则和中间件机制
  - 问：Redux 三原则是什么？中间件怎么工作？
  - 答：
    - 三原则：单一数据源、state 只读、通过纯函数 reducer 修改
    - 中间件是 `store => next => action => ...` 的洋葱模型，可拦截 action
    - 常见中间件：`redux-thunk`（函数式异步）、`redux-saga`（generator）、`redux-toolkit` 的 `createAsyncThunk`
    - 今天官方推荐 Redux Toolkit，用 Immer 写"可变"代码

- [x] React Query/SWR 的缓存策略和数据同步
  - 问：Query 类库解决了什么问题？
  - 答：
    - 把"服务端状态"从组件里剥离：缓存、去重、重试、失效、刷新
    - 策略：`staleTime`（多久视为新鲜）、`cacheTime`（内存保留时长）、`refetchOnWindowFocus`
    - 乐观更新：本地先改、失败回滚
    - 和 Redux 分工：服务端状态归 Query，客户端状态归 Redux/Zustand/Context

## 浏览器原理

### 渲染流水线

- [x] 浏览器渲染过程：解析 → 样式 → 布局 → 绘制 → 合成
  - 问：从拿到 HTML 到屏幕显示中间发生了什么？
  - 答：
    - 解析 HTML 建 DOM、解析 CSS 建 CSSOM
    - 合并得到 Render Tree，只包含可见节点
    - Layout（回流）计算盒模型位置尺寸
    - Paint 把每个节点画到各自图层
    - Composite（合成）把图层交给 GPU 合成最终画面

- [x] HTML 解析和 DOM 构建过程
  - 问：HTML 解析是流式的还是一次性的？遇到 `<script>` 会怎样？
  - 答：
    - 流式解析，边下载边构建 DOM
    - 默认 `<script>` 会阻塞解析
    - `async`：下载不阻塞、执行时阻塞（执行顺序不定）
    - `defer`：下载不阻塞、解析完成后按顺序执行
    - `<link rel="preload">` 可提前下载关键资源

- [x] CSS 解析和 CSSOM 构建
  - 问：CSS 为什么会阻塞渲染？
  - 答：
    - CSSOM 未构建完不能生成 Render Tree
    - 且 CSS 可能影响 JS 执行（JS 可读样式），所以也阻塞 JS 执行
    - 优化：拆关键 CSS 放 inline、非关键 CSS 用 `media` 或 `preload` 延迟

- [x] 渲染树（Render Tree）的构建过程
  - 问：Render Tree 和 DOM 的差别？
  - 答：
    - Render Tree 只含可见节点，`display:none` 不参与
    - `visibility:hidden` 在，但不可见
    - 每个节点有计算后样式和盒子信息

- [x] 布局（Layout/Reflow）的触发条件和优化
  - 问：什么操作会触发回流？怎么减少？
  - 答：
    - 触发：尺寸/位置变化、添加删除 DOM、读取布局属性（offsetTop 等）强制同步布局
    - 优化：批量 DOM 修改、用 `transform` 替代改 left/top、避免循环里读写布局
    - `requestAnimationFrame` + 批量读写分离

- [x] 绘制（Paint）和复合（Composite）的层级关系
  - 问：合成层为什么性能好？
  - 答：
    - Paint 是 CPU 工作，合成交给 GPU 单独线程
    - 合成层只需在主线程外做纹理变换（平移、旋转、透明度）
    - 触发合成层的属性：`transform`、`opacity`、`will-change`、`<video>`、`<canvas>`

### 性能优化

- [x] 回流（Reflow）和重绘（Repaint）的区别和优化策略
  - 问：回流和重绘哪个更贵？怎么避免？
  - 答：
    - 回流一定触发重绘，重绘不一定触发回流
    - 回流更贵（涉及布局计算）
    - 优化：`transform`/`opacity` 走合成层不回流不重绘；批处理样式改动用 class 切换

- [x] CSS 包含块和层叠上下文的概念
  - 问：什么是层叠上下文？谁会产生新的？
  - 答：
    - 层叠上下文（stacking context）决定 z-index 的比较范围
    - 产生条件：`position` 非 static + z-index 非 auto、`opacity < 1`、`transform`、`filter`、`will-change` 等
    - 子元素不会"穿越"父层叠上下文抢占 z-index

- [x] 硬件加速和合成层的触发条件
  - 问：怎么显式启用硬件加速？
  - 答：
    - 最稳妥：`transform: translateZ(0)` 或 `will-change: transform`
    - 不要乱加 `will-change`，会创建过多合成层占显存
    - Chrome DevTools Layers 面板可查看合成层

- [x] `will-change` 属性的使用和注意事项
  - 问：`will-change` 什么时候加、什么时候拿掉？
  - 答：
    - 仅对即将发生动画的元素加，让浏览器提前预备
    - 动画结束后用 JS 移除，避免长期占用内存
    - 避免对父级全量开启（会下沉整棵子树）

- [x] 关键渲染路径的优化策略
  - 问：关键渲染路径优化哪几点？
  - 答：
    - 缩减关键资源数量（合并小文件、按需加载）
    - 减小关键资源大小（gzip/brotli、图片压缩）
    - 缩短关键路径长度（HTTP/2 多路复用、inline critical CSS）
    - `preload` 预取首屏字体、关键 JS

- [x] Web Vitals 指标：LCP、FID、CLS、FCP、TTFB
  - 问：核心 Web Vitals 分别衡量什么？
  - 答：
    - LCP（Largest Contentful Paint）：首个最大可视内容渲染时间，2.5s 以内为好
    - FID / INP：首次交互延迟 / 交互到下一次绘制，INP 已替代 FID
    - CLS（Cumulative Layout Shift）：累积布局偏移，0.1 以内为好
    - FCP：首次内容绘制
    - TTFB：首字节时间，受服务器和网络影响

### 缓存机制

- [x] 强缓存：`Cache-Control` 和 `Expires` 的区别
  - 问：强缓存这两个头区别在哪？
  - 答：
    - `Expires` 是 HTTP/1.0，绝对时间，受客户端时钟影响
    - `Cache-Control: max-age=3600` 是 HTTP/1.1，相对时间，优先级更高
    - 常用指令：`no-cache`（协商缓存）、`no-store`（不缓存）、`public`/`private`、`immutable`

- [x] 协商缓存：`ETag`/`If-None-Match` 和 `Last-Modified`/`If-Modified-Since`
  - 问：两套协商缓存头哪个更精确？
  - 答：
    - `Last-Modified` 秒级精度，相同秒内修改检测不到
    - `ETag` 基于内容哈希，更精确但计算开销
    - 并存时 `ETag` 优先
    - 命中协商缓存返回 304，不带 body

- [x] 缓存策略的选择和最佳实践
  - 问：SPA 里不同资源该怎么缓存？
  - 答：
    - 带 hash 的静态资源：`Cache-Control: max-age=31536000, immutable`
    - HTML 入口：`no-cache` 或短 max-age，让用户拿到最新资源清单
    - API：按业务需求，默认 `no-store` 或按 ETag 协商
    - Service Worker 做离线兜底

- [x] Service Worker 的缓存控制
  - 问：Service Worker 怎么做缓存？有哪些策略？
  - 答：
    - 注册后作为网络代理，拦截 fetch
    - 策略：Cache First、Network First、Stale While Revalidate、Network Only、Cache Only
    - Workbox 提供现成策略和预缓存能力
    - 注意更新机制：skipWaiting + clientsClaim 或等下次访问

- [x] HTTP/2 的缓存优化
  - 问：HTTP/2 对缓存有影响吗？
  - 答：
    - 多路复用让单域名也能并发加载，减少了雪碧图/域名分片这类优化
    - 头部压缩（HPACK）减少缓存验证请求的开销
    - Server Push 实际效果差，已被废弃，改用 `103 Early Hints` + `preload`

### 跨域和安全

- [x] 同源策略的定义和作用
  - 问：什么是同源？同源策略限制了什么？
  - 答：
    - 同源 = 协议 + 域名 + 端口 完全相同
    - 限制：跨源读取 DOM、跨源读取响应、跨源存储
    - 不受限：`<img>` / `<script>` / `<link>` 标签的跨源加载
    - 目的：防止恶意站点读取用户其他站点的信息

- [x] CORS 的工作机制：简单请求和预检请求
  - 问：CORS 的简单请求和预检请求什么时候触发？
  - 答：
    - 简单请求：GET/POST/HEAD + 标准头 + 标准 Content-Type，直接发起并看响应头
    - 预检（OPTIONS）：其他方法、自定义头、非标准 Content-Type 都会触发
    - 关键响应头：`Access-Control-Allow-Origin`、`Allow-Methods`、`Allow-Headers`、`Allow-Credentials`
    - 带 Cookie 要求 Origin 具体化（不能是 `*`）

- [x] 跨域解决方案：JSONP、代理、PostMessage
  - 问：跨域有几种常见方案？各自局限？
  - 答：
    - JSONP：只支持 GET，XSS 风险
    - CORS：现代首选，需要服务端配合
    - Nginx / Node 代理：前端对同源，后端再转发
    - `postMessage`：跨 window/iframe 通信，注意校验 origin
    - `document.domain`：已废弃

- [x] XSS 攻击的类型和防护措施
  - 问：XSS 分几类？怎么防？
  - 答：
    - 反射型：恶意脚本在 URL，服务端回显
    - 存储型：恶意脚本存进数据库后被其他用户加载
    - DOM 型：前端代码把输入直接写进 DOM
    - 防护：输出编码、`textContent` 代替 `innerHTML`、CSP、框架默认转义、cookie `HttpOnly`

- [x] CSRF 攻击的原理和防护策略
  - 问：CSRF 是什么？怎么防？
  - 答：
    - 利用浏览器会自动带 cookie 的特性，伪造用户已登录态发起请求
    - 防护：CSRF Token（双提交 cookie / 自定义请求头）、SameSite cookie（`Lax`/`Strict`）、校验 Referer/Origin
    - 现代站点 SameSite=Lax 是兜底，Token 是主防线

- [x] CSP（Content Security Policy）的配置和作用
  - 问：CSP 怎么用？能限制什么？
  - 答：
    - 通过响应头 `Content-Security-Policy` 声明允许的资源来源
    - 常用指令：`default-src`、`script-src`、`style-src`、`connect-src`、`img-src`、`frame-ancestors`
    - 用 `nonce` 或 `hash` 允许内联脚本
    - `Report-Only` 模式先观察再强制

## 计算机网络

### HTTP 协议

- [x] HTTP/1.1 的特性：持久连接、管道化、缓存控制
  - 问：HTTP/1.1 相对 1.0 升级了哪些点？
  - 答：
    - 默认持久连接（Keep-Alive）复用 TCP
    - 管道化（pipelining）可连续发请求，但实际使用少（队头阻塞）
    - 更完善的缓存机制（`Cache-Control`、`ETag`）
    - Host 头强制要求（支持虚拟主机）

- [x] HTTP/2 的改进：二进制帧、多路复用、服务端推送、头部压缩
  - 问：HTTP/2 关键改进是什么？
  - 答：
    - 二进制分帧替代文本，更紧凑
    - 多路复用：单连接并发多请求，解决 HTTP 层队头阻塞
    - HPACK 头部压缩（静态 + 动态表）
    - Server Push 实际效果差已废弃，用 `103 Early Hints` 替代

- [x] HTTP/3 和 QUIC 的特点：UDP 传输、连接迁移、0-RTT
  - 问：HTTP/3 为什么换成 UDP？
  - 答：
    - 基于 QUIC（运行于 UDP），避免 TCP 的内核层队头阻塞
    - 连接迁移：换网络不用重建连接（用 Connection ID 标识）
    - 0-RTT：握手缓存后可立即发数据
    - TLS 1.3 内置，不再单独握手

- [x] HTTPS 和 TLS 握手过程
  - 问：TLS 1.3 握手大致流程？
  - 答：
    - Client 发 `ClientHello` 带支持的参数和密钥交换（ECDHE）公钥
    - Server 回 `ServerHello` + 证书 + 自己的公钥，直接推导共享密钥
    - 一个 RTT 完成握手（相比 1.2 少一个来回）
    - 0-RTT 恢复会话用预共享密钥

- [x] HTTP 状态码的分类和常见状态码含义
  - 问：状态码按类别怎么记？
  - 答：
    - 1xx 信息（101 切换协议、103 Early Hints）
    - 2xx 成功（200、201、204、206 分片）
    - 3xx 重定向（301 永久、302 临时、304 未修改、307/308 保留方法）
    - 4xx 客户端错（400、401 未认证、403 无权限、404、409 冲突、429 频率限制）
    - 5xx 服务端错（500、502、503、504）

### TCP/IP 协议栈

- [x] OSI 七层模型和 TCP/IP 四层模型
  - 问：这两套模型怎么对应？
  - 答：
    - OSI：物理、数据链路、网络、传输、会话、表示、应用
    - TCP/IP：网络接口、网络、传输、应用
    - 面试只要能对应常见协议到对应层（IP/网络、TCP/UDP/传输、HTTP/应用）即可

- [x] TCP 三次握手和四次挥手的过程
  - 问：为什么是三次握手、四次挥手？
  - 答：
    - 三次握手：`SYN` → `SYN+ACK` → `ACK`，目的是确认双方收发能力
    - 四次挥手：主动关闭方 `FIN`，对方 `ACK` 后可能还有数据要发，单独再 `FIN` + `ACK`
    - `TIME_WAIT`：主动关闭方等 2MSL，确保最后 ACK 到达 / 旧数据消散

- [x] TCP 的可靠性保证：确认机制、重传机制、流量控制、拥塞控制
  - 问：TCP 怎么保证可靠？
  - 答：
    - 序号 + ACK：丢包可检测
    - 超时重传 / 快速重传（3 次重复 ACK）
    - 滑动窗口做流量控制，避免淹没接收方
    - 拥塞控制：慢启动、拥塞避免、快重传快恢复，现代用 BBR

- [x] UDP 的特点和适用场景
  - 问：UDP 什么时候比 TCP 合适？
  - 答：
    - 无连接、不可靠、无序，头部小
    - 适合：DNS、视频/语音实时流、游戏、QUIC 底层
    - 可靠性自行实现（QUIC 做在用户态）

- [x] DNS 解析过程和优化策略
  - 问：输入 URL 到 DNS 返回中间发生了什么？优化点？
  - 答：
    - 浏览器缓存 → 系统缓存 → hosts → 路由器 → 本地 DNS → 迭代查询根/顶级/权威
    - 优化：`dns-prefetch`、HTTPDNS 绕过 LocalDNS、HTTP/3 的 0-RTT 降低首字节
    - CDN 的 DNS 分流是第一层加速

### 网络优化

- [x] CDN 的工作原理和优势
  - 问：CDN 做了什么？
  - 答：
    - 用户请求先被就近的边缘节点接住，减少物理距离和回源
    - 通过 DNS 分流或 Anycast 选择边缘
    - 缓存静态资源、也可做边缘计算（Edge Functions）
    - 防 DDoS、隐藏源站 IP

- [x] DNS 预解析和域名分片
  - 问：`dns-prefetch` 和 `preconnect` 有什么不同？
  - 答：
    - `dns-prefetch`：只解析 DNS
    - `preconnect`：DNS + TCP + TLS 都准备好
    - HTTP/2 下域名分片不再必要（多路复用），多域名反而增加 TLS 握手

- [x] 连接复用和 Keep-Alive
  - 问：Keep-Alive 的意义？
  - 答：
    - 复用 TCP，避免每次请求新建连接
    - HTTP/1.1 默认开启
    - 服务端通过 `Keep-Alive: timeout=5, max=100` 控制
    - HTTP/2 的多路复用在此基础上更进一步

- [x] 首包时间（TTFB）的优化
  - 问：TTFB 慢从哪几块查？
  - 答：
    - DNS 解析慢 → 切 HTTPDNS / 预解析
    - TCP/TLS 握手 → 用 HTTP/3 或复用连接
    - 服务端处理慢 → 看后端性能、数据库
    - 回源慢 → CDN 边缘缓存命中率

- [x] 资源压缩：Gzip、Brotli
  - 问：Gzip 和 Brotli 怎么选？
  - 答：
    - Brotli 压缩率更高、解压稍慢，HTTPS + 现代浏览器全面支持
    - 文本类资源（HTML/CSS/JS/JSON）推荐 Brotli
    - 构建时预压缩（`.br` / `.gz` 静态文件）比实时压缩更省 CPU

- [x] 图片优化：WebP、响应式图片、懒加载
  - 问：图片优化常用手段？
  - 答：
    - 格式：WebP 通用、AVIF 更高压缩率、SVG 矢量、照片可上 JPEG XL
    - 响应式：`<picture>` + `srcset` + `sizes`
    - 懒加载：`loading="lazy"` 原生属性
    - 占位：LQIP / BlurHash，减少 CLS

## 算法与数据结构

### 时间复杂度和空间复杂度

- [x] Big O 表示法的含义和计算方法
  - 问：Big O 描述的是什么？怎么推导？
  - 答：
    - 描述输入规模 n 趋于无穷时，操作数的增长量级
    - 只保留最高阶项、去掉常数系数
    - 用于表达算法的最坏渐近行为（也可标记 Θ、Ω）

- [x] 常见算法的时间复杂度：O(1)、O(log n)、O(n)、O(n log n)、O(n²)、O(2ⁿ)
  - 问：这几种量级各对应什么典型算法？
  - 答：
    - O(1)：哈希查找、数组索引
    - O(log n)：二分查找、平衡树查找
    - O(n log n)：归并 / 快排 / 堆排、排序下限
    - O(n²)：冒泡 / 选择 / 插入、嵌套循环
    - O(2ⁿ) / O(n!)：子集、排列、朴素回溯

- [x] 最好、最坏、平均时间复杂度的区别
  - 问：为什么要分三种？
  - 答：
    - 最好：输入最顺的情况
    - 最坏：保证上限，工程上最常关心
    - 平均：按概率分布期望，例如快排期望 O(n log n)
    - 摊还分析（amortized）：动态数组扩容、并查集路径压缩

- [x] 空间复杂度的计算和优化策略
  - 问：空间复杂度算的是什么？怎么压？
  - 答：
    - 算除输入外、算法额外占用的内存
    - 递归的函数调用栈也算（递归深度 × 栈帧）
    - 优化：原地修改、滚动数组、位压缩

- [x] 时间空间复杂度的权衡和优化思路
  - 问：典型的"时间换空间"/"空间换时间"例子？
  - 答：
    - 空间换时间：哈希表去重、记忆化搜索、前缀和
    - 时间换空间：原地排序、位图
    - 具体场景看内存还是 CPU 更紧

### 基础数据结构

- [x] 数组：动态数组、稀疏数组、环形数组
  - 问：这几种变体各解决什么？
  - 答：
    - 动态数组：容量不够时倍增扩容，摊还 O(1) 追加
    - 稀疏数组：大部分为空时用 `{index: value}` 或压缩存储
    - 环形数组：固定大小 + 头尾指针，实现定长队列、缓冲区

- [x] 链表：单链表、双链表、循环链表、跳表
  - 问：什么场景选哪种？
  - 答：
    - 单链表：简单，但只能向后走
    - 双链表：可双向遍历、删除 O(1)（已知节点）
    - 循环链表：约瑟夫问题、轮转调度
    - 跳表：概率平衡的多级索引，查找 O(log n)，Redis 有序集合用它

- [x] 栈：单调栈、表达式求值、括号匹配
  - 问：单调栈什么时候用？
  - 答：
    - 解"下一个更大/更小元素"问题模板
    - 单调递增栈保存"待定的较小值"，新来更大值时出栈结算
    - 应用：柱状图最大矩形、接雨水、每日温度

- [x] 队列：普通队列、双端队列、优先队列、单调队列
  - 问：单调队列和优先队列怎么区分？
  - 答：
    - 单调队列：用于滑动窗口求最值，O(1) 查询窗口极值
    - 优先队列：基于堆，每次取最优元素，O(log n)
    - 双端队列：两端可入出，Deque 实现滑动窗口
    - 普通队列：FIFO，BFS 基础

- [x] 哈希表：冲突解决、负载因子、扩容策略
  - 问：哈希冲突怎么解？
  - 答：
    - 链地址法：桶里挂链表 / 红黑树（Java HashMap）
    - 开放寻址：线性探测、二次探测、双重哈希
    - 负载因子过高就扩容 + rehash
    - JS 的 Map 规范未指定实现，V8 用散列表

- [x] 堆：最大堆、最小堆、堆排序、TopK 问题
  - 问：TopK 问题怎么用堆？
  - 答：
    - 取最大的 K 个：维护大小为 K 的小顶堆
    - 比堆顶小的丢，比堆顶大的替换堆顶并下沉
    - 时间 O(n log k)，空间 O(k)
    - 数据流场景比全排序更合适

### 树结构

- [x] 二叉树：完全二叉树、满二叉树、平衡二叉树
  - 问：这几种二叉树定义区别？
  - 答：
    - 满二叉树：每层填满
    - 完全二叉树：除最后一层外填满，最后一层靠左
    - 平衡二叉树：任意节点左右子树高度差不超过 1
    - 完全二叉树可用数组表示（堆）

- [x] 二叉搜索树：插入、删除、查找、平衡操作
  - 问：BST 的删除怎么做？
  - 答：
    - 叶子：直接删
    - 一个子：用子替代
    - 两个子：找右子树最小（或左子树最大）顶替，再递归删
    - BST 退化成链表时变 O(n)，需要平衡化

- [x] AVL 树：旋转操作、平衡因子、插入删除
  - 问：AVL 旋转有几种？
  - 答：
    - 平衡因子 = 左高 - 右高，绝对值 > 1 就失衡
    - 四种旋转：LL（右旋）、RR（左旋）、LR（先左后右）、RL（先右后左）
    - 插入最多一次调整，删除可能向上连续调整

- [x] 红黑树：性质、插入、删除、颜色调整
  - 问：红黑树 5 条性质是什么？
  - 答：
    - 节点红或黑、根黑、叶（NIL）黑、红节点子必黑、任一节点到叶黑节点数相同
    - 近似平衡（最长路径 ≤ 2 倍最短路径）
    - 插入/删除靠变色 + 旋转维持
    - Java TreeMap、C++ map、Linux 调度器都用它

- [x] B 树和 B+ 树：多路平衡树、数据库索引
  - 问：数据库为什么用 B+ 树不用红黑树？
  - 答：
    - B+ 树每个节点存多个键，降低树高（磁盘 IO 次数少）
    - 数据只在叶子，内部节点纯索引
    - 叶子串成链表，范围查询友好
    - 红黑树每节点一个键，高度和数据量同阶

- [x] 字典树（Trie）：字符串匹配、前缀查询
  - 问：Trie 解决什么问题？
  - 答：
    - 批量字符串的前缀查询 O(m)，m 为字符串长度
    - 实现：每节点一个字典表 / 数组
    - 场景：搜索联想、敏感词过滤、IP 路由
    - 空间换时间，压缩版是 Radix Tree

- [x] 并查集：路径压缩、按秩合并、连通性问题
  - 问：并查集两大优化是什么？
  - 答：
    - 路径压缩：find 时把路径节点都挂到根
    - 按秩合并：按树高 / 节点数合并
    - 两者联用摊还复杂度接近 O(1)（阿克曼函数反函数）
    - 场景：Kruskal、连通性判断、等价类

### 图算法

- [x] 图的表示：邻接矩阵、邻接表、边列表
  - 问：三种表示怎么选？
  - 答：
    - 邻接矩阵：O(V²) 空间，稠密图 / 需 O(1) 查边
    - 邻接表：O(V+E) 空间，稀疏图常用
    - 边列表：Kruskal、并查集配合，便于按权排序

- [x] 图的遍历：DFS、BFS、拓扑排序
  - 问：拓扑排序怎么写？
  - 答：
    - Kahn 算法：不断把入度为 0 的点入队、出队并删其出边
    - DFS 逆后序也能得到拓扑序
    - 出现环则无拓扑序
    - 场景：课程依赖、任务调度

- [x] 最短路径：Dijkstra、Floyd、Bellman-Ford
  - 问：这三种怎么选？
  - 答：
    - Dijkstra：单源、非负权，堆优化 O((V+E) log V)
    - Bellman-Ford：单源、可负权，O(VE)，可检测负环
    - Floyd：全源，O(V³)，常用于小图
    - SPFA 是 Bellman 的队列优化，最坏仍 O(VE)

- [x] 最小生成树：Prim、Kruskal 算法
  - 问：这两种算法区别？
  - 答：
    - Prim：从一个点出发，每次加最小边扩张，适合稠密图（堆 O(E log V)）
    - Kruskal：按边权排序，用并查集判环，适合稀疏图（O(E log E)）

- [x] 强连通分量：Tarjan、Kosaraju 算法
  - 问：SCC 怎么求？
  - 答：
    - Kosaraju：两次 DFS（原图 + 反图），按出栈逆序遍历反图
    - Tarjan：一次 DFS，维护 `dfn` 和 `low` 值，出栈成一个 SCC
    - 时间都是 O(V+E)

- [x] 网络流：最大流、最小割、费用流
  - 问：最大流最小割定理说什么？
  - 答：
    - 最大流 = 最小割
    - 算法：Ford-Fulkerson（增广路）、Dinic（分层图 BFS + 多路增广）
    - 费用流：在最大流基础上加单位流量代价，用 SPFA 找最短增广路
    - 前端面试少见，算法竞赛话题

- [x] 二分图：匹配、匈牙利算法、KM 算法
  - 问：二分图最大匹配怎么做？
  - 答：
    - 匈牙利算法：对每个左点尝试增广路
    - 时间 O(VE)
    - 带权匹配用 KM 算法
    - 场景：任务分配、资源配对

### 动态规划

- [x] 动态规划的基本思想：最优子结构、重叠子问题
  - 问：DP 适用于什么问题？
  - 答：
    - 最优子结构：大问题最优解包含子问题最优解
    - 重叠子问题：相同子问题被多次计算，适合缓存
    - 无后效性：未来决策不影响已定状态

- [x] 状态定义和转移方程的设计思路
  - 问：怎么定义状态？
  - 答：
    - 把"影响答案的关键变量"放入状态维度
    - 保证状态能由更小状态推导
    - 经典：以"前 i 个元素 + 某约束"为状态

- [x] 记忆化搜索和自底向上的实现方式
  - 问：两种实现各自适合什么？
  - 答：
    - 记忆化搜索（top-down）：写起来直观，只算需要的子问题
    - 自底向上（bottom-up）：空间可压缩、常数小
    - 有拓扑顺序清楚就用迭代，状态复杂就递归

- [x] 经典问题：斐波那契、爬楼梯、背包问题
  - 问：背包几类怎么区分？
  - 答：
    - 01 背包：每物品一份，二维 DP 或一维倒序
    - 完全背包：无限份，一维正序
    - 多重背包：有限份，二进制拆分优化
    - 分组背包：每组至多一个

- [x] 线性 DP：最长递增子序列、最大子数组和
  - 问：LIS 怎么写到 O(n log n)？
  - 答：
    - 维护一个单增数组 `tails`
    - 对每个数二分找第一个 ≥ 它的位置替换
    - `tails` 长度即答案（不是 LIS 本身）
    - 求 LIS 本体需回溯指针

- [x] 区间 DP：石子合并、回文串、括号匹配
  - 问：区间 DP 状态怎么写？
  - 答：
    - `dp[i][j]` 表示区间 `[i,j]` 的最优值
    - 枚举分割点 k 或缩小区间
    - 枚举顺序：按区间长度从小到大
    - 常见：石子合并 O(n³)、最长回文子序列

- [x] 树形 DP：树的最大独立集、树的重心
  - 问：树形 DP 怎么组织？
  - 答：
    - 一般用 DFS 后序，儿子算完合并给父
    - `dp[u][0/1]` 表示 u 不选 / 选
    - 换根 DP：先求以 1 为根的答案，再从根推广到每个节点

- [x] 状态压缩 DP：旅行商问题、棋盘覆盖
  - 问：状压 DP 什么时候用？
  - 答：
    - n ≤ 20 左右的集合枚举，用位掩码当状态
    - 典型：TSP `dp[mask][u]` = 经过 mask 集合最后在 u 的最小代价
    - 枚举子集用 `for (s = mask; s; s = (s-1) & mask)`

- [x] 数位 DP：数字统计、区间计数问题
  - 问：数位 DP 模板？
  - 答：
    - 记忆化搜索 + 上界限制 + 前导零标记
    - `dfs(pos, state, limit, lead)`
    - 常见：区间内满足某数字规则的数个数

- [x] 概率 DP：期望值计算、概率递推
  - 问：期望 DP 怎么列？
  - 答：
    - 通常 `dp[i]` 表示从状态 i 到终点的期望步数
    - 转移时乘上对应概率累加
    - 有后效性时需要解方程组或高斯消元

### 搜索算法

- [x] 深度优先搜索（DFS）：递归实现、栈实现、剪枝优化
  - 问：DFS 怎么避免重复 / 加速？
  - 答：
    - 标记 `visited` 或恢复现场
    - 可行性剪枝：提前判断走不通
    - 最优性剪枝：比当前最优差就剪
    - 记忆化：把子问题答案缓存

- [x] 广度优先搜索（BFS）：队列实现、层次遍历、最短路径
  - 问：BFS 为什么能算无权最短路径？
  - 答：
    - 每层扩展一步，第一次访问到终点就是最短
    - 同时所有层级元素入队，需要用 `visited` 防止重复
    - 双向 BFS / 0-1 BFS 可加速

- [x] 回溯算法：全排列、子集、组合、N 皇后
  - 问：回溯的通用模板？
  - 答：
    - 做选择 → 递归 → 撤销选择
    - 通过 `start` 参数避免重复组合
    - 剪枝：提前退出不合法分支、同层去重（排序后跳过相同值）

- [x] 剪枝策略：可行性剪枝、最优性剪枝、记忆化剪枝
  - 问：这三种剪枝什么意思？
  - 答：
    - 可行性：当前分支已违反约束
    - 最优性：当前已不如记录最优
    - 记忆化：相同子问题直接返回结果
    - 配合启发式排序可大幅加速

- [x] 双向搜索：双向 BFS、双向 DFS、Meet in Middle
  - 问：双向搜索为什么更快？
  - 答：
    - 从起点终点同时扩展，搜索空间从 `b^d` 降到 `2 · b^(d/2)`
    - 双向 BFS 需要保证两侧步长交替扩展
    - Meet in Middle：子集枚举 `2^n` 切半 `2^(n/2)`

- [x] A\* 算法：启发式搜索、估价函数、最优路径
  - 问：A\* 的估价函数要满足什么？
  - 答：
    - `f(n) = g(n) + h(n)`，g 是已走代价，h 是到终点的估计
    - h 必须可采纳（不高估真实代价）
    - 一致性更强的要求可避免重复展开
    - 游戏寻路、拼图类题目常用

### 贪心算法

- [x] 贪心选择性质和最优子结构
  - 问：贪心和 DP 区别？
  - 答：
    - 贪心每步做局部最优选择，不回溯
    - DP 要枚举所有子问题
    - 贪心必须证明：局部最优 → 全局最优（交换论证）

- [x] 经典问题：活动选择、霍夫曼编码、最小生成树
  - 问：活动选择的贪心怎么排？
  - 答：
    - 按结束时间排序，依次选不冲突的
    - 每次选最早结束的活动可保证全局最多

- [x] 区间问题：区间调度、区间覆盖、区间合并
  - 问：区间合并模板？
  - 答：
    - 按左端点排序
    - 当前右端 ≥ 下一个左端就合并，否则开新区间
    - 区间调度选结束时间最早；区间覆盖用双指针 + 贪心

- [x] 分配问题：任务分配、资源分配、负载均衡
  - 问：任务分配常用贪心策略？
  - 答：
    - 最长处理时间（LPT）：大任务先分给最空闲机器
    - 简单但保证 4/3 近似比
    - 堆维护当前最小负载机器

- [x] 贪心算法的正确性证明和反例构造
  - 问：怎么证明贪心正确？
  - 答：
    - 交换论证：把最优解里不贪心的部分换成贪心选择，答案不变差
    - 数学归纳：前 k 步正确，推第 k+1 步
    - 找不到反例 ≠ 正确，必须证明或反驳

### 分治算法

- [x] 分治思想：分解、解决、合并
  - 问：分治三部曲？
  - 答：
    - 分：拆成子问题
    - 治：递归解决
    - 合：合并子答案
    - 主定理可快速分析复杂度

- [x] 经典算法：归并排序、快速排序、二分查找
  - 问：归并 vs 快排？
  - 答：
    - 归并：稳定、O(n log n) 最坏，空间 O(n)
    - 快排：原地、平均 O(n log n)、最坏 O(n²)，不稳定
    - 现代库（JS V8、C++ STL）用 Timsort / Introsort 之类的混合排序

- [x] 最近点对问题：平面分治、时间复杂度分析
  - 问：最近点对怎么到 O(n log n)？
  - 答：
    - 按 x 排序后递归左右
    - 合并时在中线带 δ 内按 y 排序，每个点只需比后 7 个
    - 主定理 T(n) = 2T(n/2) + O(n)

- [x] 大整数乘法：Karatsuba 算法、FFT 优化
  - 问：Karatsuba 怎么把 n² 降到 n^1.58？
  - 答：
    - 把数拆成高低两半，原本 4 次子乘减到 3 次
    - 递归关系 T(n) = 3T(n/2) + O(n) = O(n^log₂3)
    - 更大数用 FFT：多项式乘法 O(n log n)

- [x] 矩阵乘法：Strassen 算法、分块优化
  - 问：Strassen 的意义？
  - 答：
    - 把 8 次子矩阵乘减到 7 次，复杂度 O(n^log₂7)
    - 常数大、数值稳定性差，工程上少用
    - 实际优化靠缓存分块、SIMD

### 高级数据结构

- [x] 线段树：区间查询、区间更新、懒标记
  - 问：线段树支持什么操作？
  - 答：
    - 单点 / 区间修改 + 区间查询（最值、和、GCD 等可合并信息）
    - 懒标记（lazy propagation）：区间修改先打标记，访问时才下推
    - 复杂度 O(log n) per query

- [x] 树状数组：前缀和、区间和、逆序对
  - 问：树状数组和线段树怎么选？
  - 答：
    - 树状数组：代码短、常数小，支持单点改 + 前缀查
    - 线段树：功能全，支持复杂合并
    - 逆序对：离散化 + 树状数组典型题

- [x] 平衡树：Splay 树、Treap、替罪羊树
  - 问：这几种平衡树有什么特点？
  - 答：
    - Splay：均摊平衡，常访问节点自动上浮
    - Treap：随机优先级 + BST，期望平衡
    - 替罪羊：只在失衡时整体重建，实现简单
    - 竞赛里 Treap 最常用

- [x] 块状数组：分块思想、区间操作优化
  - 问：分块思想是什么？
  - 答：
    - 把 n 元素分成 √n 块
    - 区间操作按块整体处理 + 零散单点
    - 复杂度 O(√n)，代码比线段树简单
    - 适合信息难以快速合并的场景

- [x] 可持久化数据结构：主席树、可持久化数组
  - 问：可持久化是什么？
  - 答：
    - 保留历史版本，每次修改创建新路径复用旧节点
    - 主席树：可持久化权值线段树，支持区间 K 小值
    - 空间复杂度 O(n log n)

- [x] 离线算法：莫队算法、整体二分、CDQ 分治
  - 问：莫队算法是什么？
  - 答：
    - 离线处理区间查询，按左端点分块 + 右端点排序
    - 维护指针移动，单次均摊 O(√n)
    - 整体复杂度 O(n√n)

### 字符串算法

- [x] 字符串匹配：KMP、Rabin-Karp、Boyer-Moore
  - 问：KMP 的 next 数组是什么？
  - 答：
    - `next[i]` = 模式串 `[0, i]` 最长公共前后缀长度
    - 失配时跳到 `next[j-1]` 继续匹配，不回退文本指针
    - 总体 O(n + m)

- [x] 后缀数组：构建、应用、最长公共前缀
  - 问：后缀数组有什么用？
  - 答：
    - 排序所有后缀，用于子串比较、最长公共子串
    - 配合 LCP 数组（高度数组）解决区间 min / 字典序排名
    - 倍增 / SA-IS 构建 O(n log n) / O(n)

- [x] 后缀自动机：构建、应用、子串统计
  - 问：SAM 能做什么？
  - 答：
    - 接受某字符串所有子串的最小自动机
    - 支持不同子串计数、最长公共子串
    - 状态数 O(n)，构建 O(n |Σ|)

- [x] 回文串：Manacher 算法、回文树
  - 问：Manacher 怎么 O(n) 找所有回文？
  - 答：
    - 在字符间插入特殊字符，统一奇偶长度
    - 利用已求的回文半径做对称加速
    - 维护右端最远的回文中心

- [x] 字符串哈希：多项式哈希、双哈希、滚动哈希
  - 问：滚动哈希怎么实现？
  - 答：
    - 哈希值 `h = (h * base + ch) mod p`
    - 滚窗：`h' = (h - s[i] * base^k) * base + s[i+k]`
    - 双哈希（两套 base/mod）防碰撞

- [x] AC 自动机：多模式串匹配、fail 指针
  - 问：AC 自动机怎么构建？
  - 答：
    - 先按模式串建 Trie
    - BFS 构建 fail 指针：指向当前节点最长可匹配后缀
    - 匹配时沿 fail 跳处理多模式命中
    - 场景：敏感词过滤、多关键字搜索

### 数学算法

- [x] 数论基础：质数、约数、欧拉函数
  - 问：欧拉函数 φ(n) 是什么？
  - 答：
    - ≤ n 且与 n 互质的整数个数
    - 公式：n × ∏(1 - 1/p)，p 为 n 的质因数
    - 欧拉定理：gcd(a,n)=1 时 a^φ(n) ≡ 1 (mod n)
    - 筛质数常用埃氏筛 / 线性筛

- [x] 快速幂：矩阵快速幂、大数取模
  - 问：快速幂原理？
  - 答：
    - 把指数二进制拆分，平方累乘
    - 时间 O(log n)
    - 矩阵快速幂可做线性递推（斐波那契 O(log n)）

- [x] 扩展欧几里得：线性同余方程、逆元
  - 问：逆元怎么求？
  - 答：
    - 费马小定理：p 为质数时 `a^(p-2) ≡ a⁻¹ (mod p)`
    - 扩展欧几里得：`ax + by = gcd(a, b)`，解出 x 即逆元
    - 线性求逆元：`inv[i] = -(p/i) * inv[p%i] mod p`

- [x] 中国剩余定理：同余方程组求解
  - 问：CRT 解决什么？
  - 答：
    - 求同时满足多个 `x ≡ r_i (mod m_i)` 的 x
    - m_i 两两互质时有唯一解 mod `∏m_i`
    - 不互质用扩展中国剩余定理合并

- [x] 容斥原理：集合计数、概率计算
  - 问：容斥公式？
  - 答：
    - `|A∪B∪C| = |A|+|B|+|C| - |A∩B| - |A∩C| - |B∩C| + |A∩B∩C|`
    - 用于计数不重复、概率补集
    - 常和位运算枚举子集配合

- [x] 生成函数：组合数学、递推数列
  - 问：生成函数用在哪？
  - 答：
    - 把序列编码成多项式系数，便于组合/卷积运算
    - 普通生成函数解组合问题，指数生成函数解排列问题
    - 面试少见，竞赛里用于推公式

### 算法思维和解题技巧

- [x] 问题建模：抽象化、数学化、图论化
  - 问：怎么把文字题变成算法题？
  - 答：
    - 抓关键实体和关系，去掉无关描述
    - 尝试映射到常见模型：图、树、区间、DP、集合
    - 注意问"求什么"和"约束条件"

- [x] 算法选择：时间复杂度、空间复杂度、实现难度
  - 问：选算法时看哪些因素？
  - 答：
    - 先看数据规模估上限（n=10^5 → O(n log n)）
    - 权衡实现难度和正确率，面试尽量选好写的
    - 极端内存受限要优先省空间

- [x] 优化技巧：预处理、离线处理、在线处理
  - 问：离线和在线区别？
  - 答：
    - 离线：先读全部查询，按自己方便的顺序处理（如按右端点排序）
    - 在线：必须按给定顺序响应，不能回看后面的查询
    - 前端常见场景基本是在线

- [x] 边界处理：特殊情况、极限情况、异常输入
  - 问：容易漏掉哪些边界？
  - 答：
    - 空数组 / 空字符串
    - 单元素 / 单字符
    - 极大极小值溢出
    - 负数、0、NaN、Unicode 多字节

- [x] 调试技巧：对拍、小数据测试、复杂度分析
  - 问：面试手写没法跑怎么调？
  - 答：
    - 口述走一遍小样例（3-5 个元素）
    - 边写边念循环不变量
    - 重点变量手画一张表记录每步状态

- [x] 常见模板：滑动窗口、双指针、单调栈/队列
  - 问：双指针的两类是什么？
  - 答：
    - 同向（快慢）：去重、找中点、删除某值
    - 反向（左右）：两数之和、回文判断
    - 滑动窗口是同向双指针的特例

### 实际应用场景

- [x] 前端性能优化：防抖节流、虚拟滚动、懒加载
  - 问：这三者分别解决什么？
  - 答：
    - 防抖节流：降低高频事件处理频率
    - 虚拟滚动：长列表只渲染可视区域 + 前后缓冲
    - 懒加载：用到才加载（图片、路由、组件）

- [x] 数据处理：去重、排序、过滤、聚合、分页
  - 问：前端常见数据处理怎么写？
  - 答：
    - 去重：`[...new Set(arr)]` 或按 key 建 Map
    - 排序：`Array.prototype.sort` + 比较函数
    - 聚合：`reduce` + Map
    - 分页：计算 offset 或游标，优先游标避免深翻页

- [x] 缓存策略：LRU、LFU、FIFO、2Q、ARC
  - 问：LRU 和 LFU 区别？
  - 答：
    - LRU：最近最少使用淘汰（时间维度），Map + 双向链表 O(1)
    - LFU：使用频率最低淘汰（次数维度），两层 Map
    - 2Q / ARC：混合策略，抗扫描
    - 浏览器 BFCache、Redis 用 LRU 近似

- [x] 文本处理：模糊匹配、自动补全、拼写检查、相似度计算
  - 问：模糊搜索一般怎么实现？
  - 答：
    - 前端小数据：Fuse.js（基于编辑距离 + 字段权重）
    - 大数据走后端：倒排索引 + TF-IDF 或向量召回
    - 自动补全可用 Trie / 前缀索引
    - 相似度：Levenshtein、Jaccard、余弦

- [x] 图形算法：碰撞检测、路径规划、布局算法、几何计算
  - 问：碰撞检测快怎么做？
  - 答：
    - AABB 包围盒先粗判
    - 细判用 SAT 或圆半径比较
    - 空间划分：四叉树 / 网格，降低两两检测
    - 可视化布局：力导向、层次布局、d3-hierarchy

- [x] 网络优化：路由算法、负载均衡、流量控制
  - 问：前端侧能做哪些网络优化？
  - 答：
    - HTTP/2、HTTP/3、长连接复用
    - 合并请求、批量接口、GraphQL 按需取字段
    - 重试 + 退避、请求优先级

- [x] 机器学习：特征选择、模型优化、参数调优
  - 问：前端接触 ML 一般做什么？
  - 答：
    - ONNX Runtime Web / TensorFlow.js 做端侧推理
    - 场景：图像分类、手势识别、智能补全
    - 模型转换：Python 训练 → 量化 → 浏览器加载
    - 注意首包大小和 WASM/WebGPU 兼容性

## 设计模式

### 创建型模式

- [x] 单例模式：实现方式、线程安全、应用场景
  - 问：JS 里怎么实现单例？
  - 答：
    - 闭包缓存实例或 class 静态字段
    - JS 是单线程不存在线程安全问题，但要防止多次 `require` 创建
    - 场景：全局配置、主题管理、事件总线、日志器

- [x] 工厂模式：简单工厂、工厂方法、抽象工厂的区别
  - 问：三种工厂的差异？
  - 答：
    - 简单工厂：一个函数按参数返回不同实例
    - 工厂方法：每类产品一个工厂类，扩展时加类不改旧代码
    - 抽象工厂：一组相关产品的工厂，产品族扩展
    - 前端常用简单工厂（React `createElement`、`new Error` 子类）

- [x] 建造者模式：链式调用、参数校验、对象构建
  - 问：什么时候用 Builder？
  - 答：
    - 对象构造参数很多或有顺序依赖
    - 链式 API 让调用可读（`knex.select().from().where()`）
    - 每一步可校验中间状态

- [x] 原型模式：浅拷贝、深拷贝、性能考虑
  - 问：深拷贝有哪些方案？各自局限？
  - 答：
    - `JSON.parse(JSON.stringify)`：丢失函数、Date、Symbol、循环引用报错
    - `structuredClone`（现代浏览器 / Node 17+）：原生深拷贝，支持大部分类型
    - 手写递归：按需支持自定义类型
    - Lodash `cloneDeep` 功能全但体积大

- [x] 对象池模式：内存管理、性能优化、使用场景
  - 问：对象池在前端有什么用？
  - 答：
    - 预分配 + 回收复用，降低 GC 压力
    - 场景：canvas 粒子、Three.js 几何体、WebWorker 消息对象
    - 关键：借/还接口清晰、重置状态干净

### 结构型模式

- [x] 适配器模式：接口适配、数据转换、兼容性处理
  - 问：Adapter 解决什么？
  - 答：
    - 把现有接口转换成目标期望的接口
    - 典型：第三方库 API 对齐内部约定、旧接口兼容新调用方
    - JS 里多为函数式适配层（参数/返回值转换）

- [x] 装饰器模式：功能扩展、组合优于继承、AOP 思想
  - 问：装饰器和继承比有什么优势？
  - 答：
    - 运行时叠加能力，不改被装饰者代码
    - 多个装饰器可组合，继承只能单线
    - 典型：日志、权限、缓存；TS/React 高阶组件

- [x] 代理模式：虚拟代理、保护代理、缓存代理、远程代理
  - 问：Proxy 在前端有哪些用法？
  - 答：
    - 数据响应式（Vue 3）
    - 表单字段懒求值、权限校验
    - 远程代理：RPC 客户端对远程方法的本地代理
    - 缓存代理：包一层函数缓存结果

- [x] 外观模式：子系统封装、接口简化、依赖倒置
  - 问：Facade 什么时候用？
  - 答：
    - 把一组复杂子系统包装成简单接口
    - 示例：封装底层 Canvas / WebGL 为高级图表 API
    - 目的是降低上层耦合

- [x] 桥接模式：抽象与实现分离、多维度变化处理
  - 问：Bridge 和 Adapter 的区别？
  - 答：
    - Bridge 设计时就拆抽象和实现两个维度
    - Adapter 是事后把两套接口对接
    - 场景：主题 × 组件、语言 × 渲染器等两维度扩展

- [x] 组合模式：树形结构、统一接口、递归处理
  - 问：Composite 经典应用？
  - 答：
    - DOM 树、文件系统、菜单树——叶子和容器同接口
    - 递归渲染/遍历代码写一次即可
    - React 组件树天然是组合模式

- [x] 享元模式：内存共享、对象复用、内部状态与外部状态
  - 问：Flyweight 意思？
  - 答：
    - 把对象拆分内部（可共享）和外部（上下文）状态
    - 内部状态作为池里唯一副本复用
    - 场景：大量相似小对象（词法 token、Canvas 图元）

### 行为型模式

- [x] 观察者模式：事件驱动、发布订阅、解耦设计
  - 问：观察者和发布订阅区别？
  - 答：
    - 观察者：主题直接持有观察者列表，关系紧耦合
    - 发布订阅：多一个中间调度（事件总线），生产消费互不感知
    - DOM 事件监听是观察者；EventBus / Redux 订阅更接近发布订阅

- [x] 策略模式：算法族、运行时切换、消除条件分支
  - 问：策略模式用来消除什么？
  - 答：
    - 大量的 if/else 或 switch 按"类型"分支
    - 把每个分支抽成策略类/函数，统一接口
    - 场景：表单校验规则、支付方式、图表渲染

- [x] 命令模式：请求封装、队列管理、撤销重做
  - 问：命令模式怎么实现撤销？
  - 答：
    - 每个操作封装成命令对象，带 `execute` / `undo`
    - 历史栈维护已执行命令
    - 撤销时出栈调用 `undo`
    - 场景：编辑器、白板、图形工具

- [x] 状态模式：状态转换、行为变化、状态机实现
  - 问：状态模式和策略模式像，怎么区分？
  - 答：
    - 策略由外部选择，状态由内部条件驱动
    - 状态模式内置状态转换逻辑（状态 A 完成后切到 B）
    - 复杂场景用状态机库（XState）更可靠

- [x] 责任链模式：请求传递、处理链、异常处理
  - 问：责任链在哪些地方见过？
  - 答：
    - Koa / Express 中间件（洋葱模型）
    - 表单校验链、审批流、请求拦截器
    - 每个节点决定处理/放行/终止

- [x] 模板方法模式：算法骨架、钩子方法、继承复用
  - 问：Template Method 和 Strategy 区别？
  - 答：
    - Template 通过继承提供骨架 + 钩子，子类实现差异步骤
    - Strategy 通过组合替换整个算法
    - React 类组件的 `render` + `componentDidMount` 钩子就是模板方法

- [x] 迭代器模式：集合遍历、内部迭代器、外部迭代器
  - 问：JS 里的迭代器是外部还是内部？
  - 答：
    - 外部：消费者主动 `next()`（`for...of`、生成器）
    - 内部：集合自己遍历，调用方只给回调（`forEach`、`map`）
    - 外部更灵活可暂停，内部写起来简单

- [x] 中介者模式：对象通信、解耦设计、协调控制
  - 问：Mediator 有什么作用？
  - 答：
    - 多对象交互时引入中间协调者，避免两两耦合
    - MVC 的 Controller、消息总线都是中介者
    - 代价：中介者可能膨胀为"上帝对象"

- [x] 备忘录模式：状态保存、撤销恢复、快照管理
  - 问：Memento 和 Command 撤销的区别？
  - 答：
    - Memento 保存整个状态快照，恢复=回滚到快照
    - Command 记录操作本身，撤销靠反向执行
    - 大对象用 Memento 内存吃紧；可结合增量快照

- [x] 访问者模式：操作分离、数据结构稳定、扩展开放
  - 问：Visitor 适合什么场景？
  - 答：
    - 稳定的树形结构 + 多种要加的操作
    - 把操作从节点类里抽出放到 Visitor
    - 典型：AST 遍历（ESLint、Babel plugin）

### 前端特定设计模式

- [x] 模块模式：命名空间、私有方法、闭包应用
  - 问：ES6 模块出来后模块模式还有意义吗？
  - 答：
    - ES Module 已经内置命名空间和私有作用域
    - IIFE + 闭包的经典模块模式主要用于 UMD 兼容场景
    - 浏览器里偶尔想隔离脚本运行环境也会再用一次

- [x] 发布订阅模式：事件总线、消息队列、组件通信
  - 问：为什么前端经常用事件总线？
  - 答：
    - 跨组件、跨层级通信时避免 props drilling
    - 缺点：调用链难追踪、解绑不及时导致内存泄漏
    - 小项目用 mitt，大项目优先状态管理或 Context

- [x] 策略模式：表单验证、路由匹配、算法选择
  - 问：前端策略模式落地形式？
  - 答：
    - 把规则函数放进 Map 按 key 调度
    - 表单校验：`{ required: fn, email: fn, ... }`
    - 路由匹配：根据路径查询对应处理器

- [x] 装饰器模式：高阶组件、中间件、功能增强
  - 问：HOC 是装饰器模式吗？
  - 答：
    - 是。HOC 接收组件返回增强后的组件
    - Redux `connect`、React Router `withRouter`、权限校验
    - 现在更多用 Hook 替代，但装饰器思想仍在

- [x] 工厂模式：组件创建、配置对象、动态实例化
  - 问：前端工厂模式有哪些？
  - 答：
    - 按配置生成表单控件 / 图表组件
    - `React.createElement`、Vue 的 `h` 函数
    - 根据后端 schema 动态渲染

- [x] 单例模式：全局状态、工具类、缓存管理
  - 问：前端单例要注意什么？
  - 答：
    - SSR 下 module 级单例可能跨请求泄漏数据
    - 测试时要有 reset 方法便于隔离
    - 优先用模块默认导出，避免自己实现一堆锁

### 设计模式应用原则

- [x] SOLID 原则：单一职责、开闭原则、里氏替换、接口隔离、依赖倒置
  - 问：SOLID 每个字母对应什么？
  - 答：
    - S：单一职责，每个模块只有一个变化理由
    - O：对扩展开放、对修改关闭
    - L：子类能替代父类而不破坏行为
    - I：接口不该强迫实现方依赖它用不到的方法
    - D：高层不依赖低层实现，都依赖抽象

- [x] DRY 原则：避免重复、抽象复用、配置化设计
  - 问：DRY 滥用会怎样？
  - 答：
    - 过早抽象导致"为了复用而变形"
    - 2-3 处相似代码常常不如保留重复
    - "Rule of Three"：出现第三次再抽

- [x] KISS 原则：简单优先、过度设计避免、可读性考虑
  - 问：KISS 在代码里怎么体现？
  - 答：
    - 先写能工作的最简实现，再按需加复杂度
    - 优先明白易读 > 炫技
    - 减少不必要的抽象层级

- [x] 组合优于继承：灵活性、可扩展性、维护性
  - 问：为什么组合比继承好？
  - 答：
    - 继承在编译期固定关系，组合在运行时灵活替换
    - 避免深继承带来的脆弱基类问题
    - React 官方推荐组合（children、render props、Hook）

- [x] 面向接口编程：解耦、测试友好、扩展开放
  - 问：面向接口怎么让测试更容易？
  - 答：
    - 依赖抽象（函数签名 / 类型），不依赖具体实现
    - 测试时可注入 mock 实现
    - TS 的 interface 或 union type 作为协议

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

- [x] Webpack 的核心概念：entry、output、loader、plugin
  - 问：loader 和 plugin 区别？
  - 答：
    - loader：把某类文件转译成 JS（处理单文件内容，串行链式调用）
    - plugin：在构建的各个生命周期钩子里插入逻辑（影响整个流程）
    - 常见 loader：babel-loader、css-loader、file-loader
    - 常见 plugin：HtmlWebpackPlugin、MiniCssExtractPlugin、DefinePlugin

- [x] 模块化规范：CommonJS、ES Module、AMD、UMD
  - 问：CommonJS 和 ESM 的关键区别？
  - 答：
    - CommonJS：运行时加载，导出的是值的拷贝，同步
    - ESM：静态分析，导出的是值的引用（live binding），支持 Tree Shaking
    - AMD：早期浏览器异步模块规范（RequireJS）
    - UMD：兼容多种环境的通用封装

- [x] Tree Shaking 的原理和限制
  - 问：Tree Shaking 为什么必须用 ESM？
  - 答：
    - 依赖 ESM 的静态结构，编译期就能确定哪些导出被用到
    - CommonJS 是运行时动态求值，无法静态分析
    - 限制：有副作用的模块不会被摇掉（用 `package.json` 的 `sideEffects` 标记）
    - Babel 转译要保留 ESM 语法（不能降级为 CJS）

- [x] 代码分割的策略：入口分割、动态导入、SplitChunks
  - 问：代码分割有哪些手段？
  - 答：
    - 多入口：每个入口一个独立 bundle
    - 动态 `import()`：按需异步加载，路由分割典型
    - SplitChunks：抽取公共依赖到单独 chunk
    - 目标：首屏最小、第二次访问命中缓存最多

- [x] SourceMap 的类型和选择
  - 问：开发和生产环境 SourceMap 怎么选？
  - 答：
    - 开发：`eval-cheap-module-source-map` 速度快、能定位原始代码
    - 生产：`hidden-source-map` / `nosources-source-map`，只给错误监控系统用
    - 线上别用 `source-map` 直接暴露源码
    - `cheap` 不含列信息、`module` 含 loader 前的源码

- [x] Vite 的优势和与 Webpack 的区别
  - 问：Vite 凭什么比 Webpack 快？
  - 答：
    - 开发态用原生 ESM 按需编译，无需提前打包
    - 依赖预构建用 esbuild，量级提升
    - 生产仍用 Rollup 打包，保证包体质量
    - HMR 基于 ESM 精准替换，大项目尤其明显

- [x] Rollup 的特点和适用场景
  - 问：Rollup 和 Webpack 的定位差异？
  - 答：
    - Rollup 面向库作者，输出干净的 ESM/CJS/UMD 产物
    - Tree Shaking 是第一优先级，产物更小
    - Webpack 面向应用，生态广、功能全
    - Vue/React 等库的构建通常用 Rollup

### 质量保障

- [x] ESLint 的配置和自定义规则
  - 问：ESLint 规则怎么写？
  - 答：
    - 一个规则就是一个访问 AST 的对象（`create(context) { return { Node() {} } }`）
    - 通过 `context.report` 上报问题，可附带 `fix` 函数自动修复
    - 用 `preset` / `flat config` 复用社区规则
    - 项目内自定义规则放在本地 plugin 包里

- [x] Prettier 的代码格式化原理
  - 问：Prettier 为什么只有少量配置项？
  - 答：
    - 设计哲学：减少争论，统一风格
    - 先把代码解析成 AST，再按统一规则重打印
    - 和 ESLint 配合时用 `eslint-config-prettier` 关掉样式类规则避免冲突

- [x] TypeScript 的编译配置和严格模式
  - 问：`strict` 开启了什么？
  - 答：
    - 打开一组严格检查：`strictNullChecks`、`noImplicitAny`、`strictFunctionTypes` 等
    - 推荐所有新项目默认开
    - 其他常用选项：`noUnusedLocals`、`noUncheckedIndexedAccess`、`exactOptionalPropertyTypes`

- [x] 测试分层：单元测试、集成测试、E2E 测试
  - 问：三层测试各自比例和目的？
  - 答：
    - 单元：覆盖逻辑分支、快、多（70%）
    - 集成：几个模块联合验证，模拟真实调用（20%）
    - E2E：从浏览器模拟用户操作，慢但信心足（10%）
    - 测试金字塔，避免顶层膨胀

- [x] Jest/Vitest 的配置和使用
  - 问：Vitest 和 Jest 的区别？
  - 答：
    - Vitest 原生 ESM + Vite 构建链，启动快、配置少
    - API 基本兼容 Jest，迁移成本低
    - Jest 生态老、文档丰富，老项目留用无妨
    - 两者都支持 snapshot、mock、覆盖率

- [x] React Testing Library 的测试理念
  - 问：RTL 鼓励什么写法？
  - 答：
    - 像用户一样去找元素（`getByRole`、`getByText`）
    - 避免测实现细节（state 内部字段、组件层级）
    - 测试应该对重构友好
    - 配合 `user-event` 模拟真实交互

- [x] Playwright/Cypress 的 E2E 测试策略
  - 问：Playwright 和 Cypress 怎么选？
  - 答：
    - Playwright：多浏览器、多 tab、跨域、并行好，微软出品
    - Cypress：单页应用友好、调试体验好，社区大
    - 现在新项目多数选 Playwright
    - 策略：关键路径跑 E2E，细节交给单元/集成

### 部署和监控

- [x] CI/CD 流水线的设计和实践
  - 问：前端 CI/CD 典型阶段？
  - 答：
    - Lint / Type Check → 单元测试 → 构建 → E2E → 发布预览 → 手工门槛 → 生产发布
    - 每步失败立即停、失败快
    - 用缓存（pnpm store、构建产物）加速
    - 分支策略：main 稳定、PR 触发预览、tag 触发生产

- [x] 容器化部署：Docker、Kubernetes
  - 问：前端为什么要容器化？
  - 答：
    - 构建产物 + Nginx 打进镜像，保证部署一致
    - K8s 滚动更新、自动扩缩容、健康检查
    - 镜像分层缓存加速构建
    - 多阶段构建（builder + runtime）缩小镜像体积

- [x] 灰度发布和蓝绿部署的策略
  - 问：这两种发布方式差异？
  - 答：
    - 蓝绿：新旧两套环境切流量，秒级回滚
    - 灰度：按用户/比例逐步放量，观察指标
    - 灰度适合用户量大、风险高的改动
    - 蓝绿资源占用双份

- [x] 前端监控的实现：错误监控、性能监控、用户行为分析
  - 问：前端监控三大块？
  - 答：
    - 错误：`window.onerror` / `onunhandledrejection`、Source Map 还原
    - 性能：Web Vitals、资源加载、自定义指标
    - 行为：埋点、PV/UV、路径分析
    - 商用方案：Sentry、Datadog、LogRocket

- [x] 日志收集和分析
  - 问：前端日志收集要点？
  - 答：
    - 批量上报 + `sendBeacon` 避免页面关闭丢失
    - 采样率控制，避免全量上报
    - 关联 traceId 和后端日志串联
    - 敏感信息脱敏

- [x] 告警机制和故障排查
  - 问：告警怎么设避免狼来了？
  - 答：
    - 分级（P0/P1/P2），不同级别不同通道
    - 设合理阈值 + 持续时间，避免抖动
    - 告警带上排查链接（日志、Trace、Dashboard）
    - 定期复盘误报，及时调阈值

### 微前端和架构

- [x] 微前端的概念和解决的问题
  - 问：什么时候该上微前端？
  - 答：
    - 多团队独立开发部署、技术栈割裂
    - 单体应用大到构建/部署周期难以忍受
    - 需要承载历史遗产系统共存
    - 小团队 / 单栈项目不需要，直接 Monorepo

- [x] Single-SPA、qiankun 的实现原理
  - 问：qiankun 怎么隔离子应用？
  - 答：
    - 路由劫持：监听 URL 决定挂载哪个子应用
    - JS 沙箱：Proxy 代理 window，隔离全局变量
    - CSS 隔离：Shadow DOM 或作用域前缀
    - 资源加载：HTML Entry 统一注入

- [x] Module Federation 的使用和优势
  - 问：Module Federation 和传统微前端区别？
  - 答：
    - Webpack 5 原生能力，构建时约定 expose/remote
    - 运行时按需加载远程模块，依赖可共享
    - 和 qiankun 比，更接近"代码级共享"，不是整个子应用
    - Next.js、Rspack 都支持

- [x] Monorepo 的管理策略：Lerna、Nx、Rush
  - 问：Monorepo 工具怎么选？
  - 答：
    - pnpm workspaces + Turborepo：轻量、任务编排好
    - Nx：功能全，带代码生成、依赖图、affected 命令
    - Lerna：老牌工具，pnpm workspace 出来后渐退
    - Rush：微软的，企业级场景

- [x] 组件库的设计和发布
  - 问：做组件库要考虑什么？
  - 答：
    - API 稳定性（语义化版本）、无障碍、主题化
    - 构建产物：ESM + CJS + 类型，支持 Tree Shaking
    - 文档：Storybook / 自研站点
    - 发布：CI 自动化、CHANGELOG、pre-release 通道

- [x] BFF（Backend for Frontend）模式
  - 问：BFF 解决什么问题？
  - 答：
    - 后端通用接口对前端不友好（多次请求、字段冗余）
    - BFF 层专门为前端聚合/裁剪数据
    - 通常用 Node（Express/Koa/NestJS）或 GraphQL 实现
    - 优势：前端团队自治；代价：多一层维护

## 系统设计

### 设计思路

- [x] 系统设计的基本步骤：需求分析、架构设计、详细设计、权衡分析
  - 问：拿到一个系统设计题怎么下手？
  - 答：
    - 先澄清需求和规模（QPS、数据量、读写比）
    - 画高层架构（前端、API、缓存、存储）
    - 再细化关键模块和接口
    - 最后讨论瓶颈和 tradeoff，没有银弹

- [x] 可扩展性、可用性、一致性的权衡
  - 问：CAP 和 PACELC 是什么？
  - 答：
    - CAP：分区情况下 C（一致性）和 A（可用性）二选一
    - PACELC：分区时选 C/A，无分区时还要选 L（延迟）/C
    - 业务决定偏好：支付选 C，Feed 选 A
    - 最终一致性在多数场景足够

- [x] 负载均衡和水平扩展策略
  - 问：负载均衡算法常见有哪些？
  - 答：
    - 轮询、加权轮询、最少连接数、一致性哈希
    - 一致性哈希适合缓存服务，节点变化影响小
    - 七层（Nginx）可基于 URL、Header；四层（LVS）更快但信息少
    - 云上 ALB / Nginx / Envoy 常见选择

- [x] 缓存策略的设计和一致性保证
  - 问：缓存和 DB 一致性怎么做？
  - 答：
    - 常用：Cache Aside（先 DB 后删缓存）
    - Write Through / Write Back 偏重 KV 场景
    - 写穿双删 + 延迟二删防并发读脏
    - 极致一致需加分布式锁或变更数据捕获（CDC）

- [x] 数据库的选择和分库分表
  - 问：前端场景怎么理解分库分表？
  - 答：
    - 垂直拆：按业务域拆表/库
    - 水平拆：按 hash / 范围拆同一张大表
    - 前端主要关心：跨分片查询会多 RTT、一致性变弱
    - 读多用读写分离 + 缓存，写多才分片

### 前端系统设计

- [x] 大型 SPA 应用的架构设计
  - 问：大型 SPA 怎么分层？
  - 答：
    - 视图（组件）、状态（领域 store）、服务（接口封装）、工具（纯函数）
    - 路由级代码分割、按功能模块组织目录
    - 基础设施层：埋点、鉴权、请求拦截
    - 公共能力下沉到 monorepo 的 package

- [x] 组件库和设计系统的架构
  - 问：设计系统比组件库多什么？
  - 答：
    - 组件库只是视觉实现
    - 设计系统还包含 token（颜色/字号/间距）、使用规范、无障碍规范、设计稿同步流程
    - 跨端一致需要 token 独立于实现

- [x] 状态管理的架构选择
  - 问：Redux / Zustand / Jotai / Context 怎么选？
  - 答：
    - 简单跨组件共享：Context + useReducer
    - 中等复杂：Zustand / Jotai，API 轻
    - 复杂业务 + 中间件生态：Redux Toolkit
    - 服务端状态：React Query / SWR 单独管

- [x] 路由设计和权限控制
  - 问：前端权限怎么做？
  - 答：
    - 菜单层：根据用户角色过滤可见路由
    - 路由层：路由守卫拦截无权限访问
    - 组件层：按钮 / 操作项细粒度权限
    - 后端必须二次校验，前端只是体验

- [x] 性能优化的整体策略
  - 问：大型前端项目的性能优化矩阵？
  - 答：
    - 网络：CDN、HTTP/3、缓存策略
    - 构建：代码分割、Tree Shaking、Sourcemap 策略
    - 运行时：虚拟列表、懒加载、Web Worker、并发渲染
    - 监控：Web Vitals、业务指标回归

- [x] 可观测性的设计：监控、日志、链路追踪
  - 问：可观测性三支柱？
  - 答：
    - Metrics：聚合数值（QPS、错误率、P99）
    - Logs：结构化日志
    - Traces：跨服务链路追踪
    - 三者用 traceId / spanId 关联，OpenTelemetry 是通用标准

### 具体场景

- [x] 实时聊天系统的设计：WebSocket、消息队列、离线消息
  - 问：IM 前端要考虑什么？
  - 答：
    - 长连接：WebSocket，心跳保活、断线重连 + 指数退避
    - 消息去重和顺序：序列号 + 本地去重
    - 离线消息：用最后读取序列号拉增量
    - 消息分片：历史消息分页，虚拟列表渲染

- [x] 大型列表/Feed 流的优化：虚拟滚动、分页、缓存
  - 问：Feed 流优化手段？
  - 答：
    - 虚拟滚动 + 缓冲区，只渲染可视范围
    - 游标分页替代 offset，避免深翻页
    - 图片懒加载 + 占位
    - 预取下一页降低等待

- [x] 文件上传系统：分片上传、断点续传、进度显示
  - 问：大文件上传怎么做？
  - 答：
    - 分片：`Blob.slice` 切片，逐片 PUT
    - 秒传：先算整体 hash 查服务端是否已存在
    - 断点续传：每片上传后记录已完成分片
    - 并发：限制并发数（2-6）避免浏览器阻塞

- [x] 搜索系统：自动完成、搜索建议、结果排序
  - 问：前端搜索体验关注什么？
  - 答：
    - 输入防抖 + 请求取消（`AbortController`）
    - 本地历史记录 + 热搜兜底
    - 结果分段加载（最近、热门、相关）
    - 键盘可操作（↑↓ Enter）

- [x] 可视化大屏：数据处理、实时更新、性能优化
  - 问：可视化大屏优化点？
  - 答：
    - 批量更新 vs 频繁 setState
    - Canvas/WebGL 替代大量 DOM
    - 采样 + 聚合，避免全量渲染
    - `requestAnimationFrame` 对齐绘制，WebWorker 卸载计算

## 手写题实现

难度等级：
- 🟢 **基础**：初级前端必须掌握
- 🟡 **中等**：有一定经验要求，考查深度理解
- 🔴 **困难**：高级面试题，考查架构思维和极端情况处理

### 基础实现类（🟢）

- [x] 实现 `call`、`apply`、`bind` 方法
  - 问：手写 call 核心步骤？
  - 答：
    - 处理 `thisArg` 为 null/undefined 时指向全局（严格模式保留原值）
    - 用 Symbol 作临时 key 挂到目标对象避免污染
    - 调用完 `delete` 临时属性
    - bind 要处理 new 调用时忽略绑定的 this

- [x] 实现 `new` 操作符
  - 问：`new` 内部做了哪四件事？
  - 答：
    - 创建新对象，原型指向构造函数 prototype
    - 以新对象为 this 执行构造函数
    - 若构造函数返回对象则返回该对象，否则返回新对象
    - 注意：箭头函数不能 new

- [x] 实现 `instanceof` 操作符
  - 问：手写 instanceof 要点？
  - 答：
    - 循环沿 `Object.getPrototypeOf(obj)` 向上
    - 每层和 `constructor.prototype` 比较
    - 到 null 停止
    - 注意 `Symbol.hasInstance` 自定义覆盖

- [x] 深拷贝实现（处理循环引用、特殊对象）
  - 问：深拷贝要处理哪些特殊情况？
  - 答：
    - 循环引用：用 WeakMap 记录已拷贝对象
    - Date / RegExp / Map / Set：按类型特判
    - Symbol 键：`Object.getOwnPropertySymbols`
    - 函数：共享引用（拷贝函数意义不大）

- [x] 数组扁平化、去重、排序等基础方法
  - 问：flat 怎么手写？
  - 答：
    - 递归：`arr.reduce((acc, x) => acc.concat(Array.isArray(x) ? flat(x) : x), [])`
    - 控制深度：递归传 depth - 1
    - 去重：`[...new Set(arr)]` 或 `reduce + includes`
    - 排序稳定性：新引擎 sort 都稳定了（V8 7.0+）

- [x] 事件总线（EventBus）实现
  - 问：EventBus 要接口有哪些？
  - 答：
    - `on`、`off`、`once`、`emit`
    - 内部用 Map<event, Set<handler>>
    - once 通过包装一次性函数实现
    - 常见坑：忘记 off 导致内存泄漏

- [x] 单例模式实现
  - 问：JS 里单例几种写法？
  - 答：
    - 闭包：`const instance = null; return () => instance ?? (instance = new X())`
    - class 静态字段 + 私有构造
    - 模块默认导出（最简单）

- [x] 防抖（Debounce）和节流（Throttle）
  - 问：防抖和节流手写要点？
  - 答：
    - 防抖：定时器，触发重新计时；留 timer 句柄支持 cancel
    - 节流：时间戳法（立即执行）或 timer 法（尾触发）
    - 进阶：支持 leading / trailing 配置
    - `this` 要正确透传（用 rest + apply）

### 异步编程类（🟡）

- [x] Promise A+ 规范实现
  - 问：手写 Promise 几个关键点？
  - 答：
    - 三状态：pending / fulfilled / rejected，不可逆
    - `then` 必须异步执行回调（微任务，用 `queueMicrotask` 或 setTimeout 兜底）
    - 值穿透和 thenable 适配：resolve 时递归 unwrap
    - 错误捕获：执行回调 try/catch 失败走 reject

- [x] `async/await` 的 polyfill 实现
  - 问：怎么用 generator 模拟 async/await？
  - 答：
    - generator 每次 yield 返回 Promise，外层递归 `gen.next(value)`
    - Promise resolve 后把值塞回 generator 继续
    - reject 对应 `gen.throw`

- [x] 并发控制器（限制并发数量）
  - 问：怎么限制并发数？
  - 答：
    - 维护运行中任务数，到达上限入队
    - 每次任务完成后从队列取下一个
    - 返回统一 Promise，按原顺序收集结果
    - 库：`p-limit`

- [x] 异步任务队列实现
  - 问：顺序异步队列怎么写？
  - 答：
    - 用链式 `then` 串起：`this.queue = this.queue.then(() => task())`
    - 错误处理要避免一个 reject 断链
    - 或维护数组 + 指针轮流执行

- [x] 超时控制和时间限制
  - 问：怎么给 Promise 加超时？
  - 答：
    - `Promise.race([task, timeout])`
    - timeout 用 `setTimeout` reject
    - 支持 `AbortController` 真正取消底层请求
    - 清理 timer 避免泄漏

- [x] 重试机制实现
  - 问：重试怎么设计？
  - 答：
    - 循环 + try/catch，失败等待后重试
    - 退避策略：指数退避 + 抖动
    - 可配置最大次数、应退出的错误类型
    - 幂等性：非 GET 要小心重复执行副作用

- [x] 异步函数组合（pipe/compose）
  - 问：异步 compose 和同步 compose 的区别？
  - 答：
    - 中间结果包在 Promise 里，用 `reduce` 串联
    - `pipe(f, g)(x) = Promise.resolve(x).then(f).then(g)`
    - Koa 中间件是 compose 的经典实现

### 数据结构类（🟡）

- [x] LRU 缓存实现（Map vs 双向链表）
  - 问：怎么做到 O(1)？
  - 答：
    - Map 按插入顺序迭代 + `delete` / `set` 达到 O(1)
    - 访问时先删再 set（变成最近）
    - 超过容量删 Map 第一个 key
    - 手写双向链表也行，代码更多

- [x] 发布订阅模式（EventEmitter）
  - 问：和 EventBus 区别？
  - 答：
    - EventEmitter 是类，多个实例互不干扰
    - 支持 `on/once/off/emit` 四接口
    - Node.js 的 `events` 模块是经典实现
    - 需防止重复监听和泄漏

- [x] 观察者模式实现
  - 问：Subject/Observer 怎么写？
  - 答：
    - Subject 持有 observers 列表 + `attach/detach/notify`
    - 每个 Observer 实现 `update`
    - 通知时同步或异步由实现决定
    - 注意解绑避免僵尸订阅

- [x] 简单状态管理（Redux 核心）
  - 问：手写 Redux 核心三步？
  - 答：
    - `createStore(reducer, initial)` 维护 state
    - `dispatch(action)` 跑 reducer 更新 state 再通知订阅者
    - `subscribe(listener)` 返回取消订阅函数
    - 中间件：`applyMiddleware` 用 compose 包装 dispatch

- [x] 双向绑定实现
  - 问：Vue 的双向绑定本质？
  - 答：
    - 视图 → 模型：监听 input 事件更新 state
    - 模型 → 视图：响应式（Proxy / defineProperty）在 setter 里触发更新
    - `v-model` = `:value` + `@input` 语法糖

- [x] 虚拟列表实现
  - 问：虚拟列表核心步骤？
  - 答：
    - 监听滚动，计算当前可视区 startIndex / endIndex
    - 只渲染 [start - buffer, end + buffer] 的项
    - 用 transform 或 paddingTop 占位
    - 变高场景需测量并缓存每项高度

- [x] 无限滚动实现
  - 问：无限滚动和虚拟列表区别？
  - 答：
    - 无限滚动只管"到底了加载下一页"
    - 虚拟列表管"只渲染可见项"
    - 大列表两者配合：虚拟列表 + 滚动到底预取
    - IntersectionObserver 比监听 scroll 高效

### 高阶应用类（🔴）

- [x] 柯里化函数（支持占位符）
  - 问：支持占位符的柯里化怎么写？
  - 答：
    - 保存已传入参数数组，遇到占位符先占位
    - 每次调用合并参数 + 填占位
    - 实际参数数 ≥ 原函数长度时执行
    - Lodash `_.curry` 是参考实现

- [x] 函数组合（pipe/compose）
  - 问：compose 一行怎么写？
  - 答：
    - `const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x)`
    - pipe 用 reduce 替代 reduceRight
    - 异步版需返回 Promise

- [x] 虚拟 DOM 简单实现
  - 问：手写 VDOM 三步？
  - 答：
    - `h(tag, props, children)` 生成 VNode
    - `render(vnode) → DOM`
    - `diff(oldVNode, newVNode, parent)` 对比并打 patch
    - 同 type 复用，不同 type 替换

- [x] 简单路由实现
  - 问：hash 路由和 history 路由手写？
  - 答：
    - hash：监听 `hashchange`，读 `location.hash`
    - history：`history.pushState` + 监听 `popstate`
    - 维护路径到组件的映射表
    - history 模式需服务端 fallback 到 index.html

- [x] 中间件模式实现
  - 问：Koa 洋葱模型怎么写？
  - 答：
    - 中间件签名 `(ctx, next) => void`
    - `compose(middlewares)` 返回 dispatch 函数
    - `dispatch(i)` 执行第 i 个，next 触发 `dispatch(i+1)`
    - 保证每个中间件的 next 只能调用一次

- [x] 依赖注入容器
  - 问：DI 容器最小实现？
  - 答：
    - `register(token, factory)`、`resolve(token)`
    - 缓存单例、支持 transient 生命周期
    - 解决依赖：factory 接受 container 再 resolve 依赖
    - 循环依赖：抛错或 lazy 代理

- [x] 简单模板引擎
  - 问：手写最小模板引擎思路？
  - 答：
    - 正则匹配 `{{ var }}` 替换成对应值
    - 支持语句：`<% %>` 用 Function 拼字符串生成函数
    - 防 XSS：变量默认 escape
    - 参考实现：`lodash.template`、`ejs`

### 手写题考查要点

- [x] 代码质量和规范性：变量命名、函数拆分、错误处理
  - 问：面试手写怎么体现"规范"？
  - 答：
    - 有意义的命名（prev/next、i/j 在简单循环可接受）
    - 小函数拆分（超 15 行就想想能不能拆）
    - 错误分支显式处理，别静默 catch
    - 保留必要的 TODO / FIXME 说明

- [x] 边界情况处理：null/undefined、空数组、类型检查
  - 问：哪些边界最容易被面试官追问？
  - 答：
    - 输入为空（null/undefined/[]/'')
    - 单个元素 / 全部相同
    - 极值（MAX_SAFE_INTEGER、负数、0）
    - 特殊 Unicode（emoji、组合字符）

- [x] 性能考虑：时间复杂度、内存泄漏、优化策略
  - 问：手写题常见性能坑？
  - 答：
    - 嵌套循环里重复读长度 / 属性
    - 闭包持有大对象不释放
    - 定时器 / 事件监听没清理
    - 递归栈深度风险（改迭代或尾递归）

- [x] 扩展性：代码是否易于扩展和维护
  - 问：扩展性怎么体现？
  - 答：
    - 关键点暴露为配置参数（容量、超时、并发数）
    - 内部状态可查询 / 可重置
    - 接口稳定，内部可替换实现
    - 为后续加钩子预留最小接缝

- [x] 理解原理：不仅要会写，更要理解为什么这样实现
  - 问：面试官追问"为什么这样"怎么答？
  - 答：
    - 能说出方案的权衡（时间 vs 空间、简单 vs 通用）
    - 能举一个对比方案，说明为何不选
    - 能定位标准 / 规范依据（Promise A+、ECMAScript）
    - 能承认不懂的部分，别硬编

## 面试软技能

### 技术沟通
- [x] **技术方案的表达：背景、方案、权衡、结果**
  - 问：讲一个你做过的技术方案，怎么组织表达？
  - 答：
    - 背景：业务痛点、约束条件，不要一上来就是技术细节
    - 方案：主路径一句话讲清，再展开关键节点
    - 权衡：对比过哪些替代方案、为什么放弃
    - 结果：有指标（性能、稳定性、开发效率）最好，没有就讲观察到的变化
- [x] **复杂概念的简化解释**
  - 问：怎么把一个复杂概念讲给不熟悉这一块的人？
  - 答：
    - 先用一个熟悉的类比搭桥（比如 Promise 像"占位收据"）
    - 去掉细节，只留因果链
    - 用一个最小例子走一遍
    - 再按听众追问的方向补精度
- [x] **技术决策的理由和考量**
  - 问：做技术决策时你会考虑哪些维度？
  - 答：
    - 业务需求和时间窗（够用即可，不过度设计）
    - 团队熟悉度和维护成本
    - 生态和社区活跃度
    - 性能、包体积、可观测性等非功能指标
- [x] **开放性问题的思考框架**
  - 问：遇到"怎么设计 xx"这种开放题怎么打开思路？
  - 答：
    - 先澄清边界：用户规模、功能范围、关键约束
    - 列目标和反目标（不做什么）
    - 拆模块：数据、接口、渲染、状态、容错
    - 先给一个能跑的版本，再谈优化和扩展

### 项目经验
- [x] **STAR 方法：Situation、Task、Action、Result**
  - 问：STAR 四部分各讲什么？
  - 答：
    - Situation：项目背景、团队规模、角色
    - Task：具体交给你的目标和难点
    - Action：你做了什么决策、写了哪些关键代码
    - Result：量化产出，没数据就讲变化和反馈
- [x] **项目难点的识别和解决过程**
  - 问：项目里真正的难点怎么讲？
  - 答：
    - 讲它为什么难（技术约束、历史包袱、时间压力）
    - 讲走过的弯路，而不是一上来就最优解
    - 定位手段（日志、profiling、复现脚本）
    - 最终方案和它的副作用
- [x] **技术选型的依据和权衡**
  - 问：为什么选 A 不选 B？
  - 答：
    - 先说当时的约束（时间、团队、上下游）
    - 列候选和关键差异点
    - 给选择的核心理由（往往是一两条）
    - 承认代价：选 A 意味着放弃 B 的什么
- [x] **团队协作和冲突处理**
  - 问：和同事在技术方案上冲突怎么处理？
  - 答：
    - 先把分歧降到具体点，而不是"方向不对"
    - 用数据 / 小范围试验验证，不靠嗓门
    - 区分不可逆决策和可逆决策，可逆的先跑起来
    - 最后留下会议纪要或 ADR，避免反复讨论
- [x] **持续改进和学习总结**
  - 问：项目结束后你怎么沉淀？
  - 答：
    - 写复盘：做对的、做错的、下次怎么做
    - 抽象可复用的工具或模板
    - 分享给团队，让教训不只属于自己
    - 定期回看旧复盘，看哪些改进真的发生了

### 问题解决
- [x] **调试技巧和工具使用**
  - 问：你常用的调试手段有哪些？
  - 答：
    - 最小复现：删到只剩出问题的代码
    - 浏览器 DevTools：Sources 断点、Network、Performance、Memory
    - 线上：Sentry、日志、埋点回放
    - `console.log` 不丢人，但复杂问题该上断点就上
- [x] **性能问题的定位和优化**
  - 问：页面慢了你怎么查？
  - 答：
    - 先拆阶段：网络、解析、渲染、交互哪段慢
    - 工具：Lighthouse、Performance 面板、Web Vitals
    - 定位热点：长任务、重排、重复渲染、包体积
    - 优化后要量化对比，别凭感觉
- [x] **线上故障的排查和处理**
  - 问：线上出问题的标准流程？
  - 答：
    - 先止血：回滚、降级、限流，不要先追根因
    - 同步信息：同步到相关方，别闷头查
    - 定位：日志、监控、近期变更对比
    - 事后写复盘，补监控和回归测试
- [x] **代码质量的保证和改进**
  - 问：怎么保证团队代码质量？
  - 答：
    - 工具兜底：TypeScript、ESLint、Prettier、测试覆盖
    - 流程兜底：Code Review、CI 必过
    - 文化兜底：鼓励重构和留 TODO，而不是攒债
    - 指标关注：重复率、圈复杂度、bug 密度
- [x] **技术债务的识别和清理**
  - 问：技术债怎么管？
  - 答：
    - 先记账：列清单，标成本和影响
    - 分级：阻塞业务的优先还，能忍的排期
    - 借还一起算：新需求顺手带一点偿还
    - 定期回顾，别让清单只涨不减

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
