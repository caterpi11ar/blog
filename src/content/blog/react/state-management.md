---
title: React 状态管理最佳实践
author: caterpillar
pubDatetime: 2025-01-10T00:00:00
featured: false
draft: false
tags:
  - React
  - State Management
  - Zustand
  - React Query
  - Context API
description: 深入探讨现代 React 应用的状态管理策略:React Query 处理服务器状态,Zustand 管理全局状态,Context API 处理局部共享,useState 管理本地状态
---

## 概述

现代 React 应用的状态管理应该基于状态的性质和用途进行分层设计。本文将介绍一种实用的状态管理架构:

- **React Query**: 管理服务器状态(占大部分状态)
- **Zustand**: 管理全局客户端状态(用户认证、全局 UI 等)
- **Context API**: 管理局部共享状态(组件树内部共享)
- **useState**: 管理组件本地状态(组件内部状态)

## 为什么需要分层状态管理?

传统的状态管理方案(如 Redux)将所有状态放在一个全局 store 中,导致:

1. **服务器状态和客户端状态混杂**:缓存、同步、失效策略难以统一
2. **样板代码过多**:简单的状态管理需要编写大量 actions、reducers
3. **性能优化困难**:全局状态更新容易导致不必要的重渲染
4. **学习曲线陡峭**:新手需要理解复杂的概念

分层管理策略让每种工具专注于其擅长的领域,简化开发并提升性能。

## React Query: 服务器状态管理

### 什么是服务器状态?

服务器状态具有以下特点:

- 存储在远程服务器上
- 需要异步获取和更新
- 可能被其他用户修改(需要同步)
- 存在缓存、失效、重新验证等问题

### 基本使用

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// 获取数据
function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 5 * 60 * 1000, // 5 分钟内数据视为新鲜
    cacheTime: 10 * 60 * 1000, // 10 分钟后清除缓存
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return <div>{data.name}</div>;
}

// 更新数据
function UpdateUserButton({ userId }: { userId: string }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newData: UserData) => updateUser(userId, newData),
    onSuccess: () => {
      // 使相关查询失效,触发重新获取
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });

  return (
    <button onClick={() => mutation.mutate({ name: 'New Name' })}>
      Update
    </button>
  );
}
```

### 最佳实践

#### 1. 使用查询键(Query Keys)管理缓存

```tsx
// 推荐:使用工厂函数统一管理查询键
const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// 使用
useQuery({
  queryKey: userKeys.detail(userId),
  queryFn: () => fetchUser(userId),
});

// 失效特定用户的查询
queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });

// 失效所有用户相关查询
queryClient.invalidateQueries({ queryKey: userKeys.all });
```

#### 2. 乐观更新提升用户体验

```tsx
const mutation = useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    // 取消正在进行的查询,避免覆盖乐观更新
    await queryClient.cancelQueries({ queryKey: ['todos'] });

    // 保存当前数据快照用于回滚
    const previousTodos = queryClient.getQueryData(['todos']);

    // 乐观更新 UI
    queryClient.setQueryData(['todos'], (old: Todo[]) =>
      [...old, newTodo]
    );

    return { previousTodos };
  },
  onError: (err, newTodo, context) => {
    // 失败时回滚
    queryClient.setQueryData(['todos'], context?.previousTodos);
  },
  onSettled: () => {
    // 完成后重新获取确保数据一致
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});
```

#### 3. 使用预加载(Prefetching)优化性能

```tsx
function TodoList() {
  const queryClient = useQueryClient();

  const { data: todos } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  return (
    <ul>
      {todos?.map(todo => (
        <li
          key={todo.id}
          onMouseEnter={() => {
            // 鼠标悬停时预加载详情
            queryClient.prefetchQuery({
              queryKey: ['todo', todo.id],
              queryFn: () => fetchTodoDetail(todo.id),
            });
          }}
        >
          <Link to={`/todo/${todo.id}`}>{todo.title}</Link>
        </li>
      ))}
    </ul>
  );
}
```

#### 4. 分页和无限滚动

```tsx
// 分页
function PaginatedPosts() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['posts', page],
    queryFn: () => fetchPosts(page),
    keepPreviousData: true, // 切换页面时保留旧数据
  });

  return (
    <>
      <PostList posts={data?.posts} />
      <Pagination page={page} onPageChange={setPage} />
    </>
  );
}

