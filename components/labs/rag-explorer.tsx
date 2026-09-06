"use client";

import { useState } from "react";
import { LabShell } from "./lab-shell";
import { LabBar, LabSlider, LabStat, fmt1, fmtInt } from "./ui";

const docPool = [
  "returns-policy-2026",
  "refund-window-faq",
  "chargeback-playbook",
  "warranty-exceptions",
  "shipping-delays-memo",
  "pricing-changelog",
  "support-macros",
  "fraud-signals-guide",
  "ledger-reconciliation-runbook",
  "holiday-hours-notice",
  "api-rate-limits",
  "data-retention-policy",
];

/**
 * RAG Pipeline Explorer (llm-engineering ch. 8). Retrieve → fuse → rerank →
 * assemble: top-k, hybrid weight, reranking, and freshness each move
 * recall, groundedness, and cost in different directions.
 */
export function RagExplorer() {
  const [topK, setTopK] = useState(5);
  const [hybrid, setHybrid] = useState(50);
  const [rerank, setRerank] = useState(true);
  const [fresh, setFresh] = useState(false);

  // Illustrative curves, labeled as such: recall rises with k (diminishing),
  // hybrid lifts the base, rerank converts recall into precision.
  const base = 0.45 + (hybrid / 100) * 0.25;
  const recall = Math.min(0.99, base + (1 - base) * (1 - Math.exp(-topK / 4)));
  const noise = Math.min(0.5, (topK / 20) * (rerank ? 0.4 : 1));
  const grounded = Math.max(0.3, Math.min(0.98, (rerank ? 0.92 : 0.78) - noise + (fresh ? 0.03 : 0)));
  const costUnits = topK * 2 + (rerank ? topK * 3 : 0) + (fresh ? 4 : 0);

  const evidence = docPool.slice(0, Math.min(topK, docPool.length));

  return (
    <LabShell
      title="RAG Pipeline — recall, groundedness, and cost per knob"
      predict="Raising top-k from 3 to 12: does groundedness go up (more evidence) or down (more noise)? Commit before dragging."
      task="Push top-k to 20 without reranking and watch groundedness sag. Then enable rerank and hybrid — same k, different pipeline."
      takeaway="Retrieval is a system, not a call: k buys recall with noise, hybrid covers lexical blind spots, rerank converts recall into answers, and every stage has a price."
      transfer="When a grounded answer is wrong, walk this pipeline in order — chunk, retrieve, fuse, rerank, assemble — before blaming the model."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <LabSlider label="top-k retrieved" value={topK} min={1} max={20} step={1} onChange={setTopK} />
        <LabSlider label="hybrid: vector ↔ lexical" value={hybrid} min={0} max={100} step={5} display={`${fmtInt.format(100 - hybrid)}% lexical / ${fmtInt.format(hybrid)}% vector`} onChange={setHybrid} />
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setRerank((v) => !v)}
          aria-pressed={rerank}
          className={`cursor-pointer rounded border px-3 py-1.5 font-mono text-xs transition-colors ${rerank ? "border-primary/50 bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
        >
          {rerank ? "[ rerank on ]" : "[ rerank off ]"}
        </button>
        <button
          type="button"
          onClick={() => setFresh((v) => !v)}
          aria-pressed={fresh}
          className={`cursor-pointer rounded border px-3 py-1.5 font-mono text-xs transition-colors ${fresh ? "border-primary/50 bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
        >
          {fresh ? "[ freshness filter on ]" : "[ freshness filter off ]"}
        </button>
      </div>
      <dl>
        <LabStat label="recall@k (illustrative)" value={`${fmt1.format(recall * 100)} %`} accent />
        <LabStat label="groundedness (illustrative)" value={`${fmt1.format(grounded * 100)} %`} accent />
        <LabStat label="cost" value={`${fmtInt.format(costUnits)} units/query`} />
      </dl>
      <div className="grid gap-2">
        <LabBar label="recall@k" value={recall * 100} max={100} display={`${fmt1.format(recall * 100)} %`} />
        <LabBar label="groundedness" value={grounded * 100} max={100} display={`${fmt1.format(grounded * 100)} %`} tone={grounded < 0.7 ? "warn" : "primary"} />
      </div>
      <div>
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
          evidence assembled ({evidence.length} docs)
        </p>
        <ul className="mt-2 space-y-1 font-mono text-xs text-muted-foreground">
          {evidence.map((doc, i) => (
            <li key={doc}>
              <span className="mr-2 text-primary">{String(i + 1).padStart(2, "0")}</span>
              {doc}
              {rerank && i < 2 && <span className="text-foreground"> ← reranked to top</span>}
            </li>
          ))}
        </ul>
      </div>
    </LabShell>
  );
}
