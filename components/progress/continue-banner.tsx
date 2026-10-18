"use client";

import Link from "next/link";
import { isChapterComplete, useProgress } from "@/lib/progress";
import { nextIncompleteChapter, type StudyChapter } from "@/lib/study";

export type ChapterTitleEntry = StudyChapter;

export function ContinueBanner({
  chapters,
}: {
  chapters: ChapterTitleEntry[];
}) {
  const progress = useProgress();
  const entry = chapters.find(
    (chapter) => chapter.key === progress.lastVisited,
  );
  if (!entry) return null;
  const done = isChapterComplete(progress, entry.key);
  const next = done
    ? nextIncompleteChapter(chapters, progress.completedChapters, entry.key)
    : undefined;
  const target = next ?? entry;
  const allDone = done && !next;

  return (
    <section
      aria-label="continue studying"
      className="mb-8 border-l-2 border-primary/60 pl-4"
    >
      <p className="font-mono text-xs uppercase tracking-wider text-primary">
        {allDone ? "course chapters complete" : done ? "up next" : "continue"}
      </p>
      <p className="mt-2 text-base leading-7">
        {target.courseTitle} —{" "}
        {allDone ? "return to practice" : target.chapterTitle}
      </p>
      <Link
        href={allDone ? "/drills" : "/" + target.key}
        className="mt-1 inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4"
      >
        {allDone
          ? "→ choose an interview drill"
          : done
            ? "→ start the next chapter"
            : "→ pick up where you left off"}
      </Link>
    </section>
  );
}
