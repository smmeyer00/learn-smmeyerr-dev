import Link from "next/link";
import { SearchButton } from "@/components/search/search-palette";

export type TrailItem = { label: string; href?: string };

const destinations = [
  { href: "/drills", label: "drills" },
  { href: "/manual", label: "manual" },
  { href: "/glossary", label: "glossary" },
  { href: "/about", label: "about" },
];
const linkClass =
  "inline-flex min-h-11 items-center text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary";

export function SiteHeader({ trail = [] }: { trail?: TrailItem[] }) {
  return (
    <header className="sticky top-0 z-40 flex min-h-16 items-center justify-between gap-2 border-b bg-background py-2 font-mono text-xs">
      <p className="min-w-0 truncate font-medium">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center underline decoration-border underline-offset-4 hover:text-primary"
        >
          learn.smmeyer.dev
        </Link>
        {trail.map((item) => (
          <span key={item.label}>
            <span aria-hidden="true" className="mx-1 text-primary">
              /
            </span>
            {item.href ? (
              <Link
                href={item.href}
                className="underline decoration-border underline-offset-4 hover:text-primary"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-muted-foreground">{item.label}</span>
            )}
          </span>
        ))}
      </p>
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <SearchButton />
        <nav
          aria-label="site"
          className="hidden items-center gap-4 min-[900px]:flex"
        >
          {destinations.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass}>
              {item.label}
            </Link>
          ))}
          <a href="https://smmeyer.dev" className={linkClass}>
            Steven Meyer ↗
          </a>
        </nav>
        <details className="group shrink-0 min-[900px]:hidden">
          <summary className="flex min-h-11 min-w-16 cursor-pointer list-none items-center justify-center rounded border px-3 text-primary [&::-webkit-details-marker]:hidden">
            menu{" "}
            <span aria-hidden="true" className="ml-2 group-open:rotate-180">
              ⌄
            </span>
          </summary>
          <nav
            aria-label="site menu"
            className="absolute right-0 top-full z-40 mt-2 flex w-64 max-w-[calc(100vw-2rem)] flex-col rounded border bg-card p-3 shadow-xl"
          >
            <Link href="/" className={linkClass + " flex"}>
              courses
            </Link>
            {destinations.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={linkClass + " flex"}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/mock" className={linkClass + " flex"}>
              timed mock
            </Link>
            <a
              href="https://smmeyer.dev"
              className={linkClass + " flex border-t"}
            >
              Steven Meyer ↗
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}
