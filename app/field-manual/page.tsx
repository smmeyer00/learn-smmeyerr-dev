import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { fieldManual } from "@/content/field-manual";

export const metadata: Metadata = {
  title: "Field manual | Learn",
  description:
    "Scale formulas, availability budgets, AI-system metrics, the 50-minute checklist, and the FACT frame.",
  alternates: { canonical: "/field-manual" },
};

export default function FieldManualPage() {
  return (
    <main id="main" className="min-h-svh bg-background text-foreground">
      <div className="mx-auto min-h-svh max-w-6xl px-4 sm:px-6">
        <SiteHeader trail={[{ label: "field-manual" }]} />

        <div className="mx-auto max-w-3xl py-10 sm:py-14">
          <p className="font-mono text-xs text-primary">reference</p>
          <h1 className="mt-5 text-3xl font-medium tracking-[-0.035em] sm:text-4xl">
            field manual
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            Everything worth memorizing, on one page. Print it before the
            interview — this page, the glossary, and chapter pages all render
            print-clean.
          </p>

          {fieldManual.map((section) => (
            <section key={section.id} id={section.id} className="mt-12 scroll-mt-20">
              <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-primary">
                {section.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {section.intro}
              </p>
              <dl className="mt-3 border-t font-mono text-xs leading-6">
                {section.rows.map((row) => (
                  <div
                    key={row.label}
                    className="grid gap-x-6 border-b py-2.5 sm:grid-cols-[12rem_minmax(0,1fr)]"
                  >
                    <dt className="text-muted-foreground">{row.label}</dt>
                    <dd className="text-foreground/90">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}

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