// 无限滚动
function InfinitePosts() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
    getNextPageParam: (lastPage, pages) => lastPage.nextPage,
  });

  return (
    <>
      {data?.pages.map((page, i) => (
        <PostList key={i} posts={page.posts} />
      ))}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          Load More
        </button>
      )}
    </>
  );
}
```

#### 5. 依赖查询(Dependent Queries)

```tsx
function UserProjects({ userId }: { userId: string }) {
  // 先获取用户信息
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // 依赖用户信息获取项目列表
  const { data: projects } = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: () => fetchProjects(user!.id),
    enabled: !!user, // 只有当 user 存在时才执行查询
  });

  return <ProjectList projects={projects} />;
}
```

## Zustand: 全局客户端状态管理

### 什么时候使用 Zustand?

适合用 Zustand 管理的全局状态:

- UI 状态(主题、侧边栏展开状态)
- 用户偏好设置(语言、布局)
- 导航历史(前进/后退)
- 临时的跨组件数据(如向导流程中的表单数据)

### 基本使用

```tsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 定义 store
interface NavigationStore {
  history: string[];
  currentIndex: number;
  canGoBack: boolean;
  canGoForward: boolean;
  push: (path: string) => void;
  goBack: () => void;
  goForward: () => void;
}

const useNavigationStore = create<NavigationStore>()(
  persist(
    (set, get) => ({
      history: ['/'],
      currentIndex: 0,
      canGoBack: false,
      canGoForward: false,

      push: (path) => set((state) => {
        const newHistory = state.history.slice(0, state.currentIndex + 1);
        newHistory.push(path);
        return {
          history: newHistory,
          currentIndex: newHistory.length - 1,
          canGoBack: true,
          canGoForward: false,
        };
      }),

      goBack: () => set((state) => {
        if (!state.canGoBack) return state;
        const newIndex = state.currentIndex - 1;
        return {
          currentIndex: newIndex,
          canGoBack: newIndex > 0,
          canGoForward: true,
        };
      }),

      goForward: () => set((state) => {
        if (!state.canGoForward) return state;
        const newIndex = state.currentIndex + 1;
        return {
          currentIndex: newIndex,
          canGoBack: true,
          canGoForward: newIndex < state.history.length - 1,
        };
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
);

// 在组件中使用
function NavigationControls() {
  const { canGoBack, canGoForward, goBack, goForward } = useNavigationStore();

  return (
    <div>
      <button onClick={goBack} disabled={!canGoBack}>
        Back
      </button>
      <button onClick={goForward} disabled={!canGoForward}>
        Forward
      </button>
    </div>
  );
}
```

### 最佳实践

#### 1. 使用选择器(Selectors)优化性能

```tsx
// ❌ 不推荐:订阅整个 store
function Component() {
  const state = useNavigationStore(); // 任何状态变化都会重新渲染
  return <div>{state.currentIndex}</div>;
}

// ✅ 推荐:只订阅需要的状态
function Component() {
  const currentIndex = useNavigationStore(state => state.currentIndex);
  return <div>{currentIndex}</div>;
}

// ✅ 更好:使用 shallow 比较多个值
import { shallow } from 'zustand/shallow';

function Component() {
  const { canGoBack, canGoForward } = useNavigationStore(
    state => ({ canGoBack: state.canGoBack, canGoForward: state.canGoForward }),
    shallow
  );
  return <div>{canGoBack && canGoForward}</div>;
}
```

#### 2. 使用切片模式(Slices Pattern)组织大型 Store

```tsx
import { StateCreator } from 'zustand';

// 主题切片
interface ThemeSlice {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
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
});

// 设置切片
interface SettingsSlice {
  language: string;
  setLanguage: (lang: string) => void;
}

const createSettingsSlice: StateCreator<
  ThemeSlice & SettingsSlice,
  [],
  [],
  SettingsSlice
> = (set) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
});

// 组合切片
const useAppStore = create<ThemeSlice & SettingsSlice>()((...a) => ({
  ...createThemeSlice(...a),
  ...createSettingsSlice(...a),
}));
```

#### 3. 使用中间件增强功能

```tsx
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const useStore = create<Store>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set) => ({
          // 使用 immer 简化不可变更新
          users: [],
          addUser: (user) => set((state) => {
            state.users.push(user); // 直接修改,immer 会处理不可变性
          }),
        }))
      ),
      { name: 'app-storage' }
    )
  )
);

