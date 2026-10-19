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
  /** YYYY-MM: when the linked resource was reviewed; provider facts can change. */
  lastReviewed?: string;
};

export type RecallQuestion = {
  prompt: string;
  sampleAnswer: string;
};

export type ChapterPractice = {
  sampleSolution: {
    assumptions: string;
    /** A concrete reference artifact: table, protocol, diagram, or annotated draft. */
    artifact: string;
    explanation: string;
    checks: string[];
    pitfall: string;
  };
  cumulativePractice: {
    /** Earlier chapter orders, validated within this track. */
    revisit: number[];
    deliverable: string;
    prompt: string;
    sampleAnswer: string;
  };
};

export type ChapterStudyGuide = ChapterPractice & {
  /** Suggested minutes: read/example, assignment/variations, drill/repeats, recall/review. */
  minutes: [number, number, number, number];
  example: {
    title: string;
    scenario: string;
    steps: string[];
    decision: string;
    limitation: string;
  };
  assignment: {
    deliverable: string;
    tasks: string[];
    variations: string[];
    rubric: string[];
  };
  recall: RecallQuestion[];
  references: Reference[];
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
  studyGuide: ChapterStudyGuide;
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
  practiceProject: { title: string; brief: string };
  phaseOrder: string[];
  chapters: Chapter[];
};
