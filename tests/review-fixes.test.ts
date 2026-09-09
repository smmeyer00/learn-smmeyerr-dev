import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  computeScale,
  minorityVerdict,
  kvBytesPerToken,
  attentionPatterns,
  attentionTokens,
  sampleToken,
  shapeDistribution,
  baseTokenProbs,
  type ShapedToken,
} from "../components/labs/models";
import {
  hasProgressData,
  importProgressJson,
  defaultProgress,
} from "../lib/progress";
import {
  attemptQueueState,
  buildRedoQueue,
  REDO_WINDOW_MS,
} from "../content/drills";

describe("scale dial (finding 1)", () => {
  const base = {
    mauM: 20,
    dauSharePct: 25,
    actionsPerUserPerDay: 3,
    readPct: 95,
    peakFactor: 5,
    payloadKb: 4,
    cacheHitPct: 90,
    replication: 3,
    retentionDays: 365,
  };

  it("converts MAU to DAU through the explicit share", () => {
    const s = computeScale(base);
    assert.equal(s.dau, 5_000_000);
    assert.ok(Math.abs(s.avgRps - (5_000_000 * 3) / 86_400) < 0.001);
    assert.equal(s.peakRps, s.avgRps * 5);
  });

  it("shrinking the DAU share moves load, not just labels", () => {
    const full = computeScale({ ...base, dauSharePct: 100 });
    const thin = computeScale({ ...base, dauSharePct: 5 });
    assert.equal(full.peakRps / thin.peakRps, 20);
  });

  it("retention drives the dataset verdict", () => {
    const short = computeScale({ ...base, retentionDays: 30 });
    const long = computeScale({ ...base, retentionDays: 1825 });
    assert.ok(long.retainedStorageBytes > short.retainedStorageBytes);
    // Force a dataset-bound case: moderate writes, long retention.
    const heavy = computeScale({
      ...base,
      readPct: 80,
      payloadKb: 16,
      retentionDays: 1825,
    });
    assert.match(heavy.bottleneck, /dataset/);
    const light = computeScale({
      ...base,
      readPct: 80,
      payloadKb: 16,
      retentionDays: 30,
    });
    assert.doesNotMatch(light.bottleneck, /dataset/);
  });
});

describe("partition minority verdict (finding 2)", () => {
  it("a fenced minority refuses", () => {
    const v = minorityVerdict({ minor: 2, writeQuorum: 3, fencing: true });
    assert.equal(v.status, "refuses-fenced");
  });

  it("an unfenced minority below write quorum stalls instead of diverging", () => {
    const v = minorityVerdict({ minor: 2, writeQuorum: 3, fencing: false });
    assert.equal(v.status, "stalls-quorum");
    assert.match(v.text, /cannot reach write quorum/);
  });

  it("split brain requires the minority to actually reach quorum", () => {
    const v = minorityVerdict({ minor: 2, writeQuorum: 2, fencing: false });
    assert.equal(v.status, "split-brain");
  });

  it("no minority means no verdict", () => {
    assert.equal(
      minorityVerdict({ minor: 0, writeQuorum: 3, fencing: false }).status,
      "none",
    );
  });
});

describe("kv cache GQA formula (finding 4)", () => {
  it("uses kvHeads × headDim, not hidden dim", () => {
    // 80 layers, 8 KV heads, 128 head-dim, fp16.
    assert.equal(
      kvBytesPerToken({ layers: 80, kvHeads: 8, headDim: 128, bytesPerValue: 2 }),
      2 * 80 * 8 * 128 * 2,
    );
  });

  it("matches a realistic 70B-class shape (~1.25GB per 4k request)", () => {
    const perRequest = kvBytesPerToken({ layers: 80, kvHeads: 8, headDim: 128, bytesPerValue: 2 }) * 4000;
    assert.ok(perRequest > 1_000_000_000 && perRequest < 1_500_000_000);
  });

  it("MHA is the special case kvHeads × headDim = hidden", () => {
    assert.equal(
      kvBytesPerToken({ layers: 32, kvHeads: 32, headDim: 128, bytesPerValue: 2 }),
      2 * 32 * 4096 * 2,
    );
  });
});

describe("attention causality (finding 3)", () => {
  it("no pattern attends past its query position", () => {
    for (const pattern of Object.values(attentionPatterns)) {
      pattern.weights.forEach((w, i) => {
        assert.equal(
          i > pattern.queryIndex ? w : 0,
          0,
          `${pattern.query} leaks to ${attentionTokens[i]}`,
        );
      });
    }
  });

  it("weights still sum to 1 with the peak on a prior token", () => {
    for (const pattern of Object.values(attentionPatterns)) {
      const sum = pattern.weights.reduce((s, w) => s + w, 0);
      assert.ok(Math.abs(sum - 1) < 1e-9, `${pattern.query} sums to ${sum}`);
      const top = pattern.weights.indexOf(Math.max(...pattern.weights));
      assert.ok(top <= pattern.queryIndex);
    }
    const it = attentionPatterns["it"];
    assert.equal(attentionTokens[it.weights.indexOf(Math.max(...it.weights))], "animal");
  });
});

