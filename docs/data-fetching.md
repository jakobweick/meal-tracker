# Data Fetching

All data fetching in this app must be done via **Server Components**.

## Rules

- Fetch data directly inside `async` Server Components (`page.tsx`, `layout.tsx`, or other components without `"use client"`), using direct database/ORM calls (e.g. Drizzle) or `fetch`.
- Do not create Route Handlers (`route.ts`) for the purpose of fetching data to be consumed by this app's own UI. Route Handlers must not be introduced as a data-fetching layer under any circumstances.
- Client Components must not fetch data themselves. If a Client Component needs data, the data must be fetched in a parent Server Component and passed down via props.
- Mutations (creating/updating/deleting data) should use Server Actions, not Route Handlers.
- Route Handlers are reserved only for cases with no alternative, such as webhooks from third-party services (e.g. Clerk) — never for serving data to this app's own pages.

## Database access

- All database queries must go through helper functions defined in the `/data` directory. Server Components must not query the database directly inline — they call into `/data` helpers.
- These helper functions must use Drizzle ORM to query the database. Raw SQL is not allowed under any circumstances.
- Every helper function must scope queries to the currently authenticated user (e.g. filtering by `userId` from the Clerk session). A logged-in user must never be able to read, modify, or delete another user's data. Any helper that fetches or mutates user-owned data must enforce this at the query level, not just in the calling component.

## Rationale

Server Components can talk to the database directly, avoiding the extra network hop, serialization overhead, and duplicated auth/authorization logic that a Route Handler + `fetch` roundtrip would introduce. Centralizing queries in `/data` helpers keeps the per-user authorization check in one place instead of duplicated (and potentially forgotten) across every component.
