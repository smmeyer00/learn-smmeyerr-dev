# TODO

Remaining work for learn.smmeyer.dev. The canonical product spec, interaction
briefs, and build plan live in
[`docs/system-design-llm-course-build-handoff.md`](./docs/system-design-llm-course-build-handoff.md)
(sections 3, 6, 7, 8, 9). This file tracks what is **not built yet**.

Already done: content engine, all 36 chapters ported and rendering, course +
chapter routes, index page, design tokens.

## 1. Local progress (next up — highest user value)

No backend, no accounts. Everything in versioned `localStorage`.

- [x] Progress store with schema versioning + migration logic
      (`ProgressStateV1` in handoff §8; `lib/progress.ts` — note the handoff
      references `QuizAttempt`/`DrillAttempt` without defining them, minimal
      shapes defined there)
- [x] Mark-complete control on chapter pages; completion state on course index
      (`components/progress/mark-complete.tsx`, `chapter-status.tsx`,
      `course-summary.tsx`)
- [x] Last-visited location; "continue where you left off" on the course index
      (`track-visit.tsx`, `continue-banner.tsx`)
- [x] Quiz attempt state (per-chapter, local)
      (`components/progress/quiz.tsx` — interactive checks, attempts kept
      in `quizAttempts`)
- [x] Bookmarks and personal notes per chapter
      (`bookmark-button.tsx`, `chapter-notes.tsx` with debounced save,
      `bookmarks-list.tsx` on the index)
- [x] Export/import progress as a small JSON file + reset control
      (`components/progress/data-controls.tsx`)
- [x] Update the index page footer once this ships (currently says
      `planned: progress → localStorage`)

## 2. Interactive labs

Each chapter lists its planned labs under "labs (planned)" in the lesson
surface (checkbox items `□`). Labs follow the
**predict → manipulate → observe → explain → transfer** pattern and should
replace the placeholder block as they ship. Keep each lab a code-split client
component; the chapter page must remain server-rendered.

Priority order (handoff milestone 3):

1. [ ] Scale Dial / source-load calculator (system-design ch. 1)
2. [ ] Cache Stampede (ch. 4)
3. [ ] Network Partition + Lease/Fencing (ch. 6)
4. [ ] GPU utilization vs p99 + token-shaped capacity (ch. 11, 17)
5. [ ] Next-Token Playground (llm ch. 1)
6. [ ] Attention Head Explorer (llm ch. 2)
7. [ ] Prefill/Decode + KV Cache calculator (llm ch. 4)
8. [ ] Tool Lifecycle + Agent Loop Console (llm ch. 6, 7)
9. [ ] RAG Pipeline Explorer (llm ch. 8)
10. [ ] Eval Workbench + Judge Calibration (llm ch. 11)

Lab rules (handoff §5): diagrams explain causality/topology/timing/tradeoffs;
every visual needs a caption, learner task, and takeaway; label pedagogical
values as illustrative; text alternatives for everything; never rely on color
alone; respect `prefers-reduced-motion`.

## 3. Interview mode

- [ ] Drill deck: the 20 scenarios from handoff §7 with randomizable
      constraint cards (scale, traffic shape, SLO, failure, security, residency,
      cost) and reproducible seeds
- [ ] Timed mock workspace (50-minute guided flow) + self-scorecard
      (framing/correctness/depth/tradeoffs/recovery, 1–4)
- [ ] 48-hour redo queue for weak drills
- [ ] Oral fluency timers (llm ch. 21 circuit)

## 4. Field manual

- [ ] `/field-manual` page: scale formulas, availability budgets, AI-system
      metrics, 50-minute checklist, FACT frame (content is ready in handoff §7)
- [ ] Print/PDF-friendly layout (also print-clean chapter pages)

## 5. Search & navigation

- [ ] Command/search palette across chapter titles, concepts, drills, glossary
- [ ] Precompute the search index at build time (Pagefind or Fuse.js)
- [ ] Glossary content file

## 6. Quality & deployment

- [ ] Automated content validation in CI (the ad-hoc script used during the
      content port: unique slugs, ≥3 lessons, ≥2 quiz questions with valid
      answer indices, complete drills — formalize it)
- [ ] Playwright coverage for highest-value flows; unit tests for any
      calculation/formula code
- [ ] Accessibility pass: keyboard paths, focus states, text alternatives
- [ ] Mobile review of chapter pages (currently desktop-first)
- [ ] Deploy: static build behind `learn.smmeyer.dev`; confirm `metadataBase`
      and canonicals once the domain is live
- [ ] Add equivalent non-OpenAI provider references where useful (llm ch. 11,
      18 are OpenAI-only right now); keep provider facts update-sensitive with
      last-reviewed dates

## Deliberately out of scope (v1)

Auth, payments, cloud persistence, public user content, ML-research math,
marketing landing page. See handoff §1 non-goals.
