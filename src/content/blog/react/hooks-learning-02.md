---
title: "React Hooks 源码解析（一）：useState 与 useReducer 的底层实现"
pubDatetime: 2025-11-24T00:00:00Z
description: "深入 React 源码，解析 useState 和 useReducer 的实现原理、数据结构和更新机制"
tags:
  - React
featured: false
draft: true
---

## 目录

## 一、Hooks 架构基础

### 1.1 为什么需要了解 Hooks 架构？

在深入具体的 Hook 实现之前，我们需要理解 React Hooks 的整体架构。这不仅能帮助我们理解单个 Hook 的工作原理，更能让我们明白：

- 为什么 Hooks 必须在组件顶层调用？
- 为什么 Hooks 的调用顺序不能改变？
- React 如何追踪和管理多个 Hook 的状态？
- Mount 和 Update 阶段有什么本质区别？

### 1.2 Fiber 架构与 Hooks 的关系

React 16 引入的 Fiber 架构是 Hooks 得以实现的基础。每个函数组件对应一个 Fiber 节点：

```typescript
type Fiber = {
  // 组件类型
  tag: WorkTag
  type: any

  // Hooks 链表的头节点
  memoizedState: Hook | null

  // 更新队列
  updateQueue: any

  // 指向其他 Fiber 节点的指针
  return: Fiber | null
  child: Fiber | null
  sibling: Fiber | null

  // 双缓存
  alternate: Fiber | null

  // ...其他属性
}
```

**关键点：** `fiber.memoizedState` 指向该组件的第一个 Hook 对象。

### 1.3 Hook 对象的数据结构

每个 Hook 调用都会创建一个 Hook 对象，这些对象通过 `next` 指针连接成链表：

```typescript
type Hook = {
  // 当前 Hook 的状态值
  // - useState: 存储 state 值
  // - useEffect: 存储 effect 对象
  // - useMemo: 存储缓存的值和依赖数组 [value, deps]
  memoizedState: any

  // 基础状态（用于处理优先级更新）
  baseState: any

  // 基础更新队列（存储被跳过的低优先级更新）
  baseQueue: Update<any> | null

  // 当前更新队列
  queue: UpdateQueue<any> | null

  // 指向下一个 Hook
  next: Hook | null
}
```

### 1.4 Hooks 链表结构示例

```javascript
function Counter() {
  const [count, setCount] = useState(0)        // Hook 1
  const [name, setName] = useState('React')    // Hook 2
  const [visible, setVisible] = useState(true) // Hook 3

  // ...
}
```

在 Fiber 节点上的存储结构：

```
Fiber.memoizedState
    ↓
  Hook1 (count: 0)
    ↓ next
  Hook2 (name: 'React')
    ↓ next
  Hook3 (visible: true)
    ↓ next
  null
```

**这就是为什么 Hooks 必须在顶层调用：** React 依赖 Hooks 的调用顺序来匹配链表中的节点。如果顺序改变，状态就会错乱。

### 1.5 Mount 与 Update 两套实现

React 为 Hooks 维护了两套不同的实现：

```typescript
// Mount 阶段（首次渲染）的 Dispatcher
const HooksDispatcherOnMount: Dispatcher = {
  useState: mountState,
  useReducer: mountReducer,
  useEffect: mountEffect,
  useMemo: mountMemo,
  // ...
}

// Update 阶段（后续更新）的 Dispatcher
const HooksDispatcherOnUpdate: Dispatcher = {
  useState: updateState,
  useReducer: updateReducer,
  useEffect: updateEffect,
  useMemo: updateMemo,
  // ...
}
```

React 在渲染函数组件时，会根据 `current` Fiber 是否存在来切换 Dispatcher：

