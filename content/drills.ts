/**
 * Interview-mode content: the 20-scenario drill deck, the 7 constraint
 * decks, the 50-minute mock structure, the self-scorecard axes, and oral
 * fluency prompts. Scenarios and decks are ported from handoff §7
 * ("Cross-course practice surfaces"); cards are authored to the same brief.
 */

import type { DrillAttempt } from "../lib/progress";

export type DrillScenario = {
  id: string;
  title: string;
  track: "system design" | "AI-native design";
  focus: string;
};

export const drillScenarios: DrillScenario[] = [
  { id: "url-shortener", title: "URL shortener", track: "system design", focus: "Read-heavy IDs, collision strategy, hot redirects, abuse." },
  { id: "chat-messaging", title: "Chat / messaging", track: "system design", focus: "Ordering, delivery, offline sync, fan-out, presence." },
  { id: "notification-platform", title: "Notification platform", track: "system design", focus: "Preferences, priorities, retries, providers, dedup." },
  { id: "news-feed", title: "News feed", track: "system design", focus: "Fan-out, ranking, celebrity keys, freshness." },
  { id: "file-storage", title: "File storage", track: "system design", focus: "Metadata, immutable blobs, chunking, sync, sharing." },
  { id: "autocomplete", title: "Autocomplete", track: "system design", focus: "Prefix index, ranking, freshness, p99 latency." },
  { id: "metrics-platform", title: "Metrics platform", track: "system design", focus: "Cardinality, ingestion, aggregation, retention, query." },
  { id: "job-scheduler", title: "Job scheduler", track: "system design", focus: "Leases, priority, retry, idempotency, fairness." },
  { id: "distributed-cache", title: "Distributed cache", track: "system design", focus: "Partitioning, eviction, replication, hot keys." },
  { id: "feature-flags", title: "Feature flags", track: "system design", focus: "Control/data plane, propagation, targeting, rollback." },
  { id: "llm-chat-product", title: "LLM chat product", track: "AI-native design", focus: "Streaming, state, routing, safety, cost." },
  { id: "coding-agent-backend", title: "Coding-agent backend", track: "AI-native design", focus: "Sandboxes, checkpoints, tools, tests, recovery." },
  { id: "inference-api", title: "Inference API", track: "AI-native design", focus: "Admission, batching, KV cache, fairness, fallback." },
  { id: "enterprise-rag", title: "Enterprise RAG", track: "AI-native design", focus: "ACLs, freshness, hybrid retrieval, citations, evals." },
  { id: "persistent-memory", title: "Persistent memory", track: "AI-native design", focus: "Write policy, retrieval, consent, contradiction." },
  { id: "tool-executor", title: "Tool executor", track: "AI-native design", focus: "Schemas, authorization, idempotency, audit, approval." },
  { id: "eval-platform", title: "Eval platform", track: "AI-native design", focus: "Datasets, graders, calibration, slices, gates." },
  { id: "model-gateway", title: "Model gateway", track: "AI-native design", focus: "Capabilities, routing, quotas, streams, accounting." },
  { id: "realtime-voice", title: "Realtime voice", track: "AI-native design", focus: "WebRTC, interruption, tools, latency, session state." },
  { id: "public-ai-api", title: "Public AI API", track: "AI-native design", focus: "Economic abuse, tenant isolation, limits, degradation." },
];

export type ConstraintDeck = {
  id: string;
  label: string;
  cards: string[];
};

