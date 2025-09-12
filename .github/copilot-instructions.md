# Copilot Instructions for AI Coding Agents

## Project Overview
- **Type:** Modern web app with React (TypeScript) frontend and Node.js backend
- **Structure:**
  - `client/` — Frontend (React, Vite, Tailwind, Drizzle ORM)
  - `server/` — Backend (Node.js, custom API, Drizzle ORM)
  - `shared/` — Shared types and schema (used by both client and server)

## Architecture & Data Flow
- **Frontend:**
  - React functional components and hooks (`src/components/`, `src/hooks/`)
  - UI primitives in `src/components/ui/` (always reuse these)
  - Pages in `src/pages/` (route-based, e.g. `home.tsx`, `cart.tsx`)
  - State is local or via custom hooks (no Redux/global state)
  - PWA support: `src/lib/pwa-utils.ts`, `public/service-worker.js`
- **Backend:**
  - API routes in `server/routes.ts` (custom Node.js API)
  - Database via Drizzle ORM (`server/db.ts`, `shared/schema.ts`)
  - Shared types and schema in `shared/` (imported by both client/server)

## Integration Points

## Data Layer

- **PWA:** `client/public/service-worker.js`, `src/lib/pwa-utils.ts`
- **Drizzle ORM:** Used for backend and shared types
- **Vite:** Used for both frontend and backend dev/build

## Examples
- Add a UI button: create in `src/components/ui/button.tsx`, import where needed
- Add a page: create in `src/pages/`, register route if needed
- Add an API route: update `server/routes.ts`
- Add a DB table: update `shared/schema.ts`, run Drizzle migration

## References
- `README.md` (minimal)
- `drizzle.config.ts`, `vite.config.ts`, `tailwind.config.ts` for config patterns
- `src/components/ui/` for UI conventions
- `shared/schema.ts` for DB schema

---
**When in doubt, follow existing patterns and colocate related code.**