```javascript
function renderWithHooks(current, workInProgress, Component, props) {
  currentlyRenderingFiber = workInProgress

  // 清空旧的 Hooks 链表
  workInProgress.memoizedState = null
  workInProgress.updateQueue = null

  // 根据是否存在 current 决定使用哪套 Dispatcher
  ReactCurrentDispatcher.current =
    current === null || current.memoizedState === null
      ? HooksDispatcherOnMount
      : HooksDispatcherOnUpdate

  // 执行组件函数
  let children = Component(props)

  // 渲染完成后重置 Dispatcher（防止在组件外调用 Hooks）
  ReactCurrentDispatcher.current = ContextOnlyDispatcher

  return children
}
```

---

## 二、useState 源码深度解析

### 2.1 基本用法回顾

```typescript
const [state, setState] = useState(initialState)

// 两种更新方式
setState(newValue)              // 直接传值
setState(prev => prev + 1)      // 函数式更新
```

### 2.2 Mount 阶段：mountState

首次调用 `useState` 时执行 `mountState`：

```javascript
function mountState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  // 1. 创建 Hook 对象并添加到链表
  const hook = mountWorkInProgressHook()

  // 2. 处理初始状态（支持函数形式）
  if (typeof initialState === 'function') {
    // 惰性初始化：只在首次渲染时执行
    initialState = (initialState: any)()
  }

  // 3. 保存初始状态
  hook.memoizedState = hook.baseState = initialState

  // 4. 创建更新队列
  const queue: UpdateQueue<S, BasicStateAction<S>> = {
    pending: null,
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: (initialState: any),
  }
  hook.queue = queue

  // 5. 创建 dispatch 函数（通过 bind 绑定当前 fiber 和 queue）
  const dispatch: Dispatch<BasicStateAction<S>> = (queue.dispatch =
    (dispatchSetState.bind(null, currentlyRenderingFiber, queue): any))

  return [hook.memoizedState, dispatch]
}
```

#### mountWorkInProgressHook 的实现

```javascript
function mountWorkInProgressHook(): Hook {
  // 创建新的 Hook 对象
  const hook: Hook = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  }

  if (workInProgressHook === null) {
    // 这是第一个 Hook
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook
  } else {
    // 追加到链表末尾
    workInProgressHook = workInProgressHook.next = hook
  }

  return workInProgressHook
}
```

**关键点：**
- `workInProgressHook` 是一个全局变量，指向当前正在处理的 Hook
- 第一个 Hook 会赋值给 `fiber.memoizedState`
- 后续 Hook 通过 `next` 指针连接
- `dispatch` 函数通过闭包捕获了 fiber 和 queue，所以可以在任何地方调用

### 2.3 basicStateReducer：useState 的 reducer

```javascript
function basicStateReducer<S>(state: S, action: BasicStateAction<S>): S {
  // 支持两种形式
  // 1. 直接传值：setState(newValue)
  // 2. 函数式更新：setState(prev => prev + 1)
  return typeof action === 'function' ? action(state) : action
}
```

**这揭示了一个重要事实：** `useState` 本质上是一个内置了 `basicStateReducer` 的 `useReducer`！

### 2.4 Update 阶段：updateState

后续渲染时调用 `updateState`：

```javascript
function updateState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  // 直接复用 updateReducer
  return updateReducer(basicStateReducer, (initialState: any))
}
```

**注意：** `updateState` 直接调用了 `updateReducer`，这进一步证明了 useState 就是简化版的 useReducer。

### 2.5 dispatchSetState：状态更新的核心

当我们调用 `setState` 时，实际执行的是 `dispatchSetState`：

