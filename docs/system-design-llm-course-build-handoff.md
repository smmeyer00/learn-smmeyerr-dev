# Systems & LLM Engineering Lab — Complete Course and Build Handoff

> A self-contained curriculum, product specification, content transcript, interaction brief, and implementation handoff for rebuilding the proof of concept as a production-quality learning site.

**Target learner:** An experienced software engineer who is already comfortable with application development and production systems, but does not need an ML-research background.

**Likely final home:** `learn.smmeyer.dev` or another subdomain of `smmeyer.dev`.

**Important:** This document is the canonical handoff, not a request to clone the prototype pixel-for-pixel. Preserve the curriculum and learning intent, but improve the information architecture, interaction quality, pedagogy, content depth, accessibility, and implementation.

---

## 1. Executive brief

Build two connected, self-paced courses:

1. **System Design for Software Engineers** — a deep, practical course covering foundations through large-scale and AI-native systems.
2. **LLM Engineering for Software Engineers** — first-principles AI-system fluency for strong software engineers who are not trying to become ML researchers.

The product should feel like a serious engineering lab rather than a documentation dump. Each chapter should move through a consistent learning loop:

1. **Learn** — build a causal mental model.
2. **Manipulate** — change a variable and predict what happens.
3. **Explain** — teach the concept clearly, without jargon or hand-waving.
4. **Design** — use it in an interview problem and defend the tradeoff.

The site should be dark-first, highly readable, vibrant without looking like a game dashboard, and visually purposeful. Use block-based layouts, restrained clay-like depth, crisp diagrams, generous spacing, strong typography, and motion only when it explains state or causality.

### Success criteria

- A learner can immediately tell what to study next and why.
- Every chapter teaches, demonstrates, tests, and applies—not just summarizes.
- Diagrams explain systems, data flow, failure, timing, or tradeoffs; they are not decoration.
- Interactive labs expose cause and effect and ask for a prediction before revealing the answer.
- Progress, quiz results, notes, and last location persist locally with no account or backend requirement.
- The course is usable on desktop and mobile, though design studios may intentionally be richer on desktop.
- Provider-specific platform facts that can change are clearly marked update-sensitive and linked to current official documentation.
- The end state is interview performance: concise explanations, quantified designs, explicit failure behavior, and defensible decisions.

### Non-goals

- Do not turn the LLM course into an ML-research mathematics curriculum.
- Do not require authentication, cloud persistence, payments, or user-generated public content for v1.
- Do not use AI-generated decorative imagery where a precise diagram or simulator would teach more.
- Do not hard-code current model names, prices, context limits, or rate limits as timeless facts.
- Do not build a generic marketing landing page before the actual learning workspace.

---

## 2. Learner prerequisites and assumed level

The course assumes meaningful professional software-engineering experience. Learners should already be comfortable reading code, designing APIs, working with data stores, debugging applications, and discussing production tradeoffs. They may have frontend, backend, mobile, infrastructure, or full-stack backgrounds. Formal machine-learning study is not required.

Use occasional ‘Engineering bridge’ callouts to connect unfamiliar concepts to experience many working engineers already have:

- Server-driven UI contracts → typed model/tool contracts and schema-constrained output.
- In-app messaging and marketing tech → notification pipelines, tenancy, rate limits, experimentation, and abuse controls.
- Cross-platform renderers → protocol ownership, compatibility, versioning, rollouts, and graceful degradation.
- AI builder work → prompt versioning, eval-driven iteration, deterministic controls around probabilistic behavior.
- Production ownership → SLOs, observability, incident reasoning, capacity planning, and multi-tenant reliability.

Avoid beginner-level explanations of ordinary application-development concepts. Add context when distributed-systems or ML-specific assumptions would otherwise be unclear.

---

## 3. Information architecture

### Primary routes

- `/` — working dashboard with next lesson, progress, current study phase, and quick access to the two tracks.
- `/system-design` — system-design roadmap and chapter index.
- `/llm-engineering` — LLM-engineering roadmap and chapter index.
- `/course/:track/:chapter` — chapter lesson surface.
- `/labs` — all interactive labs, filterable by course and concept.
- `/drills` — randomized interview design deck and timed mock workspace.
- `/field-manual` — formulas, checklists, tradeoff frames, failure matrices, and print/PDF layout.
- `/progress` — mastery heatmap, quiz history, completed drills, and weak areas.
- `/about-this-course` — goals, intended depth, study method, and update policy.

### Chapter anatomy

Every chapter should contain these blocks in roughly this order:

1. Outcome and estimated time.
2. Why the concept matters in an interview and in production.
3. Coverage map for the chapter's required subtopics.
4. A clear mental-model diagram.
5. Three or more teaching sections with examples.
6. One prediction-based interactive or visual exploration when the concept benefits from it.
7. ‘Senior signal’ language: how to discuss the topic precisely.
8. Common failure patterns or weak interview answers.
9. A timed design/explanation drill with constraints.
10. A hidden strong approach—not a script to memorize.
11. Knowledge checks with explanations for right and wrong answers.
12. Optional official references or deeper reading.
13. Mark-complete and continue controls.

### Global features

- Command/search palette across chapter titles, concepts, drills, and glossary terms.
- Local progress with versioned migration logic.
- Chapter completion, quiz state, bookmarks, personal notes, and last visited location.
- Focus timers for 25-minute study blocks and 50-minute mocks.
- Random drill and constraint-card generator with reproducible seeds.
- Print-friendly field manual and chapter summary sheets.
- Reduced-motion mode and keyboard-accessible interactions.
- Optional ‘prediction first’ gates in labs: commit a guess, then reveal the simulation.
- A clear reset/export/import control for local progress; export should be a small JSON file.

---

## 4. Suggested study sequence

The learner can move linearly, but the dashboard should recommend alternating the courses so the AI-native material immediately reinforces the system-design material.

### Phase 1: Core machinery — weeks 01–03

Systems foundations, storage, caching, networking; LLM mental models, transformers, and training.

### Phase 2: Distributed reality — weeks 04–07

Queues, failure, reliability, serving, prompting, tools, agents, and retrieval.

### Phase 3: Production judgment — weeks 08–11

Operations, security, global scale, evals, safety, reliability, and product architecture.

### Phase 4: Interview mode — weeks 12–16

AI infrastructure, full designs, tradeoff drills, mock loops, and concise senior-level explanations.

A reasonable pace is 5–7 focused hours per week over 12–16 weeks. Do not present that estimate as a deadline. The dashboard should optimize for continuity and completed practice reps rather than streak anxiety.

---

## 5. Visual and interaction system

### Visual thesis

Create a dark engineering observatory: near-black background, layered graphite/navy surfaces, cool cyan for classic systems, violet for LLM/AI, lime only for verified success, amber for pressure, and coral/red for failures. Use strong typographic hierarchy, subtle grid/topology motifs, and raised blocks with restrained inner highlights. Avoid neon overload, glass everywhere, giant gradients, or tiny dashboard labels.

### Diagram rules

- Use diagrams when topology, data flow, event order, ownership, state change, or a tradeoff frontier is the teaching point.
- Use tables for exact mappings, protocol comparisons, failure matrices, and checklists.
- Use charts for numeric relationships such as utilization versus tail latency, hit rate versus source load, or recall versus ANN latency.
- Use animation only to show causality, time, failure propagation, batching, queue growth, attention weights, or state transitions.
- Every visual needs a caption, learner task, and takeaway. Never rely on color alone.
- Clearly label fabricated or pedagogical values. Do not present illustrative attention weights or throughput estimates as measurements from real models.
- Keep system diagrams readable at 200% zoom and provide a text alternative.

### Interaction pattern

The ideal lab sequence is: **predict → manipulate → observe → explain → transfer**.

1. Ask a concrete prediction.
2. Let the learner change one or two meaningful variables.
3. Animate or chart the resulting system behavior.
4. Reveal an explanation tied to the variables.
5. Ask how the result changes a design decision.

---

## 6. Complete course transcript

The following content is baseline teaching copy and the canonical coverage contract. It can be expanded with examples, diagrams, citations, and exercises, but its technical claims and interview intent should be preserved unless deliberately corrected.

# Course 1: System Design

**Scope:** 15 chapters · approximately 46 hours

Build senior-level design judgment, then pressure-test it on AI-native infrastructure.

## Chapter 1: System Design Foundations

**Phase:** Foundations  
**Estimated time:** 3h  
**Depth:** Core

### Outcome

Turn an ambiguous prompt into a scoped, quantified design conversation.

### Why this matters

The first ten minutes often reveal more seniority than the diagram. Strong candidates turn ambiguity into explicit decisions, use estimates to find the real bottleneck, and keep the design proportional to the problem.

### Coverage requirements

- **Requirements:** Separate must-have user behavior from constraints and future wishes.
- **Quality attributes:** Latency, throughput, availability, durability, consistency, cost, and security become design inputs.
- **Estimation:** Convert users and behavior into peak RPS, bytes, bandwidth, memory, and growth.
- **Decomposition:** Map clients, APIs, services, stores, queues, caches, and workers to responsibilities.

### Mental model

Move from fuzzy prompt to a defended first design.

**Base flow:** Clarify (Users + workflows) → Quantify (Scale + SLOs) → Decompose (Boundaries + data) → Stress (Bottlenecks + failure)

### Lesson 1: Start with the contract

Ask questions that change architecture: who uses it, what the critical read/write path is, whether data loss is acceptable, and what success looks like. State assumptions when the interviewer will not choose for you.

- Functional: verbs the system must support
- Non-functional: measurable quality constraints
- Out of scope: complexity you deliberately defer

### Lesson 2: Estimate to choose—not to perform arithmetic

Use round numbers and show units. An estimate matters when it changes a decision: one database or shards, synchronous work or a queue, memory cache or disk, one region or several.

- Average RPS = daily actions / 86,400
- Peak is commonly 2–10× average; explain your factor
- Storage/year = writes/sec × bytes/write × seconds/year × replication

### Lesson 3: Architecture is a chain of responsibilities

Every box should own something and every arrow should carry a named request or event. Begin with the critical path, then add components only to satisfy a requirement or repair a bottleneck.

- Name data and control flows
- Mark stateful boundaries
- Identify one bottleneck before proposing scale mechanisms

### Senior signal

Say: “I’m estimating because this determines whether a single relational primary is plausible.” Tie every number and component to a decision.

### Failure patterns to catch

- Listing components before agreeing on the product contract
- Inventing massive scale without estimating it
- Optimizing secondary paths before the critical one
- Treating every quality attribute as equally important

### Interview drill

**Prompt:** Design a paste-sharing service used by 20M monthly users. In 35 minutes, scope v1 and decide whether one relational database is enough.

**Constraints:** 35 min · 20M MAU · 1% creators · 1-year default retention

<details>
<summary>Strong approach</summary>

Clarify privacy and paste size. Estimate peak creates and reads. Define create/read APIs and paste metadata. Put bodies in object storage if size variance is large; keep metadata and ownership relational. Add a CDN/cache only after quantifying the read ratio. Close with hot-link abuse, expiry, and failure behavior.

</details>

### Knowledge checks

1. **Which estimate most directly tests whether sharding is needed?**
   - A. Monthly active users
   - B. Peak writes per second and dataset growth
   - C. Number of API endpoints
   - D. Team size

2. **What belongs in the first five minutes?**
   - A. Pick Kafka
   - B. Define users, core flows, scale, and critical SLOs
   - C. Design every table
   - D. Explain CAP theorem

<details>
<summary>Answer key and explanations</summary>

1. **B — Peak writes per second and dataset growth**  
   Sharding is driven by write throughput, dataset size, hot-key shape, and operational limits—not user count alone.

2. **B — Define users, core flows, scale, and critical SLOs**  
   Early alignment prevents a polished answer to the wrong problem.

</details>

### Visual and interaction briefs

- **Scale Dial — Interactive calculator:** Sliders for users, actions, peak factor, payload size, retention, and replicas update RPS, bandwidth, and annual storage. Ask the learner to predict the architecture-changing threshold before revealing it.
- **Architecture Skeleton — Constrained canvas:** Let the learner place only client, edge, service, cache, database, queue, object store, and worker. Every added box must be tagged with the requirement it satisfies.
- **Base mental-model animation:** Animate the Clarify → Quantify → Decompose → Stress flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 2: Networking, APIs & Boundaries

**Phase:** Foundations  
**Estimated time:** 3h  
**Depth:** Core

### Outcome

Choose protocols, boundaries, and traffic controls from interaction shape—not habit.

### Why this matters

At scale, latency budgets disappear across hops, retries multiply load, and weak boundaries spread failure. Interviewers want practical protocol intuition and disciplined ownership.

### Coverage requirements

- **HTTP in practice:** HTTP/1.1, HTTP/2 multiplexing, HTTP/3, keep-alive, timeouts, retries, and idempotency.
- **API styles:** REST resources, RPC/gRPC contracts, SSE streams, WebSockets, and pagination.
- **Service boundaries:** Monolith vs microservices, domain ownership, cohesion, coupling, sync vs async.
- **Traffic control:** L4/L7 load balancing, health checks, regional routing, token/leaky buckets, tenant quotas.

### Mental model

A request is a latency and failure budget moving across ownership boundaries.

**Base flow:** Client (Intent + retry) → Edge (Route + limit) → Service (Validate + own) → Dependency (Store or compute)

### Lesson 1: Protocol follows conversation shape

REST is excellent for public resource APIs. gRPC fits typed internal request/response and streaming. SSE is simple server-to-client streaming over HTTP. WebSockets fit bidirectional, long-lived interaction. HTTP/2 reduces connection pressure; HTTP/3 improves behavior under packet loss.

- Prefer the least stateful protocol that meets the need
- Streaming changes cancellation, backpressure, and observability
- Connection reuse matters before protocol trivia

### Lesson 2: Retries are load amplifiers

A timeout does not prove failure; it proves the caller stopped waiting. Retrying a non-idempotent operation can duplicate side effects. Bound retries, add jitter, propagate deadlines, and use idempotency keys at the effect boundary.

- Retry transient failures, not every 4xx
- Budget attempts inside the user deadline
- Deduplicate at the component that commits the effect

### Lesson 3: Boundaries are organizational and operational

Split when a domain needs independent ownership, scaling, security, or release cadence. Each synchronous hop increases latency and correlated-failure surface, so keep the critical path short.

- High cohesion inside, low coupling across
- Prefer stable contracts over shared tables
- Do not begin with microservices as a status symbol

### Senior signal

Discuss deadline propagation and retry ownership. “Three layers each retrying three times can turn one request into 27 downstream attempts.”

### Failure patterns to catch

- Using WebSockets for one-way token streaming when SSE suffices
- Retrying writes without an idempotency contract
- Confusing HTTP/2 multiplexing with unlimited concurrency
- Drawing service boundaries around technical layers instead of domains

### Interview drill

**Prompt:** Design the public API edge for a streaming AI chat product with per-workspace quotas and regional routing.

**Constraints:** SSE output · 10k concurrent streams · tenant quotas · 60s max

<details>
<summary>Strong approach</summary>

Authenticate at the edge, attach tenant identity, reserve quota before expensive work, route to a healthy region, and stream typed events. Propagate cancellation and deadlines. Make create-message idempotent, separate connection limits from token budgets, and define what a partial stream means for billing and retry.

</details>

### Knowledge checks

1. **Best default for one-way incremental text to a browser?**
   - A. SSE
   - B. UDP
   - C. Polling every 50ms
   - D. A database trigger

2. **Where should write deduplication happen?**
   - A. Only in the browser
   - B. At the side-effect boundary
   - C. In DNS
   - D. Nowhere if timeout is short

<details>
<summary>Answer key and explanations</summary>

1. **A — SSE**  
   SSE is HTTP-friendly, reconnection-aware, and purpose-built for server-to-client events.

2. **B — At the side-effect boundary**  
   The component committing the effect has the authoritative view needed to enforce an idempotency key.

</details>

### Visual and interaction briefs

- **Protocol Chooser — Interactive decision tree:** Change directionality, latency, connection lifetime, client type, and payload shape; compare REST, gRPC, SSE, WebSockets, and polling with a short rationale.
- **Retry Explosion — Animated request tree:** Toggle retries at three layers and watch one request multiply into 3, 9, or 27 downstream attempts. Add deadline propagation and idempotency to collapse the blast radius.
- **Base mental-model animation:** Animate the Client → Edge → Service → Dependency flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 3: Data Modeling & Storage

**Phase:** Foundations  
**Estimated time:** 4h  
**Depth:** Core

### Outcome

Derive schemas, datastore choices, partitioning, and consistency from access patterns.

### Why this matters

The strongest storage answer is rarely a database brand. It is a chain from invariants and access patterns to model, index, partition key, replication, and failure semantics.

### Coverage requirements

- **Relational core:** Schemas, indexes, transactions, isolation, joins, replication.
- **NoSQL shapes:** Key-value, document, wide-column, and graph tradeoffs.
- **Distribution:** Hash/range partitioning, hot partitions, resharding, leader/follower, multi-leader, leaderless.
- **Correctness:** Strong/eventual/session guarantees, 2PC, sagas, transactional outbox.
- **Specialized stores:** Search, time-series, vector, and object storage as secondary access paths.

### Mental model

Start with invariants and queries; the datastore is the consequence.

**Base flow:** Invariants (What must be true?) → Access (Reads + writes) → Layout (Schema + index) → Distribution (Partition + replicate)

### Lesson 1: Model the invariants first

List entities, relationships, uniqueness constraints, and state transitions. If money, ownership, or inventory must change atomically, relational transactions are a powerful default. Denormalize only for a measured access pattern.

- Indexes accelerate reads but tax writes and storage
- Isolation controls anomalies, not just speed
- Joins are useful; cross-shard joins are the warning

### Lesson 2: Partition keys encode your future

A good key spreads throughput and co-locates common operations. Hash keys balance load but weaken range scans. Range keys help scans but invite hotspots. Hybrid keys—tenant plus time bucket, for example—often balance both.

- Estimate hottest key, not only average key
- Plan rebalancing and key evolution
- Avoid unbounded partitions

### Lesson 3: Replication is a consistency decision

Leader/follower simplifies ordered writes but creates lag. Multi-leader improves regional write availability while creating conflicts. Leaderless systems trade coordination for quorum math and repair. State the read guarantee users need.

- Read-your-writes can be session scoped
- Eventual consistency is incomplete without convergence behavior
- Use outbox + idempotent consumer to connect DB state and events

### Senior signal

Name the invariant you are protecting: “Username uniqueness needs serialized ownership; feed fan-out can be eventually consistent.”

### Failure patterns to catch

- Selecting NoSQL solely because the prompt says ‘large scale’
- Ignoring the hottest tenant or celebrity key
- Assuming replicas are immediately current
- Using dual writes to a DB and queue without an outbox or reconciliation path

### Interview drill

**Prompt:** Design conversation storage for a multi-tenant AI assistant: ordered messages, attachments, edits, search, and deletion.

**Constraints:** 500M conversations · read-your-writes · large blobs · tenant deletion

<details>
<summary>Strong approach</summary>

Use relational metadata and ordered message records keyed by conversation, object storage for blobs, and asynchronous search indexing. Partition by tenant/conversation with a strategy for large tenants. Preserve read-your-writes on the primary or session token. Tombstone deletion, cascade asynchronously, and keep an auditable deletion job.

</details>

### Knowledge checks

1. **Best partition key characteristic?**
   - A. Human-readable
   - B. Even load plus locality for dominant queries
   - C. Always timestamp
   - D. Random regardless of access

2. **What repairs DB + event dual-write risk?**
   - A. Longer timeout
   - B. Transactional outbox
   - C. More replicas
   - D. A CDN

<details>
<summary>Answer key and explanations</summary>

1. **B — Even load plus locality for dominant queries**  
   Distribution and query locality must both be considered; either alone can make the system expensive.

2. **B — Transactional outbox**  
   The outbox commits domain state and an event record atomically, then publishes asynchronously.

</details>

### Visual and interaction briefs

- **Shard Heatmap — Live partition visualization:** Switch between hash, range, tenant, and tenant-plus-time keys while a celebrity or large tenant appears. Animate hot partitions and a resharding event.
- **Consistency Timeline — Replica simulator:** Place a write and then read from leader/followers under lag. Toggle strong, eventual, and read-your-writes semantics and show the product-visible result.
- **Base mental-model animation:** Animate the Invariants → Access → Layout → Distribution flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 4: Caching & Performance

**Phase:** Foundations  
**Estimated time:** 3h  
**Depth:** Core

### Outcome

Use caches deliberately, calculate their value, and contain stale-data and stampede failure modes.

