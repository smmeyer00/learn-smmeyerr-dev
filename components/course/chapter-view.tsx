import Link from "next/link";
import type { ReactNode } from "react";
import { getChapterReferences, type Chapter, type Course } from "@/content";
import { BookmarkButton } from "@/components/progress/bookmark-button";
import { ChapterNotes } from "@/components/progress/chapter-notes";
import { RecallPractice } from "@/components/progress/recall-practice";
import { SiteHeader } from "@/components/site-header";
import { LabHost } from "@/components/labs/host";
import { labsForChapter } from "@/components/labs/registry";
import { MarkComplete } from "@/components/progress/mark-complete";
import { Quiz } from "@/components/progress/quiz";
import { TrackVisit } from "@/components/progress/track-visit";
import { AssignmentReference, CumulativePractice } from "./chapter-practice";
import { guidedExerciseSummaries } from "@/content/guided-exercises";

const labelClass = "font-mono text-xs uppercase tracking-[0.12em] text-primary";
const proseClass = "mt-3 text-base leading-7 text-foreground/90";

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-12 scroll-mt-6">
      <h2 className={labelClass}>{title}</h2>
      {children}
    </section>
  );
}

function FlowDiagram({ chapter }: { chapter: Chapter }) {
  return (
    <figure className="mt-4">
      <ol className="grid gap-2 sm:grid-cols-2">
        {chapter.mentalModel.flow.map((step, index) => (
          <li
            key={step.label}
            className="border-l-2 border-primary/40 bg-secondary/40 px-3 py-3"
          >
            <p className="font-mono text-sm text-foreground">
              <span className="mr-2 text-primary">{index + 1} →</span>
              {step.label}
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {step.detail}
            </p>
          </li>
        ))}
      </ol>
      <figcaption className="mt-3 text-xs leading-5 text-muted-foreground">
        Read in numbered order:{" "}
        {chapter.mentalModel.flow
          .map((step) => step.label.toLowerCase())
          .join(" → ")}
        .
      </figcaption>
    </figure>
  );
}

