/**
 * Which interactive labs ship on which chapters. Keys are
 * "<course-slug>/<chapter-slug>".
 *
 * `replacesPlanned` lists indices into the chapter's `labs` text array that
 * the interactive lab supersedes, so shipped work is not also shown as
 * "planned". `scripts/validate-content.ts` asserts every index is in range.
 */
export type ChapterLabs = {
  id: string;
  replacesPlanned: number[];
};

export const labRegistry: Record<string, ChapterLabs[]> = {
  "system-design/01-system-design-foundations": [
    { id: "scale-dial", replacesPlanned: [0] },
  ],
  "system-design/04-caching-and-performance": [
    { id: "cache-stampede", replacesPlanned: [0] },
  ],
  "system-design/06-distributed-systems-fundamentals": [
    { id: "partition-lease", replacesPlanned: [0, 1] },
  ],
  "system-design/11-high-scale-compute-systems": [
    { id: "gpu-capacity", replacesPlanned: [1] },
  ],
  "llm-engineering/01-mental-model-of-modern-llms": [
    { id: "next-token", replacesPlanned: [0] },
  ],
  "llm-engineering/02-transformer-fundamentals": [
    { id: "attention-explorer", replacesPlanned: [0] },
  ],
  "llm-engineering/04-inference-and-serving": [
    { id: "kv-cache", replacesPlanned: [1] },
  ],
  "llm-engineering/06-tool-use-and-function-calling": [
    { id: "agent-loop", replacesPlanned: [0] },
  ],
  "llm-engineering/07-agents": [{ id: "agent-loop", replacesPlanned: [0] }],
  "llm-engineering/08-retrieval-augmented-generation": [
    { id: "rag-explorer", replacesPlanned: [0] },
  ],
  "llm-engineering/11-evaluation": [
    { id: "eval-workbench", replacesPlanned: [0, 1] },
  ],
  "llm-engineering/17-llm-infrastructure-at-scale": [
    { id: "gpu-capacity", replacesPlanned: [0] },
  ],
};

export function labsForChapter(
  courseSlug: string,
  chapterSlug: string,
): ChapterLabs[] {
  return labRegistry[`${courseSlug}/${chapterSlug}`] ?? [];
}