### Why this matters

Caches make fast systems possible and correctness subtle. Senior answers discuss hit rate, ownership, invalidation, and what happens when the cache vanishes.

### Coverage requirements

- **Cache layers:** Client, browser, CDN, service, query, and distributed caches.
- **Patterns:** Cache-aside, read-through, write-through, and write-behind.
- **Freshness:** TTL, versioned keys, event invalidation, stale-while-revalidate.
- **Failure:** Stampedes, hot keys, penetration, eviction, and stale data.
- **Other levers:** Batching, pagination, compression, precomputation, materialized views, pools.

### Mental model

Caching trades repeated work for a freshness and invalidation contract.

**Base flow:** Request (Choose key) → Cache (Hit or miss) → Source (Compute/read) → Fill (TTL + version)

### Lesson 1: A cache is a prediction

You predict that the same result will be needed again before it becomes invalid. Estimate working-set size and hit rate. A 95% hit rate can reduce source load 20×; a 50% hit rate often does not justify major complexity.

- Key includes every input that changes output
- Capacity targets the hot working set, not the full corpus
- Negative caching prevents repeated misses

### Lesson 2: Invalidation is product semantics

Ask how stale is acceptable. TTL gives bounded staleness and simple failure behavior. Event invalidation is fresher but can lose or reorder events. Versioned keys make old values unreachable and simplify rollouts.

- Use jittered TTLs to avoid synchronized expiry
- Single-flight/coalescing suppresses stampedes
- Serve stale during source trouble only when semantics allow

### Lesson 3: Performance is broader than caching

Batch network calls, paginate unbounded results, compress large payloads, precompute expensive aggregates, and pool connections. Optimize the bottleneck you can name and measure.

- Batching trades latency for throughput
- Precompute trades write/storage cost for read latency
- Connection pools need queue and timeout bounds

### Senior signal

When adding cache, give the failure plan: “If Redis is unavailable, cap source concurrency and degrade; never let every miss stampede the primary.”

### Failure patterns to catch

- Caching personalized data without tenant/user identity in the key
- Letting all clients retry on cache failure
- Using TTLs that expire together
- Treating cache as durable source of truth

### Interview drill

**Prompt:** Reduce p99 latency for a model-catalog API from 900ms to 120ms while updates may take 30 seconds to propagate.

**Constraints:** p99 120ms · 30s staleness · 50:1 reads:writes · regional

<details>
<summary>Strong approach</summary>

Profile first. Put a versioned object at the CDN or regional cache with a 30-second TTL and stale-while-revalidate. Publish invalidations on update as an acceleration, not the only correctness mechanism. Coalesce misses and cap fallthrough to the source.

</details>

### Knowledge checks

1. **Best first stampede defense?**
   - A. Shorter TTL
   - B. Request coalescing plus TTL jitter
   - C. More client retries
   - D. Disable expiry

2. **A 90% hit rate reduces backing reads by roughly…**
   - A. 2×
   - B. 5×
   - C. 10×
   - D. 100×

<details>
<summary>Answer key and explanations</summary>

1. **B — Request coalescing plus TTL jitter**  
   Coalescing limits concurrent recomputation; jitter spreads expirations over time.

2. **C — 10×**  
   Only 10% of requests fall through, so backing request volume is about one tenth.

</details>

### Visual and interaction briefs

- **Cache Stampede — Animated traffic simulation:** Synchronize thousands of expirations, then enable TTL jitter, request coalescing, stale-while-revalidate, and concurrency caps one at a time.
- **Hit-Rate Curve — Interactive chart:** Map hit rate to backing-store load. Make the nonlinear operational value of moving from 90% to 99% visually obvious.
- **Base mental-model animation:** Animate the Request → Cache → Source → Fill flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 5: Queues, Streams & Async Systems

**Phase:** Distributed core  
**Estimated time:** 4h  
**Depth:** Core

### Outcome

Design durable asynchronous flows with explicit ordering, duplicate, retry, and backpressure behavior.

### Why this matters

Queues remove work from latency-critical paths, but they move complexity into time: lag, redelivery, poison messages, ordering, and reconciliation.

### Coverage requirements

- **Queue vs log:** Destructive work distribution vs retained replayable history.
- **Kafka model:** Topics, partitions, consumer groups, offsets, ordering, retention.
- **Delivery:** At-most-once, at-least-once, effectively-once, dedup keys.
- **Pressure:** Lag, bounded queues, load shedding, admission control.
- **Event systems:** Events vs commands, CQRS, event sourcing.
- **Jobs:** Delay, schedule, retry, dead-letter, priority, cancellation.

### Mental model

A reliable async flow separates acceptance, durable intent, execution, and outcome.

**Base flow:** Accept (Persist intent) → Enqueue (Partition + order) → Consume (Idempotent work) → Record (Outcome + retry)

### Lesson 1: Choose by semantics

A queue gives one worker ownership of a task. A log retains ordered partition history so multiple consumer groups can independently replay it. Kafka ordering is per partition—not global—so partition by the entity whose events must stay ordered.

- Events describe facts; commands request actions
- Offsets are consumer progress, not business completion
- Retention enables replay and new consumers

### Lesson 2: At-least-once is the practical default

A worker can finish the side effect and crash before acknowledgment, so redelivery happens. Make handlers idempotent with a stable operation key, transactional state transition, or effect ledger.

- Exactly-once claims have a system boundary
- Retries need exponential backoff and jitter
- Dead-letter queues need an owner and replay procedure

### Lesson 3: Backpressure is part of the API

When arrival exceeds service rate, queues grow and latency becomes unbounded. Bound the queue, reject or defer low-priority work, shed optional load, and expose truthful status.

- Track queue age, not only depth
- Reserve capacity for high-priority tenants
- Admission control belongs before scarce work

### Senior signal

State the ordering unit and duplicate boundary. Those two sentences distinguish an operational design from boxes-and-arrows.

### Failure patterns to catch

- Saying Kafka provides global ordering
- Calling an event ‘exactly once’ without naming the external effect boundary
- Adding a DLQ without alerting or replay ownership
- Allowing infinite queue growth to protect availability metrics

### Interview drill

**Prompt:** Design a notification platform for email, push, and in-app messages with priorities and user preferences.

**Constraints:** 1B/day · at-least-once · quiet hours · provider outages

<details>
<summary>Strong approach</summary>

Commit a notification intent, expand channels asynchronously, check preferences near send time, and enqueue per provider/priority. Use idempotency keys per notification-channel, provider circuit breakers, retry schedules, DLQs, and delivery receipts. Shed promotional work before transactional alerts.

</details>

### Knowledge checks

1. **Kafka guarantees order across…**
   - A. All topics
   - B. A partition
   - C. A consumer group globally
   - D. All regions

2. **Best lag signal for user impact?**
   - A. Broker disk size
   - B. Oldest message age
   - C. Number of topic names
   - D. Producer CPU alone

<details>
<summary>Answer key and explanations</summary>

1. **B — A partition**  
   Ordering is defined within a partition.

2. **B — Oldest message age**  
   Age directly represents how late work is becoming.

</details>

### Visual and interaction briefs

- **Queue vs Log — Side-by-side animation:** Show destructive work ownership in a queue versus retained partition history with independent consumer groups in a log.
- **Lag and Backpressure — Timeline simulator:** Increase arrival rate above service rate and watch message age grow. Let the learner apply admission control, shedding, priority lanes, and more workers.
- **Base mental-model animation:** Animate the Accept → Enqueue → Consume → Record flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 6: Distributed Systems Fundamentals

**Phase:** Distributed core  
**Estimated time:** 4h  
**Depth:** Deep

### Outcome

Reason precisely about partial failure, partitions, coordination, and retry-safe correctness.

### Why this matters

Distributed systems are not single-machine systems with more boxes. Messages delay, clocks disagree, nodes fail independently, and observers can hold different but valid views.

### Coverage requirements

- **Failure model:** Partial failure, partitions, omission, crash, Byzantine boundaries.
- **CAP precisely:** During a partition, choose availability or linearizable consistency for an operation.
- **Consensus:** Raft/Paxos intuition, replicated log, quorum, leader election.
- **Coordination:** Locks, leases, fencing tokens, membership, discovery.
- **Time:** Clock skew, monotonic clocks, logical time.
- **Avoidance:** Idempotency, commutativity, CRDT intuition, partitioned ownership.

### Mental model

Coordination buys a single decision but costs latency and availability under failure.

**Base flow:** Propose (Candidate value) → Quorum (Majority agrees) → Commit (Ordered log) → Apply (State converges)

### Lesson 1: Partial failure creates uncertainty

If a request times out, the remote node may be down, the network may be slow, the response may be lost, or the operation may have committed. APIs need stable IDs and retriable semantics because certainty is unavailable.

- Use monotonic clocks for elapsed time
- Leases expire; stale holders need fencing tokens
- Health checks are observations, not truth

### Lesson 2: CAP is a partition-time statement

When communication between replicas is partitioned, a given operation cannot both always respond and remain linearizable. Systems make different choices by operation; outside partitions, latency/consistency tradeoffs still exist under PACELC.

- Replication alone does not create availability
- Quorum intersection can preserve a single history
- Eventual consistency needs conflict and convergence rules

### Lesson 3: Coordinate only what must agree

Consensus maintains a fault-tolerant ordered log. It is useful for metadata, membership, and ownership but expensive in every data operation. Scale by partitioning ownership and making operations idempotent or commutative.

- Majority tolerates minority failure
- Leader election does not prevent stale actors by itself
- Exactly-once is usually deduplication plus transactions within a boundary

### Senior signal

Use uncertainty language: “After timeout the outcome is unknown, so the client retries with the same operation ID and reads status.”

### Failure patterns to catch

- Explaining CAP as ‘pick any two’ during normal operation
- Using a distributed lock without fencing stale holders
- Trusting wall clocks for ordering
- Claiming exactly-once across arbitrary external side effects

### Interview drill

**Prompt:** Design exclusive ownership for shard workers when processes can pause for 90 seconds and clocks can skew.

**Constraints:** worker pauses · clock skew · no double writes · fast reassignment

<details>
<summary>Strong approach</summary>

Store leases in a consensus-backed coordinator, but attach a monotonically increasing fencing token to every ownership grant. The downstream storage rejects writes with older tokens. Renew well before expiry and design idempotent reassignment. The fencing check—not the lock alone—prevents a paused former owner from writing.

</details>

### Knowledge checks

1. **Why does a lease need a fencing token?**
   - A. To reduce storage
   - B. To reject work from a stale holder after pause/partition
   - C. To compress logs
   - D. To choose HTTP/3

2. **Consensus primarily gives replicas…**
   - A. Infinite throughput
   - B. Agreement on an ordered history
   - C. Zero latency
   - D. Perfect clocks

<details>
<summary>Answer key and explanations</summary>

1. **B — To reject work from a stale holder after pause/partition**  
   A former owner can resume after its lease expired; downstream token comparison makes it harmless.

2. **B — Agreement on an ordered history**  
   Consensus lets non-faulty members agree on committed log entries despite failures.

</details>

### Visual and interaction briefs

- **Network Partition Lab — Cluster simulation:** Split a five-node cluster, attempt reads/writes from both sides, and compare availability and linearizability choices. Avoid the misleading ‘pick any two’ framing.
- **Lease + Fencing — Event timeline:** Pause a worker past lease expiry, grant a new owner, then resume the old worker. Show how monotonically increasing fencing tokens reject stale writes.
- **Base mental-model animation:** Animate the Propose → Quorum → Commit → Apply flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 7: Reliability & Resilience

**Phase:** Production  
**Estimated time:** 3h  
**Depth:** Core

### Outcome

Translate availability goals into redundancy, recovery, isolation, and graceful degradation.

### Why this matters

Reliability is a budget and a design property, not a last-minute replica. Strong candidates connect user-visible SLOs to dependency math and concrete failure modes.

### Coverage requirements

- **Targets:** SLIs, SLOs, 99.9/99.99/99.999, error budgets.
- **Redundancy:** Multi-AZ, multi-region, correlated failure.
- **Failover:** Active-passive, active-active, detection and recovery.
- **Patterns:** Timeouts, backoff, jitter, circuit breakers, bulkheads.
- **Recovery:** RPO, RTO, backups, restore tests.
- **Degradation:** Load shedding, dependency isolation, feature tiers.

### Mental model

Prevent, detect, contain, recover—each layer answers a different failure question.

**Base flow:** Prevent (Capacity + redundancy) → Detect (SLIs + alerts) → Contain (Bulkheads + shed) → Recover (Failover + restore)

### Lesson 1: An SLO is a product promise

99.9% allows about 43.8 minutes of downtime per 30-day month; 99.99% about 4.38 minutes. Multiplying serial dependency availability reveals why every synchronous hop spends budget.

- Measure the user journey, not server uptime
- Error budgets govern release vs reliability work
- Tail latency can violate an SLO before total outage

### Lesson 2: Redundancy must cross failure domains

Two replicas on one host do not protect against host loss; two AZs may not meet a three-AZ quorum strategy. Active-active improves recovery but adds state and conflict complexity.

- Failover detection can be riskier than failover mechanics
- Exercise backups by restoring them
- Know RPO (data) and RTO (time)

### Lesson 3: Stop failure from spreading

Bound every call with a timeout and concurrency limit. Circuit breakers stop futile work. Bulkheads reserve resources. Jitter avoids synchronized retry waves. Graceful degradation preserves the critical product path.

- Caller deadline should shrink downstream
- Shed cheap and early
- Prefer static/history over total failure when safe

### Senior signal

Quantify the error budget and show the degradation ladder: full answer → smaller model → cached answer → queued job → explicit failure.

### Failure patterns to catch

- Setting 99.999% without cost justification
- Adding retries without deadline/concurrency limits
- Calling backups reliable without restore tests
- Failing the whole request because an optional dependency is slow

### Interview drill

**Prompt:** Make an AI chat service survive loss of its primary model provider and one availability zone.

**Constraints:** 99.95% chat submit · streaming · provider outage · AZ loss

<details>
<summary>Strong approach</summary>

Keep edge and orchestration multi-AZ, isolate provider pools, and enforce per-provider circuit breakers. Route to a tested fallback model with disclosed capability change; preserve conversation writes before inference. If no provider is healthy, queue only when UX supports it. Track SLOs separately for submit, TTFT, and completion.

</details>

### Knowledge checks

1. **A 99.99% monthly SLO allows roughly…**
   - A. 44 minutes
   - B. 4.4 minutes
   - C. 4.4 hours
   - D. 44 seconds

2. **RPO answers…**
   - A. How fast service returns
   - B. How much data loss is acceptable
   - C. How many replicas exist
   - D. Which API style to use

<details>
<summary>Answer key and explanations</summary>

1. **B — 4.4 minutes**  
   0.01% of roughly 43,800 minutes is about 4.38 minutes.

2. **B — How much data loss is acceptable**  
   Recovery Point Objective bounds acceptable data loss; RTO bounds recovery time.

</details>

### Visual and interaction briefs

- **Nines Budget — Availability calculator:** Convert 99.9 through 99.999 into monthly error budgets and multiply serial dependency availability. Tie each target to cost and architecture.
- **Degradation Ladder — Failure-path animation:** Fail the primary AI provider, then step through fallback model, cached response, queued work, and explicit failure while tracking quality and SLO impact.
- **Base mental-model animation:** Animate the Prevent → Detect → Contain → Recover flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 8: Observability & Operations

**Phase:** Production  
**Estimated time:** 3h  
**Depth:** Core

### Outcome

Design a system that can be understood, debugged, rolled out, and operated under pressure.

### Why this matters

A design is incomplete if no one can tell whether it works. Observability should reconstruct a user request, expose saturation, and guide action—not produce maximum telemetry.

### Coverage requirements

- **Metrics:** RED, USE, SLIs, SLOs, percentiles, cardinality.
- **Logs:** Structured events, correlation IDs, privacy and retention.
- **Tracing:** Causal paths, sampling, spans across queues.
- **Alerting:** Symptoms over causes, burn rate, actionable pages.
- **Operations:** Capacity, incidents, postmortems, distributed debugging.
- **Delivery:** Canary, blue-green, feature flags, progressive rollout.

### Mental model

Telemetry becomes useful when it connects user symptom to saturated resource or failing change.

**Base flow:** Observe (Metric + trace) → Localize (Service + tenant) → Mitigate (Flag + shed) → Learn (Postmortem + fix)

### Lesson 1: Measure from both directions

RED—rate, errors, duration—describes request-serving behavior. USE—utilization, saturation, errors—describes resources. Together they connect a user symptom like p99 latency to a cause like GPU queue saturation.

- Prefer histogram percentiles over averages
- Control high-cardinality labels
- Define SLI exactly at the user boundary

### Lesson 2: Reconstruct one request

Propagate a correlation or trace ID through services and asynchronous work. Structured logs make fields queryable; traces preserve causality. Sample intelligently and never log secrets or raw sensitive prompts by default.

- Carry context in message headers
- Record retry attempt and idempotency key
- Link model, prompt, tool, cost, and outcome

### Lesson 3: Rollouts are experiments with brakes

Canaries expose a small traffic slice, feature flags separate release from deployment, and blue-green gives fast environment rollback. Define health gates and automatic halt conditions before rollout.

- Alert on user symptoms and SLO burn
- Postmortems improve systems, not blame people
- Capacity plans need lead time for scarce resources

### Senior signal

For AI systems, correlate request ID, model/prompt version, retrieved documents, tool calls, token usage, latency stages, safety result, and user outcome—with privacy controls.

### Failure patterns to catch

- Alerting on every CPU spike instead of user impact
- Averages that hide tail latency
- Unbounded tenant IDs as metric labels
- Canarying without predefined stop conditions

### Interview drill

**Prompt:** Create the observability plan for a coding agent that runs up to 45 minutes and may call 200 tools.

**Constraints:** long-running · privacy · 200 calls · multiple retries

<details>
<summary>Strong approach</summary>

Give each run a trace with spans for planning, model calls, tools, tests, and checkpoints. Track success, wall time, queue time, tokens, tool errors, loop signals, and human interventions. Sample detailed artifacts behind access controls; keep aggregate metrics broad. Alert on stuck-run age and fleet-level success/burn, not one flaky tool call.

</details>

### Knowledge checks

1. **Which is a symptom alert?**
   - A. CPU is 82%
   - B. Checkout success SLO is burning rapidly
   - C. One pod restarted
   - D. Log volume rose

2. **Why avoid tenant_id as an unbounded metric label?**
   - A. It changes correctness
   - B. It creates cardinality and cost explosion
   - C. It disables tracing
   - D. It prevents retries

<details>
<summary>Answer key and explanations</summary>

1. **B — Checkout success SLO is burning rapidly**  
   It directly measures user-visible success and urgency.

2. **B — It creates cardinality and cost explosion**  
   Every unique label combination creates a time series, which can overwhelm metric systems.

</details>

### Visual and interaction briefs

- **Trace Waterfall — Interactive trace viewer:** Explore a slow request across edge, services, queue, model, and tools. Correlate RED symptoms with USE saturation and high-cardinality mistakes.
- **Canary Rollout — Traffic animation:** Move 1%, 5%, 25%, and 100% of traffic while error-budget burn changes. Let predefined health gates pause or roll back the deployment.
- **Base mental-model animation:** Animate the Observe → Localize → Mitigate → Learn flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 9: Security & Abuse Resistance

**Phase:** Production  
**Estimated time:** 3h  
**Depth:** Core

### Outcome

Threat-model identity, tenancy, data, and abuse as first-class architecture.

### Why this matters

Security answers are strongest when attached to trust boundaries and valuable assets. Public AI systems also face economic abuse: attackers can turn stolen credentials or automation into real compute cost.

### Coverage requirements

- **Identity:** Sessions, JWTs, OAuth, token rotation.
- **Authorization:** RBAC, ABAC, resource ownership, policy enforcement.
- **Protection:** TLS, encryption at rest, secrets and key management.
- **Tenancy:** Logical/physical isolation, noisy neighbors, scoped credentials.
- **Abuse:** Validation, rate limits, bot/fraud signals, cost ceilings.
- **Governance:** Audit logs, privacy, retention, deletion.

### Mental model

Authenticate the actor, authorize the action, constrain the effect, record the decision.

**Base flow:** Authenticate (Who are you?) → Authorize (May you do this?) → Constrain (Least privilege) → Audit (What happened?)

### Lesson 1: Draw trust boundaries

Mark browser, edge, application, tool sandbox, data plane, and external systems. Identify assets and attacker goals. Authentication establishes identity; authorization must still run at every protected resource boundary.