export const constraintDecks: ConstraintDeck[] = [
  {
    id: "scale",
    label: "scale",
    cards: [
      "10k DAU side project, one engineer",
      "20M MAU consumer app",
      "1B events per day pipeline",
      "100k RPS flash-sale spike",
      "10-person startup, two backend engineers",
      "five regions on day one",
    ],
  },
  {
    id: "traffic",
    label: "traffic shape",
    cards: [
      "steady diurnal curve",
      "spiky: 10× during live events",
      "write-heavy 9:1 ingest",
      "read-heavy 100:1",
      "long tail: 1% creators, 99% lurkers",
      "batch bulk load plus interactive queries",
    ],
  },
  {
    id: "slo",
    label: "SLO",
    cards: [
      "99.9% monthly, 500ms p99",
      "99.99% checkout, 200ms p99",
      "best-effort internal tool",
      "4-hour RPO, 15-minute RTO",
      "zero data loss; minutes of downtime tolerable",
      "realtime: 100ms glass-to-glass",
    ],
  },
  {
    id: "failure",
    label: "failure",
    cards: [
      "primary region lost mid-session",
      "cache fleet cold-restarts at peak",
      "noisy tenant eats 70% of GPU capacity",
      "leader election storms every hour",
      "core dependency p99 doubles overnight",
      "provider bills 10× after a config typo",
    ],
  },
  {
    id: "security",
    label: "security / abuse",
    cards: [
      "public API with active scraping",
      "multi-tenant PII under SOC 2",
      "prompt-injection attempts inside every upload",
      "DDoS during launch week",
      "compromised third-party webhook",
      "credential-stuffing against login",
    ],
  },
  {
    id: "residency",
    label: "data residency",
    cards: [
      "EU data stays in the EU",
      "single region to start",
      "US plus EU with in-region inference",
      "customer-managed keys per tenant",
      "no PII leaves the device",
      "must stay reachable from mainland China",
    ],
  },
  {
    id: "cost",
    label: "cost",
    cards: [
      "ramen budget: $500/mo infra",
      "GPU spend capped — queue the rest",
      "optimize for spend per successful task",
      "egress costs dominate the bill",
      "scale to zero every night",
      "unit economics must beat $0.01/user/mo",
    ],
  },
];

export type DrawnScenario = {
  scenario: DrillScenario;
  cards: { deck: string; card: string }[];
  seed: number;
};

/** mulberry32 — small reproducible PRNG so a seed replays the exact draw. */
export function prng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function drawScenario(seed: number): DrawnScenario {
  const rand = prng(seed);
  const scenario =
    drillScenarios[Math.floor(rand() * drillScenarios.length)];
  const cards = constraintDecks.map((deck) => ({
    deck: deck.label,
    card: deck.cards[Math.floor(rand() * deck.cards.length)],
  }));
  return { scenario, cards, seed: seed >>> 0 };
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}

// ---------------------------------------------------------------------------
// 48-hour redo queue (deck scenarios + mock workspace reps, all local)
// ---------------------------------------------------------------------------

export type QueueState = "weak" | "due" | "fresh" | "new";

/** A drill is due for revisit 48h after its last attempt. */
export const REDO_WINDOW_MS = 2 * 86_400_000;

export function attemptQueueState(
  attempts: DrillAttempt[],
  drillId: string,
  now: number,
): { state: QueueState; lastScore?: number; lastAt?: number } {
  const mine = attempts.filter((a) => a.drillId === drillId);
  if (mine.length === 0) return { state: "new" };
  const last = mine[mine.length - 1];
  const lastAt = Date.parse(last.completedAt);
  if (last.score !== undefined && last.score <= 2)
    return { state: "weak", lastScore: last.score, lastAt };
  if (Number.isNaN(lastAt) || now - lastAt > REDO_WINDOW_MS)
    return { state: "due", lastScore: last.score, lastAt };
  return { state: "fresh", lastScore: last.score, lastAt };
}

export type RedoRow =
  | {
      kind: "scenario";
      id: string;
      title: string;
      track: string;
      state: QueueState;
      lastScore?: number;
    }
  | {
      kind: "mock";
      id: string;
      title: string;
      track: "mock rep";
      state: QueueState;
      lastScore?: number;
    };

const queueRank: Record<QueueState, number> = {
  weak: 0,
  new: 1,
  due: 2,
  fresh: 3,
};

function mockTitle(attempt: DrillAttempt, fallback: string): string {
  const note = attempt.note ?? "";
  const match = note.match(/^mock: (.+?) — /);
  return match ? match[1] : fallback;
}

/**
 * Every scenario plus every mock rep, weakest first. Mock reps link back
 * to /mock; scenarios reload into the deck above.
 */
