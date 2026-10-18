/**
 * Build-time content validation (CI). Formalizes the ad-hoc checks used
 * during the content port: every invariant the renderers assume is asserted
 * here so no chapter silently loses quiz/drill/answer metadata.
 *
 * Run: pnpm validate
 */
import { courses, getChapterReferences } from "../content/index";
import { labsForChapter } from "../components/labs/registry";
import { drillScenarios, constraintDecks } from "../content/drills";
import { fieldManual } from "../content/field-manual";
import { glossary } from "../content/glossary";
import { buildSearchIndex } from "../lib/search";

let failures = 0;

function check(cond: boolean, message: string): void {
  if (!cond) {
    failures++;
    console.error(`  ✗ ${message}`);
  }
}

console.log("validating courses…");
check(courses.length === 2, `expected 2 courses, got ${courses.length}`);

const courseSlugs = new Set<string>();
for (const course of courses) {
  check(!courseSlugs.has(course.slug), `duplicate course slug ${course.slug}`);
  courseSlugs.add(course.slug);
  check(course.chapters.length > 0, `${course.slug}: no chapters`);

  const slugs = new Set<string>();
  let hours = 0;
  course.chapters.forEach((chapter, i) => {
    const where = `${course.slug}/${chapter.slug}`;
    check(!slugs.has(chapter.slug), `${where}: duplicate slug`);
    slugs.add(chapter.slug);
    check(
      chapter.order === i + 1,
      `${where}: order ${chapter.order} !== position ${i + 1}`,
    );
    check(chapter.title.length > 0, `${where}: empty title`);
    check(chapter.outcome.length > 0, `${where}: empty outcome`);
    check(chapter.why.length > 0, `${where}: empty why`);
    check(
      chapter.lessons.length >= 3,
      `${where}: ${chapter.lessons.length} lessons (< 3)`,
    );
    for (const lesson of chapter.lessons) {
      check(lesson.title.length > 0, `${where}: lesson with empty title`);
      check(
        lesson.paragraphs.length > 0,
        `${where}: lesson "${lesson.title}" has no paragraphs`,
      );
    }
    check(
      chapter.coverage.length >= 4,
      `${where}: ${chapter.coverage.length} coverage entries (< 4)`,
    );
    check(
      chapter.mentalModel.statement.length > 0,
      `${where}: empty mental-model statement`,
    );
    check(
      chapter.mentalModel.flow.length === 4,
      `${where}: flow has ${chapter.mentalModel.flow.length} steps (!== 4)`,
    );
    check(
      chapter.drill.prompt.length > 0 && chapter.drill.approach.length > 0,
      `${where}: drill prompt/approach incomplete`,
    );
    check(
      chapter.quiz.length >= 2,
      `${where}: ${chapter.quiz.length} quiz questions (< 2)`,
    );
    chapter.quiz.forEach((q, qi) => {
      check(
        q.options.length === 4,
        `${where} q${qi}: ${q.options.length} options (!== 4)`,
      );
      check(
        Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4,
        `${where} q${qi}: answer index ${q.answer} invalid`,
      );
      check(q.explanation.length > 0, `${where} q${qi}: empty explanation`);
    });
    check(chapter.labs.length >= 1, `${where}: no planned labs listed`);
    const guide = chapter.studyGuide;
    check(!!guide, `${where}: missing study guide`);
    if (guide) {
      check(
        guide.minutes.length === 4 &&
          guide.minutes.every(
            (minutes) => Number.isInteger(minutes) && minutes > 0,
          ),
        `${where}: invalid practice budget blocks`,
      );
      check(
        guide.minutes.reduce((sum, minutes) => sum + minutes, 0) ===
          chapter.hours * 60,
        `${where}: study budget does not match chapter hours`,
      );
      check(
        guide.example.title.length > 0 &&
          guide.example.scenario.length > 0 &&
          guide.example.steps.length >= 3 &&
          guide.example.steps.every((step) => step.trim().length > 0) &&
          guide.example.decision.length > 0 &&
          guide.example.limitation.length > 0,
        `${where}: incomplete worked example`,
      );
      check(
        guide.assignment.deliverable.length > 0 &&
          guide.assignment.tasks.length >= 3 &&
          guide.assignment.variations.length >= 2 &&
          guide.assignment.rubric.length >= 3,
        `${where}: incomplete assignment or rubric`,
      );
      check(
        [
          ...guide.assignment.tasks,
          ...guide.assignment.variations,
          ...guide.assignment.rubric,
        ].every((text) => text.trim().length > 0),
        `${where}: empty assignment item`,
      );
      check(
        guide.recall.length >= 2 &&
          guide.recall.every(
            (question) =>
              question.prompt.length > 0 && question.sampleAnswer.length > 0,
          ),
        `${where}: incomplete recall checks`,
      );
      check(guide.references.length > 0, `${where}: missing primary sources`);
    }
    for (const ref of guide
      ? getChapterReferences(chapter)
      : (chapter.references ?? [])) {
      check(
        ref.href.startsWith("https://"),
        `${where}: non-https reference ${ref.href}`,
      );
      check(
        !!ref.lastReviewed && /^\d{4}-(0[1-9]|1[0-2])$/.test(ref.lastReviewed),
        `${where}: missing or invalid reference review month`,
      );
    }
    hours += chapter.hours;
  });

  for (const chapter of course.chapters) {
    for (const lab of labsForChapter(course.slug, chapter.slug)) {
      check(
        lab.replacesPlanned.every(
          (idx) =>
            Number.isInteger(idx) && idx >= 0 && idx < chapter.labs.length,
        ),
        `${course.slug}/${chapter.slug}: lab ${lab.id} replacesPlanned out of range`,
      );
    }
  }

  check(
    new Set(course.phaseOrder).size === course.phaseOrder.length,
    `${course.slug}: repeated phase`,
  );
  check(
    course.chapters.every((chapter) =>
      course.phaseOrder.includes(chapter.phase),
    ),
    `${course.slug}: chapter phase missing from phaseOrder`,
  );
  check(
    course.phaseOrder.every((phase) =>
      course.chapters.some((chapter) => chapter.phase === phase),
    ),
    `${course.slug}: empty phase`,
  );

  const scopeMatch = course.scope.match(/~\s*(\d+)\s*hours?/);
  check(
    scopeMatch !== null && Number(scopeMatch[1]) === hours,
    `${course.slug}: scope "${course.scope}" disagrees with summed hours (${hours}h)`,
  );
  console.log(
    `  ${course.slug}: ${course.chapters.length} chapters, ${hours}h`,
  );
}

