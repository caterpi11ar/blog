# mmc-blog

一个基于 [Astro](https://astro.build) 构建的现代、响应式、SEO友好的博客。这个博客具有简洁的设计、深色/浅色模式支持以及出色的性能表现。

## ✨ 特性

- 🚀 **快速且现代**: 基于 Astro 构建，性能优异
- 📱 **响应式设计**: 在所有设备上完美运行
- 🌙 **深色/浅色模式**: 支持主题切换
- 🔍 **SEO 优化**: 内置 SEO 功能和站点地图生成
- 📝 **MDX 支持**: 使用 Markdown 和 React 组件编写内容
- 🧮 **数学公式支持**: 使用 MathJax 渲染 LaTeX 数学公式
- 📊 **目录导航**: 文章自动生成目录
- 🔎 **搜索功能**: 基于 Fuse.js 的客户端搜索
- 📱 **社交媒体**: Open Graph 图片和社交分享
- 🏷️ **标签系统**: 使用标签组织文章
- 📡 **RSS 订阅**: 博客更新订阅
- 🎨 **Tailwind CSS**: 使用工具类进行现代样式设计
- ⚡ **性能优化**: 使用 Jampack 进行生产环境优化

## 🛠️ 技术栈

- **框架**: [Astro](https://astro.build) 3.6.4
- **样式**: [Tailwind CSS](https://tailwindcss.com) 3.3.3
- **UI 组件**: [React](https://reactjs.org) 18.2.0
- **内容**: MDX 和 Markdown
- **数学渲染**: MathJax
- **搜索**: [Fuse.js](https://fusejs.io) 6.6.2
- **构建优化**: [Jampack](https://jampack.divriots.com)
- **TypeScript**: 完整的 TypeScript 支持

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- pnpm (推荐) 或 npm

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/yourusername/mmc-blog.git
   cd mmc-blog
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **启动开发服务器**
   ```bash
   pnpm dev
   ```

4. **打开浏览器**
   访问 `http://localhost:4321`

## 📝 使用说明

### 开发

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview

# 同步 Astro 配置
pnpm sync
```

### 添加内容

1. **博客文章**: 在 `src/content/blog/` 目录下添加 `.md` 或 `.mdx` 文件
2. **页面**: 在 `src/pages/` 目录下添加 `.astro` 文件
3. **组件**: 在 `src/components/` 目录下添加可复用组件

### 配置

更新 `src/config.ts` 来自定义：
- 站点元数据（标题、描述、URL）
- 社交媒体链接
- 博客设置（每页文章数量等）
- 主题偏好

## 🏗️ 项目结构

```
mmc-blog/
├── public/                 # 静态资源
├── src/
│   ├── components/         # 可复用组件
│   ├── content/
│   │   └── blog/          # 博客文章 (MDX/MD)
│   ├── layouts/           # 页面布局
│   ├── pages/             # Astro 页面
│   ├── styles/            # 全局样式
│   └── utils/             # 工具函数
├── astro.config.ts        # Astro 配置
├── tailwind.config.cjs    # Tailwind 配置
└── package.json
```

## 🎨 自定义

### 样式
- 修改 `src/styles/base.css` 来调整全局样式
- 更新 `tailwind.config.cjs` 来自定义 Tailwind
- 在各自的文件中编辑组件样式

### 主题
- 在 `src/config.ts` 中切换深色/浅色模式
- 在 Tailwind 配置中自定义颜色
- 在 `public/toggle-theme.js` 中修改主题切换行为

### 内容
- 在 `src/config.ts` 中更新站点元数据
- 在同一文件中添加社交链接
- 自定义博客文章的前置元数据

## 📦 部署

### 构建生产版本
```bash
pnpm build
```

构建过程包括：
- Astro 构建优化
- Jampack 压缩以获得更好的性能
- 静态站点生成

### 部署选项
- **Vercel**: 连接你的 GitHub 仓库
- **Netlify**: 拖拽 `dist` 文件夹
- **GitHub Pages**: 使用 GitHub Actions
- **任何静态托管**: 上传 `dist` 文件夹

## 🔧 配置文件

- `astro.config.ts`: Astro 框架配置
- `tailwind.config.cjs`: Tailwind CSS 配置
- `tsconfig.json`: TypeScript 配置
- `package.json`: 依赖和脚本

## 📚 可用脚本

- `pnpm dev`: 启动开发服务器
- `pnpm build`: 构建生产版本
- `pnpm preview`: 预览生产构建
- `pnpm sync`: 同步 Astro 配置
- `pnpm cz`: 使用 commitizen 进行约定式提交

## 🤝 贡献

1. Fork 这个仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m '添加很棒的特性'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 基于 [Astro](https://astro.build) 构建
- 使用 [Tailwind CSS](https://tailwindcss.com) 进行样式设计
- 图标和组件来自各种开源库
- 灵感来源于现代博客设计模式

---

⭐ 如果你觉得这个项目有帮助，请给它一个星标！