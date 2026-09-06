/**
 * Field manual content: scale formulas, availability budgets, AI-system
 * metrics, the 50-minute checklist, and the FACT frame. Ported verbatim
 * from handoff §7 ("Cross-course practice surfaces"); print-friendly
 * rendering lives in `app/field-manual/page.tsx` plus global print CSS.
 */

export type ManualSection = {
  id: string;
  title: string;
  intro: string;
  rows: { label: string; value: string }[];
};

export const fieldManual: ManualSection[] = [
  {
    id: "scale-formulas",
    title: "scale formulas",
    intro: "Say the factor you assume out loud. Round numbers, shown units.",
    rows: [
      { label: "average RPS", value: "daily actions ÷ 86,400" },
      { label: "peak RPS", value: "average RPS × explicit peak factor" },
      { label: "annual storage", value: "writes/s × bytes/write × 31.5M × replicas" },
      { label: "bandwidth", value: "requests/s × bytes/request" },
      { label: "cache source load", value: "traffic × (1 − hit rate)" },
      { label: "availability (serial)", value: "A₁ × A₂ × … × Aₙ" },
      { label: "quorum rule", value: "R + W > N for intersection" },
      { label: "Little's Law", value: "concurrency = throughput × latency" },
    ],
  },
  {
    id: "availability-budgets",
    title: "availability budgets",
    intro: "Downtime allowed per 30-day month. Pick the SLO before the architecture.",
    rows: [
      { label: "99%", value: "7h 18m / month" },
      { label: "99.9%", value: "43m 48s / month" },
      { label: "99.95%", value: "21m 54s / month" },
      { label: "99.99%", value: "4m 23s / month" },
      { label: "99.999%", value: "26s / month" },
    ],
  },
  {
    id: "ai-system-metrics",
    title: "AI-system metrics",
    intro: "Separate serving health from retrieval health from task health.",
    rows: [
      { label: "TTFT", value: "queue + prefill responsiveness" },
      { label: "ITL", value: "time between output tokens" },
      { label: "TPS", value: "decode throughput" },
      { label: "recall@k", value: "retrieval coverage" },
      { label: "groundedness", value: "claims supported by context" },
      { label: "task success", value: "end-to-end user outcome" },
      { label: "cost/success", value: "spend per successful task" },
      { label: "tool accuracy", value: "correct tool + arguments + effect" },
    ],
  },
  {
    id: "interview-checklist",
    title: "50-minute interview checklist",
    intro: "In order. If time collapses, protect 1–5 and close with 10.",
    rows: [
      { label: "01", value: "requirements + out of scope" },
      { label: "02", value: "scale and SLOs" },
      { label: "03", value: "API + data model" },
      { label: "04", value: "critical read/write path" },
      { label: "05", value: "bottleneck + scaling trigger" },
      { label: "06", value: "failure + retry semantics" },
      { label: "07", value: "security + tenant boundary" },
      { label: "08", value: "observability + rollout" },
      { label: "09", value: "cost + degradation" },
      { label: "10", value: "risks + recap" },
    ],
  },
  {
    id: "fact-frame",
    title: "fast tradeoff frame: FACT",
    intro: "Sixty seconds per comparison. No position without a reversal trigger.",
    rows: [
      { label: "F — frame", value: "the deciding constraints" },
      { label: "A — alternatives", value: "worth comparing (usually two)" },
      { label: "C — consequences", value: "correctness, latency, scale, complexity, cost, operations" },
      { label: "T — take a position", value: "and name the reversal trigger" },
    ],
  },
];
