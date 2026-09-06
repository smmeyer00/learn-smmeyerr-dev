"use client";

import { useEffect } from "react";
import { chapterKey, recordVisit } from "@/lib/progress";

/** Null-rendering island that records a chapter view on mount. */
export function TrackVisit({
  courseSlug,
  chapterSlug,
}: {
  courseSlug: string;
  chapterSlug: string;
}) {
  useEffect(() => {
    recordVisit(chapterKey(courseSlug, chapterSlug));
  }, [courseSlug, chapterSlug]);
  return null;
}