```javascript
function dispatchSetState<S, A>(
  fiber: Fiber,
  queue: UpdateQueue<S, A>,
  action: A,
): void {
  // 1. 获取当前更新的优先级
  const lane = requestUpdateLane(fiber)

  // 2. 创建 update 对象
  const update: Update<S, A> = {
    lane,
    action,
    hasEagerState: false,
    eagerState: null,
    next: (null: any),
  }

  // 3. 判断是否是 render 阶段的更新
  if (fiber === currentlyRenderingFiber ||
      (fiber.alternate !== null && fiber.alternate === currentlyRenderingFiber)) {
    // Render 阶段更新，标记需要重新渲染
    didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate = true
    const pending = queue.pending
    if (pending === null) {
      update.next = update
    } else {
      update.next = pending.next
      pending.next = update
    }
    queue.pending = update
  } else {
    // 4. 尝试提前计算新状态（Eager State 优化）
    const alternate = fiber.alternate
    if (
      fiber.lanes === NoLanes &&
      (alternate === null || alternate.lanes === NoLanes)
    ) {
      // 当前队列为空，可以提前计算
      const lastRenderedReducer = queue.lastRenderedReducer
      if (lastRenderedReducer !== null) {
        try {
          const currentState: S = (queue.lastRenderedState: any)
          const eagerState = lastRenderedReducer(currentState, action)

          // 标记为已计算
          update.hasEagerState = true
          update.eagerState = eagerState

          // 5. 如果新旧状态相同，跳过更新！
          if (is(eagerState, currentState)) {
            // 状态没变，无需调度更新
            enqueueConcurrentHookUpdateAndEagerlyBailout(fiber, queue, update)
            return
          }
        } catch (error) {
          // 计算出错，继续正常流程
        }
      }
    }

    // 6. 将 update 加入队列
    const root = enqueueConcurrentHookUpdate(fiber, queue, update, lane)
    if (root !== null) {
      // 7. 调度更新
      scheduleUpdateOnFiber(root, fiber, lane)
      entangleTransitionUpdate(root, queue, lane)
    }
  }

  // 8. 标记状态转换（用于 DevTools）
  markUpdateInDevTools(fiber, lane, action)
}
```

#### 关键优化点

**1. Eager State 计算**

当队列为空时，React 会立即计算新状态：

```javascript
const currentState = queue.lastRenderedState
const eagerState = lastRenderedReducer(currentState, action)
```

**2. 浅比较优化**

使用 `Object.is` 比较新旧状态，相同则跳过更新：

```javascript
if (is(eagerState, currentState)) {
  return // 不触发重新渲染
}
```

**3. 更新队列的环形链表结构**

```javascript
const pending = queue.pending
if (pending === null) {
  // 第一个 update，指向自己形成环
  update.next = update
} else {
  // 插入到环的末尾
  update.next = pending.next
  pending.next = update
}
queue.pending = update // pending 始终指向最后一个 update
```

这种设计的好处：
- `queue.pending` 指向最后一个 update
- `queue.pending.next` 指向第一个 update
- 可以快速在末尾插入，从头部开始遍历

### 2.6 Object.is 比较算法

```javascript
function is(x: any, y: any): boolean {
  return (
    (x === y && (x !== 0 || 1 / x === 1 / y)) || // 处理 +0 和 -0
    (x !== x && y !== y) // 处理 NaN
  )
}
```

**注意：** 这是浅比较，对象引用相同才相等：

```javascript
// ❌ 即使内容相同，但引用不同，会触发更新
setState({ count: 1 })
setState({ count: 1 }) // 触发更新

// ✅ 引用相同，跳过更新
const obj = { count: 1 }
setState(obj)
setState(obj) // 不触发更新
```

---

## 三、useReducer 源码深度解析

### 3.1 基本用法回顾

```typescript
const [state, dispatch] = useReducer(reducer, initialArg, init)

// reducer 函数
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    default:
      return state
  }
}
```

### 3.2 Mount 阶段：mountReducer

```javascript
function mountReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: I => S,
): [S, Dispatch<A>] {
  // 1. 创建 Hook 对象
  const hook = mountWorkInProgressHook()

  // 2. 初始化状态（支持三种方式）
  let initialState
  if (init !== undefined) {
    // 方式 1: 使用 init 函数计算初始状态
    initialState = init(initialArg)
  } else {
    // 方式 2: 直接使用 initialArg
    initialState = (initialArg: any)
  }

  // 3. 保存初始状态
  hook.memoizedState = hook.baseState = initialState

  // 4. 创建更新队列
  const queue: UpdateQueue<S, A> = {
    pending: null,
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: reducer, // 保存 reducer 函数
    lastRenderedState: (initialState: any),
  }
  hook.queue = queue

  // 5. 创建 dispatch 函数
  const dispatch: Dispatch<A> = (queue.dispatch = (dispatchReducerAction.bind(
    null,
    currentlyRenderingFiber,
    queue,
  ): any))

  return [hook.memoizedState, dispatch]
}
```

