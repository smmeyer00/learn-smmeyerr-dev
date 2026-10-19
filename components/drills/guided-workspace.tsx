"use client";

import Link from "next/link";
import { useRef } from "react";
import type { GuidedExercise } from "@/content/guided-exercises/types";
import {
  calculationChecks, canCompare, canRevise, canFinish, exerciseFeedback,
  newGuidedDraft, type GuidedDraft, type GuidedStage, type ReviewRating,
} from "@/lib/guided-practice";
import { finishGuidedExercise, retryGuidedExercise, saveGuidedDraft, useProgress } from "@/lib/progress";
import { useHydrated } from "@/lib/use-hydrated";

const inputClass = "mt-3 w-full rounded border bg-secondary/40 p-3 text-base leading-7";
const buttonClass = "min-h-11 cursor-pointer rounded border border-primary/50 px-4 py-2 font-mono text-xs text-primary disabled:cursor-not-allowed disabled:opacity-50";
const linkClass = "inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4";
const stages = ["brief", "attempt", "compare", "revise", "complete"] as const;
const labels = ["Read the brief", "Make an attempt", "Compare & assess", "Revise your work"];
const ratings: { id: ReviewRating; label: string }[] = [
  { id: "revisit", label: "Revisit" },
  { id: "partial", label: "Partial" },
  { id: "meets", label: "Meets the goal" },
];

function YourAttempt({ exercise, draft, withReference = false }: { exercise: GuidedExercise; draft: GuidedDraft; withReference?: boolean }) {
  return (
    <details className="mt-5 border-y py-3">
      <summary className="min-h-11 cursor-pointer text-sm text-primary">{withReference ? "Compare your worksheet item by item" : "Your preserved first attempt"}</summary>
      <dl className="mt-3 space-y-5">
        {exercise.fields.map((field) => (
          <div key={field.id}>
            <dt className="text-sm font-medium">{field.label}</dt>
            <dd className={"mt-2 text-sm leading-6 " + (withReference ? "grid gap-4 sm:grid-cols-2" : "")}>
              <div>
                {withReference && <p className="mb-2 font-medium">Your first attempt</p>}
                <p className="whitespace-pre-wrap break-words text-muted-foreground">{draft.firstAttempt?.[field.id] ?? "No answer recorded."}</p>
              </div>
              {withReference && <div><p className="mb-2 font-medium text-primary">Reference reasoning</p><p className="text-foreground/90">{field.reference}</p></div>}
            </dd>
          </div>
        ))}
      </dl>
    </details>
  );
}

