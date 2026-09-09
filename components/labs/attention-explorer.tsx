"use client";

import { useState } from "react";
import { LabShell } from "./lab-shell";
import { attentionPatterns, attentionTokens } from "./models";
import { LabBar, fmt1 } from "./ui";

/**
 * Attention Head Explorer (llm-engineering ch. 2). Pick the query token,
 * watch where one illustrative head puts its weight. Strictly causal:
 * no token attends past its own position — that is what the mask enforces.
 */
export function AttentionExplorer() {
  const [selected, setSelected] = useState<keyof typeof attentionPatterns>("it");
  const pattern = attentionPatterns[selected];
  const topIndex = pattern.weights.indexOf(Math.max(...pattern.weights));

  return (
    <LabShell
      title="Attention Head Explorer — where “it” looks"
      predict="Before clicking: which prior token do you think “it” attends to most — “street” (recent) or “animal” (correct)? Commit. Note the constraint: nothing may look into the future."
      task="Switch the query token between “it”, “tired”, and “cross”. Each head learns one relationship; compare the three patterns — and check that every bar past the query token is zero."
      takeaway="Attention is weighted lookup over the past: every token builds itself from earlier tokens, weighted by learned relevance. Resolving references is arithmetic over prior context, not grammar rules — and the causal mask is what keeps generation honest."
      transfer="When a model confuses who-did-what, picture this grid: the weight went to the wrong prior token."
    >
      <div role="group" aria-label="query token" className="flex flex-wrap gap-2">
        {(Object.keys(attentionPatterns) as (keyof typeof attentionPatterns)[]).map((k) => (
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
            query: “{attentionPatterns[k].query}”
          </button>
        ))}
      </div>
      <p className="font-mono text-xs leading-6 text-muted-foreground">
        {attentionTokens.map((tok, i) => (
          <span
            key={i}
            className={
              tok === pattern.query && attentionTokens[i] !== "it"
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
        aria-label={`attention from ${pattern.query}: highest weight on ${attentionTokens[topIndex]} at ${fmt1.format(pattern.weights[topIndex] * 100)} percent; nothing past position ${pattern.queryIndex + 1}`}
      >
        {attentionTokens.map((tok, i) => (
          <LabBar
            key={`${tok}-${i}`}
            label={`${tok}${tok === pattern.query ? " (query)" : i > pattern.queryIndex ? " (future: masked)" : ""}`}
            value={pattern.weights[i] * 100}
            max={60}
            display={i > pattern.queryIndex ? "masked · 0 %" : `${fmt1.format(pattern.weights[i] * 100)} %`}
            tone={i > pattern.queryIndex ? "muted" : "primary"}
          />
        ))}
      </div>
      <p className="text-sm leading-6 text-foreground">{pattern.note}</p>
    </LabShell>
  );
}
