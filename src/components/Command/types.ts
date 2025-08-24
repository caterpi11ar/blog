export interface Command {
  /** 指令名称 */
  name: string
  /** 指令描述 */
  description: string

  /** 参数是否为必填 */
  required?: boolean

  /** 处理函数，返回执行结果 */
  handler: (args: string[]) => Promise<string>
}

// 悬浮球属性接口
export interface FloatingCommandProps {
  initialCommands?: Command[]
  className?: string
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

// 悬浮球引用接口
export interface FloatingCommandRef {
  registerCommand: (command: Command) => void
  unregisterCommand: (name: string) => void
  getAvailableCommands: () => string[]
  openDialog: () => void
  closeDialog: () => void
}
