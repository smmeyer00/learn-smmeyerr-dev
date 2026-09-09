"use client";

import { useState } from "react";
import { LabShell } from "./lab-shell";
import { LabBar, LabSlider, LabStat, fmt1, fmtInt } from "./ui";

type Case = {
  id: string;
  slice: "happy path" | "adversarial" | "edge format";
  a: boolean;
  b: boolean;
};

/** Variant B improves the aggregate but regresses the adversarial slice. */
const dataset: Case[] = [
  { id: "refund-plain", slice: "happy path", a: true, b: true },
  { id: "refund-window", slice: "happy path", a: true, b: true },
  { id: "status-basic", slice: "happy path", a: true, b: true },
  { id: "status-delayed", slice: "happy path", a: false, b: true },
  { id: "hours-simple", slice: "happy path", a: true, b: true },
  { id: "inject-ignore", slice: "adversarial", a: true, b: false },
  { id: "inject-tool", slice: "adversarial", a: true, b: false },
  { id: "jailbreak-role", slice: "adversarial", a: false, b: false },
  { id: "typo-heavy", slice: "edge format", a: false, b: true },
  { id: "all-caps", slice: "edge format", a: false, b: true },
  { id: "multi-part", slice: "edge format", a: true, b: true },
  { id: "empty-query", slice: "edge format", a: false, b: true },
];

/** Human label (1 = good) + model-judge score for calibration. */
const judgeItems = [
  { human: 1, score: 0.91 },
  { human: 1, score: 0.84 },
  { human: 1, score: 0.77 },
  { human: 1, score: 0.62 },
  { human: 0, score: 0.58 },
  { human: 1, score: 0.55 },
  { human: 0, score: 0.49 },
  { human: 0, score: 0.31 },
  { human: 0, score: 0.22 },
  { human: 0, score: 0.08 },
];

/**
 * Eval Workbench + Judge Calibration (llm-engineering ch. 11).
 * Part 1: variant comparison that hides a slice regression inside an
 * aggregate win. Part 2: threshold slider over human labels → precision,
 * recall, agreement, launch decision.
 */
export function EvalWorkbench() {
  const [variant, setVariant] = useState<"A" | "B">("B");
  const [threshold, setThreshold] = useState(0.6);

  const slices = ["happy path", "adversarial", "edge format"] as const;
  const rate = (list: Case[]) =>
    list.length === 0
      ? 0
      : list.filter((c) => (variant === "A" ? c.a : c.b)).length / list.length;
  const overall = rate(dataset);
  const sliceRates = slices.map((s) => ({
    slice: s,
    rate: rate(dataset.filter((c) => c.slice === s)),
  }));

  const tp = judgeItems.filter((j) => j.human === 1 && j.score >= threshold).length;
  const fp = judgeItems.filter((j) => j.human === 0 && j.score >= threshold).length;
  const fn = judgeItems.filter((j) => j.human === 1 && j.score < threshold).length;
  const tn = judgeItems.filter((j) => j.human === 0 && j.score < threshold).length;
  const precision = tp + fp === 0 ? 1 : tp / (tp + fp);
  const recall = tp + fn === 0 ? 1 : tp / (tp + fn);
  const agreement = (tp + tn) / judgeItems.length;
  const gate =
    overall >= 0.7 && sliceRates.every((s) => s.rate >= 0.5) && agreement >= 0.8
      ? "GATE: ship — aggregate, slices, and judge agreement all hold"
      : "GATE: blocked — a launch needs the aggregate, every slice, and judge agreement";

  return (
    <LabShell
      title="Eval Workbench — aggregates lie, slices tell"
      predict="Variant B fixes 4 cases and breaks 2. Does the launch gate pass? Decide what rule you would enforce, then check."
      task="Flip between A and B: watch the aggregate rise while the adversarial slice falls. Then drag the judge threshold and find where precision and recall trade."
      takeaway="Ship on slices, not averages: one regressing slice blocks the launch. And a model-judge is a classifier — its threshold is a product decision with precision/recall consequences."
      transfer="Every prompt, model, or tool change re-runs this loop: goldens → slices → gate. No gate, no ship."
    >
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
        part 1 · variant vs slice (12 golden cases)
      </p>
      <div className="flex gap-2" role="group" aria-label="variant">
        {(["A", "B"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setVariant(v)}
            aria-pressed={variant === v}
            className={`cursor-pointer rounded border px-3 py-1.5 font-mono text-xs transition-colors ${variant === v ? "border-primary/50 bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            variant {v}
          </button>
        ))}
      </div>
      <dl>
        <LabStat label={`variant ${variant} overall`} value={`${fmt1.format(overall * 100)} % pass`} accent />
        {sliceRates.map((s) => (
          <LabStat key={s.slice} label={`${s.slice} slice`} value={`${fmt1.format(s.rate * 100)} % pass`} accent={s.rate < 0.5} />
        ))}
      </dl>
      <ul className="grid gap-1 font-mono text-xs" aria-label="case results">
        {dataset.map((c) => {
          const pass = variant === "A" ? c.a : c.b;
          return (
            <li key={c.id} className="flex items-baseline gap-2.5 text-muted-foreground">
              <span aria-hidden="true" className={pass ? "text-primary" : "text-destructive"}>
                {pass ? "✓" : "✗"}
              </span>
              <span className="sr-only">{pass ? "pass" : "fail"}</span>
              <span className="flex-1">{c.id}</span>
              <span className="text-muted-foreground">{c.slice}</span>
            </li>
          );
        })}
      </ul>

      <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
        part 2 · judge calibration (10 human-labeled items)
      </p>
      <LabSlider label="judge pass threshold" value={threshold} min={0} max={1} step={0.01} display={threshold.toFixed(2)} onChange={setThreshold} />
      <dl>
        <LabStat label="precision (approved that deserved it)" value={fmt1.format(precision * 100) + " %"} />
        <LabStat label="recall (deserving that got approved)" value={fmt1.format(recall * 100) + " %"} />
        <LabStat label="agreement with humans" value={`${fmt1.format(agreement * 100)} % · TP ${tp} / FP ${fp} / FN ${fn} / TN ${tn}`} accent />
      </dl>
      <div className="grid gap-2">
        <LabBar label="agreement" value={agreement * 100} max={100} display={`${fmtInt.format(agreement * 100)} %`} tone={agreement >= 0.8 ? "primary" : "warn"} />
      </div>
      <p role="status" className="rounded border border-primary/30 bg-primary/5 p-3 font-mono text-xs leading-5 text-foreground">
        {gate}
      </p>
    </LabShell>
  );
}