// 订阅特定状态变化
useStore.subscribe(
  (state) => state.users,
  (users, prevUsers) => {
    console.log('Users changed:', prevUsers, '->', users);
  }
);
```

#### 4. 与 TypeScript 配合使用

```tsx
import { create } from 'zustand';

// 定义严格的类型
interface User {
  id: string;
  name: string;
}

interface UserStore {
  users: Map<string, User>;
  addUser: (user: User) => void;
  removeUser: (id: string) => void;
  getUser: (id: string) => User | undefined;
}

const useUserStore = create<UserStore>((set, get) => ({
  users: new Map(),

  addUser: (user) => set((state) => ({
    users: new Map(state.users).set(user.id, user),
  })),

  removeUser: (id) => set((state) => {
    const newUsers = new Map(state.users);
    newUsers.delete(id);
    return { users: newUsers };
  }),

  getUser: (id) => get().users.get(id),
}));
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
import { createContext, useContext, useState, ReactNode } from 'react';

// 1. 创建 Context
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 2. 创建 Provider 组件
interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. 创建自定义 Hook
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// 4. 使用
function App() {
  return (
    <ThemeProvider>
      <Header />
      <MainContent />
    </ThemeProvider>
  );
}

function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className={theme}>
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
    </header>
  );
}
```

### 最佳实践

#### 1. Context 组合而非单一大 Context

```tsx
// ❌ 不推荐:将所有状态放在一个 Context 中
interface AppContextType {
  user: User;
  theme: string;
  language: string;
  notifications: Notification[];
  settings: Settings;
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
  );
}
```

#### 2. 结合 useReducer 管理复杂状态

```tsx
import { createContext, useContext, useReducer, ReactNode } from 'react';

// 状态类型定义
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

// Action 类型定义
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);

      if (existingItem) {
        const items = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        return {
          items,
          total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        };
      }

      const items = [...state.items, action.payload];
      return {
        items,
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };
    }

    case 'REMOVE_ITEM': {
      const items = state.items.filter(item => item.id !== action.payload);
      return {
        items,
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };
    }

    case 'UPDATE_QUANTITY': {
      const items = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        items,
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };
    }

    case 'CLEAR_CART':
      return { items: [], total: 0 };

    default:
      return state;
  }
}

// Context
interface CartContextType {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{ state, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

// 自定义 Hook
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// 使用示例
function ProductPage() {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: '1',
      name: 'Product Name',
      price: 99.99,
      quantity: 1,
    });
  };

  return <button onClick={handleAddToCart}>Add to Cart</button>;
}

