# Agent instructions

This is a TanStack Start (React) portfolio application. Key facts to keep in mind:

- All site content (profile, projects, stats, tech stack, image/video portfolios)
  lives in **`src/content/portfolio.ts`** — there is no database.
- Content is read through the Zustand store in `src/lib/store.ts`.
- The UI and GSAP motion system are intentionally hand-tuned; preserve them when
  making changes.
- `src/routes/routeTree.gen.ts` is auto-generated — don't edit it by hand
  (regenerate via `npx tsr generate` or by running a build).
