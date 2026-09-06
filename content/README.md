# Content authoring guide

Course content lives in this folder as structured TypeScript, not MDX. The
chapter pages (`app/[course]/[chapter]/page.tsx`) are block renderers over
this data, so content edits never require component edits.

## Files

- `types.ts` — the `Course` and `Chapter` schema (source of truth)
- `system-design.ts` — 15 chapters
- `llm-engineering.ts` — 21 chapters
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
| `lessons` | 3+ teaching sections: paragraphs + optional mono bullets |
| `seniorSignal` | How a senior engineer phrases the topic; rendered as an accent callout |
| `pitfalls` | Common failure patterns / weak answers; rendered with ✗ markers |
| `drill` | Timed practice prompt + `constraints` chips + hidden `approach` (in `<details>`) |
| `quiz` | 2+ questions, exactly 4 options each, `answer` is the zero-based correct index, `explanation` explains why the answer is right |
| `labs` | Planned interactive labs, rendered as a placeholder checklist until built |
| `references` | Optional external links; keep provider-specific docs update-sensitive |

## Invariants (validated)

The build assumes and content review must enforce:

- Unique slugs within a course; contiguous `order`
- Non-empty `outcome`, `why`, `mentalModel.flow`, `drill.prompt`, `drill.approach`
- ≥ 3 lessons, ≥ 2 quiz questions, exactly 4 options each, valid answer index
- ≥ 4 coverage entries, ≥ 1 lab entry

(TODO.md item 6 tracks turning the ad-hoc validation script into CI.)

## Adding or revising a chapter

1. Edit the course file (`system-design.ts` / `llm-engineering.ts`) following
   the schema above.
2. `pnpm build` — static generation will fail loudly on structural problems.
3. Review the rendered page at `/[course]/[chapter-slug]`.

Renaming a `slug` changes the canonical URL; avoid it unless the old URL was
never published.

## Content policy

- **Provenance:** the transcript is ported from
  `docs/system-design-llm-course-build-handoff.md`, which remains canonical
  for curriculum intent. A few garbled fragments in the source were
  normalized without changing meaning. Expansion is welcome; silent deletion
  or flattening of drills, answers, or coverage is not.
- **Update-sensitive facts:** model names, prices, context limits, rate
  limits, and provider capabilities change. Do not hard-code them as timeless
  facts — link current official documentation under `references` and prefer
  durable concepts in prose (see llm-engineering ch. 18 for the pattern).
- **Reveals:** drill approaches and quiz answers are pedagogical reveals.
  They must stay inside `<details>` and never be distinguishable in the
  static HTML before the learner opens them.
- **Voice:** second person, plain declarative sentences, no emoji, no
  hype. Match the tone of existing chapters.
