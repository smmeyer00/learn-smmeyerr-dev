import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  defaultProgress,
  migrateProgress,
  chapterKey,
  isChapterComplete,
} from "../lib/progress";
import { searchEntries, buildSearchIndex } from "../lib/search";
import { drawScenario, prng } from "../content/drills";
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
