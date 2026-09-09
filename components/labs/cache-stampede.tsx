"use client";

import { useState } from "react";
import { LabShell } from "./lab-shell";
import { LabBar, LabSlider, LabStat, fmt1, fmtInt } from "./ui";

/**
 * Cache Stampede (system-design ch. 4). Shows how many requests pile onto
 * the source during one recompute window, with and without coalescing.
 */
export function CacheStampede() {
  const [rps, setRps] = useState(10_000);
  const [hotPct, setHotPct] = useState(30);
  const [recomputeMs, setRecomputeMs] = useState(200);
  const [coalesced, setCoalesced] = useState(false);

  const hotRps = rps * (hotPct / 100);
  const windowS = recomputeMs / 1000;
  const pileup = Math.max(1, Math.round(hotRps * windowS));
  const sourceHits = coalesced ? 1 : pileup;
  const amplification = coalesced ? pileup : 1;

  return (
    <LabShell
      title="Cache Stampede — one expiry, ten thousand queries"
      predict="At 10k RPS with a 200ms recompute, how many requests hit the source when the hot key expires? Guess, then read the pileup."
      task="Grow the recompute time and the hot-key share. Flip coalescing on and watch the amplification collapse."
      takeaway="Expiry synchronizes misses. The fix is never 'a bigger cache' — it is coalesced recompute, probabilistic early refresh, or serving stale while revalidating."
      transfer="Anywhere a shared expensive result expires on a fixed schedule, ask what happens in the recompute window."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <LabSlider label="peak RPS" value={rps} min={100} max={100_000} step={100} onChange={setRps} />
        <LabSlider label="hot-key share" value={hotPct} min={1} max={100} step={1} display={`${fmtInt.format(hotPct)} %`} onChange={setHotPct} />
        <LabSlider label="source recompute time" value={recomputeMs} min={10} max={2000} step={10} display={`${fmtInt.format(recomputeMs)} ms`} onChange={setRecomputeMs} />
        <div>
          <p id="coalescing-label" className="font-mono text-xs text-foreground">request coalescing</p>
          <button
            type="button"
            aria-labelledby="coalescing-label"
            onClick={() => setCoalesced((v) => !v)}
            aria-pressed={coalesced}
            className="mt-2 cursor-pointer rounded border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            {coalesced ? "[ on — one flight per key ]" : "[ off — every miss hits source ]"}
          </button>
        </div>
      </div>
      <dl>
        <LabStat label="hot-key RPS" value={fmtInt.format(hotRps)} />
        <LabStat label="requests piled up per expiry" value={fmtInt.format(pileup)} accent />
        <LabStat label="source hits per expiry" value={coalesced ? "1 (coalesced)" : fmtInt.format(sourceHits)} accent />
      </dl>
      <div className="grid gap-2">
        <LabBar label="without coalescing" value={pileup} max={Math.max(pileup, 1)} display={`${fmtInt.format(pileup)} hits`} tone="warn" />
        <LabBar label="with coalescing" value={1} max={Math.max(pileup, 1)} display="1 hit" />
      </div>
      <p role="status" className="font-mono text-xs leading-5 text-muted-foreground">
        amplification removed by coalescing: {fmt1.format(amplification)}× — at {fmtInt.format(hotRps)} hot RPS even a{" "}
        {fmtInt.format(recomputeMs)}ms recompute turns one expiry into a{" "}
        {coalesced ? "non-event" : "source outage rehearsal"}.
      </p>
    </LabShell>
  );
}
