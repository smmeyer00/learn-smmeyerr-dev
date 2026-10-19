import type { Reference } from "../types";

export type ExerciseField = {
  id: string;
  label: string;
  prompt: string;
  hint: string;
  reference: string;
  kind: "number" | "reasoning";
  unit?: string;
  check?: { expected: number; tolerance: number; explanation: string };
};

export type ExerciseCriterion = {
  id: string;
  label: string;
  fields: string[];
  levels: { revisit: string; partial: string; meets: string };
  remediation: { task: string; href: string; label: string };
};

export type GuidedExercise = {
  id: string;
  version: number;
  title: string;
  track: string;
  courseSlug: string;
  minutes: number;
  outcome: string;
  brief: string[];
  givens: { label: string; value: string }[];
  prerequisites: { label: string; href: string }[];
  deliverable: string;
  fields: ExerciseField[];
  reference: {
    title: string;
    steps: { title: string; explanation: string }[];
    artifact: string;
    alternatives: string[];
    weakAnswer: { answer: string; problem: string; repair: string };
  };
  rubric: ExerciseCriterion[];
  transfer: { prompt: string; reasoning: string };
  next: { href: string; label: string };
  references: Reference[];
};

export type GuidedExerciseSummary = Pick<GuidedExercise,
  "id" | "version" | "title" | "track" | "courseSlug" | "minutes" | "outcome" | "prerequisites">;
