"use client";

import { useId, useState, type ReactNode } from "react";
import { useHydrated } from "@/lib/use-hydrated";

/**
 * Consistent shell for every interactive lab: predict → manipulate →
 * observe → explain → transfer. Static updates only (no animation), full
 * text readouts for every visual, values labeled illustrative where they
 * teach with pedagogical numbers instead of measured ones.
 */
export function LabShell({
  title,
  predict,
  task,
  takeaway,
  transfer,
  children,
}: {
  title: string;
  /** prediction prompt the learner commits to before touching controls */
  predict: string;
  /** what to do with the controls */
  task: string;
  /** the point, revealed after experimenting */
  takeaway: string;
  /** where else this judgment applies */
  transfer: string;
  children: ReactNode;
}) {
  const id = useId();
  const hydrated = useHydrated();
  const [prediction, setPrediction] = useState("");
  const [committed, setCommitted] = useState(false);
  return (
    <div className="mt-4 rounded-md border border-border p-5">
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-primary">
        interactive lab
      </p>
      <h3 className="mt-2 text-lg font-medium tracking-[-0.02em]">{title}</h3>

      <p className="mt-4 font-mono text-xs text-primary">1 · predict first</p>
      <p className="mt-2 text-sm leading-6 text-foreground">{predict}</p>
      {committed ? (
        <div className="mt-3 border-l-2 border-primary/50 pl-3">
          <p className="font-mono text-xs text-muted-foreground">
            your prediction
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm leading-6">
            {prediction}
          </p>
        </div>
      ) : (
        <form
          className="mt-3 print:hidden"
          onSubmit={(event) => {
            event.preventDefault();
            if (prediction.trim()) setCommitted(true);
          }}
        >
          <label htmlFor={id} className="block text-sm">
            Your prediction and assumption
          </label>
          <textarea
            id={id}
            value={prediction}
            onChange={(event) => setPrediction(event.target.value)}
            rows={2}
            required
            disabled={!hydrated}
            placeholder="A number, direction, or short explanation is enough."
            className="mt-2 w-full rounded border bg-secondary/40 p-3 text-sm leading-6"
          />
          <button
            type="submit"
            disabled={!prediction.trim()}
            className="mt-2 min-h-11 cursor-pointer rounded border border-primary/50 px-3 font-mono text-xs text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            save prediction & explore
          </button>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            A guess makes the comparison useful. This lab draft lasts until you
            leave the page.
          </p>
        </form>
      )}

      {committed && (
        <>
          <div className="mt-4">
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
              2 · manipulate + observe
            </p>
            <p className="mt-2 text-sm leading-6 text-foreground">{task}</p>
            <div className="mt-4 grid gap-5">{children}</div>
          </div>

          <details className="mt-4 border-t border-border pt-3">
            <summary className="cursor-pointer select-none font-mono text-xs text-primary transition-colors hover:text-foreground">
              [ 3 · explain — takeaway ]
            </summary>
            <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
              {takeaway}
            </p>
          </details>

          <p className="mt-3 font-mono text-[0.6875rem] leading-5 text-muted-foreground">
            transfer: {transfer}
          </p>
        </>
      )}
      <p className="mt-1 font-mono text-[0.6875rem] leading-5 text-muted-foreground">
        pedagogical model — values are illustrative, not measured.
      </p>
    </div>
  );
}
