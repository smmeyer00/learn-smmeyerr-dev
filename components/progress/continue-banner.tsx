"use client";

import Link from "next/link";
import { isChapterComplete, useProgress } from "@/lib/progress";

export type ChapterTitleEntry = {
  key: string;
  courseSlug: string;
  courseTitle: string;
  chapterTitle: string;
};

/**
 * "Continue where you left off" banner for the course index.
 * Titles arrive as serialized props so the client bundle never imports
 * the full course content. Hidden until a visit is recorded.
 */
export function ContinueBanner({
  chapters,
}: {
  chapters: ChapterTitleEntry[];
}) {
  const progress = useProgress();
  const { lastVisited } = progress;
  const entry = chapters.find((c) => c.key === lastVisited);
  if (!entry) return null;

  const done = isChapterComplete(progress, entry.key);
  const [courseSlug, ...rest] = entry.key.split("/");
  const chapterSlug = rest.join("/");
  const href = done ? `/${courseSlug}` : `/${courseSlug}/${chapterSlug}`;

  return (
    <div className="mb-10 rounded-md border border-primary/30 bg-primary/5 p-5">
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-primary">
        {done ? "last completed" : "continue"}
      </p>
      <p className="mt-2 text-sm leading-6 text-foreground">
        {entry.courseTitle} — {entry.chapterTitle}
        {done && <span className="text-muted-foreground"> ✓</span>}
      </p>
      <Link
        href={href}
        className="mt-2 inline-block font-mono text-xs text-primary underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
      >
        {done ? "→ back to the course" : "→ pick up where you left off"}
      </Link>
    </div>
  );
}
