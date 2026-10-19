# learn.smmeyer.dev

Free, self-paced technical courses by Steven Meyer. Frontend-first: no
accounts, no backend, progress stored locally in the browser.

## Current state

Two courses are included as statically rendered content:

| Course | Chapters | Suggested practice budget | Route |
| --- | --- | --- | --- |
| System design for software engineers | 15 | ~56h | `/system-design` |
| LLM engineering for software engineers | 21 | ~73h | `/llm-engineering` |

Every chapter renders from structured TypeScript content: outcome and study
plan → mental model → lessons → worked example → optional live lab →
assignment and constraint variations → rubric and sample artifact → cumulative
project stage → knowledge checks →
closed-book recall → interview drill → references and personal notes.

The hours include independent assignments, variations, repeated drills, and
review. Each chapter provides a four-block time budget; reading is only its
first block. Every chapter has an original worked example, an assignment
with a concrete deliverable, a self-review rubric, two recall prompts with
sample reasoning, and selected primary references. Exercises can be done
with paper and a text editor; paid model or cloud access is optional.

The lessons include causal explanations, request/failure traces, and worked
arithmetic. Each assignment has a hidden reference artifact with stated
assumptions, explicit self-checks, and a common mistake to avoid. Relay (a
private file service) and Harbor (a support assistant) grow across their
respective tracks, retrieving earlier concepts before adding new constraints.
Keep a local project document with first attempts and revisions; cumulative
work shares the existing assignment/review budget. Final chapters combine
the artifacts into a design packet and recorded review.

`/about` explains prerequisites, the study loop, an alternating
sequence across the tracks, local progress, and the source/update policy.
Course roadmaps group chapters by phase; chapter pages include section links.
Logged chapter practice joins a review queue on the home page and roadmap:
scores 1–2 return immediately, stronger practice returns after 48 hours, and
missed quiz answers prompt review. Completing a chapter points directly to
the next unfinished chapter in that track.

`/drills` starts with two guided pilots: cache expiry for System Design and
evidence-backed policy answers for LLM Engineering. Each provides a fixed
brief, an autosaved worksheet, optional hints, calculation checks, a worked
reference, anchored self-review criteria with evidence, and a saved revision.
The original attempt stays alongside the revision; repeating a case keeps
reviewed history and starts a blank worksheet. Recorded gaps return for the
next session; a baseline meeting all checks returns after 48 hours. Guided
work is included in progress export/import/reset. The original random deck,
oral fluency prompts, and interview redo queue remain under independent
practice. Additional guided cases wait for review of these two pilots.

Outstanding work is tracked in [`TODO.md`](./TODO.md); parked ideas live
in [`docs/ROADMAP.md`](./docs/ROADMAP.md). If you are an agent starting a
new session, read [`AGENTS.md`](./AGENTS.md) first.

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
  about/page.tsx # audience, study sequence, budgets, local data
  not-found.tsx             # branded 404 with course/search recovery
  opengraph-image.tsx        # static social preview generated at build time
  glossary/page.tsx         # glossary reference
  drills/page.tsx           # guided pilots + optional independent drill deck
  drills/[exercise]/page.tsx # statically generated guided worksheets
  mock/page.tsx             # 50-minute mock workspace
  manual/page.tsx     # manual reference
  [course]/page.tsx         # course chapter index
  [course]/[chapter]/page.tsx  # chapter lesson surface
components/
  course/                   # course-view, chapter-view (block renderers)
  drills/                   # guided worksheets, independent deck, mock (client)
  labs/                     # lab-shell, registry, code-split host + 10 labs
  progress/                 # completion, quiz, notes, bookmarks islands
  search/                   # command palette (client)
  site-header.tsx           # shared header + practice nav
  ui/                       # shadcn components
content/
  types.ts                  # Course / Chapter schema
  system-design.ts          # course content (15 chapters)
  llm-engineering.ts        # course content (21 chapters)
  lessons/                  # expanded teaching sections for all 36 chapters
  study-guides/             # 36 worked examples, assignments, rubrics, recall
  practice/                 # sample artifacts + cumulative project stages
  references.ts             # selected primary sources with review months
  drills.ts                 # 20 scenarios, constraint decks, mock structure
  guided-exercises/         # two complete guided cases + content schema
  manual.ts           # formulas, budgets, metrics, checklist, FACT
  glossary.ts               # durable concepts with chapter deep links
  index.ts                  # registry + lookup helpers
lib/
  progress.ts               # versioned localStorage store + actions
  guided-practice.ts        # draft validation, arithmetic checks, review rules
  search.ts                 # build-time search index
  search-matching.ts        # browser matcher, isolated from curriculum imports
  study.ts                  # next unfinished chapter + chapter review queue
scripts/
  validate-content.ts       # CI content invariants (pnpm validate)
  check-links.ts            # on-demand reference URL check (pnpm check-links)
  lighthouse.mjs            # Lighthouse floors vs local prod (pnpm perf)
tests/
  unit.test.ts              # store, search, drill-seed tests (pnpm test)
  review-fixes.test.ts      # lab math, import guard, redo queue (pnpm test)
e2e/
  flows.spec.ts             # Playwright highest-value flows
  crawl.spec.ts             # every static URL: 200 + landmarks + no errors
  labs.spec.ts              # all 10 labs driven through real input events
  storage.spec.ts           # full localStorage round trip
docs/
  system-design-llm-course-build-handoff.md  # canonical curriculum source
  ROADMAP.md                # parked ideas (not promised)
```

All routes are statically generated via `generateStaticParams`; pages are
server-rendered with small client islands for progress, labs, drills, and
search (`components/*/`, localStorage only).

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

In a restricted local sandbox that blocks Turbopack's PostCSS worker IPC,
`pnpm build --webpack` builds the same static routes with webpack. Report
that distinction when recording deployment checks; the default build stays
on Turbopack.

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
- Drill approaches and lab takeaways use native `<details>`/`<summary>`.
  Labs capture a prediction before exposing controls and results. Recall
  checks require a written attempt before showing sample reasoning. Answers
  are visually hidden until revealed; serialized answer data is inspectable.
  Interactions stay keyboard accessible and respect reduced motion.

## Curriculum provenance

The baseline course content is ported from
`docs/system-design-llm-course-build-handoff.md`, which remains the canonical
source for curriculum intent, interaction briefs, and the build plan. Content
was ported into structured TypeScript; a small number of garbled fragments in
the source were normalized without changing meaning. The October 2026 study
guides supplement that baseline with original teaching scenarios and
assignments, preserving its coverage and chapter URLs. Example values are
illustrative; linked documentation supplies deeper context and current
provider contracts.