function CartSummary() {
  const { state, removeItem } = useCart();

  return (
    <div>
      <h2>Cart ({state.items.length})</h2>
      <ul>
        {state.items.map(item => (
          <li key={item.id}>
            {item.name} x {item.quantity}
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total: ${state.total.toFixed(2)}</p>
    </div>
  );
}
```

#### 3. 性能优化:拆分 Context 避免不必要的重渲染

```tsx
// ❌ 问题:单个 Context 导致所有消费者都重新渲染
interface UserContextType {
  user: User;
  updateUser: (user: User) => void;
  preferences: Preferences;
  updatePreferences: (prefs: Preferences) => void;
}

// 即使只有 preferences 变化,使用 user 的组件也会重新渲染

// ✅ 解决方案:拆分成多个 Context
const UserContext = createContext<User | undefined>(undefined);
const UserActionsContext = createContext<{
  updateUser: (user: User) => void;
} | undefined>(undefined);

const PreferencesContext = createContext<Preferences | undefined>(undefined);
const PreferencesActionsContext = createContext<{
  updatePreferences: (prefs: Preferences) => void;
} | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<Preferences>({});

  // 使用 useMemo 避免 actions 对象每次重新创建
  const userActions = useMemo(
    () => ({
      updateUser: (newUser: User) => setUser(newUser),
    }),
    []
  );

  const preferencesActions = useMemo(
    () => ({
      updatePreferences: (prefs: Preferences) => setPreferences(prefs),
    }),
    []
  );

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
  );
}

// 现在组件可以只订阅需要的部分
function UserProfile() {
  const user = useContext(UserContext); // 只在 user 变化时重新渲染
  return <div>{user?.name}</div>;
}

function PreferencesPanel() {
  const preferences = useContext(PreferencesContext); // 只在 preferences 变化时重新渲染
  return <div>{preferences.theme}</div>;
}
```

#### 4. 使用 Context 实现依赖注入

```tsx
// 定义服务接口
interface ApiService {
  fetchUser: (id: string) => Promise<User>;
  updateUser: (id: string, data: Partial<User>) => Promise<User>;
}

interface LoggerService {
  log: (message: string) => void;
  error: (message: string, error: Error) => void;
}

// 创建 Context
const ApiContext = createContext<ApiService | undefined>(undefined);
const LoggerContext = createContext<LoggerService | undefined>(undefined);

// Provider
export function ServicesProvider({ children }: { children: ReactNode }) {
  // 可以在这里注入不同的实现(例如测试时的 mock)
  const apiService: ApiService = {
    fetchUser: async (id) => {
      const response = await fetch(`/api/users/${id}`);
      return response.json();
    },
    updateUser: async (id, data) => {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return response.json();
    },
  };

  const loggerService: LoggerService = {
    log: (message) => console.log(message),
    error: (message, error) => console.error(message, error),
  };

  return (
    <ApiContext.Provider value={apiService}>
      <LoggerContext.Provider value={loggerService}>
        {children}
      </LoggerContext.Provider>
    </ApiContext.Provider>
  );
}

// 自定义 Hooks
export function useApi() {
  const context = useContext(ApiContext);
  if (!context) throw new Error('useApi must be used within ServicesProvider');
  return context;
}

export function useLogger() {
  const context = useContext(LoggerContext);
  if (!context) throw new Error('useLogger must be used within ServicesProvider');
  return context;
}

// 使用
function UserComponent({ userId }: { userId: string }) {
  const api = useApi();
  const logger = useLogger();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api
      .fetchUser(userId)
      .then((data) => {
        setUser(data);
        logger.log(`Fetched user: ${userId}`);
      })
      .catch((error) => {
        logger.error('Failed to fetch user', error);
      });
  }, [userId, api, logger]);

  return <div>{user?.name}</div>;
}
```

### Context vs Zustand: 如何选择?

| 特性 | Context API | Zustand |
|------|-------------|---------|
| **适用范围** | 组件树局部共享 | 全局状态 |
| **使用场景** | 特定功能模块、依赖注入 | 跨应用的全局状态 |
| **性能** | 需要手动优化(拆分 Context) | 自动优化(选择器) |
| **学习曲线** | React 内置,熟悉度高 | 需要学习新 API |
| **代码量** | 较多样板代码 | 简洁 |
| **DevTools** | React DevTools | Redux DevTools 支持 |
| **持久化** | 需要自己实现 | 内置中间件支持 |

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

### 最佳实践

#### 1. 合并相关状态

```tsx
// ❌ 不推荐:多个相关的 useState
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);

  // 需要同时更新多个状态时很麻烦
}

// ✅ 推荐:使用对象合并相关状态
function Form() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: 0,
  });

  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
}
```

#### 2. 使用 useReducer 管理复杂状态逻辑

```tsx
type State = {
  isOpen: boolean;
  selectedItem: string | null;
  items: string[];
};