- Short-lived, scoped credentials limit blast radius
- JWT validation includes signature, issuer, audience, and expiry
- OAuth delegates access; it is not authorization policy by itself

### Lesson 2: Multi-tenancy is a data-flow property

Carry tenant identity from authenticated request through cache keys, queries, events, object paths, logs, and tools. Enforce policy server-side. High-risk workloads may need physical isolation beyond row filters.

- Default-deny resource access
- Avoid confused-deputy tool calls
- Partition quotas and concurrency per tenant

### Lesson 3: Abuse is reliability plus economics

Layer cheap controls before expensive work: input limits, identity reputation, token buckets, anomaly detection, and spend caps. Preserve headroom for trusted traffic and record appeal/recovery paths for false positives.

- Rate-limit by user, tenant, IP, and credential as appropriate
- Audit policy changes and privileged actions
- Minimize and expire sensitive data

### Senior signal

Walk one threat end-to-end: stolen API key → distributed requests → expensive inference. Show detection, budget reservation, cutoff, audit, and credential rotation.

### Failure patterns to catch

- Treating a valid JWT as permission for any object
- Forgetting tenant identity in cache or vector-search filters
- Logging prompts, secrets, or tool outputs indiscriminately
- One global rate limit that lets a noisy tenant starve others

### Interview drill

**Prompt:** Secure a multi-tenant coding-agent service that can execute shell commands against customer repositories.

**Constraints:** untrusted repos · network access · secrets · human approval

<details>
<summary>Strong approach</summary>

Use per-run ephemeral sandboxes and scoped repo credentials; default-deny network and filesystem reach. Separate model suggestions from privileged execution, require approval for high-impact operations, scrub secrets from context/logs, sign tool policies, bound time/CPU/spend, and keep an immutable audit trail.

</details>

### Knowledge checks

1. **Where must tenant identity appear?**
   - A. Only at login
   - B. Across every data and execution boundary
   - C. Only in the UI
   - D. Only in logs

2. **Best place for spend control?**
   - A. After inference completes
   - B. Before scarce work, with reservation/reconciliation
   - C. In client JavaScript only
   - D. In documentation

<details>
<summary>Answer key and explanations</summary>

1. **B — Across every data and execution boundary**  
   Losing tenant context in a cache, query, event, or tool can create cross-tenant access.

2. **B — Before scarce work, with reservation/reconciliation**  
   Admission-time reservation prevents overspend; later reconciliation charges actual usage.

</details>

### Visual and interaction briefs

- **Trust Boundary Map — Threat-model canvas:** Place identity, tenant, cache, queue, model, sandbox, secrets broker, and external tools. Highlight every boundary where authorization must be re-established.
- **Economic Abuse Path — Attack-path animation:** Follow a stolen key through distributed traffic into expensive inference; enable layered quotas, anomaly signals, reservations, spend caps, and credential rotation.
- **Base mental-model animation:** Animate the Authenticate → Authorize → Constrain → Audit flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 10: Multi-Region & Global Systems

**Phase:** Global scale  
**Estimated time:** 3h  
**Depth:** Deep

### Outcome

Balance latency, availability, residency, and conflict across regions.

### Why this matters

Multi-region is not ‘add another map pin.’ It introduces replication lag, split-brain risk, evacuation procedures, and product-visible conflict semantics.

### Coverage requirements

- **Routing:** Geo/latency routing, health, session affinity.
- **Placement:** Home region, data residency, sovereignty.
- **Replication:** Global databases, lag, read locality.
- **Writes:** Single-writer, multi-leader, active-active.
- **Conflict:** Last-write-wins, version vectors, domain merge.
- **Evacuation:** Failover, dependency mapping, capacity, disaster exercises.

### Mental model

Route users near compute while giving each mutable datum a clear write authority.

**Base flow:** Edge (Nearest healthy) → Home (Write authority) → Replicate (Async copies) → Evacuate (Capacity + replay)

### Lesson 1: Choose a write topology per domain

A home-region model gives a single authority and simple conflict behavior at the cost of remote write latency. Multi-leader improves local writes but forces merge semantics. Some data—preferences—merges naturally; other data—unique ownership—does not.

- Read replicas reduce latency but expose lag
- Session routing can preserve read-your-writes
- Keep control plane failure separate from data plane

### Lesson 2: Residency constrains architecture

Data residency can dictate storage and processing location, backup geography, and operator access. Make the policy explicit before global replication.

- Classify data before placing it
- Keep region-independent identifiers
- Know which dependencies are actually regional

### Lesson 3: Evacuation is a capacity event

Failover succeeds only if the destination has capacity, credentials, data, configuration, and tested runbooks. DNS/edge routing is the smallest part. Plan write fencing, backlog replay, and failback.

- Measure replication lag
- Exercise partial and full-region loss
- Prevent two regions from believing they are sole writer

### Senior signal

Frame global design as a product choice: “Conversation reads may tolerate seconds of lag; billing ledger ownership remains single-writer.”

### Failure patterns to catch

- Active-active without domain-specific conflict resolution
- Failover into a region with no spare capacity
- Ignoring data residency in backups and logs
- Assuming DNS change equals recovery

### Interview drill

**Prompt:** Design global conversation storage for users who travel, with EU residency and a 10-minute regional RTO.

**Constraints:** EU residency · mobile users · 10m RTO · ordered messages

<details>
<summary>Strong approach</summary>

Assign each workspace a compliant home region; route writes there and serve local replicas where policy permits. Use sequence IDs from the home writer and session tokens for read-your-writes. Pre-provision paired failover regions inside residency boundaries, fence the old writer, promote, and replay buffered writes before failback.

</details>

### Knowledge checks

1. **Which data is easiest for active-active writes?**
   - A. A unique username registry
   - B. An append-only reaction set with merge rules
   - C. A bank ledger balance
   - D. A singleton lease

2. **What often dominates region failover?**
   - A. Button color
   - B. Destination capacity and write authority
   - C. HTTP method names
   - D. Index naming

<details>
<summary>Answer key and explanations</summary>

1. **B — An append-only reaction set with merge rules**  
   Commutative/set-like data has natural convergence; uniqueness and balances require stronger coordination.

2. **B — Destination capacity and write authority**  
   Routing is easy compared with sufficient capacity, current data, and preventing dual writers.

</details>

### Visual and interaction briefs

- **Region Failure — Global topology simulator:** Toggle home-region, read replicas, active-passive, and active-active. Kill a region and expose replication lag, capacity, fencing, backlog, and failback concerns.
- **Conflict Workbench — Merge interaction:** Apply concurrent preference, username, reaction-set, and ledger updates. Ask which can merge and which requires coordinated ownership.
- **Base mental-model animation:** Animate the Edge → Home → Replicate → Evacuate flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 11: High-Scale Compute Systems

**Phase:** AI systems  
**Estimated time:** 4h  
**Depth:** Deep

### Outcome

Schedule heterogeneous compute fairly, efficiently, and predictably under scarcity.

### Why this matters

AI workloads make compute visible as a product constraint. GPUs are expensive, requests vary wildly, and utilization can conflict with latency and tenant fairness.

### Coverage requirements

- **Compute shape:** Stateless/stateful, horizontal scaling, online/batch.
- **Pools:** Workers, queues, placement, autoscaling.
- **Resources:** CPU, memory, network, accelerator bottlenecks.
- **Isolation:** Containers, quotas, preemption, noisy neighbors.
- **Scheduling:** GPU-aware placement, bin-packing, affinity.
- **Control:** Admission, fairness, priorities, cost-aware scheduling.

### Mental model

Admission and scheduling translate product priorities into scarce-resource placement.

**Base flow:** Admit (Budget + class) → Queue (Priority + fairness) → Place (Fit + locality) → Run (Observe + preempt)

### Lesson 1: Workload shape determines the pool

Online inference values low queue time and predictable latency. Batch training or embeddings can wait, fill troughs, and tolerate preemption. Separate pools or reservations prevent batch work from consuming interactive headroom.

- Stateless frontends scale cheaply
- Stateful workers need checkpoint and ownership semantics
- Autoscaling lag makes admission control essential

### Lesson 2: The bottleneck moves

A service may be GPU-compute bound during decode, memory-capacity bound by KV caches, CPU-bound during tokenization, or network-bound during distributed collectives. Measure per stage.

- Bin-pack without fragmenting scarce accelerator shapes
- Data/model locality reduces transfer cost
- Queue age exposes insufficient service rate

### Lesson 3: Fairness is explicit policy

FIFO can let one huge request block many small ones. Fair-share scheduling, tenant weights, size classes, and concurrency caps make service predictable. Cost-aware routing may choose a smaller model or batch path.

- Reserve capacity for critical traffic
- Preemption requires checkpoint or restart policy
- Charge/attribute shared resource cost

### Senior signal

Name the scheduling objective and its victim: maximizing GPU utilization can worsen interactive p99; reserve latency headroom deliberately.

### Failure patterns to catch

- Autoscaling as the only overload plan
- FIFO across highly variable jobs
- Tracking GPU utilization without queue latency
- Mixing batch and online workloads with no reservation

### Interview drill

**Prompt:** Design a shared GPU job scheduler for interactive inference, nightly embeddings, and fine-tuning.

**Constraints:** 3 workload classes · GPU scarcity · tenant fairness · preemption

<details>
<summary>Strong approach</summary>

Classify jobs by latency, duration, GPU shape, and preemptibility. Use separate queues with weighted fair share and reserved interactive capacity. Bin-pack by accelerator/memory, allow checkpointed batch preemption, expose queue estimates, and use admission/spend limits before accepting jobs.

</details>

### Knowledge checks

1. **Why can 100% accelerator utilization be unhealthy?**
   - A. It increases storage
   - B. No headroom remains for latency bursts
   - C. It disables TLS
   - D. It changes consistency

2. **Best protection from a tenant submitting giant jobs?**
   - A. Global FIFO
   - B. Per-tenant quotas and fair-share scheduling
   - C. Longer logs
   - D. More DNS records

<details>
<summary>Answer key and explanations</summary>

1. **B — No headroom remains for latency bursts**  
   Interactive workloads need headroom; saturated queues drive tail latency sharply upward.

2. **B — Per-tenant quotas and fair-share scheduling**  
   Admission and fair scheduling isolate demand and preserve access for others.

</details>

### Visual and interaction briefs

- **GPU Bin Packing — Scheduler game:** Place online inference, embeddings, and fine-tuning jobs onto heterogeneous GPUs. Score utilization, fragmentation, fairness, and interactive p99.
- **Utilization vs Latency — Interactive curve:** Increase fleet utilization toward 100% and show queueing/tail latency explode. Add reserved headroom, workload pools, and preemption.
- **Base mental-model animation:** Animate the Admit → Queue → Place → Run flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 12: AI / LLM–Flavored System Design

**Phase:** AI systems  
**Estimated time:** 5h  
**Depth:** Deep

### Outcome

Design an end-to-end AI service across streaming, GPUs, retrieval, tools, safety, cost, and evals.

### Why this matters

This is where both tracks meet. The model is one dependency inside a system that must schedule scarce work, stream partial outcomes, run untrusted tools, retrieve authorized context, and improve measurably.

### Coverage requirements

- **Inference path:** Streaming, prefill/decode, batching, GPU utilization, limits.
- **Routing:** Model selection, fallback, admission, tenant quotas.
- **Context:** Prompt budgets, embeddings, vector search, retrieval.
- **Agents:** Long tasks, tool execution, sandboxing, checkpoints.
- **Control:** Caching, cost budgets, safety/moderation.
- **Learning:** Evaluation, telemetry, feedback, regression gates.

### Mental model

An AI request is a controlled loop, not a single model call.

**Base flow:** Ground (Policy + context) → Generate (Route + stream) → Act (Tool sandbox) → Evaluate (Outcome + trace)

### Lesson 1: Separate planes and stages

The edge authenticates and reserves quota; orchestration assembles context and policy; the model gateway routes; inference workers batch and stream; tool runners execute behind isolation; telemetry and eval pipelines learn from outcomes.

- Track time-to-first-token separately from total time
- Cancel work when the client disconnects
- Keep authorization attached to retrieved context and tools

### Lesson 2: Optimize tokens as the core resource

Input tokens consume prefill compute and KV memory; output tokens consume sequential decode time. Prefix caching, continuous batching, smaller context, and model routing change both latency and cost.

- Batch compatible work without excessive waiting
- Budget context among instructions, history, retrieval, and tool results
- Cache only when privacy and semantic equivalence are clear

### Lesson 3: Bound probabilistic behavior

Wrap model decisions in deterministic checks: schemas, policies, permission gates, time/cost budgets, loop detection, and idempotent tools. Evals test end-to-end outcomes, not only prose quality.

- Fallback quality change must be product-visible when material
- Moderation has input/output/tool surfaces
- Telemetry needs model and prompt versions

### Senior signal

Always draw the non-model control loop: authenticate → reserve budget → retrieve with ACLs → invoke → validate → act with least privilege → evaluate.

### Failure patterns to catch

- Treating the model API as the entire architecture
- Retrying model/tool calls without tracking duplicate effects
- Ignoring cancellation after streaming begins
- Using vector similarity as authorization

### Interview drill

**Prompt:** Design a multi-tenant coding-agent backend that can run for an hour, edit repositories, and recover from worker loss.

**Constraints:** 1h tasks · repo tools · GPU scarce · worker loss

<details>
<summary>Strong approach</summary>

Persist a run state machine and append-only action log. Schedule model calls through a quota-aware gateway and execute tools in ephemeral sandboxes with scoped credentials. Checkpoint repository state and compact conversation history. Resume from the last committed checkpoint, deduplicate tool actions, gate risky operations, and evaluate task/test outcomes.

</details>

### Knowledge checks

1. **Which metric isolates queue + prefill responsiveness?**
   - A. Total tokens
   - B. Time to first token
   - C. Daily users
   - D. Object count

2. **Where should retrieval authorization be enforced?**
   - A. After generation
   - B. Before and during retrieval with document ACL filters
   - C. By asking the model politely
   - D. Only in the browser

<details>
<summary>Answer key and explanations</summary>

1. **B — Time to first token**  
   TTFT captures admission, queueing, routing, and prefill before the first streamed output.

2. **B — Before and during retrieval with document ACL filters**  
   Similarity is not permission; unauthorized text must never enter model context.

</details>

### Visual and interaction briefs

- **AI Request Flight Recorder — Animated end-to-end pipeline:** Trace authenticate, quota reserve, retrieve with ACLs, route, prefill, decode/stream, tools, validation, billing, and eval logging.
- **Context Budget Allocator — Stacked-budget lab:** Allocate tokens among policy, history, retrieved chunks, tool results, and output headroom; show TTFT, KV memory, cost, and likely retrieval loss.
- **Base mental-model animation:** Animate the Ground → Generate → Act → Evaluate flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 13: Common Interview Design Problems

**Phase:** Interview mode  
**Estimated time:** 6h  
**Depth:** Studio

### Outcome

Recognize reusable design shapes without forcing memorized solutions.

### Why this matters

Problems differ, but their hard parts repeat: fan-out, ordering, large blobs, prefix lookup, leases, idempotency, collaboration, and scarce compute. Build a pattern library, not answer scripts.

### Coverage requirements

- **Content:** URL shortener, file storage, search/autocomplete, feed.
- **Communication:** Chat, notifications, collaborative editor.
- **Infrastructure:** Metrics/logging, scheduler, cache, gateway, flags.
- **Transactions:** Payment-like workflows and ledgers.
- **AI products:** LLM chat, coding agent, inference API, RAG search.

### Mental model

Classify the dominant shape, then reuse mechanisms with new invariants.

**Base flow:** Classify (Fan-out? order?) → Choose (Pattern + store) → Prove (Invariant + scale) → Stress (Failure + abuse)

### Lesson 1: Map prompts to dominant difficulty

Feeds are fan-out and ranking. Chat is ordered low-latency delivery plus offline sync. File storage is metadata plus immutable blobs. Autocomplete is prefix retrieval under a tight latency budget. Payments are ledgers and idempotent state transitions.

- Name the hardest invariant
- Name the hottest path
- Name the acceptable degradation

### Lesson 2: Infrastructure prompts need operators

Schedulers, caches, gateways, metrics systems, and feature flags are judged through control/data plane separation, propagation behavior, tenant isolation, and operational safety.

- Configuration rollout needs versions and rollback
- Control plane outage should not always stop data plane
- Think about cardinality and noisy neighbors

### Lesson 3: AI prompts combine familiar patterns

LLM chat adds expensive streaming compute to messaging. Coding agents add long-running job orchestration and sandboxed tools. RAG adds search indexing, ACLs, and grounded generation. Inference APIs add admission and GPU scheduling.

- Reuse known primitives; emphasize new failure modes
- Separate model quality from system reliability
- Close with evals and cost

### Senior signal

Begin by saying what family the prompt belongs to and which two hard parts you will prioritize. That establishes a crisp interview agenda.

### Failure patterns to catch

- Memorizing one canonical architecture
- Giving every prompt the same cache/queue/CDN stack
- Skipping product semantics to discuss scale
- Practicing only the high-level diagram

### Interview drill

**Prompt:** Shuffle the drill deck and complete three 40-minute designs this week: one content, one infrastructure, and one AI-native system.

**Constraints:** 3 mocks · 40 min each · record yourself · score rubric

<details>
<summary>Strong approach</summary>

For each: spend 5 minutes on contract/scale, 8 on high-level design, 7 on data/APIs, 12 on the hardest path, and 8 on failure/security/ops. Review for explicit tradeoffs, not box count. Re-do the weakest deep dive 48 hours later.

</details>

### Knowledge checks

1. **Dominant hard part in collaborative editing?**
   - A. Image compression
   - B. Concurrent operation merge and convergence
   - C. Cold storage
   - D. Email deliverability

2. **Dominant hard part in payment-like design?**
   - A. Animated UI
   - B. Idempotent ledger-backed state transitions
   - C. CDN images
   - D. Autocomplete

<details>
<summary>Answer key and explanations</summary>

1. **B — Concurrent operation merge and convergence**  
   Multiple writers must see a coherent shared document despite concurrency and disconnects.

2. **B — Idempotent ledger-backed state transitions**  
   Financial correctness requires immutable accounting and safe retries.

</details>

### Visual and interaction briefs

- **Problem Pattern Matrix — Interactive matrix:** Rows are common prompts; columns are dominant hard parts such as ordering, fan-out, large blobs, prefix search, leases, ledgers, retrieval, and scarce compute.
- **Prompt Roulette — Randomized practice tool:** Draw a design problem, scale card, failure card, and security card; start a 50-minute timer and reveal a rubric only after completion.
- **Base mental-model animation:** Animate the Classify → Choose → Prove → Stress flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 14: Deep-Dive Tradeoff Drills

**Phase:** Interview mode  
**Estimated time:** 4h  
**Depth:** Studio

### Outcome

Compare alternatives with a repeatable, evidence-based decision frame.

### Why this matters

Interviewers often push with ‘why not X?’ The goal is neither loyalty nor instant reversal. Define the decision dimensions, compare, choose for current constraints, and name the trigger that would change your mind.

### Coverage requirements

- **Data:** SQL/NoSQL, shard/replicate, strong/eventual.
- **Flow:** Queue/stream, push/pull, sync/async.
- **Computation:** Precompute/on-demand, stateful/stateless.
- **Transport:** Polling/WebSockets/SSE.
- **Topology:** Single/multi-region.
- **Strategy:** Build/buy, simplicity/scalability.

### Mental model

A strong tradeoff answer ends with a choice and a reversal trigger.

**Base flow:** Criteria (What matters?) → Compare (Benefits + costs) → Choose (For this workload) → Trigger (When to revisit)

### Lesson 1: Use the FACT frame

Frame constraints, Alternatives, Consequences, Take a position. Compare on the few dimensions that matter: correctness, latency, scale, complexity, cost, and organizational fit.

- Reject false binaries; hybrids are valid when justified
- Do not hide operational cost
- Say which requirement dominates

### Lesson 2: Optimize for the current horizon

The simplest architecture that meets projected scale is usually strongest. Preserve seams for growth, but do not pay distributed-system costs before they buy something.

- Scale estimates define the horizon
- Operational familiarity is a valid factor
- Migration triggers make simplicity credible

### Lesson 3: Defend without rigidity

When challenged, restate the changed assumption and update the choice. A revised design is good reasoning, not failure. Keep the invariant stable even if mechanism changes.

- Ask what constraint the interviewer is changing
- Separate preference from requirement
- Name the downside of your own choice first

### Senior signal

