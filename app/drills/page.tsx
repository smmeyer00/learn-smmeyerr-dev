import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { DrillDeck } from "@/components/drills/deck";
import { GuidedExerciseIndex } from "@/components/drills/guided-index";
import { guidedExerciseSummaries } from "@/content/guided-exercises";

export const metadata: Metadata = {
  title: "Guided practice | Learn",
  description:
    "Two guided exercises with clear briefs, worksheets, worked reference answers, evidence-based self-review, and targeted revision.",
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
            guided practice
          </h1>
          <p className="mt-4 text-base leading-7">
            Apply one course concept at a time. Choose your track, make an
            attempt, compare the worked answer, and revise the weakest part.
            Start with either exercise after its preparation chapters.
            Use it for part of that chapter&apos;s practice budget.
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Each case supplies its facts and expected artifact. Calculation
            checks are automatic; explicit rubrics help you assess the
            reasoning. Your first attempt and revision stay together in local
            progress, so you can resume or repeat the same case later.
          </p>
          <div className="mt-8">
            <GuidedExerciseIndex exercises={guidedExerciseSummaries} />
          </div>
          <details id="independent-practice" className="mt-12 border-y py-4">
            <summary className="min-h-11 cursor-pointer text-sm text-muted-foreground">
              Independent interview practice · scenario deck, redo queue, and oral fluency
            </summary>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              After guided practice, use the original random deck for open-ended
              design rehearsal. These prompts require independent self-review.
              For a timed full design, use the{" "}
              <Link href="/mock" className="text-primary underline underline-offset-4">50-minute mock workspace →</Link>
            </p>
            <div className="mt-6"><DrillDeck /></div>
          </details>
        </div>
      </div>
    </main>
  );
}
