# CommandDialog 自定义指令对话框组件

一个轻量级的React对话框组件，支持@格式自定义指令，专注于指令解析与执行。

## 🎯 主要组件

**FloatingCommand**: 全局悬浮球 + 下拉菜单选择指令，提供直观的指令选择界面

## 特性

- 🚀 轻量级设计，无额外依赖
- 🔧 动态注册/注销指令
- 💫 异步指令执行
- 🎨 基于Tailwind CSS的现代UI
- 📱 响应式设计
- 🆕 下拉菜单选择指令
- 🔍 智能搜索指令功能
- 📝 多行参数输入

## 安装

组件已包含在项目中，无需额外安装依赖。

## 基础用法

### CommandDialog 传统对话框

```tsx
import { Command, CommandDialog } from '@/components/Command'

// 定义指令
const commands: Command[] = [
  {
    name: 'time',
    description: '显示当前时间',
    handler: async () => {
      return new Date().toLocaleString()
    }
  }
]

// 使用组件
function App() {
  return (
    <CommandDialog
      initialCommands={commands}
      placeholder="输入@指令..."
    />
  )
}
```

### FloatingCommand 悬浮球组件

```tsx
import { Command, FloatingCommand } from '@/components/Command'

const commands: Command[] = [
  {
    name: 'time',
    description: '显示当前时间',
    handler: async () => new Date().toLocaleString()
  }
]

function App() {
  return (
    <FloatingCommand
      initialCommands={commands}
      position="bottom-right" // 可选: bottom-right, bottom-left, top-right, top-left
    />
  )
}
```

**功能特点：**
- 🎯 下拉菜单选择指令，无需记忆@符号
- 🔍 支持按名称和描述搜索指令
- 📝 多行参数输入，支持复杂格式
- 🎨 左右分栏布局，操作更直观
- ⌨️ 支持 Ctrl+Enter 快速执行

## API 文档

### CommandDialog Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `initialCommands` | `Command[]` | `[]` | 初始指令列表 |
| `placeholder` | `string` | `"输入@指令，如 @time"` | 输入框占位符 |
| `className` | `string` | `""` | 自定义CSS类名 |

### FloatingCommand Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `initialCommands` | `Command[]` | `[]` | 初始指令列表 |
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | 悬浮球位置 |
| `className` | `string` | `""` | 自定义CSS类名 |

### Command 接口

```tsx
interface Command {
  name: string // 指令名称（不含@）
  description: string // 指令描述
  handler: (args: string[]) => Promise<string> // 处理函数
}
```

### CommandDialogRef 方法

通过 `useRef` 可以访问以下方法：

```tsx
interface CommandDialogRef {
  registerCommand: (command: Command) => void // 注册新指令
  unregisterCommand: (name: string) => void // 注销指令
  getAvailableCommands: () => string[] // 获取所有可用指令名称
}
```

### FloatingCommandRef 方法

通过 `useRef` 可以访问以下方法：

```tsx
interface FloatingCommandRef {
  registerCommand: (command: Command) => void // 注册新指令
  unregisterCommand: (name: string) => void // 注销指令
  getAvailableCommands: () => string[] // 获取所有可用指令名称
  openDialog: () => void // 打开对话框
  closeDialog: () => void // 关闭对话框
}
```

## 高级用法

### 动态注册指令

```tsx
import { useRef } from 'react'
import { CommandDialog, CommandDialogRef } from '@/components/Command'

function App() {
  const commandRef = useRef<CommandDialogRef>(null)

  const addNewCommand = () => {
    commandRef.current?.registerCommand({
      name: 'greet',
      description: '问候用户',
      handler: async (args) => {
        const name = args[0] || '朋友'
        return `你好，${name}！`
      }
    })
  }

  return (
    <div>
      <button onClick={addNewCommand}>添加问候指令</button>
      <CommandDialog ref={commandRef} />
    </div>
  )
}
```

### 带参数的指令

```tsx
const calcCommand: Command = {
  name: 'calc',
  description: '简单计算器',
  handler: async (args) => {
    if (args.length < 3) {
      throw new Error('用法: @calc 数字 运算符 数字')
    }

    const [a, op, b] = args
    const num1 = Number.parseFloat(a)
    const num2 = Number.parseFloat(b)

    switch (op) {
      case '+': return `${num1 + num2}`
      case '-': return `${num1 - num2}`
      case '*': return `${num1 * num2}`
      case '/': return `${num1 / num2}`
      default: throw new Error('不支持的运算符')
    }
  }
}
```

## 指令格式

- 通过下拉菜单选择指令，无需记忆@符号
- 指令参数用空格分隔，支持多行输入
- 支持多个参数：`张三 你好`

## 错误处理

组件会自动处理以下错误情况：

- 未知指令
- 指令执行失败
- 输入格式错误

错误信息会显示在结果区域，使用红色样式突出显示。

## 样式定制

组件使用Tailwind CSS类名，可以通过以下方式定制样式：

```tsx
<FloatingCommand
  className="custom-class"
  position="bottom-right"
  // 其他属性...
/>
```

## 完整示例

### FloatingCommand 示例

查看 `demo-dropdown.astro` 页面获取完整的演示代码，包含：

- 全局悬浮球展示
- 左右分栏布局设计
- 多行参数输入功能
- 完整的指令系统演示
- 响应式布局和交互

## 注意事项

1. 所有指令处理函数都应该是异步的（返回Promise）
2. 指令名称不能包含空格
3. 组件会自动清空输入框在指令执行成功后
4. 支持键盘快捷键（Ctrl+Enter执行，ESC关闭）

## 开发说明

组件严格按照您的需求文档开发：

- ✅ 基础输入输出功能
- ✅ 指令解析与执行系统
- ✅ 样式美化与响应式调整
- ✅ 错误处理完善
- ✅ 无历史消息记录
- ✅ 专注于指令处理

组件代码简洁易读，遵循React最佳实践，使用TypeScript确保类型安全。