export function ChapterView({
  course,
  chapter,
}: {
  course: Course;
  chapter: Chapter;
}) {
  const index = course.chapters.findIndex((item) => item.slug === chapter.slug);
  const prev = course.chapters[index - 1];
  const next = course.chapters[index + 1];
  const labs = labsForChapter(course.slug, chapter.slug);
  const guide = chapter.studyGuide;
  const references = getChapterReferences(chapter);
  const contents = [
    ["chapter-start", "outcome + study plan"],
    ["mental-model", "mental model"],
    ["lessons", "lessons"],
    ["worked-example", "worked example"],
    ...(labs.length ? [["labs", "interactive lab"]] : []),
    ["assignment", "assignment + rubric"],
    ["cumulative-practice", "cumulative project"],
    ["knowledge-checks", "knowledge checks"],
    ["retrieval", "closed-book recall"],
    ["interview-drill", "interview drill"],
    ["references", "references"],
    ["notes", "notes + next chapter"],
  ];
  const sectionLinks = (
    <ol className="mt-3 space-y-1">
      {contents.map(([id, label]) => (
        <li key={id}>
          <a
            href={"#" + id}
            className="inline-flex min-h-9 items-center py-1 text-sm text-muted-foreground hover:text-primary"
          >
            {label}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <main id="main" className="min-h-svh bg-background text-foreground">
      <TrackVisit courseSlug={course.slug} chapterSlug={chapter.slug} />
      <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <SiteHeader
          trail={[
            { label: course.slug, href: "/" + course.slug },
            { label: String(chapter.order).padStart(2, "0") },
          ]}
        />
        <div className="py-10 sm:py-14 lg:grid lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-12">
          <aside className="mb-8 lg:mb-0 lg:self-start">
            <nav
              aria-label="chapter sections"
              className="hidden lg:block"
            >
              <p className={labelClass}>on this page</p>
              {sectionLinks}
              <Link
                href={"/" + course.slug}
                className="mt-5 inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4"
              >
                ← course roadmap
              </Link>
            </nav>
            <details className="border-b pb-4 lg:hidden">
              <summary className="min-h-11 cursor-pointer font-mono text-xs text-primary">
                on this page
              </summary>
              <nav aria-label="chapter sections">{sectionLinks}</nav>
            </details>
          </aside>
          <div className="min-w-0 max-w-3xl">
            <div id="chapter-start" className="scroll-mt-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b pb-3 font-mono text-xs">
                <p className="text-primary">
                  {course.slug}/{String(chapter.order).padStart(2, "0")}
                </p>
                <p className="text-muted-foreground">
                  {chapter.phase.toLowerCase()} · {chapter.depth} · ~
                  {chapter.hours}h practice
                </p>
              </div>
              <h1 className="mt-8 text-3xl font-medium tracking-[-0.035em] sm:text-4xl">
                {chapter.title}
              </h1>
              <div className="mt-8 border-l-2 border-primary/60 pl-4">
                <h2 className={labelClass}>outcome</h2>
                <p className={proseClass}>{chapter.outcome}</p>
              </div>
              <details className="mt-6 border-y py-3">
                <summary className="min-h-11 cursor-pointer text-sm font-medium">
                  Plan a practice session · ~{chapter.hours}h including
                  exercises
                </summary>
                <dl className="mt-3 grid gap-2 text-sm">
                  {[
                    "Read + trace the worked example",
                    "Assignment + constraint variations",
                    "Timed drill + repeated explanations",
                    "Closed-book recall + self-review",
                  ].map((label, i) => (
                    <div key={label} className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="shrink-0 font-mono">
                        {guide.minutes[i]} min
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  This is a suggested practice budget, including drawing,
                  variations, and repeated drills. Reading is the first block.
                  Split the work across sessions and use the rubric to judge
                  when to move on.
                </p>
              </details>
            </div>
            <Section id="why" title="why this matters">
              <p className={proseClass}>{chapter.why}</p>
            </Section>
            <Section id="coverage" title="coverage">
              <ul className="mt-3 divide-y border-y">
                {chapter.coverage.map((item) => (
                  <li
                    key={item}
                    className="py-3 text-sm leading-6 text-muted-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Section>
            <Section id="mental-model" title="mental model">
              <p className={proseClass}>{chapter.mentalModel.statement}</p>
              <FlowDiagram chapter={chapter} />
            </Section>
            <Section id="lessons" title="lessons">
              <div className="mt-4 space-y-9">
                {chapter.lessons.map((lesson, i) => (
                  <article key={lesson.title}>
                    <h3 className="text-lg font-medium tracking-tight">
                      <span className="mr-3 font-mono text-xs text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {lesson.title}
                    </h3>
                    {lesson.paragraphs.map((paragraph) => (
                      <p key={paragraph} className={proseClass}>
                        {paragraph}
                      </p>
                    ))}
                    {lesson.bullets && (
                      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
                        {lesson.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            </Section>
            <Section id="worked-example" title="worked example">
              <h3 className="mt-4 text-xl font-medium tracking-tight">
                {guide.example.title}
              </h3>
              <p className={proseClass}>{guide.example.scenario}</p>
              <ol className="mt-5 list-decimal space-y-4 pl-5 text-base leading-7 text-foreground/90">
                {guide.example.steps.map((step) => (
                  <li key={step} className="pl-1">
                    {step}
                  </li>
                ))}
              </ol>
              <p className="mt-5 border-l-2 border-primary/60 pl-4 text-base leading-7">
                <strong className="font-medium">Design decision: </strong>
                {guide.example.decision}
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                <strong className="font-medium">Limit: </strong>
                {guide.example.limitation}
              </p>
              <p className="mt-3 font-mono text-xs leading-5 text-muted-foreground">
                Teaching scenario · traffic, prices, and capacity values are
                illustrative.
              </p>
            </Section>
            {labs.length > 0 && (
              <Section id="labs" title="lab">
                {labs.map((lab) => (
                  <LabHost key={lab.id} labId={lab.id} />
                ))}
              </Section>
            )}
            <Section id="assignment" title="assignment">
              <p className={proseClass}>
                <strong className="font-medium">Produce: </strong>
                {guide.assignment.deliverable}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Paper, a text editor, or a spreadsheet is enough. Model access
                and paid services are optional.
              </p>
              <ol className="mt-4 list-decimal space-y-3 pl-5 text-base leading-7">
                {guide.assignment.tasks.map((task) => (
                  <li key={task} className="pl-1">
                    {task}
                  </li>
                ))}
              </ol>
              <h3 className="mt-6 text-base font-medium">
                Change a constraint
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
                {guide.assignment.variations.map((variation) => (
                  <li key={variation}>{variation}</li>
                ))}
              </ul>
              <h3 className="mt-6 text-base font-medium">Self-review rubric</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6">
                {guide.assignment.rubric.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                If a criterion is missing, revise that part of the artifact
                before rating your practice below.
              </p>
              <AssignmentReference chapter={chapter} />
              {guidedExerciseSummaries.filter((exercise) =>
                exercise.prerequisites.at(-1)?.href === "/" + course.slug + "/" + chapter.slug,
              ).map((exercise) => (
                <p key={exercise.id} className="mt-5 text-sm leading-6">
                  Put this chapter into practice:{" "}
                  <Link className="text-primary underline underline-offset-4" href={"/drills/" + exercise.id}>{exercise.title} · guided worksheet →</Link>
                </p>
              ))}
            </Section>
            <Section id="cumulative-practice" title="cumulative practice">
              <CumulativePractice course={course} chapter={chapter} />
            </Section>
            <Section id="senior-signal" title="senior signal">
              <p className="mt-3 border-l-2 border-primary/60 pl-4 text-base leading-7">
                {chapter.seniorSignal}
              </p>
            </Section>
            <Section id="failure-patterns" title="failure patterns">
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-7 text-muted-foreground">
                {chapter.pitfalls.map((pitfall) => (
                  <li key={pitfall}>{pitfall}</li>
                ))}
              </ul>
            </Section>
            <Section id="knowledge-checks" title="knowledge checks">
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Start with these quick checks, then explain the closed-book
                questions in your own words.
              </p>
              <Quiz
                courseSlug={course.slug}
                chapterSlug={chapter.slug}
                questions={chapter.quiz}
              />
            </Section>
            <Section id="retrieval" title="closed-book recall">
              <RecallPractice
                courseSlug={course.slug}
                chapterSlug={chapter.slug}
                questions={guide.recall}
              />
            </Section>
            <Section id="interview-drill" title="interview drill">
              <p className={proseClass}>{chapter.drill.prompt}</p>
              <ul
                aria-label="drill constraints"
                className="mt-4 flex flex-wrap gap-2"
              >
                {chapter.drill.constraints.map((constraint) => (
                  <li
                    key={constraint}
                    className="rounded border px-2 py-1 font-mono text-xs text-muted-foreground"
                  >
                    {constraint}
                  </li>
                ))}
              </ul>
              <details className="mt-5 border-y py-3">
                <summary className="min-h-11 cursor-pointer font-mono text-xs text-primary">
                  compare a strong approach after your attempt
                </summary>
                <p className={proseClass}>{chapter.drill.approach}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Compare decisions and failure behavior, then repeat with a
                  changed constraint. Keep your own wording.
                </p>
              </details>
              <Link
                href="/mock"
                className="mt-3 inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4"
              >
                Use the timed mock workspace →
              </Link>
            </Section>
            <Section id="references" title="references">
              <ul className="mt-3 space-y-2 text-sm leading-6">
                {references.map((ref) => (
                  <li key={ref.href}>
                    <a
                      href={ref.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-border underline-offset-4 hover:text-primary"
                    >
                      {ref.label} ↗
                    </a>
                    {ref.lastReviewed && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        reviewed {ref.lastReviewed}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                Sources offer deeper context. Provider capabilities and API
                contracts can change; check current official docs before
                implementing.
              </p>
            </Section>
            <Section id="notes" title="notes">
              <ChapterNotes
                courseSlug={course.slug}
                chapterSlug={chapter.slug}
              />
            </Section>
            <nav
              aria-label="chapter navigation"
              className="mt-12 border-t pt-5"
            >
              <p className="mb-3 text-sm leading-6 text-muted-foreground">
                Mark complete when you can explain the mechanism and meet the
                rubric. Logged practice returns to the roadmap for review.
              </p>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-5">
                  <MarkComplete
                    courseSlug={course.slug}
                    chapterSlug={chapter.slug}
                  />
                  <BookmarkButton
                    courseSlug={course.slug}
                    chapterSlug={chapter.slug}
                  />
                </div>
                <a
                  href="#chapter-start"
                  className="inline-flex min-h-11 items-center font-mono text-xs text-muted-foreground underline underline-offset-4"
                >
                  back to top ↑
                </a>
              </div>
              <ul className="mt-4 flex flex-col gap-3 text-sm sm:flex-row sm:justify-between">
                <li>
                  <Link
                    href={
                      prev
                        ? "/" + course.slug + "/" + prev.slug
                        : "/" + course.slug
                    }
                    className="inline-flex min-h-11 items-center text-muted-foreground underline decoration-border underline-offset-4 hover:text-primary"
                  >
                    ← {prev ? prev.title : "course roadmap"}
                  </Link>
                </li>
                <li>
                  <Link
                    href={
                      next ? "/" + course.slug + "/" + next.slug : "/drills"
                    }
                    className="inline-flex min-h-11 items-center text-primary underline decoration-border underline-offset-4"
                  >
                    {next ? next.title : "Continue with interview practice"} →
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </main>
  );
}
