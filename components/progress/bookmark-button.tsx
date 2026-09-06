"use client";

import {
  chapterKey,
  isBookmarked,
  toggleBookmark,
  useProgress,
} from "@/lib/progress";

/** Bookmark toggle for chapter pages. Local-only, no account. */
export function BookmarkButton({
  courseSlug,
  chapterSlug,
}: {
  courseSlug: string;
  chapterSlug: string;
}) {
  const progress = useProgress();
  const key = chapterKey(courseSlug, chapterSlug);
  const saved = isBookmarked(progress, key);

  return (
    <button
      type="button"
      onClick={() => toggleBookmark(key)}
      aria-pressed={saved}
      className="cursor-pointer font-mono text-xs underline decoration-border underline-offset-4 transition-colors hover:text-primary"
    >
      {saved ? (
        <span>
          <span className="text-primary">[★]</span> saved — remove?
        </span>
      ) : (
        <span>[ bookmark ]</span>
      )}
    </button>
  );
}