### 3.3 Update 阶段：updateReducer

这是整个 Hook 系统最复杂的部分，处理了优先级调度、update 队列合并等逻辑：

```javascript
function updateReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: I => S,
): [S, Dispatch<A>] {
  // 1. 获取当前 Hook（从链表中取出对应位置的 Hook）
  const hook = updateWorkInProgressHook()
  const queue = hook.queue

  if (queue === null) {
    throw new Error('Should have a queue.')
  }

  // 更新 reducer（支持动态 reducer）
  queue.lastRenderedReducer = reducer

  // 2. 获取 current Hook（上一次渲染的 Hook）
  const current: Hook = (currentHook: any)

  // 3. 获取待处理的更新队列
  let baseQueue = current.baseQueue

  // 4. 将 pending 队列合并到 base 队列
  const pendingQueue = queue.pending
  if (pendingQueue !== null) {
    // 合并逻辑
    if (baseQueue !== null) {
      // baseQueue 和 pendingQueue 都存在，需要合并
      const baseFirst = baseQueue.next
      const pendingFirst = pendingQueue.next
      baseQueue.next = pendingFirst
      pendingQueue.next = baseFirst
    }

    // 更新 current 的 baseQueue
    if (current.baseQueue !== baseQueue) {
      current.baseQueue = baseQueue = pendingQueue
    }
    queue.pending = null
  }

  // 5. 处理更新队列
  if (baseQueue !== null) {
    // 从环形链表中取出第一个 update
    const first = baseQueue.next
    let newState = current.baseState

    let newBaseState = null
    let newBaseQueueFirst = null
    let newBaseQueueLast = null
    let update = first

    do {
      // 获取 update 的优先级
      const updateLane = removeLanes(update.lane, OffscreenLane)
      const isHiddenUpdate = updateLane !== update.lane

      // 判断当前 update 是否应该在本次渲染中处理
      const shouldSkipUpdate = isHiddenUpdate
        ? !isSubsetOfLanes(getWorkInProgressRootRenderLanes(), updateLane)
        : !isSubsetOfLanes(renderLanes, updateLane)

      if (shouldSkipUpdate) {
        // 6. 跳过低优先级更新
        const clone: Update<S, A> = {
          lane: updateLane,
          action: update.action,
          hasEagerState: update.hasEagerState,
          eagerState: update.eagerState,
          next: (null: any),
        }

        // 将跳过的 update 保存到新的 base 队列
        if (newBaseQueueLast === null) {
          newBaseQueueFirst = newBaseQueueLast = clone
          newBaseState = newState
        } else {
          newBaseQueueLast = newBaseQueueLast.next = clone
        }

        // 合并优先级（确保后续能处理这个 update）
        currentlyRenderingFiber.lanes = mergeLanes(
          currentlyRenderingFiber.lanes,
          updateLane,
        )
        markSkippedUpdateLanes(updateLane)
      } else {
        // 7. 处理当前 update

        // 如果已有跳过的 update，需要将当前 update 也加入 base 队列
        if (newBaseQueueLast !== null) {
          const clone: Update<S, A> = {
            lane: NoLane, // 已处理的 update 优先级设为 NoLane
            action: update.action,
            hasEagerState: update.hasEagerState,
            eagerState: update.eagerState,
            next: (null: any),
          }
          newBaseQueueLast = newBaseQueueLast.next = clone
        }

        // 8. 计算新状态
        const action = update.action
        if (update.hasEagerState) {
          // 使用预先计算的状态
          newState = ((update.eagerState: any): S)
        } else {
          // 调用 reducer 计算新状态
          newState = reducer(newState, action)
        }
      }

      update = update.next
    } while (update !== null && update !== first)

    // 9. 更新 base 队列
    if (newBaseQueueLast === null) {
      newBaseState = newState
    } else {
      newBaseQueueLast.next = (newBaseQueueFirst: any)
    }

    // 10. 更新 Hook 对象
    if (!is(newState, hook.memoizedState)) {
      markWorkInProgressReceivedUpdate()
    }

    hook.memoizedState = newState
    hook.baseState = newBaseState
    hook.baseQueue = newBaseQueueLast

    queue.lastRenderedState = newState
  }

  // 11. 处理交错更新（interleaved updates）
  if (baseQueue === null) {
    queue.lanes = NoLanes
  }

  const dispatch: Dispatch<A> = (queue.dispatch: any)
  return [hook.memoizedState, dispatch]
}
```

