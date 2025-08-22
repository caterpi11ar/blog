'use client'

import type { FC } from 'react'
import useTheme from 'hooks/useTheme'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// 外部脚本属性类型
type ScriptAttributes = Record<string, string>

interface GiscusProps {
  /** GitHub 仓库名，格式 owner/repo */
  repo: string
  /** 仓库 ID */
  repoId: string
  /** Discussion 分类 ID */
  categoryId: string
  /** 映射方式 */
  mapping?: 'pathname' | 'url' | 'title' | 'og:title'
  /** 严格模式 */
  strict?: '0' | '1'
  /** 是否启用表情回应 */
  reactionsEnabled?: '0' | '1'
  /** 是否启用元数据 */
  emitMetadata?: '0' | '1'
  /** 输入框位置 */
  inputPosition?: 'top' | 'bottom'
  /** 语言 */
  lang?: string
  /** 加载方式 */
  loading?: 'lazy' | 'eager'
}

const giscusUrl = 'https://giscus.app/client.js'

const Giscus: FC<GiscusProps> = (props) => {
  const {
    repo,
    repoId,
    categoryId,
    mapping = 'pathname',
    strict = '0',
    reactionsEnabled = '1',
    emitMetadata = '0',
    inputPosition = 'bottom',

    lang = 'zh-CN',
    loading = 'lazy',
  } = props
  const containerRef = useRef<HTMLDivElement>(null)

  /** 从 html 标签 的 data-theme 属性中获取主题 */
  const theme = useTheme()

  const giscusAttributes = useMemo<ScriptAttributes>(() => ({
    'data-repo': repo,
    'data-repo-id': repoId,
    'data-category-id': categoryId,
    'data-mapping': mapping,
    'data-strict': strict,
    'data-reactions-enabled': reactionsEnabled,
    'data-emit-metadata': emitMetadata,
    'data-input-position': inputPosition,
    'data-theme': theme ?? 'light',
    'data-lang': lang,
    'data-loading': loading,
    'async': 'true',
    'src': giscusUrl,
  }), [
    repo,
    repoId,
    categoryId,
    mapping,
    strict,
    reactionsEnabled,
    emitMetadata,
    inputPosition,
    theme,
    lang,
    loading,
  ])

  // 创建和配置 script 元素
  const createScriptElement = useCallback((attributes: ScriptAttributes) => {
    const script = document.createElement('script')

    Object.entries(attributes).forEach(([key, value]) => {
      script.setAttribute(key, value)
    })

    return script
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container)
      return

    const script = createScriptElement(giscusAttributes)
    container.appendChild(script)

    return () => {
      container.innerHTML = ''
    }
  }, [giscusAttributes])

  return (
    <div className="mt-8">
      <h3 className="mb-4 text-xl font-semibold text-skin-accent">评论</h3>
      {theme && <div ref={containerRef} />}
    </div>
  )
}

export default Giscus