export function buildRedoQueue(
  attempts: DrillAttempt[],
  now: number,
): RedoRow[] {
  const scenarioRows: RedoRow[] = drillScenarios.map((s) => ({
    kind: "scenario",
    id: s.id,
    title: s.title,
    track: s.track,
    ...attemptQueueState(attempts, s.id, now),
  }));

  const seenMockIds = new Set<string>();
  const mockRows: RedoRow[] = [];
  for (const attempt of attempts) {
    if (
      attempt.drillId === undefined ||
      !attempt.drillId.startsWith("mock:") ||
      seenMockIds.has(attempt.drillId)
    ) {
      continue;
    }
    seenMockIds.add(attempt.drillId);
    mockRows.push({
      kind: "mock",
      id: attempt.drillId,
      title: mockTitle(attempt, "mock rep"),
      track: "mock rep",
      ...attemptQueueState(attempts, attempt.drillId, now),
    });
  }

  return [...scenarioRows, ...mockRows].sort(
    (a, b) => queueRank[a.state] - queueRank[b.state],
  );
}

// ---------------------------------------------------------------------------
// 50-minute mock workspace
// ---------------------------------------------------------------------------

export type MockPhase = {
  id: string;
  label: string;
  minutes: number;
  checklist: string[];
};

export const MOCK_TOTAL_MINUTES = 50;

export const mockPhases: MockPhase[] = [
  {
    id: "contract",
    label: "contract + scope",
    minutes: 5,
    checklist: [
      "users, critical read/write path, out of scope",
      "scale estimate with an explicit peak factor",
      "SLOs written down and visible",
    ],
  },
  {
    id: "skeleton",
    label: "skeleton design",
    minutes: 8,
    checklist: [
      "boxes own something; arrows carry named requests",
      "stateful boundaries marked",
      "one bottleneck named before scaling mechanisms",
    ],
  },
  {
    id: "data",
    label: "APIs + data model",
    minutes: 7,
    checklist: [
      "core endpoints with shapes",
      "partition key and access patterns",
      "consistency choice stated with a reason",
    ],
  },
  {
    id: "deep",
    label: "hardest path deep dive",
    minutes: 12,
    checklist: [
      "the one path that decides seniority, fully traced",
      "numbers attached to every mechanism",
      "alternative considered and rejected on record",
    ],
  },
  {
    id: "failure",
    label: "failure + security + ops",
    minutes: 8,
    checklist: [
      "top failure and its retry semantics",
      "tenant/abuse boundary drawn",
      "what pages, what dashboards, how it rolls out",
    ],
  },
  {
    id: "recap",
    label: "recap + risks",
    minutes: 10,
    checklist: [
      "top three risks named explicitly",
      "cost and degradation posture stated",
      "reversal triggers: what would change the design",
    ],
  },
];

export type ScoreAxis = {
  id: string;
  label: string;
  prompt: string;
};

export const scoreAxes: ScoreAxis[] = [
  { id: "framing", label: "framing", prompt: "Scoped fast, SLOs visible, drove the conversation?" },
  { id: "correctness", label: "correctness", prompt: "Quorum math, consistency, failure semantics right?" },
  { id: "depth", label: "depth", prompt: "Hardest path traced with numbers, not adjectives?" },
  { id: "tradeoffs", label: "tradeoffs", prompt: "Alternatives weighed with reversal triggers?" },
  { id: "recovery", label: "recovery", prompt: "Handled the injected constraint without collapsing?" },
];

// ---------------------------------------------------------------------------
// Oral fluency circuit (llm ch. 21 style: short, spoken, senior)
// ---------------------------------------------------------------------------

export const fluencyPrompts: { minutes: number; prompt: string }[] = [
  { minutes: 2, prompt: "Whiteboard an LLM for a backend engineer, then name one product consequence." },
  { minutes: 2, prompt: "Consistency vs availability in 90 seconds, with one example where you chose." },
  { minutes: 2, prompt: "Why p99 and not the average — tell the checkout story." },
  { minutes: 2, prompt: "How RAG fails: three failure points, in pipeline order." },
  { minutes: 1, prompt: "KV cache in one minute: what it stores and why context costs memory." },
  { minutes: 2, prompt: "Quorum math on a napkin: N=5, and what breaks at R=2, W=2." },
  { minutes: 1, prompt: "What temperature actually does — distribution first, vibes never." },
  { minutes: 2, prompt: "Tell the cache-stampede story: one expiry, ten thousand queries." },
  { minutes: 2, prompt: "Your hardest production incident in STAR shape: situation, decision, outcome." },
  { minutes: 5, prompt: "Full design talkthrough: pick any drill scenario and run the 50-minute arc out loud." },
];
