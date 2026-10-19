import type { GuidedExercise } from "./types";
import { sources } from "../references";

const chapter = "/llm-engineering/08-retrieval-augmented-generation";

export const groundedSupport: GuidedExercise = {
  id: "grounded-support-answer",
  version: 1,
  title: "Repair an unsupported policy answer",
  track: "LLM Engineering",
  courseSlug: "llm-engineering",
  minutes: 20,
  outcome: "Separate authorized current evidence, context-assembly failure, and unsupported generation; produce a supported answer and a safe missing-evidence response.",
  brief: [
    "A North-workspace employee asks: “How long do I have to submit an expense, and do I need a receipt?” Your assistant returns a confident answer with a citation. Inspect the source trace to decide whether the answer deserves trust.",
    "Treat the supplied excerpts and metadata as the complete fictional corpus. You can inspect all three as the reviewer of this diagnostic fixture; the employee and generation path must not receive unauthorized C. The caller may read North documents only. The product requires the current policy; the known gold evidence is A. You are preparing a supported draft, not executing a reimbursement.",
    "Allow two minutes for the brief, eight for your attempt, five for comparison, and five for revision. No model account is required. Use the supplied trace rather than your own knowledge of expense policies.",
  ],
  givens: [
    { label: "A · current North policy", value: "North · version 3 · CURRENT · authorized. “Submit expenses within 30 calendar days of the expense. A receipt is required.”" },
    { label: "B · old North policy", value: "North · version 1 · SUPERSEDED · authorized. “Submit expenses within 14 calendar days of the expense. A receipt is required.”" },
    { label: "C · South policy", value: "South · version 4 · CURRENT · NOT authorized. “Submit expenses within 60 calendar days. A receipt is optional.”" },
    { label: "Observed trace", value: "Ingestion has A/B/C → candidates A/B/C → authorization removes C → reranking retains A/B → context assembly passes only B to generation." },
    { label: "Displayed answer", value: "“You have 60 calendar days and do not need a receipt. [B]” Count its deadline and receipt statements as two policy claims." },
    { label: "Expected source", value: "Gold evidence set = {A}. Final supplied context = {B}. For this case, gold-evidence coverage is |gold ∩ context| / |gold| × 100%." },
  ],
  prerequisites: [
    { label: "Prompting as software engineering", href: "/llm-engineering/05-prompting-as-software-engineering" },
    { label: "Retrieval-augmented generation", href: chapter },
  ],
  deliverable: "An evidence decision, two measurements, a stage-by-stage diagnosis, a corrected cited answer, and a missing-evidence response.",
  fields: [
    {
      id: "sources", kind: "reasoning", label: "Choose usable evidence",
      prompt: "Which source can support a current answer for this caller? Explain the separate reasons for excluding the other two.",
      hint: "Check permission and current version independently. A readable document can still be obsolete; a current document can still be unauthorized.",
      reference: "A is both authorized and current. B is readable but superseded, so it does not establish today's policy. C is outside the caller's permitted workspace and must not enter generation context. Relevance never grants access.",
    },
    {
      id: "evidence-coverage", kind: "number", unit: "% gold-evidence coverage",
      label: "Measure final-context evidence coverage",
      prompt: "What percentage of the known gold evidence is present in the final context? Enter 0–100 without the percent sign, or write “not sure.”",
      hint: "The gold set is {A}; final context is {B}. Count the intersection, not how many documents appeared in the earlier candidate set.",
      reference: "|{A} ∩ {B}| / |{A}| × 100 = 0%. Candidate retrieval found A, but the final context lost it.",
      check: { expected: 0, tolerance: 0.01, explanation: "A is absent from final context, so coverage is 0%. Initial retrieval can succeed while context assembly fails." },
    },
    {
      id: "unsupported-claims", kind: "number", unit: "unsupported policy claims",
      label: "Check the displayed answer against its context",
      prompt: "Of the two displayed claims—60 days, and no receipt—how many are unsupported by the supplied context B?",
      hint: "Read B itself. A citation label is not evidence of support unless that passage actually supports the claim.",
      reference: "Both claims are unsupported: B says 14 days and requires a receipt. The count is two.",
      check: { expected: 2, tolerance: 0, explanation: "B supports neither displayed policy claim. The answer has a generation-faithfulness failure as well as a current-evidence assembly failure." },
    },
    {
      id: "diagnosis", kind: "reasoning", label: "Localize the failures",
      prompt: "Name the successful and failed stages. Propose one focused change and one test for each failure. Explain why a larger model or a larger candidate top-k is not yet a sufficient diagnosis.",
      hint: "A was ingested, retrieved, and retained by reranking. Where does it disappear? Separately ask whether the output follows the context it actually received.",
      reference: "Ingestion and candidate retrieval found A; authorization correctly removed C; reranking retained A. Context assembly dropped A, so inspect selection, version handling, and truncation. Generation then asserted claims unsupported by B. Test authorized-current evidence reaching final context, and claim/citation support separately. Increasing top-k or changing models does not by itself repair either boundary.",
    },
    {
      id: "corrected-answer", kind: "reasoning", label: "Write the corrected user answer",
      prompt: "Assume you repair assembly so that A reaches generation. Write the short answer you would show the North employee, with a source label and no invented conditions.",
      hint: "Answer both questions directly from A. Do not borrow the South policy or add exception rules that are not in the excerpt.",
      reference: "“Under the current North policy, submit expenses within 30 calendar days of the expense, and include a receipt. [A, North policy v3]” Equivalent supported wording is valid.",
    },
    {
      id: "missing-evidence", kind: "reasoning", label: "Handle missing current evidence",
      prompt: "Now A is unavailable; only old B and restricted C remain. Write the user response and system behavior. What should this case expect in an evaluation?",
      hint: "Missing authorized current evidence is a valid outcome. Do not turn a superseded document or an unauthorized passage into today's answer.",
      reference: "“I cannot verify the current North expense policy from the authorized sources available. Please check the current policy or contact its owner.” The system abstains, retains a diagnostic reason without exposing C, and seeks an authorized current source. Evaluation expects abstention, no restricted disclosure, and no unsupported current-policy claim.",
    },
  ],
  reference: {
    title: "Fix the evidence path and verify the claims separately",
    steps: [
      { title: "Apply authority and freshness before answering", explanation: "Only A meets both the permission and current-version requirements. B's old policy is not today's authority even though the caller can read it. C cannot be used at all for this caller. Permission filtering is an application boundary, not a suggestion to the model." },
      { title: "Follow evidence through the actual trace", explanation: "A is present after reranking and absent from final context. That localizes a defect to context assembly or its version/selection/truncation rules. The known gold-evidence coverage at that final boundary is 0%. Candidate recall alone would miss the failure. Capture source/version IDs at each stage to make this comparison reproducible." },
      { title: "Check support independently of retrieval", explanation: "The answer cites B, but B says 14 days and requires a receipt. Neither “60 days” nor “no receipt” follows from the supplied context. That is a separate unsupported-generation failure. The displayed wording resembles C, but the trace does not establish how it arose; do not infer that C leaked solely from textual similarity." },
      { title: "Define success for both available and missing evidence", explanation: "When A is supplied, the answer states 30 calendar days, requires a receipt, and cites A. When A is unavailable, it abstains or escalates for a current authorized source. Keep tests for source eligibility, final-context coverage, claim support, and missing-evidence behavior separate. This one case diagnoses mechanisms; it does not estimate the product's production accuracy." },
    ],
    artifact: [
      "Source   Authorized?   Current?   Eligible for this answer?",
      "A        yes           yes        yes",
      "B        yes           no         no: superseded",
      "C        no            yes        no: different workspace",
      "",
      "Gold {A}; final context {B}; final gold coverage = 0%",
      "Displayed claims: 60 days / no receipt → 0 of 2 supported by B",
      "",
      "Repair 1: preserve authorized current A through context assembly",
      "Test 1: final context contains A/v3 and excludes restricted C",
      "Repair 2: require supported claims and matching citations",
      "Test 2: deadline=30 days; receipt=required; supporting source=A",
      "Missing A: abstain; no unauthorized evidence or invented policy",
    ].join("\n"),
    alternatives: [
      "A deterministic template populated from verified policy fields can answer this narrow question. It still needs authorized current evidence.",
      "A model-generated draft is valid if source eligibility and claim support are checked. Exact wording need not match the reference.",
      "An escalation to an authorized policy owner is a useful missing-evidence outcome. Exposing South's policy or presenting old North guidance as current is not.",
    ],
    weakAnswer: {
      answer: "The answer has a citation, so it is grounded. Increase top-k or switch to a larger model if the policy looks wrong.",
      problem: "The cited passage supports neither claim, and the correct authorized source was already retrieved. An aggregate answer rating hides where evidence disappeared.",
      repair: "Compare candidate, reranked, and final source IDs; repair current-evidence assembly. Then evaluate each answer claim against its actual supporting passage. Include an expected-abstention case.",
    },
  },
  rubric: [
    {
      id: "eligibility", label: "Evidence eligibility", fields: ["sources"],
      levels: { revisit: "I used restricted C or treated any relevant source as authority.", partial: "I selected A but did not distinguish B's freshness issue from C's permission issue.", meets: "My first attempt chose A and separately explained why B is obsolete and C is unauthorized." },
      remediation: { task: "Rebuild the A/B/C table with separate permission, current-version, and eligibility columns. Explain the reason for each exclusion.", href: chapter + "#lessons", label: "Review authorized, current retrieval" },
    },
    {
      id: "localization", label: "Failure diagnosis", fields: ["evidence-coverage", "unsupported-claims", "diagnosis"],
      levels: { revisit: "I treated the citation as proof or proposed a model swap without checking the trace.", partial: "I found one failure but missed the distinction between dropped evidence and unsupported generation.", meets: "My first attempt measured 0% final gold coverage and two unsupported claims, localized both failures, and proposed separate tests." },
      remediation: { task: "Draw candidate → ACL → rerank → final-context IDs. Mark where A disappears, then check each displayed claim against B itself.", href: chapter + "#worked-example", label: "Review stage-by-stage RAG diagnosis" },
    },
    {
      id: "supported-answer", label: "Supported user response", fields: ["corrected-answer"],
      levels: { revisit: "My corrected answer still used the wrong deadline, omitted the receipt rule, or invented a condition.", partial: "I gave the right facts but omitted a supporting source/version or added an unsupported detail.", meets: "My first draft stated 30 calendar days and a required receipt, cited A, and added no unsupported policy." },
      remediation: { task: "Write exactly the two requested facts from A and attach its source/version. Underline each claim and point to its supporting text.", href: "/llm-engineering/05-prompting-as-software-engineering#lessons", label: "Review evidence-backed output contracts" },
    },
    {
      id: "abstention", label: "Missing-evidence behavior", fields: ["missing-evidence"],
      levels: { revisit: "I answered from old B, disclosed C, or invented today's policy.", partial: "I expressed uncertainty but did not define escalation or an expected-abstention evaluation case.", meets: "My first attempt abstained safely, sought a current authorized source, and specified no disclosure or unsupported current-policy claim as evaluation requirements." },
      remediation: { task: "Remove A and write the exact user response. Add a test whose correct outcome is abstention without disclosing C.", href: chapter + "#assignment", label: "Review missing-evidence outcomes" },
    },
  ],
  transfer: {
    prompt: "Try on paper: A now reaches context, but the draft still says 60 days. Then suppose a user loses access to A while the run is queued. Which stages and tests change?",
    reasoning: "With A present, investigate generation and claim verification; do not blame initial retrieval without evidence. With access revoked, recheck the relevant authorization before evidence publication and seek permitted current evidence or abstain. A previously retrieved passage is not a continuing permission grant. Keep the two cases separate in evaluation.",
  },
  next: { href: chapter + "#cumulative-practice", label: "Apply these checks to Harbor's evidence pipeline" },
  references: [sources.rag, sources.injection],
};
