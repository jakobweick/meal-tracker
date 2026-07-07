# Authentication Coding Standards

This app uses [Clerk](https://clerk.com) (`@clerk/nextjs`) for all authentication. Do not hand-roll auth (session cookies, JWT handling, password storage, OAuth flows, etc.) or introduce another auth library.

## Rules

- **Route protection lives in middleware.** `src/proxy.ts` uses `clerkMiddleware` + `createRouteMatcher` to define public routes (currently `/sign-in(.*)` and `/sign-up(.*)`). All other routes are protected via `auth.protect()`. New public routes must be added to the `isPublicRoute` matcher there — do not add ad-hoc auth checks in individual pages/layouts as a substitute.
- **`ClerkProvider` wraps the app** in `src/app/layout.tsx`. Do not add a second `ClerkProvider` further down the tree.
- **Use Clerk's prebuilt components for auth UI.** Sign-in/sign-up pages render `<SignIn />` / `<SignUp />` from `@clerk/nextjs` (see `src/app/sign-in/[[...sign-in]]/page.tsx` and `src/app/sign-up/[[...sign-up]]/page.tsx`). Do not build custom login/signup forms. If a custom-styled flow is ever required, follow Clerk's documented custom-flow APIs (`useSignIn`/`useSignUp`) rather than reimplementing auth logic.
- **Get the current user via Clerk's `auth()` helper**, not by decoding tokens or reading cookies manually:
  ```ts
  import { auth } from '@clerk/nextjs/server';

  const { userId } = await auth();
  ```
  This must only be called from Server Components, Server Actions, or Route Handlers.
- **Every database query or mutation touching user-owned data must scope by `userId` from `auth()`.** This is enforced in the `/data` helpers per [`docs/data-fetching.md`](./data-fetching.md) — see `src/data/meals.ts` for the pattern. Never trust a `userId` passed from the client.
- **Never fetch or check auth state from Client Components.** If a Client Component needs to know the current user, that data must be resolved in a parent Server Component (via `auth()` or a `/data` helper) and passed down via props — consistent with the general data-fetching rules.
- **Webhooks from Clerk are the one allowed exception to the "no Route Handlers" rule** in `docs/data-fetching.md`. Verify Clerk webhook payloads using `verifyWebhook` from `@clerk/nextjs/webhooks` before trusting them.

## Rationale

Centralizing auth checks in middleware and the `/data` layer means there's exactly one place that decides whether a route is public and exactly one place that decides whether a query is scoped to the right user — reducing the chance that a new page or helper accidentally skips authorization.
