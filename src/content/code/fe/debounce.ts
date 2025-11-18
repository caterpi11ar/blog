/**
 * 防抖函数的核心是：多次调用时，只在最后一次调用后等待 wait 时间执行。
 * flush 方法的作用是：跳过等待，立即执行最近一次调用的逻辑（需确保之前已经调用过防抖函数并传入了参数）。
 */

export interface DebounceOptions {
  /**
   * 用于取消防抖函数的可选 AbortSignal。
   */
  signal?: AbortSignal

  /**
   * 可选数组，指定函数应在前缘、后缘还是两者都调用。
   * 如果 `edges` 包含 "leading"，函数将在延迟周期开始时调用。
   * 如果 `edges` 包含 "trailing"，函数将在延迟周期结束时调用。
   * 如果同时包含 "leading" 和 "trailing"，函数将在延迟周期的开始和结束时都调用。
   * @default ["trailing"]
   */
  edges?: Array<'leading' | 'trailing'>
}

export interface DebouncedFunction<F extends (...args: any[]) => void> {
  (...args: Parameters<F>): void

  /**
   * 在指定的防抖延迟后安排防抖函数的执行。
   * 此方法重置任何现有的计时器，确保函数仅在自上次调用防抖函数以来经过延迟后才被调用。
   * 通常在调用防抖函数时内部调用此方法。
   *
   * @returns {void}
   */
  schedule: () => void

  /**
   * 取消防抖函数的任何待执行操作。
   * 此方法清除活动计时器并重置任何存储的上下文或参数。
   */
  cancel: () => void

  /**
   * 如果有待执行操作，立即调用防抖函数。
   * 此方法在有待执行操作时立即执行函数。
   */
  flush: () => void
}

/**
 * 创建一个防抖函数，延迟调用提供的函数，直到自上次调用防抖函数以来经过 `debounceMs` 毫秒。
 * 防抖函数还具有 `cancel` 方法来取消任何待执行操作。
 *
 * @template F - 函数的类型。
 * @param {F} func - 要进行防抖的函数。
 * @param {number} debounceMs - 延迟的毫秒数。
 * @param {DebounceOptions} options - 选项对象
 * @param {AbortSignal} options.signal - 用于取消防抖函数的可选 AbortSignal。
 * @returns 返回一个带有 `cancel` 方法的新防抖函数。
 *
 * @example
 * const debouncedFunction = debounce(() => {
 *   console.log('Function executed');
 * }, 1000);
 *
 * // 如果在此期间未再次调用，将在 1 秒后输出 'Function executed'
 * debouncedFunction();
 *
 * // 不会输出任何内容，因为前一个调用被取消了
 * debouncedFunction.cancel();
 *
 * // 使用 AbortSignal
 * const controller = new AbortController();
 * const signal = controller.signal;
 * const debouncedWithSignal = debounce(() => {
 *  console.log('Function executed');
 * }, 1000, { signal });
 *
 * debouncedWithSignal();
 *
 * // 将取消防抖函数调用
 * controller.abort();
 */
export function debounce<F extends (...args: any[]) => void>(
  func: F,
  debounceMs: number,
  { signal, edges }: DebounceOptions = {},
): DebouncedFunction<F> {
  // 存储待执行函数的 this 上下文
  let pendingThis: any
  // 存储待执行函数的参数
  let pendingArgs: Parameters<F> | null = null

  // 是否在前缘执行
  const leading = edges != null && edges.includes('leading')
  // 是否在后缘执行
  const trailing = edges == null || edges.includes('trailing')

  // 计时器 ID
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  /**
   * 取消计时器
   */
  const cancelTimer = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  /**
   * 取消防抖函数的待执行操作
   */
  const cancel = () => {
    cancelTimer()
    pendingThis = undefined
    pendingArgs = null
  }

  /**
   * 执行待执行的函数
   */
  const invoke = () => {
    if (pendingArgs !== null) {
      func.apply(pendingThis, pendingArgs)
      pendingThis = undefined
      pendingArgs = null
    }
  }

  /**
   * 计时器结束时的回调
   */
  const onTimerEnd = () => {
    if (trailing) {
      invoke()
    }

    cancel()
  }

  /**
   * 安排函数在延迟后执行
   */
  const schedule = () => {
    if (timeoutId != null) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      timeoutId = null

      onTimerEnd()
    }, debounceMs)
  }

  /**
   * 立即执行待执行的函数
   */
  const flush = () => {
    invoke()
  }

  /**
   * 防抖后的函数
   */
  const debounced = function (this: any, ...args: Parameters<F>) {
    if (signal?.aborted) {
      return
    }

    // 保存 this 上下文，禁用 ESLint 规则
    // eslint-disable-next-line ts/no-this-alias
    pendingThis = this
    pendingArgs = args

    // 判断是否为第一次调用
    const isFirstCall = timeoutId == null

    schedule()

    // 如果启用了前缘执行且是第一次调用，立即执行
    if (leading && isFirstCall) {
      invoke()
    }
  }

  // 将内部方法挂载到防抖函数上
  debounced.schedule = schedule
  debounced.cancel = cancel
  debounced.flush = flush

  // 监听 abort 信号，取消防抖函数
  signal?.addEventListener('abort', cancel, { once: true })

  return debounced
}

/**
 * 简易版 debounce 实现
 */

function simpleDebounce(func: Function, wait = 100) {
  let timer: ReturnType<typeof setTimeout> | null = null
  let pendingArgs: any[] | null = null // 用于存储最新的参数
  let pendingThis: any = null // 用于存储最新的this

  const debounced = function (this: any, ...args: any[]) {
    // 每次调用时更新最新的this和参数
    // eslint-disable-next-line ts/no-this-alias
    pendingThis = this
    pendingArgs = args

    if (timer !== null) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      func.apply(pendingThis, pendingArgs)
      timer = null
      pendingArgs = null
      pendingThis = null
    }, wait)
  }

  debounced.flush = function () {
    if (pendingArgs !== null) {
      func.apply(pendingThis, pendingArgs)
      pendingThis = undefined
      pendingArgs = null
    }
  }

  return debounced
}

// 1. 创建防抖函数（对 console.log 进行防抖处理，延迟 10000ms）
const debouncedLog = simpleDebounce(console.log, 10000)

// 2. 调用防抖函数（传入参数 'test2'）
debouncedLog('test2') // 此时不会立即执行，会进入防抖延迟

// 3. 如需立即执行（不等待延迟），调用 flush 方法
debouncedLog.flush() // 立即执行 console.log('test2')
