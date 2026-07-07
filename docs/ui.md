# UI Coding Standards

## Rule: shadcn/ui only

All UI in this project must be built exclusively from [shadcn/ui](https://ui.shadcn.com) components. **No custom UI components may be created.**

- Do not hand-roll buttons, inputs, cards, dialogs, dropdowns, tables, forms, etc. If shadcn/ui offers a component for the job, use it.
- If a needed component doesn't exist yet in `src/components/ui`, install it via the shadcn CLI rather than writing it by hand:

  ```bash
  npx shadcn@latest add <component>
  ```

- Do not fork, rewrite, or hand-edit the internals of a generated component in `src/components/ui` beyond what the shadcn CLI produces. Configure appearance through the project's Tailwind theme (`src/app/globals.css`) and component `props`/`variant`s instead.
- Compose pages and features by combining shadcn/ui primitives (`Button`, `Card`, `Dialog`, `Form`, `Input`, `Table`, etc.), not by introducing new bespoke primitives in `src/components/`.
- Icons come from `lucide-react` (the configured `iconLibrary`), consistent with shadcn/ui defaults.

## Project shadcn/ui configuration

Defined in `components.json`:

- Style: `radix-nova`
- Base color: `neutral`
- CSS variables: enabled
- Aliases: `@/components`, `@/components/ui`, `@/lib`, `@/hooks`
- Icon library: `lucide`

## Adding a new component

1. Check `src/components/ui` to see if the component already exists.
2. If not, install it: `npx shadcn@latest add <component>`.
3. Import it from `@/components/ui/<component>`.
4. Build the feature by composing installed shadcn/ui components — do not write a new custom component from scratch.
