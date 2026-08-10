# Owais's Digital Canvas

An Awwwards-grade, ultra-animated developer portfolio for **Muhammad Owais Raza** —
dark obsidian theme, glassmorphism panels, GSAP SplitText typography, ScrollTrigger
choreography, a horizontal project showcase, a magnetic cursor, Lenis smooth
scrolling and full image/video portfolios.

Built with **TanStack Start** (React 19 + SSR), TypeScript, Tailwind CSS v4, GSAP
and Lenis.

## Content — edit one file

There is **no database and no CMS**. Every piece of content on the site is
defined in a single file:

```
src/content/portfolio.ts
```

Edit that file (profile, stats, projects, tech stack, images, videos, contact
details) and save — the site updates instantly. The file is fully typed and
commented.

## Development

Requires Node.js 20+ (npm).

```sh
npm install
npm run dev
```

Production build and preview:

```sh
npm run build
npm run preview
```

## Structure

| Path                       | Purpose                                            |
| -------------------------- | -------------------------------------------------- |
| `src/content/portfolio.ts` | ✏️ All site content — edit this                    |
| `src/lib/store.ts`         | Zustand store exposing content to components       |
| `src/routes/`              | File-based routes (home, about, projects, contact) |
| `src/components/`          | UI + GSAP animation components                     |
| `src/styles.css`           | Global theme tokens and utilities                  |
