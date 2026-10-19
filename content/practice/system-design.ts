import type { ChapterPractice } from "../types";

// Reference artifacts are deliberately small, fictional, and inspectable on paper.
export const systemDesignPractice = {
  1: {
    sampleSolution: {
      assumptions: "Use the worked example's 20M MAU, 25% daily-active share, three reads/day, 50k creates/day, 4 KB bodies, and 5× peaks. Assume private access and one-year retention.",
      artifact: `Estimate table (decimal units)
Reads: 15M/day → 173.6/s average → 868/s peak
Creates: 50k/day → 0.58/s average → 2.9/s peak
Peak body bandwidth: 868 × 4 KB ≈ 3.47 MB/s
Bodies: 200 MB/day → 73 GB/year → 219 GB at 3 replicas

POST /pastes {body, visibility, expiresAt} → {id, url}
GET /pastes/:id → body, or denied/expired/not-found
Create: client → API → body upload → metadata commit → acknowledge
Read: client → API → owner/expiry check → body fetch → response`,
      explanation: "Metadata owns identity, owner, visibility, expiry, and body reference. Uploading an immutable body before publishing metadata avoids pointing a successful read at an unfinished upload; a cleanup job removes abandoned bodies. One relational metadata primary is a candidate to benchmark, not a capacity guarantee. Keep expiry and access checks on the read path.",
      checks: ["At 1% versus 50% DAU/MAU, peak reads become about 35 versus 1,736/s with the same behavior assumptions.", "A 20 MB maximum body changes transfer and storage design even if typical bodies remain small.", "An expired private paste never becomes readable through the body URL; revisit sharding only after workload measurements identify a limit."],
      pitfall: "Sharding because the prompt says 20M users skips the behavioral estimate. Show the peak workload and measured storage/query constraint first.",
    },
    cumulativePractice: {
      revisit: [],
      deliverable: "Relay v1: requirements, an estimate table, and upload/download traces.",
      prompt: "Start the project document from the brief. Without copying this chapter's arithmetic, derive daily and peak download RPS, average upload RPS, and 30-day raw body storage. Choose a minimal design and name one fact you still need to measure.",
      sampleAnswer: "100k daily users × ten downloads = 1M downloads/day: 11.57/s average and 57.9/s at 5× peak. Uploads average 10k/86,400 = 0.116/s. At 1 MB each, 30 days retains 300 GB raw, or 900 GB for three replicas before overhead. Start with authenticated metadata access and blob storage. Measure actual transfer sizes and query latency before adding a distributed metadata layout.",
    },
  },
  2: {
    sampleSolution: {
      assumptions: "The user deadline is 800 ms. Authentication and orchestration consume 100 ms; the first dependency attempt consumes 300 ms. This is a message-create API with a streaming result.",
      artifact: `POST /messages; Idempotency-Key scoped to tenant + operation
Stored identity: key → request hash + message ID + status
Event: {eventId, operationId, type, payload}
Success: authorize → commit message + key → emit result → complete
Lost response: commit → timeout → retry same key → original result
Disconnect: stop stream → cancel cancellable generation → retain status
Retry budget: 800 - 100 - 300 - 50 backoff - 100 response = 250 ms`,
      explanation: "SSE fits one-way incremental output; the API owns replay or status recovery. The write's deduplication record commits with the message. Reusing a key with changed content fails instead of creating an unrelated effect. Voice may justify a bidirectional media/session transport; it does not change the operation identity rule.",
      checks: ["The second attempt cannot start a fresh 800 ms budget.", "Three attempts at each of three layers can produce 27 leaf calls; choose one retry owner or share the budget.", "Closing the browser stops expendable work, while a committed message remains inspectable by its original operation ID."],
      pitfall: "Treating a missing response as a failed write can duplicate a message. Inspect durable operation status before issuing another effect.",
    },
    cumulativePractice: {
      revisit: [1],
      deliverable: "Relay's upload contract and deadline/reconnect sequence.",
      prompt: "Recall which parts of Relay are metadata versus body transfer. Give an upload a stable operation ID, explain an ambiguous metadata-commit timeout, and allocate an 800 ms metadata deadline after 100 ms edge work, a 300 ms attempt, 50 ms backoff, and 100 ms response reserve. Large body transfer has its own explicit contract.",
      sampleAnswer: "Only 250 ms remains for a second metadata attempt. Persist operation identity with the metadata change; retrying the same parameters returns the same file ID. A body transfer can finish before metadata publication and later be cleaned up if abandoned. Reconnection fetches existing upload status; it does not create another file. The large transfer is not assumed to fit the short metadata deadline.",
    },
  },
  3: {
    sampleSolution: {
      assumptions: "A single-product reservation must not oversell. Prices and payment execution are outside this transaction. Keys are tenant-scoped.",
      artifact: `inventory: PK(tenant, product), remaining CHECK remaining >= 0
reservation: PK(tenant, id), customer, product, quantity, state, expiresAt
request: UNIQUE(tenant, idempotencyKey), requestHash, reservationId
Index: reservation(tenant, customer, createdAt) for customer history

BEGIN
  claim idempotency key; on duplicate return matching original result
  UPDATE inventory SET remaining = remaining - 1
    WHERE tenant = T AND product = P AND remaining > 0
  require affected rows = 1; otherwise rollback and report sold out
  INSERT reservation + request result
COMMIT
Confirm/expire: conditional transition from reserved; return stock
in the same transaction only when reserved → expired succeeds.`,
      explanation: "Concurrent A and B do not both pass the conditional decrement when stock is one. The transaction rolls back partial failure. A terminal reservation state prevents expiry and confirmation from both taking effect. Multi-product orders need an atomic strategy across the relevant rows or an explicitly compensated workflow; this single-row sketch is not enough.",
      checks: ["Run A and B against stock = 1: exactly one decrement succeeds.", "Retry the winner's operation ID: stock does not change again.", "Product ownership localizes stock updates; tenant ownership localizes tenant queries but needs a plan for a tenant dominating writes. Secondary indexes add storage and write work."],
      pitfall: "A transaction containing an ordinary read followed by an unconditional update does not automatically enforce the intended concurrency invariant.",
    },
    cumulativePractice: {
      revisit: [1, 2],
      deliverable: "Relay's metadata schema and atomic publication rule.",
      prompt: "From memory, recover the upload identity contract. Add file, membership, and upload-operation records with access patterns. Show how a duplicate publish returns the existing file, and explain why a client-provided tenant field is insufficient for a private download.",
      sampleAnswer: "Use tenant-scoped file and operation keys plus a membership lookup keyed by trusted principal and tenant. Publish the file reference and matching operation result transactionally. A duplicate operation with the same request hash returns its file ID; changed parameters fail. Derive tenant context from authentication, then check resource ownership and membership. The blob may exist before publication, but it must not become publicly addressable by default.",
    },
  },
  4: {
    sampleSolution: {
      assumptions: "Product details allow at most 30 seconds of stale display data; the database is authoritative. Account-balance decisions do not share this freshness allowance.",
      artifact: `10k reads/s: 95% hits → 500 source reads/s
             90% hits → 1,000 source reads/s
             cold    → 10,000 possible source reads/s
Key: tenant + product + representationVersion
TTL: <= 30 s for this display contract; jitter below that maximum
Hot key: 3,000/s × 0.2 s fill = 600 arrivals during recompute
Policy: one coalesced fill/key; bounded wait or permitted stale response
Cold/failed cache: source concurrency cap + explicit overload response`,
      explanation: "The design protects the source during expiry and cache loss. A writer increments or invalidates a representation version to address refill races. For balances, obtain authoritative state at the consequential action boundary. If recompute rises to two seconds, the hot-key window contains about 6,000 arrivals, so merely choosing a TTL is insufficient.",
      checks: ["The hit-rate change doubles source demand.", "Jitter spreads different keys' expiries; coalescing addresses concurrent misses for one key.", "A cold fleet cannot admit all misses to a database sized for a small fraction of traffic."],
      pitfall: "A 95% steady-state hit rate is not a cache-loss capacity plan. Define the accepted degradation before adding more cache nodes.",
    },
    cumulativePractice: {
      revisit: [1, 3],
      deliverable: "Relay's body-cache policy and cold-cache load table.",
      prompt: "Recall Relay's peak download rate. Calculate source demand at 95% and 80% hits. Decide which data can be cached, which access checks remain authoritative, and how a private link behaves after revocation.",
      sampleAnswer: "At 57.9 peak downloads/s, misses are about 2.9/s at 95% hits and 11.6/s at 80%: four times the source load. Body caching must not bypass trusted tenant, membership, and expiry checks. A signed body URL has an explicit delegated lifetime; immediate revocation needs a serving path capable of checking current access. Keep source admission bounded during cold starts.",
    },
  },
  5: {
    sampleSolution: {
      assumptions: "Notification intent must survive the originating transaction. The provider supports either an idempotency key or status reconciliation; without those, duplicate/omission risk must be surfaced.",
      artifact: `outbox(id PK, tenant, notificationId, payloadVersion, createdAt)
attempt(notificationId, attemptId, providerKey, status, receipt)
Origin: commit business state + outbox row atomically
Relay: publish notificationId; duplicate publication is possible
Consumer: pending → sending → sent | unresolved | terminal-failure

Crash before send: retry pending work
Crash after provider commit: reconcile providerKey before another send
Crash after local sent record: duplicate delivery reads receipt, no send
Poison payload: bounded attempts → dead-letter + operator reason`,
      explanation: "The outbox repairs lost publication intent; it does not make the external send atomic with the database. A sent flag written after sending leaves an ambiguous crash window. Monitor age of oldest pending notification and retries. For payments, use stricter effect identity and reconciliation instead of assuming email's duplicate tolerance.",
      checks: ["A rolled-back originating transaction leaves no publishable intent.", "Replaying the same notification ID after success performs no new send.", "A poison event in an ordered partition has an explicit stop/skip decision and downstream consequence."],
      pitfall: "Acknowledging before the effect can lose work; acknowledging after it can redeliver. The consumer protocol must handle both boundaries deliberately.",
    },
    cumulativePractice: {
      revisit: [2, 3],
      deliverable: "Relay's durable preview-generation pipeline and backlog calculation.",
      prompt: "Add asynchronous previews after file publication. Recall the dual-write problem and use an outbox. In a burst of two preview jobs/s, four workers each finish 0.25 jobs/s. How fast does backlog grow, and what happens if a worker crashes after publishing a preview but before acknowledgement?",
      sampleAnswer: "Workers finish one job/s, so backlog grows by one job/s, or 600 jobs in ten minutes. Publish a versioned preview under stable file/job identity and record completion so redelivery does not create another visible version. Commit preview intent with file metadata through an outbox. Bound accepted preview work and expose pending status; adding a queue alone does not repair a sustained capacity deficit.",
    },
  },
  6: {
    sampleSolution: {
      assumptions: "The protected storage path can atomically enforce increasing fencing generations. Tokens come from a coordinated ownership protocol.",
      artifact: `t0 A owns lease, token 41
t1 A pauses; lease expires
t2 B receives 42 and installs/commits generation 42 at storage
t3 A resumes and submits write(token=41)
t4 storage rejects 41 < highestAccepted(42)

Storage rule: compare generation and mutate protected state atomically.
Same-generation writes also need operation IDs/ordering as appropriate.
Partition: only the side able to establish valid ownership may change it.`,
      explanation: "Checking a token in the worker is insufficient: the stale worker is the component we cannot trust to notice expiry. Enforce fencing at every protected effect path. If a backing service cannot fence, use a capable gateway or redesign authority; do not claim the lease alone prevents stale effects.",
      checks: ["A's delayed write cannot replace B's newer state.", "The timeline states that generation 42 is installed before A's stale request reaches storage.", "A read-your-writes promise during partition requires a valid owner/read position or refusal; an arbitrary stale replica cannot satisfy it."],
      pitfall: "A random unique lock ID identifies owners but does not order them. Fencing needs a comparable generation and resource-side enforcement.",
    },
    cumulativePractice: {
      revisit: [3, 5],
      deliverable: "Relay's leased preview ownership and stale-worker trace.",
      prompt: "Reconstruct the crash/redelivery case from the preview pipeline. Now worker A pauses, B takes over, and A resumes. Put fencing and idempotency at their respective boundaries and explain whether a lease on its own protects the published preview.",
      sampleAnswer: "Use an increasing ownership generation enforced on the preview metadata publication. After B installs the newer generation, A's old publish is rejected. A stable preview operation ID handles duplicate attempts within valid ownership; it does not replace fencing across owners. Immutable intermediate objects from rejected attempts can be garbage-collected. A lease checked only by workers cannot prevent a paused stale worker from publishing.",
    },
  },
  7: {
    sampleSolution: {
      assumptions: "Checkout targets 99.9% valid requests completing correctly within the declared deadline over 30 days. The time-equivalent below assumes uniform request traffic.",
      artifact: `SLI = good eligible checkout attempts / eligible checkout attempts
Budget: 0.1% bad; uniform 30-day equivalent = 43.2 minutes
DB loss → stop unsafe writes; fail over only with valid data authority
Recommendation loss → omit optional recommendations
Payment timeout → unresolved operation; reconcile before replay
Runbook: detect symptom → halt rollout → bound load → recover owner
         → verify accepted writes + checkout trace → ramp traffic`,
      explanation: "Declare exclusions and measure at the user workflow. A failing optional dependency should not consume all checkout workers. RTO covers time to usable recovery; RPO covers accepted data loss. Practice restoring and reconciling data, not only starting replacement processes. Shared databases can defeat a supposedly independent fallback.",
      checks: ["A region or database loss has an assigned recovery owner and invariant check.", "Peak-sale traffic changes the request impact of an outage even if its duration is unchanged.", "The fallback has headroom and does not depend on the same failed resource without a deliberate limitation."],
      pitfall: "Turning a request-based SLO into minutes without stating a traffic assumption can conceal much worse customer impact during peak periods.",
    },
    cumulativePractice: {
      revisit: [2, 5, 6],
      deliverable: "Relay's download SLO, preview degradation rule, and recovery matrix.",
      prompt: "Set a 99.9% successful-download target and recover its uniform 30-day time equivalent from memory. Decide whether preview failure should fail downloads, and show how retry storms could consume the budget despite redundant workers.",
      sampleAnswer: "The uniform-time equivalent is 43.2 minutes; the actual SLI counts eligible downloads. Raw authorized downloads can remain available when optional previews fail. Separate preview capacity from download-serving resources, bound retries, and shed optional work. Recover preview ownership with fencing and idempotency instead of allowing every replacement to replay effects. Validate download success after recovery before ramping traffic.",
    },
  },
  8: {
    sampleSolution: {
      assumptions: "After a deployment, one large tenant has timeouts while overall success remains 99.95%. The following numbers and incident timeline are fictional.",
      artifact: `Dashboard: checkout/download success + p95/p99 by region/operation
           dependency spans + queue age + current deployment version
Alert 1: sustained rapid SLO budget burn → rollback/on-call owner
Alert 2: oldest high-priority job exceeds its wait budget → inspect workers
Incident: 10:00 canary deploy; 10:04 tenant report; 10:07 trace shows
new query scan; 10:10 stop rollout; 10:15 rollback; 10:20 validate recovery
Follow-up: representative large-tenant query case + rollout stop rule`,
      explanation: "Use bounded cohort labels for metrics and access-controlled logs/traces for targeted tenant detail. Correlate request, operation, trace, and deployment IDs without turning each into a metric label. At 1% tracing, a very rare failure may be absent; retain errors or target diagnostics under a cost budget rather than treating no trace as proof of no failure.",
      checks: ["Each page has an action and owner, not just a resource threshold.", "The report separates mitigation from the later root-cause investigation.", "Rollback compatibility includes data written by the new release, not just the previous binary."],
      pitfall: "A healthy average can hide an entire failing slice. Investigate the affected cohort and critical path before dismissing the complaint.",
    },
    cumulativePractice: {
      revisit: [1, 5, 7],
      deliverable: "Relay's trace and rollout evidence sheet.",
      prompt: "Recall the download SLO and asynchronous preview path. Add span boundaries and operation identities across the queue. A new preview release doubles oldest-job age while download success stays healthy: which alert, rollout action, and isolation check are appropriate?",
      sampleAnswer: "Carry trace and job identity into preview work, and separate queue wait from execution. Stop or roll back the preview rollout when its declared age budget is violated; inspect worker completion rate, retries, and version. Do not page as a download outage solely from preview age, but check that shared resource contention cannot spread there. Preserve versions and timing so the next release can include a representative regression case.",
    },
  },
  9: {
    sampleSolution: {
      assumptions: "Files are private to a workspace. Reads require current membership; signed body access has an explicitly bounded lifetime.",
      artifact: `Asset: file body + metadata; principal: authenticated member
Member T / file T / allowed role → read
Member T / file U             → deny
Revoked member / file T       → deny new metadata/body grants
Worker / preview job         → scoped file capability, not tenant-wide secret
Read: authenticate → derive tenant → authorize file → cache/body lookup
Cache: tenant + resource + representation; no public private-file entry
Audit: principal, resource, decision, policy version; restricted log access`,
      explanation: "A cache key is defense in depth, not authorization. A cached preview and previously issued URL need a revocation policy. Economic abuse controls should limit bytes, concurrent expensive work, and spend before processing. Distributed accounts may require aggregate or risk-based limits as well as per-account caps.",
      checks: ["A guessed file ID from another workspace fails before publication.", "A revoked member cannot obtain a new grant; the lifetime of already issued grants is stated.", "Search, previews, exports, and workers preserve the same tenant/resource boundary."],
      pitfall: "Authentication proves identity, not permission to file 123. Moving the check behind a cache hit creates a leak.",
    },
    cumulativePractice: {
      revisit: [3, 4, 8],
      deliverable: "Relay's end-to-end tenant and revocation matrix.",
      prompt: "Without notes, trace a private download through metadata and cache. Revoke a member while a preview is queued and another URL remains valid. Specify the enforcement point and observable evidence for each path, including any accepted revocation delay.",
      sampleAnswer: "Authorize current membership before issuing a download grant and before publishing a preview to a caller where required. Carry trusted tenant and file identity in jobs; isolate credentials. Existing signed URLs retain whatever bounded lifetime the product accepted, unless access is mediated by a revocable serving path. Record policy decisions in restricted audit logs, not unbounded metric labels. Cached bodies do not independently grant access.",
    },
  },
  10: {
    sampleSolution: {
      assumptions: "A writes 100 operations/s, B trails by 20 seconds, and residency requirements are supplied product constraints. An unreachable A is not automatically proven dead.",
      artifact: `Topology: one write owner/domain; async replica; fenced promotion
At-risk interval: 100 writes/s × 20 s = roughly 2,000 writes
Class       primary/replica/backup/processing
EU bodies   EU / EU / EU / EU
Routing IDs permitted locations only, with no document content
Failover: fence old owner → establish durable position → assess missing ops
          → promote/reroute → reconcile → validate
Failback: reconcile divergence → rejoin → warm → gradually return traffic`,
      explanation: "The 2,000 figure assumes a stable write rate and lag interval; it bounds an illustrative exposed window, not a measured loss count. Zero accepted-write loss requires a stronger acknowledgement/recovery design or reduced write availability. Residency applies to backups, logs, and processing as well as the primary. Record the allowed placement per class instead of inferring a legal rule.",
      checks: ["Promotion does not create two unfenced writers.", "RTO and RPO are separately stated and tested.", "The survivor has capacity, and restored data cannot resurrect previously deleted records unnoticed."],
      pitfall: "Changing DNS does not reconcile missing writes or establish exclusive ownership. Those are separate recovery steps.",
    },
    cumulativePractice: {
      revisit: [6, 7, 9],
      deliverable: "Relay's regional ownership, permitted-placement table, and evacuation plan.",
      prompt: "Relay's peak 58 downloads/s is split evenly across two regions. Each can handle 40/s at the latency target. Recall the distinction between RPO and RTO, calculate the survivor's shortfall, and state how private access and writer ownership survive a region loss.",
      sampleAnswer: "The survivor needs 58/s but supports 40/s, leaving an 18/s shortfall. Reserve more capacity or reject/degrade within an explicit policy; optional previews can yield resources only if the relevant bottleneck is shared. Fence metadata ownership before promoting, assess replicated state for accepted-write loss, and retain tenant checks. Regional copies and backups must obey the supplied placement table even during recovery.",
    },
  },
  11: {
    sampleSolution: {
      assumptions: "Use the example's 100 RPS, 1,000 input tokens, 200 output tokens, and fictional measured fleet output capacity of 25k tokens/s at target latency.",
      artifact: `Input demand: 100 × 1,000 = 100k tokens/s
Output demand: 100 × 200 = 20k tokens/s
Output headroom: 25k - 20k = 5k/s (20% of capacity)
25% fleet loss, linear exercise assumption: 18.75k/s < 20k/s demand
Admission: request + token estimate + context/concurrency memory bounds
Queues: interactive protected share; batch bounded waiting/aged priority
Experiment: baseline → long prompts → doubled output → fleet loss`,
      explanation: "Output capacity alone does not establish input capacity or KV memory headroom. Doubling output length raises output demand to 40k/s; unchanged RPS does not mean unchanged load. Measure each scenario at its latency contract and track queue delay by class. A linear fleet-loss estimate is a planning assumption, not a hardware law.",
      checks: ["Input and output phases are modeled separately.", "A noisy tenant cannot reserve every active slot or unbounded memory.", "The overload policy selects rejection, delay, or degradation before accepting work it cannot serve."],
      pitfall: "Reporting 80% output utilization as universally healthy ignores input work, memory limits, traffic skew, and failure headroom.",
    },
    cumulativePractice: {
      revisit: [5, 7, 10],
      deliverable: "Relay's optional summarization pool, separate from raw file delivery.",
      prompt: "Add ten summary requests/s, each with 1,000 input and 100 output tokens. Recall why queue size and RPS are incomplete. Calculate phase demand, then explain admission and isolation during a 25% compute loss without claiming a fleet size from token demand alone.",
      sampleAnswer: "Demand is 10k input and 1k output tokens/s before retries. Fleet sizing needs measured phase performance, memory, lengths, and the latency target. Reserve headroom and bound per-tenant tokens/concurrency; defer summaries or reject excess when capacity falls. The file-serving SLO should not depend on summary completion. Reuse durable jobs and ownership rules rather than building a separate unsafe retry path.",
    },
  },
  12: {
    sampleSolution: {
      assumptions: "The assistant answers from private documents and may create a support ticket. Revocation may happen after retrieval but before publication or execution.",
      artifact: `Read: authenticate → authorized retrieve → source/version context
      → draft → recheck publication access → cite or abstain
Action: proposal → schema + current permission → exact approval
        → durable operation ID → execute/reconcile → receipt
Run: queued → retrieving → drafting → awaiting approval → executing
     → completed | denied | unresolved | failed
Eval rows: missing evidence; stale policy; revoked access; duplicate tool;
           timeout-after-commit; unsupported citation; provider outage`,
      explanation: "Keep run and effect state outside model prose. Revoked evidence must not be published merely because it was fetched earlier. Bind approval to exact ticket parameters; a changed action requires a new decision. Fresh contradictory evidence calls for source/version policy and possibly abstention, not silently increasing top-k.",
      checks: ["The read and action paths have different evidence of completion.", "A duplicate action returns the same receipt or unresolved operation, not another ticket.", "Quality metrics, request availability, unauthorized effects, latency, and cost are measured separately."],
      pitfall: "Treating the model's chosen tool or final text as authority skips the deterministic permission and effect boundary.",
    },
    cumulativePractice: {
      revisit: [4, 6, 9, 11],
      deliverable: "Relay's permission-aware file assistant and action/recovery trace.",
      prompt: "Add cited answers over files and an optional support-ticket tool. Recall cache, fencing/idempotency, and token budgets. Revoke file access after retrieval and time out a ticket write after commit. Show the two independent recovery decisions.",
      sampleAnswer: "Do not publish revoked evidence; recheck access and abstain or retrieve permitted alternatives. Reconcile the ticket using stable operation identity before retrying; file permission failure does not prove the external ticket failed. Bound tokens and run steps, preserve source versions and receipts, and record terminal or unresolved status outside the conversation. Test both cases together so one recovery does not bypass the other's security boundary.",
    },
  },
  13: {
    sampleSolution: {
      assumptions: "These are condensed design packets to compare with your longer artifacts. Use supplied scale rather than copying a universal topology.",
      artifact: `Feed: author/post IDs; publish/read APIs; ordinary-author fan-out
      + celebrity read merge; freshness budget; failed fan-out replay
Notifications: submit/status APIs; preference version + business ID;
      outbox; provider reconciliation; queue-age SLO; spend bounds
Scheduler: submit/status/cancel APIs; job + attempt + generation;
      fenced claim/commit; per-tenant resource share; stale-worker test
Compare: feed → fan-out/skew; notifications → duplicate external effect;
         scheduler → valid ownership/fairness
Each packet: estimates + access checks + metrics + first scaling trigger`,
      explanation: "A 10M-follower author can make pure fan-out-on-write expensive, while 200-follower authors may fit it well. Notifications need an effect contract beyond broker delivery. Scheduler leases need protected-resource enforcement. Reduce scale by ten and remove unnecessary components, but preserve the business invariant and explicit failure behavior.",
      checks: ["All three packets name APIs, durable state, and a successful request trace.", "Each has a different hardest path and a concrete failure test.", "A constraint change causes a justified mechanism change rather than the addition of the same cache/queue/CDN stack."],
      pitfall: "Copying one architecture across all prompts can conceal differences between stale content, duplicate messages, and conflicting job owners.",
    },
    cumulativePractice: {
      revisit: [1, 5, 6, 12],
      deliverable: "Relay's integrated packet plus a comparison with notifications and scheduling.",
      prompt: "Reconstruct Relay's upload, download, preview, and assistant paths without notes. Compare their dominant resources and invariants. Inject a viral file and one repeated ticket action; identify which previously learned mechanism addresses each.",
      sampleAnswer: "Downloads emphasize authorized bandwidth and hot-object serving; previews emphasize durable work and fenced publication; the assistant adds evidence quality, token capacity, and controlled effects. A viral file may call for caching/coalescing and source admission without weakening access. A repeated ticket uses effect identity and reconciliation, not a cache TTL. The same packet should retain APIs, ownership, workload estimates, metrics, and recovery traces for all paths.",
    },
  },
  14: {
    sampleSolution: {
      assumptions: "Two engineers operate a service at 50 writes/s with 99.9% availability and no initial multi-region requirement. These are example choices pending workload measurements.",
      artifact: `ADR          choice / strongest alternative / revisit trigger
Store        relational / document layout / unmet measured query need
Async        outbox+worker / inline work / completion exceeds user deadline
Stream       SSE / WebSocket / required client-to-server live interaction
Topology     one region+recovery / multi-region / approved RTO or geography need
Ownership    managed service / self-run / capability or cost evidence changes
Each decision records downside, owner, test, and migration outline.`,
      explanation: "The deciding constraints favor operational simplicity, not a claim that 50 writes/s guarantees a particular database fits. A multi-region requirement would change topology and acknowledgement/recovery choices. A one-engineer team may strengthen the managed-service case; an unsupported customer capability can reverse it. Keep the current choice and trigger tied to evidence.",
      checks: ["Each ADR compares a credible alternative on the important dimensions.", "The chosen option includes its main cost or failure limitation.", "A trigger describes an observable condition and feasible migration, not merely a desire to use another technology."],
      pitfall: "A feature comparison with no contextual decision does not tell a reviewer what to build or when to reconsider it.",
    },
    cumulativePractice: {
      revisit: [3, 7, 10, 12],
      deliverable: "Five Relay decision records with revision history.",
      prompt: "Choose metadata storage, body caching, preview transport, regional ownership, and assistant control flow. Recall the strongest alternative for each. Now require zero accepted metadata-write loss on region failure; revise the affected ADR and state its latency/availability consequence.",
      sampleAnswer: "The regional acknowledgement and promotion protocol must change; an asynchronous replica alone cannot promise zero loss. Consider sufficiently durable cross-region acknowledgement or refusing writes when the required durable path is unavailable, then measure latency. Other decisions can stay if their invariants still hold. Keep the old assumption, new requirement, chosen protocol, downside, and migration/verification plan beside each other.",
    },
  },
  15: {
    sampleSolution: {
      assumptions: "This scorecard illustrates how to review your own two recordings; it is not a score you should award without evidence from an actual attempt.",
      artifact: `Mock 1 evidence (fictional)
Framing 3: 04:00 states write ownership + SLO, misses RPO
Correctness 2: 28:00 region-loss answer promotes without fencing
Depth 2: 32:00 cannot explain missing accepted writes
Tradeoffs 3: 18:00 compares cache freshness/capacity
Recovery 2: 29:00 redraws everything instead of local repair
Revision: restate RPO → fence writer → assess durable position
          → reconcile missing operations → route with capacity bounds
Mock 2: timestamp whether the new scenario uses that reasoning unaided`,
      explanation: "A second mock should use a different constraint so it tests transfer. With asynchronous replication, identify exposed accepted writes before promising recovery. A cost-cap change instead revisits capacity, priority, and degradation. Preserve each diagram and one timestamped next exercise per weak dimension.",
      checks: ["The recording establishes measurable requirements and traces a critical request.", "A changed premise leads to a visible, justified revision.", "The score cites behavior and a targeted next drill; a higher number alone is insufficient."],
      pitfall: "Confident delivery can mask an invalid recovery protocol. Review the invariant and evidence before rating fluency.",
    },
    cumulativePractice: {
      revisit: [1, 6, 9, 10, 14],
      deliverable: "Relay capstone: final design packet, a recorded review, and one revised weak path.",
      prompt: "Present the complete project in 50 minutes from a blank page. At minute 25, remove a region and revoke an assistant user's access. Recover workload estimates, ownership, current permissions, and safe effect semantics without reading prior answers. Then compare your new packet with the accumulated versions.",
      sampleAnswer: "A strong packet includes contract/SLO, workload table, APIs/data, numbered upload/download/preview/assistant paths, ownership and permission boundaries, capacity/degradation, failure matrix, quality tests, and rollback. Region loss changes authority, replicated-state confidence, and survivor load. Revocation changes evidence publication and action eligibility. Preserve unaffected paths, reconcile uncertain effects, and cite recording evidence for the next practice step. Alternative designs pass if they satisfy these same explicit promises.",
    },
  },
} satisfies Record<number, ChapterPractice>;
