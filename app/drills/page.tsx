import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { DrillDeck } from "@/components/drills/deck";

export const metadata: Metadata = {
  title: "Drill deck | Learn",
  description:
    "20 interview scenarios with randomizable constraint cards, reproducible seeds, and a 48-hour redo queue.",
  alternates: { canonical: "/drills" },
};

export default function DrillsPage() {
  return (
    <main id="main" className="min-h-svh bg-background text-foreground">
      <div className="mx-auto min-h-svh max-w-6xl px-4 sm:px-6">
        <SiteHeader trail={[{ label: "drills" }]} />

        <div className="mx-auto max-w-3xl py-10 sm:py-14">
          <p className="font-mono text-xs text-primary">practice / drills</p>
          <h1 className="mt-5 text-3xl font-medium tracking-[-0.035em] sm:text-4xl">
            drill deck
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            Twenty scenarios across system design and AI-native design. Each
            draw adds seven constraint cards — scale, traffic, SLO, failure,
            security, residency, cost. Seeds replay exact draws. Ready for
            the clock?{" "}
            <Link
              href="/mock"
              className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
            >
              Run the 50-minute mock →
            </Link>
          </p>
          <div className="mt-8">
            <DrillDeck />
          </div>
        </div>
      </div>
    </main>
  );
}
