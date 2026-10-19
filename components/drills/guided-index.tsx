"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { GuidedExerciseSummary } from "@/content/guided-exercises/types";
import { guidedReviewState } from "@/lib/guided-practice";
import { useProgress } from "@/lib/progress";

export function GuidedExerciseIndex({ exercises }: { exercises: GuidedExerciseSummary[] }) {
  const progress = useProgress();
  const [now, setNow] = useState(0);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setNow(Date.now()));
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    return () => { cancelAnimationFrame(frame); clearInterval(timer); };
  }, []);

  return (
    <ol className="divide-y border-y">
      {exercises.map((exercise, index) => {
        const state = progress.guidedExercises[exercise.id];
        const review = guidedReviewState(exercise, state, now);
        const inProgress = !!state && state.draft.stage !== "complete";
        const ready = exercise.prerequisites.every((prerequisite) => progress.completedChapters.includes(prerequisite.href.slice(1)));
        return (
          <li key={exercise.id} className="py-7">
            <p className="font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")} / {exercise.track} · ~{exercise.minutes} min</p>
            <h2 className="mt-3 text-2xl font-medium">{exercise.title}</h2>
            <p className="mt-3 text-base leading-7">{exercise.outcome}</p>
            <p className="mt-3 text-sm text-muted-foreground">Produce a worksheet, compare a worked answer, and save a specific revision.</p>
            <p className="mt-4 text-sm font-medium">{ready ? "Preparation marked complete" : "Useful after"}</p>
            <ul className="mt-1">
              {exercise.prerequisites.map((prerequisite) => (
                <li key={prerequisite.href}><Link href={prerequisite.href} className="inline-flex min-h-9 items-center text-sm text-muted-foreground underline underline-offset-4 hover:text-primary">{prerequisite.label} →</Link></li>
              ))}
            </ul>
            {state && <p className="mt-3 text-sm text-primary">{inProgress ? "Worksheet in progress" : review === "weak" ? "Next session: revisit your recorded gaps" : review === "due" ? "Ready for a 48-hour recall attempt" : "Reviewed attempt saved"}</p>}
            <Link href={"/drills/" + exercise.id} className="mt-4 inline-flex min-h-11 items-center rounded border border-primary/50 px-4 py-2 font-mono text-xs text-primary">
              {inProgress ? "Continue worksheet" : state ? "Review or repeat this case" : "Start guided exercise"} →
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
