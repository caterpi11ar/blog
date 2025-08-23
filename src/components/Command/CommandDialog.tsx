import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react'

// 指令定义接口
export interface Command {
  name: string // 指令名称（不含@）
  description: string // 指令描述
  handler: (args: string[]) => Promise<string> // 处理函数，返回执行结果
}

// 组件属性接口
export interface CommandDialogProps {
  initialCommands?: Command[] // 初始指令
  placeholder?: string // 输入框占位符
  className?: string // 自定义样式类
}

// 组件暴露的方法接口
export interface CommandDialogRef {
  registerCommand: (command: Command) => void
  unregisterCommand: (name: string) => void
  getAvailableCommands: () => string[] // 获取所有可用指令名称
}

const CommandDialog = forwardRef<CommandDialogRef, CommandDialogProps>(
  ({ initialCommands = [], placeholder = "输入@指令，如 @time", className = "" }, ref) => {
    // 状态管理
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    
    // 指令存储
    const commandsRef = useRef<Map<string, Command>>(new Map())
    
    // 初始化指令
    React.useEffect(() => {
      initialCommands.forEach(command => {
        commandsRef.current.set(command.name, command)
      })
    }, [initialCommands])
    
    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
      registerCommand: (command: Command) => {
        commandsRef.current.set(command.name, command)
      },
      unregisterCommand: (name: string) => {
        commandsRef.current.delete(name)
      },
      getAvailableCommands: () => {
        return Array.from(commandsRef.current.keys())
      }
    }))
    
    // 解析指令输入
    const parseCommand = (input: string): { command: string; args: string[] } | null => {
      const trimmed = input.trim()
      if (!trimmed.startsWith('@')) return null
      
      const parts = trimmed.slice(1).split(/\s+/)
      const command = parts[0]
      const args = parts.slice(1)
      
      return { command, args }
    }
    
    // 执行指令
    const executeCommand = async (commandName: string, args: string[]) => {
      const command = commandsRef.current.get(commandName)
      if (!command) {
        throw new Error(`未知指令: @${commandName}`)
      }
      
      try {
        const result = await command.handler(args)
        return result
      } catch (error) {
        throw new Error(`执行指令 @${commandName} 时出错: ${error instanceof Error ? error.message : '未知错误'}`)
      }
    }
    
    // 处理发送
    const handleSend = async () => {
      if (!inputValue.trim()) return
      
      const parsed = parseCommand(inputValue)
      if (!parsed) {
        setError('请输入以@开头的指令')
        setResult(null)
        return
      }
      
      setIsLoading(true)
      setError(null)
      setResult(null)
      
      try {
        const result = await executeCommand(parsed.command, parsed.args)
        setResult(result)
        setInputValue('') // 清空输入
      } catch (error) {
        setError(error instanceof Error ? error.message : '执行失败')
      } finally {
        setIsLoading(false)
      }
    }
    
    // 处理键盘事件
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    }
    
    return (
      <div className={`max-w-2xl mx-auto p-4 space-y-4 ${className}`}>
        {/* 输入区域 */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '执行中...' : '发送'}
          </button>
        </div>
        
        {/* 结果展示区域 */}
        <div className="min-h-[100px]">
          {/* 加载状态 */}
          {isLoading && (
            <div className="flex items-center justify-center p-4 text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="ml-2">正在执行指令...</span>
            </div>
          )}
          
          {/* 执行结果 */}
          {result && !isLoading && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-sm font-medium text-green-800 mb-2">执行结果:</h3>
              <div className="text-green-700 whitespace-pre-wrap">{result}</div>
            </div>
          )}
          
          {/* 错误信息 */}
          {error && !isLoading && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-sm font-medium text-red-800 mb-2">错误信息:</h3>
              <div className="text-red-700">{error}</div>
            </div>
          )}
        </div>
        
        {/* 可用指令提示 */}
        <div className="text-xs text-gray-500">
          可用指令: {Array.from(commandsRef.current.keys()).map(name => `@${name}`).join(', ')}
        </div>
      </div>
    )
  }
)

CommandDialog.displayName = 'CommandDialog'

export default CommandDialog
