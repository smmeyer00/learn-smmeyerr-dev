import { courses } from "@/content";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { guidedExerciseSummaries } from "@/content/guided-exercises";
import {
  ContinueBanner,
  type ChapterTitleEntry,
} from "@/components/progress/continue-banner";
import { CourseSummary } from "@/components/progress/course-summary";
import { BookmarksList } from "@/components/progress/bookmarks-list";
import { DataControls } from "@/components/progress/data-controls";
import { PracticeQueue } from "@/components/progress/practice-queue";

const chapterTitles: ChapterTitleEntry[] = courses.flatMap((course) =>
  course.chapters.map((chapter) => ({
    key: `${course.slug}/${chapter.slug}`,
    courseSlug: course.slug,
    courseTitle: course.title,
    chapterTitle: chapter.title,
  })),
);

const entries = courses.map((course) => ({
  id: course.id,
  slug: course.slug,
  title: course.title,
  description: course.description,
  hours: course.chapters.reduce((sum, chapter) => sum + chapter.hours, 0),
  total: course.chapters.length,
}));

export default function Home() {
  return (
    <main id="main" className="min-h-svh bg-background text-foreground">
      <div className="mx-auto min-h-svh max-w-6xl px-4 pb-24 sm:px-6">
        <SiteHeader />

        <div className="grid gap-12 py-10 sm:py-14 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-20">
          <div className="lg:self-start">
            <aside className="home-index-sidebar">
              <p className="font-mono text-xs text-primary">index / 001</p>
              <h1 className="mt-5 text-4xl font-medium tracking-[-0.045em]">
                courses
              </h1>
              <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
                Free study paths for working software engineers. Learn a
                mechanism, work an example, and defend a design.
              </p>

              <dl className="mt-9 hidden border-t font-mono text-xs leading-5 lg:block">
                <div className="grid grid-cols-2 border-b py-2.5">
                  <dt className="text-muted-foreground">format</dt>
                  <dd>self-paced</dd>
                </div>
                <div className="grid grid-cols-2 border-b py-2.5">
                  <dt className="text-muted-foreground">progress</dt>
                  <dd>local only</dd>
                </div>
                <div className="grid grid-cols-2 border-b py-2.5">
                  <dt className="text-muted-foreground">account</dt>
                  <dd>none</dd>
                </div>
              </dl>
            </aside>
          </div>

          <section aria-labelledby="course-index">
            <ContinueBanner chapters={chapterTitles} />
            <PracticeQueue chapters={chapterTitles} guidedExercises={guidedExerciseSummaries} />
            <section aria-labelledby="start-here" className="mb-10">
              <h2
                id="start-here"
                className="font-mono text-xs uppercase tracking-wider text-primary"
              >
                start here
              </h2>
              <p className="mt-3 text-base leading-7">
                Choose systems for architecture and reliability, or LLM
                engineering for model behavior and AI applications. Both assume
                you can read application code, design an API, and work with data
                stores. No ML background is required.
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Each chapter includes a worked example, an assignment, and a
                self-review rubric. Time estimates include independent practice.
                Work in one track, or alternate them using the suggested study
                sequence.
              </p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                <Link
                  href="/system-design/01-system-design-foundations"
                  className="inline-flex min-h-11 items-center text-primary underline underline-offset-4"
                >
                  Start systems foundations →
                </Link>
                <Link
                  href="/llm-engineering/01-mental-model-of-modern-llms"
                  className="inline-flex min-h-11 items-center text-primary underline underline-offset-4"
                >
                  Start LLM foundations →
                </Link>
                <Link
                  href="/about"
                  className="inline-flex min-h-11 items-center text-muted-foreground underline underline-offset-4 hover:text-primary"
                >
                  About the courses + suggested sequence
                </Link>
              </div>
            </section>
            <div className="flex items-baseline justify-between border-b pb-3 font-mono text-xs">
              <h2 id="course-index">course index</h2>
              <p className="text-muted-foreground">
                {String(entries.length).padStart(2, "0")} entries
              </p>
            </div>

            <ol>
              {entries.map((course) => (
                <li
                  key={course.id}
                  className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-4 border-b py-7 sm:grid-cols-[2rem_minmax(0,1fr)_6.5rem] sm:gap-x-6 sm:py-8"
                >
                  <p className="font-mono text-xs tabular-nums text-muted-foreground">
                    {course.id}
                  </p>

                  <article>
                    <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6875rem]">
                      <p className="text-muted-foreground">/{course.slug}</p>
                    </div>
                    <h3 className="text-xl font-medium tracking-[-0.025em] sm:text-2xl">
                      <a
                        href={`/${course.slug}`}
                        className="decoration-border underline-offset-4 transition-colors hover:text-primary hover:underline"
                      >
                        {course.title}
                      </a>
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                      {course.description}
                    </p>
                  </article>

                  <div className="col-start-2 mt-5 flex items-center justify-between font-mono text-[0.6875rem] sm:col-start-auto sm:mt-0 sm:flex-col sm:items-end">
                    <p className="text-primary">[free]</p>
                    <p className="text-muted-foreground">
                      {course.total} chapters
                    </p>
                    <p className="text-muted-foreground">
                      ~{course.hours}h practice
                    </p>
                    <CourseSummary
                      courseSlug={course.slug}
                      total={course.total}
                    />
                  </div>
                </li>
              ))}
            </ol>

            <footer className="flex flex-col gap-1.5 pt-5 font-mono text-[0.6875rem] text-muted-foreground sm:flex-row sm:justify-between">
              <p>progress: local-only · no account</p>
              <p>network sync: none</p>
            </footer>

            <DataControls />
            <BookmarksList chapters={chapterTitles} />
          </section>
        </div>
      </div>
    </main>
  );
}
