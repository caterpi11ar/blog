---
title: 反对 Prop Drilling
author: caterpillar
pubDatetime: 2025-10-10T00:00:00
featured: false
draft: false
tags:
  - React
  - Prop Drilling
  - Context API
  - 组件通信
description: 使用 React Context API 来解决 prop drilling 问题,让组件之间的数据共享变得更加简单
---

我也曾和你一样:在学习 React 基础知识的过程中,努力理解组件的概念、创建组件的核心原则,以及组件间的通信方式。相信你现在已经遇到了 prop drilling 这个问题——需要通过层层嵌套的子组件传递数据,即使这些中间组件根本不需要这些数据,仅仅是为了把它传递给更深层的组件。

如果你还没见识过那种难以维护和理解的繁琐代码,不妨想象一下。我相信,你肯定也会觉得,在 React 应用中共享数据应该有更优雅的方式。

> 有趣的事实:'Zustand' 实际上是德语中 'state' 或 'condition' 的意思

## 为什么使用 Context API?

Context API 不再需要层层 prop 传递, 它增强了组件间依赖关系的可读性(这很有用,尤其是在阅读他人代码时), 并且让组件更加独立, 从而提升了可复用性。正如我下面将展示的,通过自定义 hook, 可以用一行代码访问组件中的数据, 而不是通过无数组件层层传递 prop。

## Context API 如何工作?

设置 Context API 需要三个步骤:
1. 创建 Context
2. 为该 Context 创建并实现 Provider
3. 最后在需要的组件中使用 Context

Provider 是数据的存储中心,这些数据可以是状态值及其 setter 函数、从状态派生的值或方法。
接下来,我将演示如何使用 Context API 处理测验相关的信息。

### 1. 在名为 `quizContext.tsx` 的文件中,创建 Context 及其 Provider

```typescript
import { createContext, useState, type FC } from "react"

/** 测验上下文类型 */
interface QuizContextType {
  /** 问题列表 */
  questions: QuizQuestionType[]
  /** 问题索引 */
  questionIndex: number
}

/** 定义 Context */
export const QuizContext = createContext<QuizContextType | null>(null)

// 定义 Context 的 Provider:
export const QuizContextProvider: FC = ({ children }) => {

  /** 问题列表 */
  const [questions, setQuestions] = useState<QuizQuestionType[] | undefined>()
  /** 问题索引 */
  const [questionIndex, setQuestionIndex] = useState<number>(0)

  /** 测验上下文值 */
  const quizContextValues: QuizContextType = {
    questions,
    questionIndex,
  }

  return (

    /**
     * 将包含要共享值的对象传递给 'value' 属性
     * 'children' 指的是能够访问此 context 数据的组件
     * 它们必须被包裹在这个 Provider 内部,我们将在下一步中看到
     */

    <QuizContext.Provider value={quizContextValues}>{children}</QuizContext.Provider>
  )
}
```

### 2. 实现 Context 的 Provider

为了简单起见,假设我们正在制作一个应用,它的唯一功能是为用户提供测验。在 `main.tsx` 中,我们需要从上面导入 Provider,然后将需要其数据的组件包裹在其中。在这种情况下,是 `<QuizMain />` 组件,我们假设它是其他一些测验相关组件的父组件。

只要 `<QuizMain />` 被包裹在 `<QuizContextProvider>` 内部， `<QuizMain />` 的子组件也能够访问 `<QuizContextProvider>` 的数据
```typescript
import { QuizContextProvider } from "./Contexts/quizContext"

import QuizMain from "./Components/QuizComponents/QuizMain"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QuizContextProvider>
      <QuizMain />
    </QuizContextProvider>
  </React.StrictMode>
)
```

### 3. 访问 Context 的数据

现在是时候使用 Context 中的数据了。如果我们为此创建一个自定义 hook,会非常简单,让我们看看它是什么样子的:

```typescript
import { useContext } from "react"
import { QuizContext } from "../Contexts/quizContext"

/** 自定义 hook 用于访问 QuizContext 中的数据 */
export const useQuizContext = () => {
  const context = useContext(QuizContext)

   /** 如果 context 的值为空,则抛出错误 */
  if (!context) {
    throw new Error("useQuizContext must be used inside QuizContext provider.")
  }

  return context
}
```

最好在单独的文件中创建 hook。我将 useQuizContext hook 的文件命名为 useQuizContext.tsx。

现在我们有了一个包含 Context 中数据的自定义 hook,让我们使用这个 hook 在组件内部访问 Context 中的一些数据:

```typescript
import { useQuizContext } from "/Hooks/useQuizContext"

const QuizMain = () => {
  /** 从自定义 hook 中解构此组件需要的值 */
  const { questions, questionIndex } = useQuizContext()
  /** 这些在上面第一个代码块中 QuizContextProvider 中定义的值,现在可以在整个组件中使用 */
  ...
}
```  
在大型项目中工作时,通常会看到使用多个 context。它们的 Provider 可以简单地相互嵌套,像这样:

```typescript
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MainContextProvider>
      <AnotherContextProvider>
        <QuizContextProvider>
          <QuizMain />
        </QuizContextProvider>
      </AnotherContextProvider>
    </MainContextProvider>
  </React.StrictMode>
)
```

在上面的例子中,`<AnotherContextProvider>` 和 `<QuizContextProvider>` 都能够通过使用其自定义 hook 访问 MainContext 的数据,因为它们嵌套在 `<MainContextProvider>` 内部,以此类推。正如你可能已经了解的,组件树中的 Context Provider 应该按照从包含最通用数据到包含最具体数据的顺序来排列。
