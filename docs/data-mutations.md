# Data Mutations

This complements [`docs/data-fetching.md`](./data-fetching.md), which covers reads. This doc covers writes: creating, updating, and deleting data.

## Rules

- **All mutation logic lives in `/data` helper functions**, alongside the query helpers described in `docs/data-fetching.md`. A mutation helper wraps one or more Drizzle ORM calls (`insert`, `update`, `delete`) — raw SQL is not allowed under any circumstances.
- **Every mutation helper must scope its operation to the currently authenticated user** (e.g. filtering `update`/`delete` `where` clauses by `userId` from the Clerk session, and stamping `userId` on `insert`s). A logged-in user must never be able to create, modify, or delete another user's data.
- **Mutations are only triggered via Server Actions**, never Route Handlers. Server Actions are the sole entry point Client Components use to invoke a `/data` mutation helper.
- **Server Actions live in a co-located `actions.ts` file** (marked `"use server"`) next to the route/component that uses them — e.g. `src/app/dashboard/actions.ts` for actions used by `src/app/dashboard/`. Do not scatter Server Actions inline inside Client Components or centralize them in an unrelated shared location.
- **A Server Action's job is to call into a `/data` mutation helper** — it should not construct Drizzle queries itself. Keep the Drizzle/db-shape logic in `/data`; keep the `actions.ts` file thin (auth is already enforced inside the `/data` helper, but the action is the boundary that receives input from the client, so validate/parse that input there).
- **Client Components invoke Server Actions directly** (e.g. via calling the imported action in an event handler, or `<form action={...}>` combined with `useActionState`/manual field extraction) — they must not call `/data` helpers directly, and must not perform mutations through `fetch` to a Route Handler.
- **Every Server Action parameter must have an explicit TypeScript type** — no implicit `any`, and no relying on inference from an untyped call site.
- **Server Actions must not take a `FormData` parameter.** Do not write actions shaped like `action(formData: FormData)`. Instead, define actions with explicit, individually-typed parameters (primitives or plain typed objects/interfaces), and have the caller pass those values directly (e.g. from component state) rather than extracting them from a raw form submission inside the action.
- **Every Server Action must validate its arguments with [Zod](https://zod.dev) at the top of the function body**, before calling into any `/data` helper. Define a Zod schema for the action's input (co-located in `actions.ts`, or shared if reused), parse the incoming arguments against it (e.g. `schema.parse(...)`), and only proceed with the parsed/validated result. The TypeScript parameter types and the Zod schema should agree — the schema is the runtime enforcement of the same shape the type describes.

## Example shape

```
src/data/meals.ts        // getMealsForCurrentUser, createMeal, deleteMeal (Drizzle, userId-scoped)
src/app/dashboard/actions.ts   // "use server"; addMeal(input: { name: string; eatenAt: Date }) validates input with a Zod schema, then calls into src/data/meals.ts
src/app/dashboard/dashboard-client.tsx  // "use client"; calls addMeal()/removeMeal() from actions.ts with typed arguments
```

## Rationale

Keeping Drizzle calls exclusively in `/data` centralizes the per-user authorization check in one place, consistent with the data-fetching rules. Routing every mutation through a co-located Server Action gives each route a single, explicit entry point for writes, avoids introducing Route Handlers as a mutation API, and keeps Client Components free of direct data-layer or fetch-based access.
