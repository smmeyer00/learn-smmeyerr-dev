/**
 * Glossary content file. Durable concepts only — provider facts,
 * model names, and limits change too fast to define here.
 * `related` holds chapter keys ("<course>/<chapter>") for deep links.
 */

export type GlossaryTerm = {
  term: string;
  definition: string;
  related?: string[];
};

function t(term: string, definition: string, related?: string[]): GlossaryTerm {
  return { term, definition, related };
}

export const glossary: GlossaryTerm[] = [
  // ---- system design ----
  t(
    "Availability",
    "The fraction of time a system responds correctly. Higher availability costs more; every extra nine roughly multiplies the engineering and operational price.",
    ["system-design/07-reliability-and-resilience"],
  ),
  t(
    "Backpressure",
    "A signal from an overloaded downstream that slows upstream producers, instead of buffering work until something collapses. Queues with bounded depth plus backpressure beat unbounded queues.",
    ["system-design/05-queues-streams-and-async"],
  ),
  t(
    "Blue-green deployment",
    "Two identical production environments; traffic flips from blue to green after the new version proves healthy. Rollback is a flip back, which is why releases stay boring.",
    ["system-design/08-observability-and-operations"],
  ),
  t(
    "Bulkhead",
    "Isolating resources (threads, pools, quotas) so one failing dependency cannot sink the whole process — named for ship compartments.",
    ["system-design/07-reliability-and-resilience"],
  ),
  t(
    "Cache stampede",
    "A thundering herd triggered when a hot cache entry expires and every concurrent request misses at once, overloading the source. Fixed with request coalescing, probabilistic early refresh, or stale-while-revalidate.",
    ["system-design/04-caching-and-performance"],
  ),
  t(
    "Canary release",
    "Rolling a change to a small slice of traffic first and promoting it only when error and latency signals stay flat. The point is fast detection, not slow rollout.",
    ["system-design/08-observability-and-operations"],
  ),
  t(
    "CAP theorem",
    "During a network partition, a distributed store chooses between consistency and availability; it cannot provide both. Outside partitions the real tradeoff is latency versus consistency.",
    ["system-design/06-distributed-systems-fundamentals"],
  ),
  t(
    "Circuit breaker",
    "A client-side guard that stops calling a failing dependency after a threshold and fails fast, probing occasionally for recovery. Prevents retry storms from finishing what the outage started.",
    ["system-design/07-reliability-and-resilience"],
  ),
  t(
    "Consistent hashing",
    "Mapping keys and nodes onto the same hash ring so adding or removing a node moves only neighboring keys. The standard answer to elastic partitioning.",
    ["system-design/03-data-modeling-and-storage"],
  ),
  t(
    "CQRS",
    "Command Query Responsibility Segregation: separate models for writes and reads so each can be shaped, scaled, and stored differently. Pays off when read and write shapes genuinely diverge.",
    ["system-design/03-data-modeling-and-storage"],
  ),
  t(
    "Dead-letter queue",
    "Where messages go after exhausting retries. A DLQ turns silent data loss into visible, replayable work — always alarm on its growth.",
    ["system-design/05-queues-streams-and-async"],
  ),
  t(
    "Durability",
    "The promise that acknowledged writes survive crashes, usually via replication plus fsync discipline. Distinct from availability: a system can be up and still lose data.",
    ["system-design/03-data-modeling-and-storage"],
  ),
  t(
    "Error budget",
    "The allowed failure rate implied by an SLO (100% minus the objective). Spend it on velocity when healthy; freeze releases when burned. Turns reliability arguments into arithmetic.",
    ["system-design/07-reliability-and-resilience"],
  ),
  t(
    "Event sourcing",
    "Storing state as an append-only log of domain events and deriving current state by replay. Auditability and time travel in exchange for projection complexity.",
    ["system-design/05-queues-streams-and-async"],
  ),
  t(
    "Exactly-once semantics",
    "Effectively-once processing built from at-least-once delivery plus idempotent consumers. True exactly-once is a myth in distributed systems; idempotency keys are the engineering reality.",
    ["system-design/05-queues-streams-and-async"],
  ),
  t(
    "Fan-out",
    "Delivering one write to many readers or shards at once — feeds, notifications, and scatter-gather queries. Watch for celebrity keys that concentrate the load.",
    ["system-design/13-common-interview-design-problems"],
  ),
  t(
    "Fencing token",
    "A monotonically increasing token a lock service issues so a storage layer can reject writes from a stale leader. Leases expire; fencing makes the expiry enforceable.",
    ["system-design/06-distributed-systems-fundamentals"],
  ),
  t(
    "Head-of-line blocking",
    "One slow request holding up everything queued behind it on a shared connection or worker. Fixed by concurrency, deadlines, and isolating slow lanes from fast ones.",
    ["system-design/02-networking-apis-and-boundaries"],
  ),
  t(
    "Idempotency",
    "The property that repeating an operation has the same effect as doing it once. Required anywhere retries exist — which is everywhere networks exist.",
    ["system-design/05-queues-streams-and-async"],
  ),
  t(
    "Little's Law",
    "Concurrency equals throughput multiplied by latency (L = λW). The fastest capacity estimate in system design: know two, derive the third.",
    ["system-design/01-system-design-foundations"],
  ),
  t(
    "Noisy neighbor",
    "One tenant or workload degrading shared infrastructure for everyone else. Answered with quotas, isolation, and per-tenant load shedding.",
    ["system-design/11-high-scale-compute-systems"],
  ),
  t(
    "Outbox pattern",
    "Writing domain changes and outbound events in one local transaction, then relaying the outbox table to the bus. Exactly the dual-write problem, solved.",
    ["system-design/05-queues-streams-and-async"],
  ),
  t(
    "p99 latency",
    "The latency bound that 99% of requests beat. Averages hide user pain; SLOs are written against tails because users remember the slow ones.",
    ["system-design/01-system-design-foundations"],
  ),
  t(
    "Quorum",
    "Majority agreement (R + W > N guarantees read-write overlap) that keeps a replicated store correct through failures and partitions. More replicas raise fault tolerance only if the quorum math is honored.",
    ["system-design/06-distributed-systems-fundamentals"],
  ),
  t(
    "Rate limiting",
    "Bounding how much work a caller can demand per window, usually with token buckets. Protects shared capacity and prices abuse out of the system.",
    ["system-design/09-security-and-abuse-resistance"],
  ),
  t(
    "RPO and RTO",
    "Recovery Point Objective (how much data loss is tolerable) and Recovery Time Objective (how long downtime is tolerable). Backups and failover designs exist to satisfy these two numbers.",
    ["system-design/10-multi-region-and-global-systems"],
  ),
  t(
    "Saga",
    "A distributed transaction as a sequence of local transactions with compensating actions for rollback. Choreography is decoupled; orchestration is legible — pick one deliberately.",
    ["system-design/05-queues-streams-and-async"],
  ),
  t(
    "Sharding",
    "Splitting a dataset across nodes by key so capacity scales horizontally. Buys throughput at the cost of cross-shard queries, rebalancing, and hot keys.",
    ["system-design/03-data-modeling-and-storage"],
  ),
  t(
    "SLI, SLO, SLA",
    "An SLI measures (e.g. successful responses / total), an SLO is the internal objective on that measure, and an SLA is the contractual promise with consequences. Never confuse the three in an interview.",
    ["system-design/07-reliability-and-resilience"],
  ),
  t(
    "Stale-while-revalidate",
    "Serving slightly expired cached content immediately while refreshing in the background. Users get speed, origins get mercy, and freshness gets a bounded delay.",
    ["system-design/04-caching-and-performance"],
  ),
  t(
    "Thundering herd",
    "Many clients retrying or reconnecting simultaneously after an outage, re-overloading the recovering system. Jitter, backoff, and coalescing are the standard dispersants.",
    ["system-design/04-caching-and-performance"],
  ),
  t(
    "TTL",
    "Time-to-live: how long a cached or temporary record is valid. Short TTLs buy freshness with origin load; long TTLs buy the reverse. There is no correct value, only a tradeoff.",
    ["system-design/04-caching-and-performance"],
  ),
  // ---- LLM engineering ----
  t(
    "Agents",
    "Systems where a model plans multi-step work, calls tools, observes results, and replans within budgets and privilege bounds. Useful when the path cannot be fully specified but progress is observable.",
    ["llm-engineering/07-agents"],
  ),
  t(
    "Attention",
    "The mechanism letting each token weigh every other token when building its representation. One head learns one kind of relationship; many heads in many layers compose the model's understanding.",
    ["llm-engineering/02-transformer-fundamentals"],
  ),
  t(
    "Batching (inference)",
    "Serving many requests together to amortize GPU work. Continuous batching swaps finished sequences for new ones mid-iteration, which is most of modern serving throughput.",
    ["llm-engineering/04-inference-and-serving"],
  ),
  t(
    "Calibration",
    "Agreement between a judge's stated confidence or scores and human labels. An uncalibrated model-judge makes eval gates theater; measure precision, recall, and disagreement slices.",
    ["llm-engineering/11-evaluation"],
  ),
  t(
    "Chain-of-thought",
    "Having the model write intermediate reasoning steps before answering. Improves hard tasks and exposes failure points, but the trace is a generated artifact — verify it, don't worship it.",
    ["llm-engineering/05-prompting-as-software-engineering"],
  ),
  t(
    "Chunking",
    "Splitting documents into retrievable pieces. Chunk size trades context precision against recall: too small loses meaning, too large drowns the model in noise.",
    ["llm-engineering/08-retrieval-augmented-generation"],
  ),
  t(
    "Context window",
    "The model's active working memory: all tokens it can condition on at once. Length is not comprehension — retrieval quality inside long contexts degrades without structure.",
    [
      "llm-engineering/01-mental-model-of-modern-llms",
      "llm-engineering/10-context-and-memory",
    ],
  ),
  t(
    "Embeddings",
    "Dense vectors placing semantically similar texts near each other, enabling similarity search. The index is only as good as the chunking, the model, and the evaluation behind it.",
    ["llm-engineering/09-embeddings"],
  ),
  t(
    "Fine-tuning",
    "Continuing training on task data to specialize behavior. Parameter-efficient methods like LoRA adapt cheaply; full fine-tuning is reserved for deep capability shifts.",
    ["llm-engineering/03-how-models-are-trained"],
  ),
  t(
    "Golden dataset",
    "A curated, human-reviewed set of cases with expected outcomes that gates releases. Every production failure should become a case; every gate should run the goldens.",
    ["llm-engineering/11-evaluation"],
  ),
  t(
    "Groundedness",
    "The fraction of a response's claims supported by its retrieved context. The measurable form of 'did it make that up' — evaluate it directly, not by vibes.",
    ["llm-engineering/11-evaluation"],
  ),
  t(
    "Hallucination",
    "Fluent output untethered from truth or provided evidence. A natural consequence of next-token prediction, managed at the system level with retrieval, tools, abstention, and evals — never by one clever prompt.",
    ["llm-engineering/01-mental-model-of-modern-llms"],
  ),
  t(
    "Hybrid retrieval",
    "Combining lexical search (exact terms, symbols) with vector search (meaning), then fusing and reranking. Each covers the other's blind spots; production RAG is almost always hybrid.",
    ["llm-engineering/08-retrieval-augmented-generation"],
  ),
  t(
    "ITL (inter-token latency)",
    "Time between output tokens during decoding. The streaming smoothness metric — users feel ITL directly as typing speed.",
    ["llm-engineering/04-inference-and-serving"],
  ),
  t(
    "KV cache",
    "Stored attention keys and values that let decoding reuse past computation instead of recomputing it. The reason long contexts cost memory, and prefix caching works.",
    ["llm-engineering/04-inference-and-serving"],
  ),
  t(
    "Model-as-judge",
    "Grading outputs with another model call. Scales human review but inherits bias and blind spots — calibrate against human labels and track disagreement.",
    ["llm-engineering/11-evaluation"],
  ),
  t(
    "Prefill vs decode",
    "Inference splits into prefill (processing the prompt, compute-bound, drives TTFT) and decode (generating tokens one by one, memory-bound, drives ITL). Capacity planning treats them separately.",
    ["llm-engineering/04-inference-and-serving"],
  ),
  t(
    "Prompt injection",
    "Untrusted content hijacking model behavior — direct (user) or indirect (retrieved pages, tool output). Treat all external content as data, never instructions; validate effects, not intentions.",
    ["llm-engineering/13-safety-and-security"],
  ),
  t(
    "Quantization",
    "Shrinking model weights to fewer bits per parameter to cut memory and speed inference, at some quality cost. The standard lever when the model barely doesn't fit.",
    ["llm-engineering/17-llm-infrastructure-at-scale"],
  ),
  t(
    "RAG",
    "Retrieval-Augmented Generation: grounding responses in retrieved documents instead of relying on parametric memory. Shifts the hard problems to chunking, retrieval quality, citations, and freshness.",
    ["llm-engineering/08-retrieval-augmented-generation"],
  ),
  t(
    "Recall@k",
    "The fraction of relevant documents appearing in the top-k retrieved results. The retrieval coverage metric — measure it per slice before blaming the generator.",
    [
      "llm-engineering/08-retrieval-augmented-generation",
      "llm-engineering/11-evaluation",
    ],
  ),
  t(
    "Structured output",
    "Constraining generation to a schema (JSON mode, grammars, validators). Bounds form, not truth — still validate semantics and handle refusals.",
    ["llm-engineering/06-tool-use-and-function-calling"],
  ),
  t(
    "System prompt",
    "The privileged instructions framing every request: role, rules, tools, and boundaries. Part of your trusted surface — version it, test it, and never let user content overwrite it.",
    ["llm-engineering/05-prompting-as-software-engineering"],
  ),
  t(
    "Temperature",
    "Sampling sharpness: low values concentrate probability on likely tokens (deterministic-ish), high values spread it (diverse, risky). Shapes style and variance, never knowledge.",
    ["llm-engineering/01-mental-model-of-modern-llms"],
  ),
  t(
    "Tokens",
    "The sub-word units models actually read and write — not words, not characters. All pricing, limits, latency, and context math is denominated in tokens.",
    ["llm-engineering/01-mental-model-of-modern-llms"],
  ),
  t(
    "Tool calling",
    "The model emitting structured calls your code executes, with results fed back as observations. Authorization, validation, idempotency, and audit live in your service — never trust the model's judgment on side effects.",
    ["llm-engineering/06-tool-use-and-function-calling"],
  ),
  t(
    "Top-p (nucleus sampling)",
    "Restricting sampling to the smallest token set whose cumulative probability reaches p. Trims the gibberish tail while preserving choice among plausible continuations.",
    ["llm-engineering/01-mental-model-of-modern-llms"],
  ),
  t(
    "TTFT (time to first token)",
    "Queue plus prefill responsiveness: how fast the user sees anything. The perceived-latency metric for interactive products.",
    ["llm-engineering/04-inference-and-serving"],
  ),
];

export function slugifyTerm(term: string): string {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
