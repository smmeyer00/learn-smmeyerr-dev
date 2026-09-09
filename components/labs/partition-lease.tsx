"use client";

import { useState } from "react";
import { LabShell } from "./lab-shell";
import { minorityVerdict } from "./models";
import { LabSlider, LabStat } from "./ui";

type Scenario = "healthy" | "one-down" | "partition";

const scenarioDetail: Record<Scenario, { label: string; note: string }> = {
  healthy: {
    label: "all nodes reachable",
    note: "Baseline: full quorum math applies.",
  },
  "one-down": {
    label: "one node down",
    note: "One replica unreachable; operations needing it fail.",
  },
  partition: {
    label: "partition 3 vs 2 (N=5)",
    note: "Majority side keeps quorum; minority side must refuse or risk split brain. Resize N to explore.",
  },
};

/**
 * Network Partition + Lease/Fencing (system-design ch. 6). Quorum
 * arithmetic plus a split-brain demonstration: without fencing, the
 * minority side keeps accepting writes.
 */
export function PartitionLease() {
  const [n, setN] = useState(5);
  const [r, setR] = useState(3);
  const [w, setW] = useState(3);
  const [scenario, setScenario] = useState<Scenario>("partition");
  const [fencing, setFencing] = useState(true);

  const clampedR = Math.min(r, n);
  const clampedW = Math.min(w, n);
  const overlap = clampedR + clampedW > n;

  // Reachable set sizes per scenario.
  const sides =
    scenario === "healthy"
      ? [n]
      : scenario === "one-down"
        ? [n - 1]
        : [Math.ceil(n / 2), Math.floor(n / 2)];
  const [major, minor] = sides.length === 1 ? [sides[0], 0] : sides;

  const canServe = (side: number) =>
    side >= clampedR && side >= clampedW
      ? "reads + writes"
      : side >= clampedR
        ? "reads only"
        : side >= clampedW
          ? "writes only (unsafe without overlap)"
          : "refuses — no quorum";

  const minority = minorityVerdict({
    minor,
    writeQuorum: clampedW,
    fencing,
  });
  const minorityShort =
    minority.status === "none"
      ? null
      : minority.status === "refuses-fenced"
        ? "refuses (fenced)"
        : minority.status === "stalls-quorum"
          ? "stalls (no write quorum)"
          : "accepts (SPLIT BRAIN)";

  return (
    <LabShell
      title="Partition + Lease — who may serve, and who must refuse"
      predict="N=5, R=3, W=3, split 3 vs 2: which side serves writes? Decide, then check the verdict."
      task="Break the overlap (R+W ≤ N) and watch stale reads become legal. Then partition the cluster and flip fencing off to see split brain."
      takeaway="Quorum is arithmetic with consequences: overlap buys recency, majority sides keep serving, and leases are only real when the storage layer enforces the fencing token."
      transfer="Every failover story — databases, leaders, primaries — must answer: who refuses, and what enforces the refusal?"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <LabSlider label="replicas (N)" value={n} min={1} max={7} step={1} onChange={setN} />
        <LabSlider label="read quorum (R)" value={clampedR} min={1} max={n} step={1} onChange={setR} />
        <LabSlider label="write quorum (W)" value={clampedW} min={1} max={n} step={1} onChange={setW} />
      </div>
      <div
        role="group"
        aria-label="failure scenario"
        className="flex flex-wrap gap-2"
      >
        {(Object.keys(scenarioDetail) as Scenario[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setScenario(s)}
            aria-pressed={scenario === s}
            className={`cursor-pointer rounded border px-3 py-1.5 font-mono text-xs transition-colors ${
              scenario === s
                ? "border-primary/50 bg-primary/5 text-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {scenarioDetail[s].label}
          </button>
        ))}
      </div>
      <div>
        <button
          type="button"
          onClick={() => setFencing((v) => !v)}
          aria-pressed={fencing}
          className="cursor-pointer rounded border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
        >
          {fencing ? "[ fencing on — leases enforced ]" : "[ fencing off — stale leaders writable ]"}
        </button>
      </div>
      <dl>
        <LabStat label="overlap R + W > N" value={overlap ? `yes (${clampedR}+${clampedW} > ${n})` : `NO (${clampedR}+${clampedW} ≤ ${n}) — stale reads legal`} accent />
        <LabStat label="tolerated failures" value={`${Math.min(n - clampedR, n - clampedW)} node(s) before reads or writes stall`} />
        <LabStat label={`majority side (${major} nodes)`} value={canServe(major)} />
        {minor > 0 && minorityShort && (
          <LabStat label={`minority side (${minor} nodes)`} value={minorityShort} accent />
        )}
      </dl>
      <p className="font-mono text-xs leading-5 text-muted-foreground">
        {scenarioDetail[scenario].note}
      </p>
      {minority.status !== "none" && (
        <p role="status" className="rounded border border-primary/30 bg-primary/5 p-3 font-mono text-xs leading-5 text-foreground">
          {minority.text}
        </p>
      )}
    </LabShell>
  );
}
