"use client";

import { useState } from "react";
import { LabShell } from "./lab-shell";
import { kvBytesPerToken } from "./models";
import { LabBar, LabSlider, LabStat, fmt1, fmtBytes, fmtInt } from "./ui";

/**
 * Prefill/Decode + KV Cache calculator (llm-engineering ch. 4).
 * KV width is kvHeads × headDim (grouped-query attention); plain hidden
 * dim is only correct for non-grouped MHA. Your assumptions, honest math:
 * memory per request → fleet pressure → TTFT risk readout.
 */
export function KvCache() {
  const [layers, setLayers] = useState(80);
  const [kvHeads, setKvHeads] = useState(8);
  const [headDim, setHeadDim] = useState(128);
  const [bytes, setBytes] = useState(2);
  const [seqLen, setSeqLen] = useState(4000);
  const [concurrent, setConcurrent] = useState(64);
  const [gpuGb, setGpuGb] = useState(80);

  const perToken = kvBytesPerToken({
    layers,
    kvHeads,
    headDim,
    bytesPerValue: bytes,
  });
  const perRequest = perToken * seqLen;
  const total = perRequest * concurrent;
  const gpuBytes = gpuGb * 1024 ** 3;
  const share = total / gpuBytes;
  // Illustrative latency sketch: prefill ~ quadratic in seq, decode ~ linear
  // in batch. Normalized to “units” — teaches shape, not milliseconds.
  const prefillUnits = (seqLen / 1000) ** 2;
  const decodeUnits = (concurrent * seqLen) / 1000 / 64;

  const verdict =
    share > 1
      ? "DOES NOT FIT: KV alone exceeds one GPU — shard, quantize, or cut context"
      : share > 0.6
        ? "TIGHT: KV eats most of the card — little room left for weights + activations"
        : share > 0.3
          ? "WORKABLE: KV is significant — prefix caching and caps earn their keep here"
          : "COMFORTABLE: KV is a footnote at this shape — spend effort elsewhere";

  return (
    <LabShell
      title="KV Cache — why long context costs memory"
      predict="80 layers × 8 KV heads × 128 head-dim × fp16 × 4k tokens: roughly how many GB per request? Guess an order of magnitude first."
      task="Double the sequence length and watch per-request memory quadruple… no — double (linear in seq). Then raise concurrency and find where one 80GB card stops fitting."
      takeaway="KV memory is linear in layers × KV-heads × head-dim × bytes × tokens × concurrent requests. Full hidden dim only applies to non-grouped attention — modern GQA models carry a fraction of that. Every knob is multiplicative, so context limits are memory limits wearing a product mask."
      transfer="When someone proposes 1M-token context windows, redo this math before discussing anything else."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <LabSlider label="layers" value={layers} min={12} max={128} step={1} onChange={setLayers} />
        <LabSlider label="KV heads (GQA)" value={kvHeads} min={1} max={64} step={1} display={`${fmtInt.format(kvHeads)} (= hidden dim only if MHA)`} onChange={setKvHeads} />
        <LabSlider label="head dim" value={headDim} min={32} max={256} step={8} onChange={setHeadDim} />
        <LabSlider label="bytes per value" value={bytes} min={1} max={4} step={1} display={bytes === 2 ? "2 (fp16)" : `${bytes}`} onChange={setBytes} />
        <LabSlider label="sequence length" value={seqLen} min={512} max={128_000} step={512} display={`${fmtInt.format(seqLen)} tok`} onChange={setSeqLen} />
        <LabSlider label="concurrent requests" value={concurrent} min={1} max={1024} step={1} onChange={setConcurrent} />
        <LabSlider label="GPU memory" value={gpuGb} min={16} max={192} step={8} display={`${fmtInt.format(gpuGb)} GB`} onChange={setGpuGb} />
      </div>
      <dl>
        <LabStat label="KV per token" value={fmtBytes(perToken)} />
        <LabStat label="KV per request" value={fmtBytes(perRequest)} accent />
        <LabStat label={`KV fleet total (×${fmtInt.format(concurrent)})`} value={fmtBytes(total)} accent />
        <LabStat label="share of one GPU" value={`${fmt1.format(share * 100)} %`} accent />
        <LabStat label="prefill pressure ∝ seq²" value={`${fmt1.format(prefillUnits)} units (TTFT driver)`} />
        <LabStat label="decode pressure ∝ batch × seq" value={`${fmt1.format(decodeUnits)} units (ITL driver)`} />
      </dl>
      <LabBar label="KV share of GPU memory" value={share * 100} max={100} display={`${fmt1.format(Math.min(share, 1) * 100)} % used`} tone={share > 0.6 ? "warn" : "primary"} />
      <p role="status" className="rounded border border-primary/30 bg-primary/5 p-3 font-mono text-xs leading-5 text-foreground">
        {verdict}
      </p>
    </LabShell>
  );
}
