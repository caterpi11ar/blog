---
title: React 状态管理最佳实践
author: caterpillar
pubDatetime: 2025-11-11T00:00:00
featured: false
draft: false
tags:
  - React
  - State Management
  - Zustand
  - React Query
  - Context API
description: 深入探讨现代 React 应用的状态管理策略
---

## 概述

现代 React 应用的状态管理应该基于状态的性质和用途进行分层设计。本文将介绍一种实用的状态管理架构:

- **React Query**: 管理服务器状态(占大部分状态)
- **Zustand**: 管理全局客户端状态(用户认证、全局 UI 等)
- **Context API**: 管理局部共享状态(组件树内部共享)
- **useState**: 管理组件本地状态(组件内部状态)

## React Query: 服务器状态管理

### 什么是服务器状态?

服务器状态具有以下特点:

- 存储在远程服务器上
- 需要异步获取和更新
- 可能被其他用户修改(需要同步)
- 存在缓存、失效、重新验证等问题

### 最佳实践

```tsx
import { useQuery, useMutation } from '@tanstack/react-query'
import { queryClient } from '../queryClient' // 单例模式

// 获取数据
function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 5 * 60 * 1000, // 5 分钟内数据视为新鲜
    cacheTime: 10 * 60 * 1000, // 10 分钟后清除缓存
    enabled: !!userId, // 只有当 userId 存在时才执行查询
  })

  const mutation = useMutation({
    onMutate: async (newUser: User) => {
      // 取消正在进行的查询,避免覆盖乐观更新
      await queryClient.cancelQueries({ queryKey: ['user', userId] })

      // 保存当前数据快照用于回滚
      const previousUser = queryClient.getQueryData(['user', userId])

      // 乐观更新 UI
      queryClient.setQueryData(['user', userId], (old: User) =>
        { ...old, ...newUser }
      )

      return { previousUser }
    },
    onError: (err, newUser, context) => {
      // 失败时回滚
      queryClient.setQueryData(['user', userId], context?.previousUser)
    },
    onSettled: () => {
      // onSettled 在查询完成后执行,无论成功还是失败
      // 完成后重新获取确保数据一致
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
    },
  })

  if (isLoading) return <Spinner />
  if (error) return <ErrorMessage error={error} />

  return (
    <div>
      {data.name}
      <button 
        onMouseEnter={() => {
          // 鼠标悬停时预加载
          queryClient.prefetchQuery({
            queryKey: ['userProfile', userId],
            queryFn: () => fetchUserProfile(userId),
          })
        }} 
        onClick={() => mutation.mutate({ name: 'New Name' })}>Update</button>
    </div>)
}
```

### 什么时候使用 Zustand?

适合用 Zustand 管理的全局状态:

- UI 状态(主题、侧边栏展开状态)
- 用户偏好设置(语言、布局)
- 导航历史(前进/后退)
- 临时的跨组件数据(如向导流程中的表单数据)

### 基本使用

```tsx
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 定义 store
interface NavigationStore {
  history: string[]
  currentIndex: number
  canGoBack: boolean
  canGoForward: boolean
  push: (path: string) => void
  goBack: () => void
  goForward: () => void
}

const useNavigationStore = create<NavigationStore>()(
  persist(
    (set, get) => ({
      history: ['/'],
      currentIndex: 0,
      canGoBack: false,
      canGoForward: false,

      push: (path) => set((state) => {
        const newHistory = state.history.slice(0, state.currentIndex + 1)
        newHistory.push(path)
        return {
          history: newHistory,
          currentIndex: newHistory.length - 1,
          canGoBack: true,
          canGoForward: false,
        }
      }),

      goBack: () => set((state) => {
        if (!state.canGoBack) return state
        const newIndex = state.currentIndex - 1
        return {
          currentIndex: newIndex,
          canGoBack: newIndex > 0,
          canGoForward: true,
        }
      }),

      goForward: () => set((state) => {
        if (!state.canGoForward) return state
        const newIndex = state.currentIndex + 1
        return {
          currentIndex: newIndex,
          canGoBack: true,
          canGoForward: newIndex < state.history.length - 1,
        }
      }),
    }),
    {
      name: 'navigation-storage', // localStorage 键名
      partialize: (state) => ({
        history: state.history,
        currentIndex: state.currentIndex,
      }), // 只持久化部分状态
    }
  )
)

// 在组件中使用
function NavigationControls() {
  const { canGoBack, canGoForward, goBack, goForward } = useNavigationStore()

  return (
    <div>
      <button onClick={goBack} disabled={!canGoBack}>
        Back
      </button>
      <button onClick={goForward} disabled={!canGoForward}>
        Forward
      </button>
    </div>
  )
}
```

### 最佳实践

#### 1. 使用选择器(Selectors)优化性能