#### updateWorkInProgressHook 的实现

```javascript
function updateWorkInProgressHook(): Hook {
  // 1. 移动指针到下一个 Hook
  let nextCurrentHook: null | Hook
  if (currentHook === null) {
    // 第一个 Hook
    const current = currentlyRenderingFiber.alternate
    if (current !== null) {
      nextCurrentHook = current.memoizedState
    } else {
      nextCurrentHook = null
    }
  } else {
    // 后续 Hook
    nextCurrentHook = currentHook.next
  }

  let nextWorkInProgressHook: null | Hook
  if (workInProgressHook === null) {
    nextWorkInProgressHook = currentlyRenderingFiber.memoizedState
  } else {
    nextWorkInProgressHook = workInProgressHook.next
  }

  if (nextWorkInProgressHook !== null) {
    // 已有 work-in-progress Hook（重新渲染的情况）
    workInProgressHook = nextWorkInProgressHook
    nextWorkInProgressHook = workInProgressHook.next
    currentHook = nextCurrentHook
  } else {
    // 2. 克隆 current Hook
    if (nextCurrentHook === null) {
      throw new Error('Rendered more hooks than during the previous render.')
    }

    currentHook = nextCurrentHook

    const newHook: Hook = {
      memoizedState: currentHook.memoizedState,
      baseState: currentHook.baseState,
      baseQueue: currentHook.baseQueue,
      queue: currentHook.queue,
      next: null,
    }

    // 3. 添加到新的链表
    if (workInProgressHook === null) {
      currentlyRenderingFiber.memoizedState = workInProgressHook = newHook
    } else {
      workInProgressHook = workInProgressHook.next = newHook
    }
  }

  return workInProgressHook
}
```

**关键点：**
- `currentHook` 指向上一次渲染的 Hook（从 `current` Fiber 获取）
- `workInProgressHook` 指向本次渲染的 Hook（从 `workInProgress` Fiber 获取）
- Update 阶段会复用 current Hook 的信息，但创建新的 Hook 对象

### 3.4 dispatchReducerAction

```javascript
function dispatchReducerAction<S, A>(
  fiber: Fiber,
  queue: UpdateQueue<S, A>,
  action: A,
): void {
  const lane = requestUpdateLane(fiber)

  const update: Update<S, A> = {
    lane,
    action,
    hasEagerState: false,
    eagerState: null,
    next: (null: any),
  }

  if (isRenderPhaseUpdate(fiber)) {
    enqueueRenderPhaseUpdate(queue, update)
  } else {
    const root = enqueueConcurrentHookUpdate(fiber, queue, update, lane)
    if (root !== null) {
      scheduleUpdateOnFiber(root, fiber, lane)
      entangleTransitionUpdate(root, queue, lane)
    }
  }
}
```

**对比 `dispatchSetState`：**
- `dispatchReducerAction` 没有 Eager State 优化（因为 reducer 可能有副作用）
- 其他流程基本相同

---

## 四、useState vs useReducer：本质联系

### 4.1 useState 是 useReducer 的特例

