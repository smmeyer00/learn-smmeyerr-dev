/** Search types and matching with no curriculum imports. */
export type SearchKind = "chapter" | "glossary" | "drill" | "manual" | "about";

export type SearchEntry = {
  kind: SearchKind;
  title: string;
  detail: string;
  href: string;
  /** lowercased haystack */
  text: string;
};

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
      const best = Math.max(inTitle >= 0 ? inTitle + 10 : -1, inText);
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
