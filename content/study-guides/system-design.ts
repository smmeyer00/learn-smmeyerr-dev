import { systemDesignPractice } from "../practice/system-design";
import type { ChapterStudyGuide } from "../types";
import { sources as s } from "../references";

// Original teaching scenarios. All traffic, latency, and capacity values in
// these examples are assumptions for the exercise, not measured benchmarks.
export const systemDesignStudyGuides = {
  1: {
    ...systemDesignPractice[1],
    minutes: [25, 100, 35, 20],
    example: {
      title: "Size a paste service before choosing its storage",
      scenario:
        "Assume 20M MAU, 25% active daily, three reads per daily user, 50k new pastes per day, 4 KB bodies, and a 5× read peak.",
      steps: [
        "Daily readers = 20M × 0.25 = 5M. Fifteen million reads/day gives about 174 average reads/s, or 868/s at the assumed peak.",
        "Creates average 50,000 / 86,400 = 0.58/s. With the same peak factor, provision for roughly three creates/s before accounting for bursts.",
        "Bodies add about 200 MB/day, or 73 GB/year using decimal units. Three replicas make 219 GB; indexes, metadata, backups, and overhead are extra.",
        "Draw create → metadata transaction → body storage, and read → lookup → body fetch. State expiry and private-paste access rules on both paths.",
      ],
      decision:
        "A single relational primary is a plausible starting point for metadata. The estimates justify measuring its real workload before introducing shards.",
      limitation:
        "A low average write rate does not prove capacity. Burst shape, body-size variance, indexes, durability settings, and measured query latency still matter.",
    },
    assignment: {
      deliverable:
        "A one-page design with assumptions, an estimate table, two API shapes, and a labeled request diagram.",
      tasks: [
        "Calculate reads, creates, bandwidth, and retained bytes with units; explain which number could change your design.",
        "Draw a minimal v1 and trace one successful create, one read, and an expired private paste.",
        "Spend a separate pass removing boxes that satisfy no stated requirement; present the result aloud and revise it.",
      ],
      variations: [
        "Increase the largest paste from 4 KB to 20 MB and introduce a viral hot paste.",
        "Repeat the design with 1% DAU/MAU, then 50%; explain which assumptions dominate.",
      ],
      rubric: [
        "MAU becomes daily behavior through an explicit assumption.",
        "Every box owns a responsibility and every arrow names data.",
        "The sharding decision names a measured limit or a trigger for revisiting it.",
      ],
    },
    recall: [
      {
        prompt:
          "Five million daily users each read three pastes. With a 5× peak factor, what is peak read RPS?",
        sampleAnswer:
          "5,000,000 × 3 / 86,400 × 5 ≈ 868 reads/s. The peak factor is an assumption to validate, rather than a property of MAU.",
      },
      {
        prompt:
          "A colleague wants shards because there are 20M users. What evidence would you request?",
        sampleAnswer:
          "Peak writes and reads, query plans, hot-key distribution, retained data and index size, and headroom on representative hardware. User count alone does not identify a database limit.",
      },
    ],
    references: [s.slos, s.storage],
  },
  2: {
    ...systemDesignPractice[2],
    minutes: [25, 100, 35, 20],
    example: {
      title: "Fit retries inside a request deadline",
      scenario:
        "An API has an 800 ms user deadline. Authentication consumes 50 ms, orchestration 50 ms, and the first dependency attempt times out after 300 ms.",
      steps: [
        "The first attempt leaves 400 ms. Reserve 100 ms for response handling and 50 ms for backoff; a second attempt may use at most 250 ms.",
        "Carry the remaining deadline downstream. Do not let the second attempt start another independent 800 ms clock.",
        "If this is a create-message call, persist an idempotency key with the committed message. A timeout may have happened after the write succeeded.",
        "Use an HTTP event stream for incremental server output; explicitly propagate disconnects so abandoned generation stops consuming resources.",
      ],
      decision:
        "Own retries at one boundary, cap their time and count, and deduplicate where the effect is committed.",
      limitation:
        "The numbers are an exercise budget. Real deadlines must include network variation and connection setup; SSE alone does not provide exactly-once delivery.",
    },
    assignment: {
      deliverable:
        "An API contract and three sequence diagrams: success, timeout-after-commit, and client disconnect.",
      tasks: [
        "Allocate a deadline across edge, service, and dependency; show a retry that fits and one that must be refused.",
        "Define request IDs, idempotency-key scope and retention, stream event shapes, cancellation, and terminal error behavior.",
        "Compare SSE and WebSockets for this workload, then rehearse the contract with a peer or a recorded explanation.",
      ],
      variations: [
        "Add a bidirectional voice session; reconsider the transport.",
        "Let both the client and service retry three attempts; trace the resulting downstream load.",
      ],
      rubric: [
        "All attempts fit inside the user deadline.",
        "The timeout-after-commit case returns or recovers the original result.",
        "A disconnect has explicit cancellation and accounting behavior.",
      ],
    },
    recall: [
      {
        prompt:
          "Three call layers each allow three attempts. What is the maximum leaf-call count?",
        sampleAnswer:
          "3³ = 27 attempts if every layer exhausts its budget. Three retries plus an initial attempt would instead mean four attempts per layer, so clarify the wording.",
      },
      {
        prompt:
          "Why is retrying a timed-out POST dangerous even if the server returned no response?",
        sampleAnswer:
          "The server may have committed the side effect before the response was lost. An idempotency contract at that effect boundary is needed to distinguish retry from a new operation.",
      },
    ],
    references: [s.retries, s.loadBalancing],
  },
  3: {
    ...systemDesignPractice[3],
    minutes: [30, 140, 50, 20],
    example: {
      title: "Prevent two buyers from buying the last item",
      scenario:
        "An inventory row has remaining = 1. Two requests arrive together and each wants one unit.",
      steps: [
        "A read-then-write sequence can let both requests observe one available unit. Merely wrapping ordinary reads in a transaction may not enforce the invariant.",
        "Use an atomic conditional update: decrement only where remaining > 0, then check the affected-row count. One request succeeds and one gets sold-out.",
        "Store the reservation and its idempotency key transactionally with the decrement. A retry must retrieve the reservation rather than decrement again.",
        "Index the critical product lookup and reservation lookup. Add a purchase-history index only after naming its access pattern and write cost.",
      ],
      decision:
        "Use a relational transaction and an atomic invariant check before distributing inventory ownership across shards.",
      limitation:
        "Reservations, expiry, payment failure, and multi-item orders add state transitions. This one-row example does not solve those workflows automatically.",
    },
    assignment: {
      deliverable:
        "A schema, access-pattern table, and transaction pseudocode for inventory reservations.",
      tasks: [
        "Specify primary and secondary keys for reserve, confirm, expire, and list-by-customer operations.",
        "Write two concurrent execution timelines and show the exact statement that protects stock.",
        "Estimate index growth, compare a tenant-based partition key with a product-based key, and revise after reviewing a hot-product workload.",
      ],
      variations: [
        "An order reserves three products atomically.",
        "One tenant owns half the writes; propose a mitigation and its query cost.",
      ],
      rubric: [
        "The stock invariant survives a concurrent interleaving.",
        "Keys follow named access patterns.",
        "Retries and reservation expiry cannot create extra inventory.",
      ],
    },
    recall: [
      {
        prompt:
          "Why can two transactions that each read stock = 1 still oversell?",
        sampleAnswer:
          "Isolation level and statement semantics matter. If each reads before either decrements, both can make the same decision. An atomic conditional update, an appropriate lock, or a suitable serializable transaction can enforce the invariant; handle conflicts and retries.",
      },
      {
        prompt: "What does a secondary index buy, and what does it cost?",
        sampleAnswer:
          "It improves a particular lookup or ordering pattern while adding storage and maintenance work to writes. Its value depends on selectivity, query shape, and the workload.",
      },
    ],
    references: [s.storage],
  },
  4: {
    ...systemDesignPractice[4],
    minutes: [25, 100, 35, 20],
    example: {
      title: "A high hit rate can still overload the source",
      scenario:
        "A service handles 10k reads/s. Cache hit rate falls from 95% to 90%; one hot key receives 30% of traffic and takes 200 ms to recompute.",
      steps: [
        "At 95% hits, the source receives 500 reads/s. At 90%, it receives 1,000/s: a five-point loss doubles source load.",
        "For the expiring hot key, 10,000 × 0.30 × 0.2 = 600 requests arrive during one recompute window.",
        "Coalesce concurrent recomputations for that key. Other callers wait or receive an explicitly bounded stale value.",
        "Add expiry jitter across keys and test cache loss. Protect the source with admission control even if the expected hit rate is excellent.",
      ],
      decision:
        "Treat cache behavior as part of the source capacity and correctness contract, including staleness and cold starts.",
      limitation:
        "One coalesced request assumes a successful recomputation and a correctly scoped coordinator. Failures, lock expiry, and multiple cache nodes need their own behavior.",
    },
    assignment: {
      deliverable:
        "A cache policy plus a before/after load table for steady state, expiry, and a cold fleet.",
      tasks: [
        "Use the lab to predict three source-load changes before moving the controls; record your assumptions.",
        "Choose keys, TTLs, invalidation ownership, and a maximum stale age for a product-detail endpoint.",
        "Trace expiry under concurrency, then rehearse a cold-cache incident and revise the admission policy.",
      ],
      variations: [
        "The cached result is an account balance with stricter freshness needs.",
        "Recompute time grows from 200 ms to 2 s while traffic stays constant.",
      ],
      rubric: [
        "Source load is calculated from misses rather than total traffic.",
        "The policy names an acceptable stale age.",
        "Cache loss cannot send unbounded traffic to the database.",
      ],
    },
    recall: [
      {
        prompt:
          "At 20k reads/s, what happens to source RPS when hits fall from 99% to 98%?",
        sampleAnswer:
          "Misses rise from 200 to 400/s. The hit rate changes by one percentage point while source load doubles.",
      },
      {
        prompt:
          "Why does TTL jitter not completely solve a single viral key expiring?",
        sampleAnswer:
          "Jitter spreads expiries across different keys. Concurrent misses for the same hot key can still pile up; coalescing, early refresh, or a bounded stale response addresses that path.",
      },
    ],
    references: [s.caching, s.overload],
  },
  5: {
    ...systemDesignPractice[5],
    minutes: [30, 140, 50, 20],
    example: {
      title: "Survive a worker crash after sending an email",
      scenario:
        "A worker consumes notification N, sends it, and crashes before acknowledging the queue message.",
      steps: [
        "The broker redelivers N. At-least-once delivery has worked as designed, but an unguarded consumer sends twice.",
        "Give the notification a durable business ID. Track attempts and provider message IDs, and use a provider idempotency feature where available.",
        "A database sent flag alone cannot atomically cover an external send. After an ambiguous provider timeout, reconcile status before blindly replaying.",
        "Use an outbox to atomically record notification intent with the originating transaction. Bound retries, route poison messages to a dead-letter path, and monitor oldest-message age.",
      ],
      decision:
        "Separate durable intent, delivery attempts, and externally confirmed effects. Document where duplicates remain possible.",
      limitation:
        "Broker transactions do not automatically include an email provider. Exactly-once claims must name the boundary they actually cover.",
    },
    assignment: {
      deliverable:
        "An outbox schema, consumer state machine, and crash/replay matrix for notifications.",
      tasks: [
        "Trace failures before publish, after publish, before send, after send, and before acknowledgement.",
        "Assign ordering and partition keys; calculate catch-up time after a ten-minute consumer outage.",
        "Define retry limits, dedup retention, dead-letter ownership, and a safe replay procedure; run the timelines again with your revised design.",
      ],
      variations: [
        "Replace email with a payment provider and tighten the effect contract.",
        "One poison message blocks an ordered partition; define the business consequence of skipping it.",
      ],
      rubric: [
        "The origin transaction cannot silently lose notification intent.",
        "Every crash point has a replay outcome.",
        "The external-side-effect ambiguity is explicitly acknowledged.",
      ],
    },
    recall: [
      {
        prompt:
          "A backlog has 60k jobs. New arrivals are 100/s and workers process 300/s. How long to drain it?",
        sampleAnswer:
          "Net drain is 200 jobs/s, so 60,000 / 200 = 300 seconds, assuming stable rates and no retries. Dividing by 300 would ignore incoming work.",
      },
      {
        prompt:
          "Why can a sent flag plus an acknowledgement still duplicate an email?",
        sampleAnswer:
          "A crash can occur between the provider side effect and the durable flag or acknowledgement. Without a shared transaction or provider idempotency/reconciliation, that gap remains ambiguous.",
      },
    ],
    references: [s.kafka, s.retries],
  },
  6: {
    ...systemDesignPractice[6],
    minutes: [30, 140, 50, 20],
    example: {
      title: "A lease expires while its old holder is paused",
      scenario:
        "Worker A holds fencing token 41 and pauses. Its lease expires; worker B obtains token 42 and commits new state. A resumes.",
      steps: [
        "A cannot infer current ownership from its old local lease view. Pauses and delayed messages can outlive the lease.",
        "Attach monotonically increasing fencing tokens to writes. The protected store remembers the highest accepted token and rejects A's later token 41.",
        "The store must enforce the check atomically with the write; merely logging a token offers no protection.",
        "For a five-node majority consensus group, three communicating nodes can commit under its protocol. A two-node minority must not independently accept conflicting leader writes.",
      ],
      decision:
        "Use the consensus system for authority and enforce fencing at the resource that must be protected.",
      limitation:
        "R + W > N alone does not implement linearizability. Version ordering, concurrent writers, membership changes, and protocol rules still matter.",
    },
    assignment: {
      deliverable:
        "A partition timeline and a fenced-write protocol for a job scheduler.",
      tasks: [
        "Draw two leaders across a pause, lease expiry, and delayed write; mark which write the store accepts.",
        "Use the lab for majority, minority, and node-down cases; explain each outcome without relying on color.",
        "Compare an availability-first status view with a strict job-ownership path, then defend their different consistency contracts.",
      ],
      variations: [
        "The backing store cannot enforce fencing tokens.",
        "A client must read its own accepted update during a regional partition.",
      ],
      rubric: [
        "The stale holder is rejected at the protected resource.",
        "The minority has an explicit failure response.",
        "The chosen consistency promise names the operation it covers.",
      ],
    },
    recall: [
      {
        prompt:
          "Why does checking a lease immediately before writing still leave a race?",
        sampleAnswer:
          "The process may pause after checking and before writing. Ownership can change in that interval. The destination must reject a stale fencing token atomically with the effect.",
      },
      {
        prompt:
          "For N=5, R=3, W=3, what does quorum overlap establish—and what does it leave unspecified?",
        sampleAnswer:
          "Any such read and write sets intersect. That arithmetic alone does not specify how replicas resolve versions or concurrent writes, or guarantee a linearizable protocol.",
      },
    ],
    references: [s.raft, s.storage],
  },
  7: {
    ...systemDesignPractice[7],
    minutes: [25, 100, 35, 20],
    example: {
      title: "Spend an availability budget deliberately",
      scenario:
        "A checkout path targets 99.9% successful requests over a 30-day window. Assume failures are evenly spread for the time-equivalent calculation.",
      steps: [
        "The allowed failure fraction is 0.001. Thirty days contain 43,200 minutes, giving a time equivalent of 43.2 minutes; request-based accounting still counts actual failed requests.",
        "A 20-minute outage would consume about 46% of that time-equivalent budget. At peak traffic it can consume a larger share of a request-based budget.",
        "Shed optional recommendations before rejecting checkout. Put independent dependency pools behind bounded queues and deadlines.",
        "Test recovery with the primary payment dependency slow rather than fully down; a reachable but slow dependency can exhaust concurrency.",
      ],
      decision:
        "Protect the critical user operation with isolation and an explicit degradation ladder.",
      limitation:
        "Dependency availability percentages cannot generally be multiplied without assumptions about independence and the request path.",
    },
    assignment: {
      deliverable: "A checkout SLO, failure matrix, and recovery runbook.",
      tasks: [
        "Define the success numerator, denominator, measurement window, and excluded traffic.",
        "Rank features by what can degrade; trace timeout, retry, and concurrency limits for each dependency.",
        "Run a tabletop incident with a slow payment dependency, recover it, and revise the runbook from the gaps.",
      ],
      variations: [
        "The outage occurs during the largest sale of the month.",
        "The fallback is also slow because it shares the same database.",
      ],
      rubric: [
        "The SLO measures user success.",
        "Optional failures cannot consume all checkout capacity.",
        "Recovery includes queue draining and a safe return from fallback.",
      ],
    },
    recall: [
      {
        prompt:
          "What is the downtime equivalent of a 99.95% target over 30 days?",
        sampleAnswer:
          "43,200 × 0.0005 = 21.6 minutes. For a request-based SLO, the actual budget is a failure count, and traffic distribution changes the outage impact.",
      },
      {
        prompt: "Why can retries delay recovery from overload?",
        sampleAnswer:
          "They add work while capacity is constrained. Bounded attempts, backoff with jitter, load shedding, and a retry budget prevent recovery traffic from sustaining the overload.",
      },
    ],
    references: [s.slos, s.overload, s.retries],
  },
  8: {
    ...systemDesignPractice[8],
    minutes: [25, 100, 35, 20],
    example: {
      title: "The average is healthy while one tenant is failing",
      scenario:
        "Overall API success is 99.95%, but a large tenant reports timeouts after a deploy.",
      steps: [
        "Start from the user's operation: successful responses within its deadline. Segment by region, route, deployment version, and a controlled tenant cohort.",
        "Use traces to locate queue wait before the database call. The database's own average latency can remain normal while callers time out waiting for a connection.",
        "Compare saturation and tail latency with the previous release. Keep request IDs in logs for investigation rather than adding an unbounded ID label to every metric.",
        "Roll back or cap the offending workload, then confirm recovery through the same tenant-facing success signal.",
      ],
      decision:
        "Alert on user-visible failure and use bounded dimensions plus traces to explain it.",
      limitation:
        "Sampling can hide rare incidents. Retention, privacy, and diagnostic coverage must be chosen deliberately.",
    },
    assignment: {
      deliverable:
        "A dashboard sketch, two actionable alerts, and a short incident report.",
      tasks: [
        "Specify latency, traffic, errors, saturation, and a business success metric with units and useful slices.",
        "Trace a slow request across queue, service, and dependency; identify what each signal can establish.",
        "Write the first five incident actions and a postmortem with one prevention change and one detection change.",
      ],
      variations: [
        "Tracing is sampled at 1% and the failure affects 0.01% of requests.",
        "A proposed dashboard adds user_id and request_id as metric labels.",
      ],
      rubric: [
        "Alerts identify user impact and an owner action.",
        "Metrics avoid uncontrolled cardinality.",
        "The diagnosis distinguishes queue time from service time.",
      ],
    },
    recall: [
      {
        prompt:
          "Why can a normal database latency dashboard coexist with application timeouts?",
        sampleAnswer:
          "The delay may occur before the database observes the request, such as connection-pool or admission wait. End-to-end timing and traces expose that missing segment.",
      },
      {
        prompt: "Where would you put a request ID for debugging, and why?",
        sampleAnswer:
          "In correlated logs and traces. As a metric label it creates a new series per request and can explode cardinality without providing useful aggregation.",
      },
    ],
    references: [s.monitoring, s.slos],
  },
  9: {
    ...systemDesignPractice[9],
    minutes: [25, 100, 35, 20],
    example: {
      title: "An authenticated user requests another tenant's file",
      scenario:
        "GET /files/123 is authenticated, but file 123 belongs to a different workspace. A cached response exists under the key file:123.",
      steps: [
        "Authentication establishes who is calling; it does not establish access to file 123. Resolve membership and object permissions server-side.",
        "Scope cache entries and database queries to the authorized tenant and object policy. A globally unique ID alone is not an authorization check.",
        "Issue short-lived download access only after authorization and avoid logging secret-bearing URLs.",
        "Bound downloads, expensive scans, and signed-link creation by tenant and account risk; log denied access for investigation without exposing file existence unnecessarily.",
      ],
      decision:
        "Authorize every object access at the service boundary and preserve that scope through caching and storage.",
      limitation:
        "A tenant-prefixed cache key prevents one mix-up but does not replace authorization or handle permission revocation by itself.",
    },
    assignment: {
      deliverable:
        "A threat model and authorization matrix for a shared-file service.",
      tasks: [
        "List assets, identities, trust boundaries, and attacker-controlled inputs.",
        "Trace upload, preview, share, download, and revoke; define object authorization and audit evidence for each.",
        "Walk through guessed IDs, leaked URLs, oversized uploads, and quota abuse; revise the controls and failure responses.",
      ],
      variations: [
        "A member loses access while a cached preview and signed URL remain valid.",
        "An attacker distributes requests across many free accounts.",
      ],
      rubric: [
        "Checks cover objects as well as endpoints.",
        "Tenant scope survives caches and asynchronous workers.",
        "Cost limits and revocation behavior are explicit.",
      ],
    },
    recall: [
      {
        prompt: "Why is a valid login insufficient to serve GET /files/123?",
        sampleAnswer:
          "The principal must also be authorized for that specific object and action, including tenant membership and sharing rules. Authentication alone leaves an object-level authorization gap.",
      },
      {
        prompt: "What can remain accessible after revoking a file share?",
        sampleAnswer:
          "Previously issued bearer URLs, cached copies, and downloaded bytes may remain usable. Define short expiry, invalidation, and the limits of revocation instead of promising immediate recall of all copies.",
      },
    ],
    references: [s.security],
  },
  10: {
    ...systemDesignPractice[10],
    minutes: [25, 100, 35, 20],
    example: {
      title: "Fail over without forgetting the missing writes",
      scenario:
        "Region A accepts 100 writes/s and asynchronously replicates to B. B is 20 seconds behind when A becomes unreachable.",
      steps: [
        "At that assumed steady rate, up to roughly 2,000 recent writes may be missing at B. Replication lag is exposure, not proof that all those writes are permanently lost.",
        "Decide whether to wait, enter a read-only mode, or promote B with an accepted recovery-point gap. State the product consequence.",
        "Fence A before accepting conflicting writes at B, or use an ownership protocol that prevents both from acting as primary.",
        "After recovery, reconcile missing or conflicting records and plan failback. Verify that B has capacity for evacuated traffic and dependencies.",
      ],
      decision:
        "Choose failover behavior from the RPO, RTO, and ownership contract rather than routing health alone.",
      limitation:
        "Real lag is uneven and may be reported late. DNS changes do not move state, revoke old authority, or add capacity.",
    },
    assignment: {
      deliverable:
        "A regional topology, per-data-class residency table, and failover/failback runbook.",
      tasks: [
        "Specify ownership, replication, latency, RPO, and RTO for the critical write path.",
        "Simulate a region loss and account for in-flight requests, missing writes, and capacity in the survivor.",
        "Run a second tabletop for failback, including reconciliation and a rollback if promotion was mistaken.",
      ],
      variations: [
        "The application requires zero accepted-write loss.",
        "EU tenant data and its backups must remain in the EU; treat this as a supplied product constraint.",
      ],
      rubric: [
        "State authority is explicit during a partition.",
        "The failover plan accounts for data and capacity.",
        "Residency includes logs, backups, and operational paths.",
      ],
    },
    recall: [
      {
        prompt: "What does a 20-second replication lag imply at 100 writes/s?",
        sampleAnswer:
          "Roughly 2,000 recent writes are potentially absent at the replica under steady traffic. Lag alone does not establish permanent loss; recovery and reconciliation determine that.",
      },
      {
        prompt: "Why is switching DNS only one part of failover?",
        sampleAnswer:
          "Clients may retain old routes, the former primary may still accept writes, the new region may lack state or capacity, and dependencies may still point to the failed region.",
      },
    ],
    references: [s.raft, s.loadBalancing, s.slos],
  },
  11: {
    ...systemDesignPractice[11],
    minutes: [30, 140, 50, 20],
    example: {
      title: "Plan serving capacity in tokens and headroom",
      scenario:
        "Assume 100 requests/s, 1,000 input tokens and 200 output tokens per request. A measured fleet configuration in this fictional exercise sustains 25k output tokens/s at its target latency.",
      steps: [
        "The workload demands 100k input tokens/s and 20k output tokens/s. Keep those workloads separate because prefill and decode stress hardware differently.",
        "Decode demand is 80% of the stated capacity before retries, variance, and failure headroom. That does not prove the latency SLO is met for all prompt shapes.",
        "Losing a quarter of the fleet leaves 18.75k output tokens/s, below demand. Define queueing, shedding, shorter output caps, or fallback.",
        "Test representative length distributions and concurrency, including the KV-cache footprint, instead of extrapolating from an isolated tokens/s result.",
      ],
      decision:
        "Reserve headroom around a measured workload envelope and admit work using both compute and memory constraints.",
      limitation:
        "The capacity value is illustrative. Model architecture, batching, hardware, precision, and output distribution change actual throughput.",
    },
    assignment: {
      deliverable:
        "A capacity sheet, admission policy, and overload experiment plan.",
      tasks: [
        "Use the lab to compare short-chat and long-document traffic; record token demand and the dominant constraint.",
        "Allocate tenant fairness, interactive versus batch capacity, queue bounds, and a degraded service mode.",
        "Design load tests for long-tail lengths and a node loss; revise the fleet estimate using the results you would need to measure.",
      ],
      variations: [
        "Average output length doubles with unchanged request rate.",
        "A single tenant starts sending very long prompts while aggregate RPS stays normal.",
      ],
      rubric: [
        "Input and output token demand are both visible.",
        "Capacity includes failure headroom and memory limits.",
        "The overload response has a user-visible contract.",
      ],
    },
    recall: [
      {
        prompt:
          "At 120 requests/s and 300 output tokens/request, what is output-token demand?",
        sampleAnswer:
          "36,000 output tokens/s before retries. This must be compared with measured decode capacity under the relevant model, batching, concurrency, and latency target.",
      },
      {
        prompt: "Why can low RPS still overload an LLM service?",
        sampleAnswer:
          "A small number of long prompts or outputs can consume prefill compute, decode slots, and KV-cache memory. Request count hides the amount and shape of work.",
      },
    ],
    references: [s.serving, s.overload],
  },
  12: {
    ...systemDesignPractice[12],
    minutes: [30, 190, 60, 20],
    example: {
      title: "A knowledge assistant loses permission midway through a run",
      scenario:
        "An assistant searches tenant documents, drafts a cited answer, and can create a support ticket. The caller's document access is revoked during execution.",
      steps: [
        "Retrieve only evidence authorized for the caller and tenant; preserve source IDs, versions, and permission context with the evidence.",
        "Treat retrieved text as data. Its instructions cannot grant tool permissions or change the requested task.",
        "Before publishing a sensitive answer or executing the ticket action, revalidate the relevant access and action policy; define how a revoked run stops.",
        "Trace retrieval relevance, citation support, tool authorization, latency, and cost separately so an incident becomes a reproducible eval.",
      ],
      decision:
        "Put probabilistic generation inside a durable application workflow with explicit authorization and publication boundaries.",
      limitation:
        "Citations and structured outputs do not by themselves prove factual support or permission safety.",
    },
    assignment: {
      deliverable:
        "An enterprise assistant design with a read path, action path, run state machine, and eval plan.",
      tasks: [
        "Specify ingestion freshness, retrieval ACLs, evidence construction, streaming policy, and action approvals.",
        "Trace permission revocation, missing evidence, provider timeout, and duplicate tool delivery.",
        "Write ten evaluation cases across correctness, access, action safety, and abstention; use them to review and revise the design.",
      ],
      variations: [
        "The user requests an irreversible external action.",
        "The newest source contradicts a document already included in context.",
      ],
      rubric: [
        "Authorization persists through retrieval and effects.",
        "The workflow has bounded retries and recoverable state.",
        "Evaluation measures end-to-end success and separate failure stages.",
      ],
    },
    recall: [
      {
        prompt: "An answer has a citation. What two separate questions remain?",
        sampleAnswer:
          "Does the cited evidence support the claim, and is the caller allowed to see that evidence and its derived answer? A citation marker alone proves neither.",
      },
      {
        prompt: "Where should tool approval and permission checks run?",
        sampleAnswer:
          "In deterministic application code at the effect boundary, using the authenticated principal and current policy. The model proposes an action; its text does not establish authority.",
      },
    ],
    references: [s.rag, s.agents, s.injection],
  },
  13: {
    ...systemDesignPractice[13],
    minutes: [30, 210, 100, 20],
    example: {
      title: "The same feed design meets two very different accounts",
      scenario:
        "Most authors have 200 followers, while one celebrity has 10M. The product needs a fresh home feed with ranked posts.",
      steps: [
        "Write the read and publish paths separately. Pushing one normal post creates about 200 feed entries; pushing the celebrity's post creates 10M.",
        "A hybrid can fan out ordinary authors on write and merge celebrity posts on read. Name how ranking and pagination combine the two sources.",
        "Define idempotent post delivery and a versioned cursor so retries and delayed fan-out do not silently duplicate or skip entries.",
        "Test a new celebrity post during a worker backlog and decide which freshness or ranking guarantee degrades first.",
      ],
      decision:
        "Choose fan-out policy from follower distribution and freshness requirements, with a measured threshold for the hybrid.",
      limitation:
        "This is one design direction. Follow churn, deletion, ranking computation, and feed retention can change the decision.",
    },
    assignment: {
      deliverable:
        "Three design packets for a feed, a notification service, and a job scheduler, plus a comparison page.",
      tasks: [
        "For each system, spend one pass on requirements, estimates, API/data model, critical path, and failure behavior.",
        "Use the chapter drill for timed presentations; review recordings for unquantified claims and missing ownership.",
        "Compare what changed across problems: ordering, fan-out, leases, idempotency, and retention. Redraw the weakest design after feedback.",
      ],
      variations: [
        "Inject one random failure card into each packet.",
        "Repeat the weakest problem at one tenth the scale and remove unnecessary components.",
      ],
      rubric: [
        "Each design follows its workload rather than a memorized template.",
        "The hardest path has numbers and an explicit invariant.",
        "The comparison explains why similar components have different responsibilities.",
      ],
    },
    recall: [
      {
        prompt:
          "Why can average follower count be misleading for feed fan-out?",
        sampleAnswer:
          "A heavy-tailed distribution lets a small number of authors dominate fan-out work. Capacity and queue behavior must account for the largest accounts and burst patterns.",
      },
      {
        prompt: "What stays useful across all three design problems?",
        sampleAnswer:
          "A scoped user contract, estimates with units, explicit state ownership, named critical paths, and replay/failure semantics. Component choices follow those constraints.",
      },
    ],
    references: [s.kafka, s.caching, s.slos],
  },
  14: {
    ...systemDesignPractice[14],
    minutes: [25, 140, 55, 20],
    example: {
      title: "Make a reversible choice with a clear switch trigger",
      scenario:
        "A new service has two engineers, 50 writes/s, 99.9% availability needs, and no requirement to operate in multiple regions on day one.",
      steps: [
        "Compare a managed relational database with a custom distributed store on query fit, operational load, failure behavior, and cost.",
        "A managed relational service satisfies the stated access patterns while keeping ownership within the team's capacity.",
        "Record the alternative's real benefit, such as a needed multi-region write contract, along with the complexity it introduces now.",
        "Name the trigger for revisiting the choice: measured primary saturation after tuning, a concrete residency requirement, or a new availability contract.",
      ],
      decision:
        "Choose the simplest option that meets the present contract and write down the evidence that would change the decision.",
      limitation:
        "A switch trigger is a review point, not proof that a migration will be cheap. Preserve an exit path where it is affordable.",
    },
    assignment: {
      deliverable:
        "Five short architecture decision records with an option table and reversal trigger.",
      tasks: [
        "Cover SQL/NoSQL, sync/async, SSE/WebSocket, single/multi-region, and build/buy using distinct stated workloads.",
        "For each, quantify one deciding constraint and one operational cost; argue the strongest case for the rejected option.",
        "Present decisions aloud, change one requirement, and revise the records rather than defending the original choice automatically.",
      ],
      variations: [
        "The team shrinks to one owner.",
        "A new customer requires a capability the chosen provider lacks.",
      ],
      rubric: [
        "Each choice has a workload-specific reason.",
        "The rejected option receives a fair comparison.",
        "A measurable trigger identifies when to reconsider.",
      ],
    },
    recall: [
      {
        prompt:
          "Rewrite ‘NoSQL scales better’ as a defensible engineering statement.",
        sampleAnswer:
          "Name the workload, access patterns, partition key, required consistency, and measured limit. Then compare a specific design's throughput and operational costs against a viable relational alternative.",
      },
      {
        prompt: "What makes a reversal trigger useful?",
        sampleAnswer:
          "It is observable and tied to a requirement or measured limit, such as sustained write saturation or a new regional constraint. ‘When we get big’ is too vague to act on.",
      },
    ],
    references: [s.storage, s.slos, s.overload],
  },
  15: {
    ...systemDesignPractice[15],
    minutes: [25, 95, 100, 20],
    example: {
      title: "Recover when the interviewer removes a region",
      scenario:
        "At minute 28 of a 50-minute design, you are told the primary region has failed. Your original diagram has one write owner and an asynchronous replica.",
      steps: [
        "Restate the changed constraint and ask whether accepted-write loss is tolerable. Do not keep polishing the original healthy-state path.",
        "Trace in-flight requests, primary fencing, replica lag, promotion, and survivor capacity. State any availability-versus-data-loss choice.",
        "Spend the remaining deep-dive time on that path, then reserve time to recap residual risks and recovery.",
        "Score the recording using concrete evidence: when you noticed the new constraint, which assumption you changed, and what remained unresolved.",
      ],
      decision:
        "Treat steering as new design input and reallocate time while keeping the critical contract visible.",
      limitation:
        "A smooth delivery cannot compensate for incorrect failure semantics. Use the scorecard to separate fluency from correctness.",
    },
    assignment: {
      deliverable:
        "Two recorded 50-minute mocks, two scorecards, and a rewritten weak section.",
      tasks: [
        "Run the mock workspace with different scenarios and preserve the diagrams and notes.",
        "For framing, correctness, depth, tradeoffs, and recovery, record a score plus one timestamped piece of evidence.",
        "Choose the weakest dimension, rehearse that section in isolation, and explain how the second rep changes your next practice session.",
      ],
      variations: [
        "Inject a cost cap instead of a regional failure.",
        "Repeat one explanation in 90 seconds with all key assumptions retained.",
      ],
      rubric: [
        "The opening establishes scope and measurable constraints.",
        "A changed requirement produces a visible design change.",
        "The scorecard cites evidence and chooses a specific next drill.",
      ],
    },
    recall: [
      {
        prompt:
          "What should you do first after a major constraint changes halfway through a mock?",
        sampleAnswer:
          "Restate the new constraint, identify which assumptions and paths it invalidates, and confirm the required product behavior. Then spend time on the affected path and reserve a recap.",
      },
      {
        prompt: "What distinguishes useful self-review from a score of ‘3/4’?",
        sampleAnswer:
          "An observed behavior or timestamp, its consequence, and a concrete next exercise. The number alone does not tell you what to change.",
      },
    ],
    references: [s.learning, s.slos],
  },
} satisfies Record<number, ChapterStudyGuide>;