```javascript
// useState 的实现
function mountState<S>(initialState) {
  const hook = mountWorkInProgressHook()
  // ...
  const queue = {
    // ...
    lastRenderedReducer: basicStateReducer, // ← 关键
  }
  // ...
}

function updateState<S>(initialState) {
  return updateReducer(basicStateReducer, initialState) // ← 关键
}
```

可以看到：
1. `mountState` 使用 `basicStateReducer` 作为 reducer
2. `updateState` 直接调用 `updateReducer`

### 4.2 完全等价的实现

```javascript
// 这两种写法完全等价

// 写法 1: useState
const [count, setCount] = useState(0)
setCount(1)
setCount(c => c + 1)

// 写法 2: useReducer
const [count, setCount] = useReducer(
  (state, action) => typeof action === 'function' ? action(state) : action,
  0
)
setCount(1)
setCount(c => c + 1)
```

### 4.3 何时使用 useReducer？

当满足以下条件时，考虑使用 `useReducer`：

**1. 复杂的状态逻辑**

```javascript
// ❌ useState: 多个相关状态分散
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)
const [data, setData] = useState(null)

// ✅ useReducer: 统一管理
const [state, dispatch] = useReducer(reducer, {
  loading: false,
  error: null,
  data: null,
})
```

**2. 多个状态需要同时更新**

```javascript
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { loading: true, error: null, data: null }
    case 'FETCH_SUCCESS':
      return { loading: false, error: null, data: action.payload }
    case 'FETCH_ERROR':
      return { loading: false, error: action.payload, data: null }
  }
}
```

**3. 下一个状态依赖于前一个状态**

```javascript
// ❌ useState: 可能出现竞态问题
const [state, setState] = useState({ count: 0, step: 1 })
const increment = () => {
  setState({ ...state, count: state.count + state.step })
}

// ✅ useReducer: 始终基于最新状态
const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step }
  }
}
```

---

## 五、优先级调度机制

### 5.1 Lane 模型

React 18 使用 Lane 模型管理更新优先级：

```typescript
export type Lane = number
export type Lanes = number

// 优先级定义（部分）
export const NoLane: Lane = 0b0000000000000000000000000000000
export const SyncLane: Lane = 0b0000000000000000000000000000001
export const InputContinuousLane: Lane = 0b0000000000000000000000000000100
export const DefaultLane: Lane = 0b0000000000000000000000000010000
export const TransitionLane1: Lane = 0b0000000000000000000000001000000
```

**数值越小，优先级越高。**

### 5.2 优先级调度示例

```javascript
function Counter() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    // 高优先级更新（用户交互）
    setCount(1)

    // 低优先级更新（在 Transition 中）
    startTransition(() => {
      setCount(2)
    })
  }

  return <button onClick={handleClick}>{count}</button>
}
```

执行流程：
1. 两次 `setCount` 都会创建 update，加入队列
2. 第一次渲染：只处理高优先级的 `setCount(1)`，count 变为 1
3. 低优先级的 `setCount(2)` 被跳过，保存到 `baseQueue`
4. 第二次渲染：处理 `baseQueue` 中的低优先级更新，count 变为 2

### 5.3 baseState 和 baseQueue 的作用

```javascript
// 初始状态
state = 0, baseState = 0, baseQueue = null

// 依次执行：
setCount(1)  // 高优先级
setCount(2)  // 低优先级
setCount(s => s + 1)  // 高优先级

// 第一次渲染（只处理高优先级）：
state = 2       // 处理了 update1 (1) 和 update3 (+1)
baseState = 0   // 开始跳过的位置
baseQueue = [update2, update3]  // 保存跳过的 update2 和之后的 update3

// 第二次渲染（处理 baseQueue）：
state = 3       // 从 baseState (0) 开始，依次处理 update1 (1), update2 (2), update3 (+1)
baseState = 3
baseQueue = null
```

**关键点：** 一旦有 update 被跳过，后续所有 update 都要保存到 baseQueue，确保最终结果一致。

---

