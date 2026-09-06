"use client";

import type { ReactNode } from "react";

export const fmtInt = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});
export const fmt1 = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});
export const fmt2 = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

export function fmtBytes(bytes: number): string {
  if (bytes < 1024) return `${fmtInt.format(bytes)} B`;
  const units = ["KB", "MB", "GB", "TB", "PB"];
  let v = bytes;
  let u = -1;
  while (v >= 1024 && u < units.length - 1) {
    v /= 1024;
    u++;
  }
  return `${fmt1.format(v)} ${units[u]}`;
}

/** Labeled slider with a text readout (screen-reader + print friendly). */
export function LabSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  display?: string;
  onChange: (value: number) => void;
}) {
  const id = `lab-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="font-mono text-xs text-foreground">
          {label}
        </label>
        <output
          htmlFor={id}
          className="font-mono text-xs tabular-nums text-primary"
        >
          {display ?? `${fmtInt.format(value)}${unit ? ` ${unit}` : ""}`}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1.5 w-full accent-(--color-primary)"
      />
    </div>
  );
}

/** Text-labeled bar (never color-alone): value + caption always rendered. */
export function LabBar({
  label,
  value,
  max,
  display,
  tone = "primary",
}: {
  label: string;
  value: number;
  max: number;
  display: string;
  tone?: "primary" | "muted" | "warn";
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const bar =
    tone === "primary"
      ? "bg-primary"
      : tone === "warn"
        ? "bg-destructive"
        : "bg-muted-foreground";
  return (
    <div role="img" aria-label={`${label}: ${display}`}>
      <div className="flex items-baseline justify-between gap-4 font-mono text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular-nums text-foreground">{display}</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded bg-secondary">
        <div className={`h-full ${bar}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/** Key-value readout row used for computed outputs. */
export function LabStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-2 font-mono text-xs">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={`tabular-nums ${accent ? "text-primary" : "text-foreground"}`}>
        {value}
      </dd>
    </div>
  );
}

export function LabNote({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 border-l-2 border-primary/60 pl-3 text-sm leading-6 text-foreground">
      {children}
    </p>
  );
}
