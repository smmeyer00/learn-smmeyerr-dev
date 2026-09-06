const courses = [
  {
    id: "01",
    area: "ai engineering",
    slug: "ai-assisted-development",
    title: "AI-assisted software development",
    description:
      "Model-assisted workflows without giving up judgment, tests, or understanding.",
    lessons: "08 lessons",
    status: "writing",
  },
  {
    id: "02",
    area: "engineering",
    slug: "practical-typescript",
    title: "Practical TypeScript",
    description:
      "Use the type system to make application code easier to change.",
    lessons: "06 lessons",
    status: "queued",
  },
  {
    id: "03",
    area: "frontend",
    slug: "interfaces-with-intent",
    title: "Interfaces with intent",
    description:
      "Build web interfaces that are clear, fast, and difficult to misuse.",
    lessons: "07 lessons",
    status: "queued",
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto min-h-svh max-w-6xl px-4 sm:px-6">
        <header className="flex h-14 items-center justify-between border-b font-mono text-xs">
          <p className="font-medium text-foreground">
            learn.smmeyer.dev<span className="text-primary">/</span>
          </p>
          <a
            href="https://smmeyer.dev"
            className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
          >
            smmeyer.dev ↗
          </a>
        </header>

        <div className="grid gap-12 py-10 sm:py-14 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-20">
          <aside className="lg:sticky lg:top-14 lg:self-start">
            <p className="font-mono text-xs text-primary">index / 001</p>
            <h1 className="mt-5 text-4xl font-medium tracking-[-0.045em]">
              courses
            </h1>
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
              Compact technical courses. Written as working notes, edited into
              a path.
            </p>

            <dl className="mt-9 border-t font-mono text-[0.6875rem] leading-5">
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

          <section aria-labelledby="course-index">
            <div className="flex items-baseline justify-between border-b pb-3 font-mono text-xs">
              <h2 id="course-index">course index</h2>
              <p className="text-muted-foreground">
                {String(courses.length).padStart(2, "0")} entries
              </p>
            </div>

            <ol>
              {courses.map((course) => (
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
                      <span className="text-border" aria-hidden="true">
                        {"//"}
                      </span>
                      <p>{course.area}</p>
                    </div>
                    <h3 className="text-xl font-medium tracking-[-0.025em] sm:text-2xl">
                      {course.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                      {course.description}
                    </p>
                  </article>

                  <div className="col-start-2 mt-5 flex items-center justify-between font-mono text-[0.6875rem] sm:col-start-auto sm:mt-0 sm:flex-col sm:items-end">
                    <p
                      className={
                        course.status === "writing"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }
                    >
                      [{course.status}]
                    </p>
                    <p className="text-muted-foreground">{course.lessons}</p>
                  </div>
                </li>
              ))}
            </ol>

            <footer className="flex flex-col gap-1.5 pt-5 font-mono text-[0.6875rem] text-muted-foreground sm:flex-row sm:justify-between">
              <p>planned: progress → localStorage</p>
              <p>network sync: none</p>
            </footer>
          </section>
        </div>
      </div>
    </main>
  );
}
