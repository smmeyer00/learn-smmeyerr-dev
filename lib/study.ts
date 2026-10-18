import type { ProgressStateV1, DrillAttempt } from "./progress";

export const CHAPTER_REVIEW_DELAY_MS = 48 * 60 * 60 * 1000;

export type StudyChapter = {
  key: string;
  courseSlug: string;
  courseTitle: string;
  chapterTitle: string;
};

export function latestChapterPractice(
  state: ProgressStateV1,
  key: string,
): DrillAttempt | undefined {
  return state.drillAttempts
    .filter((attempt) => attempt.chapterKey === key)
    .at(-1);
}

export function nextIncompleteChapter(
  chapters: StudyChapter[],
  completed: string[],
  afterKey: string,
): StudyChapter | undefined {
  const current = chapters.find((chapter) => chapter.key === afterKey);
  if (!current) return undefined;
  const track = chapters.filter(
    (chapter) => chapter.courseSlug === current.courseSlug,
  );
  const position = track.findIndex((chapter) => chapter.key === afterKey);
  return [...track.slice(position + 1), ...track.slice(0, position + 1)].find(
    (chapter) => !completed.includes(chapter.key),
  );
}

export type ChapterReview = StudyChapter & {
  reason: "rebuild" | "quiz" | "due";
  lastAt: number;
};

/** Only attempted work enters review; unvisited chapters remain on the roadmap. */
export function chapterReviewQueue(
  chapters: StudyChapter[],
  state: ProgressStateV1,
  now: number,
): ChapterReview[] {
  const rows: ChapterReview[] = [];
  for (const chapter of chapters) {
    const practice = latestChapterPractice(state, chapter.key);
    const practiceAt = practice ? Date.parse(practice.completedAt) : 0;
    const validPracticeAt = Number.isFinite(practiceAt) ? practiceAt : 0;
    const latestAnswers = new Map<
      number,
      (typeof state.quizAttempts)[string][number]
    >();
    for (const answer of state.quizAttempts[chapter.key] ?? [])
      latestAnswers.set(answer.questionIndex, answer);
    const wrongAt = Math.max(
      0,
      ...Array.from(latestAnswers.values())
        .filter((answer) => !answer.correct)
        .map((answer) => Date.parse(answer.attemptedAt))
        .filter(Number.isFinite),
    );
    if (practice?.score !== undefined && practice.score <= 2) {
      rows.push({ ...chapter, reason: "rebuild", lastAt: validPracticeAt });
    } else if (wrongAt > validPracticeAt) {
      rows.push({ ...chapter, reason: "quiz", lastAt: wrongAt });
    } else if (
      validPracticeAt > 0 &&
      now - validPracticeAt >= CHAPTER_REVIEW_DELAY_MS
    ) {
      rows.push({ ...chapter, reason: "due", lastAt: validPracticeAt });
    }
  }
  const rank = { rebuild: 0, quiz: 1, due: 2 };
  return rows.sort(
    (a, b) => rank[a.reason] - rank[b.reason] || a.lastAt - b.lastAt,
  );
}
