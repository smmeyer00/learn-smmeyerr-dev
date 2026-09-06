import type { Metadata } from "next";
import Link from "next/link";
import { MockWorkspace } from "@/components/drills/mock-workspace";

export const metadata: Metadata = {
  title: "50-minute mock | Learn",
  description:
    "Timed interview workspace with a guided phase flow and a five-axis self-scorecard.",
  alternates: { canonical: "/mock" },
};

export default function MockPage() {
  return (
    <main id="main" className="min-h-svh bg-background text-foreground">
      <div className="mx-auto min-h-svh max-w-6xl px-4 sm:px-6">
        <header className="flex h-14 items-center justify-between border-b font-mono text-xs">
          <p className="font-medium text-foreground">
            <Link
              href="/"
              className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
            >
              learn.smmeyer.dev
            </Link>
            <span className="text-primary">/</span>
            <Link
              href="/drills"
              className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
            >
              drills
            </Link>
            <span className="text-primary">/</span>
            <span className="text-muted-foreground">mock</span>
          </p>
          <a
            href="https://smmeyer.dev"
            className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
          >
            smmeyer.dev ↗
          </a>
        </header>

        <div className="mx-auto max-w-3xl py-10 sm:py-14">
          <p className="font-mono text-xs text-primary">practice / mock</p>
          <h1 className="mt-5 text-3xl font-medium tracking-[-0.035em] sm:text-4xl">
            50-minute mock
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            One scenario, six phases, one clock. Check boxes as you earn them,
            then score yourself honestly — 4 means staff-level, 2 means redo.
          </p>
          <div className="mt-8">
            <MockWorkspace />
          </div>
        </div>
      </div>
    </main>
  );
}
