import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { glossary, slugifyTerm } from "@/content/glossary";

export const metadata: Metadata = {
  title: "Glossary | Learn",
  description: "Durable systems and LLM engineering concepts in plain language.",
  alternates: { canonical: "/glossary" },
};

export default function GlossaryPage() {
  return (
    <main id="main" className="min-h-svh bg-background text-foreground">
      <div className="mx-auto min-h-svh max-w-6xl px-4 sm:px-6">
        <SiteHeader trail={[{ label: "glossary" }]} />

        <div className="mx-auto max-w-3xl py-10 sm:py-14">
          <p className="font-mono text-xs text-primary">reference</p>
          <h1 className="mt-5 text-3xl font-medium tracking-[-0.035em] sm:text-4xl">
            glossary
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            Durable concepts from both courses, in plain language. Provider
            facts and model specifics change too fast to define here.
          </p>

          <dl className="mt-10 border-t">
            {glossary.map((term) => (
              <div
                key={term.term}
                id={slugifyTerm(term.term)}
                className="scroll-mt-20 border-b py-5"
              >
                <dt className="text-base font-medium tracking-[-0.01em]">
                  {term.term}
                </dt>
                <dd className="mt-1.5 text-sm leading-6 text-muted-foreground">
                  {term.definition}
                </dd>
                {term.related && term.related.length > 0 && (
                  <dd className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.6875rem]">
                    {term.related.map((key) => (
                      <Link
                        key={key}
                        href={`/${key}`}
                        className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
                      >
                        → /{key}
                      </Link>
                    ))}
                  </dd>
                )}
              </div>
            ))}
          </dl>

          <footer className="pt-5 font-mono text-[0.6875rem] text-muted-foreground">
            <p>
              back:{" "}
              <Link
                href="/"
                className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
              >
                course index
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
