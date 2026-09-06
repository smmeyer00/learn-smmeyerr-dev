import Link from "next/link";

export type TrailItem = { label: string; href?: string };

/**
 * Shared site header: brand + breadcrumb trail on the left, practice
 * navigation on the right. One component so drills / manual / glossary
 * stay discoverable from every page.
 */
export function SiteHeader({ trail = [] }: { trail?: TrailItem[] }) {
  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b font-mono text-xs">
      <p className="min-w-0 truncate font-medium text-foreground">
        <Link
          href="/"
          className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
        >
          learn.smmeyer.dev
        </Link>
        {trail.map((item) => (
          <span key={item.label}>
            <span className="text-primary">/</span>
            {item.href ? (
              <Link
                href={item.href}
                className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-muted-foreground">{item.label}</span>
            )}
          </span>
        ))}
      </p>
      <nav
        className="flex shrink-0 items-center gap-3 sm:gap-4"
        aria-label="site"
      >
        <Link
          href="/drills"
          className="hidden text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground min-[420px]:inline"
        >
          drills
        </Link>
        <Link
          href="/field-manual"
          className="hidden text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground min-[420px]:inline"
        >
          manual
        </Link>
        <Link
          href="/glossary"
          className="hidden text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground min-[420px]:inline"
        >
          glossary
        </Link>
        <a
          href="https://smmeyer.dev"
          className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
        >
          smmeyer.dev ↗
        </a>
      </nav>
    </header>
  );
}
