"use client";

import { useId, useState } from "react";
import type { RecallQuestion } from "@/content/types";
import { recordDrillAttempt, useProgress } from "@/lib/progress";
import { latestChapterPractice } from "@/lib/study";
import { useHydrated } from "@/lib/use-hydrated";

function RecallCheck({
  question,
  order,
}: {
  question: RecallQuestion;
  order: number;
}) {
  const id = useId();
  const hydrated = useHydrated();
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  return (
    <li className="border-b pb-6">
      <label htmlFor={id} className="block text-base font-medium leading-7">
        {order}. {question.prompt}
      </label>
      <textarea
        id={id}
        rows={3}
        value={answer}
        disabled={!hydrated}
        onChange={(event) => setAnswer(event.target.value)}
        placeholder="Explain your reasoning before comparing."
        className="mt-3 w-full rounded border bg-secondary/40 p-3 text-sm leading-6"
      />
      <button
        type="button"
        disabled={!answer.trim()}
        onClick={() => setRevealed(true)}
        aria-expanded={revealed}
        aria-controls={`${id}-sample`}
        className="mt-2 min-h-11 cursor-pointer rounded border px-3 font-mono text-xs text-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        compare with a sample answer
      </button>
      {revealed && (
        <div
          id={`${id}-sample`}
          className="mt-3 border-l-2 border-primary/50 pl-3"
          role="status"
        >
          <p className="font-mono text-xs text-primary">
            sample answer · compare the reasoning
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {question.sampleAnswer}
          </p>
        </div>
      )}
    </li>
  );
}

const ratings = [
  {
    score: 1,
    label: "1 · rebuild",
    description: "I could not explain the mechanism.",
  },
  {
    score: 2,
    label: "2 · gaps",
    description: "I needed the example or missed an important condition.",
  },
  {
    score: 3,
    label: "3 · explain",
    description: "I met the rubric without reading the solution.",
  },
  {
    score: 4,
    label: "4 · transfer",
    description:
      "I also handled a changed constraint and defended the tradeoff.",
  },
];

export function RecallPractice({
  courseSlug,
  chapterSlug,
  questions,
}: {
  courseSlug: string;
  chapterSlug: string;
  questions: RecallQuestion[];
}) {
  const key = `${courseSlug}/${chapterSlug}`;
  const progress = useProgress();
  const hydrated = useHydrated();
  const last = latestChapterPractice(progress, key);
  const [score, setScore] = useState<number | null>(null);
  const [evidence, setEvidence] = useState("");
  const [logged, setLogged] = useState(false);
  const id = useId();
  return (
    <div className="mt-3">
      <p className="text-sm leading-6 text-muted-foreground">
        Close the worked example and explain these from memory. Answers are
        self-reviewed. Drafts stay on this page; save anything you want to keep
        in chapter notes.
      </p>
      <ol className="mt-5 space-y-6">
        {questions.map((question, index) => (
          <RecallCheck
            key={question.prompt}
            question={question}
            order={index + 1}
          />
        ))}
      </ol>
      <form
        className="mt-6"
        onSubmit={(event) => {
          event.preventDefault();
          if (score === null) return;
          recordDrillAttempt({
            chapterKey: key,
            score,
            completedAt: new Date().toISOString(),
            ...(evidence.trim() ? { note: evidence.trim() } : {}),
          });
          setLogged(true);
        }}
      >
        <fieldset>
          <legend className="text-base font-medium">
            Rate the assignment and recall together
          </legend>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Use the assignment rubric as evidence. Completion is your own
            judgment; this score schedules practice.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {ratings.map((rating) => (
              <label
                key={rating.score}
                className="flex cursor-pointer gap-3 rounded border p-3 text-sm leading-6"
              >
                <input
                  type="radio"
                  name={`${id}-rating`}
                  value={rating.score}
                  checked={score === rating.score}
                  required
                  disabled={!hydrated}
                  onChange={() => {
                    setScore(rating.score);
                    setLogged(false);
                  }}
                  className="mt-1 h-4 w-4 shrink-0 accent-(--color-primary)"
                />
                <span>
                  <span className="block font-mono text-xs text-primary">
                    {rating.label}
                  </span>
                  {rating.description}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <label htmlFor={`${id}-evidence`} className="mt-4 block text-sm">
          One piece of evidence or your next practice task (optional)
        </label>
        <textarea
          id={`${id}-evidence`}
          rows={2}
          value={evidence}
          disabled={!hydrated}
          onChange={(event) => {
            setEvidence(event.target.value);
            setLogged(false);
          }}
          className="mt-2 w-full rounded border bg-secondary/40 p-3 text-sm leading-6"
        />
        <button
          type="submit"
          disabled={score === null || logged}
          className="mt-3 min-h-11 cursor-pointer rounded border border-primary/50 px-4 font-mono text-xs text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          log chapter practice
        </button>
        {logged && (
          <p role="status" className="mt-3 text-sm leading-6 text-primary">
            Saved locally.{" "}
            {score !== null && score <= 2
              ? "This chapter is in your review queue for the next session."
              : "This chapter will return to your review queue after 48 hours."}
          </p>
        )}
        {last && (
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            Last practice: {last.score}/4{last.note ? ` · ${last.note}` : ""}.
            Review tasks appear on the home page and course roadmap.
          </p>
        )}
      </form>
    </div>
  );
}