Answer ‘why X?’ in 45 seconds: criteria, 2 alternatives, decision, drawback, trigger. Concision signals command.

### Failure patterns to catch

- Feature-list comparisons with no decision
- Claiming one technology is always better
- Ignoring team/operational complexity
- Refusing to revise when constraints change

### Interview drill

**Prompt:** Complete ten 60-second tradeoff rounds. Record each and cut any answer that exceeds 90 seconds.

**Constraints:** 10 rounds · 60 sec each · explicit choice · reversal trigger

<details>
<summary>Strong approach</summary>

Use: ‘The deciding constraints are __. X gives __ but costs __; Y gives __ but costs __. I choose X because __. If __ changes, I would switch.’ Include SQL/NoSQL, SSE/WebSocket, sync/async, single/multi-region, and build/buy.

</details>

### Knowledge checks

1. **What makes a tradeoff answer complete?**
   - A. A longer feature list
   - B. A contextual choice plus drawback and reversal trigger
   - C. Naming the newest database
   - D. Avoiding commitment

2. **When challenged, first…**
   - A. Defend harder
   - B. Identify which assumption changed
   - C. Add three services
   - D. Change everything

<details>
<summary>Answer key and explanations</summary>

1. **B — A contextual choice plus drawback and reversal trigger**  
   The interviewer needs your decision process and ability to adapt, not trivia.

2. **B — Identify which assumption changed**  
   A challenge often introduces a new constraint; make it explicit before revising.

</details>

### Visual and interaction briefs

- **FACT Tradeoff Cards — Timed comparison drill:** Present SQL/NoSQL, queue/stream, SSE/WebSockets, and single/multi-region. Require criteria, choice, drawback, and reversal trigger in 60 seconds.
- **Decision Frontier — Two-axis explorer:** Move latency, correctness, complexity, and cost weights to show why no technology is universally best.
- **Base mental-model animation:** Animate the Criteria → Compare → Choose → Trigger flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 15: Interview Execution Framework

**Phase:** Interview mode  
**Estimated time:** 4h  
**Depth:** Capstone

### Outcome

Run a clear 45–60 minute design interview and recover gracefully when pushed.

### Why this matters

Excellent knowledge can disappear inside an unstructured interview. A time-boxed narrative lets the interviewer steer, exposes judgment, and ensures you reach bottlenecks, failure, and operations.

### Coverage requirements

- **Opening:** Clarify, scale, critical constraints in five minutes.
- **Core:** High-level design, APIs, data model, request flows.
- **Depth:** Bottlenecks, failure, security, observability, cost.
- **Interaction:** Invite steering, defend decisions, revise openly.
- **Recovery:** Surface a flaw, protect invariants, migrate the design.
- **Seniority:** Reason in product outcomes and ownership boundaries.

### Mental model

Time-box the breadth, earn the deep dive, and close the loop.

**Base flow:** 0–5 (Contract + scale) → 5–15 (Skeleton + API) → 15–40 (Critical deep dive) → 40–50 (Failure + close)

### Lesson 1: Drive a shared agenda

Restate the problem, ask architecture-changing questions, state assumptions, estimate scale, and propose the two areas worth deeper attention. Tell the interviewer how you plan to spend time and invite correction.

- Keep a visible requirements/SLO list
- Use named arrows and numbered request flows
- Pause for steering at phase boundaries

### Lesson 2: Narrate decisions, not drawing

Instead of ‘then add Redis,’ say ‘reads outnumber writes 100:1 and allow 30 seconds of staleness, so a regional cache removes primary load; here is invalidation and failure behavior.’

- Mechanism follows constraint
- Every component gets an owner and failure mode
- Revisit estimates at bottlenecks

### Lesson 3: Recover like a senior engineer

When a flaw appears, acknowledge it precisely, preserve the product invariant, and change the smallest necessary part. Explain migration or reconciliation if data/state already exists.

- Do not erase the whole design reflexively
- State what remains valid
- Close with risks, metrics, and next experiment

### Senior signal

Treat the interview as a design review with a colleague. Use decisive language, expose uncertainty honestly, and make it easy for them to push you deeper.

### Failure patterns to catch

- Talking continuously without checkpoints
- Spending half the session on requirements
- Narrating boxes rather than decisions
- Hiding or hand-waving a discovered flaw

### Interview drill

**Prompt:** Run a full 50-minute mock: design a public, abuse-resistant AI inference API. Use the built-in scorecard afterward.

**Constraints:** 50 min · whiteboard · recorded · self-score

<details>
<summary>Strong approach</summary>

0–5 contract/scale; 5–12 API and high-level path; 12–20 quota/admission; 20–32 scheduling/streaming; 32–40 failure/fallback; 40–47 security/observability/cost; 47–50 recap. Score clarity, correctness, depth, tradeoffs, and recovery from 1–4.

</details>

### Knowledge checks

1. **Best response after discovering a flaw?**
   - A. Hide it
   - B. Name impact, preserve invariant, revise the smallest boundary
   - C. Restart silently
   - D. Blame the prompt

2. **Senior-level narration focuses on…**
   - A. Component names
   - B. Constraints, ownership, failure, and tradeoffs
   - C. Memorized definitions
   - D. Drawing speed

<details>
<summary>Answer key and explanations</summary>

1. **B — Name impact, preserve invariant, revise the smallest boundary**  
   Transparent, bounded correction demonstrates strong engineering judgment.

2. **B — Constraints, ownership, failure, and tradeoffs**  
   A design is a set of decisions under constraints, not a catalog of infrastructure.

</details>

### Visual and interaction briefs

- **Interview Timeline — Guided 50-minute workspace:** Phase the session into contract, skeleton, deep dive, failure/security, and recap. Provide subtle time warnings without scripting the answer.
- **Mock Scorecard — Rubric + notes:** Score framing, correctness, depth, tradeoffs, and recovery from 1–4; persist one piece of evidence and one next drill per dimension.
- **Base mental-model animation:** Animate the 0–5 → 5–15 → 15–40 → 40–50 flow one step at a time, with pause/replay and a static text alternative.

---

# Course 2: LLM Engineering for Software Engineers

**Scope:** 21 chapters · approximately 39 hours

Understand modern LLM systems deeply enough to build, debug, evaluate, and defend them—without becoming an ML researcher.

## Chapter 1: Mental Model of Modern LLMs

**Phase:** Foundations  
**Estimated time:** 2h  
**Depth:** Core

### Outcome

Explain what an LLM does, why generation varies, and why hallucination is a natural failure mode.

### Why this matters

You need a crisp first-principles model that supports engineering decisions. The model predicts a distribution over the next token; useful behavior emerges from training, context, post-training, and sampling—not a database lookup of answers.

### Coverage requirements

- **Representation:** Tokens, tokenization, context windows.
- **Objective:** Next-token probability distributions.
- **Sampling:** Temperature, top-p, determinism and seeds.
- **Failure:** Hallucination, ambiguity, missing knowledge.
- **Scale:** Why larger/capable models behave differently.
- **Lifecycle:** Training vs inference.

### Mental model

Generation repeatedly turns context into a distribution, samples, appends, and repeats.

**Base flow:** Tokenize (Text → IDs) → Predict (P(next token)) → Sample (Policy chooses) → Append (Context grows)

### Lesson 1: A model predicts continuations

Tokenization maps text into discrete IDs. Given prior tokens, the network produces logits that become a probability distribution. A decoding policy chooses the next token, appends it, and repeats.

- Tokens are not exactly words
- Context is the model's active input—not permanent memory
- Output length adds sequential latency

### Lesson 2: Sampling shapes behavior

Lower temperature sharpens relative probabilities; top-p restricts candidates to a high-probability nucleus. Greedy decoding can be repeatable, but infrastructure and model changes may still affect outputs. Determinism is a spectrum.

- Temperature does not add knowledge
- Sampling diversity can improve brainstorming and hurt exact extraction
- Schema constraints bound form, not factual truth

### Lesson 3: Hallucination follows the objective

The training objective rewards plausible next tokens, not an internal truth database. When evidence is absent, conflicting, or weak, fluent completion can outrun grounding. Retrieval, tools, abstention, and evals reduce risk at the system level.

- Confidence language is not calibrated probability
- Capability scales unevenly across tasks
- Training changes parameters; inference applies them

### Senior signal

Explain this without anthropomorphism: “It computes a context-conditioned distribution and generates under a decoding policy; truthfulness is a learned behavior we still verify.”

### Failure patterns to catch

- Saying the model searches its training data
- Equating context length with reliable use of every token
- Assuming temperature zero proves identical output
- Treating hallucination as a rare bug removable by one prompt

### Interview drill

**Prompt:** Give a two-minute whiteboard explanation of an LLM to a backend engineer, then explain one product consequence.

**Constraints:** 2 min · no equations required · one failure mode · one mitigation

<details>
<summary>Strong approach</summary>

Define tokens and next-token distributions, show the autoregressive loop, separate training from inference, then connect hallucination to grounding and verification. Avoid claims about consciousness, intent, or literal lookup.

</details>

### Knowledge checks

1. **Temperature primarily changes…**
   - A. The model's knowledge
   - B. The shape of the sampling distribution
   - C. The context-window size
   - D. The tokenizer vocabulary

2. **Why can an LLM hallucinate?**
   - A. It always uses a broken database
   - B. Plausible continuation and factual truth are different objectives
   - C. Tokens are encrypted
   - D. GPUs cannot multiply

<details>
<summary>Answer key and explanations</summary>

1. **B — The shape of the sampling distribution**  
   It rescales logits before sampling, changing relative randomness rather than adding information.

2. **B — Plausible continuation and factual truth are different objectives**  
   The learned next-token objective can produce fluent content without sufficient grounding.

</details>

### Visual and interaction briefs

- **Next-Token Playground — Sampling visualization:** Show a live probability distribution over candidate next tokens. Let temperature and top-p change the distribution while the generated sentence grows token by token.
- **Tokenization Lens — Text inspector:** Type text and visualize token boundaries, IDs, counts, and cost/context implications. Include code, whitespace, punctuation, and non-English examples.
- **Base mental-model animation:** Animate the Tokenize → Predict → Sample → Append flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 2: Transformer Fundamentals

**Phase:** Foundations  
**Estimated time:** 3h  
**Depth:** Core

### Outcome

Explain attention and the transformer stack intuitively, including long-context cost.

### Why this matters

You do not need to derive gradients, but you should be able to trace information through embeddings, attention, feed-forward blocks, residuals, and causal masking.

### Coverage requirements

- **Inputs:** Token embeddings and positional information.
- **Attention:** Queries, keys, values, similarity weights.
- **Capacity:** Multi-head attention and feed-forward layers.
- **Stability:** Residual connections and layer normalization.
- **Generation:** Causal masking and stacked blocks.
- **Scaling:** Why naive attention grows quadratically with sequence length.

### Mental model

Each token reads a weighted mixture of earlier token information, then transforms it locally.

**Base flow:** Embed (Token + position) → Attend (Q·K weights V) → Transform (Feed-forward) → Repeat (Residual stack)

### Lesson 1: Attention is content-addressed mixing

Each position creates a query describing what it seeks, keys describing what positions offer, and values containing information to mix. Query–key similarity becomes weights over values.

- Causal masks block future positions
- Multiple heads learn different interaction patterns
- Attention moves information; it is not a symbolic database query

### Lesson 2: The block has two major jobs

Attention combines information across positions; the feed-forward network transforms each position independently. Residual paths preserve and refine representations, while normalization stabilizes computation.

- Depth composes many small transformations
- Position is required because attention alone is permutation-insensitive
- Outputs become logits over vocabulary

### Lesson 3: Long context has real systems cost

A dense attention map compares many token pairs, so prefill work and memory rise quickly with sequence length. During decoding, a KV cache avoids recomputing past keys and values but consumes accelerator memory.

- Long capacity does not guarantee perfect retrieval
- Context selection remains an application concern
- Architecture optimizations can change the exact scaling constants

### Senior signal

Use an example: in ‘the animal didn't cross the street because it was tired,’ one head can weight earlier tokens to refine what ‘it’ represents.

### Failure patterns to catch

- Calling attention literal human attention
- Saying every head has a known interpretable role
- Forgetting causal masking in autoregressive generation
- Claiming context windows are free storage

### Interview drill

**Prompt:** Explain queries, keys, and values using a search-within-a-meeting analogy, then state where the analogy fails.

**Constraints:** 3 min · draw 4 tokens · show weights · name limitation

<details>
<summary>Strong approach</summary>

Each current token emits a query; each prior token advertises a key and carries a value. Similarity weights decide the mixture. The analogy fails because learned vector operations are distributed and repeated across many heads/layers, not discrete document lookup.

</details>

### Knowledge checks

1. **What prevents an autoregressive token from reading future tokens?**
   - A. Layer normalization
   - B. Causal masking
   - C. Tokenization
   - D. Top-p

2. **Attention's core operation produces…**
   - A. A weighted mix of value vectors
   - B. A SQL row
   - C. A fixed class label
   - D. A network socket

<details>
<summary>Answer key and explanations</summary>

1. **B — Causal masking**  
   The mask removes future positions from the attention distribution.

2. **A — A weighted mix of value vectors**  
   Query–key scores weight the values that are aggregated for a position.

</details>

### Visual and interaction briefs

- **Attention Head Explorer — Interactive matrix:** Choose a query token and view illustrative query-key weights over prior tokens. Switch between reference, syntax, and recency-style heads, clearly labeling the example as pedagogical.
- **Transformer Block — Step-through animation:** Advance through embeddings plus position, masked attention, residual/normalization, feed-forward, second residual, and stacked layers.
- **Base mental-model animation:** Animate the Embed → Attend → Transform → Repeat flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 3: How Models Are Trained

**Phase:** Foundations  
**Estimated time:** 3h  
**Depth:** Fluency

### Outcome

Describe pretraining, post-training, synthetic data, and evaluation without drifting into researcher-only detail.

### Why this matters

Training knowledge lets you reason about behavior and limits: what pretraining teaches, what post-training steers, how data quality matters, and why benchmarks can mislead.

### Coverage requirements

- **Pretraining:** Datasets, next-token objective, scaling laws.
- **Post-training:** SFT, preference optimization, RLHF, reasoning-oriented RL.
- **Data:** Synthetic data, filtering, quality vs quantity.
- **Compression:** Distillation and teacher–student transfer.
- **Measurement:** Model evals, contamination, overfitting.
- **Optimization risk:** Reward hacking and specification gaps.

### Mental model

Capability is learned broadly, behavior is shaped, then measured—and the loop repeats.

**Base flow:** Pretrain (Broad prediction) → Post-train (Behavior + preference) → Evaluate (Capabilities + safety) → Iterate (Data + objective)

### Lesson 1: Pretraining builds general capability

Large corpora and the next-token objective push a model to learn statistical structure of language, code, and domains. Scaling compute, data, and parameters often improves loss predictably, but data quality and architecture matter.

- Training corpus is filtered and mixed
- Memorization and generalization can coexist
- Cutoff and coverage are product constraints

### Lesson 2: Post-training shapes interaction

Supervised examples demonstrate target behavior. Preference methods favor outputs people or graders prefer. RL-style optimization can reinforce reasoning or tool-use behavior but inherits reward-model imperfections.

- Post-training cannot guarantee truth
- Helpful and safe behavior can trade off
- Reward hacking exploits the measured proxy

### Lesson 3: Evaluation guards the loop

Holdouts, capability suites, safety tests, and human judgments reveal different dimensions. Contamination inflates results when test material appears in training. Synthetic data can scale rare behaviors but amplify teacher biases.

- Distillation transfers behavior to smaller models
- Evaluate distribution shifts
- Inspect slices, not only one aggregate score

### Senior signal

Stay at the systems boundary: know enough to connect training choices to serving, evaluation, and product behavior; say when optimizer-level detail is outside your role.

### Failure patterns to catch

- Equating post-training with adding facts
- Treating one benchmark as general intelligence
- Assuming synthetic data is independent evidence
- Ignoring contamination and reward gaming

### Interview drill

**Prompt:** A model's benchmark score rose but production task success fell. Produce five hypotheses and a test for each.

**Constraints:** 5 hypotheses · measurable tests · no retraining first · production slices

<details>
<summary>Strong approach</summary>

Check benchmark contamination, traffic distribution shift, prompt/template changes, metric mismatch, and serving/model configuration differences. Reproduce on logged cases, stratify by task, compare models pairwise, and calibrate automated graders with human review.

</details>

### Knowledge checks

1. **What does SFT primarily provide?**
   - A. Demonstrations of desired behavior
   - B. More GPU memory
   - C. A vector database
   - D. Guaranteed factuality

2. **Reward hacking means…**
   - A. GPUs are stolen
   - B. The model optimizes the proxy without achieving the true goal
   - C. Tokens become longer
   - D. Training always fails

<details>
<summary>Answer key and explanations</summary>

1. **A — Demonstrations of desired behavior**  
   Supervised fine-tuning trains on curated input/output examples.

2. **B — The model optimizes the proxy without achieving the true goal**  
   Any imperfect reward can be satisfied in unintended ways.

</details>

### Visual and interaction briefs

- **Training Pipeline — Layered process map:** Follow broad data through filtering, pretraining, SFT, preference optimization, reasoning-oriented RL, safety tests, and release evaluation.
- **Reward Hacking Lab — Specification game:** Give a proxy metric and let the learner predict how a model might satisfy it without meeting the real objective; then improve the evaluation.
- **Base mental-model animation:** Animate the Pretrain → Post-train → Evaluate → Iterate flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 4: Inference & Serving

**Phase:** Serving  
**Estimated time:** 4h  
**Depth:** Deep

### Outcome

Trace an API request through prefill, decode, KV cache, batching, parallelism, and scheduling.

### Why this matters

Inference is a scheduling and memory problem wrapped around matrix computation. Understanding stage-specific costs lets you explain latency, throughput, and why serving infrastructure is hard.

### Coverage requirements

- **Stages:** Request queue, prefill, decode, streaming.
- **Metrics:** TTFT, inter-token latency, tokens/sec.
- **Batching:** Static and continuous batching.
- **Memory:** Weights, activations, KV cache, quantization.
- **Parallelism:** Tensor and pipeline parallelism.
- **Acceleration:** Speculative decoding, prefix caching, request scheduling.
- **Tradeoff:** Cost, latency, throughput, quality.

### Mental model

Input-heavy prefill and sequential decode stress different resources.

**Base flow:** Queue (Admit + batch) → Prefill (Process prompt) → Decode (One token/step) → Stream (Cancel + account)

### Lesson 1: Prefill and decode are different

Prefill processes the prompt in parallel and creates KV state; it drives time to first token and grows with input length. Decode generates sequentially and drives inter-token latency and total completion time.

- Large prompts compete for memory and prefill capacity
- Long outputs occupy decode slots
- Track latency by stage and token count

### Lesson 2: KV cache is the serving currency

Caching prior keys/values avoids recomputing the entire sequence on every output token, but memory grows with batch size and sequence length. Memory pressure limits concurrency even when raw compute remains.

- Quantization reduces weight memory and may affect quality/speed
- Prefix caching reuses shared prompt work
- Eviction policy changes latency predictability

### Lesson 3: Scheduling creates the frontier

Continuous batching admits new requests as others finish, improving utilization. Tensor parallelism splits operations across devices; pipeline parallelism splits layers/stages. Speculative decoding uses a faster draft path that the target verifies.

- Batching improves throughput but may add queue delay
- Parallelism adds communication overhead
- Route by workload shape and SLO

### Senior signal

Draw two latency bars: TTFT = admission + queue + prefill; completion = TTFT + decode steps. Then show which optimization attacks each part.

### Failure patterns to catch

- Using tokens/sec as the only user-experience metric
- Calling batching free throughput
- Ignoring KV memory in concurrency estimates
- Assuming quantization only affects file size

### Interview drill

**Prompt:** A model service has good average latency but p99 TTFT spikes when long prompts arrive. Diagnose and redesign scheduling.

**Constraints:** mixed prompt lengths · p99 TTFT · fixed GPU fleet · streaming

<details>
<summary>Strong approach</summary>

Break latency into queue and prefill. Introduce size-aware queues or prefill chunking, bound huge contexts, reserve capacity for short interactive traffic, and enforce tenant fairness. Monitor queued tokens and KV occupancy, not only request count.

</details>

### Knowledge checks

1. **What most directly determines TTFT?**
   - A. Only output length
   - B. Admission, queueing, and prefill
   - C. Database backups
   - D. Number of users total

2. **Why is decode hard to parallelize across time?**
   - A. Each next token depends on prior generated tokens
   - B. GPUs lack memory
   - C. HTTP forbids it
   - D. Tokenizers are random