```tsx
// ❌ 不推荐:订阅整个 store
function Component() {
  const state = useNavigationStore() // 任何状态变化都会重新渲染
  return <div>{state.currentIndex}</div>
}

// ✅ 推荐:只订阅需要的状态
function Component() {
  const currentIndex = useNavigationStore(state => state.currentIndex)
  return <div>{currentIndex}</div>
}

// ✅ 更好:使用 shallow 比较多个值
import { shallow } from 'zustand/shallow'

function Component() {
  const { canGoBack, canGoForward } = useNavigationStore(
    state => ({ canGoBack: state.canGoBack, canGoForward: state.canGoForward }),
    shallow
  )
  return <div>{canGoBack && canGoForward}</div>
}
```

#### 2. 使用切片模式(Slices Pattern)组织大型 Store

```tsx
import { StateCreator } from 'zustand'

// 主题切片
interface ThemeSlice {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const createThemeSlice: StateCreator<
  ThemeSlice & SettingsSlice,
  [],
  [],
  ThemeSlice
> = (set) => ({
  theme: 'light',
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light'
  })),
})

// 设置切片
interface SettingsSlice {
  language: string
  setLanguage: (lang: string) => void
}

const createSettingsSlice: StateCreator<
  ThemeSlice & SettingsSlice,
  [],
  [],
  SettingsSlice
> = (set) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
})

// 组合切片
const useAppStore = create<ThemeSlice & SettingsSlice>()((...a) => ({
  ...createThemeSlice(...a),
  ...createSettingsSlice(...a),
}))
```

#### 3. 使用中间件增强功能

```tsx
import { create } from 'zustand'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

const useStore = create<Store>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set) => ({
          // 使用 immer 简化不可变更新
          users: [],
          addUser: (user) => set((state) => {
            state.users.push(user) // 直接修改,immer 会处理不可变性
          }),
        }))
      ),
      { name: 'app-storage' }
    )
  )
)

// 订阅特定状态变化
useStore.subscribe(
  (state) => state.users,
  (users, prevUsers) => {
    console.log('Users changed:', prevUsers, '->', users)
  }
)
```

## Context API: 组件树状态共享

### 什么时候使用 Context?

Context API 适合在以下场景使用:

- 需要在组件树中共享状态,但不需要全局访问
- 依赖注入(主题、国际化、认证信息等)
- 避免 prop drilling(避免通过多层组件传递 props)
- 特定功能模块的状态隔离

**关键区别**:
- **Zustand**: 全局状态,可以在任何地方访问
- **Context**: 局部共享状态,只在特定组件树中可用

### 基本使用

```tsx
import { createContext, useContext, useState, ReactNode } from 'react'

// 1. 创建 Context
interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// 2. 创建 Provider 组件
interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// 3. 创建自定义 Hook
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// 4. 使用
function App() {
  return (
    <ThemeProvider>
      <Header />
      <MainContent />
    </ThemeProvider>
  )
}

function Header() {
  const { theme, toggleTheme } = useTheme()
  return (
    <header className={theme}>
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
    </header>
  )
}
```

### 最佳实践

#### 1. Context 组合而非单一大 Context

```tsx
// ❌ 不推荐:将所有状态放在一个 Context 中
interface AppContextType {
  user: User
  theme: string
  language: string
  notifications: Notification[]
  settings: Settings
  // ... 更多状态
}

// ✅ 推荐:按功能拆分多个 Context
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <NotificationProvider>
            <Router />
          </NotificationProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
```

#### 3. 性能优化:拆分 Context 避免不必要的重渲染

```tsx
// ❌ 问题:单个 Context 导致所有消费者都重新渲染
interface UserContextType {
  user: User
  updateUser: (user: User) => void
  preferences: Preferences
  updatePreferences: (prefs: Preferences) => void
}

// 即使只有 preferences 变化,使用 user 的组件也会重新渲染

// ✅ 解决方案:拆分成多个 Context
const UserContext = createContext<User | undefined>(undefined)
const UserActionsContext = createContext<{
  updateUser: (user: User) => void
} | undefined>(undefined)

const PreferencesContext = createContext<Preferences | undefined>(undefined)
const PreferencesActionsContext = createContext<{
  updatePreferences: (prefs: Preferences) => void
} | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [preferences, setPreferences] = useState<Preferences>({})

  // 使用 useMemo 避免 actions 对象每次重新创建
  const userActions = useMemo(() => ({
    updateUser: (newUser: User) => setUser(newUser)
  }), [])

  const preferencesActions = useMemo(() => ({
    updatePreferences: (prefs: Preferences) => setPreferences(prefs)
  }), [])

  return (
    <UserContext.Provider value={user}>
      <UserActionsContext.Provider value={userActions}>
        <PreferencesContext.Provider value={preferences}>
          <PreferencesActionsContext.Provider value={preferencesActions}>
            {children}
          </PreferencesActionsContext.Provider>
        </PreferencesContext.Provider>
      </UserActionsContext.Provider>
    </UserContext.Provider>
  )
}

// 现在组件可以只订阅需要的部分
function UserProfile() {
  const user = useContext(UserContext) // 只在 user 变化时重新渲染
  return <div>{user?.name}</div>
}

function PreferencesPanel() {
  const preferences = useContext(PreferencesContext) // 只在 preferences 变化时重新渲染
  return <div>{preferences.theme}</div>
}
```

