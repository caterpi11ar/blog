# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal technical blog built with Astro 3.6.4, featuring a modern, responsive design with TypeScript and React components. The blog supports MDX content, math formulas, dark/light themes, and includes a Giscus comment system based on GitHub Discussions.

## Development Commands

- `pnpm dev` or `pnpm start` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm lint:fix` - Run ESLint with auto-fix
- `pnpm cz` - Use Commitizen for conventional commits

## Pre-commit Hooks

The project uses simple-git-hooks with the following workflow:
1. `pnpm i --frozen-lockfile --ignore-scripts --offline` - Install dependencies
2. `pnpm typecheck` - Type checking
3. `npx lint-staged` - Lint staged files

Always ensure TypeScript compilation passes and linting is clean before committing.

## Architecture

### Core Structure
- **Content Management**: Blog posts in `src/content/blog/` using MDX/Markdown
- **Components**: React components in `src/components/` for UI elements
- **Layouts**: Astro layouts in `src/layouts/` for page structure
- **Pages**: Astro pages in `src/pages/` with dynamic routing
- **Configuration**: Site config in `src/config.ts`

### Key Features
- **Math Support**: MathJax integration via rehype-mathjax and remark-math
- **Search**: Client-side search using Fuse.js
- **Comments**: Giscus integration (requires GitHub Discussions setup)
- **SEO**: Automatic sitemap, RSS feed, and Open Graph image generation
- **Styling**: Tailwind CSS with custom base styles disabled

### Important Files
- `astro.config.ts` - Astro configuration with integrations and markdown plugins
- `src/config.ts` - Site configuration including SITE, LOCALE, and SOCIALS
- `src/types.ts` - TypeScript type definitions
- `tailwind.config.cjs` - Tailwind CSS configuration

## TypeScript Standards

- Use interfaces for object structures, avoid type aliases for objects
- Avoid `any`, prefer `unknown` when type is uncertain
- Export all public interfaces and types
- Use `as const` for literal types and constants
- Provide JSDoc comments for complex types and functions
- Ensure zero TypeScript errors or warnings

## Development Guidelines

- Avoid introducing new dependencies without careful consideration of bundle size
- Use React.memo, useMemo, and useCallback for performance optimization
- Maintain compatibility with modern browsers
- Support server-side rendering
- Avoid breaking changes to maintain backward compatibility
- Use TypeScript and React for all new components

## Content Structure

Blog posts are organized in `src/content/blog/` with subdirectories for different categories:
- `interview/` - Interview preparation content
- `project/` - Project documentation
- `python/` - Python tutorials
- `react/` - React-related content

## Package Manager

This project uses **pnpm** exclusively. The preinstall script enforces this with `npx -y only-allow pnpm`.