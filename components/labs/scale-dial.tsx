"use client";

import { useState } from "react";
import { LabShell } from "./lab-shell";
import { LabBar, LabSlider, LabStat, fmt1, fmtBytes, fmtInt } from "./ui";

/**
 * Scale Dial / source-load calculator (system-design ch. 1).
 * Classic service mode: daily behavior → peak RPS → bandwidth, storage,
 * and cache-discounted source load, with a bottleneck verdict.
 */
export function ScaleDial() {
  const [dauM, setDauM] = useState(20);
  const [actions, setActions] = useState(3);
  const [readPct, setReadPct] = useState(95);
  const [peak, setPeak] = useState(5);
  const [payloadKb, setPayloadKb] = useState(4);
  const [hitPct, setHitPct] = useState(90);
  const [replicas, setReplicas] = useState(3);
  const [retentionDays, setRetentionDays] = useState(365);

  const dau = dauM * 1_000_000;
  const avgRps = (dau * actions) / 86_400;
  const peakRps = avgRps * peak;
  const readRps = peakRps * (readPct / 100);
  const writeRps = peakRps * (1 - readPct / 100);
  const sourceRps = writeRps + readRps * (1 - hitPct / 100);
  const bandwidth = peakRps * payloadKb * 1024;
  const writesPerDay = dau * actions * (1 - readPct / 100);
  const annualStorage = writesPerDay * payloadKb * 1024 * 365 * replicas;
  const retentionStorage =
    writesPerDay * payloadKb * 1024 * retentionDays * replicas;

  const bottleneck =
    writeRps > 10_000
      ? "write path: single-primary writes saturate first — partition or buffer through a queue"
      : annualStorage > 10 * 1024 ** 4
        ? "dataset: growth outruns one node within the year — shard by the access key early"
        : sourceRps > 5_000
          ? "source load: cache absorbs less than assumed — raise hit rate or add read replicas"
          : "single relational primary is plausible — spend complexity on the product, not scale";

  return (
    <LabShell
      title="Scale Dial — from daily behavior to the bottleneck"
      predict="20M monthly users becomes what peak RPS? Commit to a number before touching the dials, then check how far off you were."
      task="Move one dial at a time. Watch which output moves the bottleneck verdict — that is the estimate that matters."
      takeaway="Estimates exist to choose, not to impress. Average RPS is arithmetic; the design lives in the peak factor, the read/write split, and what the cache removes from the source."
      transfer="Reuse this chain on any sizing question: users → actions → peak → bytes → bottleneck. Say the factor you assumed out loud."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <LabSlider label="monthly active users" value={dauM} min={1} max={500} step={1} display={`${fmtInt.format(dauM)} M`} onChange={setDauM} />
        <LabSlider label="actions per user per day" value={actions} min={1} max={50} step={1} onChange={setActions} />
        <LabSlider label="reads" value={readPct} min={50} max={99.9} step={0.1} display={`${fmt1.format(readPct)} %`} onChange={setReadPct} />
        <LabSlider label="peak factor" value={peak} min={1} max={20} step={0.5} display={`${fmt1.format(peak)}×`} onChange={setPeak} />
        <LabSlider label="avg payload" value={payloadKb} min={1} max={1024} step={1} display={fmtBytes(payloadKb * 1024)} onChange={setPayloadKb} />
        <LabSlider label="cache hit rate" value={hitPct} min={0} max={99.9} step={0.1} display={`${fmt1.format(hitPct)} %`} onChange={setHitPct} />
        <LabSlider label="replication factor" value={replicas} min={1} max={5} step={1} onChange={setReplicas} />
        <LabSlider label="retention" value={retentionDays} min={30} max={1825} step={5} display={`${fmtInt.format(retentionDays)} days`} onChange={setRetentionDays} />
      </div>
      <dl>
        <LabStat label="avg RPS" value={`${fmtInt.format(avgRps)}`} />
        <LabStat label="peak RPS" value={`${fmtInt.format(peakRps)}`} accent />
        <LabStat label="peak writes/s" value={`${fmtInt.format(writeRps)}`} />
        <LabStat label="source load (cache-discounted)" value={`${fmtInt.format(sourceRps)} req/s`} accent />
        <LabStat label="peak bandwidth" value={`${fmtBytes(bandwidth)}/s`} />
        <LabStat label="retained dataset" value={fmtBytes(retentionStorage)} />
      </dl>
      <div className="grid gap-2">
        <LabBar label="cache-absorbed share" value={peakRps - sourceRps} max={Math.max(peakRps, 1)} display={`${fmt1.format((1 - sourceRps / Math.max(peakRps, 1)) * 100)} %`} />
      </div>
      <p role="status" className="rounded border border-primary/30 bg-primary/5 p-3 font-mono text-xs leading-5 text-foreground">
        bottleneck verdict: {bottleneck}
      </p>
    </LabShell>
  );
}
