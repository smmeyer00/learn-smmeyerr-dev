# learn.smmeyer.dev

A frontend-first learning app for practical technology courses. Course progress
will be stored locally in the browser, so the initial application does not need a
database or backend service.

## Stack

- Next.js (App Router and Turbopack)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- pnpm

## Development

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
pnpm dev    # Start the local development server
pnpm lint   # Run ESLint
pnpm build  # Create a production build
pnpm start  # Serve the production build
```

## Adding shadcn/ui components

shadcn/ui is initialized with the default `base-nova` preset. Components are
copied into the repository so they can be customized as the interface develops.

```bash
pnpm dlx shadcn@latest add <component>
```
