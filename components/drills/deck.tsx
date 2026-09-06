"use client";

import { useMemo, useState } from "react";
import {
  constraintDecks,
  drawScenario,
  drillScenarios,
  fluencyPrompts,
  randomSeed,
  type DrawnScenario,
} from "@/content/drills";
import {
  recordDrillAttempt,
  useProgress,
  type DrillAttempt,
} from "@/lib/progress";

const DAY_MS = 86_400_000;

type QueueState = "weak" | "due" | "fresh" | "new";

function queueState(
  attempts: DrillAttempt[],
  drillId: string,
  now: number,
): { state: QueueState; lastScore?: number; lastAt?: number } {
  const mine = attempts.filter((a) => a.drillId === drillId);
  if (mine.length === 0) return { state: "new" };
  const last = mine[mine.length - 1];
  const lastAt = Date.parse(last.completedAt);
  if (last.score !== undefined && last.score <= 2)
    return { state: "weak", lastScore: last.score, lastAt };
  if (Number.isNaN(lastAt) || now - lastAt > 2 * DAY_MS)
    return { state: "due", lastScore: last.score, lastAt };
  return { state: "fresh", lastScore: last.score, lastAt };
}

const stateLabel: Record<QueueState, string> = {
  weak: "redo — scored weak",
  due: "due — 48h+ since attempt",
  fresh: "practiced",
  new: "not yet attempted",
};

/** Countdown + prompt cycler for oral fluency reps. No animation involved. */
function FluencyTimer() {
  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [timer, setTimer] = useState<ReturnType<typeof setInterval> | null>(null);

  const current = fluencyPrompts[index];

  function start() {
    if (timer) clearInterval(timer);
    setSecondsLeft(current.minutes * 60);
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s === null || s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    setTimer(id);
  }

  function stop() {
    if (timer) clearInterval(timer);
    setTimer(null);
    setSecondsLeft(null);
  }

  const mm = secondsLeft === null ? null : Math.floor(secondsLeft / 60);
  const ss = secondsLeft === null ? null : secondsLeft % 60;

  return (
    <div className="rounded-md border border-border p-5">
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
        oral fluency · {current.minutes} min
      </p>
      <p className="mt-2 text-sm leading-6 text-foreground">{current.prompt}</p>
      <p className="mt-3 font-mono text-2xl tabular-nums text-primary" role="timer" aria-live="off">
        {mm === null ? `${current.minutes}:00` : `${mm}:${String(ss).padStart(2, "0")}`}
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        <button type="button" onClick={start} className="cursor-pointer rounded border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground">
          [ start ]
        </button>
        <button type="button" onClick={stop} className="cursor-pointer rounded border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground">
          [ stop ]
        </button>
        <button
          type="button"
          onClick={() => {
            stop();
            setIndex((i) => (i + 1) % fluencyPrompts.length);
          }}
          className="cursor-pointer font-mono text-[0.6875rem] text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
        >
          next prompt →
        </button>
      </div>
      {secondsLeft === 0 && (
        <p role="status" className="mt-3 font-mono text-xs text-primary">
          time — stop talking, then redo tighter.
        </p>
      )}
    </div>
  );
}

/**
 * Drill deck: 20 scenarios, 7 constraint decks, reproducible seeds,
 * attempt logging, and the 48-hour redo queue. All local.
 */
