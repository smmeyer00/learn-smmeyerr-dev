import { llmEngineeringLessons } from "./lessons/llm-engineering";
import type { Course } from "./types";
import { llmEngineeringStudyGuides } from "./study-guides/llm-engineering";

export const llmEngineering: Course = {
  slug: "llm-engineering",
  id: "02",
  title: "LLM engineering for software engineers",
  description:
    "First-principles AI-system fluency for strong software engineers who are not trying to become ML researchers.",
  scope: "21 chapters · ~73 hours of practice",
  practiceProject: {
    title: "Harbor · build and evaluate a support assistant",
    brief: "Keep one project document and a folder of fictional input/output fixtures for Harbor, a workspace-scoped support assistant. Start with ticket triage and policy-backed drafts at 20 requests/minute, 1,500 input and 200 output tokens/request. Human users remain responsible for consequential actions until you design explicit permissions and approval. Later chapters add retrieval, controlled tools, durable runs, evaluation, security, and scale. Use paper, a text editor, and mocked results; paid APIs are optional. Preserve first attempts, evidence, and revisions within the existing practice budget.",
  },
  phaseOrder: [
    "Foundations",
    "Serving",
    "Application core",
    "Knowledge systems",
    "Production AI",
    "Product systems",
    "Agent systems",
    "LLM platforms",
    "Interview mode",
  ],
  chapters: [
    {
      slug: "01-mental-model-of-modern-llms",
      order: 1,
      studyGuide: llmEngineeringStudyGuides[1],
      title: "Mental model of modern LLMs",
      phase: "Foundations",
      hours: 2,
      depth: "core",
      outcome:
        "Explain what an LLM does, why generation varies, and why hallucination is a natural failure mode.",
      why: "You need a crisp first-principles model that supports engineering decisions. The model predicts a distribution over the next token; useful behavior emerges from training, context, post-training, and sampling—not a database lookup of answers.",
      coverage: [
        "Representation: tokens, tokenization, context windows.",
        "Objective: next-token probability distributions.",
        "Sampling: temperature, top-p, determinism and seeds.",
        "Failure: hallucination, ambiguity, missing knowledge.",
        "Scale: why larger/capable models behave differently.",
        "Lifecycle: training vs inference.",
      ],
      mentalModel: {
        statement:
          "Generation repeatedly turns context into a distribution, samples, appends, and repeats.",
        flow: [
          { label: "Tokenize", detail: "Text → IDs" },
          { label: "Predict", detail: "P(next token)" },
          { label: "Sample", detail: "Policy chooses" },
          { label: "Append", detail: "Context grows" },
        ],
      },
      lessons: llmEngineeringLessons[1],
      seniorSignal:
        "Explain this without anthropomorphism: “It computes a context-conditioned distribution and generates under a decoding policy; truthfulness is a learned behavior we still verify.”",
      pitfalls: [
        "Saying the model searches its training data",
        "Equating context length with reliable use of every token",
        "Assuming temperature zero proves identical output",
        "Treating hallucination as a rare bug removable by one prompt",
      ],
      drill: {
        prompt:
          "Give a two-minute whiteboard explanation of an LLM to a backend engineer, then explain one product consequence.",
        constraints: ["2 min", "no equations required", "one failure mode", "one mitigation"],
        approach:
          "Define tokens and next-token distributions, show the autoregressive loop, separate training from inference, then connect hallucination to grounding and verification. Avoid claims about consciousness, intent, or literal lookup.",
      },
      quiz: [
        {
          question: "Temperature primarily changes…",
          options: [
            "The model's knowledge",
            "The shape of the sampling distribution",
            "The context-window size",
            "The tokenizer vocabulary",
          ],
          answer: 1,
          explanation:
            "It rescales logits before sampling, changing relative randomness rather than adding information.",
        },
        {
          question: "Why can an LLM hallucinate?",
          options: [
            "Only when the tokenizer encounters an unfamiliar word",
            "Plausible continuation and factual truth are different objectives",
            "Only when temperature is greater than zero",
            "Only when the context window is completely full",
          ],
          answer: 1,
          explanation:
            "The learned next-token objective can produce fluent content without sufficient grounding. This can happen with familiar words, short contexts, or greedy decoding; those conditions do not guarantee factual support.",
        },
      ],
      labs: [
        "Next-Token Playground — sampling visualization: a live probability distribution over candidate next tokens; temperature and top-p change the distribution while the sentence grows token by token.",
        "Tokenization Lens — text inspector: type text and visualize token boundaries, IDs, counts, and cost/context implications; include code, whitespace, punctuation, and non-English examples.",
        "Base mental-model animation: Tokenize → Predict → Sample → Append, step by step.",
      ],
    },
    {
      slug: "02-transformer-fundamentals",
      order: 2,
      studyGuide: llmEngineeringStudyGuides[2],
      title: "Transformer fundamentals",
      phase: "Foundations",
      hours: 3,
      depth: "core",
      outcome:
        "Explain attention and the transformer stack intuitively, including long-context cost.",
      why: "You do not need to derive gradients, but you should be able to trace information through embeddings, attention, feed-forward blocks, residuals, and causal masking.",
      coverage: [
        "Inputs: token embeddings and positional information.",
        "Attention: queries, keys, values, similarity weights.",
        "Capacity: multi-head attention and feed-forward layers.",
        "Stability: residual connections and layer normalization.",
        "Generation: causal masking and stacked blocks.",
        "Scaling: why naive attention grows quadratically with sequence length.",
      ],
      mentalModel: {
        statement:
          "Each token reads a weighted mixture of earlier token information, then transforms it locally.",
        flow: [
          { label: "Embed", detail: "Token + position" },
          { label: "Attend", detail: "Q·K weights V" },
          { label: "Transform", detail: "Feed-forward" },
          { label: "Repeat", detail: "Residual stack" },
        ],
      },
      lessons: llmEngineeringLessons[2],
      seniorSignal:
        "Use an example: in “the animal didn't cross the street because it was tired,” one head can weight earlier tokens to refine what “it” represents.",
      pitfalls: [
        "Calling attention literal human attention",
        "Saying every head has a known interpretable role",
        "Forgetting causal masking in autoregressive generation",
        "Claiming context windows are free storage",
      ],
      drill: {
        prompt:
          "Explain queries, keys, and values using a search-within-a-meeting analogy, then state where the analogy fails.",
        constraints: ["3 min", "draw 4 tokens", "show weights", "name limitation"],
        approach:
          "Each current token emits a query; each prior token advertises a key and carries a value. Similarity weights decide the mixture. The analogy fails because learned vector operations are distributed and repeated across many heads/layers, not discrete document lookup.",
      },
      quiz: [
        {
          question:
            "What prevents an autoregressive token from reading future tokens?",
          options: [
            "Layer normalization",
            "Causal masking",
            "Tokenization",
            "Top-p",
          ],
          answer: 1,
          explanation:
            "The mask removes future positions from the attention distribution.",
        },
        {
          question: "Attention's core operation produces…",
          options: [
            "A weighted mix of value vectors",
            "A SQL row",
            "A fixed class label",
            "A network socket",
          ],
          answer: 0,
          explanation:
            "Query–key scores weight the values that are aggregated for a position.",
        },
      ],
      labs: [
        "Attention Head Explorer — interactive matrix: choose a query token and view illustrative query-key weights over prior tokens; switch between reference, syntax, and recency-style heads, clearly labeled as pedagogical.",
        "Transformer Block — step-through animation: advance through embeddings plus position, masked attention, residual/normalization, feed-forward, second residual, and stacked layers.",
        "Base mental-model animation: Embed → Attend → Transform → Repeat, step by step.",
      ],
    },
    {
      slug: "03-how-models-are-trained",
      order: 3,
      studyGuide: llmEngineeringStudyGuides[3],
      title: "How models are trained",
      phase: "Foundations",
      hours: 3,
      depth: "fluency",
      outcome:
        "Describe pretraining, post-training, synthetic data, and evaluation without drifting into researcher-only detail.",
      why: "Training knowledge lets you reason about behavior and limits: what pretraining teaches, what post-training steers, how data quality matters, and why benchmarks can mislead.",
      coverage: [
        "Pretraining: datasets, next-token objective, scaling laws.",
        "Post-training: SFT, preference optimization, RLHF, reasoning-oriented RL.",
        "Data: synthetic data, filtering, quality vs quantity.",
        "Compression: distillation and teacher–student transfer.",
        "Measurement: model evals, contamination, overfitting.",
        "Optimization risk: reward hacking and specification gaps.",
      ],
      mentalModel: {
        statement:
          "Capability is learned broadly, behavior is shaped, then measured—and the loop repeats.",
        flow: [
          { label: "Pretrain", detail: "Broad prediction" },
          { label: "Post-train", detail: "Behavior + preference" },
          { label: "Evaluate", detail: "Capabilities + safety" },
          { label: "Iterate", detail: "Data + objective" },
        ],
      },
      lessons: llmEngineeringLessons[3],
      seniorSignal:
        "Stay at the systems boundary: know enough to connect training choices to serving, evaluation, and product behavior; say when optimizer-level detail is outside your role.",
      pitfalls: [
        "Equating post-training with adding facts",
        "Treating one benchmark as general intelligence",
        "Assuming synthetic data is independent evidence",
        "Ignoring contamination and reward gaming",
      ],
      drill: {
        prompt:
          "A model's benchmark score rose but production task success fell. Produce five hypotheses and a test for each.",
        constraints: [
          "5 hypotheses",
          "measurable tests",
          "no retraining first",
          "production slices",
        ],
        approach:
          "Check benchmark contamination, traffic distribution shift, prompt/template changes, metric mismatch, and serving/model configuration differences. Reproduce on logged cases, stratify by task, compare models pairwise, and calibrate automated graders with human review.",
      },
      quiz: [
        {
          question: "What does SFT primarily provide?",
          options: [
            "Demonstrations of desired behavior",
            "More GPU memory",
            "A vector database",
            "Guaranteed factuality",
          ],
          answer: 0,
          explanation:
            "Supervised fine-tuning trains on curated input/output examples.",
        },
        {
          question: "Reward hacking means…",
          options: [
            "GPUs are stolen",
            "The model optimizes the proxy without achieving the true goal",
            "Tokens become longer",
            "Training always fails",
          ],
          answer: 1,
          explanation:
            "Any imperfect reward can be satisfied in unintended ways.",
        },
      ],
      labs: [
        "Training Pipeline — layered process map: follow broad data through filtering, pretraining, SFT, preference optimization, reasoning-oriented RL, safety tests, and release evaluation.",
        "Reward Hacking Lab — specification game: give a proxy metric and predict how a model might satisfy it without meeting the real objective; then improve the evaluation.",
        "Base mental-model animation: Pretrain → Post-train → Evaluate → Iterate, step by step.",
      ],
    },
    {
      slug: "04-inference-and-serving",
      order: 4,
      studyGuide: llmEngineeringStudyGuides[4],
      title: "Inference & serving",
      phase: "Serving",
      hours: 4,
      depth: "deep",
      outcome:
        "Trace an API request through prefill, decode, KV cache, batching, parallelism, and scheduling.",
      why: "Inference is a scheduling and memory problem wrapped around matrix computation. Understanding stage-specific costs lets you explain latency, throughput, and why serving infrastructure is hard.",
      coverage: [
        "Stages: request queue, prefill, decode, streaming.",
        "Metrics: TTFT, inter-token latency, tokens/sec.",
        "Batching: static and continuous batching.",
        "Memory: weights, activations, KV cache, quantization.",
        "Parallelism: tensor and pipeline parallelism.",
        "Acceleration: speculative decoding, prefix caching, request scheduling.",
        "Tradeoff: cost, latency, throughput, quality.",
      ],
      mentalModel: {
        statement:
          "Input-heavy prefill and sequential decode stress different resources.",
        flow: [
          { label: "Queue", detail: "Admit + batch" },
          { label: "Prefill", detail: "Process prompt" },
          { label: "Decode", detail: "One token/step" },
          { label: "Stream", detail: "Cancel + account" },
        ],
      },
      lessons: llmEngineeringLessons[4],
      seniorSignal:
        "Draw two latency bars: TTFT = admission + queue + prefill; completion = TTFT + decode steps. Then show which optimization attacks each part.",
      pitfalls: [
        "Using tokens/sec as the only user-experience metric",
        "Calling batching free throughput",
        "Ignoring KV memory in concurrency estimates",
        "Assuming quantization only affects file size",
      ],
      drill: {
        prompt:
          "A model service has good average latency but p99 TTFT spikes when long prompts arrive. Diagnose and redesign scheduling.",
        constraints: [
          "mixed prompt lengths",
          "p99 TTFT",
          "fixed GPU fleet",
          "streaming",
        ],
        approach:
          "Break latency into queue and prefill. Introduce size-aware queues or prefill chunking, bound huge contexts, reserve capacity for short interactive traffic, and enforce tenant fairness. Monitor queued tokens and KV occupancy, not only request count.",
      },
      quiz: [
        {
          question: "What most directly determines TTFT?",
          options: [
            "Only output length",
            "Admission, queueing, and prefill",
            "The average time between output tokens",
            "Total output tokens divided by generation rate",
          ],
          answer: 1,
          explanation:
            "The first token arrives after admission, queueing, and prompt processing. Inter-token latency describes later output pacing; output length and generation rate primarily affect time to completion.",
        },
        {
          question: "Why is decode hard to parallelize across time?",
          options: [
            "Each next token depends on prior generated tokens",
            "All requests in a batch must finish together",
            "Every output step must reload weights from disk",
            "The full training dataset is scanned for each token",
          ],
          answer: 0,
          explanation:
            "Autoregressive dependence makes ordinary output steps sequential: the next step uses the generated prefix. This dependency remains even with resident weights and ample memory; batching combines different requests rather than removing that dependency.",
        },
      ],
      labs: [
        "Prefill vs Decode — animated latency timeline: vary input and output tokens; separately display queue time, prefill/TTFT, sequential decode, inter-token latency, and total completion time.",
        "KV Cache Calculator — memory simulator: change batch size, sequence length, precision, and model dimensions to see concurrency pressure and why memory can bind before raw compute.",
        "Base mental-model animation: Queue → Prefill → Decode → Stream, step by step.",
      ],
    },
    {
      slug: "05-prompting-as-software-engineering",
      order: 5,
      studyGuide: llmEngineeringStudyGuides[5],
      title: "Prompting as software engineering",
      phase: "Application core",
      hours: 3,
      depth: "core",
      outcome:
        "Treat prompts as versioned specifications with schemas, tests, and explicit trust boundaries.",
      why: "Good prompting is requirements engineering for a probabilistic component. It improves when instructions, context, examples, output contracts, and evaluation are managed like code.",
      coverage: [
        "Authority: system/developer/user instruction hierarchy.",
        "Specification: clear tasks, constraints, context, examples.",
        "Contracts: structured outputs and schema constraints.",
        "Operations: templates, versioning, testing, telemetry.",
        "Security: prompt injection and untrusted content.",
        "Limits: when code, retrieval, tools, or fine-tuning is the better lever.",
      ],
      mentalModel: {
        statement:
          "A production prompt is a tested contract surrounded by trusted code.",
        flow: [
          { label: "Specify", detail: "Goal + constraints" },
          { label: "Ground", detail: "Context + examples" },
          { label: "Constrain", detail: "Schema + checks" },
          { label: "Evaluate", detail: "Cases + regressions" },
        ],
      },
      lessons: llmEngineeringLessons[5],
      seniorSignal:
        "Use prompts for semantic judgment; use code for permissions, arithmetic, state transitions, and invariants.",
      pitfalls: [
        "Mixing trusted policy with retrieved/user text",
        "Assuming valid JSON means correct result",
        "Piling exceptions into an untestable mega-prompt",
        "Changing model and prompt together without comparison",
      ],
      drill: {
        prompt:
          "Turn a vague ‘summarize support ticket’ prompt into a production contract for routing and urgency.",
        constraints: ["JSON schema", "unknown category", "PII", "eval set"],
        approach:
          "Define category enum, urgency rubric, evidence spans, confidence/abstain behavior, and PII handling. Provide boundary examples. Validate schema and permissions in code, log versioned outcomes, and evaluate category slices plus adversarial instructions inside ticket text.",
      },
      quiz: [
        {
          question: "Structured output guarantees…",
          options: [
            "Truth",
            "Shape/schema compliance within supported constraints",
            "Authorization",
            "Zero latency",
          ],
          answer: 1,
          explanation:
            "A structurally valid answer can still be factually wrong or unsafe.",
        },
        {
          question: "Which belongs in deterministic code?",
          options: [
            "Tone classification",
            "Final permission enforcement",
            "Semantic summarization",
            "Intent detection",
          ],
          answer: 1,
          explanation:
            "Authorization is an invariant and must not depend on probabilistic text generation.",
        },
      ],
      labs: [
        "Prompt Diff Lab — A/B prompt workbench: compare two prompt versions across a small golden set; show schema validity, task score, cost, and latency rather than a single magical prompt.",
        "Instruction Stack — trust-layer diagram: visually separate application policy, user intent, retrieved untrusted text, and tool results; simulate an injection crossing the wrong boundary.",
        "Base mental-model animation: Specify → Ground → Constrain → Evaluate, step by step.",
      ],
    },
    {
      slug: "06-tool-use-and-function-calling",
      order: 6,
      studyGuide: llmEngineeringStudyGuides[6],
      title: "Tool use & function calling",
      phase: "Application core",
      hours: 3,
      depth: "core",
      outcome:
        "Build a safe tool lifecycle from schema exposure through validated execution and grounded continuation.",
      why: "Tools convert language decisions into real effects. The model proposes a call; your system owns availability, validation, authorization, execution, retries, and the result that returns to context.",
      coverage: [
        "Interface: tool descriptions, schemas, argument generation.",
        "Lifecycle: select, call, validate, execute, return, continue.",
        "Composition: multiple calls, parallel vs sequential dependencies.",
        "Failure: timeouts, retries, partial results, tool selection.",
        "Security: permissioning, least privilege, trusted results.",
        "Autonomy: approval gates and dangerous actions.",
      ],
      mentalModel: {
        statement:
          "The model proposes; deterministic infrastructure authorizes and executes.",
        flow: [
          { label: "Expose", detail: "Relevant schema" },
          { label: "Propose", detail: "Name + args" },
          { label: "Authorize", detail: "Validate + approve" },
          { label: "Execute", detail: "Result + audit" },
        ],
      },
      lessons: llmEngineeringLessons[6],
      seniorSignal:
        "Say exactly where authority lives: the model has semantic discretion; the executor has security authority.",
      pitfalls: [
        "Executing model arguments without validation",
        "Retrying a timed-out write with a new operation ID",
        "Treating tool output as trusted instructions",
        "Exposing every tool on every turn",
      ],
      drill: {
        prompt:
          "Design tool execution for an assistant that can search orders, refund purchases, and send email.",
        constraints: ["PII", "money movement", "email side effects", "timeouts"],
        approach:
          "Separate read and write tools, use scoped identity, validate order ownership, preview refund/email, and require approval for material effects. Use idempotency keys for refund/send, log audit records, cap retries, and return explicit unknown-outcome status after ambiguous timeouts.",
      },
      quiz: [
        {
          question: "Who should make the final authorization decision?",
          options: [
            "The model",
            "Deterministic policy at execution",
            "The user prompt alone",
            "The tokenizer",
          ],
          answer: 1,
          explanation:
            "The executor has trusted identity, policy, and resource state.",
        },
        {
          question: "Parallel tool calls are safest when…",
          options: [
            "They are independent and read-only or non-conflicting",
            "They all write the same record",
            "Order is essential",
            "The model says ‘parallel’",
          ],
          answer: 0,
          explanation:
            "Dependencies and write conflicts require sequencing.",
        },
      ],
      labs: [
        "Tool Lifecycle — state-machine animation: expose schema, model proposal, validation, authorization, approval, execution, result compaction, and continuation; inject timeouts and duplicate calls.",
        "Parallelism Planner — dependency graph interaction: arrange tool calls into a DAG and decide which reads can run concurrently and which writes must sequence.",
        "Base mental-model animation: Expose → Propose → Authorize → Execute, step by step.",
      ],
    },
    {
      slug: "07-agents",
      order: 7,
      studyGuide: llmEngineeringStudyGuides[7],
      title: "Agents",
      phase: "Application core",
      hours: 4,
      depth: "deep",
      outcome:
        "Design bounded model–action–observation loops with state, checkpoints, approvals, and failure recovery.",
      why: "An agent is useful when the path cannot be completely specified in advance but progress can be observed and actions can be bounded. It is not a synonym for any LLM call.",
      coverage: [
        "Loop: model → action → observation → replan.",
        "State: working memory, durable run state, artifacts.",
        "Horizon: long tasks, checkpoints, resumability.",
        "Control: human approval, permissions, budgets.",
        "Failure: retries, recovery, loop detection, dead ends.",
        "Architecture: single/multi-agent, delegation, deterministic workflows.",
      ],
      mentalModel: {
        statement:
          "A robust agent loop advances durable state under budgets and policy.",
        flow: [
          { label: "Observe", detail: "State + goal" },
          { label: "Plan", detail: "Next bounded step" },
          { label: "Act", detail: "Tool under policy" },
          { label: "Check", detail: "Progress + stop" },
        ],
      },
      lessons: llmEngineeringLessons[7],
      seniorSignal:
        "Define the agent's success condition and maximum autonomy before describing the planner.",
      pitfalls: [
        "Using an agent for a fixed three-step API workflow",
        "Keeping all state only in prompt history",
        "No non-progress or cost limit",
        "Multi-agent design with no independent work or ownership boundaries",
      ],
      drill: {
        prompt:
          "Design a web research agent that may run 30 minutes and produce a cited report.",
        constraints: ["30 min", "web tools", "citations", "partial success"],
        approach:
          "Persist a research plan, claims, source records, and checkpoints. Search in bounded branches, deduplicate sources, validate citation-to-claim coverage, and track budget/non-progress. Treat pages as untrusted data, require stronger evidence for high-stakes claims, and finish with either a coverage-checked report or explicit gaps.",
      },
      quiz: [
        {
          question: "When is a deterministic workflow preferable?",
          options: [
            "When steps and transitions are known",
            "Whenever an LLM is available",
            "Only for arithmetic",
            "Never",
          ],
          answer: 0,
          explanation:
            "Known workflows gain reliability and observability from explicit control flow.",
        },
        {
          question: "What should survive worker loss?",
          options: [
            "Only the original prompt",
            "Durable run state, effects, artifacts, and checkpoints",
            "GPU memory",
            "A WebSocket only",
          ],
          answer: 1,
          explanation:
            "Long-running tasks require external state to resume safely.",
        },
      ],
      labs: [
        "Agent Loop Console — step-through simulator: show goal, state, plan, action, observation, and replan; add token/time/tool budgets and detect oscillation or repeated non-progress.",
        "Workflow or Agent? — sorting exercise: classify tasks as deterministic workflows, model steps inside workflows, or bounded agents; explain what uncertainty requires adaptive planning.",
        "Base mental-model animation: Observe → Plan → Act → Check, step by step.",
      ],
    },
    {
      slug: "08-retrieval-augmented-generation",
      order: 8,
      studyGuide: llmEngineeringStudyGuides[8],
      title: "Retrieval-augmented generation",
      phase: "Knowledge systems",
      hours: 4,
      depth: "core",
      outcome:
        "Build and evaluate a permission-aware retrieval pipeline from ingestion through grounded output.",
      why: "RAG injects external evidence into model context. Its quality ceiling is usually retrieval: if the right evidence is missing, buried, stale, or unauthorized, generation cannot reliably repair it.",
      coverage: [
        "Ingestion: parsing, normalization, chunking, metadata.",
        "Retrieval: embeddings, vector search, lexical search, filters.",
        "Ranking: hybrid fusion, reranking, diversity.",
        "Assembly: context budget, ordering, citations.",
        "Freshness: updates, deletion, index lag.",
        "Security: document-level permissions and tenant isolation.",
        "Failure: bad/missing/excess/conflicting context.",
        "Evaluation: recall, ranking, answer grounding.",
      ],
      mentalModel: {
        statement:
          "RAG is a search system feeding an evidence-constrained generation system.",
        flow: [
          { label: "Ingest", detail: "Parse + chunk" },
          { label: "Retrieve", detail: "Hybrid + ACL" },
          { label: "Rerank", detail: "Relevance + diversity" },
          { label: "Generate", detail: "Cite + abstain" },
        ],
      },
      lessons: llmEngineeringLessons[8],
      seniorSignal:
        "In an interview, separate retrieval recall, context precision, and generation faithfulness. Each needs different fixes.",
      pitfalls: [
        "Using only vector similarity for product codes",
        "Adding more chunks whenever answers fail",
        "Filtering permissions after generation",
        "Measuring only final answer vibes",
      ],
      drill: {
        prompt:
          "Design enterprise RAG over 100M documents with per-document ACLs and 5-minute freshness.",
        constraints: ["100M docs", "ACLs", "5m freshness", "citations"],
        approach:
          "Stream document changes into parse/chunk/embed/index stages with versioned tombstones. Query with tenant and ACL filters before scoring, fuse lexical/vector candidates, rerank, and assemble diverse evidence. Store source/version IDs for citations and trace retrieval. Evaluate recall/freshness/security slices independently.",
      },
      quiz: [
        {
          question: "Why combine lexical and semantic retrieval?",
          options: [
            "To double cost only",
            "They cover exact-term and paraphrase failure modes",
            "To remove permissions",
            "To guarantee truth",
          ],
          answer: 1,
          explanation:
            "Identifiers favor lexical matching; semantic similarity captures varied wording.",
        },
        {
          question: "What should be measured before answer style?",
          options: [
            "Retrieval recall and ranking",
            "Button clicks",
            "GPU temperature only",
            "Font size",
          ],
          answer: 0,
          explanation:
            "Generation cannot cite evidence that retrieval never supplied.",
        },
      ],
      labs: [
        "RAG Pipeline Explorer — end-to-end interactive: adjust chunking, hybrid weights, metadata/ACL filters, candidate count, reranking, context count, and freshness; show recall, precision, cost, and groundedness.",
        "Retrieval Failure Lab — ranked result inspector: use exact identifiers, paraphrases, stale documents, permission conflicts, and duplicate chunks to demonstrate lexical/vector strengths and common failures.",
        "Base mental-model animation: Ingest → Retrieve → Rerank → Generate, step by step.",
      ],
    },
    {
      slug: "09-embeddings",
      order: 9,
      studyGuide: llmEngineeringStudyGuides[9],
      title: "Embeddings",
      phase: "Knowledge systems",
      hours: 2,
      depth: "core",
      outcome:
        "Reason about embedding applications, distance metrics, indexing, and approximation tradeoffs.",
      why: "Embeddings map inputs into vectors where geometric proximity can reflect learned similarity. They enable retrieval and grouping, but the geometry is task- and model-dependent—not universal meaning.",
      coverage: [
        "Representation: semantic vector spaces and model dependence.",
        "Metrics: cosine similarity, dot product, Euclidean distance.",
        "Applications: search, clustering, classification, recommendations, deduplication.",
        "Scale: dimensionality, exact search, approximate nearest neighbors.",
        "Indexes: graph, inverted/product-quantized intuition.",
        "Quality: thresholds, hard negatives, drift, evaluation.",
      ],
      mentalModel: {
        statement:
          "Embed query and candidates into one space, retrieve neighbors, then apply task constraints.",
        flow: [
          { label: "Encode", detail: "Input → vector" },
          { label: "Index", detail: "Organize space" },
          { label: "Compare", detail: "Distance/similarity" },
          { label: "Filter", detail: "Task + metadata" },
        ],
      },
      lessons: llmEngineeringLessons[9],
      seniorSignal:
        "State the metric and normalization assumption; then name the target recall/latency curve you would measure.",
      pitfalls: [
        "Treating similarity score as calibrated probability",
        "Changing embedding model without rebuilding/comparing the index",
        "Using one global threshold for every domain",
        "Assuming approximate search returns the true nearest neighbors",
      ],
      drill: {
        prompt:
          "Choose an embedding and indexing plan for 200M code symbols used by a coding assistant.",
        constraints: [
          "200M vectors",
          "code + prose queries",
          "frequent updates",
          "50ms retrieval",
        ],
        approach:
          "Evaluate candidate embeddings on real code queries and hard negatives. Use an ANN index with language/repo filters, measure recall@k under 50ms, version vectors by model, and stream updates/tombstones. Hybridize with lexical symbol matching for exact names.",
      },
      quiz: [
        {
          question: "With normalized vectors, cosine ranking matches…",
          options: [
            "Dot-product ranking",
            "Random ranking",
            "Document age",
            "Token count",
          ],
          answer: 0,
          explanation:
            "When norms are equal, dot product is proportional to cosine similarity.",
        },
        {
          question: "ANN primarily trades…",
          options: [
            "Some recall for lower latency/scale",
            "Security for cost",
            "Tokens for images",
            "Training for prompting",
          ],
          answer: 0,
          explanation:
            "Approximation avoids exhaustive comparisons but can miss exact neighbors.",
        },
      ],
      labs: [
        "Embedding Space — 2D projection: plot semantically related and misleadingly similar items; toggle cosine, dot product, and Euclidean distance with a warning that the projection is illustrative.",
        "ANN Frontier — recall/latency chart: move index search parameters and filters to trade exact-neighbor recall for latency and memory.",
        "Base mental-model animation: Encode → Index → Compare → Filter, step by step.",
      ],
    },
    {
      slug: "10-context-and-memory",
      order: 10,
      studyGuide: llmEngineeringStudyGuides[10],
      title: "Context & memory",
      phase: "Knowledge systems",
      hours: 3,
      depth: "core",
      outcome:
        "Allocate context and design safe memory that remains relevant, fresh, and user-controlled.",
      why: "Context is scarce working space; memory is a product subsystem that selects what to put there. More history can increase cost and distract the model while making stale assumptions feel authoritative.",
      coverage: [
        "Working context: window limits, instruction/history/tool budgets.",
        "Compression: summaries, compaction, lossy state.",
        "Retrieval memory: store, embed, rank, inject.",
        "State: session state vs durable preferences/facts.",
        "Quality: relevance, freshness, contradiction, context rot.",
        "Privacy: consent, visibility, deletion, sensitive inference.",
      ],
      mentalModel: {
        statement:
          "Memory is a write policy plus a retrieval policy, both under user control.",
        flow: [
          { label: "Observe", detail: "Candidate fact" },
          { label: "Decide", detail: "Worth storing?" },
          { label: "Retrieve", detail: "Relevant now?" },
          { label: "Reconcile", detail: "Fresh + permitted?" },
        ],
      },
      lessons: llmEngineeringLessons[10],
      seniorSignal:
        "Treat memory as data product with consent, provenance, and evaluation—not a bigger prompt buffer.",
      pitfalls: [
        "Persisting every utterance",
        "Injecting all memories into every turn",
        "No user correction/deletion mechanism",
        "Summarizing away permissions or unresolved decisions",
      ],
      drill: {
        prompt:
          "Design persistent user memory for a general assistant that works across health, travel, and work contexts.",
        constraints: [
          "cross-domain",
          "sensitive facts",
          "user control",
          "context budget",
        ],
        approach:
          "Create scoped memory types with explicit/implicit provenance, sensitivity labels, TTL/review policy, and user controls. Gate cross-domain retrieval, rank by relevance and recency, surface material assumptions, and evaluate false recall, missed recall, contradiction handling, and deletion completeness.",
      },
      quiz: [
        {
          question: "What makes a memory safe to inject?",
          options: [
            "It is old",
            "It is relevant, permitted, fresh enough, and provenance-aware",
            "It is long",
            "It was generated by a model",
          ],
          answer: 1,
          explanation:
            "Memory selection is a contextual authorization and quality decision.",
        },
        {
          question: "Why can more context hurt?",
          options: [
            "It always changes the tokenizer",
            "Irrelevant/stale material distracts and raises cost",
            "GPUs reject text",
            "It removes sampling",
          ],
          answer: 1,
          explanation:
            "Attention and reasoning can be diluted by noisy context, and prefill cost rises.",
        },
      ],
      labs: [
        "Context Packing — token-budget puzzle: drag policy, recent history, summaries, retrieved evidence, memories, and tool results into a fixed window; expose loss, cost, and output-headroom tradeoffs.",
        "Memory Gate — decision flow: decide whether a user statement should be stored, its scope/sensitivity/TTL/provenance, and whether it should be retrieved in a later scenario.",
        "Base mental-model animation: Observe → Decide → Retrieve → Reconcile, step by step.",
      ],
    },
    {
      slug: "11-evaluation",
      order: 11,
      studyGuide: llmEngineeringStudyGuides[11],
      title: "Evaluation",
      phase: "Production AI",
      hours: 4,
      depth: "core",
      outcome:
        "Build an eval-driven development loop across datasets, graders, human calibration, and online outcomes.",
      why: "Traditional unit tests still protect deterministic code; evals measure variable behavior and distributions. The key is a task-specific definition of success that stays connected to real user outcomes.",
      coverage: [
        "Datasets: golden cases, production samples, adversarial and slice coverage.",
        "Judgment: human evaluation, model-as-judge, pairwise comparison.",
        "Metrics: factuality, relevance, instruction following, safety, tool correctness.",
        "Regression: prompt/model/tool changes and release gates.",
        "Online: A/B tests, feedback, business outcomes.",
        "Integrity: leakage, grader bias, calibration, drift.",
      ],
      mentalModel: {
        statement:
          "Production failures become cases; cases guide changes; changes earn rollout through gates.",
        flow: [
          { label: "Define", detail: "Task success" },
          { label: "Collect", detail: "Representative cases" },
          { label: "Grade", detail: "Calibrated signals" },
          { label: "Ship", detail: "Gate + monitor" },
        ],
      },
      lessons: llmEngineeringLessons[11],
      seniorSignal:
        "Say: “I would not ship from a single aggregate score. I need the regression slices, cost/latency delta, and human-calibrated grader agreement.”",
      pitfalls: [
        "Vibe-based testing",
        "A tiny curated set with no production distribution",
        "Uncalibrated model-as-judge as sole truth",
        "Optimizing a leaked or repeatedly tuned holdout",
      ],
      drill: {
        prompt:
          "Create an eval plan for an AI marketing-copy builder used by internal teams.",
        constraints: [
          "brand voice",
          "factual claims",
          "structured fields",
          "human feedback",
        ],
        approach:
          "Define schema validity, brief adherence, unsupported claims, brand/risk rules, and edit-distance-to-accepted outcome. Sample real briefs across campaigns, add adversarial content, calibrate pairwise judges with marketers, and gate regressions by slice plus latency/cost. Feed accepted edits back as new cases—not automatic labels.",
      },
      quiz: [
        {
          question: "Best first eval question?",
          options: [
            "Which judge model?",
            "What exact task success and failure mean",
            "Which chart color?",
            "How many GPUs?",
          ],
          answer: 1,
          explanation:
            "The objective determines data and graders; tools come afterward.",
        },
        {
          question: "Why calibrate model judges?",
          options: [
            "They can carry bias and disagree with humans",
            "They cannot output text",
            "It reduces context size",
            "It guarantees zero cost",
          ],
          answer: 0,
          explanation:
            "Automated judgments are themselves model outputs and need agreement checks.",
        },
      ],
      labs: [
        "Eval Workbench — dataset + grader explorer: slice cases by task and failure type, compare prompt/model variants, inspect aggregate-versus-slice regressions, and reveal grader/human disagreement.",
        "Judge Calibration — confusion matrix interaction: adjust a model-judge threshold against human labels and watch precision, recall, agreement, and launch decisions change.",
        "Base mental-model animation: Define → Collect → Grade → Ship, step by step.",
      ],
      references: [
        {
          label: "Evaluation best practices (OpenAI docs)",
          href: "https://developers.openai.com/api/docs/guides/evaluation-best-practices",
          lastReviewed: "2026-09",
        },
        {
          label: "Evals examples (OpenAI cookbook)",
          href: "https://github.com/openai/openai-cookbook",
          lastReviewed: "2026-09",
        },
        {
          label: "Claude docs hub (Anthropic)",
          href: "https://docs.anthropic.com/",
          lastReviewed: "2026-09",
        },
        {
          label: "Gemini API docs (Google)",
          href: "https://ai.google.dev/gemini-api/docs",
          lastReviewed: "2026-09",
        },
      ],
    },
    {
      slug: "12-reliability-and-failure-modes",
      order: 12,
      studyGuide: llmEngineeringStudyGuides[12],
      title: "Reliability & failure modes",
      phase: "Production AI",
      hours: 3,
      depth: "core",
      outcome:
        "Wrap probabilistic and upstream failures in deterministic recovery and safe degradation.",
      why: "AI applications add model variability, invalid outputs, context overflow, retrieval misses, tool errors, loops, and provider limits to ordinary distributed-system failure.",
      coverage: [
        "Model: hallucination, nondeterminism, instruction conflicts.",
        "Interface: invalid schema, tool hallucination, context overflow.",
        "Agent: loops, non-progress, duplicate side effects.",
        "Knowledge: retrieval misses, stale/conflicting context.",
        "Provider: rate limits, timeouts, outages.",
        "Recovery: retries, fallback, routing, degradation, guardrails.",
      ],
      mentalModel: {
        statement:
          "Classify the failure before choosing retry, repair, fallback, abstain, or human review.",
        flow: [
          { label: "Detect", detail: "Typed failure" },
          { label: "Contain", detail: "Budget + cancel" },
          { label: "Recover", detail: "Repair or route" },
          { label: "Record", detail: "Case + metric" },
        ],
      },
      lessons: llmEngineeringLessons[12],
      seniorSignal:
        "Produce a failure matrix: failure → detection → user impact → automatic action → audit/metric. It shows operational maturity fast.",
      pitfalls: [
        "Retrying every failure",
        "Silent downgrade to an incompatible model",
        "Assuming schema validity equals semantic validity",
        "No reconciliation for ambiguous tool timeouts",
      ],
      drill: {
        prompt:
          "Design the failure policy for a customer-support agent that reads accounts and can issue credits.",
        constraints: [
          "money effect",
          "rate limits",
          "model outage",
          "partial streams",
        ],
        approach:
          "Separate read/generate/write stages. Retry safe reads, route generation through a tested fallback, and never repeat credit issuance without the same idempotency key. Require approval or strict policy for credits, preserve an audit record, and tell the user when outcome is unknown. Reconcile later by operation ID.",
      },
      quiz: [
        {
          question: "When should a model outage silently fall back?",
          options: [
            "Always",
            "Only when capability, policy, and product semantics are tested compatible",
            "Never under any condition",
            "When logs are disabled",
          ],
          answer: 1,
          explanation:
            "Fallback may materially change correctness or safety; compatibility is an explicit contract.",
        },
        {
          question: "Best response to an ambiguous timed-out write?",
          options: [
            "Retry with new ID",
            "Query/reconcile using the same operation ID",
            "Assume failure",
            "Ignore it",
          ],
          answer: 1,
          explanation:
            "The side effect may have committed; stable identity lets the system learn the outcome safely.",
        },
      ],
      labs: [
        "Failure Matrix — interactive table: select hallucination, invalid schema, retrieval miss, tool timeout, provider outage, rate limit, context overflow, or loop; map each to detect, contain, recover, and record.",
        "Fallback Graph — routing simulator: fail a model route and compare silent fallback, disclosed downgrade, queued work, abstention, and hard failure across quality, safety, cost, and latency.",
        "Base mental-model animation: Detect → Contain → Recover → Record, step by step.",
      ],
    },
    {
      slug: "13-safety-and-security",
      order: 13,
      studyGuide: llmEngineeringStudyGuides[13],
      title: "Safety & security",
      phase: "Production AI",
      hours: 4,
      depth: "deep",
      outcome:
        "Threat-model model inputs, retrieved content, tools, data, and autonomy with defense in depth.",
      why: "AI security combines traditional application controls with a new interpreter: untrusted language can influence model decisions. Prompt injection is a trust-boundary problem, not a string-filter problem.",
      coverage: [
        "Adversarial input: prompt injection and jailbreaks.",
        "Data: exfiltration, sensitive handling, user-generated content.",
        "Actions: tool abuse, confused deputy, least privilege.",
        "Isolation: sandboxing, network/filesystem policy.",
        "Content: moderation and risk-specific policy.",
        "Governance: human approval, trusted/untrusted provenance, defense in depth.",
      ],
      mentalModel: {
        statement:
          "Untrusted text may inform a decision; it must not grant authority.",
        flow: [
          { label: "Label", detail: "Trust + provenance" },
          { label: "Limit", detail: "Context + tools" },
          { label: "Authorize", detail: "Deterministic policy" },
          { label: "Contain", detail: "Sandbox + audit" },
        ],
      },
      lessons: llmEngineeringLessons[13],
      seniorSignal:
        "Phrase the invariant: “No model-visible string can increase its authority; only trusted policy can.”",
      pitfalls: [
        "Trying to regex away all prompt injection",
        "Giving broad production credentials to a sandbox",
        "Trusting retrieved documents because they are internal",
        "Using human approval as a vague checkbox instead of a specific effect preview",
      ],
      drill: {
        prompt:
          "Threat-model a browser agent that can log into sites, download files, and fill forms.",
        constraints: ["hostile pages", "credentials", "downloads", "external writes"],
        approach:
          "Keep credentials in an isolated broker, not page/model context; allowlist tool capabilities and destinations; scan and quarantine downloads; treat page text as untrusted; require explicit previews/approval for consequential submissions; cap sessions and retain audit evidence. Test indirect injections that ask the agent to exfiltrate data.",
      },
      quiz: [
        {
          question: "Can prompt text ever grant a new permission?",
          options: [
            "Yes, if persuasive",
            "No; trusted deterministic policy grants permissions",
            "Yes, if from a PDF",
            "Only at temperature zero",
          ],
          answer: 1,
          explanation:
            "Authority must come from authenticated policy, never untrusted language.",
        },
        {
          question: "Why sandbox tool execution?",
          options: [
            "To make text prettier",
            "To contain mistakes or hostile code within bounded resources",
            "To improve tokenization",
            "To replace authorization",
          ],
          answer: 1,
          explanation:
            "Sandboxing limits blast radius but remains one defense layer.",
        },
      ],
      labs: [
        "Injection Attack Path — red-team simulator: a hostile webpage or document attempts to reveal data or expand authority; learners place provenance labels, retrieval limits, policy checks, approval, and sandbox controls.",
        "Autonomy Risk Ladder — scenario sorter: order actions from read-only retrieval through reversible drafts to money movement and destructive changes; assign permissions and approval boundaries.",
        "Base mental-model animation: Label → Limit → Authorize → Contain, step by step.",
      ],
    },
    {
      slug: "14-building-llm-products",
      order: 14,
      studyGuide: llmEngineeringStudyGuides[14],
      title: "Building LLM products",
      phase: "Product systems",
      hours: 3,
      depth: "core",
      outcome:
        "Choose models and UX patterns across intelligence, latency, cost, streaming, feedback, and failure.",
      why: "An AI feature succeeds as a product, not a demo. Users experience waiting, uncertainty, corrections, citations, and partial failure—not benchmark scores in isolation.",
      coverage: [
        "Selection: model intelligence, latency, cost, modality, tool support.",
        "Routing: task/risk-based routes and fallbacks.",
        "UX: streaming, conversation state, citations, explainability.",
        "Jobs: async/background work and progress.",
        "Control: guardrails, rate limits, cost budgets.",
        "Learning: feedback, observability, product metrics.",
      ],
      mentalModel: {
        statement:
          "Match model effort and user experience to task value, risk, and time horizon.",
        flow: [
          { label: "Classify", detail: "Task + risk" },
          { label: "Route", detail: "Model + tools" },
          { label: "Experience", detail: "Stream or async" },
          { label: "Learn", detail: "Feedback + eval" },
        ],
      },
      lessons: llmEngineeringLessons[14],
      seniorSignal:
        "Frame model choice as an empirical product decision: task distribution × acceptable failure × latency/cost budget.",
      pitfalls: [
        "Choosing the biggest model by default",
        "Streaming without cancellation semantics",
        "Treating thumbs-up as ground truth",
        "Hiding fallback-induced capability changes",
      ],
      drill: {
        prompt:
          "Design the product experience for an AI code review assistant on pull requests.",
        constraints: [
          "developer trust",
          "10-min deep review",
          "false positives",
          "cost budget",
        ],
        approach:
          "Run cheap deterministic checks immediately, stream only stable findings, and make deep semantic review an async job with progress. Cite exact code and rationale, let developers resolve/feedback, route complex diffs to stronger models, and evaluate accepted findings, misses, noise, latency, and cost per useful finding.",
      },
      quiz: [
        {
          question: "Best model-selection metric?",
          options: [
            "Largest parameter count",
            "Cost/latency/quality on the real task distribution",
            "Most recent release name",
            "Longest output",
          ],
          answer: 1,
          explanation:
            "Production choice is a measured multi-objective frontier.",
        },
        {
          question: "Useful feedback signal beyond thumbs?",
          options: [
            "Whether users accept, edit, complete, or escalate",
            "Screen brightness",
            "Token ID parity",
            "DNS TTL",
          ],
          answer: 0,
          explanation:
            "Behavioral outcomes are often closer to task value.",
        },
      ],
      labs: [
        "Model Routing Frontier — quality/latency/cost plot: plot model candidates using task-specific eval data; adjust task value and risk to see routing and escalation policies change.",
        "Streaming UX Timeline — prototype interaction: compare immediate stream, buffered verified output, and async job progress; include cancel, partial artifact, retry, and fallback states.",
        "Base mental-model animation: Classify → Route → Experience → Learn, step by step.",
      ],
    },
    {
      slug: "15-llm-application-architectures",
      order: 15,
      studyGuide: llmEngineeringStudyGuides[15],
      title: "LLM application architectures",
      phase: "Product systems",
      hours: 3,
      depth: "patterns",
      outcome:
        "Select the smallest architecture pattern that fits the task and autonomy level.",
      why: "Most LLM products fit a small set of shapes. Recognizing them keeps designs simple and helps you identify where determinism, retrieval, tools, and approval belong.",
      coverage: [
        "Direct: simple chat, classification, structured extraction.",
        "Grounded: search + RAG and citation workflows.",
        "Assistive: coding, support, research, and data-analysis assistants.",
        "Interactive: browser/computer-use agents.",
        "Workflow: automation and multi-step business processes.",
        "Autonomy: deterministic, approval-gated, bounded autonomous.",
      ],
      mentalModel: {
        statement:
          "Add complexity only when the task needs new information, actions, or adaptive planning.",
        flow: [
          { label: "Generate", detail: "One response" },
          { label: "Retrieve", detail: "External knowledge" },
          { label: "Tool", detail: "Deterministic action" },
          { label: "Agent", detail: "Adaptive loop" },
        ],
      },
      lessons: llmEngineeringLessons[15],
      seniorSignal:
        "For any AI prompt, say which of four levels applies: generate, retrieve, tool, or agent—and why the simpler previous level is insufficient.",
      pitfalls: [
        "Calling every multi-step workflow an agent",
        "Using RAG when the missing need is a calculator/API",
        "Giving autonomous writes where draft-and-approve works",
        "No evidence-based completion check",
      ],
      drill: {
        prompt:
          "Classify and sketch architectures for invoice extraction, policy Q&A, refund support, and web research.",
        constraints: ["4 systems", "5 min each", "smallest pattern", "verification"],
        approach:
          "Invoice: schema extraction + validation. Policy Q&A: ACL-aware RAG + citations. Refund: workflow + read tools + gated idempotent write. Research: bounded agent + web tools + claim/source state + citation verification.",
      },
      quiz: [
        {
          question: "When does RAG help most?",
          options: [
            "When the model needs external/fresh/private knowledge",
            "When arithmetic must be exact",
            "When permissions are unnecessary",
            "When output must be shorter",
          ],
          answer: 0,
          explanation:
            "RAG supplies evidence; it does not replace deterministic computation or authorization.",
        },
        {
          question: "A fixed multi-step business process should default to…",
          options: [
            "A workflow with bounded model steps",
            "An unconstrained autonomous agent",
            "One giant prompt",
            "Manual retries only",
          ],
          answer: 0,
          explanation:
            "Explicit transitions improve correctness, observability, and recovery.",
        },
      ],
      labs: [
        "Architecture Chooser — progressive complexity tool: start with one model call and add retrieval, deterministic tools, workflow orchestration, or an agent only when a scenario proves the simpler level insufficient.",
        "Verification Map — pattern matrix: map extraction to schema checks, research to citations, coding to tests/diffs, support to policy/account checks, and analysis to executable computation.",
        "Base mental-model animation: Generate → Retrieve → Tool → Agent, step by step.",
      ],
    },
    {
      slug: "16-coding-agents-and-software-engineering",
      order: 16,
      studyGuide: llmEngineeringStudyGuides[16],
      title: "Coding agents & software engineering",
      phase: "Agent systems",
      hours: 4,
      depth: "deep",
      outcome:
        "Design a code-changing loop that understands repositories, edits safely, verifies, and recovers over long horizons.",
      why: "Coding agents operate over huge, changing state with delayed feedback. Success needs navigation, planning, precise edits, execution, tests, context management, and permission boundaries.",
      coverage: [
        "Understanding: repository search, symbols, dependency and instruction discovery.",
        "Planning: scope, change graph, risk, checkpoints.",
        "Editing: patches, file ownership, generated code.",
        "Verification: tests, builds, static analysis, failure interpretation.",
        "Review: diff quality, regressions, user intent.",
        "Runtime: sandbox, permissions, long tasks, context compaction.",
        "Contrast: why this is harder than autocomplete.",
      ],
      mentalModel: {
        statement:
          "The coding loop turns intent into a small verified diff, using repository feedback as evidence.",
        flow: [
          { label: "Orient", detail: "Rules + search" },
          { label: "Plan", detail: "Files + tests" },
          { label: "Patch", detail: "Minimal change" },
          { label: "Verify", detail: "Run + repair" },
        ],
      },
      lessons: llmEngineeringLessons[16],
      seniorSignal:
        "Connect this to your engineering background: deterministic orchestration, clear contracts, and explicit ownership around a probabilistic planner are strong experience stories.",
      pitfalls: [
        "Reading the whole repository into context",
        "Editing before discovering local instructions/tests",
        "Re-running the same failing command with no new hypothesis",
        "Declaring success without inspecting the diff and relevant tests",
      ],
      drill: {
        prompt:
          "Design the backend of a coding agent that receives a GitHub issue and returns a reviewed pull request.",
        constraints: ["large repos", "untrusted code", "45 min", "human review"],
        approach:
          "Create a durable run, clone into an ephemeral sandbox with scoped credentials, discover repo rules, build a plan, patch in checkpoints, run targeted then broader tests, and persist artifacts/traces. Bound network/secrets, stop on non-progress, summarize risks, and require user review before publishing effects.",
      },
      quiz: [
        {
          question: "Best way to understand a large repo?",
          options: [
            "Put every file in the prompt",
            "Search and incrementally build a task-specific map",
            "Guess conventions",
            "Edit package files first",
          ],
          answer: 1,
          explanation:
            "Selective navigation preserves context for relevant code and evidence.",
        },
        {
          question: "Why is a coding agent harder than autocomplete?",
          options: [
            "It uses fewer tokens",
            "It must manage state, tools, delayed feedback, and recovery across many steps",
            "It cannot read code",
            "It never runs tests",
          ],
          answer: 1,
          explanation:
            "Long-horizon closed-loop action adds orchestration and failure complexity.",
        },
      ],
      labs: [
        "Coding-Agent Flight Recorder — long-horizon trace: show repository discovery, plan, patch, tests, failure interpretation, repair, checkpoint, and review; highlight compaction and resumability.",
        "Repository Context Map — search/navigation explorer: reveal only task-relevant files and symbols as the learner searches; show why full-repository prompt stuffing wastes context.",
        "Base mental-model animation: Orient → Plan → Patch → Verify, step by step.",
      ],
    },
    {
      slug: "17-llm-infrastructure-at-scale",
      order: 17,
      studyGuide: llmEngineeringStudyGuides[17],
      title: "LLM infrastructure at scale",
      phase: "Agent systems",
      hours: 4,
      depth: "deep",
      outcome:
        "Design gateways, queues, caches, quotas, tenant isolation, and capacity around scarce model compute.",
      why: "This chapter is system design through an AI lens: requests differ by tokens and features, streams stay open, providers/fleets vary, and cost attribution matters per tenant and model.",
      coverage: [
        "Gateway: model abstraction, policy, multi-model routing.",
        "Admission: quotas, rate limits, concurrency, token reservation.",
        "Scheduling: queues, priority, batch inference, fairness.",
        "Delivery: streaming connections, cancellation, backpressure.",
        "Efficiency: prefix/output caches and batching.",
        "Operations: telemetry, cost attribution, capacity, regional availability.",
        "Scarcity: GPU allocation and graceful degradation.",
      ],
      mentalModel: {
        statement:
          "A model gateway converts tenant policy and workload shape into an admitted, routed, observable request.",
        flow: [
          { label: "Identify", detail: "Tenant + task" },
          { label: "Reserve", detail: "Tokens + spend" },
          { label: "Route", detail: "Model + region" },
          { label: "Account", detail: "Actual + outcome" },
        ],
      },
      lessons: llmEngineeringLessons[17],
      seniorSignal:
        "Estimate tokens/sec and KV occupancy alongside RPS. This is the bridge from classic capacity planning to inference systems.",
      pitfalls: [
        "One RPS limit for every request size",
        "Opaque routing that changes capabilities silently",
        "No cost attribution by tenant/task",
        "Fallback fleet sharing the same failure domain",
      ],
      drill: {
        prompt:
          "Design a model gateway serving 10k enterprise tenants across hosted and self-run models.",
        constraints: [
          "10k tenants",
          "multi-model",
          "regional",
          "cost attribution",
        ],
        approach:
          "Authenticate tenant, classify capability/risk, reserve token/spend/concurrency quotas, route by policy and health, stream typed events, and reconcile usage. Maintain capability metadata, per-route circuit breakers, weighted fairness, regional failover, prompt/model version telemetry, and tested degradation tiers.",
      },
      quiz: [
        {
          question: "Why is RPS alone insufficient?",
          options: [
            "Models ignore requests",
            "Token and context sizes vary compute/memory by orders of magnitude",
            "RPS cannot be counted",
            "It is always zero",
          ],
          answer: 1,
          explanation:
            "AI requests are heterogeneous; tokens and concurrency predict resource use better.",
        },
        {
          question: "What should admission reserve?",
          options: [
            "Only a socket",
            "Estimated scarce capacity/spend, reconciled to actual usage",
            "A database name",
            "No resources",
          ],
          answer: 1,
          explanation:
            "Reservation avoids accepting work the system cannot afford or serve.",
        },
      ],
      labs: [
        "Token-Shaped Capacity — inference gateway simulator: vary request rate, prompt/output distributions, prefix-cache hits, model mix, and fleet size; display queued tokens, TTFT risk, KV pressure, and cost attribution.",
        "Tenant Fairness — queue animation: compare FIFO, per-tenant concurrency, weighted fair share, size classes, and reserved priority capacity under one noisy tenant.",
        "Base mental-model animation: Identify → Reserve → Route → Account, step by step.",
      ],
    },
    {
      slug: "18-modern-llm-platform-concepts",
      order: 18,
      studyGuide: llmEngineeringStudyGuides[18],
      title: "Modern LLM platform concepts",
      phase: "LLM platforms",
      hours: 4,
      depth: "current",
      outcome:
        "Navigate the durable primitives exposed by modern LLM platforms and reason about provider evolution without memorizing a release snapshot.",
      why: "Platform details change. Engineering fluency means understanding durable concepts—model requests, typed content, streaming, tools, retrieval, realtime sessions, state, and evaluation—while checking each provider's current official documentation for models, limits, deprecations, and capabilities.",
      coverage: [
        "Core API: model requests, typed content/items, multimodal input/output, and provider adapters.",
        "Delivery: semantic streaming events and conversation state.",
        "Control: structured outputs, function calling, built-in tools.",
        "Knowledge: files, retrieval/vector stores, embeddings.",
        "Realtime: low-latency audio sessions and server controls.",
        "Agents: long-running/background work, tool loops, tracing.",
        "Platform: safety layers, rate/usage limits, model strategy, compatibility.",
      ],
      mentalModel: {
        statement:
          "Treat every model platform as a set of composable primitives behind an application-owned policy, state, and evaluation layer.",
        flow: [
          { label: "Model API", detail: "Typed content + state" },
          { label: "Tools", detail: "Built-in + custom" },
          { label: "Realtime", detail: "Live sessions" },
          { label: "Evaluation", detail: "Measure behavior" },
        ],
      },
      lessons: llmEngineeringLessons[18],
      seniorSignal:
        "Say: “I know the durable platform primitives; I would verify current model and tool support in the provider's official documentation before locking the implementation.”",
      pitfalls: [
        "Memorizing current model names as architecture",
        "Assuming every model supports every tool or modality",
        "Letting provider conversation state become your only source of truth",
        "Migrating models without evals and rollback",
      ],
      drill: {
        prompt:
          "Sketch a vendor-resilient LLM application layer for chat, tools, file retrieval, and streaming.",
        constraints: [
          "one initial provider",
          "streaming",
          "tools",
          "future evolution",
        ],
        approach:
          "Define an internal request/event/tool contract, map it to the provider's structured content and streaming events, store durable application state, and isolate capability differences. Keep tool execution and authorization in your service, record versions and usage, verify current limits in official docs, and gate migrations with offline evals plus canary rollback.",
      },
      quiz: [
        {
          question: "Where should current model/tool compatibility be verified?",
          options: [
            "An old blog screenshot",
            "The selected provider's official documentation at implementation time",
            "A guessed alias",
            "The UI color theme",
          ],
          answer: 1,
          explanation:
            "Capabilities and limits evolve; authoritative current documentation is the correct source.",
        },
        {
          question:
            "How should an application handle provider-specific request and streaming formats?",
          options: [
            "Expose them directly throughout every product layer",
            "Hide all capability differences behind a lowest-common-denominator text API",
            "Map them through an internal contract while preserving meaningful capabilities",
            "Copy the provider SDK into the application repository",
          ],
          answer: 2,
          explanation:
            "An adapter limits vendor coupling, while capability-aware types avoid reducing every provider to an inadequate text-only interface.",
        },
      ],
      labs: [
        "LLM Platform Map — capability topology: connect typed model content, streaming events, custom and built-in tools, retrieval, realtime sessions, state, and evaluation behind an application-owned policy layer.",
        "Living Docs Cards — update-sensitive reference panel: link the chosen providers' current official documentation for model/tool support, limits, and deprecations; date-stamp verification instead of hard-coding volatile facts.",
        "Base mental-model animation: Model API → Tools → Realtime → Evaluation, step by step.",
      ],
      references: [
        {
          label: "Responses API migration and concepts (OpenAI)",
          href: "https://developers.openai.com/api/docs/guides/migrate-to-responses",
          lastReviewed: "2026-09",
        },
        {
          label: "Streaming Responses (OpenAI)",
          href: "https://developers.openai.com/api/docs/guides/streaming-responses",
          lastReviewed: "2026-09",
        },
        {
          label: "Using tools (OpenAI)",
          href: "https://developers.openai.com/api/docs/guides/tools",
          lastReviewed: "2026-09",
        },
        {
          label: "Realtime and audio (OpenAI)",
          href: "https://developers.openai.com/api/docs/guides/realtime",
          lastReviewed: "2026-09",
        },
        {
          label: "Claude docs hub (Anthropic)",
          href: "https://docs.anthropic.com/",
          lastReviewed: "2026-09",
        },
        {
          label: "Gemini API docs (Google)",
          href: "https://ai.google.dev/gemini-api/docs",
          lastReviewed: "2026-09",
        },
      ],
    },
    {
      slug: "19-ai-native-engineering-judgment",
      order: 19,
      studyGuide: llmEngineeringStudyGuides[19],
      title: "AI-native engineering judgment",
      phase: "Interview mode",
      hours: 3,
      depth: "core",
      outcome:
        "Place probabilistic behavior only where it creates value, then measure and bound it.",
      why: "The senior question is rarely ‘can an LLM do this?’ It is ‘where does semantic flexibility outweigh variability, cost, latency, and security risk—and how will the system fail safely?’",
      coverage: [
        "Boundary: deterministic code vs model judgment.",
        "Levers: prompting, RAG, tools, fine-tuning.",
        "Complexity: workflow vs agent.",
        "Autonomy: human approval and bounded effects.",
        "Correctness: probabilistic evidence, abstention, verification.",
        "Economics: quality/latency/cost measurement.",
        "Safety: safe failure and graceful degradation.",
      ],
      mentalModel: {
        statement:
          "Use the least powerful probabilistic mechanism that clears the measured task bar.",
        flow: [
          { label: "Prompt", detail: "Known context" },
          { label: "RAG", detail: "External knowledge" },
          { label: "Tune", detail: "Repeated behavior gap" },
          { label: "Agent", detail: "Adaptive actions" },
        ],
      },
      lessons: llmEngineeringLessons[19],
      seniorSignal:
        "For every model decision, ask: What evidence can verify it? What happens if it is wrong? Can the effect be reversed?",
      pitfalls: [
        "Using RAG, fine-tuning, and agents simultaneously before measuring baseline",
        "Letting the model enforce business invariants",
        "No abstention or escalation path",
        "Optimizing raw model score instead of successful outcome",
      ],
      drill: {
        prompt:
          "Choose an architecture for automatically triaging, diagnosing, and optionally fixing production incidents.",
        constraints: [
          "high consequence",
          "live systems",
          "partial automation",
          "audit",
        ],
        approach:
          "Use deterministic alerts/runbooks for known conditions, a model for synthesis and hypothesis generation, retrieval for current service docs, read-only diagnostic tools by default, and approval-gated bounded remediation. Evaluate diagnosis quality and harmful actions; require rollback, idempotency, budget, and full audit.",
      },
      quiz: [
        {
          question: "When should you fine-tune?",
          options: [
            "Before trying anything",
            "For a persistent measured behavior gap with representative data",
            "For fresh daily facts",
            "To enforce authorization",
          ],
          answer: 1,
          explanation:
            "Fine-tuning is justified by repeatable deficits after simpler levers are evaluated.",
        },
        {
          question: "Where should human approval sit?",
          options: [
            "Randomly",
            "At the boundary of consequential or irreversible effects",
            "Before every token",
            "Only after damage",
          ],
          answer: 1,
          explanation:
            "Approval should correspond to impact and reversibility.",
        },
      ],
      labs: [
        "Deterministic or Model? — boundary sorting activity: place authorization, arithmetic, routing judgment, summarization, state transitions, classification, and side effects on the right side of the architecture.",
        "Choose the Lever — Prompt/RAG/tool/tune/agent decision tree: diagnose the actual gap and select the least complex intervention, including a ‘do nothing yet—build the eval’ option.",
        "Base mental-model animation: Prompt → RAG → Tune → Agent, step by step.",
      ],
    },
    {
      slug: "20-ai-native-design-exercises",
      order: 20,
      studyGuide: llmEngineeringStudyGuides[20],
      title: "AI-native design exercises",
      phase: "Interview mode",
      hours: 6,
      depth: "studio",
      outcome:
        "Practice full AI-native designs across storage, inference, agents, retrieval, memory, evals, routing, voice, and abuse.",
      why: "These exercises combine the entire course. Rotate which dimension you deep-dive so you can handle interviewer steering rather than replay one prepared speech.",
      coverage: [
        "State: ChatGPT conversation storage and persistent memory.",
        "Serving: scalable inference API and model gateway.",
        "Agents: coding, research, tool execution, long-running tasks.",
        "Knowledge: enterprise RAG with permissions.",
        "Quality: evaluation platform.",
        "Realtime: voice assistant.",
        "Security: abuse-resistant public API and tenant isolation.",
      ],
      mentalModel: {
        statement:
          "Every AI design should cover state, intelligence, action, control, and learning.",
        flow: [
          { label: "State", detail: "Durable context" },
          { label: "Model", detail: "Route + serve" },
          { label: "Action", detail: "Tools + sandbox" },
          { label: "Learn", detail: "Evals + feedback" },
        ],
      },
      lessons: llmEngineeringLessons[20],
      seniorSignal:
        "A strong AI design closes with: eval gate, production SLOs, cost attribution, abuse boundary, and safe fallback.",
      pitfalls: [
        "Practicing only your favorite agent prompt",
        "No capacity estimates",
        "No distinction between quality and availability",
        "Stopping once the happy-path diagram is complete",
      ],
      drill: {
        prompt:
          "Complete four mocks: inference API, enterprise RAG, coding agent, and realtime voice. Draw and narrate each.",
        constraints: [
          "4 × 50 min",
          "constraint injection",
          "score 1–4",
          "48h redo",
        ],
        approach:
          "Use the standard time boxes. At minute 20, randomly inject a failure/scale/security constraint. Finish with the top three risks and signals. Redo the lowest-scoring deep dive after 48 hours without reviewing the old diagram first.",
      },
      quiz: [
        {
          question:
            "Which closing topic is easy to miss but highly differentiating?",
          options: [
            "Logo design",
            "Evals, cost attribution, and safe fallback",
            "Favorite programming language",
            "Office location",
          ],
          answer: 1,
          explanation:
            "These show ownership of production AI outcomes beyond the happy path.",
        },
        {
          question: "Why inject constraints mid-mock?",
          options: [
            "To waste time",
            "To practice adapting while preserving invariants",
            "To avoid design",
            "To memorize more products",
          ],
          answer: 1,
          explanation:
            "Real interviews test response to changed assumptions.",
        },
      ],
      labs: [
        "AI Design Arena — randomized capstone generator: draw one of 13 design prompts plus a scale, failure, security, and regulation constraint; preserve the generated scenario for later comparison.",
        "Constraint Injector — timed mock control: at minute 20, reveal region loss, a giant tenant, doubled context, provider rate limit, a side-effecting tool, or retention change.",
        "Base mental-model animation: State → Model → Action → Learn, step by step.",
      ],
    },
    {
      slug: "21-interview-level-llm-fluency",
      order: 21,
      studyGuide: llmEngineeringStudyGuides[21],
      title: "Interview-level LLM fluency",
      phase: "Interview mode",
      hours: 4,
      depth: "capstone",
      outcome:
        "Explain, critique, and design AI systems precisely at software-engineer depth.",
      why: "Your goal is not to impersonate an ML researcher. It is to show a grounded mental model, serving intuition, product judgment, and honest boundaries—then connect them to reliable software design.",
      coverage: [
        "Explain: LLMs, attention, inference bottlenecks.",
        "Quantify: latency stages, token cost, context and throughput.",
        "Compare: RAG, prompting, tuning, agents.",
        "Diagnose: model vs retrieval vs orchestration vs tool failure.",
        "Secure: permissions, sandboxing, approval.",
        "Critique: find missing evals, state, fallbacks, and controls.",
        "Boundary: know when training-side detail is outside SWE scope.",
      ],
      mentalModel: {
        statement:
          "Clear explanation + system diagnosis + bounded design = interview fluency.",
        flow: [
          { label: "Explain", detail: "First principles" },
          { label: "Diagnose", detail: "Layer + evidence" },
          { label: "Design", detail: "Tradeoffs + controls" },
          { label: "Bound", detail: "Honest unknowns" },
        ],
      },
      lessons: llmEngineeringLessons[21],
      seniorSignal:
        "Existing software-engineering experience is an asset: translate service ownership, client/server contracts, release mechanisms, and production operations into examples of boundaries, rollouts, observability, and deterministic control around model behavior.",
      pitfalls: [
        "Buzzword chains without causal explanation",
        "Bluffing training details",
        "Describing agents without state, tools, or stop conditions",
        "Treating a model failure as the only possible cause",
      ],
      drill: {
        prompt:
          "Record a 12-minute oral exam: LLM in 2 min, attention in 2, inference in 2, RAG tradeoffs in 2, safe agent in 2, unknown-depth recovery in 2.",
        constraints: [
          "12 min",
          "no notes",
          "concrete examples",
          "one honest boundary",
        ],
        approach:
          "Use the mental-model diagrams from chapters 1, 2, 4, 8, and 13. For each, define mechanism, consequence, and failure. End with an unknown training-detail question and practice pivoting to how you would measure or design around it.",
      },
      quiz: [
        {
          question: "Best response to unknown training detail?",
          options: [
            "Invent it",
            "State the boundary and reason concretely from serving/product constraints",
            "End the interview",
            "Change subjects completely",
          ],
          answer: 1,
          explanation:
            "Honesty plus adjacent depth demonstrates judgment and trustworthiness.",
        },
        {
          question: "A bad RAG answer should first be localized across…",
          options: [
            "Retrieval, context assembly, generation, and citation",
            "The aggregate model benchmark score alone",
            "Only the generation prompt and temperature",
            "Only provider rate limits and retry configuration",
          ],
          answer: 0,
          explanation:
            "Different pipeline stages create different failure modes and fixes. A model score or a single configuration change cannot establish whether relevant evidence was retrieved, retained in context, and used to support the answer.",
        },
      ],
      labs: [
        "Fluency Circuit — timed oral-exam surface: run six two-minute explanations—LLM, attention, inference, RAG, safe agents, and an unknown-detail recovery—with prompts, timer, and self-rubric.",
        "Failure Localizer — architecture diagnosis game: given a bad AI output and trace evidence, identify whether the cause is model, prompt, retrieval, context, tool, orchestration, policy, or UX.",
        "Base mental-model animation: Explain → Diagnose → Design → Bound, step by step.",
      ],
    },
  ],
};
