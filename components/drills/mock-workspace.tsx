"use client";

import { useEffect, useRef, useState } from "react";
import {
  MOCK_TOTAL_MINUTES,
  drawScenario,
  mockPhases,
  randomSeed,
  scoreAxes,
} from "@/content/drills";
import { recordDrillAttempt } from "@/lib/progress";

function fmtClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Phase boundaries in elapsed seconds, precomputed once. */
const phasesWithBounds = (() => {
  let cursor = 0;
  return mockPhases.map((p) => {
    const start = cursor;
    cursor += p.minutes * 60;
    return { ...p, start, end: cursor };
  });
})();

/**
 * Timed 50-minute mock workspace: pick (or draw) a scenario, run the phased
 * flow with time warnings, then self-score 1–4 on five axes. Saved locally.
 */
export function MockWorkspace() {
  const [scenarioTitle, setScenarioTitle] = useState("Public AI API");
  const [secondsLeft, setSecondsLeft] = useState(MOCK_TOTAL_MINUTES * 60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [scores, setScores] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const elapsed = MOCK_TOTAL_MINUTES * 60 - secondsLeft;

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  function start() {
    if (timer.current) clearInterval(timer.current);
    setRunning(true);
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    timer.current = id;
  }

  function pause() {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setRunning(false);
  }

  function reset() {
    pause();
    setSecondsLeft(MOCK_TOTAL_MINUTES * 60);
    setDone({});
    setScores({});
    setSaved(false);
  }

  // Phase boundaries in elapsed seconds.
  const phases = phasesWithBounds;
  const currentIndex = phases.findIndex(
    (p) => elapsed < p.end,
  );
  const activePhase = currentIndex === -1 ? phases.length - 1 : currentIndex;

  const allScored = scoreAxes.every((a) => scores[a.id] !== undefined);
  const avg =
    Object.values(scores).reduce((s, v) => s + v, 0) /
    Math.max(Object.values(scores).length, 1);

  function save() {
    recordDrillAttempt({
      drillId: `mock:${scenarioTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      completedAt: new Date().toISOString(),
      score: Math.round(avg),
      note: `mock: ${scenarioTitle} — ${scoreAxes.map((a) => `${a.id} ${scores[a.id] ?? "-"}`).join(", ")}`,
    });
    setSaved(true);
  }

  return (
    <div className="grid gap-8">
      <section aria-label="mock setup" className="flex flex-wrap items-end gap-3">
        <div className="min-w-52 flex-1">
          <label htmlFor="mock-scenario" className="font-mono text-[0.6875rem] text-muted-foreground">
            scenario
          </label>
          <input
            id="mock-scenario"
            value={scenarioTitle}
            onChange={(e) => setScenarioTitle(e.target.value)}
            className="mt-1.5 w-full rounded border border-border bg-secondary/40 px-3 py-2 font-mono text-xs text-foreground focus:border-primary/60 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => setScenarioTitle(drawScenario(randomSeed()).scenario.title)}
          className="cursor-pointer rounded border border-border px-3 py-2 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
        >
          [ draw random ]
        </button>
      </section>

      <section aria-label="timer" className="rounded-md border border-border p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="font-mono text-4xl tabular-nums text-foreground" role="timer" aria-live="off">
            {fmtClock(secondsLeft)}
          </p>
          <p className="font-mono text-xs text-primary">
            {secondsLeft === 0
              ? "time — close with risks + recap"
              : `phase ${activePhase + 1}/${phases.length}: ${phases[activePhase].label}`}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {!running ? (
            <button type="button" onClick={start} className="cursor-pointer rounded border border-primary/50 bg-primary/5 px-4 py-1.5 font-mono text-xs text-foreground hover:text-primary">
              [ {elapsed > 0 ? "resume" : "start 50:00"} ]
            </button>
          ) : (
            <button type="button" onClick={pause} className="cursor-pointer rounded border border-border px-4 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground">
              [ pause ]
            </button>
          )}
          <button type="button" onClick={reset} className="cursor-pointer font-mono text-[0.6875rem] text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground">
            reset workspace
          </button>
        </div>
        <ol className="mt-5 space-y-4">
          {phases.map((phase, i) => {
            const state =
              i < activePhase || secondsLeft === 0
                ? "past"
                : i === activePhase
                  ? "active"
                  : "upcoming";
            return (
              <li key={phase.id} className={`rounded border p-4 ${state === "active" ? "border-primary/50 bg-primary/5" : "border-border"}`}>
                <p className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-xs">
                  <span className={state === "active" ? "text-primary" : "text-foreground"}>
                    {state === "past" ? "✓ " : state === "active" ? "→ " : ""}
                    {phase.label}
                  </span>
                  <span className="text-muted-foreground">{phase.minutes} min</span>
                </p>
                <ul className="mt-2 space-y-1.5">
                  {phase.checklist.map((item) => {
                    const key = `${phase.id}:${item}`;
                    const checked = !!done[key];
                    return (
                      <li key={key}>
                        <label className="flex cursor-pointer items-baseline gap-2.5 text-sm leading-6 text-muted-foreground">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setDone((d) => ({ ...d, [key]: !d[key] }))
                            }
                            className="translate-y-px accent-(--color-primary)"
                          />
                          <span className={checked ? "line-through opacity-70" : ""}>
                            {item}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-label="self scorecard" className="rounded-md border border-border p-5">
        <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-primary">
          self-scorecard · 1–4 per axis
        </h2>
        <div className="mt-4 grid gap-4">
          {scoreAxes.map((axis) => (
            <div key={axis.id}>
              <p className="font-mono text-xs text-foreground">
                {axis.label}
                <span className="ml-3 text-muted-foreground">{axis.prompt}</span>
              </p>
              <div className="mt-1.5 flex gap-2" role="group" aria-label={`score ${axis.label}`}>
                {[1, 2, 3, 4].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => {
                      setScores((s) => ({ ...s, [axis.id]: v }));
                      setSaved(false);
                    }}
                    aria-pressed={scores[axis.id] === v}
                    className={`cursor-pointer rounded border px-3 py-1 font-mono text-xs transition-colors ${scores[axis.id] === v ? "border-primary/50 bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={save}
            disabled={!allScored}
            className="cursor-pointer rounded border border-primary/50 bg-primary/5 px-4 py-1.5 font-mono text-xs text-foreground transition-colors hover:text-primary disabled:cursor-default disabled:opacity-40"
          >
            [ save mock — avg {allScored ? avg.toFixed(1) : "–"}/4 ]
          </button>
          {!allScored && (
            <span className="font-mono text-[0.6875rem] text-muted-foreground">
              score all five axes to save
            </span>
          )}
        </div>
        {saved && (
          <p role="status" className="mt-3 font-mono text-xs text-primary">
            saved ✓ — weak mocks (≤ 2) join the redo queue on /drills; redo the weakest axis after 48 hours.
          </p>
        )}
      </section>
    </div>
  );
}
