import type { Command } from './CommandDialog'

// 示例指令定义
export const demoCommands: Command[] = [
  {
    name: 'time',
    description: '显示当前时间',
    handler: async () => {
      const now = new Date()
      return `当前时间: ${now.toLocaleString('zh-CN')}`
    }
  },
  {
    name: 'greet',
    description: '问候用户',
    handler: async (args: string[]) => {
      const name = args[0] || '朋友'
      return `你好，${name}！欢迎使用指令系统！`
    }
  },
  {
    name: 'calc',
    description: '简单计算器',
    handler: async (args: string[]) => {
      if (args.length < 3) {
        throw new Error('用法: @calc 数字 运算符 数字 (如: @calc 5 + 3)')
      }
      
      const [a, op, b] = args
      const num1 = parseFloat(a)
      const num2 = parseFloat(b)
      
      if (isNaN(num1) || isNaN(num2)) {
        throw new Error('请输入有效的数字')
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
          if (num2 === 0) throw new Error('除数不能为零')
          result = num1 / num2
          break
        default:
          throw new Error('支持的运算符: +, -, *, /')
      }
      
      return `${num1} ${op} ${num2} = ${result}`
    }
  },
  {
    name: 'weather',
    description: '模拟天气查询',
    handler: async (args: string[]) => {
      const city = args[0] || '北京'
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      const weathers = ['晴天', '多云', '小雨', '阴天']
      const randomWeather = weathers[Math.floor(Math.random() * weathers.length)]
      const temp = Math.floor(Math.random() * 20) + 10
      return `${city}今天天气: ${randomWeather}，温度: ${temp}°C`
    }
  },
  {
    name: 'help',
    description: '显示帮助信息',
    handler: async () => {
      return `可用指令说明:
• @time - 显示当前时间
• @greet [姓名] - 问候用户
• @calc 数字 运算符 数字 - 简单计算
• @weather [城市] - 查询天气
• @help - 显示此帮助信息`
    }
  }
]
