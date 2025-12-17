# Architecture Overview

WalletWise is a full-stack trip expense sharing app built with React (frontend) and Express.js (backend), using PostgreSQL on Supabase for data persistence. The app manages "Adventures" (trip groups) with expenses and balances.

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + React Router DOM. Components in `src/components/`, pages in `src/pages/`.
- **Backend**: Express.js + TypeScript, API routes under `/api`. Database access via `server/models/database.ts` using pg Pool.
- **Data Flow**: Frontend fetches/sends data via REST API calls to backend, which queries PostgreSQL.

Key files: [server.ts](server.ts) (main server), [src/App.tsx](src/App.tsx) (routing), [server/models/database.ts](server/models/database.ts) (DB connection).

# Developer Workflows

- **Start dev server**: `npm run dev` (Vite) + `npm run server` (Express with tsx watch).
- **Build**: `npm run build` (TypeScript compile + Vite build).
- Run both frontend and backend concurrently for full development.

Backend uses `tsx` to run TypeScript directly without pre-compilation.

# Project Conventions

- **Database Queries**: Use async/await with `pool.query()`. Log queries in [database.ts](server/models/database.ts). Parameters as arrays for prepared statements.
- **API Endpoints**: RESTful, e.g., `POST /api/adventure` for creating adventures. Use Express middleware: `cors()`, `express.json()`.
- **Components**: Functional with TypeScript interfaces for props. Extend `ComponentProps` for flexibility (see [Buttons.tsx](src/components/groups-overview/Buttons.tsx)).
- **Styling**: Tailwind CSS classes directly in JSX. Consistent color scheme (e.g., `#3A7FE5` for primary blue).
- **Routing**: React Router with nested routes (e.g., `/trip-name/expenses`). Use `Link` for navigation in components.
- **Error Handling**: Try-catch in async DB operations, send 500 on errors.
- **Environment**: Use `.env` for secrets (currently hardcoded connection string in [database.ts](server/models/database.ts) - refactor to env).

# Examples

- Creating a new adventure: `POST /api/adventure` with `{name}` body, inserts into "Adventures" table.
- Component props: `interface ListProps { title: string; subtitle: string; amount: number; }`
- DB query: `await pool.query('SELECT * FROM "Adventures"')`

Focus on trip expense logic: calculate balances, split expenses among members.
