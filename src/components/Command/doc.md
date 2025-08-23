# 简化版自定义指令对话框组件开发文档

## 1. 项目概述

开发一个轻量级对话框组件，基于React、TypeScript和Tailwind CSS，支持@格式自定义指令，无历史消息记录功能，专注于指令解析与执行。

## 2. 核心功能

### 2.1 基础输入输出
- 简洁的文本输入框
- 发送按钮与Enter键快捷发送
- 仅显示当前指令的执行结果

### 2.2 指令系统
- 识别以@开头的指令（如@time）
- 支持注册自定义指令及处理函数
- 解析指令参数并执行对应功能
- 显示指令执行结果或错误信息

## 3. 技术栈

- React 18+
- TypeScript 4.5+
- Tailwind CSS 3+
- React Hooks（基础状态管理）

## 4. 组件设计

### 4.1 组件结构

```
CommandDialog
├── InputArea          # 输入区域
│   ├── TextInput      # 文本输入框
│   └── SendButton     # 发送按钮
└── ResultDisplay      # 结果展示区域
    ├── LoadingState   # 加载状态
    ├── ResultContent  # 执行结果
    └── ErrorMessage   # 错误提示
```

### 4.2 核心数据结构

```typescript
// 指令定义
interface Command {
  name: string // 指令名称（不含@）
  description: string // 指令描述
  handler: (args: string[]) => Promise<string> // 处理函数，返回执行结果
}

// 组件属性
interface CommandDialogProps {
  initialCommands?: Command[] // 初始指令
  placeholder?: string // 输入框占位符
  className?: string // 自定义样式类
}
```

### 4.3 核心功能实现

#### 4.3.1 指令处理
- 注册指令：存储指令名称与对应处理函数的映射
- 解析输入：检测是否包含@指令，提取指令名和参数
- 执行流程：找到匹配指令→执行处理函数→显示结果

#### 4.3.2 状态管理
- 输入内容状态
- 加载状态（指令执行中）
- 结果/错误信息状态

## 5. API设计

```typescript
// 组件定义
const CommandDialog: React.FC<CommandDialogProps> = (props) => {
  // 组件实现
}

// 组件暴露的方法（通过ref访问）
interface CommandDialogRef {
  registerCommand: (command: Command) => void
  unregisterCommand: (name: string) => void
  getAvailableCommands: () => string[] // 获取所有可用指令名称
}
```

## 6. 交互流程

1. 用户在输入框输入内容（如"@greet Alice"）
2. 点击发送按钮或按Enter键
3. 组件解析输入，识别指令名"greet"和参数["Alice"]
4. 显示加载状态
5. 执行对应处理函数
6. 处理完成后，在结果区域显示执行结果

## 7. 样式规范

- 简洁紧凑的布局
- 输入区与结果区分明
- 加载状态使用简单动画
- 错误信息使用醒目的颜色
- 响应式设计，适配不同屏幕

## 8. 开发优先级

1. 基础输入输出功能
2. 指令解析与执行系统
3. 样式美化与响应式调整
4. 错误处理完善

这个简化版本保留了核心的指令处理功能，去掉了历史消息记录，使实现更加简单直接，适合快速开发和集成。
