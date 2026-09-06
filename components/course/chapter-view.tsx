import Link from "next/link";
import type { Chapter, Course } from "@/content";
import { MarkComplete } from "@/components/progress/mark-complete";
import { TrackVisit } from "@/components/progress/track-visit";

function SectionLabel({ children }: { children: string }) {
  return (
    <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-primary">
      {children}
    </h2>
  );
}

function FlowDiagram({ chapter }: { chapter: Chapter }) {
  return (
    <div className="mt-4">
      <ol className="flex flex-wrap items-stretch gap-x-2 gap-y-2">
        {chapter.mentalModel.flow.map((step, i) => (
          <li key={step.label} className="flex items-stretch gap-2">
            <div className="rounded-md border border-border bg-secondary/60 px-3 py-2">
              <p className="font-mono text-xs font-medium text-foreground">
                {step.label}
              </p>
              <p className="mt-0.5 font-mono text-[0.6875rem] leading-4 text-muted-foreground">
                {step.detail}
              </p>
            </div>
            {i < chapter.mentalModel.flow.length - 1 && (
              <span
                aria-hidden="true"
                className="self-center font-mono text-xs text-primary"
              >
                →
              </span>
            )}
          </li>
        ))}
      </ol>
      <p className="mt-3 font-mono text-[0.6875rem] text-muted-foreground">
        base flow: {chapter.mentalModel.flow.map((s) => s.label.toLowerCase()).join(" → ")}
      </p>
    </div>
  );
}

