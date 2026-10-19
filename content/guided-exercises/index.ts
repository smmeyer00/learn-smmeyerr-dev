import { cacheExpiry } from "./cache-expiry";
import { groundedSupport } from "./grounded-support";

export type { GuidedExercise, GuidedExerciseSummary, ExerciseField, ExerciseCriterion } from "./types";
export const guidedExercises = [cacheExpiry, groundedSupport];
export const guidedExerciseSummaries = guidedExercises.map(
  ({ id, version, title, track, courseSlug, minutes, outcome, prerequisites }) =>
    ({ id, version, title, track, courseSlug, minutes, outcome, prerequisites }),
);

export function getGuidedExercise(id: string) {
  return guidedExercises.find((exercise) => exercise.id === id);
}
