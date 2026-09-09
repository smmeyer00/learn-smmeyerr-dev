"use client";

import { useState } from "react";
import { LabShell } from "./lab-shell";
import { baseTokenProbs, sampleToken, shapeDistribution } from "./models";
import { LabBar, LabSlider, fmt1 } from "./ui";

/**
 * Next-Token Playground (llm-engineering ch. 1). Temperature reshapes the
 * distribution, top-p truncates the tail, sampling draws from what remains.
 */
export function NextToken() {
  const [temp, setTemp] = useState(1);
  const [topP, setTopP] = useState(1);
  const [draws, setDraws] = useState<Record<string, number>>({});
  const [totalDraws, setTotalDraws] = useState(0);

  const shaped = shapeDistribution(baseTokenProbs, temp, topP);

  function sample() {
    const pick = sampleToken(shaped);
    setDraws((d) => ({ ...d, [pick]: (d[pick] ?? 0) + 1 }));
    setTotalDraws((n) => n + 1);
  }

  const topProb = shaped[0].p;

  return (
    <LabShell
      title="Next-Token Playground — distribution in, sample out"
      predict="At temperature 2.0, does Paris stay above 40%? Commit, then drag the slider."
      task="Crank temperature to flatten the distribution, then lower top-p to amputate the tail. Sample 20 times at each setting and compare the histograms."
      takeaway="The model outputs a distribution, not an answer. Temperature spreads mass, top-p cuts the tail, and every sample from low-probability mass without grounding is a hallucination rehearsal."
      transfer="Whenever outputs vary run to run, reach for this picture first: distribution → policy → sample."
    >
      <p className="font-mono text-xs text-muted-foreground">
        prompt: “The capital of France is ___” · illustrative distribution
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <LabSlider label="temperature" value={temp} min={0.1} max={2} step={0.05} display={temp.toFixed(2)} onChange={setTemp} />
        <LabSlider label="top-p nucleus" value={topP} min={0.1} max={1} step={0.05} display={topP.toFixed(2)} onChange={setTopP} />
      </div>
      <div className="grid gap-2" role="img" aria-label={`shaped distribution; top token probability ${fmt1.format(topProb * 100)} percent`}>
        {shaped.map((t) => (
          <LabBar
            key={t.token}
            label={t.cut ? `${t.token} (cut by top-p)` : t.token}
            value={t.p * 100}
            max={100}
            display={t.cut ? "0 %" : `${fmt1.format(t.p * 100)} %`}
            tone={t.cut ? "muted" : "primary"}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={sample}
          className="cursor-pointer rounded border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
        >
          [ sample one token ]
        </button>
        <button
          type="button"
          onClick={() => {
            setDraws({});
            setTotalDraws(0);
          }}
          className="cursor-pointer font-mono text-[0.6875rem] text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
        >
          reset counts
        </button>
        <p className="font-mono text-[0.6875rem] text-muted-foreground">
          draws: {totalDraws}
          {totalDraws > 0 &&
            ` — ${Object.entries(draws)
              .map(([k, v]) => `${k} ×${v}`)
              .join(", ")}`}
        </p>
      </div>
    </LabShell>
  );
}
