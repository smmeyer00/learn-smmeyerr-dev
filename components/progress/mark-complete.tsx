"use client";

import {
  chapterKey,
  isChapterComplete,
  toggleChapterComplete,
  useProgress,
} from "@/lib/progress";

/** Completion toggle for chapter pages. Local-only, no account. */
export function MarkComplete({
  courseSlug,
  chapterSlug,
}: {
  courseSlug: string;
  chapterSlug: string;
}) {
  const progress = useProgress();
  const key = chapterKey(courseSlug, chapterSlug);
  const complete = isChapterComplete(progress, key);

  return (
    <button
      type="button"
      onClick={() => toggleChapterComplete(key)}
      aria-pressed={complete}
      className="cursor-pointer font-mono text-xs underline decoration-border underline-offset-4 transition-colors hover:text-primary"
    >
      {complete ? (
        <span>
          <span className="text-primary">[✓]</span> complete — undo?
        </span>
      ) : (
        <span>[ mark complete ]</span>
      )}
    </button>
  );
}
