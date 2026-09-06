import type { ReactNode } from "react";

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
  return (
    <div className="mt-4 rounded-md border border-border p-5">
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-primary">
        interactive lab
      </p>
      <h3 className="mt-2 text-lg font-medium tracking-[-0.02em]">{title}</h3>

      <details className="group mt-4 border-t border-border pt-3">
        <summary className="cursor-pointer select-none font-mono text-xs text-primary transition-colors hover:text-foreground">
          [ 1 · predict first ]
        </summary>
        <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
          {predict}
        </p>
      </details>

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
      <p className="mt-1 font-mono text-[0.6875rem] leading-5 text-muted-foreground">
        pedagogical model — values are illustrative, not measured.
      </p>
    </div>
  );
}
