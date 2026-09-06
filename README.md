# learn.smmeyer.dev

Free, self-paced technical courses by Steven Meyer. Frontend-first: no
accounts, no backend, progress stored locally in the browser.

## Current state

Two full courses are published as static content:

| Course | Chapters | Est. time | Route |
| --- | --- | --- | --- |
| System design for software engineers | 15 | ~56h | `/system-design` |
| LLM engineering for software engineers | 21 | ~73h | `/llm-engineering` |

Every chapter renders from structured TypeScript content with the full
learning loop: outcome → why it matters → coverage map → mental model →
lessons → senior signal → failure patterns → interview drill → knowledge
checks → planned labs → references.

Outstanding work is tracked in [`TODO.md`](./TODO.md).

## Stack

- Next.js 16 (App Router, statically prerendered) — note: this is a newer
  Next.js than you may be used to; read `node_modules/next/dist/docs/` before
  writing route code
- React 19, TypeScript
- Tailwind CSS v4 with oklch design tokens (`app/globals.css`)
- shadcn/ui (Base UI) — components copied into `components/ui/`
- pnpm

## Structure

```
app/
  page.tsx                  # course index (/)
  layout.tsx                # root layout, dark theme, metadata
  [course]/page.tsx         # course chapter index
  [course]/[chapter]/page.tsx  # chapter lesson surface
components/
  course/                   # course-view, chapter-view (block renderers)
  ui/                       # shadcn components
content/
  types.ts                  # Course / Chapter schema
  system-design.ts          # course content (15 chapters)
  llm-engineering.ts        # course content (21 chapters)
  index.ts                  # registry + lookup helpers
docs/
  system-design-llm-course-build-handoff.md  # canonical curriculum source
```

All routes are statically generated via `generateStaticParams`; there are no
client components and no runtime data fetching.

## Commands

```bash
pnpm dev    # Start the local development server
pnpm lint   # Run ESLint
pnpm build  # Create a production build (also prerenders all 42 pages)
pnpm start  # Serve the production build
```

## Content authoring

See [`content/README.md`](./content/README.md) for the schema, the invariants
a chapter must satisfy, and how to add or revise a chapter.

## Design system

- Dark-only theme; tokens live in `app/globals.css` (`.dark` block is the
  source of truth). Accent/primary is honey gold `#E4AD44`
  (`oklch(0.78 0.135 80)`), chosen to sit in the same warm hue family as the
  neutrals.
- Aesthetic: monospace meta labels, terminal-flavored details, generous
  spacing, prose at a readable measure. Keep new pages consistent with
  `components/course/chapter-view.tsx`.
- Reveals (drill approaches, quiz answers) use native
  `<details>`/`<summary>`: no client JS, keyboard accessible, respects
  reduced motion. Answers must never be visible in the static HTML before the
  reveal.

## Curriculum provenance

The course content is ported from
`docs/system-design-llm-course-build-handoff.md`, which remains the canonical
source for curriculum intent, interaction briefs, and the build plan. Content
was ported into structured TypeScript; a small number of garbled fragments in
the source were normalized without changing meaning.
