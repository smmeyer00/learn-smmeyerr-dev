# Content authoring guide

Course content lives in this folder as structured TypeScript, not MDX. The
chapter pages (`app/[course]/[chapter]/page.tsx`) are block renderers over
this data, so content edits never require component edits.

## Files

- `types.ts` — the `Course` and `Chapter` schema (source of truth)
- `system-design.ts` — 15 chapters
- `llm-engineering.ts` — 21 chapters
- `lessons/` — the teaching sections: summaries, causal explanations, traces,
  calculations, and limitations for all 36 chapters
- `study-guides/` — per-chapter examples, assignments, budgets, rubrics, and recall
- `practice/` — checkable sample assignment artifacts and cumulative project stages
- `references.ts` — selected primary references and their review months
- `guided-exercises/` — the two guided pilots: fixed briefs, worksheets,
  reference reasoning, calculation checks, anchored rubrics, and remediation
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
| `lessons` | 3+ teaching sections, each with a summary and at least two explanatory paragraphs; keep mechanisms and examples substantive rather than padding to a word count |
| `studyGuide` | Required supplement: four time blocks, worked example, assignment and variations, rubric, recall questions, primary sources |
| `seniorSignal` | How a senior engineer phrases the topic; rendered as an accent callout |
| `pitfalls` | Common failure patterns / weak answers |
| `drill` | Timed practice prompt + `constraints` chips + hidden `approach` (in `<details>`) |
| `quiz` | 2+ questions, exactly 4 options each, `answer` is the zero-based correct index, `explanation` explains why the answer is right |
| `labs` | Internal interaction briefs retained from the handoff; public pages show live labs from the registry |
| `references` | Optional external links; keep provider-specific docs update-sensitive |
| `studyGuide.sampleSolution` | Assumptions, a concrete reference artifact, reasoning, ≥3 checks, and a tempting mistake with its correction; revealed after an attempt |
| `studyGuide.cumulativePractice` | A new stage of the course project, a closed-book prompt, comparison reasoning, and links to earlier chapter orders |
| `Course.practiceProject` | The shared project brief and starting workload; later stages explicitly add constraints |

## Invariants (validated)

The build assumes and content review must enforce:

- Unique slugs within a course; contiguous `order`
- Non-empty `outcome`, `why`, `mentalModel.flow`, `drill.prompt`, `drill.approach`
- ≥ 3 lessons, ≥ 2 quiz questions, exactly 4 options each, valid answer index
- Each lesson has ≥ 3 non-empty paragraphs. This is a completeness floor,
  not proof of instructional quality; review the causal explanation and examples.
- ≥ 4 coverage entries, ≥ 1 lab entry
- Required worked example with a scenario, ≥ 3 reasoning steps, decision,
  and limitation; make fabricated values explicit
- Assignment with a deliverable, ≥ 3 tasks, ≥ 2 constraint variations, and
  ≥ 3 observable rubric criteria
- ≥ 2 recall prompts with sample reasoning in addition to the quizzes
- A sample assignment artifact with assumptions, explanation, ≥3 concrete
  checks, and a misconception; no empty fields
- A cumulative project stage with a deliverable, prompt, sample reasoning,
  and unique backward links to existing chapters (chapter 1 seeds the project)
- Four positive integer time blocks (read/example, assignment/variations,
  drill/repeats, recall/review), summing to `hours × 60`
- ≥ 1 primary source per chapter; HTTPS URLs and `YYYY-MM` reference dates
- Every chapter phase appears in `phaseOrder`, with no empty/repeated phases

(Validation lives in `scripts/validate-content.ts`, run via `pnpm validate` in CI.)

## Adding or revising a chapter

1. Edit the course metadata, teaching in `lessons/`, study guide, and
   reference/cumulative practice in `practice/` as appropriate. Keep the
   numbered chapter keys aligned with the permanent chapter order.
2. `pnpm validate`, then `pnpm build`.
3. Review `/[course]/[chapter-slug]`, including its section links, assignment,
   recall reveal, and references.

Renaming a `slug` changes the canonical URL; avoid it unless the old URL was
never published.

## Content policy

Guided exercises use `guided-exercises/types.ts`. Each must have explicit
fictional givens, preparation links, a deliverable, hints, reference
reasoning, numeric expectations, a weak answer with repair, and
criterion-specific next practice. Numeric checks validate supplied values;
prose is self-assessed against descriptions with written evidence. Do not
label completion as independent grading or certification. The validator
checks field/rubric IDs and chapter links. Keep one pilot per course until
Steven reviews the full learning loop. Stable exercise IDs and content
versions preserve drafts and history; version changes need an explicit
migration policy in `lib/guided-practice.ts`.

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
- **Cumulative work:** Relay and Harbor evolve one document through their
  respective tracks. Each stage retrieves specific earlier concepts and adds
  a concrete artifact. Use part of the existing assignment/review time, rather
  than silently increasing the total workload. Learners entering mid-course
  can reconstruct prerequisites using the linked earlier chapters.
- **Reference artifacts:** include actual numbers, schemas, traces, or draft
  decisions a learner can inspect. Explain assumptions and valid alternatives;
  an open-ended design does not have one canonical topology. Keep the sample
  and cumulative comparison behind native disclosures until requested.
- **Reveals:** approaches, quiz feedback, lab outputs, and recall samples
  stay visually hidden until the corresponding learner action. Answer data
  can appear in serialized page props; this is a teaching boundary.
- **Voice:** second person, plain declarative sentences, no emoji, no
  hype. Match the tone of existing chapters.
