"use client";

import { useState } from "react";
import { LabShell } from "./lab-shell";
import { LabBar, fmt1 } from "./ui";

const tokens = ["The", "animal", "didn't", "cross", "the", "street", "because", "it", "was", "too", "tired"];

/**
 * Illustrative attention weights per query token: one head, one pattern.
 * Values are pedagogical — they show the *idea* that "it" resolves to
 * "animal" through weighting, not measured weights.
 */
const patterns: Record<string, { query: string; note: string; weights: number[] }> = {
  it: {
    query: "it",
    note: "Resolving the pronoun: most mass lands on the candidate nouns, peaking at “animal”.",
    weights: [0.02, 0.52, 0.02, 0.03, 0.01, 0.04, 0.03, 0.2, 0.03, 0.02, 0.08],
  },
  tired: {
    query: "tired",
    note: "Adjectives bind to what they modify plus the causal clause: “too” and “because” light up.",
    weights: [0.01, 0.1, 0.01, 0.02, 0.01, 0.05, 0.22, 0.04, 0.05, 0.3, 0.19],
  },
  cross: {
    query: "cross",
    note: "Verbs gather their arguments: the subject “animal” and the object “street”.",
    weights: [0.03, 0.34, 0.02, 0.18, 0.02, 0.3, 0.03, 0.02, 0.02, 0.02, 0.02],
  },
};

/**
 * Attention Head Explorer (llm-engineering ch. 2). Pick the query token,
 * watch where one illustrative head puts its weight.
 */
export function AttentionExplorer() {
  const [selected, setSelected] = useState<keyof typeof patterns>("it");
  const pattern = patterns[selected];

  return (
    <LabShell
      title="Attention Head Explorer — where “it” looks"
      predict="Before clicking: which token do you think “it” attends to most — “street” (recent) or “animal” (correct)? Commit."
      task="Switch the query token between “it”, “tired”, and “cross”. Each head learns one relationship; compare the three patterns."
      takeaway="Attention is weighted lookup: every token builds itself from every other token, weighted by learned relevance. Resolving references is arithmetic over the whole context, not grammar rules."
      transfer="When a model confuses who-did-what, picture this grid: the weight went to the wrong token."
    >
      <div role="group" aria-label="query token" className="flex flex-wrap gap-2">
        {(Object.keys(patterns) as (keyof typeof patterns)[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setSelected(k)}
            aria-pressed={selected === k}
            className={`cursor-pointer rounded border px-3 py-1.5 font-mono text-xs transition-colors ${
              selected === k
                ? "border-primary/50 bg-primary/5 text-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            query: “{patterns[k].query}”
          </button>
        ))}
      </div>
      <p className="font-mono text-xs leading-6 text-muted-foreground">
        {tokens.map((tok, i) => (
          <span
            key={i}
            className={
              tok === pattern.query && tokens[i] !== "it"
                ? "text-primary"
                : undefined
            }
          >
            {tok}{" "}
          </span>
        ))}
      </p>
      <div
        className="grid gap-1.5"
        role="img"
        aria-label={`attention from ${pattern.query}: highest weight on ${tokens[pattern.weights.indexOf(Math.max(...pattern.weights))]} at ${fmt1.format(Math.max(...pattern.weights) * 100)} percent`}
      >
        {tokens.map((tok, i) => (
          <LabBar
            key={`${tok}-${i}`}
            label={`${tok}${tok === pattern.query ? " (query)" : ""}`}
            value={pattern.weights[i] * 100}
            max={60}
            display={`${fmt1.format(pattern.weights[i] * 100)} %`}
          />
        ))}
      </div>
      <p className="text-sm leading-6 text-foreground">{pattern.note}</p>
    </LabShell>
  );
}
