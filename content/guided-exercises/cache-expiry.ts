import type { GuidedExercise } from "./types";
import { sources } from "../references";

const chapter = "/system-design/04-caching-and-performance";

export const cacheExpiry: GuidedExercise = {
  id: "cache-expiry",
  version: 1,
  title: "Contain a cache stampede",
  track: "System Design",
  courseSlug: "system-design",
  minutes: 20,
  outcome: "Calculate source pressure, trace concurrent expiry, and design a refresh path that stays safe when the cache or refresh owner fails.",
  brief: [
    "You own a product-description API. Most reads come from a shared cache, but one popular product expires at peak traffic. Several API instances can receive requests for that same product at once. Protect the source while preserving the display's freshness contract.",
    "Use the fictional workload below. Calculate normal and cold-cache source demand, predict the hot-key burst, then write a refresh timeline and failure policy. You do not need to choose a cache vendor or design an entire commerce platform.",
    "Allow two minutes for the brief, eight for your attempt, five for comparison, and five for revision. There is no countdown. A statement of uncertainty is a valid first attempt; the optional hints can help you find the next step.",
  ],
  givens: [
    { label: "Incoming traffic", value: "10,000 description reads/second at the modeled peak." },
    { label: "Normal cache hits", value: "95%. Each uncoalesced miss performs one source read." },
    { label: "Hot product", value: "30% of traffic; one recomputation takes 200 ms. Treat its expiry arrivals as a separate burst calculation." },
    { label: "Source capacity", value: "1,200 source reads/second at the latency target in this fictional exercise. Leave headroom; do not assume spare capacity beyond this limit." },
    { label: "Request deadline", value: "500 ms end to end, including 100 ms reserved for returning a response. All queueing, refresh waiting, and retries share the remaining budget; they do not receive new independent deadlines." },
    { label: "Freshness", value: "Only public descriptions are cached. A response may be at most 30 seconds old, measured from its authoritative source observation. A retained copy is already 20 seconds old when refresh starts. Prices charged and permissions are checked elsewhere." },
    { label: "Failures", value: "The refresh owner can time out or pause. The shared cache can also be unavailable. Client waiting and retries must be bounded." },
  ],
  prerequisites: [{ label: "Caching & performance", href: chapter }],
  deliverable: "Three calculations, an expiry timeline, a freshness policy, and a source-protection plan. The worksheet is the artifact you will review.",
  fields: [
    {
      id: "normal-source", kind: "number", unit: "source reads/second",
      label: "Normal source demand",
      prompt: "At 10,000 reads/second and 95% hits, how many reads per second reach the source? Enter a number without units, or write “not sure.”",
      hint: "Calculate the miss fraction first. Source demand = incoming reads/second × (1 − hit rate).",
      reference: "10,000 × (1 − 0.95) = 500 source reads/second.",
      check: { expected: 500, tolerance: 0.01, explanation: "Five percent of 10,000 is 500. Compare misses with source capacity; a high hit rate alone is not a capacity guarantee." },
    },
    {
      id: "expiry-arrivals", kind: "number", unit: "requests during one refresh",
      label: "Hot-key arrivals during refresh",
      prompt: "The hot product gets 30% of 10,000 reads/second. How many requests arrive during its 200 ms recomputation if traffic remains steady?",
      hint: "Hot-key rate = total rate × share. Convert milliseconds to seconds, then multiply rate by time. The result is a request count, not RPS.",
      reference: "10,000 × 0.30 × 0.2 = 600 requests during the refresh window.",
      check: { expected: 600, tolerance: 0.01, explanation: "3,000 requests/second × 0.2 seconds = 600 requests. This is burst exposure, not another 600 reads/second to add to the normal rate." },
    },
    {
      id: "cold-source", kind: "number", unit: "potential source reads/second",
      label: "Cold-cache source demand",
      prompt: "At 10,000 incoming reads/second, if every request misses and no coalescing or admission control is applied, what source rate is attempted?",
      hint: "A completely cold cache has a 100% miss fraction. Compare the result with the 1,200 reads/second source limit.",
      reference: "10,000 potential source reads/second, about 8.3× source capacity.",
      check: { expected: 10000, tolerance: 0.01, explanation: "All 10,000 incoming reads can reach the source. A queue alone delays this overload; it does not create the missing sustained capacity." },
    },
    {
      id: "timeline", kind: "reasoning", label: "Trace concurrent expiry",
      prompt: "Trace A, B, and C arriving at 0, 10, and 20 ms after expiry. Who refreshes? What do the others receive? Explain the scope across API instances and the stalled-owner case.",
      hint: "Give the key one shared refresh owner. Followers can wait within a deadline or receive a permitted stale copy. A local lock alone permits one refresh per API instance. Consider owner expiry and late publication.",
      reference: "A claims shared per-key ownership. B and C receive the retained copy while eligible, or wait within a deadline; they do not independently recompute. Ownership has a bounded lifetime. Version-aware publication prevents an old refresh from replacing a newer result. Source admission remains effective if coordination fails.",
    },
    {
      id: "freshness", kind: "reasoning", label: "State the freshness boundary",
      prompt: "The retained copy is already 20 seconds old. How much longer may it be served? What happens if refresh keeps failing? Which timestamp survives re-serving or recaching?",
      hint: "Subtract current age from the 30-second maximum. Serving an old value again must not make that value young again.",
      reference: "At most ten more seconds remain at refresh start. Preserve the authoritative source-observation timestamp; re-serving does not reset age. Beyond 30 seconds, wait only within the request deadline or return explicit temporary unavailability. Do not serve indefinitely stale text.",
    },
    {
      id: "protection", kind: "reasoning", label: "Protect the source during failure",
      prompt: "Define independent source admission, waiting/retry bounds, and user-visible behavior during a stalled refresh or full cache outage. Name the main downside.",
      hint: "Coalescing handles duplicate work for a key; admission protects aggregate capacity. Set finite waiting and overload behavior. TTL jitter spreads different keys' expiries, not concurrent misses for one key.",
      reference: "For example, cap aggregate source work at 1,000 reads/second under the fictional 1,200 limit. Allow at most 100 ms of admission waiting and 200 ms of refresh waiting, always within the original 500 ms deadline with 100 ms response reserve. Calibrate concurrency to measured latency. Reject excess work explicitly and refuse retries that cannot fit. Some reads become slower or unavailable, but a failed cache or coordinator cannot overload the source.",
    },
  ],
  reference: {
    title: "One shared refresh, bounded freshness, independent admission",
    steps: [
      { title: "Separate rate from burst count", explanation: "Normal misses are 500 source reads/second. The hot key receives 3,000 requests/second, so 600 requests arrive during a 0.2-second refresh. They are not 600 extra RPS. A cold cache can attempt 10,000 source reads/second, far beyond the stated capacity." },
      { title: "Coalesce across the serving boundary", explanation: "A owns the refresh; B and C follow. A local mutex coordinates only one process. A shared lease or equivalent needs bounded ownership and a rule against late stale publication. For example, publish only if the refresh generation and source version remain valid. Coordination can still fail, so it cannot be the only source-protection mechanism." },
      { title: "Give stale serving an absolute end", explanation: "The retained copy starts at age 20 seconds, leaving ten seconds. Preserve its source-observation time across cache copies and failed refreshes. Expiry jitter may choose an earlier refresh, never extend allowed age. After the cutoff, use the request deadline and fail clearly if no permitted value exists." },
      { title: "Make overload deliberate", explanation: "An illustrative 1,000 reads/second admission ceiling leaves 200 below capacity. Exact headroom and concurrency need measurement. For this case, choose at most 100 ms admission wait and 200 ms refresh wait, but propagate the smaller remaining end-to-end budget and reserve 100 ms to respond. These are policy choices, not universal constants. Refuse retries that cannot fit. During cache loss, reject excess instead of passing 10,000 RPS to the source. Observe admitted work, latency, follower count, stale age, and rejected reads." },
    ],
    artifact: [
      "Normal: 10,000 × 0.05 = 500 source reads/s",
      "Expiry exposure: 10,000 × 0.30 × 0.2 = 600 requests",
      "Cold: 10,000 attempted source reads/s > 1,200 capacity",
      "",
      "0 ms   A claims shared refresh; source admission permits work",
      "10 ms  B joins bounded wait or receives permitted retained copy",
      "20 ms  C follows the same rule; no new refresh for each miss",
      "200 ms Valid refresh publishes source version + observation time",
      "Stall  Owner/wait budgets expire; reject stale late publication",
      "Age >30 s  Old copy is ineligible; fail explicitly if needed",
      "",
      "Independent boundary: finite source work, wait, and retries",
      "Example: admission wait ≤100 ms; refresh wait ≤200 ms;",
      "         original deadline 500 ms, response reserve 100 ms",
    ].join("\n"),
    alternatives: [
      "Early refresh can reduce visible misses but still needs source protection and freshness checks.",
      "Waiting instead of serving stale is valid if the request deadline permits it. It does not justify an unlimited queue.",
      "Local coalescing can be a partial mitigation if you calculate the remaining refreshes across instances and protect aggregate demand. It offers a different guarantee from one fleet-wide refresh.",
    ],
    weakAnswer: {
      answer: "Add a 30-second TTL with jitter. On a miss, everyone reads the database. Keep serving the old entry until refresh works.",
      problem: "Jitter does not stop same-key misses. Indefinite stale serving violates the contract, and resetting age while recaching hides the violation. Nothing protects the source during cache loss.",
      repair: "Specify an owner and followers, preserve source-observation time with a hard cutoff, and independently bound source admission, waiting, and retries.",
    },
  },
  rubric: [
    {
      id: "load", label: "Workload reasoning", fields: ["normal-source", "expiry-arrivals", "cold-source"],
      levels: { revisit: "My first attempt omitted values or confused hits/misses, milliseconds/seconds, or requests/RPS.", partial: "I found some values but needed the reference for units or the capacity consequence.", meets: "My first attempt gave 500 reads/s, 600 requests, and 10,000 reads/s, with correct units and the overload consequence." },
      remediation: { task: "Recalculate all three values with units on every line. Explain why the burst count cannot be added directly to an RPS rate.", href: chapter + "#worked-example", label: "Review source-load arithmetic" },
    },
    {
      id: "coordination", label: "Concurrent refresh behavior", fields: ["timeline"],
      levels: { revisit: "Every miss could refresh, or I did not define an owner and followers.", partial: "I used coalescing but omitted cross-instance scope, stalled-owner recovery, or late-result behavior.", meets: "My first timeline included ownership scope, follower behavior, bounded recovery, and stale-publication protection." },
      remediation: { task: "Rewrite A/B/C as a timestamped trace. Pause A, let another owner refresh, and show why A cannot replace the newer value.", href: chapter + "#lessons", label: "Review coordination and refill races" },
    },
    {
      id: "freshness", label: "Freshness contract", fields: ["freshness"],
      levels: { revisit: "I allowed indefinite stale serving or treated re-serving as a new observation.", partial: "I stated 30 seconds but missed existing age or the post-cutoff response.", meets: "My first attempt allowed ten more seconds, retained source time, and defined the cutoff response." },
      remediation: { task: "Write the source-observation time, current age, and last eligible response time. Trace refresh failure beyond that point.", href: chapter + "#lessons", label: "Review freshness semantics" },
    },
    {
      id: "overload", label: "Failure containment", fields: ["protection"],
      levels: { revisit: "All misses could reach the source, or retries/waits were unbounded.", partial: "I named a queue or rate limit without a capacity bound, waiting limit, or overload response.", meets: "My first attempt bounded work below capacity, bounded waits/retries, defined degradation, and named its user cost." },
      remediation: { task: "Remove the cache. State the admission ceiling, finite waiting policy, overload response, and one metric proving source protection.", href: "/system-design/07-reliability-and-resilience#lessons", label: "Review failure containment" },
    },
  ],
  transfer: {
    prompt: "Try on paper: refresh rises to two seconds. Then change the data from public text to a balance used to authorize a transfer. Which calculations and decisions change?",
    reasoning: "The hot-key window contains 10,000 × 0.30 × 2 = 6,000 requests. Coalescing, bounded waiting, and admission still matter. A transfer requires authoritative funds and permission checks at the effect boundary; the public-description stale allowance cannot be reused automatically. State the new invariant first.",
  },
  next: { href: chapter + "#cumulative-practice", label: "Apply this policy to Relay's file cache" },
  references: [sources.caching, sources.overload],
};