## 六、性能优化技巧

### 6.1 避免不必要的状态更新

React 内部有 Eager State 优化机制（在 2.5 节介绍过），但我们也需要主动避免不必要的更新。

#### 6.1.1 相同值检查

```javascript
// ❌ 即使值相同也会创建新对象，触发重新渲染
const [user, setUser] = useState({ name: 'John', age: 25 })

const updateName = (newName) => {
  setUser({ ...user, name: newName }) // 每次都创建新对象
}

// ✅ 提前检查，避免不必要的更新
const updateName = (newName) => {
  if (user.name !== newName) {
    setUser({ ...user, name: newName })
  }
}

// ✅ 使用函数式更新，返回相同引用跳过更新
const updateName = (newName) => {
  setUser(prev => prev.name === newName ? prev : { ...prev, name: newName })
}
```

#### 6.1.2 合并相关状态

```javascript
// ❌ 多个相关状态分散，容易不一致
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)
const [data, setData] = useState(null)

const fetchData = async () => {
  setLoading(true)
  setError(null) // 多次更新
  try {
    const result = await api.fetch()
    setData(result)
    setLoading(false) // 再次更新
  } catch (err) {
    setError(err)
    setLoading(false) // 又是一次更新
  }
}

// ✅ 合并为一个状态，原子性更新
const [state, setState] = useState({
  loading: false,
  error: null,
  data: null,
})

const fetchData = async () => {
  setState({ loading: true, error: null, data: null })
  try {
    const result = await api.fetch()
    setState({ loading: false, error: null, data: result })
  } catch (err) {
    setState({ loading: false, error: err, data: null })
  }
}

// ✅✅ 使用 useReducer 更清晰
const [state, dispatch] = useReducer(reducer, initialState)
```

#### 6.1.4 条件更新优化

```javascript
// ❌ 无条件更新，可能触发不必要的渲染
const [items, setItems] = useState([])

const addItem = (item) => {
  setItems([...items, item]) // 即使 item 已存在也添加
}

// ✅ 检查后再更新
const addItem = (item) => {
  if (!items.find(i => i.id === item.id)) {
    setItems([...items, item])
  }
}

// ✅ 使用 Set 避免重复
const [itemIds, setItemIds] = useState(new Set())

const addItem = (itemId) => {
  if (!itemIds.has(itemId)) {
    setItemIds(new Set([...itemIds, itemId]))
  }
}
```

### 6.2 批量更新

React 18 自动批量更新（Automatic Batching）：

```javascript
function handleClick() {
  setCount(c => c + 1)  // 不会立即重新渲染
  setFlag(f => !f)      // 不会立即重新渲染
  // 两次更新会批量处理，只触发一次渲染
}

// 甚至在异步操作中也会批量处理
setTimeout(() => {
  setCount(c => c + 1)
  setFlag(f => !f)
  // React 18: 批量更新
  // React 17: 两次独立更新
}, 1000)
```

如果需要同步刷新：

```javascript
import { flushSync } from 'react-dom'

flushSync(() => {
  setCount(c => c + 1)
})
// 此时 DOM 已更新
console.log(ref.current.textContent)
```

### 6.3 函数式更新

```javascript
// ❌ 基于旧值更新，可能出现问题
const increment = () => {
  setCount(count + 1)
  setCount(count + 1)  // 仍然基于旧的 count
}

// ✅ 使用函数式更新
const increment = () => {
  setCount(c => c + 1)
  setCount(c => c + 1)  // 基于最新的 count
}
```

### 6.4 惰性初始化

```javascript
// ❌ 每次渲染都执行 expensive 计算
const [state, setState] = useState(expensiveComputation(props))

// ✅ 只在首次渲染时执行
const [state, setState] = useState(() => expensiveComputation(props))
```

---

## 七、常见陷阱与解决方案

### 7.1 闭包陷阱

```javascript
function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      console.log(count)  // ❌ 永远打印 0
      setCount(count + 1) // ❌ 永远设置为 1
    }, 1000)

    return () => clearInterval(timer)
  }, []) // 空依赖数组

  return <div>{count}</div>
}
```

