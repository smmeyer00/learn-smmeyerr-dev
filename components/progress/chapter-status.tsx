"use client";

import { chapterKey, isChapterComplete, useProgress } from "@/lib/progress";

/**
 * Per-chapter completion mark for course index rows.
 * Renders nothing extra until the chapter is complete (SSR-neutral).
 */
export function ChapterStatus({
  courseSlug,
  chapterSlug,
}: {
  courseSlug: string;
  chapterSlug: string;
}) {
  const progress = useProgress();
  const complete = isChapterComplete(
    progress,
    chapterKey(courseSlug, chapterSlug),
  );
  if (!complete) return null;
  return (
    <span className="text-primary" title="complete" aria-label="complete">
      ✓{" "}
    </span>
  );
}
