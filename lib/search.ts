/**
 * Build-time search index. Browser matching lives in search-matching.ts so
 * importing the matcher cannot pull the curriculum into a client bundle.
 *
 * The index is computed on the server (root layout) from static content and
 * passed to the palette as serialized props — no runtime fetching, no
 * external dependency. Matching is a small subsequence fuzzy scorer.
 */

import { courses } from "@/content";
import { glossary, slugifyTerm } from "@/content/glossary";
import { drillScenarios } from "@/content/drills";
import { manual } from "@/content/manual";
import { guidedExerciseSummaries } from "@/content/guided-exercises";

import type { SearchEntry } from "./search-matching";
export { searchEntries } from "./search-matching";
export type { SearchEntry, SearchKind } from "./search-matching";

export function buildSearchIndex(extra: SearchEntry[] = []): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const course of courses) {
    for (const chapter of course.chapters) {
      entries.push({
        kind: "chapter",
        title: chapter.title,
        detail: `${course.slug} · ch ${chapter.order} · ~${chapter.hours}h practice`,
        href: `/${course.slug}/${chapter.slug}`,
        text: [
          chapter.title,
          chapter.outcome,
          chapter.phase,
          chapter.depth,
          ...chapter.coverage,
          ...chapter.lessons.map((l) => l.title),
          chapter.studyGuide.example.title,
          chapter.studyGuide.assignment.deliverable,
          course.practiceProject.title,
          chapter.studyGuide.cumulativePractice.deliverable,
          ...chapter.studyGuide.recall.map((question) => question.prompt),
          chapter.drill.prompt,
          ...chapter.drill.constraints,
        ]
          .join("\n")
          .toLowerCase(),
      });
    }
  }

  for (const term of glossary) {
    entries.push({
      kind: "glossary",
      title: term.term,
      detail: "glossary",
      href: `/glossary#${slugifyTerm(term.term)}`,
      text: `${term.term}\n${term.definition}`.toLowerCase(),
    });
  }

  for (const scenario of drillScenarios) {
    entries.push({
      kind: "drill",
      title: scenario.title,
      detail: `${scenario.track} drill · ${scenario.focus}`,
      href: "/drills#independent-practice",
      text: `${scenario.title}\n${scenario.track}\n${scenario.focus}`.toLowerCase(),
    });
  }

  for (const exercise of guidedExerciseSummaries) {
    entries.push({
      kind: "drill",
      title: exercise.title,
      detail: exercise.track + " · guided worksheet · ~" + exercise.minutes + " min",
      href: "/drills/" + exercise.id,
      text: [exercise.title, exercise.outcome, exercise.track, "guided practice worksheet reference answer rubric revision"].join("\n").toLowerCase(),
    });
  }

  for (const section of manual) {
    entries.push({
      kind: "manual",
      title: `manual: ${section.title}`,
      detail: section.intro,
      href: `/manual#${section.id}`,
      text: `${section.title}\n${section.intro}\n${section.rows.map((r) => `${r.label} ${r.value}`).join("\n")}`.toLowerCase(),
    });
  }

  entries.push({
    kind: "about",
    title: "About these courses: study sequence and practice",
    detail:
      "Prerequisites, study sequence, practice budgets, and local progress",
    href: "/about",
    text: "start here prerequisites study guide recommended sequence practice budget hours export import progress updates sources",
  });
  return [...entries, ...extra];
}