### Context vs Zustand: 如何选择?

| 特性         | Context API                | Zustand             |
| ------------ | -------------------------- | ------------------- |
| **适用范围** | 组件树局部共享             | 全局状态            |
| **使用场景** | 特定功能模块、依赖注入     | 跨应用的全局状态    |
| **性能**     | 需要手动优化(拆分 Context) | 自动优化(选择器)    |
| **学习曲线** | React 内置,熟悉度高        | 需要学习新 API      |
| **代码量**   | 较多样板代码               | 简洁                |
| **DevTools** | React DevTools             | Redux DevTools 支持 |
| **持久化**   | 需要自己实现               | 内置中间件支持      |

**选择建议**:
- 使用 **Context** 当状态只在特定组件树中需要(如表单向导、特定页面的筛选器)
- 使用 **Zustand** 当状态需要在整个应用中访问(如用户认证、主题、全局通知)

## useState: 组件本地状态

### 什么时候使用 useState?

适合用 useState 管理的状态:

- 表单输入值
- UI 交互状态(模态框打开/关闭、下拉菜单展开/收起)
- 临时计算结果
- 组件内部的控制流程

### 延迟初始化避免性能问题

```tsx
// ❌ 不推荐:每次渲染都会执行昂贵的计算
function Component() {
  const [data] = useState(expensiveComputation())
}

// ✅ 推荐:使用延迟初始化函数,只在首次渲染时执行
function Component() {
  const [data] = useState(() => expensiveComputation())
}
```

## 常见错误和解决方案

### 1. 过度使用全局状态

**问题**: 将所有状态都放在 Zustand 中,包括组件本地状态。

```tsx
// ❌ 错误
const useStore = create((set) => ({
  modalOpen: false,
  inputValue: '',
  dropdownExpanded: false,
  // ...
}))
```

**解决方案**: 仅将真正需要全局共享的状态放入 Zustand。

```tsx
// ✅ 正确
const useGlobalStore = create((set) => ({
  theme: 'light',
  language: 'en',
}))

function Modal() {
  const [isOpen, setIsOpen] = useState(false) // 本地状态
  // ...
}
```

### 2. 在 React Query 中缓存本地状态

**问题**: 将不属于服务器的状态放在 React Query 中管理。

```tsx
// ❌ 错误
const { data: sidebarOpen } = useQuery({
  queryKey: ['sidebarOpen'],
  queryFn: () => true,
})
```

**解决方案**: React Query 只用于服务器状态,UI 状态使用 Zustand 或 useState。

### 3. 忘记使用选择器导致性能问题

**问题**: 订阅整个 Zustand store 导致不必要的重渲染。

```tsx
// ❌ 错误
function Component() {
  const store = useStore() // 任何状态变化都重新渲染
  return <div>{store.specificValue}</div>
}
```

**解决方案**: 使用选择器只订阅需要的状态。

```tsx
// ✅ 正确
function Component() {
  const specificValue = useStore(state => state.specificValue)
  return <div>{specificValue}</div>
}
```

### 4. 不正确的查询键导致缓存问题

**问题**: 查询键不包含所有相关参数,导致缓存混乱。

```tsx
// ❌ 错误
useQuery({
  queryKey: ['users'], // 没有包含 filters
  queryFn: () => fetchUsers(filters),
})
```

**解决方案**: 查询键必须包含所有影响查询结果的参数。

```tsx
// ✅ 正确
useQuery({
  queryKey: ['users', filters],
  queryFn: () => fetchUsers(filters),
})
```

## 总结

现代 React 应用的状态管理应该遵循"分而治之"的原则:

1. **React Query 管理服务器状态** - 占据大部分状态,提供缓存、同步、失效等开箱即用的功能
2. **Zustand 管理全局客户端状态** - 轻量、简单,适合跨应用的全局状态和用户偏好
3. **Context API 管理局部共享状态** - 在特定组件树中共享状态,避免 prop drilling,适合依赖注入
4. **useState 管理本地状态** - 组件内部的临时状态和交互状态

### 快速选择指南

| 状态类型       | 推荐工具    | 典型场景                         |
| -------------- | ----------- | -------------------------------- |
| 服务器数据     | React Query | 用户列表、文章详情、API 数据     |
| 全局客户端状态 | Zustand     | 用户认证、全局通知、导航历史     |
| 局部共享状态   | Context     | 表单向导、依赖注入、特定页面状态 |
| 组件本地状态   | useState    | 表单输入、模态框状态、临时数据   |

选择合适的工具管理对应的状态类型,可以显著简化代码、提升性能,并改善开发体验。记住:不要过度设计,从简单开始,按需增加复杂度。
