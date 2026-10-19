import { systemDesignLessons } from "./lessons/system-design";
import type { Course } from "./types";
import { systemDesignStudyGuides } from "./study-guides/system-design";

export const systemDesign: Course = {
  slug: "system-design",
  id: "01",
  title: "System design for software engineers",
  description:
    "Build senior-level design judgment, then pressure-test it on AI-native infrastructure.",
  scope: "15 chapters · ~56 hours of practice",
  practiceProject: {
    title: "Relay · build and evolve a private file service",
    brief: "Keep one design document for Relay, a tenant-aware file service. Start with 100k daily users, ten downloads per user/day, 10k uploads/day, 1 MB typical bodies, 30-day retention, and a 5× download peak. Files are private to workspaces. Treat these as fictional planning assumptions. Later chapters add previews, recovery, regional constraints, compute, and an assistant. Record each change rather than replacing the earlier version; the final review combines the whole packet. These activities share the chapter's existing practice budget.",
  },
  phaseOrder: [
    "Foundations",
    "Distributed core",
    "Production",
    "Global scale",
    "AI systems",
    "Interview mode",
  ],
  chapters: [
    {
      slug: "01-system-design-foundations",
      order: 1,
      studyGuide: systemDesignStudyGuides[1],
      title: "System design foundations",
      phase: "Foundations",
      hours: 3,
      depth: "core",
      outcome:
        "Turn an ambiguous prompt into a scoped, quantified design conversation.",
      why: "The first ten minutes often reveal more seniority than the diagram. Strong candidates turn ambiguity into explicit decisions, use estimates to find the real bottleneck, and keep the design proportional to the problem.",
      coverage: [
        "Requirements: separate must-have user behavior from constraints and future wishes.",
        "Quality attributes: latency, throughput, availability, durability, consistency, cost, and security become design inputs.",
        "Estimation: convert users and behavior into peak RPS, bytes, bandwidth, memory, and growth.",
        "Decomposition: map clients, APIs, services, stores, queues, caches, and workers to responsibilities.",
      ],
      mentalModel: {
        statement: "Move from fuzzy prompt to a defended first design.",
        flow: [
          { label: "Clarify", detail: "Users + workflows" },
          { label: "Quantify", detail: "Scale + SLOs" },
          { label: "Decompose", detail: "Boundaries + data" },
          { label: "Stress", detail: "Bottlenecks + failure" },
        ],
      },
      lessons: systemDesignLessons[1],
      seniorSignal:
        "Say: “I’m estimating because this determines whether a single relational primary is plausible.” Tie every number and component to a decision.",
      pitfalls: [
        "Listing components before agreeing on the product contract",
        "Inventing massive scale without estimating it",
        "Optimizing secondary paths before the critical one",
        "Treating every quality attribute as equally important",
      ],
      drill: {
        prompt:
          "Design a paste-sharing service used by 20M monthly users. In 35 minutes, scope v1 and decide whether one relational database is enough.",
        constraints: ["35 min", "20M MAU", "1% creators", "1-year default retention"],
        approach:
          "Clarify privacy and paste size. Estimate peak creates and reads. Define create/read APIs and paste metadata. Put bodies in object storage if size variance is large; keep metadata and ownership relational. Add a CDN/cache only after quantifying the read ratio. Close with hot-link abuse, expiry, and failure behavior.",
      },
      quiz: [
        {
          question: "Which estimate most directly tests whether sharding is needed?",
          options: [
            "Monthly active users",
            "Peak writes per second and dataset growth",
            "Number of API endpoints",
            "Team size",
          ],
          answer: 1,
          explanation:
            "Sharding is driven by write throughput, dataset size, hot-key shape, and operational limits—not user count alone.",
        },
        {
          question: "What belongs in the first five minutes?",
          options: [
            "Pick Kafka",
            "Define users, core flows, scale, and critical SLOs",
            "Design every table",
            "Explain CAP theorem",
          ],
          answer: 1,
          explanation:
            "Early alignment prevents a polished answer to the wrong problem.",
        },
      ],
      labs: [
        "Scale Dial — interactive calculator: sliders for users, actions, peak factor, payload size, retention, and replicas update RPS, bandwidth, and annual storage; predict the architecture-changing threshold before revealing it.",
        "Architecture Skeleton — constrained canvas: place only client, edge, service, cache, database, queue, object store, and worker; every added box must be tagged with the requirement it satisfies.",
        "Base mental-model animation: Clarify → Quantify → Decompose → Stress, step by step.",
      ],
    },
    {
      slug: "02-networking-apis-and-boundaries",
      order: 2,
      studyGuide: systemDesignStudyGuides[2],
      title: "Networking, APIs & boundaries",
      phase: "Foundations",
      hours: 3,
      depth: "core",
      outcome:
        "Choose protocols, boundaries, and traffic controls from interaction shape—not habit.",
      why: "At scale, latency budgets disappear across hops, retries multiply load, and weak boundaries spread failure. Interviewers want practical protocol intuition and disciplined ownership.",
      coverage: [
        "HTTP in practice: HTTP/1.1, HTTP/2 multiplexing, HTTP/3, keep-alive, timeouts, retries, and idempotency.",
        "API styles: REST resources, RPC/gRPC contracts, SSE streams, WebSockets, and pagination.",
        "Service boundaries: monolith vs microservices, domain ownership, cohesion, coupling, sync vs async.",
        "Traffic control: L4/L7 load balancing, health checks, regional routing, token/leaky buckets, tenant quotas.",
      ],
      mentalModel: {
        statement:
          "A request is a latency and failure budget moving across ownership boundaries.",
        flow: [
          { label: "Client", detail: "Intent + retry" },
          { label: "Edge", detail: "Route + limit" },
          { label: "Service", detail: "Validate + own" },
          { label: "Dependency", detail: "Store or compute" },
        ],
      },
      lessons: systemDesignLessons[2],
      seniorSignal:
        "Discuss deadline propagation and retry ownership. “Three layers each retrying three times can turn one request into 27 downstream attempts.”",
      pitfalls: [
        "Using WebSockets for one-way token streaming when SSE suffices",
        "Retrying writes without an idempotency contract",
        "Confusing HTTP/2 multiplexing with unlimited concurrency",
        "Drawing service boundaries around technical layers instead of domains",
      ],
      drill: {
        prompt:
          "Design the public API edge for a streaming AI chat product with per-workspace quotas and regional routing.",
        constraints: ["SSE output", "10k concurrent streams", "tenant quotas", "60s max"],
        approach:
          "Authenticate at the edge, attach tenant identity, reserve quota before expensive work, route to a healthy region, and stream typed events. Propagate cancellation and deadlines. Make create-message idempotent, separate connection limits from token budgets, and define what a partial stream means for billing and retry.",
      },
      quiz: [
        {
          question: "Best default for one-way incremental text to a browser?",
          options: ["SSE", "WebSockets", "Repeated short polling", "A direct gRPC stream without browser-compatible transport"],
          answer: 0,
          explanation:
            "SSE fits one-way server events over HTTP. WebSockets add bidirectional session machinery; repeated polling adds request overhead, and browser gRPC needs a compatible transport or gateway. Application replay and deduplication still need an explicit contract.",
        },
        {
          question: "Where should write deduplication happen?",
          options: [
            "Only in the browser",
            "At the side-effect boundary",
            "Only in a temporary edge cache",
            "Only by sending the same payload again",
          ],
          answer: 1,
          explanation:
            "The component committing the effect must enforce the idempotency contract. Client state and temporary edge caches can disappear or be bypassed, while equal payloads can also represent legitimate separate operations.",
        },
      ],
      labs: [
        "Protocol Chooser — interactive decision tree: change directionality, latency, connection lifetime, client type, and payload shape; compare REST, gRPC, SSE, WebSockets, and polling with a short rationale.",
        "Retry Explosion — animated request tree: toggle retries at three layers and watch one request multiply into 3, 9, or 27 downstream attempts.",
        "Base mental-model animation: Client → Edge → Service → Dependency, step by step.",
      ],
    },
    {
      slug: "03-data-modeling-and-storage",
      order: 3,
      studyGuide: systemDesignStudyGuides[3],
      title: "Data modeling & storage",
      phase: "Foundations",
      hours: 4,
      depth: "core",
      outcome:
        "Derive schemas, datastore choices, partitioning, and consistency from access patterns.",
      why: "The strongest storage answer is rarely a database brand. It is a chain from invariants and access patterns to model, index, partition key, replication, and failure semantics.",
      coverage: [
        "Relational core: schemas, indexes, transactions, isolation, joins, replication.",
        "NoSQL shapes: key-value, document, wide-column, and graph tradeoffs.",
        "Distribution: hash/range partitioning, hot partitions, resharding, leader/follower, multi-leader, leaderless.",
        "Correctness: strong/eventual/session guarantees, 2PC, sagas, transactional outbox.",
        "Specialized stores: search, time-series, vector, and object storage as secondary access paths.",
      ],
      mentalModel: {
        statement:
          "Start with invariants and queries; the datastore is the consequence.",
        flow: [
          { label: "Invariants", detail: "What must be true?" },
          { label: "Access", detail: "Reads + writes" },
          { label: "Layout", detail: "Schema + index" },
          { label: "Distribution", detail: "Partition + replicate" },
        ],
      },
      lessons: systemDesignLessons[3],
      seniorSignal:
        "Name the invariant you are protecting: “Username uniqueness needs serialized ownership; feed fan-out can be eventually consistent.”",
      pitfalls: [
        "Selecting NoSQL solely because the prompt says ‘large scale’",
        "Ignoring the hottest tenant or celebrity key",
        "Assuming replicas are immediately current",
        "Using dual writes to a DB and queue without an outbox or reconciliation path",
      ],
      drill: {
        prompt:
          "Design conversation storage for a multi-tenant AI assistant: ordered messages, attachments, edits, search, and deletion.",
        constraints: ["500M conversations", "read-your-writes", "large blobs", "tenant deletion"],
        approach:
          "Use relational metadata and ordered message records keyed by conversation, object storage for blobs, and asynchronous search indexing. Partition by tenant/conversation with a strategy for large tenants. Preserve read-your-writes on the primary or session token. Tombstone deletion, cascade asynchronously, and keep an auditable deletion job.",
      },
      quiz: [
        {
          question: "Best partition key characteristic?",
          options: [
            "Human-readable",
            "Even load plus locality for dominant queries",
            "Always timestamp",
            "Random regardless of access",
          ],
          answer: 1,
          explanation:
            "Distribution and query locality must both be considered; either alone can make the system expensive.",
        },
        {
          question: "What repairs DB + event dual-write risk?",
          options: ["Longer timeout", "Transactional outbox", "More replicas", "A CDN"],
          answer: 1,
          explanation:
            "The outbox commits domain state and an event record atomically, then publishes asynchronously.",
        },
      ],
      labs: [
        "Shard Heatmap — live partition visualization: switch between hash, range, tenant, and tenant-plus-time keys while a celebrity or large tenant appears; animate hot partitions and a resharding event.",
        "Consistency Timeline — replica simulator: place a write and read from leader/followers under lag; toggle strong, eventual, and read-your-writes semantics and show the product-visible result.",
        "Base mental-model animation: Invariants → Access → Layout → Distribution, step by step.",
      ],
    },
    {
      slug: "04-caching-and-performance",
      order: 4,
      studyGuide: systemDesignStudyGuides[4],
      title: "Caching & performance",
      phase: "Foundations",
      hours: 3,
      depth: "core",
      outcome:
        "Use caches deliberately, calculate their value, and contain stale-data and stampede failure modes.",
      why: "Caches make fast systems possible and correctness subtle. Senior answers discuss hit rate, ownership, invalidation, and what happens when the cache vanishes.",
      coverage: [
        "Cache layers: client, browser, CDN, service, query, and distributed caches.",
        "Patterns: cache-aside, read-through, write-through, and write-behind.",
        "Freshness: TTL, versioned keys, event invalidation, stale-while-revalidate.",
        "Failure: stampedes, hot keys, penetration, eviction, and stale data.",
        "Other levers: batching, pagination, compression, precomputation, materialized views, pools.",
      ],
      mentalModel: {
        statement:
          "Caching trades repeated work for a freshness and invalidation contract.",
        flow: [
          { label: "Request", detail: "Choose key" },
          { label: "Cache", detail: "Hit or miss" },
          { label: "Source", detail: "Compute/read" },
          { label: "Fill", detail: "TTL + version" },
        ],
      },
      lessons: systemDesignLessons[4],
      seniorSignal:
        "When adding cache, give the failure plan: “If Redis is unavailable, cap source concurrency and degrade; never let every miss stampede the primary.”",
      pitfalls: [
        "Caching personalized data without tenant/user identity in the key",
        "Letting all clients retry on cache failure",
        "Using TTLs that expire together",
        "Treating cache as durable source of truth",
      ],
      drill: {
        prompt:
          "Reduce p99 latency for a model-catalog API from 900ms to 120ms while updates may take 30 seconds to propagate.",
        constraints: ["p99 120ms", "30s staleness", "50:1 reads:writes", "regional"],
        approach:
          "Profile first. Put a versioned object at the CDN or regional cache with a 30-second TTL and stale-while-revalidate. Publish invalidations on update as an acceleration, not the only correctness mechanism. Coalesce misses and cap fallthrough to the source.",
      },
      quiz: [
        {
          question: "Best first stampede defense?",
          options: [
            "Shorter TTL",
            "Request coalescing plus TTL jitter",
            "More client retries",
            "Disable expiry",
          ],
          answer: 1,
          explanation:
            "Coalescing limits concurrent recomputation; jitter spreads expirations over time.",
        },
        {
          question: "A 90% hit rate reduces backing reads by roughly…",
          options: ["2×", "5×", "10×", "100×"],
          answer: 2,
          explanation:
            "Only 10% of requests fall through, so backing request volume is about one tenth.",
        },
      ],
      labs: [
        "Cache Stampede — animated traffic simulation: synchronize thousands of expirations, then enable TTL jitter, request coalescing, stale-while-revalidate, and concurrency caps one at a time.",
        "Hit-Rate Curve — interactive chart: map hit rate to backing-store load and make the nonlinear value of 90% → 99% visually obvious.",
        "Base mental-model animation: Request → Cache → Source → Fill, step by step.",
      ],
    },
    {
      slug: "05-queues-streams-and-async",
      order: 5,
      studyGuide: systemDesignStudyGuides[5],
      title: "Queues, streams & async systems",
      phase: "Distributed core",
      hours: 4,
      depth: "core",
      outcome:
        "Design durable asynchronous flows with explicit ordering, duplicate, retry, and backpressure behavior.",
      why: "Queues remove work from latency-critical paths, but they move complexity into time: lag, redelivery, poison messages, ordering, and reconciliation.",
      coverage: [
        "Queue vs log: destructive work distribution vs retained replayable history.",
        "Kafka model: topics, partitions, consumer groups, offsets, ordering, retention.",
        "Delivery: at-most-once, at-least-once, effectively-once, dedup keys.",
        "Pressure: lag, bounded queues, load shedding, admission control.",
        "Event systems: events vs commands, CQRS, event sourcing.",
        "Jobs: delay, schedule, retry, dead-letter, priority, cancellation.",
      ],
      mentalModel: {
        statement:
          "A reliable async flow separates acceptance, durable intent, execution, and outcome.",
        flow: [
          { label: "Accept", detail: "Persist intent" },
          { label: "Enqueue", detail: "Partition + order" },
          { label: "Consume", detail: "Idempotent work" },
          { label: "Record", detail: "Outcome + retry" },
        ],
      },
      lessons: systemDesignLessons[5],
      seniorSignal:
        "State the ordering unit and duplicate boundary. Those two sentences distinguish an operational design from boxes-and-arrows.",
      pitfalls: [
        "Saying Kafka provides global ordering",
        "Calling an event ‘exactly once’ without naming the external effect boundary",
        "Adding a DLQ without alerting or replay ownership",
        "Allowing infinite queue growth to protect availability metrics",
      ],
      drill: {
        prompt:
          "Design a notification platform for email, push, and in-app messages with priorities and user preferences.",
        constraints: ["1B/day", "at-least-once", "quiet hours", "provider outages"],
        approach:
          "Commit a notification intent, expand channels asynchronously, check preferences near send time, and enqueue per provider/priority. Use idempotency keys per notification-channel, provider circuit breakers, retry schedules, DLQs, and delivery receipts. Shed promotional work before transactional alerts.",
      },
      quiz: [
        {
          question: "Kafka guarantees order across…",
          options: [
            "All topics",
            "A partition",
            "A consumer group globally",
            "All regions",
          ],
          answer: 1,
          explanation: "Ordering is defined within a partition.",
        },
        {
          question: "Best lag signal for user impact?",
          options: [
            "Broker disk size",
            "Oldest message age",
            "Number of topic names",
            "Producer CPU alone",
          ],
          answer: 1,
          explanation:
            "Age directly represents how late work is becoming.",
        },
      ],
      labs: [
        "Queue vs Log — side-by-side animation: destructive work ownership in a queue versus retained partition history with independent consumer groups in a log.",
        "Lag and Backpressure — timeline simulator: increase arrival rate above service rate and watch message age grow; apply admission control, shedding, priority lanes, and more workers.",
        "Base mental-model animation: Accept → Enqueue → Consume → Record, step by step.",
      ],
    },
    {
      slug: "06-distributed-systems-fundamentals",
      order: 6,
      studyGuide: systemDesignStudyGuides[6],
      title: "Distributed systems fundamentals",
      phase: "Distributed core",
      hours: 4,
      depth: "deep",
      outcome:
        "Reason precisely about partial failure, partitions, coordination, and retry-safe correctness.",
      why: "Distributed systems are not single-machine systems with more boxes. Messages delay, clocks disagree, nodes fail independently, and observers can hold different but valid views.",
      coverage: [
        "Failure model: partial failure, partitions, omission, crash, Byzantine boundaries.",
        "CAP precisely: during a partition, choose availability or linearizable consistency for an operation.",
        "Consensus: Raft/Paxos intuition, replicated log, quorum, leader election.",
        "Coordination: locks, leases, fencing tokens, membership, discovery.",
        "Time: clock skew, monotonic clocks, logical time.",
        "Avoidance: idempotency, commutativity, CRDT intuition, partitioned ownership.",
      ],
      mentalModel: {
        statement:
          "Coordination buys a single decision but costs latency and availability under failure.",
        flow: [
          { label: "Propose", detail: "Candidate value" },
          { label: "Quorum", detail: "Majority agrees" },
          { label: "Commit", detail: "Ordered log" },
          { label: "Apply", detail: "State converges" },
        ],
      },
      lessons: systemDesignLessons[6],
      seniorSignal:
        "Use uncertainty language: “After timeout the outcome is unknown, so the client retries with the same operation ID and reads status.”",
      pitfalls: [
        "Explaining CAP as ‘pick any two’ during normal operation",
        "Using a distributed lock without fencing stale holders",
        "Trusting wall clocks for ordering",
        "Claiming exactly-once across arbitrary external side effects",
      ],
      drill: {
        prompt:
          "Design exclusive ownership for shard workers when processes can pause for 90 seconds and clocks can skew.",
        constraints: ["worker pauses", "clock skew", "no double writes", "fast reassignment"],
        approach:
          "Store leases in a consensus-backed coordinator, but attach a monotonically increasing fencing token to every ownership grant. The downstream storage rejects writes with older tokens. Renew well before expiry and design idempotent reassignment. The fencing check—not the lock alone—prevents a paused former owner from writing.",
      },
      quiz: [
        {
          question: "Why does a lease need a fencing token?",
          options: [
            "To reduce storage",
            "To reject work from a stale holder after pause/partition",
            "To compress logs",
            "To choose HTTP/3",
          ],
          answer: 1,
          explanation:
            "A former owner can resume after its lease expired; downstream token comparison makes it harmless.",
        },
        {
          question: "Consensus primarily gives replicas…",
          options: [
            "Infinite throughput",
            "Agreement on an ordered history",
            "Zero latency",
            "Perfect clocks",
          ],
          answer: 1,
          explanation:
            "Consensus lets non-faulty members agree on committed log entries despite failures.",
        },
      ],
      labs: [
        "Network Partition Lab — cluster simulation: split a five-node cluster, attempt reads/writes from both sides, and compare availability and linearizability choices.",
        "Lease + Fencing — event timeline: pause a worker past lease expiry, grant a new owner, then resume the old worker and show fencing tokens rejecting stale writes.",
        "Base mental-model animation: Propose → Quorum → Commit → Apply, step by step.",
      ],
    },
    {
      slug: "07-reliability-and-resilience",
      order: 7,
      studyGuide: systemDesignStudyGuides[7],
      title: "Reliability & resilience",
      phase: "Production",
      hours: 3,
      depth: "core",
      outcome:
        "Translate availability goals into redundancy, recovery, isolation, and graceful degradation.",
      why: "Reliability is a budget and a design property, not a last-minute replica. Strong candidates connect user-visible SLOs to dependency math and concrete failure modes.",
      coverage: [
        "Targets: SLIs, SLOs, 99.9/99.99/99.999, error budgets.",
        "Redundancy: multi-AZ, multi-region, correlated failure.",
        "Failover: active-passive, active-active, detection and recovery.",
        "Patterns: timeouts, backoff, jitter, circuit breakers, bulkheads.",
        "Recovery: RPO, RTO, backups, restore tests.",
        "Degradation: load shedding, dependency isolation, feature tiers.",
      ],
      mentalModel: {
        statement:
          "Prevent, detect, contain, recover—each layer answers a different failure question.",
        flow: [
          { label: "Prevent", detail: "Capacity + redundancy" },
          { label: "Detect", detail: "SLIs + alerts" },
          { label: "Contain", detail: "Bulkheads + shed" },
          { label: "Recover", detail: "Failover + restore" },
        ],
      },
      lessons: systemDesignLessons[7],
      seniorSignal:
        "Quantify the error budget and show the degradation ladder: full answer → smaller model → cached answer → queued job → explicit failure.",
      pitfalls: [
        "Setting 99.999% without cost justification",
        "Adding retries without deadline/concurrency limits",
        "Calling backups reliable without restore tests",
        "Failing the whole request because an optional dependency is slow",
      ],
      drill: {
        prompt:
          "Make an AI chat service survive loss of its primary model provider and one availability zone.",
        constraints: ["99.95% chat submit", "streaming", "provider outage", "AZ loss"],
        approach:
          "Keep edge and orchestration multi-AZ, isolate provider pools, and enforce per-provider circuit breakers. Route to a tested fallback model with disclosed capability change; preserve conversation writes before inference. If no provider is healthy, queue only when UX supports it. Track SLOs separately for submit, TTFT, and completion.",
      },
      quiz: [
        {
          question: "A 99.99% monthly SLO allows roughly…",
          options: ["44 minutes", "4.4 minutes", "4.4 hours", "44 seconds"],
          answer: 1,
          explanation:
            "0.01% of roughly 43,800 minutes is about 4.38 minutes.",
        },
        {
          question: "RPO answers…",
          options: [
            "How fast service returns",
            "How much data loss is acceptable",
            "How many replicas exist",
            "Which API style to use",
          ],
          answer: 1,
          explanation:
            "Recovery Point Objective bounds acceptable data loss; RTO bounds recovery time.",
        },
      ],
      labs: [
        "Nines Budget — availability calculator: convert 99.9 through 99.999 into monthly error budgets and multiply serial dependency availability.",
        "Degradation Ladder — failure-path animation: fail the primary AI provider, then step through fallback model, cached response, queued work, and explicit failure.",
        "Base mental-model animation: Prevent → Detect → Contain → Recover, step by step.",
      ],
    },
    {
      slug: "08-observability-and-operations",
      order: 8,
      studyGuide: systemDesignStudyGuides[8],
      title: "Observability & operations",
      phase: "Production",
      hours: 3,
      depth: "core",
      outcome:
        "Design a system that can be understood, debugged, rolled out, and operated under pressure.",
      why: "A design is incomplete if no one can tell whether it works. Observability should reconstruct a user request, expose saturation, and guide action—not produce maximum telemetry.",
      coverage: [
        "Metrics: RED, USE, SLIs, SLOs, percentiles, cardinality.",
        "Logs: structured events, correlation IDs, privacy and retention.",
        "Tracing: causal paths, sampling, spans across queues.",
        "Alerting: symptoms over causes, burn rate, actionable pages.",
        "Operations: capacity, incidents, postmortems, distributed debugging.",
        "Delivery: canary, blue-green, feature flags, progressive rollout.",
      ],
      mentalModel: {
        statement:
          "Telemetry becomes useful when it connects user symptom to saturated resource or failing change.",
        flow: [
          { label: "Observe", detail: "Metric + trace" },
          { label: "Localize", detail: "Service + tenant" },
          { label: "Mitigate", detail: "Flag + shed" },
          { label: "Learn", detail: "Postmortem + fix" },
        ],
      },
      lessons: systemDesignLessons[8],
      seniorSignal:
        "For AI systems, correlate request ID, model/prompt version, retrieved documents, tool calls, token usage, latency stages, safety result, and user outcome—with privacy controls.",
      pitfalls: [
        "Alerting on every CPU spike instead of user impact",
        "Averages that hide tail latency",
        "Unbounded tenant IDs as metric labels",
        "Canarying without predefined stop conditions",
      ],
      drill: {
        prompt:
          "Create the observability plan for a coding agent that runs up to 45 minutes and may call 200 tools.",
        constraints: ["long-running", "privacy", "200 calls", "multiple retries"],
        approach:
          "Give each run a trace with spans for planning, model calls, tools, tests, and checkpoints. Track success, wall time, queue time, tokens, tool errors, loop signals, and human interventions. Sample detailed artifacts behind access controls; keep aggregate metrics broad. Alert on stuck-run age and fleet-level success/burn, not one flaky tool call.",
      },
      quiz: [
        {
          question: "Which is a symptom alert?",
          options: [
            "CPU is 82%",
            "Checkout success SLO is burning rapidly",
            "One pod restarted",
            "Log volume rose",
          ],
          answer: 1,
          explanation:
            "It directly measures user-visible success and urgency.",
        },
        {
          question: "Why avoid tenant_id as an unbounded metric label?",
          options: [
            "It changes correctness",
            "It creates cardinality and cost explosion",
            "It disables tracing",
            "It prevents retries",
          ],
          answer: 1,
          explanation:
            "Every unique label combination creates a time series, which can overwhelm metric systems.",
        },
      ],
      labs: [
        "Trace Waterfall — interactive trace viewer: explore a slow request across edge, services, queue, model, and tools; correlate RED symptoms with USE saturation.",
        "Canary Rollout — traffic animation: move 1%, 5%, 25%, and 100% of traffic while error-budget burn changes; predefined health gates pause or roll back.",
        "Base mental-model animation: Observe → Localize → Mitigate → Learn, step by step.",
      ],
    },
    {
      slug: "09-security-and-abuse-resistance",
      order: 9,
      studyGuide: systemDesignStudyGuides[9],
      title: "Security & abuse resistance",
      phase: "Production",
      hours: 3,
      depth: "core",
      outcome:
        "Threat-model identity, tenancy, data, and abuse as first-class architecture.",
      why: "Security answers are strongest when attached to trust boundaries and valuable assets. Public AI systems also face economic abuse: attackers can turn stolen credentials or automation into real compute cost.",
      coverage: [
        "Identity: sessions, JWTs, OAuth, token rotation.",
        "Authorization: RBAC, ABAC, resource ownership, policy enforcement.",
        "Protection: TLS, encryption at rest, secrets and key management.",
        "Tenancy: logical/physical isolation, noisy neighbors, scoped credentials.",
        "Abuse: validation, rate limits, bot/fraud signals, cost ceilings.",
        "Governance: audit logs, privacy, retention, deletion.",
      ],
      mentalModel: {
        statement:
          "Authenticate the actor, authorize the action, constrain the effect, record the decision.",
        flow: [
          { label: "Authenticate", detail: "Who are you?" },
          { label: "Authorize", detail: "May you do this?" },
          { label: "Constrain", detail: "Least privilege" },
          { label: "Audit", detail: "What happened?" },
        ],
      },
      lessons: systemDesignLessons[9],
      seniorSignal:
        "Walk one threat end-to-end: stolen API key → distributed requests → expensive inference. Show detection, budget reservation, cutoff, audit, and credential rotation.",
      pitfalls: [
        "Treating a valid JWT as permission for any object",
        "Forgetting tenant identity in cache or vector-search filters",
        "Logging prompts, secrets, or tool outputs indiscriminately",
        "One global rate limit that lets a noisy tenant starve others",
      ],
      drill: {
        prompt:
          "Secure a multi-tenant coding-agent service that can execute shell commands against customer repositories.",
        constraints: ["untrusted repos", "network access", "secrets", "human approval"],
        approach:
          "Use per-run ephemeral sandboxes and scoped repo credentials; default-deny network and filesystem reach. Separate model suggestions from privileged execution, require approval for high-impact operations, scrub secrets from context/logs, sign tool policies, bound time/CPU/spend, and keep an immutable audit trail.",
      },
      quiz: [
        {
          question: "Where must tenant identity appear?",
          options: [
            "Only at login",
            "Across every data and execution boundary",
            "Only in the UI",
            "Only in logs",
          ],
          answer: 1,
          explanation:
            "Losing tenant context in a cache, query, event, or tool can create cross-tenant access.",
        },
        {
          question: "Best place for spend control?",
          options: [
            "After inference completes",
            "Before scarce work, with reservation/reconciliation",
            "In client JavaScript only",
            "In documentation",
          ],
          answer: 1,
          explanation:
            "Admission-time reservation prevents overspend; later reconciliation charges actual usage.",
        },
      ],
      labs: [
        "Trust Boundary Map — threat-model canvas: place identity, tenant, cache, queue, model, sandbox, secrets broker, and external tools; highlight every boundary where authorization must be re-established.",
        "Economic Abuse Path — attack-path animation: follow a stolen key through distributed traffic into expensive inference; enable layered quotas, anomaly signals, reservations, spend caps, and credential rotation.",
        "Base mental-model animation: Authenticate → Authorize → Constrain → Audit, step by step.",
      ],
    },
    {
      slug: "10-multi-region-and-global-systems",
      order: 10,
      studyGuide: systemDesignStudyGuides[10],
      title: "Multi-region & global systems",
      phase: "Global scale",
      hours: 3,
      depth: "deep",
      outcome:
        "Balance latency, availability, residency, and conflict across regions.",
      why: "Multi-region is not ‘add another map pin.’ It introduces replication lag, split-brain risk, evacuation procedures, and product-visible conflict semantics.",
      coverage: [
        "Routing: geo/latency routing, health, session affinity.",
        "Placement: home region, data residency, sovereignty.",
        "Replication: global databases, lag, read locality.",
        "Writes: single-writer, multi-leader, active-active.",
        "Conflict: last-write-wins, version vectors, domain merge.",
        "Evacuation: failover, dependency mapping, capacity, disaster exercises.",
      ],
      mentalModel: {
        statement:
          "Route users near compute while giving each mutable datum a clear write authority.",
        flow: [
          { label: "Edge", detail: "Nearest healthy" },
          { label: "Home", detail: "Write authority" },
          { label: "Replicate", detail: "Async copies" },
          { label: "Evacuate", detail: "Capacity + replay" },
        ],
      },
      lessons: systemDesignLessons[10],
      seniorSignal:
        "Frame global design as a product choice: “Conversation reads may tolerate seconds of lag; billing ledger ownership remains single-writer.”",
      pitfalls: [
        "Active-active without domain-specific conflict resolution",
        "Failover into a region with no spare capacity",
        "Ignoring data residency in backups and logs",
        "Assuming DNS change equals recovery",
      ],
      drill: {
        prompt:
          "Design global conversation storage for users who travel, with EU residency and a 10-minute regional RTO.",
        constraints: ["EU residency", "mobile users", "10m RTO", "ordered messages"],
        approach:
          "Assign each workspace a compliant home region; route writes there and serve local replicas where policy permits. Use sequence IDs from the home writer and session tokens for read-your-writes. Pre-provision paired failover regions inside residency boundaries, fence the old writer, promote, and replay buffered writes before failback.",
      },
      quiz: [
        {
          question: "Which data is easiest for active-active writes?",
          options: [
            "A unique username registry",
            "An append-only reaction set with merge rules",
            "A bank ledger balance",
            "A singleton lease",
          ],
          answer: 1,
          explanation:
            "Commutative/set-like data has natural convergence; uniqueness and balances require stronger coordination.",
        },
        {
          question: "What often dominates region failover?",
          options: [
            "Button color",
            "Destination capacity and write authority",
            "HTTP method names",
            "Index naming",
          ],
          answer: 1,
          explanation:
            "Routing is easy compared with sufficient capacity, current data, and preventing dual writers.",
        },
      ],
      labs: [
        "Region Failure — global topology simulator: toggle home-region, read replicas, active-passive, and active-active; kill a region and expose replication lag, capacity, fencing, backlog, and failback concerns.",
        "Conflict Workbench — merge interaction: apply concurrent preference, username, reaction-set, and ledger updates; ask which can merge and which requires coordinated ownership.",
        "Base mental-model animation: Edge → Home → Replicate → Evacuate, step by step.",
      ],
    },
    {
      slug: "11-high-scale-compute-systems",
      order: 11,
      studyGuide: systemDesignStudyGuides[11],
      title: "High-scale compute systems",
      phase: "AI systems",
      hours: 4,
      depth: "deep",
      outcome:
        "Schedule heterogeneous compute fairly, efficiently, and predictably under scarcity.",
      why: "AI workloads make compute visible as a product constraint. GPUs are expensive, requests vary wildly, and utilization can conflict with latency and tenant fairness.",
      coverage: [
        "Compute shape: stateless/stateful, horizontal scaling, online/batch.",
        "Pools: workers, queues, placement, autoscaling.",
        "Resources: CPU, memory, network, accelerator bottlenecks.",
        "Isolation: containers, quotas, preemption, noisy neighbors.",
        "Scheduling: GPU-aware placement, bin-packing, affinity.",
        "Control: admission, fairness, priorities, cost-aware scheduling.",
      ],
      mentalModel: {
        statement:
          "Admission and scheduling translate product priorities into scarce-resource placement.",
        flow: [
          { label: "Admit", detail: "Budget + class" },
          { label: "Queue", detail: "Priority + fairness" },
          { label: "Place", detail: "Fit + locality" },
          { label: "Run", detail: "Observe + preempt" },
        ],
      },
      lessons: systemDesignLessons[11],
      seniorSignal:
        "Name the scheduling objective and its victim: maximizing GPU utilization can worsen interactive p99; reserve latency headroom deliberately.",
      pitfalls: [
        "Autoscaling as the only overload plan",
        "FIFO across highly variable jobs",
        "Tracking GPU utilization without queue latency",
        "Mixing batch and online workloads with no reservation",
      ],
      drill: {
        prompt:
          "Design a shared GPU job scheduler for interactive inference, nightly embeddings, and fine-tuning.",
        constraints: ["3 workload classes", "GPU scarcity", "tenant fairness", "preemption"],
        approach:
          "Classify jobs by latency, duration, GPU shape, and preemptibility. Use separate queues with weighted fair share and reserved interactive capacity. Bin-pack by accelerator/memory, allow checkpointed batch preemption, expose queue estimates, and use admission/spend limits before accepting jobs.",
      },
      quiz: [
        {
          question: "Why can 100% accelerator utilization be unhealthy?",
          options: [
            "It increases storage",
            "No headroom remains for latency bursts",
            "It disables TLS",
            "It changes consistency",
          ],
          answer: 1,
          explanation:
            "Interactive workloads need headroom; saturated queues drive tail latency sharply upward.",
        },
        {
          question: "Best protection from a tenant submitting giant jobs?",
          options: [
            "Global FIFO",
            "Per-tenant quotas and fair-share scheduling",
            "Longer logs",
            "More DNS records",
          ],
          answer: 1,
          explanation:
            "Admission and fair scheduling isolate demand and preserve access for others.",
        },
      ],
      labs: [
        "GPU Bin Packing — scheduler game: place online inference, embeddings, and fine-tuning jobs onto heterogeneous GPUs; score utilization, fragmentation, fairness, and interactive p99.",
        "Utilization vs Latency — interactive curve: increase fleet utilization toward 100% and show queueing/tail latency explode; add reserved headroom, workload pools, and preemption.",
        "Base mental-model animation: Admit → Queue → Place → Run, step by step.",
      ],
    },
    {
      slug: "12-ai-flavored-system-design",
      order: 12,
      studyGuide: systemDesignStudyGuides[12],
      title: "AI / LLM–flavored system design",
      phase: "AI systems",
      hours: 5,
      depth: "deep",
      outcome:
        "Design an end-to-end AI service across streaming, GPUs, retrieval, tools, safety, cost, and evals.",
      why: "This is where both tracks meet. The model is one dependency inside a system that must schedule scarce work, stream partial outcomes, run untrusted tools, retrieve authorized context, and improve measurably.",
      coverage: [
        "Inference path: streaming, prefill/decode, batching, GPU utilization, limits.",
        "Routing: model selection, fallback, admission, tenant quotas.",
        "Context: prompt budgets, embeddings, vector search, retrieval.",
        "Agents: long tasks, tool execution, sandboxing, checkpoints.",
        "Control: caching, cost budgets, safety/moderation.",
        "Learning: evaluation, telemetry, feedback, regression gates.",
      ],
      mentalModel: {
        statement: "An AI request is a controlled loop, not a single model call.",
        flow: [
          { label: "Ground", detail: "Policy + context" },
          { label: "Generate", detail: "Route + stream" },
          { label: "Act", detail: "Tool sandbox" },
          { label: "Evaluate", detail: "Outcome + trace" },
        ],
      },
      lessons: systemDesignLessons[12],
      seniorSignal:
        "Always draw the non-model control loop: authenticate → reserve budget → retrieve with ACLs → invoke → validate → act with least privilege → evaluate.",
      pitfalls: [
        "Treating the model API as the entire architecture",
        "Retrying model/tool calls without tracking duplicate effects",
        "Ignoring cancellation after streaming begins",
        "Using vector similarity as authorization",
      ],
      drill: {
        prompt:
          "Design a multi-tenant coding-agent backend that can run for an hour, edit repositories, and recover from worker loss.",
        constraints: ["1h tasks", "repo tools", "GPU scarce", "worker loss"],
        approach:
          "Persist a run state machine and append-only action log. Schedule model calls through a quota-aware gateway and execute tools in ephemeral sandboxes with scoped credentials. Checkpoint repository state and compact conversation history. Resume from the last committed checkpoint, deduplicate tool actions, gate risky operations, and evaluate task/test outcomes.",
      },
      quiz: [
        {
          question: "Which metric isolates queue + prefill responsiveness?",
          options: [
            "Total tokens",
            "Time to first token",
            "Daily users",
            "Object count",
          ],
          answer: 1,
          explanation:
            "TTFT captures admission, queueing, routing, and prefill before the first streamed output.",
        },
        {
          question: "Where should retrieval authorization be enforced?",
          options: [
            "After generation",
            "Before and during retrieval with document ACL filters",
            "By asking the model politely",
            "Only in the browser",
          ],
          answer: 1,
          explanation:
            "Similarity is not permission; unauthorized text must never enter model context.",
        },
      ],
      labs: [
        "AI Request Flight Recorder — animated end-to-end pipeline: authenticate, quota reserve, retrieve with ACLs, route, prefill, decode/stream, tools, validation, billing, and eval logging.",
        "Context Budget Allocator — stacked-budget lab: allocate tokens among policy, history, retrieved chunks, tool results, and output headroom; show TTFT, KV memory, cost, and likely retrieval loss.",
        "Base mental-model animation: Ground → Generate → Act → Evaluate, step by step.",
      ],
    },
    {
      slug: "13-common-interview-design-problems",
      order: 13,
      studyGuide: systemDesignStudyGuides[13],
      title: "Common interview design problems",
      phase: "Interview mode",
      hours: 6,
      depth: "studio",
      outcome:
        "Recognize reusable design shapes without forcing memorized solutions.",
      why: "Problems differ, but their hard parts repeat: fan-out, ordering, large blobs, prefix lookup, leases, idempotency, collaboration, and scarce compute. Build a pattern library, not answer scripts.",
      coverage: [
        "Content: URL shortener, file storage, search/autocomplete, feed.",
        "Communication: chat, notifications, collaborative editor.",
        "Infrastructure: metrics/logging, scheduler, cache, gateway, flags.",
        "Transactions: payment-like workflows and ledgers.",
        "AI products: LLM chat, coding agent, inference API, RAG search.",
      ],
      mentalModel: {
        statement:
          "Classify the dominant shape, then reuse mechanisms with new invariants.",
        flow: [
          { label: "Classify", detail: "Fan-out? order?" },
          { label: "Choose", detail: "Pattern + store" },
          { label: "Prove", detail: "Invariant + scale" },
          { label: "Stress", detail: "Failure + abuse" },
        ],
      },
      lessons: systemDesignLessons[13],
      seniorSignal:
        "Begin by saying what family the prompt belongs to and which two hard parts you will prioritize. That establishes a crisp interview agenda.",
      pitfalls: [
        "Memorizing one canonical architecture",
        "Giving every prompt the same cache/queue/CDN stack",
        "Skipping product semantics to discuss scale",
        "Practicing only the high-level diagram",
      ],
      drill: {
        prompt:
          "Shuffle the drill deck and complete three 40-minute designs this week: one content, one infrastructure, and one AI-native system.",
        constraints: ["3 mocks", "40 min each", "record yourself", "score rubric"],
        approach:
          "For each: spend 5 minutes on contract/scale, 8 on high-level design, 7 on data/APIs, 12 on the hardest path, and 8 on failure/security/ops. Review for explicit tradeoffs, not box count. Re-do the weakest deep dive 48 hours later.",
      },
      quiz: [
        {
          question: "Dominant hard part in collaborative editing?",
          options: [
            "Image compression",
            "Concurrent operation merge and convergence",
            "Cold storage",
            "Email deliverability",
          ],
          answer: 1,
          explanation:
            "Multiple writers must see a coherent shared document despite concurrency and disconnects.",
        },
        {
          question: "Dominant hard part in payment-like design?",
          options: [
            "Animated UI",
            "Idempotent ledger-backed state transitions",
            "CDN images",
            "Autocomplete",
          ],
          answer: 1,
          explanation:
            "Financial correctness requires immutable accounting and safe retries.",
        },
      ],
      labs: [
        "Problem Pattern Matrix — interactive matrix: rows are common prompts; columns are dominant hard parts such as ordering, fan-out, large blobs, prefix search, leases, ledgers, retrieval, and scarce compute.",
        "Prompt Roulette — randomized practice tool: draw a design problem, scale card, failure card, and security card; start a 50-minute timer and reveal a rubric only after completion.",
        "Base mental-model animation: Classify → Choose → Prove → Stress, step by step.",
      ],
    },
    {
      slug: "14-deep-dive-tradeoff-drills",
      order: 14,
      studyGuide: systemDesignStudyGuides[14],
      title: "Deep-dive tradeoff drills",
      phase: "Interview mode",
      hours: 4,
      depth: "studio",
      outcome:
        "Compare alternatives with a repeatable, evidence-based decision frame.",
      why: "Interviewers often push with ‘why not X?’ The goal is neither loyalty nor instant reversal. Define the decision dimensions, compare, choose for current constraints, and name the trigger that would change your mind.",
      coverage: [
        "Data: SQL/NoSQL, shard/replicate, strong/eventual.",
        "Flow: queue/stream, push/pull, sync/async.",
        "Computation: precompute/on-demand, stateful/stateless.",
        "Transport: polling/WebSockets/SSE.",
        "Topology: single/multi-region.",
        "Strategy: build/buy, simplicity/scalability.",
      ],
      mentalModel: {
        statement:
          "A strong tradeoff answer ends with a choice and a reversal trigger.",
        flow: [
          { label: "Criteria", detail: "What matters?" },
          { label: "Compare", detail: "Benefits + costs" },
          { label: "Choose", detail: "For this workload" },
          { label: "Trigger", detail: "When to revisit" },
        ],
      },
      lessons: systemDesignLessons[14],
      seniorSignal:
        "Answer ‘why X?’ in 45 seconds: criteria, 2 alternatives, decision, drawback, trigger. Concision signals command.",
      pitfalls: [
        "Feature-list comparisons with no decision",
        "Claiming one technology is always better",
        "Ignoring team/operational complexity",
        "Refusing to revise when constraints change",
      ],
      drill: {
        prompt:
          "Complete ten 60-second tradeoff rounds. Record each and cut any answer that exceeds 90 seconds.",
        constraints: ["10 rounds", "60 sec each", "explicit choice", "reversal trigger"],
        approach:
          "Use: ‘The deciding constraints are __. X gives __ but costs __; Y gives __ but costs __. I choose X because __. If __ changes, I would switch.’ Include SQL/NoSQL, SSE/WebSocket, sync/async, single/multi-region, and build/buy.",
      },
      quiz: [
        {
          question: "What makes a tradeoff answer complete?",
          options: [
            "A longer feature list",
            "A contextual choice plus drawback and reversal trigger",
            "Naming the newest database",
            "Avoiding commitment",
          ],
          answer: 1,
          explanation:
            "The interviewer needs your decision process and ability to adapt, not trivia.",
        },
        {
          question: "When challenged, first…",
          options: [
            "Defend harder",
            "Identify which assumption changed",
            "Add three services",
            "Change everything",
          ],
          answer: 1,
          explanation:
            "A challenge often introduces a new constraint; make it explicit before revising.",
        },
      ],
      labs: [
        "FACT Tradeoff Cards — timed comparison drill: present SQL/NoSQL, queue/stream, SSE/WebSockets, and single/multi-region; require criteria, choice, drawback, and reversal trigger in 60 seconds.",
        "Decision Frontier — two-axis explorer: move latency, correctness, complexity, and cost weights to show why no technology is universally best.",
        "Base mental-model animation: Criteria → Compare → Choose → Trigger, step by step.",
      ],
    },
    {
      slug: "15-interview-execution-framework",
      order: 15,
      studyGuide: systemDesignStudyGuides[15],
      title: "Interview execution framework",
      phase: "Interview mode",
      hours: 4,
      depth: "capstone",
      outcome:
        "Run a clear 45–60 minute design interview and recover gracefully when pushed.",
      why: "Excellent knowledge can disappear inside an unstructured interview. A time-boxed narrative lets the interviewer steer, exposes judgment, and ensures you reach bottlenecks, failure, and operations.",
      coverage: [
        "Opening: clarify, scale, critical constraints in five minutes.",
        "Core: high-level design, APIs, data model, request flows.",
        "Depth: bottlenecks, failure, security, observability, cost.",
        "Interaction: invite steering, defend decisions, revise openly.",
        "Recovery: surface a flaw, protect invariants, migrate the design.",
        "Seniority: reason in product outcomes and ownership boundaries.",
      ],
      mentalModel: {
        statement: "Time-box the breadth, earn the deep dive, and close the loop.",
        flow: [
          { label: "0–5", detail: "Contract + scale" },
          { label: "5–15", detail: "Skeleton + API" },
          { label: "15–40", detail: "Critical deep dive" },
          { label: "40–50", detail: "Failure + close" },
        ],
      },
      lessons: systemDesignLessons[15],
      seniorSignal:
        "Treat the interview as a design review with a colleague. Use decisive language, expose uncertainty honestly, and make it easy for them to push you deeper.",
      pitfalls: [
        "Talking continuously without checkpoints",
        "Spending half the session on requirements",
        "Narrating boxes rather than decisions",
        "Hiding or hand-waving a discovered flaw",
      ],
      drill: {
        prompt:
          "Run a full 50-minute mock: design a public, abuse-resistant AI inference API. Use the built-in scorecard afterward.",
        constraints: ["50 min", "whiteboard", "recorded", "self-score"],
        approach:
          "0–5 contract/scale; 5–12 API and high-level path; 12–20 quota/admission; 20–32 scheduling/streaming; 32–40 failure/fallback; 40–47 security/observability/cost; 47–50 recap. Score clarity, correctness, depth, tradeoffs, and recovery from 1–4.",
      },
      quiz: [
        {
          question: "Best response after discovering a flaw?",
          options: [
            "Hide it",
            "Name impact, preserve invariant, revise the smallest boundary",
            "Restart silently",
            "Blame the prompt",
          ],
          answer: 1,
          explanation:
            "Transparent, bounded correction demonstrates strong engineering judgment.",
        },
        {
          question: "Senior-level narration focuses on…",
          options: [
            "Component names",
            "Constraints, ownership, failure, and tradeoffs",
            "Memorized definitions",
            "Drawing speed",
          ],
          answer: 1,
          explanation:
            "A design is a set of decisions under constraints, not a catalog of infrastructure.",
        },
      ],
      labs: [
        "Interview Timeline — guided 50-minute workspace: phase the session into contract, skeleton, deep dive, failure/security, and recap with subtle time warnings.",
        "Mock Scorecard — rubric + notes: score framing, correctness, depth, tradeoffs, and recovery from 1–4; persist one piece of evidence and one next drill per dimension.",
        "Base mental-model animation: 0–5 → 5–15 → 15–40 → 40–50, step by step.",
      ],
    },
  ],
};
