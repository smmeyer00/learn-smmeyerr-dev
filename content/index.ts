import { systemDesign } from "./system-design";
import { llmEngineering } from "./llm-engineering";
import type { Course, Chapter } from "./types";

export type { Course, Chapter } from "./types";

export const courses: Course[] = [systemDesign, llmEngineering];

export function getCourse(slug: string): Course | undefined {
  return courses.find((course) => course.slug === slug);
}

export function getChapter(
  courseSlug: string,
  chapterSlug: string,
): { course: Course; chapter: Chapter } | undefined {
  const course = getCourse(courseSlug);
  const chapter = course?.chapters.find((c) => c.slug === chapterSlug);
  if (!course || !chapter) return undefined;
  return { course, chapter };
}
