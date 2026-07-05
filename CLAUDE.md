# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

This is a Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 project, currently at the unmodified `create-next-app` scaffold stage — no application-specific code, routes, or tests exist yet beyond the default `src/app/page.tsx` / `layout.tsx`.

## Commands

- `npm run dev` — start the dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — run ESLint (flat config via `eslint.config.mjs`, extends `eslint-config-next`'s core-web-vitals and typescript rule sets)

There is no test runner configured yet.

## Architecture

- Uses the Next.js App Router: routes/pages live under `src/app/`, with `layout.tsx` defining the root layout and `page.tsx` the route content.
- Path alias `@/*` maps to `src/*` (configured in `tsconfig.json`).
- Styling is Tailwind CSS v4 via `@tailwindcss/postcss` (configured in `postcss.config.mjs`); global styles in `src/app/globals.css`.
- TypeScript is in `strict` mode with `noEmit` (type checking only; builds are handled by Next.js/SWC).
