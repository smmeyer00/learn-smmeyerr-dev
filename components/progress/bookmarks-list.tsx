"use client";

import Link from "next/link";
import { useProgress } from "@/lib/progress";
import type { ChapterTitleEntry } from "./continue-banner";

/**
 * Saved chapters on the course index. Titles arrive as serialized props so
 * the client bundle never imports the full course content.
 */
export function BookmarksList({
  chapters,
}: {
  chapters: ChapterTitleEntry[];
}) {
  const progress = useProgress();
  const saved = chapters.filter((c) => progress.bookmarks.includes(c.key));
  if (saved.length === 0) return null;

  return (
    <div className="mt-10 border-t pt-5">
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
        saved · {String(saved.length).padStart(2, "0")}
      </p>
      <ul className="mt-3 space-y-2">
        {saved.map((entry) => {
          const [courseSlug, ...rest] = entry.key.split("/");
          const href = `/${courseSlug}/${rest.join("/")}`;
          const hasNote =
            (progress.notes[entry.key] ?? "").length > 0 ? " · noted" : "";
          return (
            <li key={entry.key} className="font-mono text-xs">
              <span className="mr-2 text-primary">★</span>
              <Link
                href={href}
                className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
              >
                {entry.chapterTitle.toLowerCase()}
              </Link>
              <span>
                {"//"} {entry.courseSlug}
                {hasNote}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
