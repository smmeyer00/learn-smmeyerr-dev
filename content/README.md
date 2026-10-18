# Content authoring guide

Course content lives in this folder as structured TypeScript, not MDX. The
chapter pages (`app/[course]/[chapter]/page.tsx`) are block renderers over
this data, so content edits never require component edits.

## Files

- `types.ts` — the `Course` and `Chapter` schema (source of truth)
- `system-design.ts` — 15 chapters
- `llm-engineering.ts` — 21 chapters
- `study-guides/` — per-chapter examples, assignments, budgets, rubrics, and recall
- `references.ts` — selected primary references and their review months
- `index.ts` — registry; `getCourse(slug)`, `getChapter(courseSlug, chapterSlug)`

## Chapter schema, field by field

| Field | Purpose |
| --- | --- |
| `slug` | URL segment, zero-padded order prefix, e.g. `07-agents`. Slugs are permanent — they are the canonical URL |
| `order` | Sort order within the course (drives prev/next nav) |
| `phase` | Study phase; must read naturally in lowercase (rendered that way) |
| `hours` | Estimated study time; course totals are derived from this |
| `depth` | `core \| deep \| studio \| capstone \| current \| fluency \| patterns` |
| `outcome` | One sentence: what the learner can do afterward. Doubles as the meta description |
| `why` | Interview + production motivation, 1–3 sentences |
| `coverage` | The coverage contract — subtopics this chapter must teach. Minimum 4 |
| `mentalModel` | One-sentence statement + `flow` of 4 labeled steps (rendered as a diagram) |
| `lessons` | 3+ teaching sections: paragraphs + optional bullets |
| `studyGuide` | Required supplement: four time blocks, worked example, assignment and variations, rubric, recall questions, primary sources |
| `seniorSignal` | How a senior engineer phrases the topic; rendered as an accent callout |
| `pitfalls` | Common failure patterns / weak answers |
| `drill` | Timed practice prompt + `constraints` chips + hidden `approach` (in `<details>`) |
| `quiz` | 2+ questions, exactly 4 options each, `answer` is the zero-based correct index, `explanation` explains why the answer is right |
| `labs` | Internal interaction briefs retained from the handoff; public pages show live labs from the registry |
| `references` | Optional external links; keep provider-specific docs update-sensitive |

## Invariants (validated)

The build assumes and content review must enforce:

- Unique slugs within a course; contiguous `order`
- Non-empty `outcome`, `why`, `mentalModel.flow`, `drill.prompt`, `drill.approach`
- ≥ 3 lessons, ≥ 2 quiz questions, exactly 4 options each, valid answer index
- ≥ 4 coverage entries, ≥ 1 lab entry
- Required worked example with a scenario, ≥ 3 reasoning steps, decision,
  and limitation; make fabricated values explicit
- Assignment with a deliverable, ≥ 3 tasks, ≥ 2 constraint variations, and
  ≥ 3 observable rubric criteria
- ≥ 2 recall prompts with sample reasoning in addition to the quizzes
- Four positive integer time blocks (read/example, assignment/variations,
  drill/repeats, recall/review), summing to `hours × 60`
- ≥ 1 primary source per chapter; HTTPS URLs and `YYYY-MM` reference dates
- Every chapter phase appears in `phaseOrder`, with no empty/repeated phases

(Validation lives in `scripts/validate-content.ts`, run via `pnpm validate` in CI.)

## Adding or revising a chapter

1. Edit the course file and its attached study guide following the schema above.
2. `pnpm validate`, then `pnpm build`.
3. Review `/[course]/[chapter-slug]`, including its section links, assignment,
   recall reveal, and references.

Renaming a `slug` changes the canonical URL; avoid it unless the old URL was
never published.

## Content policy

- **Provenance:** the transcript is ported from
  `docs/system-design-llm-course-build-handoff.md`, which remains canonical
  for curriculum intent. A few garbled fragments in the source were
  normalized without changing meaning. Known wart: the handoff's scope lines
  (`~46h` / `~39h`) disagree with its own per-chapter estimates, which sum to
  56h / 73h — the port follows the per-chapter numbers and `pnpm validate`
  asserts `scope` matches the sum. Expansion is welcome; silent deletion
  or flattening of drills, answers, or coverage is not.
- **Update-sensitive facts:** model names, prices, context limits, rate
  limits, and provider capabilities change. Do not hard-code them as timeless
  facts — link current official documentation under `references` and prefer
  durable concepts in prose (see llm-engineering ch. 18 for the pattern).
- **Study hours:** these are suggested independent practice budgets,
  including drawing, assignment variations, and repeated drills. Make the
  work explicit; do not present the figures as reading time or a deadline.
- **Reveals:** approaches, quiz feedback, lab outputs, and recall samples
  stay visually hidden until the corresponding learner action. Answer data
  can appear in serialized page props; this is a teaching boundary.
- **Voice:** second person, plain declarative sentences, no emoji, no
  hype. Match the tone of existing chapters.