export function DrillDeck() {
  const progress = useProgress();
  const [seedText, setSeedText] = useState("");
  const [draw, setDraw] = useState<DrawnScenario | null>(null);
  const [logged, setLogged] = useState(false);
  const [now] = useState(() => Date.now());
  const queue = useMemo(
    () =>
      drillScenarios
        .map((s) => ({ scenario: s, ...queueState(progress.drillAttempts, s.id, now) }))
        .sort((a, b) => {
          const rank: Record<QueueState, number> = { weak: 0, new: 1, due: 2, fresh: 3 };
          return rank[a.state] - rank[b.state];
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [progress.drillAttempts],
  );

  function roll(seed: number) {
    setDraw(drawScenario(seed));
    setLogged(false);
  }

  function logAttempt(score?: number) {
    if (!draw) return;
    recordDrillAttempt({
      drillId: draw.scenario.id,
      completedAt: new Date().toISOString(),
      ...(score !== undefined ? { score } : {}),
      note: draw.cards.map((c) => `${c.deck}: ${c.card}`).join(" · "),
    });
    setLogged(true);
  }

  return (
    <div className="grid gap-10">
      <section aria-label="drill draw">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => roll(randomSeed())}
            className="cursor-pointer rounded border border-primary/50 bg-primary/5 px-4 py-2 font-mono text-xs text-foreground transition-colors hover:text-primary"
          >
            [ draw scenario ]
          </button>
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const seed = Number(seedText);
              if (Number.isInteger(seed)) roll(seed);
            }}
          >
            <label htmlFor="drill-seed" className="font-mono text-[0.6875rem] text-muted-foreground">
              seed
            </label>
            <input
              id="drill-seed"
              value={seedText}
              onChange={(e) => setSeedText(e.target.value)}
              inputMode="numeric"
              placeholder="replay a draw"
              className="w-36 rounded border border-border bg-secondary/40 px-2 py-1.5 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none"
            />
          </form>
        </div>

        {draw ? (
          <div className="mt-5 rounded-md border border-border p-5" aria-live="polite">
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-primary">
              {draw.scenario.track} · seed {draw.seed}
            </p>
            <h2 className="mt-2 text-2xl font-medium tracking-[-0.025em]">
              {draw.scenario.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Focus: {draw.scenario.focus}
            </p>
            <dl className="mt-4 border-t font-mono text-xs leading-6">
              {draw.cards.map((c) => (
                <div key={c.deck} className="grid gap-x-6 border-b py-2 sm:grid-cols-[8rem_minmax(0,1fr)]">
                  <dt className="text-muted-foreground">{c.deck}</dt>
                  <dd className="text-foreground/90">{c.card}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 font-mono text-[0.6875rem] text-muted-foreground">
              run the 50-minute arc; at minute 20 the failure card is already on the table.
            </p>
            {!logged ? (
              <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="log attempt with self score">
                <span className="font-mono text-[0.6875rem] text-muted-foreground">log rep:</span>
                {[1, 2, 3, 4].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => logAttempt(s)}
                    className="cursor-pointer rounded border border-border px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => logAttempt(undefined)}
                  className="cursor-pointer font-mono text-[0.6875rem] text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
                >
                  no score
                </button>
              </div>
            ) : (
              <p role="status" className="mt-4 font-mono text-xs text-primary">
                logged ✓ — weak scores (1–2) join the redo queue below.
              </p>
            )}
          </div>
        ) : (
          <p className="mt-5 font-mono text-xs leading-6 text-muted-foreground">
            Draw to get one scenario plus seven constraint cards. Same seed replays the exact draw — redo it after 48
            hours without reviewing the old diagram.
          </p>
        )}
      </section>

      <section aria-label="redo queue">
        <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-primary">
          48-hour redo queue
        </h2>
        <ol className="mt-3 border-t">
          {queue.map(({ scenario, state, lastScore }) => (
            <li key={scenario.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b py-2.5">
              <p className="text-sm text-foreground">
                <button
                  type="button"
                  onClick={() => {
                    roll(randomSeed());
                    setDraw((d) =>
                      d
                        ? { ...d, scenario }
                        : d,
                    );
                  }}
                  className="cursor-pointer underline decoration-border underline-offset-4 transition-colors hover:text-primary"
                >
                  {scenario.title}
                </button>
                <span className="ml-3 font-mono text-[0.6875rem] text-muted-foreground">
                  {scenario.track}
                  {lastScore !== undefined && ` · last ${lastScore}/4`}
                </span>
              </p>
              <p className={`font-mono text-[0.6875rem] ${state === "weak" ? "text-destructive" : state === "fresh" ? "text-muted-foreground" : "text-primary"}`}>
                {state === "weak" ? "✗ " : state === "fresh" ? "✓ " : "→ "}
                {stateLabel[state]}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-label="constraint decks">
        <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-primary">
          constraint decks
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {constraintDecks.map((deck) => (
            <details key={deck.id} className="rounded border border-border p-4">
              <summary className="cursor-pointer select-none font-mono text-xs text-foreground">
                {deck.label} · {deck.cards.length} cards
              </summary>
              <ul className="mt-2 space-y-1 font-mono text-[0.6875rem] leading-5 text-muted-foreground">
                {deck.cards.map((card) => (
                  <li key={card}>· {card}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>

      <section aria-label="oral fluency">
        <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-primary">
          oral fluency circuit
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Out loud, timed, no pauses. Seniority is audible: short sentences, named tradeoffs, explicit risks.
        </p>
        <div className="mt-4">
          <FluencyTimer />
        </div>
      </section>
    </div>
  );
}
