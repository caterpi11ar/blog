import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react'
import type { Command, CommandDialogRef } from './CommandDialog'

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

const FloatingCommand = forwardRef<FloatingCommandRef, FloatingCommandProps>(
  ({ 
    initialCommands = [], 
    className = "",
    position = 'bottom-right'
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedCommand, setSelectedCommand] = useState<Command | null>(null)
    const [commandArgs, setCommandArgs] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [showCommandMenu, setShowCommandMenu] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    
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
      },
      openDialog: () => setIsOpen(true),
      closeDialog: () => setIsOpen(false)
    }))
    
    // 执行指令
    const executeCommand = async (command: Command, args: string[]) => {
      try {
        const result = await command.handler(args)
        return result
      } catch (error) {
        throw new Error(`执行指令 ${command.name} 时出错: ${error instanceof Error ? error.message : '未知错误'}`)
      }
    }
    
    // 处理发送
    const handleSend = async () => {
      if (!selectedCommand) return
      
      setIsLoading(true)
      setError(null)
      setResult(null)
      
      try {
        const args = commandArgs.trim() ? commandArgs.trim().split(/\s+/) : []
        const result = await executeCommand(selectedCommand, args)
        setResult(result)
        setCommandArgs('') // 清空输入
      } catch (error) {
        setError(error instanceof Error ? error.message : '执行失败')
      } finally {
        setIsLoading(false)
      }
    }
    
    // 处理键盘事件
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        handleSend()
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
        setShowCommandMenu(false)
      }
    }
    
    // 选择指令
    const handleCommandSelect = (command: Command) => {
      setSelectedCommand(command)
      setShowCommandMenu(false)
      setSearchTerm('')
    }
    
    // 过滤指令
    const filteredCommands = Array.from(commandsRef.current.values()).filter(command =>
      command.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      command.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    // 位置样式映射
    const positionStyles = {
      'bottom-right': 'bottom-6 right-6',
      'bottom-left': 'bottom-6 left-6',
      'top-right': 'top-6 right-6',
      'top-left': 'top-6 left-6'
    }
    
    return (
      <>
        {/* 悬浮球 */}
        <div 
          className={`fixed ${positionStyles[position]} z-50 ${className}`}
          onClick={() => setIsOpen(true)}
        >
          <div className="w-12 h-12 bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
            <div className="w-full h-full flex items-center justify-center">
              <svg 
                className="w-5 h-5 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                />
              </svg>
            </div>
          </div>
        </div>
        
        {/* 对话框 */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/10">
            <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              {/* 对话框头部 */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-900">指令助手</h3>
                    <p className="text-sm text-gray-500">选择指令并执行操作</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* 对话框内容 - 重新设计为左右布局 */}
              <div className="flex min-h-[500px]">
                {/* 左侧：指令选择区域 */}
                <div className="w-1/2 border-r border-gray-200 p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">选择指令</label>
                      
                      {/* 指令选择按钮 */}
                      <div className="relative">
                        <button
                          onClick={() => setShowCommandMenu(!showCommandMenu)}
                          className="w-full px-3 py-2 text-left border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white"
                        >
                          {selectedCommand ? (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-900">{selectedCommand.name}</span>
                              <span className="text-sm text-gray-500">{selectedCommand.description}</span>
                            </div>
                          ) : (
                            <span className="text-gray-500">点击选择指令...</span>
                          )}
                          <svg className="w-4 h-4 text-gray-400 ml-2 float-right" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {/* 指令下拉菜单 - 扩大显示区域 */}
                        {showCommandMenu && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-auto">
                            {/* 搜索框 */}
                            <div className="p-3 border-b border-gray-200 sticky top-0 bg-white">
                              <input
                                type="text"
                                placeholder="搜索指令..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                                autoFocus
                              />
                            </div>
                            
                            {/* 指令列表 - 显示更多内容 */}
                            <div className="py-1">
                              {filteredCommands.length > 0 ? (
                                filteredCommands.map((command) => (
                                  <button
                                    key={command.name}
                                    onClick={() => handleCommandSelect(command)}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="font-medium text-gray-900 text-base">{command.name}</div>
                                        <div className="text-sm text-gray-500 mt-1">{command.description}</div>
                                      </div>
                                      <svg className="w-4 h-4 text-gray-400 ml-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </div>
                                  </button>
                                ))
                              ) : (
                                <div className="px-4 py-3 text-sm text-gray-500">没有找到匹配的指令</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* 参数输入区域 - 改为多行文本 */}
                    {selectedCommand && (
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          指令参数 (可选)
                        </label>
                        <textarea
                          value={commandArgs}
                          onChange={(e) => setCommandArgs(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={`输入 ${selectedCommand.name} 的参数，支持多行输入\n用空格分隔多个参数\n按 Ctrl+Enter 执行`}
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 resize-none"
                          disabled={isLoading}
                        />
                        <div className="text-xs text-gray-500">
                          提示：支持多行输入，按 Ctrl+Enter (Mac: Cmd+Enter) 快速执行
                        </div>
                      </div>
                    )}
                    
                    {/* 发送按钮 */}
                    {selectedCommand && (
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={handleSend}
                          disabled={isLoading}
                          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
                        >
                          {isLoading ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>执行中</span>
                            </div>
                          ) : (
                            `执行 ${selectedCommand.name}`
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 右侧：结果展示区域 */}
                <div className="w-1/2 p-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-700">执行结果</h4>
                    
                    {/* 加载状态 */}
                    {isLoading && (
                      <div className="flex items-center justify-center p-4 text-gray-500">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          <span>正在执行指令...</span>
                        </div>
                      </div>
                    )}
                    
                    {/* 执行结果 */}
                    {result && !isLoading && (
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                        <div className="flex items-start space-x-2">
                          <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-800 mb-1">执行成功</h4>
                            <div className="text-gray-700 whitespace-pre-wrap text-sm bg-white p-3 rounded border border-gray-200 max-h-64 overflow-auto">
                              {result}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* 错误信息 */}
                    {error && !isLoading && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded">
                        <div className="flex items-start space-x-2">
                          <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-red-800 mb-1">执行失败</h4>
                            <div className="text-red-700 text-sm bg-white p-3 rounded border border-red-200">
                              {error}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* 默认状态 */}
                    {!isLoading && !result && !error && (
                      <div className="flex items-center justify-center p-8 text-gray-400">
                        <div className="text-center">
                          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <p className="text-sm">选择指令并执行后，结果将显示在这里</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* 底部状态栏 */}
              <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>可用指令: {Array.from(commandsRef.current.keys()).length} 个</span>
                  <div className="flex items-center space-x-4">
                    <span>Ctrl+Enter 执行</span>
                    <span>ESC 关闭</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }
)

FloatingCommand.displayName = 'FloatingCommand'

export default FloatingCommand