type Action =
  | { type: 'open' }
  | { type: 'close' }
  | { type: 'select'; payload: string }
  | { type: 'addItem'; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'open':
      return { ...state, isOpen: true };
    case 'close':
      return { ...state, isOpen: false, selectedItem: null };
    case 'select':
      return { ...state, selectedItem: action.payload };
    case 'addItem':
      return { ...state, items: [...state.items, action.payload] };
    default:
      return state;
  }
}

function Dropdown() {
  const [state, dispatch] = useReducer(reducer, {
    isOpen: false,
    selectedItem: null,
    items: [],
  });

  return (
    <>
      <button onClick={() => dispatch({ type: 'open' })}>
        Open
      </button>
      {state.isOpen && (
        <ul>
          {state.items.map(item => (
            <li
              key={item}
              onClick={() => dispatch({ type: 'select', payload: item })}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
```

#### 3. 延迟初始化避免性能问题

```tsx
// ❌ 不推荐:每次渲染都会执行昂贵的计算
function Component() {
  const [data] = useState(expensiveComputation());
}

// ✅ 推荐:使用函数延迟初始化,只在首次渲染时执行
function Component() {
  const [data] = useState(() => expensiveComputation());
}
```

#### 4. 使用自定义 Hook 封装复用逻辑

```tsx
// 可复用的表单 Hook
function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (field: keyof T) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValues(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const setFieldError = (field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return { values, errors, handleChange, setFieldError, reset };
}

// 使用
function LoginForm() {
  const { values, errors, handleChange, setFieldError } = useForm({
    email: '',
    password: '',
  });

  const handleSubmit = async () => {
    if (!values.email) {
      setFieldError('email', 'Email is required');
      return;
    }
    // 提交逻辑
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={values.email}
        onChange={handleChange('email')}
      />
      {errors.email && <span>{errors.email}</span>}
    </form>
  );
}
```

## 综合实践:构建一个完整的功能

让我们通过一个实际例子展示三种状态管理方式的协同使用:构建一个带筛选、排序和详情查看的用户列表。

```tsx
import { useQuery } from '@tanstack/react-query';
import { create } from 'zustand';
import { useState } from 'react';

// ============ Zustand: 全局 UI 状态 ============
interface UIStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  viewMode: 'grid',
  setViewMode: (mode) => set({ viewMode: mode }),
}));

// ============ React Query: 服务器状态 ============
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
};

function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => fetchUsers(filters),
    staleTime: 5 * 60 * 1000,
  });
}

function useUserDetail(userId: string) {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => fetchUserDetail(userId),
    enabled: !!userId,
  });
}

// ============ 组件实现 ============
interface UserFilters {
  search: string;
  role: string;
  sortBy: 'name' | 'email';
}

