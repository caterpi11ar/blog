import { useLayoutEffect, useState } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState<string | null>(null)

  // 我们使用 useLayoutEffect 而不是 useEffect，以确保在浏览器绘制前同步更新 state。
  // 这可以防止在主题快速切换时可能出现的视觉闪烁。
  useLayoutEffect(() => {
    // 确保在浏览器环境中执行
    if (typeof window === 'undefined') {
      return
    }

    // 1. 定义当监听到变化时要执行的回调函数
    const observerCallback = (mutationsList: MutationRecord[]) => {
      for (const mutation of mutationsList) {
        const { type, attributeName } = mutation
        // 我们只关心属性变化，并且是 'data-theme' 这个特定属性
        if (type !== 'attributes' || attributeName !== 'data-theme') {
          continue
        }

        const newTheme = document.documentElement.getAttribute('data-theme')
        setTheme(newTheme)
      }
    }

    // 2. 创建一个 MutationObserver 实例
    const observer = new MutationObserver(observerCallback)

    // 3. 配置观察选项：我们只需要观察 `<html>` 元素的属性变化
    const config = { attributes: true }

    // 4. 开始观察 document.documentElement (即 <html> 标签)
    observer.observe(document.documentElement, config)

    // 5. 返回一个清理函数，在组件卸载时停止观察，防止内存泄漏
    return () => {
      observer.disconnect()
    }
  }, [])

  return theme
}

export default useTheme