console.log("validating drills…");
check(
  drillScenarios.length === 20,
  `expected 20 scenarios, got ${drillScenarios.length}`,
);
const drillIds = new Set(drillScenarios.map((s) => s.id));
check(drillIds.size === drillScenarios.length, "duplicate drill scenario ids");
check(
  constraintDecks.length === 7,
  `expected 7 decks, got ${constraintDecks.length}`,
);
for (const deck of constraintDecks) {
  check(
    deck.cards.length >= 5,
    `deck ${deck.id}: only ${deck.cards.length} cards`,
  );
}

console.log("validating glossary + manual…");
check(glossary.length >= 40, `glossary has ${glossary.length} terms (< 40)`);
const chapterKeys = new Set(
  courses.flatMap((c) => c.chapters.map((ch) => `${c.slug}/${ch.slug}`)),
);
for (const term of glossary) {
  check(
    term.definition.length > 20,
    `glossary "${term.term}": definition too short`,
  );
  for (const key of term.related ?? []) {
    check(
      chapterKeys.has(key),
      `glossary "${term.term}": unknown chapter ${key}`,
    );
  }
}
check(
  fieldManual.length === 5,
  `field manual has ${fieldManual.length} sections (!== 5)`,
);

console.log("validating search index…");
const index = buildSearchIndex();
check(
  index.length > 100,
  `search index has ${index.length} entries (expected > 100)`,
);
check(
  index.every((e) => e.title.length > 0 && e.href.startsWith("/")),
  "search index has entries with empty titles or bad hrefs",
);

if (failures > 0) {
  console.error(`\n${failures} content problem(s) found.`);
  process.exit(1);
}
console.log("\ncontent validation passed ✓");
