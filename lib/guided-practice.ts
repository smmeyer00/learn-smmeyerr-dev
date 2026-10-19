import type { GuidedExercise } from "../content/guided-exercises/types";

export type GuidedStage = "brief" | "attempt" | "compare" | "revise" | "complete";
export type ReviewRating = "revisit" | "partial" | "meets";
export type GuidedDraft = {
  version: number;
  stage: GuidedStage;
  answers: Record<string, string>;
  firstAttempt: Record<string, string> | null;
  ratings: Record<string, ReviewRating>;
  evidence: Record<string, string>;
  revision: string;
  completedAt?: string;
};
export type GuidedAttempt = GuidedDraft & { stage: "complete"; completedAt: string; needsPractice: boolean };
export type GuidedExerciseState = { draft: GuidedDraft; attempts: GuidedAttempt[] };
export const GUIDED_REVIEW_DELAY_MS = 48 * 60 * 60 * 1000;

export function newGuidedDraft(version: number): GuidedDraft {
  return { version, stage: "brief", answers: {}, firstAttempt: null, ratings: {}, evidence: {}, revision: "" };
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function strings(value: unknown): value is Record<string, string> {
  return record(value) && Object.values(value).every((item) => typeof item === "string");
}
function validDraft(value: unknown): value is GuidedDraft {
  if (!record(value) || value.version !== 1 ||
      !["brief", "attempt", "compare", "revise", "complete"].includes(String(value.stage)) ||
      !strings(value.answers) || !strings(value.evidence) ||
      !record(value.ratings) || !Object.values(value.ratings).every((rating) =>
        rating === "revisit" || rating === "partial" || rating === "meets") ||
      typeof value.revision !== "string" ||
      !(value.firstAttempt === null || strings(value.firstAttempt))) return false;
  if (["compare", "revise", "complete"].includes(String(value.stage)) && value.firstAttempt === null) return false;
  if (value.stage === "complete" &&
      (typeof value.completedAt !== "string" || typeof value.needsPractice !== "boolean")) return false;
  return value.completedAt === undefined ||
    (typeof value.completedAt === "string" && Number.isFinite(Date.parse(value.completedAt)));
}
function validAttempt(value: unknown): value is GuidedAttempt {
  return validDraft(value) && value.stage === "complete" && typeof value.completedAt === "string" &&
    "needsPractice" in value && typeof value.needsPractice === "boolean";
}

/** Old progress files have no guided work. Invalid local rows cannot break rendering. */
export function migrateGuidedExercises(raw: unknown): Record<string, GuidedExerciseState> {
  if (!record(raw)) return {};
  return Object.fromEntries(Object.entries(raw).flatMap(([id, value]) => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || !record(value)) return [];
    const attempts = Array.isArray(value.attempts) ? value.attempts.filter(validAttempt) : [];
    const draft = validDraft(value.draft) ? value.draft : attempts.at(-1);
    return draft ? [[id, { draft, attempts }]] : [];
  }));
}

/** Imports reject malformed/future guided data instead of replacing it with empty work. */
export function validGuidedImport(raw: unknown): boolean {
  if (raw === undefined) return true;
  if (!record(raw)) return false;
  return Object.entries(raw).every(([id, value]) =>
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) && record(value) &&
    validDraft(value.draft) && Array.isArray(value.attempts) && value.attempts.every(validAttempt));
}

export function canCompare(exercise: GuidedExercise, draft: GuidedDraft): boolean {
  return exercise.fields.every((field) => (draft.answers[field.id] ?? "").trim().length > 0);
}

export function canRevise(exercise: GuidedExercise, draft: GuidedDraft): boolean {
  return exercise.rubric.every((criterion) =>
    ["revisit", "partial", "meets"].includes(draft.ratings[criterion.id] ?? "") &&
    (draft.evidence[criterion.id] ?? "").trim().length > 0);
}

export function canFinish(exercise: GuidedExercise, draft: GuidedDraft): boolean {
  return draft.stage === "revise" && draft.firstAttempt !== null &&
    canRevise(exercise, draft) && draft.revision.trim().length > 0;
}

/** Accept normal decimal numbers and well-formed thousands separators, not units or partial parses. */
export function readExerciseNumber(text: string): number | null {
  const value = text.trim();
  if (!/^[+-]?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value)) return null;
  const parsed = Number(value.replaceAll(",", ""));
  return Number.isFinite(parsed) ? parsed : null;
}

export function calculationChecks(exercise: GuidedExercise, draft: GuidedDraft) {
  const answers = draft.firstAttempt ?? draft.answers;
  return exercise.fields.flatMap((field) => {
    if (!field.check) return [];
    const actual = readExerciseNumber(answers[field.id] ?? "");
    return [{
      id: field.id,
      label: field.label,
      correct: actual !== null && Math.abs(actual - field.check.expected) <= field.check.tolerance,
      actual,
      expected: field.check.expected,
      explanation: field.check.explanation,
    }];
  });
}

/** Explicit rules, never a text/LLM grade. A self-rating cannot override a failed numeric check. */
export function exerciseFeedback(exercise: GuidedExercise, draft: GuidedDraft) {
  const failed = new Set(calculationChecks(exercise, draft).filter((check) => !check.correct).map((check) => check.id));
  const gaps = exercise.rubric.filter((criterion) =>
    draft.ratings[criterion.id] !== "meets" || criterion.fields.some((id) => failed.has(id)));
  return { gaps, meets: gaps.length === 0 };
}

export function guidedReviewState(
  exercise: Pick<GuidedExercise, "version">,
  state: GuidedExerciseState | undefined,
  now: number,
): "new" | "weak" | "due" | "fresh" {
  const last = state?.attempts.at(-1);
  if (!last) return "new";
  if (last.version !== exercise.version || last.needsPractice) return "weak";
  return now - Date.parse(last.completedAt) >= GUIDED_REVIEW_DELAY_MS ? "due" : "fresh";
}

export function makeGuidedAttempt(exercise: GuidedExercise, draft: GuidedDraft, completedAt: string): GuidedAttempt | null {
  if (!canFinish(exercise, draft) || !Number.isFinite(Date.parse(completedAt))) return null;
  return { ...draft, stage: "complete", completedAt, needsPractice: !exerciseFeedback(exercise, draft).meets };
}