function UserList() {
  // Zustand: 全局 UI 状态
  const { viewMode, setViewMode } = useUIStore();

  // useState: 组件本地状态(筛选条件)
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: '',
    sortBy: 'name',
  });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // React Query: 服务器状态
  const { data: users, isLoading } = useUsers(filters);
  const { data: selectedUser } = useUserDetail(selectedUserId!);

  const updateFilter = (field: keyof UserFilters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      {/* 筛选控件 - 本地状态 */}
      <div>
        <input
          placeholder="Search..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
        />
        <select
          value={filters.role}
          onChange={(e) => updateFilter('role', e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <select
          value={filters.sortBy}
          onChange={(e) => updateFilter('sortBy', e.target.value)}
        >
          <option value="name">Name</option>
          <option value="email">Email</option>
        </select>
      </div>

      {/* 视图切换 - 全局状态 */}
      <div>
        <button onClick={() => setViewMode('grid')}>Grid</button>
        <button onClick={() => setViewMode('list')}>List</button>
      </div>

      {/* 用户列表 - 服务器状态 */}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid' : 'list'}>
          {users?.map(user => (
            <div
              key={user.id}
              onClick={() => setSelectedUserId(user.id)}
            >
              {user.name}
            </div>
          ))}
        </div>
      )}

      {/* 用户详情 - 服务器状态 + 本地状态 */}
      {selectedUser && (
        <Modal onClose={() => setSelectedUserId(null)}>
          <h2>{selectedUser.name}</h2>
          <p>{selectedUser.email}</p>
        </Modal>
      )}
    </div>
  );
}
```

## 状态管理决策树

如何选择合适的状态管理方案?

```
是否来自服务器?
├─ 是 → 使用 React Query
│  ├─ 需要缓存和同步 → useQuery
│  ├─ 需要修改数据 → useMutation
│  └─ 需要实时更新 → useQuery + refetchInterval
│
└─ 否 → 是否需要跨多个组件共享?
   ├─ 是 → 需要在整个应用中访问?
   │  ├─ 是 → 使用 Zustand (全局状态)
   │  │  ├─ 用户认证状态
   │  │  ├─ 全局通知
   │  │  ├─ 导航历史
   │  │  └─ 应用级 UI 状态
   │  │
   │  └─ 否 → 使用 Context (局部共享)
   │     ├─ 表单向导状态
   │     ├─ 特定页面的筛选器
   │     ├─ 依赖注入(服务、配置)
   │     └─ 特定功能模块的状态
   │
   └─ 否 → 使用 useState/useReducer (本地状态)
      ├─ 简单状态 → useState
      ├─ 复杂状态逻辑 → useReducer
      └─ 可复用逻辑 → 自定义 Hook
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
}));
```

**解决方案**: 仅将真正需要全局共享的状态放入 Zustand。

```tsx
// ✅ 正确
const useGlobalStore = create((set) => ({
  theme: 'light',
  language: 'en',
}));

function Modal() {
  const [isOpen, setIsOpen] = useState(false); // 本地状态
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
});
```

**解决方案**: React Query 只用于服务器状态,UI 状态使用 Zustand 或 useState。

### 3. 忘记使用选择器导致性能问题

**问题**: 订阅整个 Zustand store 导致不必要的重渲染。

```tsx
// ❌ 错误
function Component() {
  const store = useStore(); // 任何状态变化都重新渲染
  return <div>{store.specificValue}</div>;
}
```

**解决方案**: 使用选择器只订阅需要的状态。

```tsx
// ✅ 正确
function Component() {
  const specificValue = useStore(state => state.specificValue);
  return <div>{specificValue}</div>;
}
```

### 4. 不正确的查询键导致缓存问题

**问题**: 查询键不包含所有相关参数,导致缓存混乱。

```tsx
// ❌ 错误
useQuery({
  queryKey: ['users'], // 没有包含 filters
  queryFn: () => fetchUsers(filters),
});
```

**解决方案**: 查询键必须包含所有影响查询结果的参数。

```tsx
// ✅ 正确
useQuery({
  queryKey: ['users', filters],
  queryFn: () => fetchUsers(filters),
});
```

## 总结

现代 React 应用的状态管理应该遵循"分而治之"的原则:

1. **React Query 管理服务器状态** - 占据大部分状态,提供缓存、同步、失效等开箱即用的功能
2. **Zustand 管理全局客户端状态** - 轻量、简单,适合跨应用的全局状态和用户偏好
3. **Context API 管理局部共享状态** - 在特定组件树中共享状态,避免 prop drilling,适合依赖注入
4. **useState 管理本地状态** - 组件内部的临时状态和交互状态

### 快速选择指南

| 状态类型 | 推荐工具 | 典型场景 |
|---------|---------|---------|
| 服务器数据 | React Query | 用户列表、文章详情、API 数据 |
| 全局客户端状态 | Zustand | 用户认证、全局通知、导航历史 |
| 局部共享状态 | Context | 表单向导、依赖注入、特定页面状态 |
| 组件本地状态 | useState | 表单输入、模态框状态、临时数据 |

选择合适的工具管理对应的状态类型,可以显著简化代码、提升性能,并改善开发体验。记住:不要过度设计,从简单开始,按需增加复杂度。

## 参考资源

- [TanStack Query 文档](https://tanstack.com/query/latest)
- [Zustand 文档](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [React 官方文档 - 状态管理](https://react.dev/learn/managing-state)
