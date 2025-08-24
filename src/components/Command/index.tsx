import type { KeyboardEvent } from 'react'
import type { Command, FloatingCommandProps, FloatingCommandRef } from './types'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { demoCommands } from './demoCommands'

// 位置样式映射 - 移动端适配
const positionStyles = {
  'bottom-right': 'bottom-4 right-4 sm:bottom-6 sm:right-6',
  'bottom-left': 'bottom-4 left-4 sm:bottom-6 sm:left-6',
  'top-right': 'top-4 right-4 sm:top-6 sm:right-6',
  'top-left': 'top-4 left-4 sm:top-6 sm:left-6',
}

const FloatingCommand = forwardRef<FloatingCommandRef, FloatingCommandProps>(
  ({
    initialCommands = demoCommands,
    className = '',
    position = 'bottom-right',
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedCommand, setSelectedCommand] = useState<Command | null>(null)
    const [commandArgs, setCommandArgs] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [showCommandMenu, setShowCommandMenu] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [isParameterValid, setIsParameterValid] = useState(true) // 参数验证状态

    // 指令存储
    const commandsRef = useRef<Map<string, Command>>(new Map())

    // 初始化指令
    useEffect(() => {
      console.log('初始化指令', initialCommands)
      initialCommands.forEach((command) => {
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
      closeDialog: () => setIsOpen(false),
    }))

    // 执行指令
    const executeCommand = async (command: Command, args: string[]) => {
      try {
        const result = await command.handler(args)
        return result
      }
      catch (error) {
        throw new Error(`执行指令 ${command.name} 时出错: ${error instanceof Error ? error.message : '未知错误'}`)
      }
    }

    // 验证指令参数
    const validateParameters = (command: Command, args: string[]): boolean => {
      // 如果指令设置为必填，检查是否有输入内容
      if (command.required && (!args || args.length === 0 || args.every(arg => !arg.trim()))) {
        setIsParameterValid(false)
        return false
      }

      setIsParameterValid(true)
      return true
    }

    // 处理发送
    const handleSend = async () => {
      if (!selectedCommand)
        return

      // 获取用户输入的参数
      const args = commandArgs.trim() ? commandArgs.trim().split(/\s+/) : []

      // 验证必填参数
      if (!validateParameters(selectedCommand, args)) {
        // 参数验证失败时不显示在结果区域，只通过UI状态提示
        return
      }

      setIsLoading(true)
      setError(null)
      setResult(null)

      try {
        console.log('执行指令', selectedCommand, args)
        const result = await executeCommand(selectedCommand, args)
        setResult(result)
        setCommandArgs('') // 清空输入
      }
      catch (error) {
        setError(error instanceof Error ? error.message : '执行失败')
      }
      finally {
        setIsLoading(false)
      }
    }

    // 处理键盘事件
    const handleKeyDown = (e: KeyboardEvent) => {
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
      setSearchTerm('') // 清空搜索框，方便下次搜索
      setCommandArgs('') // 清空之前的参数输入
      setIsParameterValid(true) // 重置参数验证状态
      setError(null) // 清空之前的错误
      setResult(null) // 清空之前的结果
    }

    // 过滤指令
    const filteredCommands = Array.from(commandsRef.current.values()).filter(command =>
      command.name.toLowerCase().includes(searchTerm.toLowerCase())
      || command.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
      <>
        {/* 悬浮球 - 移动端适配 */}
        <div
          className={`fixed ${positionStyles[position]} z-50 ${className}`}
          onClick={() => setIsOpen(true)}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#fffefb] border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
            <div className="w-full h-full flex items-center justify-center">
              <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7552" className="w-4 h-4 sm:w-5 sm:h-5">
                <path d="M512 64c259.2 0 469.333333 200.576 469.333333 448s-210.133333 448-469.333333 448a484.48 484.48 0 0 1-232.725333-58.88l-116.394667 50.645333a42.666667 42.666667 0 0 1-58.517333-49.002666l29.76-125.013334C76.629333 703.402667 42.666667 611.477333 42.666667 512 42.666667 264.576 252.8 64 512 64z m0 64C287.488 128 106.666667 300.586667 106.666667 512c0 79.573333 25.557333 155.434667 72.554666 219.285333l5.525334 7.317334 18.709333 24.192-26.965333 113.237333 105.984-46.08 27.477333 15.018667C370.858667 878.229333 439.978667 896 512 896c224.512 0 405.333333-172.586667 405.333333-384S736.512 128 512 128z m-157.696 341.333333a42.666667 42.666667 0 1 1 0 85.333334 42.666667 42.666667 0 0 1 0-85.333334z m159.018667 0a42.666667 42.666667 0 1 1 0 85.333334 42.666667 42.666667 0 0 0-85.333334z m158.997333 0a42.666667 42.666667 0 1 1 0 85.333334 42.666667 42.666667 0 0 1 0-85.333334z" fill="#333333" p-id="7553"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* 对话框 - 移动端适配 */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-2 sm:p-4">
            <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden max-h-[90vh] sm:max-h-none">
              {/* 对话框头部 - 移动端适配 */}
              <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 relative">
                <div className="flex items-center">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">指令助手</h3>
                    <p className="text-xs sm:text-sm text-gray-500">选择指令并执行操作</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-gray-100 w-8 h-8 rounded transition-colors duration-200 absolute top-2 right-2"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 对话框内容 - 移动端响应式布局 */}
              <div className="flex flex-col sm:flex-row min-h-[400px] sm:min-h-[500px]">
                {/* 左侧：指令选择区域 - 移动端适配 */}
                <div className="w-full sm:w-1/2 border-b sm:border-b-0 sm:border-r border-gray-200 p-3 sm:p-4">
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">选择指令</label>

                      {/* 整合的搜索和选择区域 */}
                      <div className="relative command-search-container">
                        <input
                          type="text"
                          placeholder="搜索或选择指令..."
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          onFocus={() => setShowCommandMenu(true)}
                          className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white"
                          autoComplete="off"
                        />

                        {/* 指令下拉菜单 - 移动端适配 */}
                        {showCommandMenu && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 sm:max-h-80 overflow-auto">
                            {/* 指令列表 */}
                            <div className="py-1">
                              {filteredCommands.length > 0 ? (
                                filteredCommands.map(command => (
                                  <button
                                    key={command.name}
                                    onClick={() => handleCommandSelect(command)}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="font-medium text-gray-900 text-sm sm:text-base">{command.name}</div>
                                        <div className="text-xs sm:text-sm text-gray-500 mt-1">{command.description}</div>
                                      </div>
                                      <svg className="w-4 h-4 text-gray-400 ml-2 sm:ml-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </div>
                                  </button>
                                ))
                              ) : searchTerm ? (
                                <div className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-500">没有找到匹配的指令</div>
                              ) : (
                                <div className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-500">请输入关键词搜索指令</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 已选择的指令展示区域 */}
                    {selectedCommand && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 relative">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-base sm:text-lg font-semibold text-blue-800 mb-1">
                              @
                              {selectedCommand.name}
                            </div>
                            <div className="text-xs sm:text-sm text-blue-700">
                              {selectedCommand.description}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedCommand(null)
                              setCommandArgs('')
                              setIsParameterValid(true)
                              setError(null)
                              setResult(null)
                            }}
                            className="hover:bg-blue-100 w-6 h-6 rounded transition-colors duration-200 text-blue-500 absolute top-2 right-2"
                            title="重新选择指令"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 参数输入区域 - 移动端适配 */}
                    {selectedCommand && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-medium text-gray-700">
                            指令参数
                            {selectedCommand.required && (
                              <span className="ml-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">
                                必填
                              </span>
                            )}
                          </label>
                        </div>

                        <textarea
                          value={commandArgs}
                          onChange={(e) => {
                            setCommandArgs(e.target.value)
                            // 实时验证：当用户输入内容时，清除错误状态
                            if (e.target.value.trim() && !isParameterValid) {
                              setIsParameterValid(true)
                              setError(null)
                            }
                          }}
                          onKeyDown={handleKeyDown}
                          placeholder={
                            selectedCommand.required
                              ? `输入 ${selectedCommand.name} 的参数 (必填)\n用空格分隔多个参数\n按 Ctrl+Enter 执行`
                              : `输入 ${selectedCommand.name} 的参数，支持多行输入\n用空格分隔多个参数\n按 Ctrl+Enter 执行`
                          }
                          rows={4}
                          className={`w-full px-3 py-2 text-sm sm:text-base border rounded focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none ${selectedCommand.required && !isParameterValid
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-400'
                            : 'border-gray-300 focus:border-gray-400'
                          }`}
                          disabled={isLoading}
                        />

                        {/* 必填参数提示 */}
                        {selectedCommand.required && !isParameterValid && (
                          <div className="text-xs sm:text-sm text-red-600 bg-red-50 px-3 py-2 rounded border border-red-200">
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              <span>此指令需要必填参数，请填写相关内容</span>
                            </div>
                          </div>
                        )}

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
                          className="px-3 sm:px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
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

                {/* 右侧：结果展示区域 - 移动端适配 */}
                <div className="w-full sm:w-1/2 p-3 sm:p-4">
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="text-sm font-medium text-gray-700">执行结果</h4>

                    {/* 加载状态 */}
                    {isLoading && (
                      <div className="flex items-center justify-center p-4 text-gray-500">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm">正在执行指令...</span>
                        </div>
                      </div>
                    )}

                    {/* 执行结果 */}
                    {result && !isLoading && (
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                        <div className="flex items-start">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-800 mb-1">执行成功</h4>
                            <div className="text-gray-700 whitespace-pre-wrap text-xs sm:text-sm bg-white p-3 rounded border border-gray-200 max-h-48 sm:max-h-64 overflow-auto">
                              {result}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 执行错误信息 - 只有在指令执行失败时才显示 */}
                    {error && !isLoading && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded">
                        <div className="flex items-start">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-red-800 mb-1">执行失败</h4>
                            <div className="text-red-700 text-xs sm:text-sm bg-white p-3 rounded border border-red-200">
                              {error}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 默认状态 */}
                    {!isLoading && !result && !error && (
                      <div className="flex items-center justify-center p-6 sm:p-8 text-gray-400">
                        <div className="text-center">
                          <svg className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <p className="text-xs sm:text-sm">选择指令并执行后，结果将显示在这里</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 底部状态栏 - 移动端适配 */}
              <div className="px-4 sm:px-6 py-2 sm:py-3 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 space-y-1 sm:space-y-0">
                  <span>
                    可用指令:
                    {Array.from(commandsRef.current.keys()).length}
                    {' '}
                    个
                  </span>
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
  },
)

FloatingCommand.displayName = 'FloatingCommand'

export default FloatingCommand
