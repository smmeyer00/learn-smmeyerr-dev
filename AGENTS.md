<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent session guide (learn.smmeyer.dev)

Read this before doing anything else in a new session. It captures the
context, decisions, and hard-won gotchas from prior sessions so you do not
need a manual spin-up. Human-facing project docs live in `README.md`;
curriculum source of truth is
`docs/system-design-llm-course-build-handoff.md`.

## Session startup checklist

1. Read `README.md`, `TODO.md`, `docs/ROADMAP.md` (in that order).
2. Run `git log --oneline -8` and `git status` to see where the tree is.
3. If touching routes: read the relevant guide in
   `node_modules/next/dist/docs/` first (Next 16 breaks old habits).
4. Before committing: `pnpm lint`, `pnpm validate`, `pnpm test`,
   `pnpm build`, `pnpm exec playwright test`. All green or it does not ship.

## What this repo is

Static Next.js 16 course site (system design + LLM engineering, 36
chapters) with interactive labs, interview drills, and versioned
localStorage progress. No backend, no accounts, no runtime data fetching.
Content is structured TypeScript (`content/`), rendered by block renderers
(`components/course/`). All interactivity is small client islands;
chapter pages stay server-rendered.

Key files for common tasks:

| Task | Files |
| --- | --- |
| Edit course prose | `content/system-design.ts`, `content/llm-engineering.ts` |
| Chapter schema | `content/types.ts`, rules in `content/README.md` |
| Lab teaching math | `components/labs/models.ts` (pure, unit-tested) |
| Lab UI | `components/labs/*.tsx` + `registry.ts` (`replacesPlanned` hides superseded checklist items) |
| Progress store | `lib/progress.ts` (`ProgressStateV1`, migration, import guard) |
| Drills/mocks | `content/drills.ts` (scenarios, seeds, redo queue) |
| Search | `lib/search.ts` (build-time index, no deps) |
| Pre-deploy checks | `scripts/check-links.ts`, `scripts/lighthouse.mjs` |
| CI | `.github/workflows/ci.yml` (lint → validate → test → build → playwright) |

## Architecture decisions (do not relitigate without cause)

- **Content as typed TS, not MDX.** Renderers assume the invariants in
  `scripts/validate-content.ts`; extend the validator when extending the schema.
- **Server components + client islands.** New interactivity goes in a
  `"use client"` island with an SSR-safe snapshot (`useSyncExternalStore`);
  never convert a page to a client component.
- **localStorage only.** Versioned key, migration in `lib/progress.ts`,
  strict import gate (schema version + recognized keys) plus replace
  confirmation. Never silently overwrite user state.
- **Scope hours = sum of chapter hours** (56h/73h). The handoff's own
  scope lines (~46h/~39h) contradict its per-chapter estimates; the sums win.
- **Lab math lives in `models.ts`, tested.** MAU converts to DAU through an
  explicit share; KV width is `kvHeads × headDim` (GQA, not hidden dim);
  attention patterns are causal (future weights zeroed + renormalized).
- **Labs code-split per lab** via `LabHost` + `next/dynamic`; verified by
  grepping build chunks, not by assumption.
- **Mock reps join the drill redo queue** as their own rows (`mock:*` ids).
- **Link checking stays out of CI** (external flake); `pnpm check-links`
  runs manually pre-deploy. Same for `pnpm perf` (local numbers wobble).
- **Domain is `learn.smmeyer.dev`** (decided; metadataBase + copy match).
- **Deploy target:** Vercel zero-config, or `output: "export"` for pure
  static hosts. DNS is owned manually by Steven.

## Gotchas that have bitten before

- **Local servers orphan.** Always run prod servers on a guaranteed-free
  port (see `scripts/lighthouse.mjs` `freePort()`); stale `next start`
  processes serving old builds produce phantom 500s and fake audit
  failures. Kill squatters with `lsof -ti :<port>` before trusting results.
- **Lighthouse needs a fresh browser per target** — reusing one profile
  produced phantom 96s. Floors: perf 85, a11y 95, best-practices 90, seo 90.
- **ESLint `react-hooks/purity` + `set-state-in-effect`.** No impure calls
  during render (not even in handlers it cannot see); no sync setState in
  effects. Reset derived state in event handlers, focus via rAF in effects.
- **Driving range inputs in Playwright:** assign through the native
  prototype setter, then dispatch bubbling `input`+`change` (see
  `e2e/labs.spec.ts` `setRange`). Direct `.value =` is swallowed by React.
- **tsx + CJS:** this package has no `"type": "module"`, so `.ts`
  scripts cannot use top-level await — wrap in `main()`.
- **TS precedence:** `(Omit<T, K> & { x })[]` needs the parens; without
  them `[]` binds to `{ x }`.
- **Quiz answers ship in static HTML** (inside `<details>`/islands). The
  rule is *visually hidden until revealed*, not absent from markup.
- **Playwright browsers:** `pnpm exec playwright install --only-shell
  chromium`; specs boot prod via `webServer` in `playwright.config.ts`.

## Conventions

- One commit per unit of work, descriptive messages (`git log` shows the
  pattern). Working tree stays clean; push only when asked.
- Lab math changes require unit tests; content/registry changes require
  `pnpm validate`; user flows require e2e coverage.
- Prose revisions come from Steven reading the course — specific
  chapter + quote + complaint, revised together. Never bulk-rewrite voice.
- `docs/ROADMAP.md` is parked-not-promised; promote by building, not by
  expanding the list.

