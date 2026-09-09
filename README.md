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
  layout.tsx                # root layout, dark theme, metadata, search index
  glossary/page.tsx         # glossary reference
  drills/page.tsx           # interview drill deck
  mock/page.tsx             # 50-minute mock workspace
  field-manual/page.tsx     # field manual reference
  [course]/page.tsx         # course chapter index
  [course]/[chapter]/page.tsx  # chapter lesson surface
components/
  course/                   # course-view, chapter-view (block renderers)
  drills/                   # deck, mock workspace (client)
  labs/                     # lab-shell, registry, code-split host + 10 labs
  progress/                 # completion, quiz, notes, bookmarks islands
  search/                   # command palette (client)
  site-header.tsx           # shared header + practice nav
  ui/                       # shadcn components
content/
  types.ts                  # Course / Chapter schema
  system-design.ts          # course content (15 chapters)
  llm-engineering.ts        # course content (21 chapters)
  drills.ts                 # 20 scenarios, constraint decks, mock structure
  field-manual.ts           # formulas, budgets, metrics, checklist, FACT
  glossary.ts               # durable concepts with chapter deep links
  index.ts                  # registry + lookup helpers
lib/
  progress.ts               # versioned localStorage store + actions
  search.ts                 # build-time index + fuzzy matching
scripts/
  validate-content.ts       # CI content invariants (pnpm validate)
tests/
  unit.test.ts              # store, search, drill-seed tests (pnpm test)
e2e/
  flows.spec.ts             # Playwright highest-value flows
docs/
  system-design-llm-course-build-handoff.md  # canonical curriculum source
```

All routes are statically generated via `generateStaticParams`; pages are
server-rendered with small client islands for progress (`components/progress/`,
localStorage only — see TODO §1 for what's left).

## Commands

```bash
pnpm dev    # Start the local development server
pnpm lint   # Run ESLint
pnpm validate  # Check content invariants (CI)
pnpm test   # Unit tests: store, search, drill seeds (CI)
pnpm check-links  # Fetch every reference URL (manual, pre-deploy — not CI)
pnpm perf   # Build + Lighthouse floors on index/chapter/lab (manual, pre-deploy)
pnpm build  # Create a production build (also prerenders all pages)
pnpm start  # Serve the production build
pnpm exec playwright test  # Highest-value e2e flows (CI)
```

## Deploy

`metadataBase` is `https://learn.smmeyer.dev` with per-page canonicals.
The default build runs anywhere Next.js runs (Vercel: zero config, custom
domain `learn.smmeyer.dev`). For pure static hosts, `output: "export"`
also works — every route is static and labs are client chunks — served
from `out/` with any static file server.

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
