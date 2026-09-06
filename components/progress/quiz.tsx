"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/content/types";
import {
  chapterKey,
  latestQuizAttempts,
  recordQuizAttempt,
  useProgress,
} from "@/lib/progress";

const letters = ["A", "B", "C", "D"];

/**
 * Interactive knowledge checks. Selecting an option reveals correctness +
 * explanation and records a local attempt (history kept per chapter).
 * Correctness is announced in text, never by color alone.
 */
export function Quiz({
  courseSlug,
  chapterSlug,
  questions,
}: {
  courseSlug: string;
  chapterSlug: string;
  questions: QuizQuestion[];
}) {
  const progress = useProgress();
  const key = chapterKey(courseSlug, chapterSlug);
  const answered = latestQuizAttempts(progress, key);
  // Local echo so feedback is instant even before the store round-trips.
  const [pending, setPending] = useState<Record<number, number>>({});

  function choose(questionIndex: number, selectedIndex: number) {
    const question = questions[questionIndex];
    setPending((prev) => ({ ...prev, [questionIndex]: selectedIndex }));
    recordQuizAttempt({
      chapterKey: key,
      questionIndex,
      selectedIndex,
      correct: selectedIndex === question.answer,
      attemptedAt: new Date().toISOString(),
    });
  }

  return (
    <ol className="mt-3 space-y-6">
      {questions.map((q, qi) => {
        const stored = answered.get(qi)?.selectedIndex;
        const chosen = pending[qi] ?? stored;
        const revealed = chosen !== undefined;
        const attempts = (progress.quizAttempts[key] ?? []).filter(
          (a) => a.questionIndex === qi,
        ).length;
        return (
          <li key={qi} className="border-b pb-6">
            <p className="text-[0.9375rem] font-medium leading-7 text-foreground">
              <span className="mr-3 font-mono text-xs text-muted-foreground">
                {String(qi + 1).padStart(2, "0")}
              </span>
              {q.question}
            </p>
            <div
              role="group"
              aria-label={`options for question ${qi + 1}`}
              className="mt-3 grid gap-1.5"
            >
              {q.options.map((option, oi) => {
                const isChosen = chosen === oi;
                const isAnswer = q.answer === oi;
                const showState = revealed && (isChosen || isAnswer);
                return (
                  <button
                    key={oi}
                    type="button"
                    onClick={() => choose(qi, oi)}
                    aria-pressed={isChosen}
                    className={`flex cursor-pointer items-baseline gap-2.5 rounded border px-2.5 py-1.5 text-left font-mono text-xs leading-6 transition-colors ${
                      showState && isAnswer
                        ? "border-primary/50 bg-primary/5 text-foreground"
                        : showState && isChosen
                          ? "border-destructive/50 text-foreground"
                          : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                    }`}
                  >
                    <span className="text-border">{letters[oi]}.</span>
                    <span className="flex-1">{option}</span>
                    {showState && isAnswer && (
                      <span className="text-primary">✓ correct</span>
                    )}
                    {showState && isChosen && !isAnswer && (
                      <span className="text-destructive">✗ not quite</span>
                    )}
                  </button>
                );
              })}
            </div>
            {revealed ? (
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                <span className="font-mono text-xs text-primary">
                  {letters[q.answer]} —{" "}
                </span>
                <span className="font-mono text-xs text-foreground">
                  {q.options[q.answer]}
                </span>{" "}
                · {q.explanation}
                {attempts > 1 && (
                  <span className="font-mono text-[0.6875rem]">
                    {" "}
                    (attempts: {attempts})
                  </span>
                )}
              </p>
            ) : (
              <p className="mt-3 font-mono text-[0.6875rem] text-muted-foreground">
                select an option to check your answer
                {attempts > 0 && ` (attempts: ${attempts})`}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
