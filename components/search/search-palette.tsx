"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { searchEntries, type SearchEntry } from "@/lib/search";

const kindLabel: Record<SearchEntry["kind"], string> = {
  chapter: "chapter",
  glossary: "glossary",
  drill: "drill",
  manual: "manual",
};

/**
 * Command/search palette across chapters, glossary, drills, and manual.
 * Trigger with the button or Cmd/Ctrl+K. Full keyboard path: Escape closes,
 * arrows move, Enter follows. The index arrives as props (built server-side).
 */
export function SearchPalette({ index }: { index: SearchEntry[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const results = searchEntries(query, index);

  useEffect(() => {
    function openPalette() {
      setQuery("");
      setActive(0);
      setOpen(true);
    }
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openPalette();
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      // Dialog just mounted: move focus into it (external DOM sync).
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setQuery("");
          setActive(0);
          setOpen(true);
        }}
        aria-keyshortcuts="meta+k control+k"
        className="fixed bottom-5 right-5 z-40 cursor-pointer rounded-md border border-border bg-secondary/90 px-3 py-1.5 font-mono text-[0.6875rem] text-muted-foreground shadow-lg backdrop-blur transition-colors hover:border-primary/50 hover:text-foreground"
      >
        [ search ]
        <span className="ml-2 text-border">⌘K</span>
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 p-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="search courses"
        className="w-full max-w-xl overflow-hidden rounded-md border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <span aria-hidden="true" className="font-mono text-xs text-primary">
            /
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === "Enter" && results[active]) {
                window.location.href = results[active].href;
              }
            }}
            placeholder="chapters, concepts, drills, glossary…"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={
              results[active] ? `search-${active}` : undefined
            }
            className="h-12 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="close search"
            className="cursor-pointer font-mono text-[0.6875rem] text-muted-foreground hover:text-foreground"
          >
            esc
          </button>
        </div>
        {results.length > 0 ? (
          <ul id={listId} role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
            {results.map((entry, i) => (
              <li
                key={`${entry.kind}-${entry.href}`}
                id={`search-${i}`}
                role="option"
                aria-selected={i === active}
              >
                <Link
                  href={entry.href}
                  onClick={() => setOpen(false)}
                  onMouseEnter={() => setActive(i)}
                  className={`flex items-baseline justify-between gap-4 rounded px-3 py-2.5 ${
                    i === active ? "bg-secondary" : ""
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-foreground">
                      {entry.title}
                    </span>
                    <span className="block truncate font-mono text-[0.6875rem] text-muted-foreground">
                      {entry.detail}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-[0.6875rem] text-primary">
                    {kindLabel[entry.kind]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-4 py-6 font-mono text-xs text-muted-foreground">
            {query.trim() ? "no matches — try fewer words" : "type to search 36 chapters + glossary"}
          </p>
        )}
      </div>
    </div>
  );
}