<details>
<summary>Answer key and explanations</summary>

1. **B — Admission, queueing, and prefill**  
   The first token arrives after the request is admitted, scheduled, and its prompt is processed.

2. **A — Each next token depends on prior generated tokens**  
   Autoregressive dependence makes output steps sequential.

</details>

### Visual and interaction briefs

- **Prefill vs Decode — Animated latency timeline:** Vary input and output tokens; separately display queue time, prefill/TTFT, sequential decode, inter-token latency, and total completion time.
- **KV Cache Calculator — Memory simulator:** Change batch size, sequence length, precision, and model dimensions to see concurrency pressure and why memory can bind before raw compute.
- **Base mental-model animation:** Animate the Queue → Prefill → Decode → Stream flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 5: Prompting as Software Engineering

**Phase:** Application core  
**Estimated time:** 3h  
**Depth:** Core

### Outcome

Treat prompts as versioned specifications with schemas, tests, and explicit trust boundaries.

### Why this matters

Good prompting is requirements engineering for a probabilistic component. It improves when instructions, context, examples, output contracts, and evaluation are managed like code.

### Coverage requirements

- **Authority:** System/developer/user instruction hierarchy.
- **Specification:** Clear tasks, constraints, context, examples.
- **Contracts:** Structured outputs and schema constraints.
- **Operations:** Templates, versioning, testing, telemetry.
- **Security:** Prompt injection and untrusted content.
- **Limits:** When code, retrieval, tools, or fine-tuning is the better lever.

### Mental model

A production prompt is a tested contract surrounded by trusted code.

**Base flow:** Specify (Goal + constraints) → Ground (Context + examples) → Constrain (Schema + checks) → Evaluate (Cases + regressions)

### Lesson 1: Write the acceptance criteria

Define task, audience, inputs, constraints, and output shape. Put stable application policy in higher-authority instructions, user intent in user input, and label untrusted retrieved text as data.

- Examples resolve ambiguity but consume context
- Delimit data from instructions
- State what to do when information is missing

### Lesson 2: Constrain interfaces

Schema-constrained generation reduces parsing errors and turns free-form output into a typed boundary. Validate again in code; a valid shape can still contain incorrect or unauthorized content.

- Keep schemas minimal and explicit
- Retry only bounded, repairable failures
- Prefer deterministic calculation outside the model

### Lesson 3: Version and evaluate

Store prompt/model/tool/schema versions with outcomes. Build golden and adversarial cases before broad rollout. When prompt complexity becomes a brittle decision tree, move logic into code, retrieval, or purpose-built tools.

- Change one variable when possible
- Score task success, not eloquence
- Use production failures to expand evals

### Senior signal

Use prompts for semantic judgment; use code for permissions, arithmetic, state transitions, and invariants.

### Failure patterns to catch

- Mixing trusted policy with retrieved/user text
- Assuming valid JSON means correct result
- Piling exceptions into an untestable mega-prompt
- Changing model and prompt together without comparison

### Interview drill

**Prompt:** Turn a vague ‘summarize support ticket’ prompt into a production contract for routing and urgency.

**Constraints:** JSON schema · unknown category · PII · eval set

<details>
<summary>Strong approach</summary>

Define category enum, urgency rubric, evidence spans, confidence/abstain behavior, and PII handling. Provide boundary examples. Validate schema and permissions in code, log versioned outcomes, and evaluate category slices plus adversarial instructions inside ticket text.

</details>

### Knowledge checks

1. **Structured output guarantees…**
   - A. Truth
   - B. Shape/schema compliance within supported constraints
   - C. Authorization
   - D. Zero latency

2. **Which belongs in deterministic code?**
   - A. Tone classification
   - B. Final permission enforcement
   - C. Semantic summarization
   - D. Intent detection

<details>
<summary>Answer key and explanations</summary>

1. **B — Shape/schema compliance within supported constraints**  
   A structurally valid answer can still be factually wrong or unsafe.

2. **B — Final permission enforcement**  
   Authorization is an invariant and must not depend on probabilistic text generation.

</details>

### Visual and interaction briefs

- **Prompt Diff Lab — A/B prompt workbench:** Compare two prompt versions across a small golden set. Show schema validity, task score, cost, and latency rather than presenting a single magical prompt.
- **Instruction Stack — Trust-layer diagram:** Visually separate application policy, user intent, retrieved untrusted text, and tool results; simulate an injection crossing the wrong boundary.
- **Base mental-model animation:** Animate the Specify → Ground → Constrain → Evaluate flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 6: Tool Use & Function Calling

**Phase:** Application core  
**Estimated time:** 3h  
**Depth:** Core

### Outcome

Build a safe tool lifecycle from schema exposure through validated execution and grounded continuation.

### Why this matters

Tools convert language decisions into real effects. The model proposes a call; your system owns availability, validation, authorization, execution, retries, and the result that returns to context.

### Coverage requirements

- **Interface:** Tool descriptions, schemas, argument generation.
- **Lifecycle:** Select, call, validate, execute, return, continue.
- **Composition:** Multiple calls, parallel vs sequential dependencies.
- **Failure:** Timeouts, retries, partial results, tool selection.
- **Security:** Permissioning, least privilege, trusted results.
- **Autonomy:** Approval gates and dangerous actions.

### Mental model

The model proposes; deterministic infrastructure authorizes and executes.

**Base flow:** Expose (Relevant schema) → Propose (Name + args) → Authorize (Validate + approve) → Execute (Result + audit)

### Lesson 1: Schema quality drives tool quality

Names and descriptions should distinguish when tools apply; argument schemas should make invalid states difficult. Expose only relevant tools to reduce confusion and prompt footprint.

- Validate types and business rules server-side
- Never let tool descriptions grant permission
- Use stable call IDs for tracing and deduplication

### Lesson 2: Parallelism follows dependencies

Independent reads can run concurrently; a call that needs an earlier result must wait. Your orchestrator should express dependency edges, set deadlines, aggregate errors, and return compact results.

- Parallel writes can conflict
- Tool results are still untrusted data
- Bound result size before reinserting into context

### Lesson 3: Side effects need control

Classify tools by risk. Reads may auto-run under policy; reversible writes may need preview; destructive or external actions may require explicit human approval. Use scoped credentials and sandboxing.

- Retry reads more freely than non-idempotent writes
- Return explicit errors, not invented substitutes
- Audit actor, arguments, policy, result, and effect

### Senior signal

Say exactly where authority lives: the model has semantic discretion; the executor has security authority.

### Failure patterns to catch

- Executing model arguments without validation
- Retrying a timed-out write with a new operation ID
- Treating tool output as trusted instructions
- Exposing every tool on every turn

### Interview drill

**Prompt:** Design tool execution for an assistant that can search orders, refund purchases, and send email.

**Constraints:** PII · money movement · email side effects · timeouts

<details>
<summary>Strong approach</summary>

Separate read and write tools, use scoped identity, validate order ownership, preview refund/email, and require approval for material effects. Use idempotency keys for refund/send, log audit records, cap retries, and return explicit unknown-outcome status after ambiguous timeouts.

</details>

### Knowledge checks

1. **Who should make the final authorization decision?**
   - A. The model
   - B. Deterministic policy at execution
   - C. The user prompt alone
   - D. The tokenizer

2. **Parallel tool calls are safest when…**
   - A. They are independent and read-only or non-conflicting
   - B. They all write the same record
   - C. Order is essential
   - D. The model says ‘parallel’

<details>
<summary>Answer key and explanations</summary>

1. **B — Deterministic policy at execution**  
   The executor has trusted identity, policy, and resource state.

2. **A — They are independent and read-only or non-conflicting**  
   Dependencies and write conflicts require sequencing.

</details>

### Visual and interaction briefs

- **Tool Lifecycle — State-machine animation:** Expose schema, model proposal, validation, authorization, approval, execution, result compaction, and continuation. Inject timeouts and duplicate calls.
- **Parallelism Planner — Dependency graph interaction:** Arrange tool calls into a DAG and decide which reads can run concurrently and which writes must sequence.
- **Base mental-model animation:** Animate the Expose → Propose → Authorize → Execute flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 7: Agents

**Phase:** Application core  
**Estimated time:** 4h  
**Depth:** Deep

### Outcome

Design bounded model–action–observation loops with state, checkpoints, approvals, and failure recovery.

### Why this matters

An agent is useful when the path cannot be completely specified in advance but progress can be observed and actions can be bounded. It is not a synonym for any LLM call.

### Coverage requirements

- **Loop:** Model → action → observation → replan.
- **State:** Working memory, durable run state, artifacts.
- **Horizon:** Long tasks, checkpoints, resumability.
- **Control:** Human approval, permissions, budgets.
- **Failure:** Retries, recovery, loop detection, dead ends.
- **Architecture:** Single/multi-agent, delegation, deterministic workflows.

### Mental model

A robust agent loop advances durable state under budgets and policy.

**Base flow:** Observe (State + goal) → Plan (Next bounded step) → Act (Tool under policy) → Check (Progress + stop)

### Lesson 1: Use agents for uncertain paths

If a fixed DAG can express the workflow, use it: it is cheaper, easier to test, and more predictable. Use an agent when new observations change the next action and semantic judgment is central.

- Keep deterministic outer orchestration
- Define completion evidence
- Give the model the smallest useful action space

### Lesson 2: State outlives context

Persist task state, tool results, artifacts, approvals, and checkpoints outside the prompt. Summarize or retrieve relevant history into context. A worker crash should not erase the run.

- Use explicit state machines for lifecycle
- Commit checkpoints after durable effects
- Separate user memory from task scratch state

### Lesson 3: Every loop needs a budget and stop rule

Limit wall time, tokens, cost, calls, repeated actions, and privileges. Detect non-progress, oscillation, and duplicate calls. Escalate to a human or return a partial result with evidence.

- Approval pauses are durable states
- Replanning follows changed observations
- Multiple agents add coordination and context cost

### Senior signal

Define the agent's success condition and maximum autonomy before describing the planner.

### Failure patterns to catch

- Using an agent for a fixed three-step API workflow
- Keeping all state only in prompt history
- No non-progress or cost limit
- Multi-agent design with no independent work or ownership boundaries

### Interview drill

**Prompt:** Design a web research agent that may run 30 minutes and produce a cited report.

**Constraints:** 30 min · web tools · citations · partial success

<details>
<summary>Strong approach</summary>

Persist a research plan, claims, source records, and checkpoints. Search in bounded branches, deduplicate sources, validate citation-to-claim coverage, and track budget/non-progress. Treat pages as untrusted data, require stronger evidence for high-stakes claims, and finish with either a coverage-checked report or explicit gaps.

</details>

### Knowledge checks

1. **When is a deterministic workflow preferable?**
   - A. When steps and transitions are known
   - B. Whenever an LLM is available
   - C. Only for arithmetic
   - D. Never

2. **What should survive worker loss?**
   - A. Only the original prompt
   - B. Durable run state, effects, artifacts, and checkpoints
   - C. GPU memory
   - D. A WebSocket only

<details>
<summary>Answer key and explanations</summary>

1. **A — When steps and transitions are known**  
   Known workflows gain reliability and observability from explicit control flow.

2. **B — Durable run state, effects, artifacts, and checkpoints**  
   Long-running tasks require external state to resume safely.

</details>

### Visual and interaction briefs

- **Agent Loop Console — Step-through simulator:** Show goal, state, plan, action, observation, and replan. Add token/time/tool budgets and detect oscillation or repeated non-progress.
- **Workflow or Agent? — Sorting exercise:** Classify tasks as deterministic workflows, model steps inside workflows, or bounded agents; explain what uncertainty requires adaptive planning.
- **Base mental-model animation:** Animate the Observe → Plan → Act → Check flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 8: Retrieval-Augmented Generation

**Phase:** Knowledge systems  
**Estimated time:** 4h  
**Depth:** Core

### Outcome

Build and evaluate a permission-aware retrieval pipeline from ingestion through grounded output.

### Why this matters

RAG injects external evidence into model context. Its quality ceiling is usually retrieval: if the right evidence is missing, buried, stale, or unauthorized, generation cannot reliably repair it.

### Coverage requirements

- **Ingestion:** Parsing, normalization, chunking, metadata.
- **Retrieval:** Embeddings, vector search, lexical search, filters.
- **Ranking:** Hybrid fusion, reranking, diversity.
- **Assembly:** Context budget, ordering, citations.
- **Freshness:** Updates, deletion, index lag.
- **Security:** Document-level permissions and tenant isolation.
- **Failure:** Bad/missing/excess/conflicting context.
- **Evaluation:** Recall, ranking, answer grounding.

### Mental model

RAG is a search system feeding an evidence-constrained generation system.

**Base flow:** Ingest (Parse + chunk) → Retrieve (Hybrid + ACL) → Rerank (Relevance + diversity) → Generate (Cite + abstain)

### Lesson 1: Chunk for the question shape

Chunks should be coherent enough to answer likely questions and small enough to rank precisely. Preserve headings, source location, timestamps, and permissions. Consider hierarchical parent/child retrieval for long documents.

- Overlap repairs boundary loss but creates duplicates
- Tables and code need structure-aware parsing
- Index updates and deletes need lifecycle tracking

### Lesson 2: Hybrid retrieval covers different failure modes

Lexical search excels at exact identifiers and rare terms; semantic search covers paraphrase and concept similarity. Metadata filters enforce scope; rerankers spend more compute on a small candidate set.

- Vector similarity is not authority
- Diversify near-duplicate chunks
- Tune candidate count separately from final context count

### Lesson 3: Evaluate retrieval before prose

Build queries with known relevant evidence. Measure recall@k and ranking, then evaluate citation support, answer completeness, and abstention. Inspect missing-context and conflicting-source slices.

- Too much context can distract and raise cost
- Prefer recent/authoritative sources via metadata
- Make evidence visible to users when useful

### Senior signal

In an interview, separate retrieval recall, context precision, and generation faithfulness. Each needs different fixes.

### Failure patterns to catch

- Using only vector similarity for product codes
- Adding more chunks whenever answers fail
- Filtering permissions after generation
- Measuring only final answer vibes

### Interview drill

**Prompt:** Design enterprise RAG over 100M documents with per-document ACLs and 5-minute freshness.

**Constraints:** 100M docs · ACLs · 5m freshness · citations

<details>
<summary>Strong approach</summary>

Stream document changes into parse/chunk/embed/index stages with versioned tombstones. Query with tenant and ACL filters before scoring, fuse lexical/vector candidates, rerank, and assemble diverse evidence. Store source/version IDs for citations and trace retrieval. Evaluate recall/freshness/security slices independently.

</details>

### Knowledge checks

1. **Why combine lexical and semantic retrieval?**
   - A. To double cost only
   - B. They cover exact-term and paraphrase failure modes
   - C. To remove permissions
   - D. To guarantee truth

2. **What should be measured before answer style?**
   - A. Retrieval recall and ranking
   - B. Button clicks
   - C. GPU temperature only
   - D. Font size

<details>
<summary>Answer key and explanations</summary>

1. **B — They cover exact-term and paraphrase failure modes**  
   Identifiers favor lexical matching; semantic similarity captures varied wording.

2. **A — Retrieval recall and ranking**  
   Generation cannot cite evidence that retrieval never supplied.

</details>

### Visual and interaction briefs

- **RAG Pipeline Explorer — End-to-end interactive:** Adjust chunking, hybrid weights, metadata/ACL filters, candidate count, reranking, context count, and freshness. Show recall, precision, cost, and groundedness.
- **Retrieval Failure Lab — Ranked result inspector:** Use exact identifiers, paraphrases, stale documents, permission conflicts, and duplicate chunks to demonstrate lexical/vector strengths and common failures.
- **Base mental-model animation:** Animate the Ingest → Retrieve → Rerank → Generate flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 9: Embeddings

**Phase:** Knowledge systems  
**Estimated time:** 2h  
**Depth:** Core

### Outcome

Reason about embedding applications, distance metrics, indexing, and approximation tradeoffs.

### Why this matters

Embeddings map inputs into vectors where geometric proximity can reflect learned similarity. They enable retrieval and grouping, but the geometry is task- and model-dependent—not universal meaning.

### Coverage requirements

- **Representation:** Semantic vector spaces and model dependence.
- **Metrics:** Cosine similarity, dot product, Euclidean distance.
- **Applications:** Search, clustering, classification, recommendations, deduplication.
- **Scale:** Dimensionality, exact search, approximate nearest neighbors.
- **Indexes:** Graph, inverted/product-quantized intuition.
- **Quality:** Thresholds, hard negatives, drift, evaluation.

### Mental model

Embed query and candidates into one space, retrieve neighbors, then apply task constraints.

**Base flow:** Encode (Input → vector) → Index (Organize space) → Compare (Distance/similarity) → Filter (Task + metadata)

### Lesson 1: Similarity depends on geometry

Cosine compares direction, dot product includes magnitude, and Euclidean measures straight-line distance. If vectors are normalized, cosine and dot-product ranking align. Use the metric expected by the embedding/index setup.

- Thresholds are dataset-specific
- Nearest does not mean correct
- Domain language can shift neighborhoods

### Lesson 2: ANN trades exactness for speed

Scanning every vector is simple but expensive at large N. Approximate nearest-neighbor indexes prune the search space, trading memory, build/update cost, and some recall for latency.

- Tune recall vs latency empirically
- Filter strategy affects index performance
- Deletes and model upgrades require lifecycle plans

### Lesson 3: Embeddings are reusable features

Beyond search, vectors support clustering, nearest-neighbor classification, recommendations, anomaly hints, and duplicate detection. For final decisions, combine them with labels, rules, and evaluation.

- Use hard negatives that look deceptively similar
- Version embedding model with the index
- Re-embed or dual-index during migrations

### Senior signal

State the metric and normalization assumption; then name the target recall/latency curve you would measure.

### Failure patterns to catch

- Treating similarity score as calibrated probability
- Changing embedding model without rebuilding/comparing the index
- Using one global threshold for every domain
- Assuming approximate search returns the true nearest neighbors

### Interview drill

**Prompt:** Choose an embedding and indexing plan for 200M code symbols used by a coding assistant.

**Constraints:** 200M vectors · code + prose queries · frequent updates · 50ms retrieval

<details>
<summary>Strong approach</summary>

Evaluate candidate embeddings on real code queries and hard negatives. Use an ANN index with language/repo filters, measure recall@k under 50ms, version vectors by model, and stream updates/tombstones. Hybridize with lexical symbol matching for exact names.

</details>

### Knowledge checks

1. **With normalized vectors, cosine ranking matches…**
   - A. Dot-product ranking
   - B. Random ranking
   - C. Document age
   - D. Token count

2. **ANN primarily trades…**
   - A. Some recall for lower latency/scale
   - B. Security for cost
   - C. Tokens for images
   - D. Training for prompting

<details>
<summary>Answer key and explanations</summary>

1. **A — Dot-product ranking**  
   When norms are equal, dot product is proportional to cosine similarity.

2. **A — Some recall for lower latency/scale**  
   Approximation avoids exhaustive comparisons but can miss exact neighbors.

</details>

### Visual and interaction briefs

- **Embedding Space — 2D projection:** Plot semantically related and misleadingly similar items; toggle cosine, dot product, and Euclidean distance with a warning that the projection is illustrative.
- **ANN Frontier — Recall/latency chart:** Move index search parameters and filters to trade exact-neighbor recall for latency and memory.
- **Base mental-model animation:** Animate the Encode → Index → Compare → Filter flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 10: Context & Memory

**Phase:** Knowledge systems  
**Estimated time:** 3h  
**Depth:** Core

### Outcome

Allocate context and design safe memory that remains relevant, fresh, and user-controlled.

### Why this matters

Context is scarce working space; memory is a product subsystem that selects what to put there. More history can increase cost and distract the model while making stale assumptions feel authoritative.

### Coverage requirements

- **Working context:** Window limits, instruction/history/tool budgets.
- **Compression:** Summaries, compaction, lossy state.
- **Retrieval memory:** Store, embed, rank, inject.
- **State:** Session state vs durable preferences/facts.
- **Quality:** Relevance, freshness, contradiction, context rot.
- **Privacy:** Consent, visibility, deletion, sensitive inference.

### Mental model

Memory is a write policy plus a retrieval policy, both under user control.

**Base flow:** Observe (Candidate fact) → Decide (Worth storing?) → Retrieve (Relevant now?) → Reconcile (Fresh + permitted?)

### Lesson 1: Budget the window

