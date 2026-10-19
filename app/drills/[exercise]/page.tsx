import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { guidedExercises, getGuidedExercise } from "@/content/guided-exercises";
import { GuidedWorkspace } from "@/components/drills/guided-workspace";
import { SiteHeader } from "@/components/site-header";

export function generateStaticParams() {
  return guidedExercises.map((exercise) => ({ exercise: exercise.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ exercise: string }> }): Promise<Metadata> {
  const exercise = getGuidedExercise((await params).exercise);
  if (!exercise) return {};
  return {
    title: exercise.title + " | Guided practice | Learn",
    description: exercise.outcome,
    alternates: { canonical: "/drills/" + exercise.id },
  };
}

export default async function GuidedExercisePage({ params }: { params: Promise<{ exercise: string }> }) {
  const exercise = getGuidedExercise((await params).exercise);
  if (!exercise) notFound();
  return (
    <main id="main" className="min-h-svh">
      <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <SiteHeader trail={[{ label: "drills", href: "/drills" }, { label: "guided practice" }]} />
        <div className="mx-auto max-w-3xl py-10 sm:py-14">
          <p className="font-mono text-xs text-primary">{exercise.track} / guided practice · ~{exercise.minutes} min</p>
          <h1 className="mt-5 text-3xl font-medium tracking-tight sm:text-4xl">{exercise.title}</h1>
          <p className="mt-4 text-base leading-7">{exercise.outcome}</p>
          <GuidedWorkspace exercise={exercise} />
          <Link href="/drills" className="mt-10 inline-flex min-h-11 items-center text-sm text-muted-foreground underline underline-offset-4 hover:text-primary">← all practice</Link>
        </div>
      </div>
    </main>
  );
}
