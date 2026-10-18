import { courses, type Course } from "@/content";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ChapterStatus } from "@/components/progress/chapter-status";
import { CourseSummary } from "@/components/progress/course-summary";
import { ContinueBanner } from "@/components/progress/continue-banner";
import { PracticeQueue } from "@/components/progress/practice-queue";

function phaseId(phase: string) {
  return phase.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function CourseView({ course }: { course: Course }) {
  const totalHours = course.chapters.reduce(
    (sum, chapter) => sum + chapter.hours,
    0,
  );
  const chapters = courses
    .flatMap((track) =>
      track.chapters.map((chapter) => ({
        key: track.slug + "/" + chapter.slug,
        courseSlug: track.slug,
        courseTitle: track.title,
        chapterTitle: chapter.title,
      })),
    )
    .filter((chapter) => chapter.courseSlug === course.slug);

  return (
    <main id="main" className="min-h-svh bg-background text-foreground">
      <div className="mx-auto min-h-svh max-w-6xl px-4 pb-24 sm:px-6">
        <SiteHeader trail={[{ label: course.slug }]} />
        <div className="grid gap-10 py-10 sm:py-14 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-6 lg:max-h-[calc(100svh-3rem)] lg:self-start lg:overflow-y-auto">
            <p className="font-mono text-xs text-primary">
              {course.id} / course roadmap
            </p>
            <h1 className="mt-5 text-3xl font-medium tracking-[-0.04em] sm:text-4xl">
              {course.title}
            </h1>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {course.description}
            </p>
            <Link
              href={"/" + course.slug + "/" + course.chapters[0].slug}
              className="mt-3 inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4"
            >
              Start this track →
            </Link>
            <dl className="mt-6 divide-y border-y text-sm">
              <div className="flex justify-between gap-3 py-3">
                <dt className="text-muted-foreground">chapters</dt>
                <dd>{course.chapters.length}</dd>
              </div>
              <div className="flex justify-between gap-3 py-3">
                <dt className="text-muted-foreground">practice budget</dt>
                <dd>~{totalHours}h</dd>
              </div>
              <div className="flex justify-between gap-3 py-3">
                <dt className="text-muted-foreground">completed</dt>
                <dd>
                  <CourseSummary
                    courseSlug={course.slug}
                    total={course.chapters.length}
                    showEmpty
                  />
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              For engineers comfortable with APIs, application code, and data
              stores.
              {course.slug === "llm-engineering"
                ? " No ML background is required."
                : ""}
            </p>
            <nav aria-label="course phases" className="mt-6">
              <p className="font-mono text-xs uppercase tracking-wider text-primary">
                jump to a phase
              </p>
              <ol className="mt-2 flex flex-wrap gap-x-4 lg:block">
                {course.phaseOrder.map((phase) => (
                  <li key={phase}>
                    <a
                      href={"#" + phaseId(phase)}
                      className="inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-primary"
                    >
                      {phase}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <Link
              href="/about-this-course"
              className="mt-4 inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4"
            >
              How to use the course →
            </Link>
          </aside>
          <section aria-labelledby="chapter-index" className="min-w-0">
            <ContinueBanner chapters={chapters} />
            <PracticeQueue chapters={chapters} includeDrills={false} />
            <div className="border-b pb-5">
              <h2 id="chapter-index" className="font-mono text-xs text-primary">
                chapter index
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Start in order, or use the rubrics to find a useful entry point.
                Time includes assignments, constraint variations, and repeated
                drills. Reading the notes is one part of that budget.
              </p>
              <details className="mt-3">
                <summary className="min-h-11 cursor-pointer text-sm text-muted-foreground">
                  What do the depth labels mean?
                </summary>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Core builds essential vocabulary. Deep traces mechanisms.
                  Studio applies them to a design. Patterns compares recurring
                  structures. Capstone combines the course. Current covers
                  update-sensitive platform contracts. Fluency practices concise
                  explanations.
                </p>
              </details>
            </div>
            {course.phaseOrder.map((phase, phaseIndex) => {
              const group = course.chapters.filter(
                (chapter) => chapter.phase === phase,
              );
              return (
                <section
                  key={phase}
                  id={phaseId(phase)}
                  aria-labelledby={phaseId(phase) + "-title"}
                  className="mt-10 scroll-mt-6"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b pb-3">
                    <h3
                      id={phaseId(phase) + "-title"}
                      className="text-lg font-medium"
                    >
                      <span className="mr-3 font-mono text-xs text-primary">
                        {String(phaseIndex + 1).padStart(2, "0")}
                      </span>
                      {phase}
                    </h3>
                    <p className="font-mono text-xs text-muted-foreground">
                      {group.length} chapters · ~
                      {group.reduce((sum, chapter) => sum + chapter.hours, 0)}h
                      practice
                    </p>
                  </div>
                  <ol start={group[0]?.order}>
                    {group.map((chapter) => (
                      <li
                        key={chapter.slug}
                        className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3 border-b py-6 sm:grid-cols-[2rem_minmax(0,1fr)_5rem] sm:gap-x-4"
                      >
                        <p className="font-mono text-xs text-muted-foreground">
                          {String(chapter.order).padStart(2, "0")}
                        </p>
                        <article>
                          <p className="mb-2 font-mono text-xs text-muted-foreground">
                            {chapter.depth}
                          </p>
                          <h4 className="text-xl font-medium tracking-tight">
                            <Link
                              href={"/" + course.slug + "/" + chapter.slug}
                              className="underline-offset-4 hover:text-primary hover:underline"
                            >
                              {chapter.title}
                            </Link>
                          </h4>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {chapter.outcome}
                          </p>
                        </article>
                        <div className="col-start-2 mt-3 flex items-center justify-between gap-3 font-mono text-xs text-muted-foreground sm:col-start-auto sm:mt-0 sm:flex-col sm:items-end sm:justify-start">
                          <p>
                            <ChapterStatus
                              courseSlug={course.slug}
                              chapterSlug={chapter.slug}
                            />
                            ~{chapter.hours}h
                          </p>
                          <p>
                            {chapter.quiz.length +
                              chapter.studyGuide.recall.length}{" "}
                            checks
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              );
            })}
            <footer className="mt-8 border-t pt-5 text-sm text-muted-foreground">
              <Link
                href="/"
                className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-primary"
              >
                ← all courses
              </Link>
            </footer>
          </section>
        </div>
      </div>
    </main>
  );
}
