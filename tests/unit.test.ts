import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  defaultProgress,
  migrateProgress,
  chapterKey,
  isChapterComplete,
  hasProgressData,
  importProgressJson,
} from "../lib/progress";
import { searchEntries, buildSearchIndex } from "../lib/search";
import { drawScenario, prng } from "../content/drills";
import { guidedExercises } from "../content/guided-exercises";
import {
  newGuidedDraft, canCompare, canRevise, makeGuidedAttempt, calculationChecks,
  exerciseFeedback, guidedReviewState, GUIDED_REVIEW_DELAY_MS,
  readExerciseNumber, migrateGuidedExercises, validGuidedImport,
} from "../lib/guided-practice";
import {
  chapterReviewQueue,
  nextIncompleteChapter,
  CHAPTER_REVIEW_DELAY_MS,
  type StudyChapter,
} from "../lib/study";

describe("progress migration", () => {
  it("returns defaults for null/garbage", () => {
    const p = migrateProgress(null);
    assert.equal(p.schemaVersion, 1);
    assert.deepEqual(p.completedChapters, []);
    assert.equal(p.lastVisited, undefined);
  });

  it("keeps valid fields, drops invalid entries", () => {
    const p = migrateProgress({
      schemaVersion: 99,
      completedChapters: ["system-design/01-x", 42],
      bookmarks: ["a"],
      notes: { a: "hi", b: 7 },
      quizAttempts: {
        k: [
          {
            chapterKey: "k",
            questionIndex: 0,
            selectedIndex: 1,
            correct: true,
            attemptedAt: "t",
          },
          { junk: true },
        ],
      },
      lastVisited: "system-design/01-x",
    });
    assert.deepEqual(p.completedChapters, ["system-design/01-x"]);
    assert.deepEqual(p.bookmarks, ["a"]);
    assert.deepEqual(p.notes, { a: "hi" });
    assert.equal(p.quizAttempts["k"].length, 1);
    assert.equal(p.lastVisited, "system-design/01-x");
  });

  it("chapter keys round-trip through completion checks", () => {
    const key = chapterKey("llm-engineering", "01-mental-model-of-modern-llms");
    assert.equal(key, "llm-engineering/01-mental-model-of-modern-llms");
    const state = {
      ...defaultProgress(),
      completedChapters: [key],
    };
    assert.equal(isChapterComplete(state, key), true);
    assert.equal(isChapterComplete(state, "other/x"), false);
  });
});

describe("search", () => {
  const index = buildSearchIndex();

  it("finds chapters by concept, not just title", () => {
    const hits = searchEntries("quorum", index);
    assert.ok(hits.length > 0, "expected quorum hits");
    assert.ok(hits.every((h) => h.href.startsWith("/")));
  });

  it("finds glossary terms", () => {
    const hits = searchEntries("thundering herd", index);
    assert.ok(hits.some((h) => h.kind === "glossary"));
  });

  it("finds drills and manual sections", () => {
    assert.ok(
      searchEntries("url shortener", index).some((h) => h.kind === "drill"),
    );
    assert.ok(searchEntries("FACT", index).some((h) => h.kind === "manual"));
  });

  it("returns nothing for empty queries, ranks title matches first", () => {
    assert.deepEqual(searchEntries("   ", index), []);
    const hits = searchEntries("evaluation", index);
    assert.ok(hits.length > 0);
    assert.equal(hits[0].title, "Evaluation");
  });
});

describe("drill draws", () => {
  it("is reproducible per seed", () => {
    const a = drawScenario(12345);
    const b = drawScenario(12345);
    assert.deepEqual(a, b);
    assert.equal(a.cards.length, 7);
  });

  it("varies across seeds", () => {
    const titles = new Set(
      Array.from({ length: 20 }, (_, i) => drawScenario(i).scenario.id),
    );
    assert.ok(titles.size > 5, "draws should vary");
  });

  it("prng stays in [0, 1)", () => {
    const rand = prng(7);
    for (let i = 0; i < 1000; i++) {
      const v = rand();
      assert.ok(v >= 0 && v < 1);
    }
  });
});

