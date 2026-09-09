/**
 * Pure computation behind the interactive labs. Kept free of React so the
 * teaching math is unit-testable (`tests/unit.test.ts`); components in this
 * folder are thin views over these functions.
 */

// ---------------------------------------------------------------------------
// Scale Dial (system-design ch. 1)
// ---------------------------------------------------------------------------

export type ScaleInputs = {
  /** monthly active users, in millions */
  mauM: number;
  /** share of MAU active on a typical day, percent */
  dauSharePct: number;
  actionsPerUserPerDay: number;
  readPct: number;
  peakFactor: number;
  payloadKb: number;
  cacheHitPct: number;
  replication: number;
  retentionDays: number;
};

export type ScaleOutputs = {
  dau: number;
  avgRps: number;
  peakRps: number;
  readRps: number;
  writeRps: number;
  /** cache-discounted source load at peak */
  sourceRps: number;
  bandwidthBytes: number;
  annualStorageBytes: number;
  retainedStorageBytes: number;
  bottleneck: string;
};

const DAY_S = 86_400;
const SINGLE_DATASET_BYTES = 10 * 1024 ** 4;

export function computeScale(i: ScaleInputs): ScaleOutputs {
  const dau = i.mauM * 1_000_000 * (i.dauSharePct / 100);
  const avgRps = (dau * i.actionsPerUserPerDay) / DAY_S;
  const peakRps = avgRps * i.peakFactor;
  const readRps = peakRps * (i.readPct / 100);
  const writeRps = peakRps * (1 - i.readPct / 100);
  const sourceRps = writeRps + readRps * (1 - i.cacheHitPct / 100);
  const bandwidthBytes = peakRps * i.payloadKb * 1024;
  const writesPerDay = dau * i.actionsPerUserPerDay * (1 - i.readPct / 100);
  const annualStorageBytes = writesPerDay * i.payloadKb * 1024 * 365 * i.replication;
  const retainedStorageBytes =
    writesPerDay * i.payloadKb * 1024 * i.retentionDays * i.replication;

  const bottleneck =
    writeRps > 10_000
      ? "write path: single-primary writes saturate first — partition or buffer through a queue"
      : retainedStorageBytes > SINGLE_DATASET_BYTES
        ? "dataset: growth outruns one node within retention — shard by the access key early"
        : sourceRps > 5_000
          ? "source load: cache absorbs less than assumed — raise hit rate or add read replicas"
          : "single relational primary is plausible — spend complexity on the product, not scale";

  return {
    dau,
    avgRps,
    peakRps,
    readRps,
    writeRps,
    sourceRps,
    bandwidthBytes,
    annualStorageBytes,
    retainedStorageBytes,
    bottleneck,
  };
}

// ---------------------------------------------------------------------------
// Partition + Lease (system-design ch. 6)
// ---------------------------------------------------------------------------

export type MinorityVerdict =
  | { status: "none" }
  | { status: "refuses-fenced"; text: string }
  | { status: "stalls-quorum"; text: string }
  | { status: "split-brain"; text: string };

/**
 * What the minority side of a partition does. Fencing always wins; without
 * it, a side that cannot reach write quorum stalls (no divergence), while a
 * side that *can* reach quorum keeps writing — that is the split brain.
 */
export function minorityVerdict(args: {
  minor: number;
  writeQuorum: number;
  fencing: boolean;
}): MinorityVerdict {
  const { minor, writeQuorum, fencing } = args;
  if (minor <= 0) return { status: "none" };
  if (fencing) {
    return {
      status: "refuses-fenced",
      text: `minority side (${minor} nodes) refuses writes — fenced by lease token, no split brain.`,
    };
  }
  if (minor < writeQuorum) {
    return {
      status: "stalls-quorum",
      text: `minority side (${minor} nodes) cannot reach write quorum (${writeQuorum}) — it stalls. No divergence, but no progress either.`,
    };
  }
  return {
    status: "split-brain",
    text: `minority side (${minor} nodes) still reaches write quorum (${writeQuorum}) without fencing — SPLIT BRAIN: two divergent histories to reconcile.`,
  };
}

// ---------------------------------------------------------------------------
// KV Cache (llm-engineering ch. 4)
// ---------------------------------------------------------------------------

/**
 * KV bytes per token. Modern models use grouped-query attention, so KV
 * width is kvHeads × headDim — not the full hidden dim (that is the MHA
 * special case where kvHeads × headDim equals hiddenDim).
 */