describe("next-token shaping", () => {
  it("high temperature flattens, top-p amputates, mass conserved", () => {
    const hot = shapeDistribution(baseTokenProbs, 2, 1);
    const cold = shapeDistribution(baseTokenProbs, 0.2, 1);
    const spread = (rows: ShapedToken[]) =>
      Math.max(...rows.map((r) => r.p)) - Math.min(...rows.filter((r) => !r.cut).map((r) => r.p));
    assert.ok(spread(hot) < spread(cold));
    const cut = shapeDistribution(baseTokenProbs, 1, 0.7);
    assert.ok(cut.some((t) => t.cut));
    assert.ok(Math.abs(cut.filter((t) => !t.cut).reduce((s, t) => s + t.p, 0) - 1) < 1e-9);
  });

  it("sampling is deterministic under an injected rand", () => {
    const shaped = shapeDistribution(baseTokenProbs, 1, 1);
    assert.equal(sampleToken(shaped, () => 0), "Paris");
    assert.equal(sampleToken(shaped, () => 0.99999), "Bordeaux");
    assert.equal(sampleToken(shaped, () => 0.7), "Lyon");
  });
});

describe("progress import guard (finding 6)", () => {
  it("rejects empty, foreign, and versioned-wrong payloads", () => {
    for (const bad of ["{}", "[]", "42", '"hi"', '{"schemaVersion":2,"completedChapters":[]}']) {
      const r = importProgressJson(bad);
      assert.equal(r.ok, false, bad);
    }
  });

  it("rejects versioned payloads with no recognized keys", () => {
    const r = importProgressJson('{"schemaVersion":1,"unrelated":[1,2]}');
    assert.equal(r.ok, false);
    if (!r.ok) assert.match(r.error, /no progress data/);
  });

  it("accepts real exports (server-side: validated, not persisted)", () => {
    const good = JSON.stringify({
      schemaVersion: 1,
      completedChapters: ["system-design/01-x"],
    });
    assert.deepEqual(importProgressJson(good), { ok: true });
  });

  it("hasProgressData distinguishes empty from lived-in state", () => {
    assert.equal(hasProgressData(defaultProgress()), false);
    assert.equal(
      hasProgressData({ ...defaultProgress(), lastVisited: "a/b" }),
      true,
    );
    assert.equal(
      hasProgressData({ ...defaultProgress(), bookmarks: ["a/b"] }),
      true,
    );
  });
});

describe("redo queue with mocks (finding 5)", () => {
  const hour = 3_600_000;
  const now = Date.parse("2026-09-09T12:00:00Z");
  const attempts = [
    {
      drillId: "url-shortener",
      completedAt: new Date(now - hour).toISOString(),
      score: 1,
    },
    {
      drillId: "mock:public-ai-api",
      completedAt: new Date(now - hour).toISOString(),
      score: 2,
      note: "mock: Public AI API — framing 2, correctness 2, depth 2, tradeoffs 2, recovery 2",
    },
    {
      drillId: "chat-messaging",
      completedAt: new Date(now - 10 * 24 * hour).toISOString(),
      score: 4,
    },
  ];

  it("ranks weak first and parses mock titles", () => {
    const queue = buildRedoQueue(attempts, now);
    assert.equal(queue.length, 21); // 20 scenarios + 1 mock (deduped)
    assert.equal(queue[0].id, "url-shortener");
    assert.equal(queue[0].state, "weak");
    const mock = queue.find((r) => r.kind === "mock");
    assert.ok(mock);
    assert.equal(mock.title, "Public AI API");
    assert.equal(mock.state, "weak");
  });

  it("marks 48h-stale practice as due, recent 4/4 as fresh", () => {
    const queue = buildRedoQueue(attempts, now);
    const stale = queue.find((r) => r.id === "chat-messaging");
    assert.equal(stale?.state, "due");
    assert.ok(REDO_WINDOW_MS === 48 * hour);
    const fresh = buildRedoQueue(
      [{ drillId: "chat-messaging", completedAt: new Date(now - hour).toISOString(), score: 4 }],
      now,
    ).find((r) => r.id === "chat-messaging");
    assert.equal(fresh?.state, "fresh");
    const untouched = buildRedoQueue([], now).find((r) => r.id === "news-feed");
    assert.equal(untouched?.state, "new");
  });

  it("attemptQueueState grades single-drill histories", () => {
    assert.equal(attemptQueueState([], "x", now).state, "new");
    assert.equal(
      attemptQueueState(
        [{ drillId: "x", completedAt: new Date(now - hour).toISOString(), score: 2 }],
        "x",
        now,
      ).state,
      "weak",
    );
  });
});
