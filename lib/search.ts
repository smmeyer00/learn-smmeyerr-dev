/**
 * Build-time search index + client-safe matching.
 *
 * The index is computed on the server (root layout) from static content and
 * passed to the palette as serialized props — no runtime fetching, no
 * external dependency. Matching is a small subsequence fuzzy scorer.
 */

import { courses } from "@/content";
import { glossary, slugifyTerm } from "@/content/glossary";
import { drillScenarios } from "@/content/drills";
import { fieldManual } from "@/content/field-manual";

export type SearchKind = "chapter" | "glossary" | "drill" | "manual";

export type SearchEntry = {
  kind: SearchKind;
  title: string;
  detail: string;
  href: string;
  /** lowercased haystack */
  text: string;
};

export function buildSearchIndex(extra: SearchEntry[] = []): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const course of courses) {
    for (const chapter of course.chapters) {
      entries.push({
        kind: "chapter",
        title: chapter.title,
        detail: `${course.slug} · ch ${chapter.order} · ${chapter.hours}h`,
        href: `/${course.slug}/${chapter.slug}`,
        text: [
          chapter.title,
          chapter.outcome,
          chapter.phase,
          chapter.depth,
          ...chapter.coverage,
          ...chapter.lessons.map((l) => l.title),
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
      href: "/drills",
      text: `${scenario.title}\n${scenario.track}\n${scenario.focus}`.toLowerCase(),
    });
  }

  for (const section of fieldManual) {
    entries.push({
      kind: "manual",
      title: `field manual: ${section.title}`,
      detail: section.intro,
      href: `/field-manual#${section.id}`,
      text: `${section.title}\n${section.intro}\n${section.rows.map((r) => `${r.label} ${r.value}`).join("\n")}`.toLowerCase(),
    });
  }

  return [...entries, ...extra];
}

/** Subsequence fuzzy score; higher is better, -1 means no match. */
function fuzzyScore(query: string, text: string): number {
  let qi = 0;
  let score = 0;
  let lastPos = -1;
  for (let ti = 0; ti < text.length && qi < query.length; ti++) {
    if (text[ti] === query[qi]) {
      // Bonus for word-boundary and consecutive matches.
      if (ti === 0 || /[^a-z0-9]/.test(text[ti - 1])) score += 3;
      else if (lastPos === ti - 1) score += 2;
      else score += 1;
      lastPos = ti;
      qi++;
    }
  }
  if (qi < query.length) return -1;
  return score;
}

export function searchEntries(
  query: string,
  index: SearchEntry[],
  limit = 12,
): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return [];
  const terms = q.split(/\s+/);
  const scored: { entry: SearchEntry; score: number }[] = [];
  for (const entry of index) {
    let total = 0;
    let matched = true;
    for (const term of terms) {
      const inTitle = fuzzyScore(term, entry.title.toLowerCase());
      const inText = fuzzyScore(term, entry.text);
      const best = Math.max(
        inTitle >= 0 ? inTitle + 10 : -1,
        inText,
      );
      if (best < 0) {
        matched = false;
        break;
      }
      total += best;
    }
    if (matched) scored.push({ entry, score: total });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.entry);
}