export function kvBytesPerToken(args: {
  layers: number;
  kvHeads: number;
  headDim: number;
  bytesPerValue: number;
}): number {
  return 2 * args.layers * args.kvHeads * args.headDim * args.bytesPerValue;
}

// ---------------------------------------------------------------------------
// Attention Explorer (llm-engineering ch. 2)
// ---------------------------------------------------------------------------

export const attentionTokens = [
  "The", "animal", "didn't", "cross", "the", "street",
  "because", "it", "was", "too", "tired",
];

export type AttentionPattern = {
  query: string;
  queryIndex: number;
  note: string;
  /** weights over attentionTokens; positions after queryIndex are 0 (causal) */
  weights: number[];
};

const rawPatterns: (Omit<AttentionPattern, "weights"> & { raw: number[] })[] = [
  {
    query: "it",
    queryIndex: 7,
    note: "Resolving the pronoun: most mass lands on the candidate nouns, peaking at “animal”.",
    raw: [0.02, 0.55, 0.01, 0.03, 0.02, 0.04, 0.03, 0.18, 0, 0, 0],
  },
  {
    query: "tired",
    queryIndex: 10,
    note: "Adjectives bind to what they modify plus the causal clause: “too” and “because” light up.",
    raw: [0.01, 0.1, 0.01, 0.02, 0.01, 0.05, 0.22, 0.04, 0.05, 0.3, 0.19],
  },
  {
    query: "cross",
    queryIndex: 3,
    note: "Verbs gather their arguments: the subject “animal” is visible; the object “street” is still in the future, so the head spreads over subject and self.",
    raw: [0.05, 0.55, 0.05, 0.35, 0, 0, 0, 0, 0, 0, 0],
  },
];

/** Enforce causality (zero future positions) and renormalize to sum 1. */
export function causalize(raw: number[], queryIndex: number): number[] {
  const masked = raw.map((w, i) => (i <= queryIndex ? w : 0));
  const sum = masked.reduce((s, w) => s + w, 0);
  if (sum <= 0) {
    return masked.map((_, i) => (i === queryIndex ? 1 : 0));
  }
  return masked.map((w) => w / sum);
}

export const attentionPatterns: Record<string, AttentionPattern> =
  Object.fromEntries(
    rawPatterns.map((p) => [
      p.query,
      {
        query: p.query,
        queryIndex: p.queryIndex,
        note: p.note,
        weights: causalize(p.raw, p.queryIndex),
      },
    ]),
  );

// ---------------------------------------------------------------------------
// Next-Token Playground (llm-engineering ch. 1)
// ---------------------------------------------------------------------------

export type TokenProb = { token: string; p: number };

/** Illustrative next-token distribution for "The capital of France is ___". */
export const baseTokenProbs: TokenProb[] = [
  { token: "Paris", p: 0.62 },
  { token: "Lyon", p: 0.18 },
  { token: "Marseille", p: 0.09 },
  { token: "Nice", p: 0.06 },
  { token: "Toulouse", p: 0.03 },
  { token: "Bordeaux", p: 0.02 },
];

export type ShapedToken = { token: string; p: number; cut: boolean };

/** Draw one token from the live (uncut) distribution. Injectable rand for tests. */
export function sampleToken(
  shaped: ShapedToken[],
  rand: () => number = Math.random,
): string {
  const live = shaped.filter((t) => !t.cut);
  let x = rand();
  let pick = live[live.length - 1].token;
  for (const t of live) {
    x -= t.p;
    if (x <= 0) {
      pick = t.token;
      break;
    }
  }
  return pick;
}
/** Temperature reshapes (p^(1/T), renormalized); top-p truncates the tail. */
export function shapeDistribution(
  base: TokenProb[],
  temp: number,
  topP: number,
): ShapedToken[] {
  const scaled = base.map((t) => ({ ...t, w: Math.pow(t.p, 1 / Math.max(temp, 0.05)) }));
  const z = scaled.reduce((s, t) => s + t.w, 0);
  const normed = scaled.map((t) => ({ ...t, p: t.w / z }));
  const kept: typeof normed = [];
  let cum = 0;
  for (const t of normed) {
    kept.push(t);
    cum += t.p;
    if (cum >= topP) break;
  }
  const z2 = kept.reduce((s, t) => s + t.p, 0);
  return kept
    .map((t) => ({ token: t.token, p: t.p / z2, cut: false }))
    .concat(normed.slice(kept.length).map((t) => ({ token: t.token, p: 0, cut: true })));
}
