"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buildRedoQueue } from "@/content/drills";
import { useProgress } from "@/lib/progress";
import { guidedReviewState } from "@/lib/guided-practice";
import type { GuidedExerciseSummary } from "@/content/guided-exercises/types";
import {
  chapterReviewQueue,
  type ChapterReview,
  type StudyChapter,
} from "@/lib/study";

function ReviewLink({ row }: { row: ChapterReview }) {
  return (
    <li>
      <Link
        href={`/${row.key}#retrieval`}
        className="inline-flex min-h-11 items-center text-sm text-foreground underline decoration-border underline-offset-4 hover:text-primary"
      >
        {row.chapterTitle}
      </Link>
      <span className="ml-2 font-mono text-xs text-muted-foreground">
        {row.reason === "rebuild"
          ? "rebuild the explanation"
          : row.reason === "quiz"
            ? "revisit a missed check"
            : "48-hour recall"}
      </span>
    </li>
  );
}

export function PracticeQueue({
  chapters,
  includeDrills = true,
  guidedExercises = [],
}: {
  chapters: StudyChapter[];
  includeDrills?: boolean;
  guidedExercises?: GuidedExerciseSummary[];
}) {
  const progress = useProgress();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setNow(Date.now()));
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(timer);
    };
  }, []);

  const chapterRows = chapterReviewQueue(chapters, progress, now ?? 0);
  const drillRows = includeDrills
    ? buildRedoQueue(progress.drillAttempts, now ?? 0).filter(
        (row) => row.state === "weak" || row.state === "due",
      )
    : [];
  const guidedRows = guidedExercises.map((exercise) => ({
    exercise,
    state: guidedReviewState(exercise, progress.guidedExercises[exercise.id], now ?? 0),
  })).filter((row) => row.state === "weak" || row.state === "due");
  if (chapterRows.length === 0 && drillRows.length === 0 && guidedRows.length === 0) return null;

  return (
    <section
      aria-labelledby="practice-due-title"
      className="mb-10 border-l-2 border-primary/60 pl-4"
    >
      <h2
        id="practice-due-title"
        className="font-mono text-xs uppercase tracking-wider text-primary"
      >
        practice to revisit
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Try from memory before reopening your notes. Weak work comes first;
        other practice returns after 48 hours.
      </p>
      <ul className="mt-3 space-y-2">
        {chapterRows.slice(0, 3).map((row) => (
          <ReviewLink key={row.key} row={row} />
        ))}
      </ul>
      {guidedRows.length > 0 && (
        <ul className="mt-3 space-y-2">
          {guidedRows.map(({ exercise, state }) => (
            <li key={exercise.id}>
              <Link href={"/drills/" + exercise.id} className="inline-flex min-h-11 items-center text-sm text-foreground underline underline-offset-4 hover:text-primary">
                {exercise.title}
              </Link>
              <span className="ml-2 text-xs text-muted-foreground">{state === "weak" ? "guided practice · revisit recorded gaps" : "guided practice · 48-hour recall"}</span>
            </li>
          ))}
        </ul>
      )}
      {chapterRows.length > 3 && (
        <details className="mt-2">
          <summary className="min-h-11 cursor-pointer text-sm text-muted-foreground">
            Show {chapterRows.length - 3} more chapter reviews
          </summary>
          <ul className="space-y-2">
            {chapterRows.slice(3).map((row) => (
              <ReviewLink key={row.key} row={row} />
            ))}
          </ul>
        </details>
      )}
      {drillRows.length > 0 && (
        <Link
          href="/drills#redo-queue"
          className="mt-2 inline-flex min-h-11 items-center font-mono text-xs text-primary underline underline-offset-4"
        >
          {drillRows.length} interview {drillRows.length === 1 ? "rep" : "reps"}{" "}
          to revisit →
        </Link>
      )}
    </section>
  );
}
