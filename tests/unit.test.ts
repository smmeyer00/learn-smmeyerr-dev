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
    assert.ok(searchEntries("url shortener", index).some((h) => h.kind === "drill"));
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