Allocate space among policy, task instructions, current user input, recent turns, retrieved knowledge, tool results, and output headroom. Truncate by semantics, not raw oldest-first token count.

- Keep critical instructions stable and visible
- Summaries lose detail and can encode mistakes
- Large tool results should be compacted or referenced

### Lesson 2: Memory is selective persistence

Separate ephemeral task state, conversation summaries, explicit preferences, and inferred facts. Store provenance, timestamp, confidence, sensitivity, and scope. Retrieve by relevance plus recency and policy.

- Do not store everything said
- Let users inspect/correct/delete durable memory
- Avoid carrying preferences across incompatible contexts

### Lesson 3: Reconcile contradictions

New information can supersede old, sources can disagree, and summaries can drift. Use versions and provenance, prefer explicit recent user statements, and ask when conflicts materially affect action.

- Context rot is quality degradation, not only overflow
- Compression checkpoints need validation
- Sensitive memory deserves stricter defaults

### Senior signal

Treat memory as data product with consent, provenance, and evaluation—not a bigger prompt buffer.

### Failure patterns to catch

- Persisting every utterance
- Injecting all memories into every turn
- No user correction/deletion mechanism
- Summarizing away permissions or unresolved decisions

### Interview drill

**Prompt:** Design persistent user memory for a general assistant that works across health, travel, and work contexts.

**Constraints:** cross-domain · sensitive facts · user control · context budget

<details>
<summary>Strong approach</summary>

Create scoped memory types with explicit/implicit provenance, sensitivity labels, TTL/review policy, and user controls. Gate cross-domain retrieval, rank by relevance and recency, surface material assumptions, and evaluate false recall, missed recall, contradiction handling, and deletion completeness.

</details>

### Knowledge checks

1. **What makes a memory safe to inject?**
   - A. It is old
   - B. It is relevant, permitted, fresh enough, and provenance-aware
   - C. It is long
   - D. It was generated by a model

2. **Why can more context hurt?**
   - A. It always changes the tokenizer
   - B. Irrelevant/stale material distracts and raises cost
   - C. GPUs reject text
   - D. It removes sampling

<details>
<summary>Answer key and explanations</summary>

1. **B — It is relevant, permitted, fresh enough, and provenance-aware**  
   Memory selection is a contextual authorization and quality decision.

2. **B — Irrelevant/stale material distracts and raises cost**  
   Attention and reasoning can be diluted by noisy context, and prefill cost rises.

</details>

### Visual and interaction briefs

- **Context Packing — Token-budget puzzle:** Drag policy, recent history, summaries, retrieved evidence, memories, and tool results into a fixed window; expose loss, cost, and output-headroom tradeoffs.
- **Memory Gate — Decision flow:** Decide whether a user statement should be stored, its scope/sensitivity/TTL/provenance, and whether it should be retrieved in a later scenario.
- **Base mental-model animation:** Animate the Observe → Decide → Retrieve → Reconcile flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 11: Evaluation

**Phase:** Production AI  
**Estimated time:** 4h  
**Depth:** Core

### Outcome

Build an eval-driven development loop across datasets, graders, human calibration, and online outcomes.

### Why this matters

Traditional unit tests still protect deterministic code; evals measure variable behavior and distributions. The key is a task-specific definition of success that stays connected to real user outcomes.

### Coverage requirements

- **Datasets:** Golden cases, production samples, adversarial and slice coverage.
- **Judgment:** Human evaluation, model-as-judge, pairwise comparison.
- **Metrics:** Factuality, relevance, instruction following, safety, tool correctness.
- **Regression:** Prompt/model/tool changes and release gates.
- **Online:** A/B tests, feedback, business outcomes.
- **Integrity:** Leakage, grader bias, calibration, drift.

### Mental model

Production failures become cases; cases guide changes; changes earn rollout through gates.

**Base flow:** Define (Task success) → Collect (Representative cases) → Grade (Calibrated signals) → Ship (Gate + monitor)

### Lesson 1: Start from failure taxonomy

Define what can go wrong—wrong answer, unsupported claim, missed tool, unsafe action, bad refusal—and build cases for each. Include easy, hard, boundary, adversarial, and real production examples.

- Keep development and holdout sets separate
- Version data and grading rubrics
- Stratify results by meaningful slice

### Lesson 2: Graders need evaluation too

Exact checks fit schemas and known answers; code graders fit executable properties; model judges fit nuanced comparisons. Calibrate automated graders against blinded human labels and inspect disagreement.

- Pairwise is often easier than absolute scoring
- Avoid judging style when correctness matters
- Use multiple signals for high-stakes gates

### Lesson 3: Close the online loop

Offline improvement may not improve user outcomes. Canary and A/B test meaningful changes, observe latency/cost/safety, and mine failures back into the suite without contaminating the holdout.

- Log model, prompt, retrieval, and tool versions
- Watch Goodhart effects
- Re-evaluate when traffic shifts

### Senior signal

Say: “I would not ship from a single aggregate score. I need the regression slices, cost/latency delta, and human-calibrated grader agreement.”

### Failure patterns to catch

- Vibe-based testing
- A tiny curated set with no production distribution
- Uncalibrated model-as-judge as sole truth
- Optimizing a leaked or repeatedly tuned holdout

### Interview drill

**Prompt:** Create an eval plan for an AI marketing-copy builder used by internal teams.

**Constraints:** brand voice · factual claims · structured fields · human feedback

<details>
<summary>Strong approach</summary>

Define schema validity, brief adherence, unsupported claims, brand/risk rules, and edit-distance-to-accepted outcome. Sample real briefs across campaigns, add adversarial content, calibrate pairwise judges with marketers, and gate regressions by slice plus latency/cost. Feed accepted edits back as new cases—not automatic labels.

</details>

### Knowledge checks

1. **Best first eval question?**
   - A. Which judge model?
   - B. What exact task success and failure mean
   - C. Which chart color?
   - D. How many GPUs?

2. **Why calibrate model judges?**
   - A. They can carry bias and disagree with humans
   - B. They cannot output text
   - C. It reduces context size
   - D. It guarantees zero cost

<details>
<summary>Answer key and explanations</summary>

1. **B — What exact task success and failure mean**  
   The objective determines data and graders; tools come afterward.

2. **A — They can carry bias and disagree with humans**  
   Automated judgments are themselves model outputs and need agreement checks.

</details>

### Visual and interaction briefs

- **Eval Workbench — Dataset + grader explorer:** Slice cases by task and failure type, compare prompt/model variants, inspect aggregate-versus-slice regressions, and reveal grader/human disagreement.
- **Judge Calibration — Confusion matrix interaction:** Adjust a model-judge threshold against human labels and watch precision, recall, agreement, and launch decisions change.
- **Base mental-model animation:** Animate the Define → Collect → Grade → Ship flow one step at a time, with pause/replay and a static text alternative.

### Living references