**问题：** `useEffect` 的回调函数捕获了初始的 `count` (0)，后续更新不会获取新值。

**解决方案：**

```javascript
// 方案 1: 使用函数式更新
setCount(c => c + 1)  // ✅ 始终基于最新值

// 方案 2: 添加依赖
useEffect(() => {
  const timer = setInterval(() => {
    setCount(count + 1)
  }, 1000)
  return () => clearInterval(timer)
}, [count]) // ✅ 依赖 count

// 方案 3: 使用 useRef
const countRef = useRef(count)
countRef.current = count

useEffect(() => {
  const timer = setInterval(() => {
    setCount(countRef.current + 1)
  }, 1000)
  return () => clearInterval(timer)
}, [])
```

### 7.2 对象/数组状态更新

```javascript
// ❌ 直接修改状态
const handleClick = () => {
  state.count = 1
  setState(state)  // React 检测不到变化
}

// ✅ 创建新对象
const handleClick = () => {
  setState({ ...state, count: 1 })
}

// ✅ 使用 Immer（推荐）
import { useImmer } from 'use-immer'

const [state, setState] = useImmer({ count: 0 })
const handleClick = () => {
  setState(draft => {
    draft.count = 1  // 可以直接修改
  })
}
```

### 7.3 条件调用 Hook

```javascript
// ❌ 条件调用会打乱链表顺序
function Component({ condition }) {
  if (condition) {
    const [state, setState] = useState(0) // 错误！
  }
}

// ✅ 始终调用，条件判断放在内部
function Component({ condition }) {
  const [state, setState] = useState(0)

  if (condition) {
    // 使用 state
  }
}
```

---

## 八、思考题

1. **为什么多次调用 `setState` 只触发一次渲染？**
   <details>
   <summary>点击查看答案</summary>

   React 18 的自动批量更新（Automatic Batching）机制。多个 `setState` 调用会创建多个 update 对象，加入同一个队列，然后一次性处理。
   </details>

2. **什么是 Eager State 优化？它何时生效？**
   <details>
   <summary>点击查看答案</summary>

   当队列为空时（`fiber.lanes === NoLanes`），React 会立即计算新状态并与当前状态比较。如果相同（使用 `Object.is` 比较），则跳过更新，不触发重新渲染。
   </details>

3. **为什么 `useReducer` 没有 Eager State 优化？**
   <details>
   <summary>点击查看答案</summary>

   因为 reducer 函数可能包含副作用或依赖外部变量，提前执行可能导致不一致。`useState` 的 `basicStateReducer` 是纯函数，可以安全地提前执行。
   </details>

4. **如果在渲染过程中调用 `setState`，会发生什么？**
   <details>
   <summary>点击查看答案</summary>

   会标记为 Render Phase Update，update 会加入队列，但不会立即调度新的渲染。当前渲染完成后，会检查是否有 Render Phase Update，如果有则重新渲染。
   </details>

---

## 九、总结

### 核心要点

1. **Hooks 基于链表实现**，通过调用顺序来匹配状态
2. **useState 是 useReducer 的特例**，使用 `basicStateReducer`
3. **双阶段设计**：Mount（创建）和 Update（复用）
4. **环形链表管理 update 队列**，支持快速插入和遍历
5. **Eager State 优化**：队列为空时提前计算并比较状态
6. **优先级调度**：使用 Lane 模型，支持跳过低优先级更新
7. **baseState 和 baseQueue**：处理被跳过的更新，保证最终一致性

### 最佳实践

- ✅ 始终在组件顶层调用 Hooks
- ✅ 使用函数式更新避免闭包陷阱
- ✅ 利用惰性初始化优化性能
- ✅ 复杂状态逻辑使用 useReducer
- ✅ 理解批量更新机制
- ❌ 不要在条件语句中调用 Hooks
- ❌ 不要直接修改状态对象

---