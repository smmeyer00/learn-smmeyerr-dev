import type { Reference } from "./types";

// Selected primary sources. Dates record a review of the linked resource,
// not a claim that every provider capability remains unchanged after that date.
const reviewed = "2026-10";
function ref(label: string, href: string): Reference {
  return { label, href, lastReviewed: reviewed };
}

export const sources = {
  slos: ref(
    "Google SRE Workbook: implementing SLOs",
    "https://sre.google/workbook/implementing-slos/",
  ),
  retries: ref(
    "AWS Builders’ Library: timeouts, retries, backoff, and jitter",
    "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/",
  ),
  storage: ref(
    "PostgreSQL: transaction isolation",
    "https://www.postgresql.org/docs/current/transaction-iso.html",
  ),
  caching: ref(
    "AWS Builders’ Library: caching challenges and strategies",
    "https://aws.amazon.com/builders-library/caching-challenges-and-strategies/",
  ),
  kafka: ref(
    "Apache Kafka: design and delivery semantics",
    "https://kafka.apache.org/41/design/design/",
  ),
  raft: ref(
    "Ongaro & Ousterhout: the Raft consensus algorithm",
    "https://raft.github.io/raft.pdf",
  ),
  overload: ref(
    "Google SRE: handling overload",
    "https://sre.google/sre-book/handling-overload/",
  ),
  monitoring: ref(
    "Google SRE: monitoring distributed systems",
    "https://sre.google/sre-book/monitoring-distributed-systems/",
  ),
  loadBalancing: ref(
    "Google SRE: load balancing in the datacenter",
    "https://sre.google/sre-book/load-balancing-datacenter/",
  ),
  security: ref(
    "OWASP: API Security Top 10",
    "https://owasp.org/API-Security/editions/2023/en/0x11-t10/",
  ),
  generation: ref(
    "Hugging Face Transformers: text generation",
    "https://huggingface.co/docs/transformers/main/en/llm_tutorial",
  ),
  transformer: ref(
    "Vaswani et al.: Attention Is All You Need",
    "https://arxiv.org/abs/1706.03762",
  ),
  training: ref(
    "Hugging Face course: training a causal language model",
    "https://huggingface.co/learn/llm-course/chapter7/6",
  ),
  serving: ref(
    "Kwon et al.: PagedAttention and LLM serving",
    "https://arxiv.org/abs/2309.06180",
  ),
  rag: ref(
    "Lewis et al.: Retrieval-Augmented Generation",
    "https://arxiv.org/abs/2005.11401",
  ),
  embeddings: ref(
    "Sentence Transformers: semantic search",
    "https://www.sbert.net/examples/sentence_transformer/applications/semantic-search/README.html",
  ),
  agents: ref(
    "Anthropic: building effective agents",
    "https://www.anthropic.com/engineering/building-effective-agents",
  ),
  evals: ref(
    "Anthropic: demystifying evals for AI agents",
    "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents",
  ),
  context: ref(
    "Anthropic: effective context engineering for AI agents",
    "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
  ),
  injection: ref(
    "OWASP: prompt injection",
    "https://genai.owasp.org/llmrisk/llm01-prompt-injection/",
  ),
  learning: ref(
    "Dunlosky et al.: practice testing and distributed practice",
    "https://www.psychologicalscience.org/publications/journals/pspi/learning-techniques.html",
  ),
} satisfies Record<string, Reference>;
