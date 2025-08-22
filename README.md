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
- 💬 **评论系统**: 基于 Giscus 的 GitHub Discussions 评论
- 🎨 **Tailwind CSS**: 使用工具类进行现代样式设计

## 🛠️ 技术栈

- **框架**: [Astro](https://astro.build) 3.6.4
- **样式**: [Tailwind CSS](https://tailwindcss.com) 3.3.3
- **UI 组件**: [React](https://reactjs.org) 18.2.0
- **内容**: MDX 和 Markdown
- **数学渲染**: MathJax
- **搜索**: [Fuse.js](https://fusejs.io) 6.6.2
- **评论系统**: [Giscus](https://giscus.app) - 基于 GitHub Discussions
- **TypeScript**: 完整的 TypeScript 支持

## ⚙️ 配置

### Giscus 评论系统设置

本博客使用 Giscus 作为评论系统，这是一个基于 GitHub Discussions 的现代化评论系统。

#### 1. 准备工作

1. **启用 GitHub Discussions**: 访问你的 GitHub 仓库，点击 "Settings" -> "Features" -> 启用 "Discussions"
2. **创建分类**: 在 Discussions 中创建一个分类用于存放评论

#### 2. 配置步骤

1. 复制 `.env.example` 为 `.env`:
   ```bash
   cp .env.example .env
   ```

2. 访问 [Giscus 官网](https://giscus.app) 配置你的仓库

3. 在 `.env` 文件中填入以下配置:
   ```env
   # 你的 GitHub 仓库名，格式为 owner/repo
   PUBLIC_GISCUS_REPO=your-username/your-repo

   # 从 Giscus 官网获取的仓库 ID
   PUBLIC_GISCUS_REPO_ID=your-repo-id

   # 从 Giscus 官网获取的分类 ID
   PUBLIC_GISCUS_CATEGORY_ID=your-category-id
   ```

#### 3. 自定义选项

你可以通过修改 `src/components/Giscus.tsx` 中的属性来定制评论系统：

- `theme`: 主题设置 (`light`, `dark`, `preferred_color_scheme`)
- `lang`: 语言设置 (`zh-CN`, `en`, `zh-TW` 等)
- `mapping`: 映射方式 (`pathname`, `url`, `title`, `og:title`)
- `inputPosition`: 输入框位置 (`top`, `bottom`)
- `reactionsEnabled`: 是否启用表情回应 (`0` 或 `1`)

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 基于 [Astro](https://astro.build) 构建
- 使用 [Tailwind CSS](https://tailwindcss.com) 进行样式设计
- 图标和组件来自各种开源库
- 灵感来源于现代博客设计模式

---

⭐ 如果你觉得这个项目有帮助，请给它一个星标！
