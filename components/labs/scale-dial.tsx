"use client";

import { useState } from "react";
import { LabShell } from "./lab-shell";
import { computeScale } from "./models";
import { LabBar, LabSlider, LabStat, fmt1, fmtBytes, fmtInt } from "./ui";

/**
 * Scale Dial / source-load calculator (system-design ch. 1).
 * Classic service mode: monthly behavior → daily actives → peak RPS →
 * bandwidth, storage, and cache-discounted source load, with a bottleneck
 * verdict. MAU converts to DAU through an explicit share — the estimate
 * that most often decides whether the math is believable.
 */
export function ScaleDial() {
  const [mauM, setMauM] = useState(20);
  const [dauShare, setDauShare] = useState(25);
  const [actions, setActions] = useState(3);
  const [readPct, setReadPct] = useState(95);
  const [peak, setPeak] = useState(5);
  const [payloadKb, setPayloadKb] = useState(4);
  const [hitPct, setHitPct] = useState(90);
  const [replicas, setReplicas] = useState(3);
  const [retentionDays, setRetentionDays] = useState(365);

  const s = computeScale({
    mauM,
    dauSharePct: dauShare,
    actionsPerUserPerDay: actions,
    readPct,
    peakFactor: peak,
    payloadKb,
    cacheHitPct: hitPct,
    replication: replicas,
    retentionDays,
  });

  return (
    <LabShell
      title="Scale Dial — from monthly behavior to the bottleneck"
      predict="20M monthly users at 3 actions a day: what peak RPS? Commit to a number — and to the DAU share you assumed — before touching the dials."
      task="Move one dial at a time. Shrink the DAU share and watch the verdict flip; stretch retention and watch the dataset verdict move."
      takeaway="Estimates exist to choose, not to impress. Average RPS is arithmetic; the design lives in the DAU share, the peak factor, the read/write split, and what the cache removes from the source."
      transfer="Reuse this chain on any sizing question: users → daily actives → peak → bytes → bottleneck. Say the factor you assumed out loud."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <LabSlider label="monthly active users" value={mauM} min={1} max={500} step={1} display={`${fmtInt.format(mauM)} M`} onChange={setMauM} />
        <LabSlider label="DAU share of MAU" value={dauShare} min={1} max={100} step={1} display={`${fmtInt.format(dauShare)} % → ${fmtInt.format(s.dau)} DAU`} onChange={setDauShare} />
        <LabSlider label="actions per user per day" value={actions} min={1} max={50} step={1} onChange={setActions} />
        <LabSlider label="reads" value={readPct} min={50} max={99.9} step={0.1} display={`${fmt1.format(readPct)} %`} onChange={setReadPct} />
        <LabSlider label="peak factor" value={peak} min={1} max={20} step={0.5} display={`${fmt1.format(peak)}×`} onChange={setPeak} />
        <LabSlider label="avg payload" value={payloadKb} min={1} max={1024} step={1} display={fmtBytes(payloadKb * 1024)} onChange={setPayloadKb} />
        <LabSlider label="cache hit rate" value={hitPct} min={0} max={99.9} step={0.1} display={`${fmt1.format(hitPct)} %`} onChange={setHitPct} />
        <LabSlider label="replication factor" value={replicas} min={1} max={5} step={1} onChange={setReplicas} />
        <LabSlider label="retention" value={retentionDays} min={30} max={1825} step={5} display={`${fmtInt.format(retentionDays)} days`} onChange={setRetentionDays} />
      </div>
      <dl>
        <LabStat label="daily active users" value={fmtInt.format(s.dau)} />
        <LabStat label="avg RPS" value={`${fmtInt.format(s.avgRps)}`} />
        <LabStat label="peak RPS" value={`${fmtInt.format(s.peakRps)}`} accent />
        <LabStat label="peak writes/s" value={`${fmtInt.format(s.writeRps)}`} />
        <LabStat label="source load (cache-discounted)" value={`${fmtInt.format(s.sourceRps)} req/s`} accent />
        <LabStat label="peak bandwidth" value={`${fmtBytes(s.bandwidthBytes)}/s`} />
        <LabStat label="retained dataset" value={fmtBytes(s.retainedStorageBytes)} accent />
      </dl>
      <div className="grid gap-2">
        <LabBar label="cache-absorbed share" value={s.peakRps - s.sourceRps} max={Math.max(s.peakRps, 1)} display={`${fmt1.format((1 - s.sourceRps / Math.max(s.peakRps, 1)) * 100)} %`} />
      </div>
      <p role="status" className="rounded border border-primary/30 bg-primary/5 p-3 font-mono text-xs leading-5 text-foreground">
        bottleneck verdict: {s.bottleneck}
      </p>
    </LabShell>
  );
}
