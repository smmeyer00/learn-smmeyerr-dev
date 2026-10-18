import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "How to study | Learn",
  description:
    "Who these free courses are for, a suggested study sequence, practice budgets, and how local progress works.",
  alternates: { canonical: "/about-this-course" },
};

const sequence = [
  {
    title: "Build the machinery",
    text: "Systems chapters 1–4 with LLM chapters 1–3: requirements, storage, caches, generation, transformers, and training.",
    links: [
      ["/system-design#foundations", "Systems foundations"],
      ["/llm-engineering#foundations", "LLM foundations"],
    ],
  },
  {
    title: "Add distributed behavior",
    text: "Systems chapters 5–7 with LLM chapters 4–10: queues, consistency, reliability, serving, tools, agents, retrieval, and memory.",
    links: [
      ["/system-design#distributed-core", "Distributed systems"],
      ["/llm-engineering#serving", "Serving and applications"],
    ],
  },
  {
    title: "Practice production judgment",
    text: "Systems chapters 8–12 with LLM chapters 11–18: operations, security, global systems, evaluations, product architecture, and infrastructure.",
    links: [
      ["/system-design#production", "Production systems"],
      ["/llm-engineering#production-ai", "Production AI"],
    ],
  },
  {
    title: "Combine and explain",
    text: "Systems chapters 13–15 with LLM chapters 19–21: complete designs, tradeoff records, timed mocks, and concise explanations.",
    links: [
      ["/system-design#interview-mode", "Systems practice"],
      ["/llm-engineering#interview-mode", "AI design practice"],
    ],
  },
];

export default function AboutCoursePage() {
  return (
    <main id="main" className="min-h-svh">
      <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <SiteHeader trail={[{ label: "study guide" }]} />
        <div className="mx-auto max-w-3xl py-10 sm:py-14">
          <p className="font-mono text-xs text-primary">
            start here / study method
          </p>
          <h1 className="mt-5 text-3xl font-medium tracking-tight sm:text-4xl">
            Make each chapter a practice session.
          </h1>
          <p className="mt-5 text-base leading-7">
            These are free study paths by{" "}
            <a
              href="https://smmeyer.dev"
              className="text-primary underline underline-offset-4"
            >
              Steven Meyer
            </a>
            , built to support his own study of systems and LLM engineering.
            The aim is practical design judgment: explain a mechanism, quantify
            a workload, identify failure behavior, and defend a decision.
          </p>
          <section className="mt-10">
            <h2 className="text-xl font-medium">Who this is for</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              You should be comfortable reading application code, designing
              APIs, using data stores, and debugging software. You can come from
              frontend, backend, mobile, or infrastructure work. The LLM track
              introduces the needed model concepts without requiring ML research
              experience.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Choose one track for focused study. Alternate the tracks when you
              want classic systems ideas to reinforce the AI applications. Use
              chapter outcomes and rubrics to skip material you can already
              explain.
            </p>
          </section>
          <section className="mt-10">
            <h2 className="text-xl font-medium">Use the full learning loop</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-base leading-7">
              <li>
                Read the outcome, mental model, and lessons. Trace the worked
                example with its assumptions visible.
              </li>
              <li>
                Write a prediction before exploring a lab. Compare the result
                with your reasoning.
              </li>
              <li>
                Produce the assignment artifact, change a constraint, and check
                it against the rubric.
              </li>
              <li>
                Answer the recall questions without notes. Compare reasoning
                with the sample answer, then rate your practice.
              </li>
              <li>
                Run the interview drill aloud, review the approach afterward,
                and repeat the weakest part.
              </li>
            </ol>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Paper and a text editor are sufficient. You can use fictional
              model outputs and workloads for the exercises. Paid APIs, cloud
              accounts, and external deployments are optional.
            </p>
          </section>
          <section className="mt-10">
            <h2 className="text-xl font-medium">What the hours mean</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The systems track budgets about 56 hours and the LLM track about
              73 hours for a full practice pass. Each chapter shows a breakdown
              for reading, the assignment and variations, repeated drills, and
              recall. These are initial estimates for independent study. Split long
              assignments across sessions and move on when the rubric is
              satisfied.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Start with a pace you can repeat, such as two or three focused
              sessions a week. Logged practice rated 1–2 comes back for the next
              session; stronger practice returns after 48 hours. A missed
              knowledge check also prompts review. Completion is your judgment
              rather than an automatically graded credential.
            </p>
          </section>
          <section className="mt-10" aria-labelledby="sequence-title">
            <h2 id="sequence-title" className="text-xl font-medium">
              A suggested sequence across both tracks
            </h2>
            <ol className="mt-5 divide-y border-y">
              {sequence.map((phase, index) => (
                <li key={phase.title} className="py-5">
                  <h3 className="text-lg font-medium">
                    <span className="mr-3 font-mono text-xs text-primary">
                      0{index + 1}
                    </span>
                    {phase.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {phase.text}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-6">
                    {phase.links.map(([href, title]) => (
                      <Link
                        key={href}
                        href={href}
                        className="inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4"
                      >
                        {title} →
                      </Link>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          </section>
          <section className="mt-10">
            <h2 className="text-xl font-medium">
              Your progress stays in this browser
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              There is no account or network sync. Completion, quiz attempts,
              logged practice, bookmarks, and notes are stored locally. Export
              progress from the home page before changing browsers or devices,
              and import that file to continue. Clearing browser data can remove
              progress. Lab predictions and unsubmitted recall drafts last only
              for the current page.
            </p>
            <Link
              href="/#progress-data"
              className="mt-2 inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4"
            >
              Export or import progress →
            </Link>
          </section>
          <section className="mt-10">
            <h2 className="text-xl font-medium">Sources and updates</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Every chapter links selected primary documentation or papers.
              Review dates describe the linked resources; current model names,
              prices, API support, and limits still need verification when you
              implement a system. Worked examples use explicitly illustrative
              values.
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Practice material last updated October 2026. Course updates focus on
              clearer examples, corrected technical claims, and current official
              references. Retrieval practice and spaced study inform the study
              loop; see{" "}
              <a
                href="https://www.psychologicalscience.org/publications/journals/pspi/learning-techniques.html"
                className="underline underline-offset-4"
              >
                Dunlosky and colleagues’ review of learning techniques
              </a>
              .
            </p>
          </section>
          <Link
            href="/"
            className="mt-10 inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4"
          >
            ← choose a course
          </Link>
        </div>
      </div>
    </main>
  );
}