export function ChapterView({
  course,
  chapter,
}: {
  course: Course;
  chapter: Chapter;
}) {
  const index = course.chapters.findIndex((c) => c.slug === chapter.slug);
  const prev = index > 0 ? course.chapters[index - 1] : undefined;
  const next = index < course.chapters.length - 1 ? course.chapters[index + 1] : undefined;

  return (
    <main className="min-h-svh bg-background text-foreground">
      <TrackVisit courseSlug={course.slug} chapterSlug={chapter.slug} />
      <div className="mx-auto min-h-svh max-w-6xl px-4 sm:px-6">
        <header className="flex h-14 items-center justify-between border-b font-mono text-xs">
          <p className="font-medium text-foreground">
            <Link href="/" className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground">
              learn.smmeyer.dev
            </Link>
            <span className="text-primary">/</span>
            <Link
              href={`/${course.slug}`}
              className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
            >
              {course.slug}
            </Link>
            <span className="text-primary">/</span>
            <span className="text-muted-foreground">
              {String(chapter.order).padStart(2, "0")}
            </span>
          </p>
          <a
            href="https://smmeyer.dev"
            className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
          >
            smmeyer.dev ↗
          </a>
        </header>

        <div className="mx-auto max-w-3xl py-10 sm:py-14">
          {/* Chapter heading */}
          <div className="flex items-baseline justify-between border-b pb-3 font-mono text-xs">
            <p className="text-primary">
              {course.slug}/{String(chapter.order).padStart(2, "0")}
            </p>
            <p className="text-muted-foreground">
              {chapter.phase.toLowerCase()} <span className="text-border" aria-hidden="true">{"//"}</span>{" "}
              {chapter.depth} <span className="text-border" aria-hidden="true">{"//"}</span> {chapter.hours}h
            </p>
          </div>

          <h1 className="mt-8 text-3xl font-medium tracking-[-0.035em] sm:text-4xl">
            {chapter.title}
          </h1>

          {/* Outcome */}
          <div className="mt-8 border-l-2 border-primary/60 pl-4">
            <SectionLabel>outcome</SectionLabel>
            <p className="mt-2 text-[0.9375rem] leading-7 text-foreground">
              {chapter.outcome}
            </p>
          </div>

          {/* Why this matters */}
          <section className="mt-12">
            <SectionLabel>why this matters</SectionLabel>
            <p className="mt-3 text-[0.9375rem] leading-7 text-muted-foreground">
              {chapter.why}
            </p>
          </section>

          {/* Coverage map */}
          <section className="mt-12">
            <SectionLabel>coverage</SectionLabel>
            <dl className="mt-3 border-t font-mono text-xs leading-6">
              {chapter.coverage.map((item, i) => (
                <div
                  key={i}
                  className="grid gap-x-6 border-b py-2.5 sm:grid-cols-[5.5rem_minmax(0,1fr)]"
                >
                  <dt className="text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </dt>
                  <dd className="text-foreground/90">{item}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Mental model */}
          <section className="mt-12">
            <SectionLabel>mental model</SectionLabel>
            <p className="mt-3 text-[0.9375rem] leading-7 text-foreground">
              {chapter.mentalModel.statement}
            </p>
            <FlowDiagram chapter={chapter} />
          </section>

          {/* Lessons */}
          <section className="mt-12">
            <SectionLabel>lessons</SectionLabel>
            <div className="mt-4 space-y-10">
              {chapter.lessons.map((lesson, i) => (
                <article key={lesson.title}>
                  <h3 className="text-lg font-medium tracking-[-0.02em]">
                    <span className="mr-3 font-mono text-xs text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {lesson.title}
                  </h3>
                  {lesson.paragraphs.map((p, j) => (
                    <p
                      key={j}
                      className="mt-3 text-[0.9375rem] leading-7 text-foreground/90"
                    >
                      {p}
                    </p>
                  ))}
                  {lesson.bullets && (
                    <ul className="mt-4 space-y-2 border-l border-border pl-4">
                      {lesson.bullets.map((b, j) => (
                        <li
                          key={j}
                          className="font-mono text-xs leading-6 text-muted-foreground"
                        >
                          <span className="mr-2 text-primary">·</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>

          {/* Senior signal */}
          <section className="mt-12">
            <div className="rounded-md border border-primary/30 bg-primary/5 p-5">
              <SectionLabel>senior signal</SectionLabel>
              <p className="mt-3 text-[0.9375rem] leading-7 text-foreground">
                {chapter.seniorSignal}
              </p>
            </div>
          </section>

          {/* Failure patterns */}
          <section className="mt-12">
            <SectionLabel>failure patterns</SectionLabel>
            <ul className="mt-3 space-y-2.5">
              {chapter.pitfalls.map((pitfall, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-[0.9375rem] leading-7 text-muted-foreground"
                >
                  <span aria-hidden="true" className="font-mono text-xs leading-7 text-destructive">
                    ✗
                  </span>
                  {pitfall}
                </li>
              ))}
            </ul>
          </section>

          {/* Drill */}
          <section className="mt-12">
            <SectionLabel>interview drill</SectionLabel>
            <div className="mt-3 rounded-md border border-border p-5">
              <p className="text-[0.9375rem] leading-7 text-foreground">
                {chapter.drill.prompt}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {chapter.drill.constraints.map((c) => (
                  <span
                    key={c}
                    className="rounded border border-border bg-secondary px-2 py-0.5 font-mono text-[0.6875rem] text-muted-foreground"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <details className="group mt-5 border-t pt-4">
                <summary className="cursor-pointer select-none font-mono text-xs text-primary transition-colors hover:text-foreground">
                  [ strong approach ]
                </summary>
                <p className="mt-3 text-[0.9375rem] leading-7 text-muted-foreground">
                  {chapter.drill.approach}
                </p>
              </details>
            </div>
          </section>

          {/* Knowledge checks */}
          <section className="mt-12">
            <SectionLabel>knowledge checks</SectionLabel>
            <ol className="mt-3 space-y-6">
              {chapter.quiz.map((q, qi) => (
                <li key={qi} className="border-b pb-6">
                  <p className="text-[0.9375rem] font-medium leading-7 text-foreground">
                    <span className="mr-3 font-mono text-xs text-muted-foreground">
                      {String(qi + 1).padStart(2, "0")}
                    </span>
                    {q.question}
                  </p>
                  <ul className="mt-3 grid gap-1.5 font-mono text-xs leading-6 text-muted-foreground">
                    {q.options.map((option, oi) => (
                      <li key={oi} className="flex gap-2.5">
                        <span className="text-border">
                          {String.fromCharCode(65 + oi)}.
                        </span>
                        {option}
                      </li>
                    ))}
                  </ul>
                  <details className="mt-3">
                    <summary className="cursor-pointer select-none font-mono text-[0.6875rem] text-muted-foreground transition-colors hover:text-foreground">
                      [ answer + explanation ]
                    </summary>
                    <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
                      <span className="font-mono text-xs text-primary">
                        {String.fromCharCode(65 + q.answer)} —
                      </span>{" "}
                      <span className="font-mono text-xs text-foreground">
                        {q.options[q.answer]}
                      </span>{" "}
                      · {q.explanation}
                    </p>
                  </details>
                </li>
              ))}
            </ol>
          </section>

          {/* Planned labs */}
          <section className="mt-12">
            <SectionLabel>labs (planned)</SectionLabel>
            <ul className="mt-3 space-y-2 font-mono text-xs leading-6 text-muted-foreground">
              {chapter.labs.map((lab, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="text-border" aria-hidden="true">
                    □
                  </span>
                  {lab}
                </li>
              ))}
            </ul>
          </section>

          {/* References */}
          {chapter.references && (
            <section className="mt-12">
              <SectionLabel>references</SectionLabel>
              <ul className="mt-3 space-y-2 font-mono text-xs leading-6">
                {chapter.references.map((ref) => (
                  <li key={ref.href}>
                    <a
                      href={ref.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
                    >
                      {ref.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-2 font-mono text-[0.6875rem] text-muted-foreground">
                provider-specific facts are update-sensitive — verify against
                current official docs
              </p>
            </section>
          )}

          {/* Prev / next */}
          <nav className="mt-16 border-t pt-5">
            <div className="flex items-center justify-between font-mono text-xs">
              <MarkComplete courseSlug={course.slug} chapterSlug={chapter.slug} />
              <p className="text-muted-foreground">
                {String(chapter.order).padStart(2, "0")}/{String(course.chapters.length).padStart(2, "0")}
              </p>
            </div>
            <ul className="mt-4 flex flex-col gap-3 font-mono text-xs sm:flex-row sm:justify-between">
              <li>
                {prev ? (
                  <Link
                    href={`/${course.slug}/${prev.slug}`}
                    className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
                  >
                    ← {String(prev.order).padStart(2, "0")} {prev.title.toLowerCase()}
                  </Link>
                ) : (
                  <Link
                    href={`/${course.slug}`}
                    className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
                  >
                    ← chapter index
                  </Link>
                )}
              </li>
              <li>
                {next ? (
                  <Link
                    href={`/${course.slug}/${next.slug}`}
                    className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
                  >
                    {String(next.order).padStart(2, "0")} {next.title.toLowerCase()} →
                  </Link>
                ) : (
                  <Link
                    href="/"
                    className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
                  >
                    course index →
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </main>
  );
}
