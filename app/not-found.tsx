import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <main id="main" className="min-h-svh">
      <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <SiteHeader />
        <div className="max-w-xl py-20 sm:py-28">
          <p className="font-mono text-xs text-primary">404 / page not found</p>
          <h1 className="mt-5 text-4xl font-medium tracking-tight">
            Find your next lesson.
          </h1>
          <p className="mt-5 text-base leading-7 text-muted-foreground">
            This address does not match a course page. Browse the roadmaps or
            use search to find a chapter, concept, or drill.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center text-primary underline underline-offset-4"
            >
              Browse courses →
            </Link>
            <Link
              href="/about"
              className="inline-flex min-h-11 items-center text-muted-foreground underline underline-offset-4"
            >
              About the courses
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
