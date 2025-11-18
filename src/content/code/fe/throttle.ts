function throttle(fn: Function, wait: number) {
  let lastTime = 0 // 记录上次执行时间

  return function (this: any, ...args: any[]) {
    const now = Date.now()
    // 如果距离上次执行超过等待时间，立即执行
    if (now - lastTime >= wait) {
      fn.apply(this, args)
      lastTime = now // 更新执行时间
    }
  }
}

// 1. 创建节流函数（对 console.log 进行节流处理，延迟 10000ms）
const throttledLog = throttle(console.log, 10000)

// 2. 调用节流函数（传入参数 'test2'）
throttledLog('test2') // 立即执行 console.log('test2'), 如果10000ms内再次调用，不会立即执行，会等待10000ms后再次执行
