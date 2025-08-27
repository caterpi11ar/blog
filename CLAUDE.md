# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development Server
```bash
pnpm dev          # Start development server
pnpm start        # Alternative start command
pnpm preview      # Preview production build locally
```

### Build and Production
```bash
pnpm build        # Build for production
pnpm sync         # Sync Astro content collections
```

### Code Quality
```bash
pnpm typecheck    # Run TypeScript type checking
pnpm lint:fix     # Fix linting issues with ESLint
```

### Git Workflow
- Pre-commit hooks automatically run: `pnpm typecheck` and `lint-staged`
- Use `pnpm cz` for conventional commits with Commitizen

## Architecture Overview

This is an Astro-based blog with the following key architectural patterns:

### Content Management
- **Content Collections**: Blog posts stored in `src/content/blog/` with TypeScript schema validation
- **Frontmatter**: Each post uses YAML frontmatter with title, author, pubDatetime, tags, description, featured, draft fields
- **Categories**: Posts organized in subdirectories (ai/, interview/, project/, python/, react/)

### Component Architecture
- **Astro Components**: Server-side rendered components (.astro files) for layouts, static UI
- **React Components**: Client-side interactive components (.tsx files) for search, theme toggle, command palette, Giscus comments
- **Hybrid Rendering**: Combines static generation with selective hydration for interactive features

### Styling and Theme System
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Dark/Light Mode**: Theme switching handled by `useTheme.tsx` hook with localStorage persistence
- **Typography**: Tailwind typography plugin for rich markdown content

### Key Features
- **Search**: Client-side search using Fuse.js for fuzzy matching
- **Math Support**: MathJax integration via rehype-mathjax for LaTeX rendering
- **Table of Contents**: Auto-generated TOC using remark-toc with collapsible sections
- **SEO**: Built-in Open Graph image generation, sitemap, RSS feed
- **Command Palette**: Custom command system in `src/components/Command/`

### Content Processing Pipeline
1. Markdown/MDX files processed through Astro's content collections
2. Remark plugins: remarkMath, remarkToc, remarkCollapse
3. Rehype plugins: rehypeMathjax for math rendering
4. Syntax highlighting with Shiki (one-dark-pro theme)

### File Structure Patterns
- `src/layouts/`: Page templates and layout components
- `src/pages/`: File-based routing with dynamic routes for posts and tags  
- `src/utils/`: Pure utility functions for post sorting, tag extraction, OG image generation
- `src/components/`: Reusable UI components with clear separation between Astro and React
- `public/assets/`: Static assets including images and fonts

### Environment Configuration
- Giscus comments system requires environment variables for GitHub Discussions integration
- Site configuration centralized in `src/config.ts`