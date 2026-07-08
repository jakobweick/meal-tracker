---
description: In-depth review of the whole codebase, focused on security and logical bugs
---

Perform an in-depth code review of this project's entire codebase. Focus exclusively on **security** and **logical bugs** — do not comment on style, formatting, or naming.

## Scope

Review the whole codebase, including but not limited to:
- `src/db/schema.ts` — table definitions, relations, constraints
- `src/db/index.ts` — connection/client setup
- Every file under `src/data/` — query and mutation helpers
- Server Actions (`actions.ts` files) and the input validation they perform
- Route Handlers (`route.ts`), especially webhook handlers
- Middleware / auth configuration (`src/proxy.ts` or equivalent)
- Server Components and Client Components — data flow between them, and anything that could leak server-only data or bypass the data-fetching/mutation rules in `docs/`

## What to check

**Security**
- Every query/mutation touching user-owned data must be scoped by `userId` from Clerk's `auth()` — check `where` clauses on reads, updates, and deletes, and confirm `userId` is stamped on inserts. Flag anything that trusts a `userId` passed from the client instead of `auth()`.
- No raw SQL (`sql\`...\``) — everything must go through Drizzle's query builder.
- No auth/authorization logic bypassed by an alternate code path (e.g. a helper that skips the `userId` filter under some condition, or a route/page missing from the middleware's protected-route matcher).
- Look for IDOR-style bugs: fetching/mutating by a record ID without also verifying the record belongs to the current user.
- Confirm Server Actions validate their inputs with Zod before calling into `/data` helpers, and that this validation can't be bypassed.
- Webhook handlers must verify payloads (e.g. `verifyWebhook` for Clerk) before trusting them.
- Client Components must not fetch data or check auth state themselves — verify data/auth is resolved in a parent Server Component and passed down via props.
- Look for secrets, tokens, or connection strings hardcoded or logged instead of read from environment variables.

**Logical bugs**
- Foreign key / cascade behavior — check `onDelete`/`onUpdate` settings against expected behavior (e.g. deleting a meal should clean up its `mealFoodItems`).
- Off-by-one or incorrect filter logic in `where`/`orderBy` clauses.
- Type mismatches between Drizzle schema types and the TypeScript types used at call sites (e.g. numeric/decimal columns handled as strings vs. numbers).
- Transaction boundaries — multi-step mutations that should be atomic but aren't wrapped in a transaction.
- Null/undefined handling for optional columns (e.g. `calories`, `quantity`) — verify defaults and calculations handle `null` correctly.
- Incorrect state handling in Client Components (stale closures, effects firing more/less often than intended, race conditions between client state and server data).
- Broken redirects/navigation logic, or UI states that are unreachable or never clear (e.g. loading/error state that never resets).

## Output

Report findings ranked by severity (security issues first). For each finding, give:
- File and line
- The concrete bug/vulnerability
- A specific failure scenario (what input or sequence of actions triggers it)
- A suggested fix

If nothing is found in a category, say so explicitly rather than omitting it.
