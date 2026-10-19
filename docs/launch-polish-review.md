# Launch polish review — October 18, 2026

This pass adds a complete practice supplement to every chapter and makes
the study path easier to enter, navigate, and revisit. Changes are left
uncommitted for review.

## What to preview

Run `pnpm dev` and visit:

- `/` — audience, entry points, next unfinished chapter, and practice to revisit
- `/about` — prerequisites, learning method, sequence, time budgets,
  progress portability, and update policy
- `/system-design` or `/llm-engineering` — phase groups, phase navigation,
  progress, and practice time
- `/system-design/04-caching-and-performance` — worked calculation, prediction
  gate, lab, assignment, rubric, recall, and chapter practice logging
- `/llm-engineering/04-inference-and-serving` — explicit KV-memory example and
  a capacity assignment
- `/opengraph-image` and an invalid chapter URL — social preview and recovery page

Use a narrow viewport to review the touch menu, header search, and chapter
section disclosure. Log a chapter at 1–2/4 and return home to see it in the
review queue. A stronger rating schedules recall after 48 hours.

## Curriculum and structure

- All 36 chapters have a worked example, explicit assumptions, a design
  decision and limitation, a deliverable, three tasks, two constraint
  variations, a rubric, two written recall prompts, and primary references.
- The 56h/73h totals remain suggested independent practice budgets. Each
  chapter supplies four minute blocks summing to its total; reading is the
  first block, followed by assignments, repeated drills, and recall.
- Existing lesson prose and permanent chapter URLs are preserved. Selected
  quiz distractors now address plausible misconceptions without changing
  answer indices, so saved quiz attempts remain compatible.
- Internal planned-lab briefs stay in the source. Public pages show live
  labs and usable assignments. Labs appear before assessment.
- Practice scores use the existing v1 `drillAttempts` shape with a chapter
  key. Export/import includes them without a schema change. Draft predictions
  and unsubmitted recall answers last only for the current page.

The new material lives in `content/study-guides/`; schema and validation
rules live in `content/types.ts` and `scripts/validate-content.ts`.
`lib/study.ts` handles continuity and chapter review. Search matching is
isolated in `lib/search-matching.ts` so browser code does not import the
expanded curriculum through the index builder.

## Verification

- ESLint and content validation passed.
- All 35 unit tests passed.
- Production build passed with `pnpm build --webpack`; all routes remain static.
- All 74 Playwright tests passed against that production build, including
  every content route, all live labs, storage export/import, recall and review,
  prediction gates, and touch layouts at 320px, 375px, and 768px.
- All 29 unique reference URLs returned HTTP 200.
- Lighthouse scored 99 performance and 100 accessibility, best practices,
  and SEO on the home page, a chapter, and a lab page.
- Desktop, touch-layout, and social-preview screenshots were visually reviewed.
- Built JavaScript chunks contain no complete worked-example text; labs
  remain in separate chunks.

The default Turbopack build encounters a managed-environment denial when
its PostCSS worker binds an IPC port. The webpack build and browser checks
are verified; the default build script remains unchanged. This distinction
is also documented in the README and session guide.

A physical-phone pass and a paper printout remain manual items in
`docs/ROADMAP.md`. Browser touch emulation does not replace those checks.
