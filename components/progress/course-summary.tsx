"use client";

import { countCompleted, useProgress } from "@/lib/progress";

/** Per-course completion tally for the top-level course index. */
export function CourseSummary({
  courseSlug,
  total,
}: {
  courseSlug: string;
  total: number;
}) {
  const progress = useProgress();
  const done = countCompleted(progress, courseSlug);
  if (done === 0) return null;
  const pct = Math.round((done / total) * 100);
  return (
    <p className="text-primary">
      {String(done).padStart(2, "0")}/{String(total).padStart(2, "0")} · {pct}%
    </p>
  );
}