describe("guided practice", () => {
  const exercise = guidedExercises[0];
  function filledDraft() {
    const draft = newGuidedDraft(1);
    draft.stage = "attempt";
    draft.answers = Object.fromEntries(exercise.fields.map((field) =>
      [field.id, field.check ? String(field.check.expected) : "My attempted reasoning."]));
    return draft;
  }
  function assessedDraft() {
    const draft = filledDraft();
    draft.firstAttempt = { ...draft.answers };
    draft.stage = "revise";
    draft.ratings = Object.fromEntries(exercise.rubric.map((criterion) => [criterion.id, "meets" as const]));
    draft.evidence = Object.fromEntries(exercise.rubric.map((criterion) => [criterion.id, "Specific evidence in my first attempt."]));
    draft.revision = "I added a finite wait and explicit overload response.";
    return draft;
  }

  it("requires an attempt for each field and evidence for each self-assessment", () => {
    const draft = newGuidedDraft(1);
    assert.equal(canCompare(exercise, draft), false);
    draft.answers = filledDraft().answers;
    assert.equal(canCompare(exercise, draft), true);
    draft.answers.timeline = "   ";
    assert.equal(canCompare(exercise, draft), false);
    const assessed = assessedDraft();
    assert.equal(canRevise(exercise, assessed), true);
    assessed.evidence.freshness = "";
    assert.equal(canRevise(exercise, assessed), false);
    assert.equal(makeGuidedAttempt(exercise, assessed, "2026-10-18T12:00:00Z"), null);
  });

  it("checks known arithmetic and refuses partial numeric parses", () => {
    assert.equal(readExerciseNumber("10,000"), 10000);
    assert.equal(readExerciseNumber(" 500.00 "), 500);
    for (const invalid of ["", "500 RPS", "5,00", "Infinity", "not sure"]) {
      assert.equal(readExerciseNumber(invalid), null);
    }
    const draft = filledDraft();
    assert.ok(calculationChecks(exercise, draft).every((check) => check.correct));
    draft.answers["expiry-arrivals"] = "6000";
    assert.equal(calculationChecks(exercise, draft).find((check) => check.id === "expiry-arrivals")?.correct, false);
  });

  it("does not let a high self-rating hide failed arithmetic or mutate the first attempt", () => {
    const draft = assessedDraft();
    draft.firstAttempt!["normal-source"] = "50";
    draft.answers["normal-source"] = "500";
    assert.equal(exerciseFeedback(exercise, draft).gaps[0].id, "load");
    const attempt = makeGuidedAttempt(exercise, draft, "2026-10-18T12:00:00Z")!;
    assert.equal(attempt.needsPractice, true);
    assert.equal(attempt.firstAttempt!["normal-source"], "50");
    assert.equal(attempt.revision, draft.revision);
  });

  it("keeps weak practice immediate and schedules a successful review at exactly 48 hours", () => {
    const date = "2026-10-18T12:00:00Z";
    const now = Date.parse(date);
    const attempt = makeGuidedAttempt(exercise, assessedDraft(), date)!;
    const state = { draft: attempt, attempts: [attempt] };
    assert.equal(guidedReviewState(exercise, { draft: newGuidedDraft(1), attempts: [] }, now), "new");
    assert.equal(guidedReviewState(exercise, state, now + GUIDED_REVIEW_DELAY_MS - 1), "fresh");
    assert.equal(guidedReviewState(exercise, state, now + GUIDED_REVIEW_DELAY_MS), "due");
    state.attempts[0] = { ...attempt, needsPractice: true };
    assert.equal(guidedReviewState(exercise, state, now), "weak");
  });

  it("migrates old progress and rejects malformed/future guided work at import", () => {
    const old = migrateProgress({ schemaVersion: 1, completedChapters: ["systems/one"] });
    assert.deepEqual(old.guidedExercises, {});
    assert.deepEqual(old.completedChapters, ["systems/one"]);
    const draft = filledDraft();
    const raw = { "cache-expiry": { draft, attempts: [] } };
    assert.equal(validGuidedImport(raw), true);
    assert.deepEqual(migrateGuidedExercises(raw)["cache-expiry"].draft.answers, draft.answers);
    assert.equal(validGuidedImport({ "cache-expiry": { draft: { ...draft, version: 2 }, attempts: [] } }), false);
    assert.equal(validGuidedImport({ "cache-expiry": { draft: { ...draft, answers: [] }, attempts: [] } }), false);
    assert.deepEqual(migrateGuidedExercises({ bad: { draft: null } }), {});
    const attempt = makeGuidedAttempt(exercise, assessedDraft(), "2026-10-18T12:00:00Z")!;
    const state = { ...defaultProgress(), guidedExercises: { "cache-expiry": { draft: attempt, attempts: [attempt] } } };
    assert.equal(hasProgressData(state), true);
    assert.deepEqual(migrateProgress(JSON.parse(JSON.stringify(state))).guidedExercises, state.guidedExercises);
    assert.equal(importProgressJson(JSON.stringify({ ...state, guidedExercises: { "cache-expiry": { draft: { version: 2 } } } })).ok, false);
  });
});

