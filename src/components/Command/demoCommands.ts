import type { Command } from './CommandDialog'

// 示例指令定义
export const demoCommands: Command[] = [
  {
    name: 'time',
    description: '显示当前时间',
    handler: async () => {
      const now = new Date()
      return `当前时间: ${now.toLocaleString('zh-CN')}`
    },
  },
  {
    name: 'greet',
    description: '问候用户',
    handler: async (args: string[]) => {
      const name = args[0] || '朋友'
      return `你好，${name}！欢迎使用指令系统！`
    },
  },
  {
    name: 'calc',
    description: '简单计算器',
    required: true, // 计算器需要参数才能工作
    handler: async (args: string[]) => {
      if (args.length < 3) {
        throw new Error('用法: @calc 数字 运算符 数字 (如: @calc 5 + 3)')
      }

      const [a, op, b] = args
      const num1 = Number.parseFloat(a)
      const num2 = Number.parseFloat(b)

      if (Number.isNaN(num1) || Number.isNaN(num2)) {
        throw new TypeError('请输入有效的数字')
      }

      let result: number
      switch (op) {
        case '+':
          result = num1 + num2
          break
        case '-':
          result = num1 - num2
          break
        case '*':
          result = num1 * num2
          break
        case '/':
          if (num2 === 0)
            throw new Error('除数不能为零')
          result = num1 / num2
          break
        default:
          throw new Error('支持的运算符: +, -, *, /')
      }

      return `${num1} ${op} ${num2} = ${result}`
    },
  },
  {
    name: 'weather',
    description: '模拟天气查询',
    required: true, // 天气查询需要城市参数
    handler: async (args: string[]) => {
      const city = args[0] || '北京'
      const detailed = args[1] === 'true' || args[1] === '1' || args[1] === 'yes'

      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      const weathers = ['晴天', '多云', '小雨', '阴天']
      const randomWeather = weathers[Math.floor(Math.random() * weathers.length)]
      const temp = Math.floor(Math.random() * 20) + 10
      const humidity = Math.floor(Math.random() * 40) + 40

      let result = `${city}今天天气: ${randomWeather}，温度: ${temp}°C`

      if (detailed) {
        result += `，湿度: ${humidity}%，风速: ${Math.floor(Math.random() * 20) + 5}km/h`
      }

      return result
    },
  },
  {
    name: 'search',
    description: '搜索功能',
    required: true, // 搜索需要关键词
    handler: async (args: string[]) => {
      const keyword = args[0]
      const type = args[1] || 'web'
      const count = Number.parseInt(args[2]) || 10

      return `搜索 "${keyword}" (类型: ${type}, 数量: ${count}) 的结果...\n这是一个模拟的搜索功能，实际使用时需要集成真实的搜索API。`
    },
  },
  {
    name: 'help',
    description: '显示帮助信息',
    handler: async () => {
      return `可用指令说明:
• @time - 显示当前时间
• @greet [姓名] - 问候用户 (姓名可选)
• @calc 数字 运算符 数字 - 简单计算
• @weather [城市] [详细] - 查询天气
• @search [关键词] [类型] [数量] - 搜索功能
• @help - 显示此帮助信息

注意：所有参数都是可选的，指令会根据参数自动处理。`
    },
  },
]
