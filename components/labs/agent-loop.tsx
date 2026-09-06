"use client";

import { useState } from "react";
import { LabShell } from "./lab-shell";
import { LabStat, fmtInt } from "./ui";

type Step = {
  phase: "plan" | "tool call" | "observation" | "verdict";
  text: string;
  tokens: number;
};

const healthyTrace: Step[] = [
  { phase: "plan", text: "Goal: refund order #481. Policy: verify identity, then ledger, then issue.", tokens: 180 },
  { phase: "tool call", text: "get_order(id=481) — schema-validated, read-only, no approval needed.", tokens: 60 },
  { phase: "observation", text: "Order found: $84.20, delivered, within 30-day window. Eligible.", tokens: 40 },
  { phase: "plan", text: "Identity verified via session. Next: issue refund through payments tool.", tokens: 90 },
  { phase: "tool call", text: "issue_refund(order=481, amount=84.20) — write path: approval token attached, idempotency key ord-481.", tokens: 70 },
  { phase: "observation", text: "Refund accepted: txn r_9912. Ledger updated.", tokens: 30 },
  { phase: "verdict", text: "Done in 6 steps. Every write was authorized, validated, idempotent, and audited.", tokens: 50 },
];

const loopingTrace: Step[] = [
  { phase: "plan", text: "Goal: refund order #481. Start with order lookup.", tokens: 120 },
  { phase: "tool call", text: "get_order(id=481) — schema-validated, read-only.", tokens: 60 },
  { phase: "observation", text: "ERROR: payments API timeout after 30s. No state changed.", tokens: 30 },
  { phase: "plan", text: "Transient error suspected. Retry the same call.", tokens: 60 },
  { phase: "tool call", text: "get_order(id=481) — identical arguments, no backoff, no new information.", tokens: 60 },
  { phase: "observation", text: "ERROR: payments API timeout after 30s. No state changed.", tokens: 30 },
  { phase: "plan", text: "Still failing. Retry once more before escalating.", tokens: 60 },
  { phase: "tool call", text: "get_order(id=481) — third identical call. NON-PROGRESS: same action, same outcome.", tokens: 60 },
  { phase: "observation", text: "ERROR: timeout. Budget burned, customer waiting, nothing learned.", tokens: 30 },
  { phase: "verdict", text: "Oscillation detected at repeat #3. Correct behavior: back off, check status, escalate with the partial trace.", tokens: 60 },
];

/**
 * Tool Lifecycle + Agent Loop Console (llm-engineering ch. 6 + 7).
 * Step-through traces: a healthy tool lifecycle vs an oscillating loop.
 * No timers — stepping is manual, so reduced-motion is safe by construction.
 */
export function AgentLoop() {
  const [faulty, setFaulty] = useState(false);
  const [cursor, setCursor] = useState(1);

  const trace = faulty ? loopingTrace : healthyTrace;
  const shown = trace.slice(0, cursor);
  const spent = shown.reduce((s, st) => s + st.tokens, 0);
  const repeats = shown.filter(
    (st) => st.phase === "tool call" && st.text.startsWith("get_order"),
  ).length;
  const oscillating = faulty && repeats >= 3;

  function reset(next: boolean) {
    setFaulty(next);
    setCursor(1);
  }

  return (
    <LabShell
      title="Agent Loop Console — healthy lifecycle vs oscillation"
      predict="How many identical failed tool calls before you would halt the loop? Pick your number, then run the faulty trace."
      task="Step through the healthy trace: plan → validate → authorize → execute → observe. Then switch to the faulty trace and watch the repeat counter."
      takeaway="An agent is a loop with budgets. Progress means new information per step; the same action with the same outcome three times is non-progress, and the loop must stop itself."
      transfer="Every retry policy, cron job, and reconciliation loop needs the same three things: a repeat counter, a budget, and an escalation path."
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="trace select">
        <button
          type="button"
          onClick={() => reset(false)}
          aria-pressed={!faulty}
          className={`cursor-pointer rounded border px-3 py-1.5 font-mono text-xs transition-colors ${!faulty ? "border-primary/50 bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
        >
          healthy lifecycle
        </button>
        <button
          type="button"
          onClick={() => reset(true)}
          aria-pressed={faulty}
          className={`cursor-pointer rounded border px-3 py-1.5 font-mono text-xs transition-colors ${faulty ? "border-primary/50 bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
        >
          faulty loop (timeout retries)
        </button>
      </div>
      <ol className="space-y-2" aria-live="polite" aria-label="agent trace">
        {shown.map((step, i) => (
          <li key={i} className="rounded border border-border bg-secondary/40 px-3 py-2">
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-primary">
              {String(i + 1).padStart(2, "0")} · {step.phase} · {step.tokens} tok
            </p>
            <p className="mt-1 text-sm leading-6 text-foreground">{step.text}</p>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setCursor((c) => Math.min(c + 1, trace.length))}
          disabled={cursor >= trace.length}
          className="cursor-pointer rounded border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground disabled:cursor-default disabled:opacity-40"
        >
          {cursor >= trace.length ? "[ trace complete ]" : "[ step → ]"}
        </button>
        <button
          type="button"
          onClick={() => setCursor(1)}
          className="cursor-pointer font-mono text-[0.6875rem] text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
        >
          restart trace
        </button>
      </div>
      <dl>
        <LabStat label="steps shown" value={`${cursor}/${trace.length}`} />
        <LabStat label="tokens spent" value={fmtInt.format(spent)} />
        <LabStat label="identical tool repeats" value={faulty ? `${repeats}× get_order` : "0 — every call advanced state"} accent />
      </dl>
      {oscillating && (
        <p role="alert" className="rounded border border-destructive/50 bg-destructive/5 p-3 font-mono text-xs leading-5 text-foreground">
          ✗ oscillation detected: same action ×3 with zero new information — halt, back off, escalate with the trace.
        </p>
      )}
    </LabShell>
  );
}