- [Evaluation best practices — OpenAI provider example](https://developers.openai.com/api/docs/guides/evaluation-best-practices)

---

## Chapter 12: Reliability & Failure Modes

**Phase:** Production AI  
**Estimated time:** 3h  
**Depth:** Core

### Outcome

Wrap probabilistic and upstream failures in deterministic recovery and safe degradation.

### Why this matters

AI applications add model variability, invalid outputs, context overflow, retrieval misses, tool errors, loops, and provider limits to ordinary distributed-system failure.

### Coverage requirements

- **Model:** Hallucination, nondeterminism, instruction conflicts.
- **Interface:** Invalid schema, tool hallucination, context overflow.
- **Agent:** Loops, non-progress, duplicate side effects.
- **Knowledge:** Retrieval misses, stale/conflicting context.
- **Provider:** Rate limits, timeouts, outages.
- **Recovery:** Retries, fallback, routing, degradation, guardrails.

### Mental model

Classify the failure before choosing retry, repair, fallback, abstain, or human review.

**Base flow:** Detect (Typed failure) → Contain (Budget + cancel) → Recover (Repair or route) → Record (Case + metric)

### Lesson 1: Different failures need different responses

Transient transport errors may retry; invalid structured output may use constrained repair; a missing document needs retrieval fallback; unsafe or low-confidence high-impact output may require abstention or review.

- Do not retry deterministic bad inputs
- Preserve one operation ID across retries
- Bound total attempts inside deadline/cost

### Lesson 2: Fallback is a product decision

A smaller or different model can change quality, tool support, context, or safety behavior. Validate compatibility and disclose material degradation. Sometimes a queued or explicit failure is safer than silent fallback.

- Circuit-break unhealthy routes
- Hedge only when cost and duplicate effects are controlled
- Test fallback paths continuously

### Lesson 3: Guardrails surround, not replace, the model

Validate schemas, permissions, tool arguments, token budgets, citation requirements, and state transitions in code. Track unknown outcomes after timeouts and reconcile durable effects.

- Cancellation must propagate to model and tools
- Use resumable checkpoints for long tasks
- Turn every incident into an eval case

### Senior signal

Produce a failure matrix: failure → detection → user impact → automatic action → audit/metric. It shows operational maturity fast.

### Failure patterns to catch

- Retrying every failure
- Silent downgrade to an incompatible model
- Assuming schema validity equals semantic validity
- No reconciliation for ambiguous tool timeouts

### Interview drill

**Prompt:** Design the failure policy for a customer-support agent that reads accounts and can issue credits.

**Constraints:** money effect · rate limits · model outage · partial streams

<details>
<summary>Strong approach</summary>

Separate read/generate/write stages. Retry safe reads, route generation through a tested fallback, and never repeat credit issuance without the same idempotency key. Require approval or strict policy for credits, preserve an audit record, and tell the user when outcome is unknown. Reconcile later by operation ID.

</details>

### Knowledge checks

1. **When should a model outage silently fall back?**
   - A. Always
   - B. Only when capability, policy, and product semantics are tested compatible
   - C. Never under any condition
   - D. When logs are disabled

2. **Best response to an ambiguous timed-out write?**
   - A. Retry with new ID
   - B. Query/reconcile using the same operation ID
   - C. Assume failure
   - D. Ignore it

<details>
<summary>Answer key and explanations</summary>

1. **B — Only when capability, policy, and product semantics are tested compatible**  
   Fallback may materially change correctness or safety; compatibility is an explicit contract.

2. **B — Query/reconcile using the same operation ID**  
   The side effect may have committed; stable identity lets the system learn the outcome safely.

</details>

### Visual and interaction briefs

- **Failure Matrix — Interactive table:** Select hallucination, invalid schema, retrieval miss, tool timeout, provider outage, rate limit, context overflow, or loop; map each to detect, contain, recover, and record.
- **Fallback Graph — Routing simulator:** Fail a model route and compare silent fallback, disclosed downgrade, queued work, abstention, and hard failure across quality, safety, cost, and latency.
- **Base mental-model animation:** Animate the Detect → Contain → Recover → Record flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 13: Safety & Security

**Phase:** Production AI  
**Estimated time:** 4h  
**Depth:** Deep

### Outcome

Threat-model model inputs, retrieved content, tools, data, and autonomy with defense in depth.

### Why this matters

AI security combines traditional application controls with a new interpreter: untrusted language can influence model decisions. Prompt injection is a trust-boundary problem, not a string-filter problem.

### Coverage requirements

- **Adversarial input:** Prompt injection and jailbreaks.
- **Data:** Exfiltration, sensitive handling, user-generated content.
- **Actions:** Tool abuse, confused deputy, least privilege.
- **Isolation:** Sandboxing, network/filesystem policy.
- **Content:** Moderation and risk-specific policy.
- **Governance:** Human approval, trusted/untrusted provenance, defense in depth.

### Mental model

Untrusted text may inform a decision; it must not grant authority.

**Base flow:** Label (Trust + provenance) → Limit (Context + tools) → Authorize (Deterministic policy) → Contain (Sandbox + audit)

### Lesson 1: Prompt injection crosses channels

A webpage, document, email, or code comment can contain instructions aimed at the model. Delimit and label it as data, minimize what is retrieved, and never let content modify permissions or reveal hidden instructions.

- Instruction hierarchy helps but is not a complete boundary
- Treat tool output as untrusted
- Do not put secrets in model-visible context unless required

### Lesson 2: Least privilege limits model mistakes

Give each run scoped credentials, tools, paths, network destinations, time, and spend. Re-authorize at execution using trusted identity and current state. Sandbox untrusted code and block cross-tenant access.

- Separate planning from execution
- Preview and approve high-impact actions
- Make irreversible actions rare and explicit

### Lesson 3: Layer controls and measure bypass

Combine input validation, retrieval ACLs, model policy, output checks, tool authorization, sandboxing, rate limits, monitoring, and incident response. Red-team realistic end-to-end flows.

- Moderation is one layer, not the architecture
- Log security decisions without leaking sensitive content
- Test attacks after model or tool changes

### Senior signal

Phrase the invariant: “No model-visible string can increase its authority; only trusted policy can.”

### Failure patterns to catch

- Trying to regex away all prompt injection
- Giving broad production credentials to a sandbox
- Trusting retrieved documents because they are internal
- Using human approval as a vague checkbox instead of a specific effect preview

### Interview drill

**Prompt:** Threat-model a browser agent that can log into sites, download files, and fill forms.

**Constraints:** hostile pages · credentials · downloads · external writes

<details>
<summary>Strong approach</summary>

Keep credentials in an isolated broker, not page/model context; allowlist tool capabilities and destinations; scan and quarantine downloads; treat page text as untrusted; require explicit previews/approval for consequential submissions; cap sessions and retain audit evidence. Test indirect injections that ask the agent to exfiltrate data.

</details>

### Knowledge checks

1. **Can prompt text ever grant a new permission?**
   - A. Yes, if persuasive
   - B. No; trusted deterministic policy grants permissions
   - C. Yes, if from a PDF
   - D. Only at temperature zero

2. **Why sandbox tool execution?**
   - A. To make text prettier
   - B. To contain mistakes or hostile code within bounded resources
   - C. To improve tokenization
   - D. To replace authorization

<details>
<summary>Answer key and explanations</summary>

1. **B — No; trusted deterministic policy grants permissions**  
   Authority must come from authenticated policy, never untrusted language.

2. **B — To contain mistakes or hostile code within bounded resources**  
   Sandboxing limits blast radius but remains one defense layer.

</details>

### Visual and interaction briefs

- **Injection Attack Path — Red-team simulator:** A hostile webpage or document attempts to reveal data or expand authority. Learners place provenance labels, retrieval limits, policy checks, approval, and sandbox controls.
- **Autonomy Risk Ladder — Scenario sorter:** Order actions from read-only retrieval through reversible drafts to money movement and destructive changes; assign permissions and approval boundaries.
- **Base mental-model animation:** Animate the Label → Limit → Authorize → Contain flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 14: Building LLM Products

**Phase:** Product systems  
**Estimated time:** 3h  
**Depth:** Core

### Outcome

Choose models and UX patterns across intelligence, latency, cost, streaming, feedback, and failure.

### Why this matters

An AI feature succeeds as a product, not a demo. Users experience waiting, uncertainty, corrections, citations, and partial failure—not benchmark scores in isolation.

### Coverage requirements

- **Selection:** Model intelligence, latency, cost, modality, tool support.
- **Routing:** Task/risk-based routes and fallbacks.
- **UX:** Streaming, conversation state, citations, explainability.
- **Jobs:** Async/background work and progress.
- **Control:** Guardrails, rate limits, cost budgets.
- **Learning:** Feedback, observability, product metrics.

### Mental model

Match model effort and user experience to task value, risk, and time horizon.

**Base flow:** Classify (Task + risk) → Route (Model + tools) → Experience (Stream or async) → Learn (Feedback + eval)

### Lesson 1: Choose on a measured frontier

Compare candidates on your task dataset across quality, latency, token cost, tool correctness, context, and operational limits. Route simple/low-risk work cheaply and escalate hard or high-value cases.

- Model families evolve; isolate provider-specific details
- Cache and shorten context before indiscriminate downgrades
- Budget cost per successful outcome

### Lesson 2: Design uncertainty into UX

Stream when partial text is useful; use progress/checkpoints for long jobs; expose citations and editable outputs where verification matters. Provide cancel, retry, and recovery without duplicate effects.

- Do not stream irreversible decisions
- Preserve partial artifacts
- Make fallbacks and limitations legible

### Lesson 3: Feedback needs interpretation

Thumbs signals are sparse and biased. Pair them with edits, task completion, abandon rates, escalation, latency, and qualitative review. Turn recurrent failures into eval cases.

- Optimize user outcome, not answer length
- Watch quality by segment
- Include safety and cost in launch gates

### Senior signal

Frame model choice as an empirical product decision: task distribution × acceptable failure × latency/cost budget.

### Failure patterns to catch

- Choosing the biggest model by default
- Streaming without cancellation semantics
- Treating thumbs-up as ground truth
- Hiding fallback-induced capability changes

### Interview drill

**Prompt:** Design the product experience for an AI code review assistant on pull requests.

**Constraints:** developer trust · 10-min deep review · false positives · cost budget

<details>
<summary>Strong approach</summary>

Run cheap deterministic checks immediately, stream only stable findings, and make deep semantic review an async job with progress. Cite exact code and rationale, let developers resolve/feedback, route complex diffs to stronger models, and evaluate accepted findings, misses, noise, latency, and cost per useful finding.

</details>

### Knowledge checks

1. **Best model-selection metric?**
   - A. Largest parameter count
   - B. Cost/latency/quality on the real task distribution
   - C. Most recent release name
   - D. Longest output

2. **Useful feedback signal beyond thumbs?**
   - A. Whether users accept, edit, complete, or escalate
   - B. Screen brightness
   - C. Token ID parity
   - D. DNS TTL

<details>
<summary>Answer key and explanations</summary>

1. **B — Cost/latency/quality on the real task distribution**  
   Production choice is a measured multi-objective frontier.

2. **A — Whether users accept, edit, complete, or escalate**  
   Behavioral outcomes are often closer to task value.

</details>

### Visual and interaction briefs

- **Model Routing Frontier — Quality/latency/cost plot:** Plot model candidates using task-specific eval data; adjust task value and risk to see routing and escalation policies change.
- **Streaming UX Timeline — Prototype interaction:** Compare immediate stream, buffered verified output, and async job progress. Include cancel, partial artifact, retry, and fallback states.
- **Base mental-model animation:** Animate the Classify → Route → Experience → Learn flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 15: LLM Application Architectures

**Phase:** Product systems  
**Estimated time:** 3h  
**Depth:** Patterns

### Outcome

Select the smallest architecture pattern that fits the task and autonomy level.

### Why this matters

Most LLM products fit a small set of shapes. Recognizing them keeps designs simple and helps you identify where determinism, retrieval, tools, and approval belong.

### Coverage requirements

- **Direct:** Simple chat, classification, structured extraction.
- **Grounded:** Search + RAG and citation workflows.
- **Assistive:** Coding, support, research, and data-analysis assistants.
- **Interactive:** Browser/computer-use agents.
- **Workflow:** Automation and multi-step business processes.
- **Autonomy:** Deterministic, approval-gated, bounded autonomous.

### Mental model

Add complexity only when the task needs new information, actions, or adaptive planning.

**Base flow:** Generate (One response) → Retrieve (External knowledge) → Tool (Deterministic action) → Agent (Adaptive loop)

### Lesson 1: Start at the left

Classification or extraction often needs one constrained model call. Add retrieval when knowledge is external/fresh, tools when deterministic capability or action is needed, and an agent loop only when the path adapts to observations.

- Batch offline work when latency is loose
- Use schemas at machine interfaces
- Keep final effects deterministic and authorized

### Lesson 2: Architecture follows verification

A research system needs citation coverage; a coding assistant needs tests/diffs; support needs account and policy checks; data analysis needs executable computation and artifact inspection.

- Design evidence of completion
- Capture intermediate artifacts
- Choose approval around consequence, not buzzwords

### Lesson 3: Workflow engines and agents can coexist

An explicit workflow can call a model inside known steps and hand a bounded subproblem to an agent. This hybrid often gives flexibility without surrendering control.

- State transitions stay durable
- Agent receives scoped goal and tools
- Workflow owns retries, deadlines, and compensation

### Senior signal

For any AI prompt, say which of four levels applies: generate, retrieve, tool, or agent—and why the simpler previous level is insufficient.

### Failure patterns to catch

- Calling every multi-step workflow an agent
- Using RAG when the missing need is a calculator/API
- Giving autonomous writes where draft-and-approve works
- No evidence-based completion check

### Interview drill

**Prompt:** Classify and sketch architectures for invoice extraction, policy Q&A, refund support, and web research.

**Constraints:** 4 systems · 5 min each · smallest pattern · verification

<details>
<summary>Strong approach</summary>

Invoice: schema extraction + validation. Policy Q&A: ACL-aware RAG + citations. Refund: workflow + read tools + gated idempotent write. Research: bounded agent + web tools + claim/source state + citation verification.

</details>

### Knowledge checks

1. **When does RAG help most?**
   - A. When the model needs external/fresh/private knowledge
   - B. When arithmetic must be exact
   - C. When permissions are unnecessary
   - D. When output must be shorter

2. **A fixed multi-step business process should default to…**
   - A. A workflow with bounded model steps
   - B. An unconstrained autonomous agent
   - C. One giant prompt
   - D. Manual retries only

<details>
<summary>Answer key and explanations</summary>

1. **A — When the model needs external/fresh/private knowledge**  
   RAG supplies evidence; it does not replace deterministic computation or authorization.

2. **A — A workflow with bounded model steps**  
   Explicit transitions improve correctness, observability, and recovery.

</details>

### Visual and interaction briefs

- **Architecture Chooser — Progressive complexity tool:** Start with one model call and add retrieval, deterministic tools, workflow orchestration, or an agent only when a scenario proves the simpler level insufficient.
- **Verification Map — Pattern matrix:** Map extraction to schema checks, research to citations, coding to tests/diffs, support to policy/account checks, and analysis to executable computation.
- **Base mental-model animation:** Animate the Generate → Retrieve → Tool → Agent flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 16: Coding Agents & Software Engineering

**Phase:** Agent systems  
**Estimated time:** 4h  
**Depth:** Deep

### Outcome

Design a code-changing loop that understands repositories, edits safely, verifies, and recovers over long horizons.

### Why this matters

Coding agents operate over huge, changing state with delayed feedback. Success needs navigation, planning, precise edits, execution, tests, context management, and permission boundaries.

### Coverage requirements

- **Understanding:** Repository search, symbols, dependency and instruction discovery.
- **Planning:** Scope, change graph, risk, checkpoints.
- **Editing:** Patches, file ownership, generated code.
- **Verification:** Tests, builds, static analysis, failure interpretation.
- **Review:** Diff quality, regressions, user intent.
- **Runtime:** Sandbox, permissions, long tasks, context compaction.
- **Contrast:** Why this is harder than autocomplete.

### Mental model

The coding loop turns intent into a small verified diff, using repository feedback as evidence.

**Base flow:** Orient (Rules + search) → Plan (Files + tests) → Patch (Minimal change) → Verify (Run + repair)

### Lesson 1: Navigation beats full ingestion

Large repositories do not fit coherently in context. Search filenames and symbols, read local instructions, trace call sites, and load only the slice needed. Maintain a compact map of decisions and open questions.

- Repository state is the source of truth
- Generated/vendor areas have different ownership
- Search before guessing APIs

### Lesson 2: Edits are hypotheses

A plan predicts which files and behaviors must change. Apply small patches, inspect diffs, and use compiler/tests as high-signal feedback. Interpret failures before broad changes.

- Preserve unrelated user changes
- Prefer reversible, scoped mutations
- Checkpoint after coherent verified milestones

### Lesson 3: Long horizon requires external state

Persist plan, completed steps, test evidence, patch state, and budgets. Sandbox execution and gate privileged network, secrets, deployments, and destructive commands. Detect repeated failing cycles.

- Autocomplete has immediate human steering; agents must self-correct
- Compaction must preserve constraints and unresolved failures
- Review final diff against the original request

### Senior signal

Connect this to your builder background: deterministic orchestration, server-driven interfaces, and clear ownership around a probabilistic planner are excellent experience stories.

### Failure patterns to catch

- Reading the whole repository into context
- Editing before discovering local instructions/tests
- Re-running the same failing command with no new hypothesis
- Declaring success without inspecting the diff and relevant tests

### Interview drill

**Prompt:** Design the backend of a coding agent that receives a GitHub issue and returns a reviewed pull request.

**Constraints:** large repos · untrusted code · 45 min · human review

<details>
<summary>Strong approach</summary>

Create a durable run, clone into an ephemeral sandbox with scoped credentials, discover repo rules, build a plan, patch in checkpoints, run targeted then broader tests, and persist artifacts/traces. Bound network/secrets, stop on non-progress, summarize risks, and require user review before publishing effects.

</details>

### Knowledge checks

1. **Best way to understand a large repo?**
   - A. Put every file in the prompt
   - B. Search and incrementally build a task-specific map
   - C. Guess conventions
   - D. Edit package files first

2. **Why is coding agency harder than autocomplete?**
   - A. It uses fewer tokens
   - B. It must manage state, tools, delayed feedback, and recovery across many steps
   - C. It cannot read code
   - D. It never runs tests

<details>
<summary>Answer key and explanations</summary>

1. **B — Search and incrementally build a task-specific map**  
   Selective navigation preserves context for relevant code and evidence.

2. **B — It must manage state, tools, delayed feedback, and recovery across many steps**  
   Long-horizon closed-loop action adds orchestration and failure complexity.

</details>

### Visual and interaction briefs

- **Coding-Agent Flight Recorder — Long-horizon trace:** Show repository discovery, plan, patch, tests, failure interpretation, repair, checkpoint, and review. Highlight compaction and resumability.
- **Repository Context Map — Search/navigation explorer:** Reveal only task-relevant files and symbols as the learner searches; show why full-repository prompt stuffing wastes context.
- **Base mental-model animation:** Animate the Orient → Plan → Patch → Verify flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 17: LLM Infrastructure at Scale

**Phase:** Agent systems  
**Estimated time:** 4h  
**Depth:** Deep

### Outcome

Design gateways, queues, caches, quotas, tenant isolation, and capacity around scarce model compute.

### Why this matters

This chapter is system design through an AI lens: requests differ by tokens and features, streams stay open, providers/fleets vary, and cost attribution matters per tenant and model.

### Coverage requirements

- **Gateway:** Model abstraction, policy, multi-model routing.
- **Admission:** Quotas, rate limits, concurrency, token reservation.
- **Scheduling:** Queues, priority, batch inference, fairness.
- **Delivery:** Streaming connections, cancellation, backpressure.
- **Efficiency:** Prefix/output caches and batching.
- **Operations:** Telemetry, cost attribution, capacity, regional availability.
- **Scarcity:** GPU allocation and graceful degradation.

### Mental model

A model gateway converts tenant policy and workload shape into an admitted, routed, observable request.

**Base flow:** Identify (Tenant + task) → Reserve (Tokens + spend) → Route (Model + region) → Account (Actual + outcome)

### Lesson 1: Rate limits need token awareness

Request count hides a 100-token extraction versus a 100k-token agent turn. Combine request, token, concurrency, and spend budgets. Reserve estimated usage on admission, then reconcile actual input/output/tool cost.

- Separate tenant and global fleet limits
- Expose truthful retry/queue semantics
- Protect high-priority capacity

### Lesson 2: The gateway owns cross-cutting policy

Centralize supported-model mapping, retries, routing, fallbacks, usage, tracing, and safety hooks without hiding capability differences. Avoid a lowest-common-denominator interface that erases streaming or tool semantics.

- Version routing policy
- Circuit-break unhealthy models/regions
- Preserve provider request IDs for debugging

### Lesson 3: Capacity is token-shaped

Forecast queued input/output tokens, context distributions, cache hit rates, and model mix—not only RPS. Regional headroom and fallback capacity must handle correlated demand or fleet loss.

- Cancel disconnected work
- Batch offline traffic
- Degrade by context, model, priority, or async path

### Senior signal

Estimate tokens/sec and KV occupancy alongside RPS. This is the bridge from classic capacity planning to inference systems.

### Failure patterns to catch

- One RPS limit for every request size
- Opaque routing that changes capabilities silently
- No cost attribution by tenant/task
- Fallback fleet sharing the same failure domain

### Interview drill

**Prompt:** Design a model gateway serving 10k enterprise tenants across hosted and self-run models.

**Constraints:** 10k tenants · multi-model · regional · cost attribution

<details>
<summary>Strong approach</summary>

Authenticate tenant, classify capability/risk, reserve token/spend/concurrency quotas, route by policy and health, stream typed events, and reconcile usage. Maintain capability metadata, per-route circuit breakers, weighted fairness, regional failover, prompt/model version telemetry, and tested degradation tiers.

</details>

### Knowledge checks

1. **Why is RPS alone insufficient?**
   - A. Models ignore requests
   - B. Token and context sizes vary compute/memory by orders of magnitude
   - C. RPS cannot be counted
   - D. It is always zero

2. **What should admission reserve?**
   - A. Only a socket
   - B. Estimated scarce capacity/spend, reconciled to actual usage
   - C. A database name
   - D. No resources

<details>
<summary>Answer key and explanations</summary>

1. **B — Token and context sizes vary compute/memory by orders of magnitude**  
   AI requests are heterogeneous; tokens and concurrency predict resource use better.

2. **B — Estimated scarce capacity/spend, reconciled to actual usage**  
   Reservation avoids accepting work the system cannot afford or serve.

</details>

### Visual and interaction briefs

- **Token-Shaped Capacity — Inference gateway simulator:** Vary request rate, prompt/output distributions, prefix-cache hits, model mix, and fleet size; display queued tokens, TTFT risk, KV pressure, and cost attribution.
- **Tenant Fairness — Queue animation:** Compare FIFO, per-tenant concurrency, weighted fair share, size classes, and reserved priority capacity under one noisy tenant.
- **Base mental-model animation:** Animate the Identify → Reserve → Route → Account flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 18: Modern LLM Platform Concepts

**Phase:** LLM platforms  
**Estimated time:** 4h  
**Depth:** Current

### Outcome

Navigate the durable primitives exposed by modern LLM platforms and reason about provider evolution without memorizing a release snapshot.

### Why this matters

Platform details change. Engineering fluency means understanding durable concepts—model requests, typed content, streaming, tools, retrieval, realtime sessions, state, and evaluation—while checking each provider's current official documentation for models, limits, deprecations, and capabilities.

### Coverage requirements

- **Core API:** Model requests, typed content/items, multimodal input/output, and provider adapters.
- **Delivery:** Semantic streaming events and conversation state.
- **Control:** Structured outputs, function calling, built-in tools.
- **Knowledge:** Files, retrieval/vector stores, embeddings.
- **Realtime:** Low-latency audio sessions and server controls.
- **Agents:** Long-running/background work, tool loops, tracing.
- **Platform:** Safety layers, rate/usage limits, model strategy, compatibility.

### Mental model

Treat every model platform as a set of composable primitives behind an application-owned policy, state, and evaluation layer.

**Base flow:** Model API (Typed content + state) → Tools (Built-in + custom) → Realtime (Live sessions) → Evaluation (Measure behavior)

### Lesson 1: Understand the provider's application primitive

Modern provider APIs represent messages, content, actions, and tool calls through structured request and response types. OpenAI's Responses API is one concrete example; other providers expose similar capabilities through different contracts. Build around the durable concepts rather than one vendor's naming.

- Keep an internal adapter around vendor specifics
- Use typed streaming lifecycle events
- Persist your own product state and audit semantics

### Lesson 2: Choose real-time architecture by interaction

Realtime sessions keep a low-latency connection open for live audio, conversation events, and tools. Request-based APIs remain simpler for bounded transcription or speech tasks. Server-side controls keep business logic and credentials away from clients.

- WebRTC fits client media; WebSocket fits server connections
- Handle interruption and cancellation
- Measure audio/session cost separately

### Lesson 3: Documentation is part of the design process

Model availability, tool support, rate limits, and deprecations are update-sensitive. Verify them in the selected provider's official documentation at implementation time; protect product behavior with capability checks, adapters, evals, and staged migrations.

- Do not couple product contracts to one model alias
- Pin/version behavior where needed
- Re-run evals before model or prompt migration

### Senior signal

Say: “I know the durable platform primitives; I would verify current model and tool support in the provider's official documentation before locking the implementation.”

### Failure patterns to catch

- Memorizing current model names as architecture
- Assuming every model supports every tool or modality
- Letting provider conversation state become your only source of truth
- Migrating models without evals and rollback

### Interview drill

**Prompt:** Sketch a vendor-resilient LLM application layer for chat, tools, file retrieval, and streaming.

**Constraints:** one initial provider · streaming · tools · future evolution

<details>
<summary>Strong approach</summary>

Define an internal request/event/tool contract, map it to the provider's structured content and streaming events, store durable application state, and isolate capability differences. Keep tool execution and authorization in your service, record versions and usage, verify current limits in official docs, and gate migrations with offline evals plus canary rollback.

</details>

### Knowledge checks

1. **Where should current model/tool compatibility be verified?**
   - A. An old blog screenshot
   - B. The selected provider's official documentation at implementation time
   - C. A guessed alias
   - D. The UI color theme

2. **How should an application handle provider-specific request and streaming formats?**
   - A. Expose them directly throughout every product layer
   - B. Hide all capability differences behind a lowest-common-denominator text API
   - C. Map them through an internal contract while preserving meaningful capabilities
   - D. Copy the provider SDK into the application repository

<details>
<summary>Answer key and explanations</summary>

1. **B — The selected provider's official documentation at implementation time**  
   Capabilities and limits evolve; authoritative current documentation is the correct source.

2. **C — Map them through an internal contract while preserving meaningful capabilities**  
   An adapter limits vendor coupling, while capability-aware types avoid reducing every provider to an inadequate text-only interface.

</details>

### Visual and interaction briefs

- **LLM Platform Map — Capability topology:** Connect typed model content, streaming events, custom and built-in tools, retrieval, realtime sessions, state, and evaluation behind an application-owned policy layer.
- **Living Docs Cards — Update-sensitive reference panel:** Fetch or link the chosen providers' current official documentation for model/tool support, limits, and deprecations. Date-stamp verification instead of hard-coding volatile facts.
- **Base mental-model animation:** Animate the Model API → Tools → Realtime → Evaluation flow one step at a time, with pause/replay and a static text alternative.

### Provider case-study references

The following OpenAI documentation is retained as one concrete platform example, not as the purpose or exclusive target of the course.

- [Responses API migration and concepts](https://developers.openai.com/api/docs/guides/migrate-to-responses)
- [Streaming Responses](https://developers.openai.com/api/docs/guides/streaming-responses)
- [Using tools](https://developers.openai.com/api/docs/guides/tools)
- [Realtime and audio](https://developers.openai.com/api/docs/guides/realtime)

---

## Chapter 19: AI-Native Engineering Judgment

**Phase:** Interview mode  
**Estimated time:** 3h  
**Depth:** Core

### Outcome

Place probabilistic behavior only where it creates value, then measure and bound it.

### Why this matters

The senior question is rarely ‘can an LLM do this?’ It is ‘where does semantic flexibility outweigh variability, cost, latency, and security risk—and how will the system fail safely?’

### Coverage requirements

- **Boundary:** Deterministic code vs model judgment.
- **Levers:** Prompting, RAG, tools, fine-tuning.
- **Complexity:** Workflow vs agent.
- **Autonomy:** Human approval and bounded effects.
- **Correctness:** Probabilistic evidence, abstention, verification.
- **Economics:** Quality/latency/cost measurement.
- **Safety:** Safe failure and graceful degradation.

### Mental model

Use the least powerful probabilistic mechanism that clears the measured task bar.

**Base flow:** Prompt (Known context) → RAG (External knowledge) → Tune (Repeated behavior gap) → Agent (Adaptive actions)

### Lesson 1: Choose the lever that matches the gap

Prompt when the model has context and needs clearer specification. Retrieve when evidence is missing or private. Add tools for exact data/actions. Fine-tune for repeated behavioral/style/task gaps supported by enough data. Add an agent only for adaptive paths.

- Do not fine-tune facts that change frequently
- Do not RAG arithmetic
- Do not agentize a fixed workflow

### Lesson 2: Bound autonomy by consequence

Let the model classify, draft, prioritize, and propose. Deterministic systems validate, authorize, commit, and audit. Increase approval and isolation as reversibility decreases and impact rises.

- Read-only differs from money or external communication
- Make budgets and stop conditions explicit
- Prefer preview → approve → execute

### Lesson 3: Make probabilistic correctness measurable

Define success cases, tolerated errors, abstention policy, and human escalation. Measure end-to-end task completion by slice plus latency, cost, and safety.

- Model confidence is not enough
- Verification can use tools, citations, tests, or humans
- Design partial success intentionally

### Senior signal

For every model decision, ask: What evidence can verify it? What happens if it is wrong? Can the effect be reversed?

### Failure patterns to catch

- Using RAG, fine-tuning, and agents simultaneously before measuring baseline
- Letting the model enforce business invariants
- No abstention or escalation path
- Optimizing raw model score instead of successful outcome

### Interview drill

**Prompt:** Choose an architecture for automatically triaging, diagnosing, and optionally fixing production incidents.

**Constraints:** high consequence · live systems · partial automation · audit

<details>
<summary>Strong approach</summary>

Use deterministic alerts/runbooks for known conditions, a model for synthesis and hypothesis generation, retrieval for current service docs, read-only diagnostic tools by default, and approval-gated bounded remediation. Evaluate diagnosis quality and harmful actions; require rollback, idempotency, budget, and full audit.

</details>

### Knowledge checks

1. **When should you fine-tune?**
   - A. Before trying anything
   - B. For a persistent measured behavior gap with representative data
   - C. For fresh daily facts
   - D. To enforce authorization

2. **Where should human approval sit?**
   - A. Randomly
   - B. At the boundary of consequential or irreversible effects
   - C. Before every token
   - D. Only after damage

<details>
<summary>Answer key and explanations</summary>

1. **B — For a persistent measured behavior gap with representative data**  
   Fine-tuning is justified by repeatable deficits after simpler levers are evaluated.

2. **B — At the boundary of consequential or irreversible effects**  
   Approval should correspond to impact and reversibility.

</details>

### Visual and interaction briefs

- **Deterministic or Model? — Boundary sorting activity:** Place authorization, arithmetic, routing judgment, summarization, state transitions, classification, and side effects on the right side of the architecture.
- **Choose the Lever — Prompt/RAG/tool/tune/agent decision tree:** Diagnose the actual gap and select the least complex intervention, including a ‘do nothing yet—build the eval’ option.
- **Base mental-model animation:** Animate the Prompt → RAG → Tune → Agent flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 20: AI-Native Design Exercises

**Phase:** Interview mode  
**Estimated time:** 6h  
**Depth:** Studio

### Outcome

Practice full AI-native designs across storage, inference, agents, retrieval, memory, evals, routing, voice, and abuse.

### Why this matters

These exercises combine the entire course. Rotate which dimension you deep-dive so you can handle interviewer steering rather than replay one prepared speech.

### Coverage requirements

- **State:** ChatGPT conversation storage and persistent memory.
- **Serving:** Scalable inference API and model gateway.
- **Agents:** Coding, research, tool execution, long-running tasks.
- **Knowledge:** Enterprise RAG with permissions.
- **Quality:** Evaluation platform.
- **Realtime:** Voice assistant.
- **Security:** Abuse-resistant public API and tenant isolation.

### Mental model

Every AI design should cover state, intelligence, action, control, and learning.

**Base flow:** State (Durable context) → Model (Route + serve) → Action (Tools + sandbox) → Learn (Evals + feedback)

### Lesson 1: Vary the deep dive

For conversation storage, go deep on ordering/deletion. For inference, scheduling/KV/admission. For agents, state/checkpoints/tools. For RAG, ACLs/freshness/evaluation. For voice, interruption and latency.

- Reuse the execution framework
- State model vs system failure separately
- Always include cost and safety

### Lesson 2: Add constraint cards

After 20 minutes, inject one change: a region fails, one tenant drives 40% of traffic, context doubles, a provider rate-limits, a tool has side effects, or retention law changes.

- Revise the smallest boundary
- Preserve the product invariant
- Explain migration and operational impact

### Lesson 3: Score evidence, not confidence

Use five dimensions from 1–4: framing, correctness, depth, tradeoffs, and communication/recovery. Keep one concrete note and one next drill per dimension.

- Record at least half the mocks
- Repeat weak designs after 48 hours
- Seek adversarial follow-up questions

### Senior signal

A strong AI design closes with: eval gate, production SLOs, cost attribution, abuse boundary, and safe fallback.

### Failure patterns to catch

- Practicing only your favorite agent prompt
- No capacity estimates
- No distinction between quality and availability
- Stopping once the happy-path diagram is complete

### Interview drill

**Prompt:** Complete four mocks: inference API, enterprise RAG, coding agent, and realtime voice. Draw and narrate each.

**Constraints:** 4 × 50 min · constraint injection · score 1–4 · 48h redo

<details>
<summary>Strong approach</summary>

Use the standard time boxes. At minute 20, randomly inject a failure/scale/security constraint. Finish with the top three risks and signals. Redo the lowest-scoring deep dive after 48 hours without reviewing the old diagram first.

</details>

### Knowledge checks

1. **Which closing topic is easy to miss but highly differentiating?**
   - A. Logo design
   - B. Evals, cost attribution, and safe fallback
   - C. Favorite programming language
   - D. Office location

2. **Why inject constraints mid-mock?**
   - A. To waste time
   - B. To practice adapting while preserving invariants
   - C. To avoid design
   - D. To memorize more products

<details>
<summary>Answer key and explanations</summary>

1. **B — Evals, cost attribution, and safe fallback**  
   These show ownership of production AI outcomes beyond the happy path.

2. **B — To practice adapting while preserving invariants**  
   Real interviews test response to changed assumptions.

</details>

### Visual and interaction briefs

- **AI Design Arena — Randomized capstone generator:** Draw one of the 13 design prompts plus a scale, failure, security, and regulation constraint; preserve the generated scenario for later comparison.
- **Constraint Injector — Timed mock control:** At minute 20, reveal region loss, a giant tenant, doubled context, provider rate limit, a side-effecting tool, or retention change.
- **Base mental-model animation:** Animate the State → Model → Action → Learn flow one step at a time, with pause/replay and a static text alternative.

---

## Chapter 21: Interview-Level LLM Fluency

**Phase:** Interview mode  
**Estimated time:** 4h  
**Depth:** Capstone

### Outcome

Explain, critique, and design AI systems precisely at software-engineer depth.

### Why this matters

Your goal is not to impersonate an ML researcher. It is to show a grounded mental model, serving intuition, product judgment, and honest boundaries—then connect them to reliable software design.

### Coverage requirements

- **Explain:** LLMs, attention, inference bottlenecks.
- **Quantify:** Latency stages, token cost, context and throughput.
- **Compare:** RAG, prompting, tuning, agents.
- **Diagnose:** Model vs retrieval vs orchestration vs tool failure.
- **Secure:** Permissions, sandboxing, approval.
- **Critique:** Find missing evals, state, fallbacks, and controls.
- **Boundary:** Know when training-side detail is outside SWE scope.

### Mental model

Clear explanation + system diagnosis + bounded design = interview fluency.

**Base flow:** Explain (First principles) → Diagnose (Layer + evidence) → Design (Tradeoffs + controls) → Bound (Honest unknowns)

### Lesson 1: Build the five-minute stack

Explain tokens and next-token distributions; attention as learned information mixing; prefill vs decode and KV memory; retrieval/tools as external grounding/action; evals and deterministic controls around variable output.

- Use one diagram and one product consequence
- Avoid magical language
- Answer the level asked before going deeper

### Lesson 2: Diagnose by layer

A bad answer may come from missing model capability, weak prompt, poor retrieval, stale context, incorrect tool, orchestration bug, policy block, or UX mismatch. Ask for traces and counterfactual tests.

- Swap evidence/model/tool one at a time
- Reproduce with stored versions
- Distinguish availability from quality

### Lesson 3: State your boundary well

Say: ‘I do not know the optimizer-level detail, but for the serving/product system I would reason from these constraints…’ Then proceed concretely. Honest scope plus strong adjacent reasoning beats bluffing.

- Know vocabulary without pretending research depth
- Connect to distributed systems expertise
- Ask what evidence would resolve uncertainty

### Senior signal

Existing software-engineering experience is an asset: translate service ownership, client/server contracts, release mechanisms, and production operations into examples of boundaries, rollouts, observability, and deterministic control around model behavior.

### Failure patterns to catch

- Buzzword chains without causal explanation
- Bluffing training details
- Describing agents without state, tools, or stop conditions
- Treating a model failure as the only possible cause

### Interview drill

**Prompt:** Record a 12-minute oral exam: LLM in 2 min, attention in 2, inference in 2, RAG tradeoffs in 2, safe agent in 2, unknown-depth recovery in 2.

**Constraints:** 12 min · no notes · concrete examples · one honest boundary

<details>
<summary>Strong approach</summary>

Use the mental-model diagrams from chapters 1, 2, 4, 8, and 13. For each, define mechanism, consequence, and failure. End with an unknown training-detail question and practice pivoting to how you would measure or design around it.

</details>

### Knowledge checks

1. **Best response to unknown training detail?**
   - A. Invent it
   - B. State the boundary and reason concretely from serving/product constraints
   - C. End the interview
   - D. Change subjects completely

2. **A bad RAG answer should first be localized across…**
   - A. Retrieval, context assembly, generation, and citation
   - B. Only model size
   - C. Only CSS
   - D. Only DNS

<details>
<summary>Answer key and explanations</summary>

1. **B — State the boundary and reason concretely from serving/product constraints**  
   Honesty plus adjacent depth demonstrates judgment and trustworthiness.

2. **A — Retrieval, context assembly, generation, and citation**  
   Different pipeline stages create different failure modes and fixes.

</details>

### Visual and interaction briefs

- **Fluency Circuit — Timed oral-exam surface:** Run six two-minute explanations—LLM, attention, inference, RAG, safe agents, and an unknown-detail recovery—with prompts, timer, and self-rubric.
- **Failure Localizer — Architecture diagnosis game:** Given a bad AI output and trace evidence, identify whether the cause is model, prompt, retrieval, context, tool, orchestration, policy, or UX.
- **Base mental-model animation:** Animate the Explain → Diagnose → Design → Bound flow one step at a time, with pause/replay and a static text alternative.

---

# 7. Cross-course practice surfaces

## Design Studio

The Design Studio should be a reusable interactive environment rather than one fixed calculator.

### Classic service mode

Inputs: daily users, actions per user, read/write split, peak multiplier, payload size, cache hit rate, replication, retention, and regional count.

Outputs: average/peak RPS, source load, bandwidth, daily/annual storage, estimated working set, and likely bottleneck warnings.

### Inference mode

Inputs: requests per second, input/output token distributions, model class, fleet size, per-device throughput assumption, prefix-cache hit rate, batch efficiency, concurrency, and tenant mix.

Outputs: prefill/decode token demand, estimated fleet pressure, queue risk, KV-cache pressure, cost units, TTFT risk, and fairness warnings.

### Failure injection

Support GPU loss, database failover, cache loss, provider outage, region loss, one noisy tenant, 10× payload, doubled context, and tool latency. The learner should select a mitigation and explain its downside before the lab reveals a suggested response.

## Drill deck

1. **URL shortener** — System design. Focus: Read-heavy IDs, collision strategy, hot redirects, abuse.
2. **Chat / messaging** — System design. Focus: Ordering, delivery, offline sync, fan-out, presence.
3. **Notification platform** — System design. Focus: Preferences, priorities, retries, providers, dedup.
4. **News feed** — System design. Focus: Fan-out, ranking, celebrity keys, freshness.
5. **File storage** — System design. Focus: Metadata, immutable blobs, chunking, sync, sharing.
6. **Autocomplete** — System design. Focus: Prefix index, ranking, freshness, p99 latency.
7. **Metrics platform** — System design. Focus: Cardinality, ingestion, aggregation, retention, query.
8. **Job scheduler** — System design. Focus: Leases, priority, retry, idempotency, fairness.
9. **Distributed cache** — System design. Focus: Partitioning, eviction, replication, hot keys.
10. **Feature flags** — System design. Focus: Control/data plane, propagation, targeting, rollback.
11. **LLM chat product** — AI-native design. Focus: Streaming, state, routing, safety, cost.
12. **Coding-agent backend** — AI-native design. Focus: Sandboxes, checkpoints, tools, tests, recovery.
13. **Inference API** — AI-native design. Focus: Admission, batching, KV cache, fairness, fallback.
14. **Enterprise RAG** — AI-native design. Focus: ACLs, freshness, hybrid retrieval, citations, evals.
15. **Persistent memory** — AI-native design. Focus: Write policy, retrieval, consent, contradiction.
16. **Tool executor** — AI-native design. Focus: Schemas, authorization, idempotency, audit, approval.
17. **Eval platform** — AI-native design. Focus: Datasets, graders, calibration, slices, gates.
18. **Model gateway** — AI-native design. Focus: Capabilities, routing, quotas, streams, accounting.
19. **Realtime voice** — AI-native design. Focus: WebRTC, interruption, tools, latency, session state.
20. **Public AI API** — AI-native design. Focus: Economic abuse, tenant isolation, limits, degradation.

Each drill can draw independent cards for scale, traffic shape, SLO, failure, security/abuse, data residency, and cost. Store the seed so the learner can repeat the exact scenario after 48 hours.

## Field manual

### Scale formulas

- **Average RPS:** daily actions ÷ 86,400
- **Peak RPS:** average RPS × explicit peak factor
- **Annual storage:** writes/s × bytes/write × 31.5M × replicas
- **Bandwidth:** requests/s × bytes/request
- **Cache source load:** traffic × (1 − hit rate)
- **Availability (serial):** A₁ × A₂ × … × Aₙ
- **Quorum rule:** R + W > N for intersection
- **Little's Law:** concurrency = throughput × latency

### Availability budgets

- **99%:** 7h 18m / month
- **99.9%:** 43m 48s / month
- **99.95%:** 21m 54s / month
- **99.99%:** 4m 23s / month
- **99.999%:** 26s / month

### AI-system metrics

- **TTFT:** queue + prefill responsiveness
- **ITL:** time between output tokens
- **TPS:** decode throughput
- **Recall@k:** retrieval coverage
- **Groundedness:** claims supported by context
- **Task success:** end-to-end user outcome
- **Cost/success:** spend per successful task
- **Tool accuracy:** correct tool + arguments + effect

### 50-minute interview checklist

1. Requirements + out of scope
2. Scale and SLOs
3. API + data model
4. Critical read/write path
5. Bottleneck + scaling trigger
6. Failure + retry semantics
7. Security + tenant boundary
8. Observability + rollout
9. Cost + degradation
10. Risks + recap

### Fast tradeoff frame: FACT

- **F — Frame** the deciding constraints.
- **A — Alternatives** worth comparing.
- **C — Consequences** for correctness, latency, scale, complexity, cost, and operations.
- **T — Take a position** and name the reversal trigger.

---

# 8. Technical implementation brief

## Recommended stack

A static-first React application is enough for v1 and matches the goal of zero application backend, zero account system, and local-only progress.

- **Framework:** React + TypeScript with Vite, or a statically exported Next.js application if route-level metadata/MDX ergonomics justify it.
- **Content:** MDX files validated by a typed content schema. Keep teaching content out of giant component files.
- **Styling:** CSS variables/tokens plus Tailwind or CSS Modules. Do not let utility classes bury diagram semantics.
- **Animation:** Framer Motion for state transitions; SVG/CSS for precise system diagrams. Use D3 only for charts or graph layouts that genuinely need it.
- **Search:** Pagefind for built static content or Fuse.js for an in-browser content index.
- **State:** Versioned `localStorage` store with export/import and migrations.
- **Testing:** Vitest for calculations/state migrations, Testing Library for interactions, Playwright for the highest-value flows, and automated accessibility checks.
- **Hosting:** Static hosting behind `learn.smmeyer.dev`; Cloudflare Pages, Vercel, Netlify, or GitHub Pages can all serve this architecture cheaply.

## Suggested repository structure

```text
systems-llm-engineering-lab/
├── src/
│   ├── app/                 # routes, layouts, providers
│   ├── content/
│   │   ├── system-design/   # one MDX file per chapter
│   │   ├── llm-engineering/ # one MDX file per chapter
│   │   ├── glossary.ts
│   │   └── drills.ts
│   ├── components/
│   │   ├── course/          # chapter shell, progress, quiz, callouts
│   │   ├── diagrams/        # reusable exact diagrams
│   │   ├── labs/            # interactive simulations
│   │   └── ui/              # buttons, cards, dialog, tabs, etc.
│   ├── features/
│   │   ├── progress/
│   │   ├── search/
│   │   ├── drills/
│   │   └── notes/
│   ├── lib/                 # calculations, scoring, migrations
│   ├── styles/              # tokens, globals, print
│   └── types/
├── public/
├── tests/
├── scripts/                # content validation/build helpers
└── README.md
```

## Content schema

```ts
type Chapter = {
  id: string;
  track: 'system-design' | 'llm-engineering';
  order: number;
  title: string;
  phase: string;
  estimatedMinutes: number;
  depth: 'core' | 'deep' | 'studio' | 'capstone' | 'current';
  outcome: string;
  topics: Topic[];
  mentalModel: DiagramSpec;
  lessons: LessonSection[];
  seniorSignal: string;
  pitfalls: string[];
  drill: Drill;
  quiz: QuizQuestion[];
  labIds: string[];
  references?: Reference[];
  lastReviewedAt?: string;
  updateSensitivity?: 'stable' | 'review-yearly' | 'review-before-use';
};
```

## Progress schema

```ts
type ProgressStateV1 = {
  schemaVersion: 1;
  completedChapters: string[];
  lessonPositions: Record<string, string>;
  quizAttempts: Record<string, QuizAttempt[]>;
  drillAttempts: DrillAttempt[];
  bookmarks: string[];
  notes: Record<string, string>;
  lastVisited?: string;
  preferences: { reducedMotion: boolean; denseMode: boolean };
};
```

Persist only on explicit meaningful events. Debounce notes. Add an export/import path and schema migration tests so a redesign does not destroy study history.

## Content and calculation integrity

- Validate every chapter at build time: unique ID/order, non-empty outcome, topic coverage, at least one drill, at least two questions, valid answer indices, and accessible lab description.
- Put estimation formulas in tested pure functions, not inline UI math.
- Label estimates and pedagogical model values.
- Treat provider-specific platform content as update-sensitive. Store the official source URL and last-reviewed date beside the content.
- Never make retrieved documentation or live model metadata necessary for basic course rendering; the course must remain usable offline after load.

## Accessibility and responsive behavior

- Main teaching prose should default to at least 16px with comfortable line height and a readable maximum width.
- Full keyboard navigation for search, quizzes, details, sliders, tabs, timers, and diagram controls.
- Text alternatives for every diagram and chart.
- Do not encode system health, course track, or quiz correctness by color alone.
- Respect `prefers-reduced-motion`; replace animated sequences with step controls.
- At mobile widths, keep lessons, quizzes, and most labs usable; allow dense architecture canvases to use a focused full-screen mode.
- Print styles should remove navigation and produce clean chapter/field-manual PDFs.

## Performance

- Code-split chapter-specific labs.
- Keep initial dashboard JavaScript small; do not load D3 or large visual libraries globally.
- Prefer vector diagrams and CSS over large raster assets.
- Precompute the search index at build time when possible.
- Avoid background network calls for a local-only course.

---

# 9. Build plan

## Milestone 1 — Foundation and one vertical slice

- Scaffold the repository and define design/content/progress schemas.
- Build dashboard, track navigation, and one representative chapter end-to-end.
- Recommended slice: System Design Chapter 1 plus Scale Dial, or LLM Chapter 2 plus Attention Head Explorer.
- Establish dark visual tokens, responsive shell, MDX pipeline, local progress, quiz component, and diagram pattern.
- Validate the slice visually and pedagogically before bulk content import.

## Milestone 2 — Full content engine

- Import all 36 chapters as structured MDX/content data.
- Add chapter navigation, completion, search, bookmarks, notes, print styles, and field manual.
- Add content validation so no chapter silently loses quiz/drill/answer metadata.

## Milestone 3 — High-value labs

Prioritize the interactions with the greatest explanatory value:

1. Scale Dial and source-load calculator.
2. Cache Stampede.
3. Network Partition plus Lease/Fencing.
4. GPU utilization versus p99 and token-shaped capacity.
5. Next-Token Playground.
6. Attention Head Explorer.
7. Prefill/Decode plus KV Cache calculator.
8. Tool Lifecycle and Agent Loop Console.
9. RAG Pipeline Explorer.
10. Eval Workbench and Judge Calibration.

Do not block first release on all 72 visual ideas. Build reusable primitives and ship the most pedagogically important labs first.

## Milestone 4 — Interview mode

- Random drill and constraint generator.
- 50-minute guided workspace and scorecard.
- Reproducible scenario seeds and 48-hour redo queue.
- Oral fluency timers and rubrics.
- Progress heatmap that emphasizes weak capabilities rather than raw completion.

## Milestone 5 — Quality and deployment

- Content review for technical accuracy and consistent depth.
- Cross-browser, responsive, keyboard, reduced-motion, print, and accessibility verification.
- Verify localStorage migrations and export/import.
- Configure the chosen host and point `learn.smmeyer.dev` when ready.
- Document how to add or revise chapters and how to review update-sensitive platform content.

---

# 10. Definition of done

The real build is ready when:

- All 36 chapters render from structured content with no hand-built one-off page duplication.
- Every chapter contains its complete baseline copy, drill, strong approach, questions, answer explanations, and at least a useful static mental-model diagram.
- The prioritized interactive labs are accurate, labeled, keyboard-usable, and pedagogically purposeful.
- Progress, quiz attempts, notes, bookmarks, last location, export/import, and migrations work locally.
- Search finds concepts inside lesson prose, not only chapter titles.
- The drill deck can generate and reproduce timed scenarios and store self-assessments.
- The field manual prints cleanly or can be saved as PDF.
- Mobile lessons work; dense labs have a deliberate mobile behavior.
- Reduced motion and text alternatives are implemented.
- Volatile provider-specific platform content links to current official documentation and carries a review date.
- The repository has a clear README, content-authoring guide, and deployment instructions for the chosen `smmeyer.dev` subdomain.

---

# 11. Ready-to-use prompt for the new agent session

Copy the following prompt into the new coding-agent environment and attach this Markdown file:

```text
You are building the production version of the Systems & LLM Engineering Lab. Read the attached `system-design-llm-course-build-handoff.md` completely before changing files. It is the canonical product, curriculum, interaction, and implementation brief.

Product context:
- The audience is experienced software engineers. Assume professional application-development and production-systems knowledge, but do not require an ML-research background.
- The product is a general system-design and LLM-engineering course. It is not tailored to one employer, candidate, company, or interview loop.
- Preserve deep system-design practice and strong LLM engineering fluency without turning the curriculum into an ML-research mathematics course.
- Use a dark-first visual direction that is minimal, vibrant, and block-based, with restrained clay-like depth—not generic dashboard styling.
- The likely production URL is `learn.smmeyer.dev`. Keep v1 static-first with localStorage progress and no account/backend requirement.

Working rules:
1. Inspect the repository and any AGENTS.md instructions first.
2. Create an implementation plan that maps directly to the milestones and definition of done in the handoff.
3. Build one high-quality vertical slice before bulk-importing all chapter content. Prefer System Design Chapter 1 with Scale Dial or LLM Chapter 2 with Attention Head Explorer.
4. Use typed structured content/MDX and reusable chapter, quiz, diagram, and lab primitives. Do not paste the entire course into one giant component.
5. Preserve all canonical course content, drills, answers, and visual briefs from the handoff. Expansion is welcome; silent deletion or flattening is not.
6. Make visuals teach causality, topology, timing, or tradeoffs. Avoid decorative AI imagery.
7. Keep all provider-specific facts update-sensitive and cite current official documentation. Treat OpenAI, Anthropic, Google, open-weight serving stacks, and other platforms as examples rather than making one provider the course's identity. Do not freeze volatile model names, pricing, limits, or deprecation timelines as timeless facts.
8. Implement accessible keyboard behavior, reduced-motion support, responsive lessons, print styles, and text alternatives for visuals.
9. Use tests for state migrations, formulas, quiz scoring, and the most important user flows. Visually inspect the running site at desktop and mobile widths.
10. Do not stop at a scaffold or marketing page. Continue until the agreed milestone is fully implemented and verified.

Start by summarizing the architecture you found or propose, then implement Milestone 1. Ask only questions whose answers would materially change the architecture or product behavior.
```

---

# 12. Example provider references

- [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)
- [Streaming Responses](https://developers.openai.com/api/docs/guides/streaming-responses)
- [Using tools](https://developers.openai.com/api/docs/guides/tools)
- [Realtime and audio](https://developers.openai.com/api/docs/guides/realtime)
- [Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices)

These OpenAI references are retained as one useful provider case study. The implementation agent should verify current official documentation and add equivalent primary references for any other platforms used in the course.

---

# 13. Final product principle

The site should not reward passive scrolling. Every important idea should eventually require the learner to predict something, explain something, or design something. The product succeeds when the material changes how learners reason about real systems—not when the progress ring reaches 100%.
