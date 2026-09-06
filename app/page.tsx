const stack = ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui"];

export default function Home() {
  return (
    <main className="min-h-svh bg-background px-6 py-8 text-foreground sm:px-10 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl flex-col sm:min-h-[calc(100svh-5rem)]">
        <header className="flex items-center justify-between border-b pb-5">
          <p className="text-sm font-semibold tracking-tight">learn.smmeyer.dev</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className="size-1.5 rounded-full bg-emerald-500"
              aria-hidden="true"
            />
            Scaffold ready
          </div>
        </header>

        <section className="flex flex-1 flex-col justify-center py-20">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Learning, built in public
          </p>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.045em] text-balance sm:text-7xl lg:text-8xl">
            A home for practical technology courses.
          </h1>
          <p className="mt-8 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            The foundation is in place. Course browsing, lessons, and local
            progress tracking come next.
          </p>
        </section>

        <footer className="flex flex-col gap-4 border-t pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Frontend-only by design.</p>
          <ul
            className="flex flex-wrap gap-x-4 gap-y-2"
            aria-label="Technology stack"
          >
            {stack.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        </footer>
      </div>
    </main>
  );
}
