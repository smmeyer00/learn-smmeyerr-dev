import type { Lesson } from "../types";

// Workload values in teaching scenarios are illustrative assumptions.
export const systemDesignLessons = {
  // 1. System design foundations
  1: [
    {
      title: "Start with the contract",
      paragraphs: [
        "Ask questions that change architecture: who uses it, what the critical read/write path is, whether data loss is acceptable, and what success looks like. State assumptions when the interviewer will not choose for you.",
        "Consider a paste-sharing service. “Create a paste” sounds simple until you ask whether pastes are public, whether readers need accounts, and whether an expired link may still reveal a cached body. Each answer changes a different boundary: authorization, key design, retention, or cache behavior. Write a concrete success trace before naming components: the creator submits text, receives a stable URL, and an authorized reader can retrieve it until expiry.",
        "Turn vague quality goals into testable statements. “Fast reads” might become “95% of reads finish within 200 ms, measured at the service edge.” Specify the population and window, and whether failures count. A durability requirement asks what acknowledged data may be lost; an availability requirement asks whether requests can finish. You can have a reachable system that loses accepted writes, so neither requirement substitutes for the other.",
        "Separate a known requirement from an assumed one. Record “assume one-year retention; confirm with product” rather than quietly designing around it. Pick the two constraints that dominate the first design. If privacy and reliable retrieval matter more than global latency, spend your early reasoning on permission checks and acknowledged storage instead of worldwide replication."
      ],
      bullets: [
        "Functional: verbs the system must support",
        "Non-functional: measurable quality constraints",
        "Out of scope: complexity you deliberately defer"
      ]
    },
    {
      title: "Estimate to choose—not to perform arithmetic",
      paragraphs: [
        "Use round numbers and show units. An estimate matters when it changes a decision: one database or shards, synchronous work or a queue, memory cache or disk, one region or several.",
        "Build estimates from behavior. Suppose 5M daily readers each make three reads: 15M reads/day divided by 86,400 seconds/day is about 174 reads/s. A stated 5× peak gives 868 reads/s. MAU alone cannot supply either number: you need a daily-active share and actions per active user. Keep these assumptions next to the arithmetic so another engineer can challenge them.",
        "Use units to catch mistakes. At 50k new 4 KB pastes/day, raw body growth is 200 MB/day, or 73 GB per 365-day year in decimal units. Three replicas make 219 GB before metadata, indexes, backups, and storage overhead. Replication increases retained bytes; it does not multiply the number of user creates. Peak bandwidth depends on response bytes and peak reads, not annual storage.",
        "Finally ask which estimate changes a choice. A few writes per second suggests testing one relational primary before sharding. A 20 MB maximum body suggests separating blob transfer from metadata even if average objects are small. Recalculate with the daily-active share halved and doubled. If the decision stays the same, the estimate is already useful; extra decimal places will not resolve uncertainty in the workload."
      ],
      bullets: [
        "Average RPS = daily actions / 86,400",
        "Peak is commonly 2–10× average; explain your factor",
        "Storage/year = writes/sec × bytes/write × seconds/year × replication"
      ]
    },
    {
      title: "Architecture is a chain of responsibilities",
      paragraphs: [
        "Every box should own something and every arrow should carry a named request or event. Begin with the critical path, then add components only to satisfy a requirement or repair a bottleneck.",
        "Trace the write path first: client → API → authorize and validate → commit paste metadata and body → acknowledge. For each arrow, say what is carried and what happens if it times out. If metadata and bodies live in separate stores, ask how a reader avoids seeing metadata for an absent body. One simple option is to upload the immutable body first, then publish its metadata, with cleanup for abandoned uploads.",
        "Trace the read path separately: parse ID → look up metadata → check permission and expiry → fetch body → respond. A cache is an optimization around this contract. Caching a public body is different from caching an authorization decision; a formerly authorized reader must not retain access merely because a cache entry remains warm. Name the authoritative state and where freshness is enforced.",
        "Only now add scale mechanisms. If a load test shows the primary is saturated by repeat reads, evaluate caching or replicas; if writes or data exceed its measured limit, evaluate partitioning. A queue is justified when work can finish later and its eventual result has a clear contract. This method produces a small design whose next component has a reason to exist and a measurable trigger."
      ],
      bullets: [
        "Name data and control flows",
        "Mark stateful boundaries",
        "Identify one bottleneck before proposing scale mechanisms"
      ]
    }
  ],
  // 2. Networking, APIs & boundaries
  2: [
    {
      title: "Protocol follows conversation shape",
      paragraphs: [
        "REST is excellent for public resource APIs. gRPC fits typed internal request/response and streaming. SSE is simple server-to-client streaming over HTTP. WebSockets fit bidirectional, long-lived interaction. HTTP/2 reduces connection pressure; HTTP/3 improves behavior under packet loss.",
        "Choose a transport by drawing a conversation. A browser asks for an existing invoice and gets one response: ordinary HTTP works. A report streams progress from server to browser: SSE can carry named events over an HTTP response. A collaborative editor sends edits in both directions throughout a session: a WebSocket may fit. These choices describe communication shape; they do not establish delivery, replay, or authorization guarantees.",
        "A stream needs an application protocol. Give events an ID, type, payload, and explicit completion or error meaning. After a disconnect, can a client resume from the last event, fetch a durable result, or only restart? Sending a final text fragment is not the same as committing the operation. If a server has already performed a side effect, reconnecting must recover that operation rather than silently create another.",
        "Connection reuse and multiplexing can reduce setup costs, but a protocol upgrade cannot remove a slow database query or an overloaded worker. Include DNS, connection setup, proxy buffering, and downstream processing in a latency trace. Measure the path you actually deploy, because a locally smooth stream can arrive in buffered bursts behind an intermediary."
      ],
      bullets: [
        "Prefer the least stateful protocol that meets the need",
        "Streaming changes cancellation, backpressure, and observability",
        "Connection reuse matters before protocol trivia"
      ]
    },
    {
      title: "Retries are load amplifiers",
      paragraphs: [
        "A timeout does not prove failure; it proves the caller stopped waiting. Retrying a non-idempotent operation can duplicate side effects. Bound retries, add jitter, propagate deadlines, and use idempotency keys at the effect boundary.",
        "A timeout means you stopped waiting; it does not tell you whether the remote effect occurred. A payment might commit before its response is lost. Retrying with a new identity then creates another payment. Define an idempotency key scoped to the caller and operation, bind it to the request parameters, and save the result at the effect boundary. Reusing a key with different parameters should be rejected.",
        "Allocate one end-to-end deadline. With 800 ms total, 100 ms already spent, a 300 ms failed attempt, 50 ms backoff, and 100 ms reserved for response handling, only 250 ms remains for another attempt. Pass a remaining duration downstream. Independent full timeouts at each layer can make a supposedly bounded request continue long after the caller has left.",
        "Retry only failures that might improve and only while budget remains. Use backoff with jitter to avoid synchronized retry waves, and limit concurrency as well as attempt count. If three layers each make up to three attempts, the leaf may receive 27 calls. Choose one retry owner where possible; otherwise coordinate a shared budget. Cancel work on disconnect when the operation contract permits it."
      ],
      bullets: [
        "Retry transient failures, not every 4xx",
        "Budget attempts inside the user deadline",
        "Deduplicate at the component that commits the effect"
      ]
    },
    {
      title: "Boundaries are organizational and operational",
      paragraphs: [
        "Split when a domain needs independent ownership, scaling, security, or release cadence. Each synchronous hop increases latency and correlated-failure surface, so keep the critical path short.",
        "A service boundary owns a contract, data, deployment behavior, and an on-call burden. Splitting an application into five services creates five independent failure opportunities and several network calls. Start by grouping responsibilities that must change or commit together, then split when ownership, scaling, security, or fault isolation justifies the operational cost. A module boundary is often enough initially.",
        "Define compatibility before independent deployment. Adding an optional response field is usually easier to roll out than renaming a required field. Deploy readers that tolerate the new representation before writers depend on it. For streams, version event types and specify how clients treat unknown events. An internal API also needs compatibility rules if its clients and server deploy at different times.",
        "Load balancing distributes requests among eligible backends; it cannot make every backend healthy or every request equally expensive. Readiness should reflect whether a process can serve new work, while overload admission can refuse work before queues grow without bound. Record request IDs across boundaries so you can connect the client-visible failure to the dependency attempt that caused it."
      ],
      bullets: [
        "High cohesion inside, low coupling across",
        "Prefer stable contracts over shared tables",
        "Do not begin with microservices as a status symbol"
      ]
    }
  ],
  // 3. Data modeling & storage
  3: [
    {
      title: "Model the invariants first",
      paragraphs: [
        "List entities, relationships, uniqueness constraints, and state transitions. If money, ownership, or inventory must change atomically, relational transactions are a powerful default. Denormalize only for a measured access pattern.",
        "Start with a sentence that must remain true: available inventory never becomes negative, a reservation ID names only one reservation, or a tenant cannot read another tenant's rows. Then list operations and their access patterns. Reserve-by-product, confirm-by-reservation, and list-by-customer require different keys or indexes. A database label such as “document store” does not tell you whether those operations will be correct or efficient.",
        "Imagine two requests reading stock = 1 before either writes. Both decide to decrement, so ordinary read-then-write code can oversell. An atomic conditional statement—decrement WHERE remaining > 0, then inspect the affected-row count—places the decision where concurrency is controlled. Store the reservation and its idempotency record in the same transaction. An appropriate lock or serializable transaction is another option, with conflict handling and retries.",
        "An index is a second maintained access path. An index on customer_id and created_at can make recent-order queries cheap, but every insert now updates more structures and consumes more storage. Explain the query it serves and inspect its plan. A transaction ensures a defined group of changes commits together; its isolation level determines which concurrent observations are possible. “Use transactions” is incomplete without the invariant and statement behavior."
      ],
      bullets: [
        "Indexes accelerate reads but tax writes and storage",
        "Isolation controls anomalies, not just speed",
        "Joins are useful; cross-shard joins are the warning"
      ]
    },
    {
      title: "Partition keys encode your future",
      paragraphs: [
        "A good key spreads throughput and co-locates common operations. Hash keys balance load but weaken range scans. Range keys help scans but invite hotspots. Hybrid keys—tenant plus time bucket, for example—often balance both.",
        "Partitioning assigns each record to an owner. Hashing tenant_id can keep a tenant's queries local, but a single huge tenant may dominate one shard. Hashing product_id spreads products but makes a customer's multi-product order span owners. A time-based key supports retention scans yet can send all current writes to one partition. Choose by listing the critical queries and the expected skew.",
        "Distinguish a partition key from a secondary lookup. If records are owned by tenant_id but a lookup arrives with only reservation_id, you need a directory, an ID that encodes routing, or a fan-out query. That extra step changes latency and availability. Also define how a record moves during rebalancing: readers and writers need a consistent owner version or a forwarding path while placement changes.",
        "Before adding shards, measure the bottleneck. A poor index, oversized transaction, or hot row may dominate even when aggregate storage is small. Sharding does not make one contended inventory row accept concurrent conflicting updates. You may need a reservation queue, per-product ownership, or a different product contract. State which limitation your partition plan solves and which remains."
      ],
      bullets: [
        "Estimate hottest key, not only average key",
        "Plan rebalancing and key evolution",
        "Avoid unbounded partitions"
      ]
    },
    {
      title: "Replication is a consistency decision",
      paragraphs: [
        "Leader/follower simplifies ordered writes but creates lag. Multi-leader improves regional write availability while creating conflicts. Leaderless systems trade coordination for quorum math and repair. State the read guarantee users need.",
        "A replica copies state; the replication protocol determines when a write is acknowledged and what readers can observe. With asynchronous replication, an acknowledged primary write may not yet exist on a follower. A user who creates an order and immediately reads a follower can see “not found.” Read the primary for that session, wait for a replication position, or explicitly permit temporary lag.",
        "Synchronous acknowledgement can reduce some loss windows but spends latency and availability waiting for other nodes. Define the failure model: one machine, one zone, or an entire region. Two copies in the same failed zone do not meet a regional recovery promise. Backups protect against different problems, such as accidental deletion, and require a tested restore path; replicas can faithfully copy that deletion.",
        "When comparing stores, use a small decision table: required invariants, query shapes, growth, acceptable staleness, recovery behavior, and operational familiarity. A relational store is a strong default when constraints and transactions dominate. Other layouts can win for particular access patterns or scale. The defensible answer names those conditions instead of making a universal SQL-versus-NoSQL claim."
      ],
      bullets: [
        "Read-your-writes can be session scoped",
        "Eventual consistency is incomplete without convergence behavior",
        "Use outbox + idempotent consumer to connect DB state and events"
      ]
    }
  ],
  // 4. Caching & performance
  4: [
    {
      title: "A cache is a prediction",
      paragraphs: [
        "You predict that the same result will be needed again before it becomes invalid. Estimate working-set size and hit rate. A 95% hit rate can reduce source load 20×; a 50% hit rate often does not justify major complexity.",
        "Calculate misses before celebrating hits. At 10k reads/s and 95% hits, the source receives 500 reads/s. At 90%, it receives 1,000. The cache looks healthy in both cases while database demand doubles. Measure the hit rate by traffic class and key popularity; an average can hide one expensive query that misses often. Include fill cost and bytes, not only lookup count.",
        "Cache-aside means the application reads the cache, fetches the source on a miss, then fills the cache. This creates a race at expiry: many requests can all miss before any fill finishes. If a hot key gets 3,000 requests/s and recomputation takes 200 ms, about 600 callers arrive during that window. Request coalescing lets one recomputation serve them, subject to bounded waiting and failure handling.",
        "Choose placement from reuse. A browser cache avoids a network trip; a CDN serves reusable public content near readers; an application cache can share expensive results across requests. The key must include every dimension that changes the result, including tenant, locale, or data version where appropriate. Omitting a dimension can return a fast but incorrect—or unauthorized—answer."
      ],
      bullets: [
        "Key includes every input that changes output",
        "Capacity targets the hot working set, not the full corpus",
        "Negative caching prevents repeated misses"
      ]
    },
    {
      title: "Invalidation is product semantics",
      paragraphs: [
        "Ask how stale is acceptable. TTL gives bounded staleness and simple failure behavior. Event invalidation is fresher but can lose or reorder events. Versioned keys make old values unreachable and simplify rollouts.",
        "A TTL bounds how long an entry may remain without refresh; it is not a guarantee that the cached value matches the source throughout that time. If an account balance changes immediately after fill, a one-minute TTL can serve the previous balance for almost a minute. Decide whether that is acceptable for the specific action. A display may tolerate a stale estimate while a transfer must check authoritative funds.",
        "Invalidation has ordering races. A reader fetches version 4, a writer commits version 5 and deletes the cache, then the reader fills version 4. Deleting on write alone did not prevent a stale refill. Options include versioned keys, conditional fills, or accepting bounded staleness with a clear refresh policy. The right mechanism follows the product's freshness contract.",
        "Jitter spreads expiry across many keys; it does not stop concurrent misses for one viral key. Combine protections deliberately: coalescing for the same key, early refresh or bounded stale responses where allowed, and source admission limits when fills fail. On permission revocation, decide whether cached data can remain and where authorization is rechecked. “The cache expires eventually” may be too weak for access control."
      ],
      bullets: [
        "Use jittered TTLs to avoid synchronized expiry",
        "Single-flight/coalescing suppresses stampedes",
        "Serve stale during source trouble only when semantics allow"
      ]
    },
    {
      title: "Performance is broader than caching",
      paragraphs: [
        "Batch network calls, paginate unbounded results, compress large payloads, precompute expensive aggregates, and pool connections. Optimize the bottleneck you can name and measure.",
        "Break latency into queueing, computation, storage, and network time. A cache only helps the reusable portion. If most latency is a full table scan caused by a missing index, repairing the query can be simpler and more predictable than introducing cache invalidation. If payload transfer dominates, compression or pagination may help more. Measure before choosing a mechanism.",
        "Tail latency is especially sensitive to saturation. As arrival rate approaches service capacity, small bursts have less spare capacity to drain, so queues grow and slow requests become much slower. Average latency can remain acceptable while p99 fails. Load-test the intended traffic distribution, including cold starts, expensive keys, and long payloads; a warm uniform-key benchmark is an optimistic special case.",
        "Test the cache as a dependency that can disappear. If losing it sends all traffic to a source sized for 5% misses, the source may face twenty times its expected load. Protect it with bounded concurrency, admission, and a planned degraded response. Capacity and correctness must remain understandable during a cold fleet, failed refresh, and full cache outage."
      ],
      bullets: [
        "Batching trades latency for throughput",
        "Precompute trades write/storage cost for read latency",
        "Connection pools need queue and timeout bounds"
      ]
    }
  ],
  // 5. Queues, streams & async systems
  5: [
    {
      title: "Choose by semantics",
      paragraphs: [
        "A queue gives one worker ownership of a task. A log retains ordered partition history so multiple consumer groups can independently replay it. Kafka ordering is per partition—not global—so partition by the entity whose events must stay ordered.",
        "A queue distributes work that should be processed, often allowing messages to disappear after acknowledgement. A durable log retains an ordered sequence that consumers track by position and can replay. Both can deliver asynchronously, but replay, retention, consumer independence, and ordering determine which fits. A notification send and a rebuildable analytics projection have different needs.",
        "Follow one message through states: accepted, persisted, available, delivered, processing, effect committed, acknowledged. The producer must know what broker acceptance guarantees. The consumer must know when redelivery can occur. Ordering usually applies within a chosen partition or key, not across all events. If all events for an account must be ordered, map that account consistently and plan for hot accounts.",
        "A schema is a long-lived contract because retained messages may be replayed after code changes. Include stable event identity, event time, schema version, and the data needed by the consumer. Decide whether an event records a historical fact or asks the receiver to read current state. Those meanings differ when the source has changed since the event was produced."
      ],
      bullets: [
        "Events describe facts; commands request actions",
        "Offsets are consumer progress, not business completion",
        "Retention enables replay and new consumers"
      ]
    },
    {
      title: "At-least-once is the practical default",
      paragraphs: [
        "A worker can finish the side effect and crash before acknowledgment, so redelivery happens. Make handlers idempotent with a stable operation key, transactional state transition, or effect ledger.",
        "A worker can commit a database update and crash before acknowledgement. Redelivery then repeats the work. If the effect and deduplication record share one transactional database, insert the message ID and perform the update atomically; a duplicate sees the existing ID and skips the effect. Merely setting a “processed” flag after the effect leaves a crash window.",
        "External effects are harder. A sent email cannot be rolled back with your database. A provider idempotency key or status lookup can help reconcile an ambiguous send. Without either, document whether you accept possible duplicates or possible omission. A blanket “exactly once” label hides this boundary. Broker delivery guarantees do not automatically cover a remote business effect.",
        "The transactional outbox solves a different gap: committing application state and recording the intent to publish. Write both in one transaction; a relay later publishes outbox rows. A relay crash after publish but before marking the row sent can produce another delivery, so consumers still need duplicate handling. The outbox prevents lost intent; it does not eliminate every duplicate."
      ],
      bullets: [
        "Exactly-once claims have a system boundary",
        "Retries need exponential backoff and jitter",
        "Dead-letter queues need an owner and replay procedure"
      ]
    },
    {
      title: "Backpressure is part of the API",
      paragraphs: [
        "When arrival exceeds service rate, queues grow and latency becomes unbounded. Bound the queue, reject or defer low-priority work, shed optional load, and expose truthful status.",
        "Queues absorb temporary imbalance, not unlimited overload. If producers add 1,000 jobs/s and workers finish 800, backlog grows by 200/s. After ten minutes that is 120,000 extra jobs. Even if throughput later returns to normal, you need spare capacity to drain them. Estimate waiting time from backlog and completion rate, and observe oldest-message age to connect backlog to user impact.",
        "Set bounds at every stage: accepted work, in-flight messages per worker, retry attempts, message age, and dead-letter retention. Retry transient failures with delay; separate poison messages that will fail identically. In a strictly ordered partition, skipping a poison event may violate business order, while stopping blocks following events. Make that tradeoff explicit instead of silently moving it aside.",
        "Backpressure communicates that the system cannot accept work at the promised pace. You can reject, defer, lower priority, or offer an asynchronous completion time. Expose truthful status so clients do not create duplicates by resubmitting. Protect high-priority jobs from a flood of bulk work through separate pools or scheduling policy, then test whether retries respect the same limits."
      ],
      bullets: [
        "Track queue age, not only depth",
        "Reserve capacity for high-priority tenants",
        "Admission control belongs before scarce work"
      ]
    }
  ],
  // 6. Distributed systems fundamentals
  6: [
    {
      title: "Partial failure creates uncertainty",
      paragraphs: [
        "If a request times out, the remote node may be down, the network may be slow, the response may be lost, or the operation may have committed. APIs need stable IDs and retriable semantics because certainty is unavailable.",
        "A process that cannot hear from another process cannot immediately distinguish crash from delay. Consider a scheduler whose worker pauses for a minute. Its lease expires and a replacement receives the job; then the old worker resumes. Both may believe they can write. A lease limits authority in time, but a paused process cannot be trusted to notice expiry before acting.",
        "A fencing token gives each new owner a monotonically increasing generation. The storage service remembers the highest accepted generation and rejects older ones. If owner A holds token 7 and owner B obtains 8, A's later write with 7 is refused after 8 has been installed at the protected resource. Every relevant write path must enforce the rule. A token checked only in the client offers no protection from a stale client.",
        "Use wall-clock time for human timestamps and monotonic time for local elapsed durations. Clock adjustments can make wall-clock intervals negative or misleading. Logical clocks express ordering relationships without promising exact physical time. None of these clocks turns a timeout into proof of failure; your protocol still needs an explicit response to uncertainty."
      ],
      bullets: [
        "Use monotonic clocks for elapsed time",
        "Leases expire; stale holders need fencing tokens",
        "Health checks are observations, not truth"
      ]
    },
    {
      title: "CAP is a partition-time statement",
      paragraphs: [
        "When communication between replicas is partitioned, a given operation cannot both always respond and remain linearizable. Systems make different choices by operation; outside partitions, latency/consistency tradeoffs still exist under PACELC.",
        "Imagine replicas in regions A and B with a broken link. A accepts a change that B cannot observe. If B must always answer reads, it can return the old value. If every completed read must reflect the latest completed write, B may have to reject or wait. CAP describes this conflict during a partition; saying “pick any two” without specifying the failed communication and affected operation misses the mechanism.",
        "A system can make different choices for different operations. A product catalog may return a stale description, while reserving the last item must reach the current inventory owner or fail. State whether “consistent” means linearizable access, read-your-writes, monotonic reads, or eventual convergence. These promises are different and have different implementation costs.",
        "Quorum intersection is a useful condition, not a complete protocol. With N = 3, writes to two replicas and reads from two overlap at at least one replica. You still need rules for versions, concurrent writes, failures during a write, and which value a read chooses. Do not infer linearizability merely from R + W > N. Outside a partition, contacting distant replicas also creates latency tradeoffs."
      ],
      bullets: [
        "Replication alone does not create availability",
        "Quorum intersection can preserve a single history",
        "Eventual consistency needs conflict and convergence rules"
      ]
    },
    {
      title: "Coordinate only what must agree",
      paragraphs: [
        "Consensus maintains a fault-tolerant ordered log. It is useful for metadata, membership, and ownership but expensive in every data operation. Scale by partitioning ownership and making operations idempotent or commutative.",
        "Consensus lets replicas agree on a sequence despite some nodes failing. In a leader-based replicated log, the leader proposes entries, replicas persist them, and the protocol decides when an entry is committed. A new leader must preserve committed history. A three-member majority group can continue with one member unavailable, but not with two; membership changes need protocol rules too.",
        "Use agreement for decisions whose conflict would break an invariant: selecting an owner, changing placement metadata, or ordering noncommutative state transitions. Avoid funneling unrelated independent work through one global agreement point. Partition ownership so different keys can progress separately, while retaining a clear rule for operations spanning owners.",
        "Sometimes change the operation instead of adding coordination. Adding independent counts can be made commutative; assigning each tenant a single writer can remove cross-tenant contention. Convergent replicated structures require carefully defined merge semantics, not an arbitrary “last writer wins” patch. Ask what conflicts the business can accept, how duplicates are handled, and whether a merged state still satisfies the invariant."
      ],
      bullets: [
        "Majority tolerates minority failure",
        "Leader election does not prevent stale actors by itself",
        "Exactly-once is usually deduplication plus transactions within a boundary"
      ]
    }
  ],
  // 7. Reliability & resilience
  7: [
    {
      title: "An SLO is a product promise",
      paragraphs: [
        "99.9% allows about 43.8 minutes of downtime per 30-day month; 99.99% about 4.38 minutes. Multiplying serial dependency availability reveals why every synchronous hop spends budget.",
        "Define the service-level indicator before choosing a target. For checkout, count valid purchase attempts that finish correctly within a deadline, not successful health checks on the API process. State exclusions and measurement location. A 99.9% success target permits one bad attempt per thousand over its window; a time-based availability target over a 30-day month permits 43.2 minutes. These are different denominators.",
        "An error budget turns the target into a change policy. When the service has consumed most of its budget, slow risky releases and prioritize the dominant failure source. Do not spend days eliminating harmless internal errors while customers cannot complete checkout. Slice the indicator by region or critical customer class so an aggregate success rate cannot hide a concentrated outage.",
        "For sequential required dependencies, success requires all stages. Under an illustrative independence assumption, three 99.9% available stages yield 0.999³ ≈ 99.70% availability. Real failures may be correlated, so multiplying advertised numbers is not a guarantee. Use the calculation to find dependency risk, then examine shared networks, stores, credentials, and deployment paths."
      ],
      bullets: [
        "Measure the user journey, not server uptime",
        "Error budgets govern release vs reliability work",
        "Tail latency can violate an SLO before total outage"
      ]
    },
    {
      title: "Redundancy must cross failure domains",
      paragraphs: [
        "Two replicas on one host do not protect against host loss; two AZs may not meet a three-AZ quorum strategy. Active-active improves recovery but adds state and conflict complexity.",
        "Two application instances on one host survive a process crash but not host loss. Two zones can still depend on one regional control plane or database. Name the failure domain each copy crosses, and trace whether the surviving path has credentials, configuration, data, and capacity. Redundancy only helps if the replacement is both independent enough and able to serve.",
        "RPO is the maximum accepted data-loss interval; RTO is the target recovery duration. If asynchronous replication can lag 30 seconds, an immediate failover may lose recent accepted writes even when recovery takes only a minute. Decide whether to wait, recover from another log, or explicitly reconcile missing operations. A faster failover does not by itself improve RPO.",
        "A restore test is part of the design. Restore a representative backup, apply subsequent logs, validate business invariants, and measure time until useful traffic can resume. Include DNS or routing changes, caches, and dependent clients. A runbook that ends at “database starts” has not established that checkout works."
      ],
      bullets: [
        "Failover detection can be riskier than failover mechanics",
        "Exercise backups by restoring them",
        "Know RPO (data) and RTO (time)"
      ]
    },
    {
      title: "Stop failure from spreading",
      paragraphs: [
        "Bound every call with a timeout and concurrency limit. Circuit breakers stop futile work. Bulkheads reserve resources. Jitter avoids synchronized retry waves. Graceful degradation preserves the critical product path.",
        "A slow dependency consumes callers' connections and worker slots. If those callers keep accepting new requests, a local problem spreads. Bound concurrency per dependency, set deadlines, and shed work before shared resources are exhausted. A bulkhead reserves separate capacity so an optional recommendation call cannot consume every checkout worker.",
        "A circuit breaker stops repeated calls to a failing dependency for a period and probes for recovery. It complements timeouts and budgets; it does not decide what response is safe. An unavailable recommendation can be omitted, while an unavailable payment authorization cannot be replaced by invented success. Define degraded behavior by workflow and test it with the dependency actually unavailable.",
        "Retries and fallbacks need capacity too. If every request fails over to a smaller pool, the fallback becomes the next outage. Reserve headroom, reduce admitted traffic, or lower the service level deliberately. During recovery, ramp traffic rather than releasing an entire backlog at once. Reliability includes returning to steady state without a second failure wave."
      ],
      bullets: [
        "Caller deadline should shrink downstream",
        "Shed cheap and early",
        "Prefer static/history over total failure when safe"
      ]
    }
  ],
  // 8. Observability & operations
  8: [
    {
      title: "Measure from both directions",
      paragraphs: [
        "RED—rate, errors, duration—describes request-serving behavior. USE—utilization, saturation, errors—describes resources. Together they connect a user symptom like p99 latency to a cause like GPU queue saturation.",
        "Start outside the system: can a user complete the critical workflow, and how long does it take? Then inspect internal signals such as queue age, database saturation, and dependency errors to explain the symptom. CPU alone does not tell you whether a feature is useful; low CPU can coexist with requests waiting on a failed dependency. Link each dashboard panel to a diagnostic question.",
        "Use rates and distributions carefully. An average of 100 ms may combine many fast requests with a small set taking ten seconds. Track latency percentiles and errors by meaningful bounded dimensions, such as region and operation. Unbounded labels like request_id or arbitrary tenant_id create too many time series. Put per-request detail in logs or traces and use controlled cohorts or targeted analysis for tenant diagnosis.",
        "Alerts should demand an action. “Checkout success is below target and the budget is burning rapidly” gives an operator an urgent symptom. “CPU exceeded 70%” may be useful context but can page during healthy batch work. Define the initial investigation and owner with the alert; otherwise the notification merely transfers an unexplained chart to a tired person."
      ],
      bullets: [
        "Prefer histogram percentiles over averages",
        "Control high-cardinality labels",
        "Define SLI exactly at the user boundary"
      ]
    },
    {
      title: "Reconstruct one request",
      paragraphs: [
        "Propagate a correlation or trace ID through services and asynchronous work. Structured logs make fields queryable; traces preserve causality. Sample intelligently and never log secrets or raw sensitive prompts by default.",
        "A trace connects spans for one request: edge, API, database, queue publish, and later worker processing. Propagate trace context across asynchronous messages rather than stopping at the broker. Attach stable operation and deployment identities so a retry can be distinguished from a new business action. Record enough timing to separate time waiting for a worker from time spent executing.",
        "Logs capture discrete facts: an authorization denial, state transition, or provider error. Metrics summarize populations; traces show selected paths. They answer different questions and should cross-reference each other. Avoid logging secrets or unrestricted document bodies merely to simplify debugging. A redacted error category, source/version ID, and access-controlled diagnostic record may provide the needed evidence.",
        "Sampling creates blind spots. If you sample one percent uniformly, a rare failure may not appear in the retained traces. Consider retaining errors, unusually slow requests, or temporarily targeted traffic, while bounding cost. Absence from sampled traces does not prove an event did not happen. Preserve durable business records for effects that must be audited regardless of observability sampling."
      ],
      bullets: [
        "Carry context in message headers",
        "Record retry attempt and idempotency key",
        "Link model, prompt, tool, cost, and outcome"
      ]
    },
    {
      title: "Rollouts are experiments with brakes",
      paragraphs: [
        "Canaries expose a small traffic slice, feature flags separate release from deployment, and blue-green gives fast environment rollback. Define health gates and automatic halt conditions before rollout.",
        "A canary is an experiment with limited exposure: send a small eligible population to a new version and compare task success, latency, and resource use. Define the stop rule before rollout. A canary without a meaningful metric or rollback owner only limits the initial blast radius; it does not establish that the change is safe.",
        "Rollback can reverse code without reversing data. If a release writes a new schema that old code cannot read, deploying the old binary can worsen the incident. Use an expand-and-contract migration: add compatible structures, deploy readers and writers gradually, migrate data, then remove the old form after rollback is no longer needed. Test mixed-version behavior.",
        "During an incident, separate mitigation from explanation. First reduce customer harm with a reversible action—shed traffic, disable an optional feature, or stop a rollout. Preserve a timeline and evidence for later diagnosis. A useful incident report connects trigger, propagation, detection, mitigation, and a concrete prevention change; “be more careful” does not repair a system mechanism."
      ],
      bullets: [
        "Alert on user symptoms and SLO burn",
        "Postmortems improve systems, not blame people",
        "Capacity plans need lead time for scarce resources"
      ]
    }
  ],
  // 9. Security & abuse resistance
  9: [
    {
      title: "Draw trust boundaries",
      paragraphs: [
        "Mark browser, edge, application, tool sandbox, data plane, and external systems. Identify assets and attacker goals. Authentication establishes identity; authorization must still run at every protected resource boundary.",
        "Authentication establishes who is making a request; authorization decides whether that identity may perform this action on this resource now. A valid session does not imply access to every file. Derive tenant identity from trusted authentication context, then check the requested object's owner and sharing policy. Never let a caller's arbitrary tenant_id field define the security boundary.",
        "Draw where trust changes: browser to edge, edge to service, service to storage, worker to provider. At each boundary, list the credential, allowed operation, and validation performed. A signed download URL delegates access for its lifetime; it is effectively a temporary credential. Choose its scope and expiry based on how quickly revocation must take effect.",
        "Threat modeling is a disciplined walkthrough of assets and possible misuse. For a file service, protect confidentiality of bodies, integrity of permissions, and availability of uploads. Trace a guessed object ID, a stolen link, a malicious upload, and a revoked member. Match each to an enforcement point and a test. Saying “encrypt the database” leaves most of those paths unanswered."
      ],
      bullets: [
        "Short-lived, scoped credentials limit blast radius",
        "JWT validation includes signature, issuer, audience, and expiry",
        "OAuth delegates access; it is not authorization policy by itself"
      ]
    },
    {
      title: "Multi-tenancy is a data-flow property",
      paragraphs: [
        "Carry tenant identity from authenticated request through cache keys, queries, events, object paths, logs, and tools. Enforce policy server-side. High-risk workloads may need physical isolation beyond row filters.",
        "Tenant isolation must survive every derived representation: database rows, search indexes, caches, exported files, logs, and asynchronous jobs. A perfectly filtered API can still leak through a cache keyed only by file ID or a worker that trusts an old permission snapshot. Carry trusted tenant context and resource identity into downstream work.",
        "Use defense in depth with explicit ownership. Application checks can apply sharing rules; database policies can guard against missing filters; scoped storage credentials can limit a worker's reach. These controls need a consistent tenant model and tests for administrative or migration paths. A privileged maintenance script can bypass an otherwise careful request flow.",
        "Revocation is a time problem as well as a data problem. Decide when access must stop for cached previews, already queued jobs, and active downloads. Recheck before publishing sensitive results and before consequential effects where required. If an already issued URL remains valid for five minutes, describe that exposure and decide whether the product can accept it."
      ],
      bullets: [
        "Default-deny resource access",
        "Avoid confused-deputy tool calls",
        "Partition quotas and concurrency per tenant"
      ]
    },
    {
      title: "Abuse is reliability plus economics",
      paragraphs: [
        "Layer cheap controls before expensive work: input limits, identity reputation, token buckets, anomaly detection, and spend caps. Preserve headroom for trusted traffic and record appeal/recovery paths for false positives.",
        "Abuse often uses valid requests at economically harmful volume. A free account can submit expensive exports, large uploads, or long-running inference requests. A request-rate limit treats cheap and costly operations alike. Combine caller, tenant, operation, concurrency, byte, and spend limits, using an estimate on admission and reconciliation after completion.",
        "Place admission before scarce work. If the system parses a huge archive or invokes a model before checking quota, the limit arrives too late. Bound input size, expansion ratio, execution time, and output volume. Protect shared resources against many accounts acting together as well as one noisy tenant; per-account limits alone do not stop distributed abuse.",
        "Separate authentication failures, policy denials, quota exhaustion, and upstream outages in telemetry. Otherwise an attack can look like an unexplained reliability drop. Audit sensitive access with resource and principal identities while restricting access to the audit log itself. Recovery includes credential rotation, revocation, and determining what data was exposed."
      ],
      bullets: [
        "Rate-limit by user, tenant, IP, and credential as appropriate",
        "Audit policy changes and privileged actions",
        "Minimize and expire sensitive data"
      ]
    }
  ],
  // 10. Multi-region & global systems
  10: [
    {
      title: "Choose a write topology per domain",
      paragraphs: [
        "A home-region model gives a single authority and simple conflict behavior at the cost of remote write latency. Multi-leader improves local writes but forces merge semantics. Some data—preferences—merges naturally; other data—unique ownership—does not.",
        "Assign write ownership per data domain. A single home region simplifies ordering for an account but adds remote-write latency. Active-active writes let multiple regions accept changes, so you must define conflict handling. Append-only events with globally unique IDs are easier to merge than two regions both decrementing the last available item. Geography does not remove the invariant.",
        "Walk through a regional partition. Which region can still acknowledge writes? What do remote readers see? If two sides both accept conflicting updates, how will you reconcile them? A last-write-wins timestamp policy can discard a legitimate change and depends on clock behavior; it is a product decision with consequences, not a generic correctness repair.",
        "Reads can often be local even when writes have a home, but read-your-writes then needs a strategy such as temporarily routing to the owner or waiting for a replication position. Record data ownership in routing metadata and design ownership changes as a protocol. A DNS change alone cannot safely transfer authority over mutable state."
      ],
      bullets: [
        "Read replicas reduce latency but expose lag",
        "Session routing can preserve read-your-writes",
        "Keep control plane failure separate from data plane"
      ]
    },
    {
      title: "Residency constrains architecture",
      paragraphs: [
        "Data residency can dictate storage and processing location, backup geography, and operator access. Make the policy explicit before global replication.",
        "Treat residency as a supplied constraint on particular data classes. Customer documents, account metadata, usage logs, backups, and derived embeddings may have different placement rules. Create a table showing allowed locations for each class and every processor. A primary database in an allowed region does not help if its backup or diagnostic export leaves that boundary.",
        "Follow the whole lifecycle: ingestion, replication, support access, processing, backup, deletion, and disaster recovery. If a region becomes unavailable and data cannot leave its allowed geography, recovery must use permitted capacity or accept downtime. The design should expose that tradeoff before an incident. Obtain the applicable requirements from the product and legal owners rather than inferring law from a region name.",
        "Deletion also propagates across copies and derived indexes. Keep versioned deletion intent so an older replication event cannot resurrect data. Define what remains in backups, who can restore it, and how restored data is brought back into compliance with deletion records. This is a recovery workflow, not just a delete statement."
      ],
      bullets: [
        "Classify data before placing it",
        "Keep region-independent identifiers",
        "Know which dependencies are actually regional"
      ]
    },
    {
      title: "Evacuation is a capacity event",
      paragraphs: [
        "Failover succeeds only if the destination has capacity, credentials, data, configuration, and tested runbooks. DNS/edge routing is the smallest part. Plan write fencing, backlog replay, and failback.",
        "Capacity must exist where traffic will land after failure. Suppose two regions normally handle 400 requests/s each and each can serve at most 600 at the required latency. Losing one leaves 800 requests/s for a 600-capacity survivor. The healthy region still needs load shedding, degraded behavior, or more reserved capacity. Steady-state utilization alone concealed the risk.",
        "Failover has several decisions: detect a problem, establish the old writer cannot safely continue, promote a valid replica, route traffic, and validate product behavior. With asynchronous replication, identify the last durable position and any accepted writes that may be missing. Refuse unsafe writes or expose a recovery state instead of quietly pretending the new replica contains all history.",
        "Failback needs equal care. The recovered region may contain divergent state, stale jobs, or old credentials. Reconcile data, rejoin replication, warm dependencies, and shift traffic gradually. Practice the procedure and measure RTO and RPO with actual failure injection. A diagram with two regions is only a starting hypothesis about recoverability."
      ],
      bullets: [
        "Measure replication lag",
        "Exercise partial and full-region loss",
        "Prevent two regions from believing they are sole writer"
      ]
    }
  ],
  // 11. High-scale compute systems
  11: [
    {
      title: "Workload shape determines the pool",
      paragraphs: [
        "Online inference values low queue time and predictable latency. Batch training or embeddings can wait, fill troughs, and tolerate preemption. Separate pools or reservations prevent batch work from consuming interactive headroom.",
        "Describe a job by the resources it needs and how long it holds them. A CPU batch transform, a memory-heavy index build, and a GPU decode request are not interchangeable work units. Track duration distributions, memory footprint, accelerator compatibility, and whether interruption is safe. A queue containing ten jobs may represent seconds or hours of work.",
        "Separate scheduling from admission. Admission decides whether the service can promise to accept a job; scheduling decides which accepted job runs next on which resource. Reserve scarce resources before accepting work when necessary, and release or reconcile reservations at completion. If you accept unlimited work then schedule it fairly, users can still wait beyond every promised deadline.",
        "Use workload classes where sharing harms predictability. Interactive requests need low waiting time; batch jobs may tolerate delay and benefit from larger batches. Separate pools or priority reservations can protect interactive latency. Explain the cost: idle reserved capacity may reduce utilization, and strict priority can starve batch work unless you allocate a minimum share."
      ],
      bullets: [
        "Stateless frontends scale cheaply",
        "Stateful workers need checkpoint and ownership semantics",
        "Autoscaling lag makes admission control essential"
      ]
    },
    {
      title: "The bottleneck moves",
      paragraphs: [
        "A service may be GPU-compute bound during decode, memory-capacity bound by KV caches, CPU-bound during tokenization, or network-bound during distributed collectives. Measure per stage.",
        "Compute can be limited by arithmetic, memory bandwidth, device memory, network transfer, or queueing. Increasing one resource helps only while that resource is the bottleneck. A model may fit in memory yet serve too slowly because each generated token requires reading substantial model state. Conversely, enough compute does not help if long contexts exhaust cache memory.",
        "For an illustrative inference workload, 20 requests/s with 1,000 input and 200 output tokens require 20k input tokens/s and 4k output tokens/s. Those rates describe different serving phases and cannot simply be divided by one universal tokens/s rating. Measure capacity under representative context lengths, concurrency, batching, and latency targets; treat calculator coefficients as assumptions to test.",
        "Little's Law relates average work in the system to arrival throughput and average time: L = λW in a stable population. At 20 requests/s and two seconds average residence time, about 40 requests are present on average. This is not a p99 guarantee or a memory estimate by itself. Use it to check consistency between observed concurrency and latency, then inspect distribution tails."
      ],
      bullets: [
        "Bin-pack without fragmenting scarce accelerator shapes",
        "Data/model locality reduces transfer cost",
        "Queue age exposes insufficient service rate"
      ]
    },
    {
      title: "Fairness is explicit policy",
      paragraphs: [
        "FIFO can let one huge request block many small ones. Fair-share scheduling, tenant weights, size classes, and concurrency caps make service predictable. Cost-aware routing may choose a smaller model or batch path.",
        "FIFO is easy to understand but a long job at the front can delay many short ones. Size classes, preemption where supported, or separate queues reduce this head-of-line blocking. A scheduler also needs a fairness unit: jobs, compute time, tokens, or reserved capacity. Equal request counts can give very unequal resource shares.",
        "Give each tenant bounded concurrency and a resource budget, then allocate remaining capacity with a policy such as weighted fair sharing. Protect a minimum batch share from permanent interactive pressure. If you estimate job cost incorrectly, reconcile actual usage and adjust future admission; otherwise a tenant can repeatedly obtain more capacity than its reservation suggests.",
        "Test overload as a normal operating case. Remove part of the fleet, double job size, or introduce one tenant with giant prompts. Specify what is rejected, queued, downgraded, or cancelled, and measure waiting time by class. A healthy average utilization is not enough if one class misses deadlines or one tenant monopolizes device memory."
      ],
      bullets: [
        "Reserve capacity for critical traffic",
        "Preemption requires checkpoint or restart policy",
        "Charge/attribute shared resource cost"
      ]
    }
  ],
  // 12. AI / LLM–flavored system design
  12: [
    {
      title: "Separate planes and stages",
      paragraphs: [
        "The edge authenticates and reserves quota; orchestration assembles context and policy; the model gateway routes; inference workers batch and stream; tool runners execute behind isolation; telemetry and eval pipelines learn from outcomes.",
        "Trace an enterprise assistant in stages. The application authenticates the caller, assembles authorized evidence, asks the model for text or a proposed tool call, validates any action, and publishes the result. The model is one stage in a larger system. Distinguish a bad answer from a failed request, an unauthorized retrieval, and a duplicated action; each needs different telemetry and recovery.",
        "Keep policy and durable run state outside the generated conversation. Record tenant, input identity, selected versions, tool attempts, and terminal status in application-owned storage. A control plane changes model routing, quotas, or tool policy; the data plane serves runs under a known policy version. A control-plane outage should have an explicit effect on existing and new runs.",
        "Streaming improves perceived responsiveness but exposes partial state. Label output that is incomplete, record a terminal result, and let clients inspect a run after disconnection. Do not assume that displaying a plausible final sentence means an external action succeeded. Persist effects and authoritative tool receipts separately from generated prose."
      ],
      bullets: [
        "Track time-to-first-token separately from total time",
        "Cancel work when the client disconnects",
        "Keep authorization attached to retrieved context and tools"
      ]
    },
    {
      title: "Optimize tokens as the core resource",
      paragraphs: [
        "Input tokens consume prefill compute and KV memory; output tokens consume sequential decode time. Prefix caching, continuous batching, smaller context, and model routing change both latency and cost.",
        "Model request cost depends on work shape: input length, generated length, model choice, retries, tool loops, and reused prefixes. Two requests can differ by orders of magnitude in work while counting equally in RPS. Reserve estimated tokens and spend at admission, bound output and step counts, then reconcile actual usage including failed attempts.",
        "Separate queue delay, prefill latency, and decode speed. A faster first token does not guarantee faster completion if generation is long. A cache hit on a reusable prefix can help prefill without making a stale retrieved document safe. Cache identity must include the inputs and versions that determine behavior; permission checks remain a separate application responsibility.",
        "When capacity is scarce, choose degradation by user need. A long research task may become an asynchronous job, while a short interactive extraction may be prioritized. A smaller model is a valid fallback only if it satisfies the required capability and quality bar. Make these choices visible in the product contract and evaluation slices."
      ],
      bullets: [
        "Batch compatible work without excessive waiting",
        "Budget context among instructions, history, retrieval, and tool results",
        "Cache only when privacy and semantic equivalence are clear"
      ]
    },
    {
      title: "Bound probabilistic behavior",
      paragraphs: [
        "Wrap model decisions in deterministic checks: schemas, policies, permission gates, time/cost budgets, loop detection, and idempotent tools. Evals test end-to-end outcomes, not only prose quality.",
        "An LLM can propose a tool argument; deterministic code must authorize the principal, resource, and effect. Bind approval to the exact action parameters and recheck relevant permissions before execution. If access changes while a run waits, the old conversation is not a fresh grant. The same rule applies before publishing restricted evidence to the user.",
        "Define completion with evidence: cited passages for a knowledge answer, a durable operation receipt for an action, or an inspected artifact for a report. Then build an evaluation plan with unsupported answers, stale sources, denied permissions, duplicate calls, and provider failure. Test the whole path because a strong model cannot compensate for a broken authorization filter.",
        "Before drawing a complicated agent architecture, compare a fixed workflow. If steps are known—retrieve policy, check account, propose reply—a workflow offers explicit state and recovery. Use a bounded adaptive loop only where observations genuinely change the path. Its budgets, stop conditions, and escalation behavior belong in the design from the start."
      ],
      bullets: [
        "Fallback quality change must be product-visible when material",
        "Moderation has input/output/tool surfaces",
        "Telemetry needs model and prompt versions"
      ]
    }
  ],
  // 13. Common interview design problems
  13: [
    {
      title: "Map prompts to dominant difficulty",
      paragraphs: [
        "Feeds are fan-out and ranking. Chat is ordered low-latency delivery plus offline sync. File storage is metadata plus immutable blobs. Autocomplete is prefix retrieval under a tight latency budget. Payments are ledgers and idempotent state transitions.",
        "Classifying a prompt means finding its invariant and dominant access pattern, not matching it to a memorized diagram. A feed emphasizes fan-out and freshness; chat emphasizes conversation ordering and delivery; file storage separates metadata from large immutable bodies. Start with one representative request and ask which part becomes difficult under the supplied scale and failure constraints.",
        "Compare two feed accounts. An author with 200 followers can fan out new posts to follower inboxes cheaply. An author with 20M followers creates an expensive write burst. A hybrid can precompute ordinary authors and merge celebrity posts at read time. It adds read complexity and freshness rules, but targets the actual skew. “Use fan-out on write” is incomplete without the follower distribution.",
        "Reuse reasoning patterns across prompts: stable operation IDs for retries, bounded queues for overload, authorization at data access, and measured triggers for scaling. Keep the product-specific semantic question visible. Duplicating a recommendation is annoying; duplicating a money movement can break an invariant. The same infrastructure component does not imply the same acceptable failure behavior."
      ],
      bullets: [
        "Name the hardest invariant",
        "Name the hottest path",
        "Name the acceptable degradation"
      ]
    },
    {
      title: "Infrastructure prompts need operators",
      paragraphs: [
        "Schedulers, caches, gateways, metrics systems, and feature flags are judged through control/data plane separation, propagation behavior, tenant isolation, and operational safety.",
        "A job scheduler has a control path for submitting and inspecting work and a data path for acquiring and executing it. Explain who owns a lease, how a stale worker is fenced, and how fairness is measured. A distributed cache similarly needs placement, membership, eviction, hot-key handling, and behavior during node loss. The operator's recovery path is part of the design.",
        "For a metrics platform, high ingestion throughput is only one difficulty. Unbounded label combinations can create huge series counts; retention and aggregation choices affect storage and queries. For feature flags, compare a control plane that edits configuration with a serving path that evaluates a cached version. Decide what happens if updates stop propagating while application traffic continues.",
        "Build a short comparison page after several problems. Record the core invariant, hot path, partition key, failure response, and first scaling trigger for each. If all rows say “cache, queue, database,” revisit the designs: you have recorded components instead of the mechanisms that distinguish the problems."
      ],
      bullets: [
        "Configuration rollout needs versions and rollback",
        "Control plane outage should not always stop data plane",
        "Think about cardinality and noisy neighbors"
      ]
    },
    {
      title: "AI prompts combine familiar patterns",
      paragraphs: [
        "LLM chat adds expensive streaming compute to messaging. Coding agents add long-running job orchestration and sandboxed tools. RAG adds search indexing, ACLs, and grounded generation. Inference APIs add admission and GPU scheduling.",
        "Map AI prompts to familiar systems before adding model-specific concerns. An LLM chat service combines conversation storage with expensive streaming compute. A coding agent combines job orchestration, repository state, tool execution, and verification. Enterprise RAG combines document ingestion, search, permissions, evidence assembly, and generation. Each still needs ordinary ownership and recovery rules.",
        "Then identify what changes: variable output quality, token-shaped demand, model capability differences, and untrusted text influencing proposed actions. A successful HTTP response can contain a wrong answer. Track request availability separately from supported task completion, and define cost per useful result rather than only cost per model call.",
        "Practice one prompt with different constraints instead of adding new prompts forever. Reduce the scale by ten, remove a region, revoke access mid-run, or double output length. Explain exactly which earlier decision changes. This makes transfer visible: you are adapting a mechanism to evidence rather than reciting the same architecture faster."
      ],
      bullets: [
        "Reuse known primitives; emphasize new failure modes",
        "Separate model quality from system reliability",
        "Close with evals and cost"
      ]
    }
  ],
  // 14. Deep-dive tradeoff drills
  14: [
    {
      title: "Use the FACT frame",
      paragraphs: [
        "Frame constraints, Alternatives, Consequences, Take a position. Compare on the few dimensions that matter: correctness, latency, scale, complexity, cost, and organizational fit.",
        "A useful comparison begins with a deciding constraint. For an interactive status stream, suppose the browser only receives updates and must reconnect after drops. Compare SSE with WebSockets on one-way streaming, replay protocol, deployment support, and operational complexity. If no bidirectional requirement exists, SSE may meet the contract with less machinery. Adding bidirectional presence later could change the choice.",
        "Write the alternatives fairly. Do not compare a carefully operated database with an imaginary alternative that has no backups or indexes. Include migration cost, operational knowledge, team size, and failure behavior alongside latency and throughput. A provider service can reduce infrastructure ownership while adding dependency, pricing, and capability constraints.",
        "Finish with a decision, its main downside, and a measurable reversal trigger. “We choose one relational primary; revisit after representative tests show write saturation despite query and index fixes” is reviewable. “We might use NoSQL later” is not a trigger because it names neither the observed problem nor the condition under which the alternative helps."
      ],
      bullets: [
        "Reject false binaries; hybrids are valid when justified",
        "Do not hide operational cost",
        "Say which requirement dominates"
      ]
    },
    {
      title: "Optimize for the current horizon",
      paragraphs: [
        "The simplest architecture that meets projected scale is usually strongest. Preserve seams for growth, but do not pay distributed-system costs before they buy something.",
        "Architecture has a planning horizon. A system expected to handle 2k writes/s in the next year does not automatically benefit from the same topology as one handling 2M. Estimate the workload and growth, choose headroom, and state what is uncertain. If the growth estimate is weak, preserve a migration seam instead of implementing every future scale mechanism now.",
        "Reversibility changes how much evidence you need. Changing a cache TTL is relatively cheap; moving an established data model across stores can be expensive. Spend more analysis on ownership, identifiers, and durable contracts, because other parts accumulate around them. Keep technology choices behind clear boundaries when that makes a later migration feasible.",
        "A migration trigger needs a migration outline. If the trigger is tenant skew, explain whether you will split a tenant, add subkeys, or move it to dedicated capacity. Say how reads find the new owner and how writes avoid double ownership during transition. This demonstrates that simplicity today is a deliberate choice with a credible next step."
      ],
      bullets: [
        "Scale estimates define the horizon",
        "Operational familiarity is a valid factor",
        "Migration triggers make simplicity credible"
      ]
    },
    {
      title: "Defend without rigidity",
      paragraphs: [
        "When challenged, restate the changed assumption and update the choice. A revised design is good reasoning, not failure. Keep the invariant stable even if mechanism changes.",
        "An interviewer may change a premise rather than challenge your competence. “Now the customer requires zero accepted-write loss” invalidates an asynchronous failover assumption. Restate the new invariant, identify the affected write acknowledgement and promotion paths, and compare synchronous acknowledgement or refusing writes when the required replicas are unavailable.",
        "Keep valid parts of the design. A changed durability promise does not automatically invalidate the API or blob layout. Draw the smallest necessary change, then discuss latency, availability, and cost consequences. A well-reasoned revision is stronger than defending an obsolete assumption or replacing every box without explanation.",
        "Practice speaking the complete chain: deciding requirement → candidate mechanisms → choice → downside → evidence that would change it. Use a concrete workload, not a universal slogan. Once the listener understands that chain, stop and invite a deeper question. Concision becomes possible because the reasoning is complete, not because the important caveats were omitted."
      ],
      bullets: [
        "Ask what constraint the interviewer is changing",
        "Separate preference from requirement",
        "Name the downside of your own choice first"
      ]
    }
  ],
  // 15. Interview execution framework
  15: [
    {
      title: "Drive a shared agenda",
      paragraphs: [
        "Restate the problem, ask architecture-changing questions, state assumptions, estimate scale, and propose the two areas worth deeper attention. Tell the interviewer how you plan to spend time and invite correction.",
        "Open with a short restatement and a few questions whose answers change architecture. For a public inference API, ask who the tenants are, which capabilities are required, whether requests stream, and what latency and spend limits matter. State supplied facts separately from assumptions. You do not need to collect every possible requirement before showing a first design.",
        "Propose an agenda after the initial estimate: “I will cover the request contract and data ownership, then go deep on admission and streaming recovery.” This gives the interviewer a chance to redirect. Keep a visible list of invariants and unresolved questions so later choices can refer back to them. Check that the discussion is still solving the same problem after a constraint changes.",
        "Allocate time adaptively. If the interviewer chooses the data model, shorten a less important capacity discussion rather than ignoring the request to preserve a memorized timeline. Reserve time to close with failure, security, cost, and risks. A useful structure prevents omissions while leaving room for collaboration."
      ],
      bullets: [
        "Keep a visible requirements/SLO list",
        "Use named arrows and numbered request flows",
        "Pause for steering at phase boundaries"
      ]
    },
    {
      title: "Narrate decisions, not drawing",
      paragraphs: [
        "Instead of ‘then add Redis,’ say ‘reads outnumber writes 100:1 and allow 30 seconds of staleness, so a regional cache removes primary load; here is invalidation and failure behavior.’",
        "Narrate one numbered request end to end. A tenant submits an operation ID; admission reserves estimated token capacity; a worker streams typed events; completion reconciles usage and persists status. At each boundary explain authority, durability, deadline, and recovery. This exposes correctness more effectively than naming a gateway, queue, and database without connecting them.",
        "Use numbers where they decide something. If the survivor region cannot serve failed-over traffic within the SLO, calculate the shortfall and choose admission or reserved capacity. If the bottleneck is one hot key, do not present aggregate capacity as the answer. Distinguish illustrative assumptions from measured limits so the listener can see what needs a benchmark.",
        "Make tradeoffs in complete sentences. “This queue absorbs bursts but adds waiting time and an operational dependency; the client gets durable status and can cancel before execution” connects mechanism to consequence. Name the drawback before you are asked. A design review evaluates judgment, not whether every component seems beneficial in isolation."
      ],
      bullets: [
        "Mechanism follows constraint",
        "Every component gets an owner and failure mode",
        "Revisit estimates at bottlenecks"
      ]
    },
    {
      title: "Recover like a senior engineer",
      paragraphs: [
        "When a flaw appears, acknowledge it precisely, preserve the product invariant, and change the smallest necessary part. Explain migration or reconciliation if data/state already exists.",
        "When you discover a flaw, name its effect precisely. “A retry can create a second charge because the provider result is not durably tied to the operation ID” is actionable. “Reliability is a concern” is too broad. Preserve the business invariant, then add the smallest repair and explain any new failure state it introduces.",
        "For existing data, include transition behavior. Adding an idempotency table today does not identify yesterday's ambiguous operations. You may need a reconciliation process before enabling automatic retries. Acknowledging that limitation demonstrates operational reasoning; quietly redrawing the happy path leaves the real system in an undefined state.",
        "After the mock, use evidence rather than a feeling of fluency. Pick timestamps showing whether you quantified the bottleneck, traced an uncertain effect, or revised a changed assumption. Rehearse the weakest segment by itself, then try a fresh prompt. Improvement should appear in a new decision or clearer explanation, not only a higher self-assigned number."
      ],
      bullets: [
        "Do not erase the whole design reflexively",
        "State what remains valid",
        "Close with risks, metrics, and next experiment"
      ]
    }
  ],
} satisfies Record<number, Lesson[]>;
