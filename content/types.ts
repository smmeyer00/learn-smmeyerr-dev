export type Depth =
  | "core"
  | "deep"
  | "studio"
  | "capstone"
  | "current"
  | "fluency"
  | "patterns";

export type FlowStep = {
  label: string;
  detail: string;
};

export type Lesson = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type QuizOption = string;

export type QuizQuestion = {
  question: string;
  options: QuizOption[];
  /** zero-based index of the correct option */
  answer: number;
  explanation: string;
};

export type Reference = {
  label: string;
  href: string;
  /** YYYY-MM: when the link was verified; provider facts are update-sensitive */
  lastReviewed?: string;
};

export type Chapter = {
  /** URL slug, prefixed with zero-padded order, e.g. "01-system-design-foundations" */
  slug: string;
  order: number;
  title: string;
  phase: string;
  /** estimated hours of study */
  hours: number;
  depth: Depth;
  /** one sentence: what the learner can do after this chapter */
  outcome: string;
  why: string;
  /** coverage contract: subtopics the chapter must teach */
  coverage: string[];
  mentalModel: {
    /** one sentence describing the model */
    statement: string;
    flow: FlowStep[];
  };
  lessons: Lesson[];
  seniorSignal: string;
  pitfalls: string[];
  drill: {
    prompt: string;
    constraints: string[];
    approach: string;
  };
  quiz: QuizQuestion[];
  /** planned interactive labs (from the visual/interaction briefs) */
  labs: string[];
  references?: Reference[];
};

export type Course = {
  slug: string;
  id: string;
  title: string;
  /** short line used on the index page */
  description: string;
  scope: string;
  phaseOrder: string[];
  chapters: Chapter[];
};
