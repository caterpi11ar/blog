# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal technical blog built with **Astro 6** + **React 18** + **Tailwind CSS 4**, written primarily in Chinese. Content is MDX/Markdown under `src/content/blog/`, with Giscus comments, client-side Fuse.js search, MathJax formulas, and Satori-generated OG images.

## Development Commands

- `pnpm dev` — start dev server
- `pnpm build` — production build
- `pnpm preview` — preview production build
- `pnpm sync` — regenerate Astro content types (run after editing `content.config.ts` or adding frontmatter fields)
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm lint:fix` — ESLint auto-fix (uses `@antfu/eslint-config`)
- `pnpm cz` — Commitizen conventional commit

The pre-commit hook (simple-git-hooks) runs `pnpm typecheck` then lint-staged. Both must pass.

## Architecture

### Content pipeline

- Posts live in `src/content/blog/` as `.md`/`.mdx`. The collection is declared in `src/content.config.ts` using the `glob` loader with a strict Zod schema: `pubDatetime` (required Date), `title`, `description`, optional `tags`, `featured`, `draft`, `ogImage` (image must be ≥1200×630 if a local asset).
- Changing the schema requires `pnpm sync` so `astro:content` types regenerate.
- Site-level config (author, title, URLs, pagination) lives in `src/config.ts`; import via the `@config` alias.

### Markdown processing (`astro.config.ts`)

Remark/rehype chain (order matters):
1. **`src/plugins/remark-rewrite-asset-urls.ts`** — rewrites `/assets/threejs/...` image paths to the Volces TOS CDN at build time. Three.js post images are intentionally **not committed** to git; they're served from TOS. Adding a new CDN-backed category means extending this plugin or config.
2. `remark-toc` — generates TOC.
3. `remark-math` + `rehype-mathjax` — LaTeX rendering.
4. `remark-collapse` — wraps the "Table of contents" heading in a `<details>`.

Shiki uses the `one-dark-pro` theme with `wrap: true`.

### Pages and routing

- `src/pages/posts/[...slug].astro` + `[...page].astro` — dynamic post + paginated index.
- `src/pages/tags/` — tag index and per-tag paginated lists.
- `src/pages/threejs/` — dedicated Three.js landing.
- `src/pages/og.png.ts` + `src/utils/generateOgImages.tsx` + `src/utils/og-templates/` — runtime OG image generation via Satori + resvg-js. `@resvg/resvg-js` is excluded from Vite `optimizeDeps` (native binding).
- `src/pages/rss.xml.ts`, `robots.txt.ts` — feed and robots.

### Utilities (`src/utils/`)

`getSortedPosts`, `getPostsByTag`, `getUniqueTags`, `getAdjacentPosts`, `getPageNumbers`, `slugify`, `cn` (clsx + tailwind-merge). Prefer these over reimplementing; post ordering and draft filtering are centralized in `getSortedPosts`.

### Layouts

`Layout.astro` (root) → `Main.astro` (header/footer shell) → `Posts.astro` / `PostDetails.astro` / `AboutLayout.astro`. React components under `src/components/` are used selectively (Giscus, Search, theme toggle) — most rendering is Astro.

## Conventions

- **Package manager**: pnpm only (preinstall enforces `only-allow pnpm`).
- **Imports**: use the `@config` alias for site config; other paths are relative.
- **TypeScript**: no `any`; prefer `interface` for object shapes; fail type-check is a blocker (pre-commit gate).
- **Blog content language**: posts are in Chinese. Keep tone plain and natural — avoid dramatized or marketing-style phrasing.
- **Three.js post images**: place under `/assets/threejs/...` in markdown; upload the actual image to the Volces TOS bucket (`blog/threejs/` prefix). Do not commit image binaries.
- **Giscus**: requires `PUBLIC_GISCUS_REPO`, `PUBLIC_GISCUS_REPO_ID`, `PUBLIC_GISCUS_CATEGORY_ID` in `.env` (see README).

## Content categories

Subdirectories under `src/content/blog/` group posts by topic (ai, cycling, interview, linux, monorepo, project, python, react, ruankao, seo, threejs, travel, etc.). New categories can be added freely — the glob loader picks up any `**/*.{md,mdx}`.
