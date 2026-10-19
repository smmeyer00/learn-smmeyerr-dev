import Link from "next/link";
import type { Chapter, Course } from "@/content";

export function AssignmentReference({ chapter }: { chapter: Chapter }) {
  const sample = chapter.studyGuide.sampleSolution;
  return (
    <details className="mt-6 border-y py-3">
      <summary className="min-h-11 cursor-pointer text-sm font-medium text-primary">
        Compare a sample artifact after your attempt
      </summary>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        One defensible answer under these assumptions. Compare the reasoning
        and checks with your work; other designs can satisfy the same contract.
      </p>
      <p className="mt-4 text-base leading-7">{sample.assumptions}</p>
      <pre className="mt-4 overflow-x-auto whitespace-pre-wrap break-words border-l-2 border-primary/40 bg-secondary/40 p-4 font-mono text-sm leading-6">
        {sample.artifact}
      </pre>
      <p className="mt-4 text-base leading-7">{sample.explanation}</p>
      <h4 className="mt-5 text-base font-medium">Check your artifact</h4>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6">
        {sample.checks.map((check) => <li key={check}>{check}</li>)}
      </ul>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        <strong className="font-medium">A tempting mistake: </strong>
        {sample.pitfall}
      </p>
    </details>
  );
}

export function CumulativePractice({ course, chapter }: { course: Course; chapter: Chapter }) {
  const practice = chapter.studyGuide.cumulativePractice;
  const earlier = course.chapters.filter((item) => practice.revisit.includes(item.order));
  return (
    <>
      <h3 className="mt-4 text-xl font-medium">{course.practiceProject.title}</h3>
      <details className="mt-4 border-y py-3">
        <summary className="min-h-11 cursor-pointer text-sm text-primary">Project brief</summary>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{course.practiceProject.brief}</p>
      </details>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        Keep one project document across this track. Reconstruct earlier reasoning
        before opening notes, then revise the same artifact. Use part of the
        assignment and review budget for this work. If you enter mid-course,
        sketch the earlier decisions first using the linked chapters.
      </p>
      <p className="mt-4 text-base leading-7"><strong className="font-medium">Add to your project: </strong>{practice.deliverable}</p>
      <p className="mt-3 text-base leading-7">{practice.prompt}</p>
      {earlier.length > 0 && (
        <nav aria-label="revisit earlier concepts" className="mt-4">
          <p className="text-sm font-medium">After recall, revisit if needed</p>
          <ul className="mt-2 space-y-2 text-sm">
            {earlier.map((item) => (
              <li key={item.slug}>
                <Link className="inline-flex min-h-9 items-center text-primary underline underline-offset-4" href={`/${course.slug}/${item.slug}#lessons`}>
                  {String(item.order).padStart(2, "0")} · {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <details className="mt-5 border-y py-3">
        <summary className="min-h-11 cursor-pointer text-sm font-medium text-primary">Compare cumulative reasoning after your attempt</summary>
        <p className="mt-3 text-base leading-7">{practice.sampleAnswer}</p>
      </details>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">Keep your first attempt and revision together. If your answer differs, identify the assumption or mechanism that explains the difference before rating your recall.</p>
    </>
  );
}
