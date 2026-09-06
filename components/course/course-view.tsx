import type { Course } from "@/content";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ChapterStatus } from "@/components/progress/chapter-status";

export function CourseView({ course }: { course: Course }) {
  const totalHours = course.chapters.reduce((sum, c) => sum + c.hours, 0);

  return (
    <main id="main" className="min-h-svh bg-background text-foreground">
      <div className="mx-auto min-h-svh max-w-6xl px-4 sm:px-6">
        <SiteHeader trail={[{ label: course.slug }]} />

        <div className="grid gap-12 py-10 sm:py-14 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-20">
          <aside className="lg:sticky lg:top-14 lg:self-start">
            <p className="font-mono text-xs text-primary">
              {course.id} / {course.slug}
            </p>
            <h1 className="mt-5 text-3xl font-medium tracking-[-0.04em] sm:text-4xl">
              {course.title}
            </h1>
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
              {course.description}
            </p>

            <dl className="mt-9 border-t font-mono text-[0.6875rem] leading-5">
              <div className="grid grid-cols-2 border-b py-2.5">
                <dt className="text-muted-foreground">chapters</dt>
                <dd>{String(course.chapters.length).padStart(2, "0")}</dd>
              </div>
              <div className="grid grid-cols-2 border-b py-2.5">
                <dt className="text-muted-foreground">est. time</dt>
                <dd>~{totalHours}h</dd>
              </div>
              <div className="grid grid-cols-2 border-b py-2.5">
                <dt className="text-muted-foreground">format</dt>
                <dd>self-paced</dd>
              </div>
              <div className="grid grid-cols-2 border-b py-2.5">
                <dt className="text-muted-foreground">prereq</dt>
                <dd>swe experience</dd>
              </div>
            </dl>
          </aside>

          <section aria-labelledby="chapter-index">
            <div className="flex items-baseline justify-between border-b pb-3 font-mono text-xs">
              <h2 id="chapter-index">chapter index</h2>
              <p className="text-muted-foreground">{course.scope}</p>
            </div>

            <ol>
              {course.chapters.map((chapter) => (
                <li
                  key={chapter.slug}
                  className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-4 border-b py-7 sm:grid-cols-[2rem_minmax(0,1fr)_6.5rem] sm:gap-x-6 sm:py-8"
                >
                  <p className="font-mono text-xs tabular-nums text-muted-foreground">
                    {String(chapter.order).padStart(2, "0")}
                  </p>

                  <article>
                    <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6875rem]">
                      <p className="text-muted-foreground">{chapter.phase.toLowerCase()}</p>
                      <span className="text-border" aria-hidden="true">
                        {"//"}
                      </span>
                      <p>{chapter.depth}</p>
                    </div>
                    <h3 className="text-xl font-medium tracking-[-0.025em] sm:text-2xl">
                      <a
                        href={`/${course.slug}/${chapter.slug}`}
                        className="decoration-border underline-offset-4 transition-colors hover:text-primary hover:underline"
                      >
                        {chapter.title}
                      </a>
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                      {chapter.outcome}
                    </p>
                  </article>

                  <div className="col-start-2 mt-5 flex items-center justify-between font-mono text-[0.6875rem] text-muted-foreground sm:col-start-auto sm:mt-0 sm:flex-col sm:items-end">
                    <p>
                      <ChapterStatus courseSlug={course.slug} chapterSlug={chapter.slug} />
                      {chapter.hours}h
                    </p>
                    <p>
                      {String(chapter.quiz.length).padStart(2, "0")} checks
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <footer className="flex flex-col gap-1.5 pt-5 font-mono text-[0.6875rem] text-muted-foreground sm:flex-row sm:justify-between">
              <p>phases: {course.phaseOrder.map((p) => p.toLowerCase()).join(" → ")}</p>
              <p>back: <Link href="/" className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground">course index</Link></p>
            </footer>
          </section>
        </div>
      </div>
    </main>
  );
}