describe("study continuity and review", () => {
  const chapters: StudyChapter[] = [
    {
      key: "systems/one",
      courseSlug: "systems",
      courseTitle: "Systems",
      chapterTitle: "One",
    },
    {
      key: "systems/two",
      courseSlug: "systems",
      courseTitle: "Systems",
      chapterTitle: "Two",
    },
    {
      key: "systems/three",
      courseSlug: "systems",
      courseTitle: "Systems",
      chapterTitle: "Three",
    },
    {
      key: "llm/one",
      courseSlug: "llm",
      courseTitle: "LLM",
      chapterTitle: "Other track",
    },
  ];
  const now = Date.UTC(2026, 9, 18, 12);

  it("continues in the current track and returns to earlier gaps", () => {
    assert.equal(
      nextIncompleteChapter(chapters, ["systems/one"], "systems/one")?.key,
      "systems/two",
    );
    assert.equal(
      nextIncompleteChapter(
        chapters,
        ["systems/two", "systems/three"],
        "systems/three",
      )?.key,
      "systems/one",
    );
    assert.equal(
      nextIncompleteChapter(
        chapters,
        chapters.slice(0, 3).map((c) => c.key),
        "systems/three",
      ),
      undefined,
    );
    assert.equal(nextIncompleteChapter(chapters, [], "unknown"), undefined);
  });

  it("does not schedule unattempted or recent strong work; becomes due at 48 hours", () => {
    const state = defaultProgress();
    assert.deepEqual(chapterReviewQueue(chapters, state, now), []);
    state.drillAttempts.push({
      chapterKey: "systems/one",
      score: 3,
      completedAt: new Date(now - CHAPTER_REVIEW_DELAY_MS + 1).toISOString(),
    });
    assert.deepEqual(chapterReviewQueue(chapters, state, now), []);
    assert.equal(
      chapterReviewQueue(chapters, state, now + 1)[0]?.reason,
      "due",
    );
  });

  it("prioritizes weak practice and missed latest quiz answers before due work", () => {
    const state = defaultProgress();
    state.drillAttempts = [
      {
        chapterKey: "systems/one",
        score: 4,
        completedAt: new Date(now - CHAPTER_REVIEW_DELAY_MS).toISOString(),
      },
      {
        chapterKey: "systems/three",
        score: 1,
        completedAt: new Date(now).toISOString(),
      },
    ];
    state.quizAttempts["systems/two"] = [
      {
        chapterKey: "systems/two",
        questionIndex: 0,
        selectedIndex: 0,
        correct: false,
        attemptedAt: new Date(now).toISOString(),
      },
    ];
    assert.deepEqual(
      chapterReviewQueue(chapters, state, now).map((row) => row.reason),
      ["rebuild", "quiz", "due"],
    );
    state.quizAttempts["systems/two"].push({
      ...state.quizAttempts["systems/two"][0],
      correct: true,
    });
    assert.deepEqual(
      chapterReviewQueue(chapters, state, now).map((row) => row.reason),
      ["rebuild", "due"],
    );
  });

  it("a later strong practice clears an older weak score and missed check", () => {
    const state = defaultProgress();
    state.drillAttempts = [
      {
        chapterKey: "systems/one",
        score: 1,
        completedAt: new Date(now - 1000).toISOString(),
      },
      {
        chapterKey: "systems/one",
        score: 3,
        completedAt: new Date(now).toISOString(),
      },
    ];
    state.quizAttempts["systems/one"] = [
      {
        chapterKey: "systems/one",
        questionIndex: 0,
        selectedIndex: 0,
        correct: false,
        attemptedAt: new Date(now - 1000).toISOString(),
      },
    ];
    assert.deepEqual(chapterReviewQueue(chapters, state, now), []);
    state.drillAttempts.push({
      chapterKey: "systems/two",
      score: 3,
      completedAt: "invalid",
    });
    assert.deepEqual(chapterReviewQueue(chapters, state, now), []);
  });
});
