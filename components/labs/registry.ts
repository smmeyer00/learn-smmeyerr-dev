/**
 * Which interactive labs ship on which chapters. Keys are
 * "<course-slug>/<chapter-slug>". A chapter may map to several labs;
 * unmapped chapters keep the planned-labs checklist only.
 */
export const labRegistry: Record<string, string[]> = {
  "system-design/01-system-design-foundations": ["scale-dial"],
  "system-design/04-caching-and-performance": ["cache-stampede"],
  "system-design/06-distributed-systems-fundamentals": ["partition-lease"],
  "system-design/11-high-scale-compute-systems": ["gpu-capacity"],
  "llm-engineering/01-mental-model-of-modern-llms": ["next-token"],
  "llm-engineering/02-transformer-fundamentals": ["attention-explorer"],
  "llm-engineering/04-inference-and-serving": ["kv-cache"],
  "llm-engineering/06-tool-use-and-function-calling": ["agent-loop"],
  "llm-engineering/07-agents": ["agent-loop"],
  "llm-engineering/08-retrieval-augmented-generation": ["rag-explorer"],
  "llm-engineering/11-evaluation": ["eval-workbench"],
  "llm-engineering/17-llm-infrastructure-at-scale": ["gpu-capacity"],
};

export function labsForChapter(
  courseSlug: string,
  chapterSlug: string,
): string[] {
  return labRegistry[`${courseSlug}/${chapterSlug}`] ?? [];
}