function ReferenceAnswer({ exercise }: { exercise: GuidedExercise }) {
  return (
    <section aria-label="worked reference answer" className="mt-8">
      <p className="font-mono text-xs text-primary">worked reference · compare mechanisms and assumptions</p>
      <h3 className="mt-3 text-xl font-medium">{exercise.reference.title}</h3>
      <ol className="mt-5 space-y-6">
        {exercise.reference.steps.map((step, index) => (
          <li key={step.title}>
            <h4 className="font-medium">{index + 1}. {step.title}</h4>
            <p className="mt-2 text-base leading-7 text-foreground/90">{step.explanation}</p>
          </li>
        ))}
      </ol>
      <pre className="mt-6 overflow-x-auto whitespace-pre-wrap break-words border-l-2 border-primary/40 bg-secondary/40 p-4 text-sm leading-6">
        {exercise.reference.artifact}
      </pre>
      <h4 className="mt-6 font-medium">Other defensible choices</h4>
      <ul className="mt-3 list-disc space-y-3 pl-5 text-sm leading-6 text-muted-foreground">
        {exercise.reference.alternatives.map((alternative) => <li key={alternative}>{alternative}</li>)}
      </ul>
      <details className="mt-5 border-y py-3">
        <summary className="min-h-11 cursor-pointer text-sm text-primary">Inspect a plausible weak answer</summary>
        <blockquote className="mt-3 border-l-2 pl-4 text-base leading-7">{exercise.reference.weakAnswer.answer}</blockquote>
        <p className="mt-3 text-sm leading-6"><strong>Why it falls short: </strong>{exercise.reference.weakAnswer.problem}</p>
        <p className="mt-3 text-sm leading-6"><strong>Repair: </strong>{exercise.reference.weakAnswer.repair}</p>
      </details>
      <details className="mt-4">
        <summary className="min-h-11 cursor-pointer text-sm text-muted-foreground">Further reading</summary>
        <ul className="mt-2 space-y-2 text-sm">
          {exercise.references.map((reference) => (
            <li key={reference.href}>
              <a href={reference.href} target="_blank" rel="noopener noreferrer" className={linkClass}>{reference.label} ↗</a>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}

function NextRepair({ exercise, draft }: { exercise: GuidedExercise; draft: GuidedDraft }) {
  const feedback = exerciseFeedback(exercise, draft);
  const first = feedback.gaps[0];
  return (
    <div className="mt-5 border-l-2 border-primary/60 pl-4">
      <h3 className="font-medium">{first ? "Focus your next repair: " + first.label : "Strengthen your reasoning"}</h3>
      <p className="mt-2 text-base leading-7">
        {first ? first.remediation.task : "Your calculation checks pass and you marked every criterion as met. Explain one alternative's downside, or handle the changed constraint below. The reasoning assessment is your own judgment."}
      </p>
      {first && <Link className={linkClass} href={first.remediation.href}>{first.remediation.label} →</Link>}
      {feedback.gaps.length > 1 && (
        <details className="mt-3">
          <summary className="min-h-11 cursor-pointer text-sm text-muted-foreground">Other criteria to revisit ({feedback.gaps.length - 1})</summary>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6">
            {feedback.gaps.slice(1).map((criterion) => <li key={criterion.id}><strong>{criterion.label}: </strong>{criterion.remediation.task}</li>)}
          </ul>
        </details>
      )}
    </div>
  );
}

export function GuidedWorkspace({ exercise }: { exercise: GuidedExercise }) {
  const progress = useProgress();
  const hydrated = useHydrated();
  const state = progress.guidedExercises[exercise.id];
  const draft = state?.draft ?? newGuidedDraft(exercise.version);
  const stage = draft.stage;
  const position = stages.indexOf(stage);
  const heading = useRef<HTMLHeadingElement>(null);

  function save(next: GuidedDraft) {
    saveGuidedDraft(exercise.id, next);
  }
  function focusStep() {
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: "start" });
    });
  }
  function move(stage: GuidedStage) {
    save({ ...draft, stage });
    focusStep();
  }

  return (
    <div className="mt-8">
      <ol aria-label="Exercise steps" className="grid grid-cols-2 gap-x-4 gap-y-3 border-y py-4 sm:grid-cols-4">
        {labels.map((label, index) => (
          <li key={label} aria-current={position === index ? "step" : undefined} className="text-sm leading-6">
            <span className={position >= index ? "text-primary" : "text-muted-foreground"}>{index + 1}. {label}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        {state ? "Your worksheet is saved in this browser with your course progress." : "Your work saves locally as you go. You can leave and return to this exercise."}{" "}
        <Link href="/#progress-data" className="underline underline-offset-4">Export a backup</Link>.
      </p>

      <details id="case-brief" key={stage === "brief" || stage === "attempt" ? "open-brief" : "reference-brief"} open={stage === "brief" || stage === "attempt"} className="mt-6 scroll-mt-6 border-y py-3">
        <summary className="min-h-11 cursor-pointer font-medium">Case brief and givens</summary>
        {exercise.brief.map((paragraph) => <p key={paragraph} className="mt-4 text-base leading-7">{paragraph}</p>)}
        <dl className="mt-5 divide-y border-y">
          {exercise.givens.map((given) => (
            <div key={given.label} className="py-4">
              <dt className="text-sm font-medium text-primary">{given.label}</dt>
              <dd className="mt-2 whitespace-pre-wrap text-base leading-7">{given.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-base leading-7"><strong>Produce: </strong>{exercise.deliverable}</p>
        <p className="mt-4 text-sm font-medium">Useful preparation</p>
        <ul className="mt-1">
          {exercise.prerequisites.map((prerequisite) => <li key={prerequisite.href}><Link className={linkClass} href={prerequisite.href}>{prerequisite.label} →</Link></li>)}
        </ul>
      </details>

      <section aria-label="Current exercise step" className="mt-8">
        <h2 ref={heading} tabIndex={-1} className="scroll-mt-6 text-xl font-medium outline-none">
          {stage === "brief" ? "1. Read the brief" : stage === "attempt" ? "2. Make a first attempt" : stage === "compare" ? "3. Compare and assess your first attempt" : stage === "revise" ? "4. Revise the weakest part" : "Reviewed attempt saved"}
        </h2>

        {stage === "brief" && (
          <>
            <p className="mt-3 text-base leading-7">Start with your own reasoning. Use hints when needed; the worked reference appears after you submit a first attempt. You will assess that original work, then save a revision alongside it.</p>
            <button type="button" disabled={!hydrated} className={buttonClass + " mt-5"} onClick={() => move("attempt")}>
              {Object.keys(draft.answers).length ? "Continue my worksheet" : "Start the worksheet"}
            </button>
          </>
        )}

        {stage === "attempt" && (
          <form onSubmit={(event) => {
            event.preventDefault();
            if (!canCompare(exercise, draft)) return;
            save({ ...draft, firstAttempt: { ...draft.answers }, stage: "compare" });
            focusStep();
          }}>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Keep the givens available. Answer every item, or state what you are unsure about. Hints are part of guided practice; try a later repeat without them. Your first attempt will be preserved when you compare.</p>
            <a href="#case-brief" className={linkClass}>Refer to the case facts ↑</a>
            <ol className="mt-6 space-y-8">
              {exercise.fields.map((field, index) => (
                <li key={field.id}>
                  <label htmlFor={exercise.id + "-" + field.id} className="block font-medium">{index + 1}. {field.label}</label>
                  <p id={field.id + "-prompt"} className="mt-2 text-base leading-7">{field.prompt}</p>
                  {field.kind === "number" ? (
                    <div>
                      <input id={exercise.id + "-" + field.id} aria-label={field.label} aria-describedby={field.id + "-prompt " + field.id + "-unit"} type="text" inputMode="decimal" maxLength={1000} disabled={!hydrated} value={draft.answers[field.id] ?? ""} onChange={(event) => save({ ...draft, answers: { ...draft.answers, [field.id]: event.target.value } })} className={inputClass + " sm:max-w-xs"} />
                      <p id={field.id + "-unit"} className="mt-1 text-sm text-muted-foreground">{field.unit}</p>
                      <button type="button" disabled={!hydrated} onClick={() => save({ ...draft, answers: { ...draft.answers, [field.id]: "not sure" } })} className="mt-1 min-h-11 cursor-pointer text-sm text-primary underline underline-offset-4 disabled:opacity-50">Mark as not sure yet</button>
                    </div>
                  ) : (
                    <textarea id={exercise.id + "-" + field.id} aria-label={field.label} aria-describedby={field.id + "-prompt"} rows={4} maxLength={10000} disabled={!hydrated} value={draft.answers[field.id] ?? ""} onChange={(event) => save({ ...draft, answers: { ...draft.answers, [field.id]: event.target.value } })} className={inputClass} placeholder="Write your reasoning, or explain what you are unsure about." />
                  )}
                  <details className="mt-2">
                    <summary className="min-h-11 cursor-pointer text-sm text-primary">Hint: {field.label}</summary>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{field.hint}</p>
                  </details>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-sm leading-6 text-muted-foreground">The comparison checks the numerical values. You will assess the reasoning against explicit criteria; it is not automatically graded.</p>
            <button type="submit" className={buttonClass + " mt-3"} disabled={!hydrated || !canCompare(exercise, draft)}>Compare my attempt</button>
            {!canCompare(exercise, draft) && <p className="mt-2 text-sm text-muted-foreground">Answer every item before comparing. “Not sure” is an acceptable attempt.</p>}
          </form>
        )}

        {stage === "compare" && (
          <>
            <YourAttempt exercise={exercise} draft={draft} withReference />
            <section aria-label="calculation checks" className="mt-6">
              <h3 className="font-medium">Calculation checks</h3>
              <ul className="mt-3 divide-y border-y">
                {calculationChecks(exercise, draft).map((check) => (
                  <li key={check.id} className="py-4">
                    <p className={check.correct ? "text-primary" : "text-foreground"}><strong>{check.correct ? "Matches" : "Revisit"} · {check.label}</strong></p>
                    <p className="mt-2 text-sm leading-6">{check.explanation}</p>
                    {!check.correct && <p className="mt-1 text-sm text-muted-foreground">Your answer: {draft.firstAttempt?.[check.id]} · expected number: {check.expected}.</p>}
                  </li>
                ))}
              </ul>
            </section>
            <ReferenceAnswer exercise={exercise} />
            <form className="mt-8" onSubmit={(event) => { event.preventDefault(); if (canRevise(exercise, draft)) move("revise"); }}>
              <h3 className="text-xl font-medium">Assess your first attempt</h3>
              <p className="mt-3 text-base leading-7">For each criterion, select the description that matches the work you wrote before opening the reference. Cite a calculation, sentence, or missing step as evidence. The revision comes next. A failed calculation remains a review item even if you mark its criterion as met.</p>
              <div className="mt-6 space-y-8">
                {exercise.rubric.map((criterion) => (
                  <fieldset key={criterion.id}>
                    <legend className="font-medium">{criterion.label}</legend>
                    <div className="mt-3 space-y-2">
                      {ratings.map((rating) => (
                        <label key={rating.id} className="flex min-h-11 cursor-pointer gap-3 border-l-2 border-border py-2 pl-3 text-sm leading-6">
                          <input type="radio" name={exercise.id + "-" + criterion.id} value={rating.id} checked={draft.ratings[criterion.id] === rating.id} disabled={!hydrated} onChange={() => save({ ...draft, ratings: { ...draft.ratings, [criterion.id]: rating.id } })} className="mt-1 h-4 w-4 shrink-0 accent-(--color-primary)" />
                          <span><strong className="block text-primary">{rating.label} · {criterion.label}</strong>{criterion.levels[rating.id]}</span>
                        </label>
                      ))}
                    </div>
                    <label htmlFor={criterion.id + "-evidence"} className="mt-3 block text-sm font-medium">Evidence for {criterion.label}</label>
                    <textarea id={criterion.id + "-evidence"} rows={2} maxLength={10000} disabled={!hydrated} className={inputClass} value={draft.evidence[criterion.id] ?? ""} onChange={(event) => save({ ...draft, evidence: { ...draft.evidence, [criterion.id]: event.target.value } })} placeholder="Point to your original reasoning, or name what it omitted." />
                  </fieldset>
                ))}
              </div>
              <button type="submit" disabled={!hydrated || !canRevise(exercise, draft)} className={buttonClass + " mt-6"}>Continue to revision</button>
              {!canRevise(exercise, draft) && <p className="mt-2 text-sm text-muted-foreground">Choose a description and give evidence for every criterion.</p>}
            </form>
          </>
        )}

        {stage === "revise" && (
          <>
            <NextRepair exercise={exercise} draft={draft} />
            <YourAttempt exercise={exercise} draft={draft} />
            <details className="mt-4 border-y py-3">
              <summary className="min-h-11 cursor-pointer text-sm text-primary">Reopen the worked reference</summary>
              <ReferenceAnswer exercise={exercise} />
            </details>
            <form className="mt-6" onSubmit={(event) => {
              event.preventDefault();
              if (!canFinish(exercise, draft)) return;
              finishGuidedExercise(exercise, draft, new Date().toISOString());
              focusStep();
            }}>
              <label htmlFor="exercise-revision" className="block font-medium">Your revision and why it improves the answer</label>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Rewrite the weakest calculation, timeline, or response. Include what you changed and why. If you met every criterion, explain an alternative or the changed constraint. Your original work stays preserved.</p>
              <textarea id="exercise-revision" rows={7} maxLength={10000} disabled={!hydrated} className={inputClass} value={draft.revision} onChange={(event) => save({ ...draft, revision: event.target.value })} />
              <button type="submit" disabled={!hydrated || !canFinish(exercise, draft)} className={buttonClass + " mt-4"}>Save reviewed attempt</button>
              <button type="button" onClick={() => move("compare")} className={linkClass + " ml-4"}>Back to assessment</button>
            </form>
          </>
        )}

        {stage === "complete" && (
          <>
            <p role="status" className="mt-3 text-base leading-7">Your original attempt, criterion evidence, and revision are saved together. This records reviewed practice; it does not certify that the design is correct.</p>
            <NextRepair exercise={exercise} draft={draft} />
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {exerciseFeedback(exercise, draft).meets
                ? "Repeat this exact case from memory after 48 hours. It will appear in practice to revisit."
                : "Practice this exact case again in your next session. The first-attempt gaps keep it in practice to revisit; a fresh attempt tests what you can now retrieve."}
            </p>
            <YourAttempt exercise={exercise} draft={draft} />
            <h3 className="mt-6 font-medium">Your saved revision</h3>
            <p className="mt-3 whitespace-pre-wrap break-words text-base leading-7">{draft.revision}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button type="button" className={buttonClass} disabled={!hydrated} onClick={() => { retryGuidedExercise(exercise.id, exercise.version); focusStep(); }}>Practice this exact case again</button>
              <Link className={linkClass} href="/drills">Choose guided practice →</Link>
            </div>
            <section className="mt-8 border-t pt-5">
              <h3 className="font-medium">After the baseline: change one constraint</h3>
              <p className="mt-3 text-base leading-7">{exercise.transfer.prompt}</p>
              <details className="mt-3">
                <summary className="min-h-11 cursor-pointer text-sm text-primary">Compare the changed-constraint reasoning after your attempt</summary>
                <p className="mt-3 text-base leading-7">{exercise.transfer.reasoning}</p>
              </details>
              <Link className={linkClass + " mt-3"} href={exercise.next.href}>{exercise.next.label} →</Link>
            </section>
          </>
        )}
      </section>

      {(state?.attempts.length ?? 0) > 0 && (
        <details className="mt-10 border-y py-3">
          <summary className="min-h-11 cursor-pointer text-sm text-muted-foreground">Reviewed attempt history ({state!.attempts.length})</summary>
          <ol className="mt-4 space-y-5">
            {state!.attempts.map((attempt, index) => (
              <li key={index}>
                <p className="font-medium">Attempt {index + 1} · {attempt.completedAt.slice(0, 10)} · {attempt.needsPractice ? "revisit recorded gaps" : "48-hour recall"}</p>
                <YourAttempt exercise={exercise} draft={attempt} />
                <ul className="mt-3 space-y-2 text-sm leading-6">
                  {exercise.rubric.map((criterion) => <li key={criterion.id}><strong>{criterion.label} · {attempt.ratings[criterion.id]}: </strong>{attempt.evidence[criterion.id]}</li>)}
                </ul>
                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6"><strong>Revision: </strong>{attempt.revision}</p>
              </li>
            ))}
          </ol>
        </details>
      )}
    </div>
  );
}
