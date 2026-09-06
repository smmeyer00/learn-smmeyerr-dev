"use client";

import { useState } from "react";
import { LabShell } from "./lab-shell";
import { LabBar, LabSlider, LabStat, fmt1, fmtInt } from "./ui";

const modelClass = {
  small: { label: "7B-class · ~4k tok/s per GPU", perGpu: 4000 },
  large: { label: "70B-class · ~800 tok/s per GPU", perGpu: 800 },
} as const;

/**
 * GPU utilization vs p99 + token-shaped capacity (system-design ch. 11,
 * llm-engineering ch. 17). Token demand → fleet pressure → queue risk:
 * utilization past ~85% is where p99 falls off a cliff.
 */
export function GpuCapacity() {
  const [rps, setRps] = useState(120);
  const [inTok, setInTok] = useState(800);
  const [outTok, setOutTok] = useState(300);
  const [klass, setKlass] = useState<keyof typeof modelClass>("large");
  const [gpus, setGpus] = useState(8);
  const [cachePct, setCachePct] = useState(40);
  const [batchEff, setBatchEff] = useState(70);

  const demandTokS = rps * (inTok * (1 - cachePct / 100) + outTok);
  const capacityTokS =
    gpus * modelClass[klass].perGpu * (batchEff / 100);
  const util = capacityTokS === 0 ? 0 : demandTokS / capacityTokS;
  const gpusNeeded = Math.ceil(
    demandTokS / (modelClass[klass].perGpu * (batchEff / 100)),
  );
  const queueRisk =
    util < 0.7
      ? "headroom healthy — p99 driven by prefill spikes, not queueing"
      : util < 0.85
        ? "warming up — bursts will queue; watch TTFT tails"
        : util < 1
          ? "QUEUE RISK: sustained queueing — p99 climbs faster than throughput"
          : "OVERLOAD: demand exceeds capacity — shed, scale, or degrade now";

  return (
    <LabShell
      title="GPU capacity — token-shaped demand meets fixed supply"
      predict="120 RPS × (800 in + 300 out) tokens on 8 GPUs: over or under water? Guess the utilization first."
      task="Double the output tokens, then recover with prefix-cache hits. Push utilization past 85% and read the queue verdict."
      takeaway="Capacity is denominated in tokens per second, not requests. Cache hits erase prefill work; utilization past ~85% converts directly into p99 pain."
      transfer="Any fixed-supply pool with bursty demand — GPUs, DB connections, workers — gets the same treatment: demand curve, supply line, queue verdict."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <LabSlider label="requests / second" value={rps} min={5} max={2000} step={5} onChange={setRps} />
        <LabSlider label="avg input tokens" value={inTok} min={50} max={8000} step={50} onChange={setInTok} />
        <LabSlider label="avg output tokens" value={outTok} min={10} max={4000} step={10} onChange={setOutTok} />
        <LabSlider label="fleet GPUs" value={gpus} min={1} max={128} step={1} onChange={setGpus} />
        <LabSlider label="prefix-cache hit rate" value={cachePct} min={0} max={95} step={1} display={`${fmtInt.format(cachePct)} %`} onChange={setCachePct} />
        <LabSlider label="batch efficiency" value={batchEff} min={20} max={95} step={1} display={`${fmtInt.format(batchEff)} %`} onChange={setBatchEff} />
      </div>
      <div
        role="group"
        aria-label="model class"
        className="flex flex-wrap gap-2"
      >
        {(Object.keys(modelClass) as (keyof typeof modelClass)[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKlass(k)}
            aria-pressed={klass === k}
            className={`cursor-pointer rounded border px-3 py-1.5 font-mono text-xs transition-colors ${
              klass === k
                ? "border-primary/50 bg-primary/5 text-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {modelClass[k].label}
          </button>
        ))}
      </div>
      <dl>
        <LabStat label="token demand" value={`${fmtInt.format(demandTokS)} tok/s`} accent />
        <LabStat label="fleet capacity" value={`${fmtInt.format(capacityTokS)} tok/s`} />
        <LabStat label="GPUs needed" value={`${fmtInt.format(gpusNeeded)} (have ${fmtInt.format(gpus)})`} />
        <LabStat label="utilization" value={`${fmt1.format(util * 100)} %`} accent />
      </dl>
      <LabBar label="fleet utilization" value={util * 100} max={120} display={`${fmt1.format(util * 100)} % of capacity`} tone={util >= 0.85 ? "warn" : "primary"} />
      <p role="status" className="rounded border border-primary/30 bg-primary/5 p-3 font-mono text-xs leading-5 text-foreground">
        {queueRisk}
      </p>
    </LabShell>
  );
}
