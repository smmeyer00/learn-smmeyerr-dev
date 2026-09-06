"use client";

import dynamic from "next/dynamic";

/**
 * Code-split lab host: each lab loads as its own chunk only when its
 * chapter renders. Chapter pages stay server-rendered.
 */
const labComponents: Record<string, React.ComponentType> = {
  "scale-dial": dynamic(() =>
    import("./scale-dial").then((m) => m.ScaleDial),
  ),
  "cache-stampede": dynamic(() =>
    import("./cache-stampede").then((m) => m.CacheStampede),
  ),
  "partition-lease": dynamic(() =>
    import("./partition-lease").then((m) => m.PartitionLease),
  ),
  "gpu-capacity": dynamic(() =>
    import("./gpu-capacity").then((m) => m.GpuCapacity),
  ),
  "next-token": dynamic(() =>
    import("./next-token").then((m) => m.NextToken),
  ),
  "attention-explorer": dynamic(() =>
    import("./attention-explorer").then((m) => m.AttentionExplorer),
  ),
  "kv-cache": dynamic(() => import("./kv-cache").then((m) => m.KvCache)),
  "agent-loop": dynamic(() =>
    import("./agent-loop").then((m) => m.AgentLoop),
  ),
  "rag-explorer": dynamic(() =>
    import("./rag-explorer").then((m) => m.RagExplorer),
  ),
  "eval-workbench": dynamic(() =>
    import("./eval-workbench").then((m) => m.EvalWorkbench),
  ),
};

export function LabHost({ labId }: { labId: string }) {
  const Lab = labComponents[labId];
  if (!Lab) return null;
  return <Lab />;
}
