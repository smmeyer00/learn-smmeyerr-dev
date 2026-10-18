"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { searchEntries, type SearchEntry } from "@/lib/search-matching";
import { useHydrated } from "@/lib/use-hydrated";

const kindLabel: Record<SearchEntry["kind"], string> = {
  chapter: "chapter",
  glossary: "glossary",
  drill: "drill",
  manual: "manual",
  guide: "study guide",
};

const OPEN_SEARCH = "learn:open-search";

/** A small header island opens the shared palette without importing its index. */
export function SearchButton() {
  const hydrated = useHydrated();
  return (
    <button
      type="button"
      aria-label="search courses"
      aria-keyshortcuts="meta+k control+k"
      disabled={!hydrated}
      title="Search (⌘ / Ctrl K)"
      onClick={() => window.dispatchEvent(new Event(OPEN_SEARCH))}
      className="min-h-11 cursor-pointer rounded border px-2 font-mono text-xs text-muted-foreground hover:border-primary/50 hover:text-primary"
    >
      search
    </button>
  );
}

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
  const triggerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const listId = useId();
  const results = searchEntries(query, index);

  useEffect(() => {
    function openPalette() {
      triggerRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
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
    window.addEventListener(OPEN_SEARCH, openPalette);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_SEARCH, openPalette);
    };
  }, []);

  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      // Dialog just mounted: move focus into it (external DOM sync).
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (wasOpen.current) {
      wasOpen.current = false;
      // Return focus to the trigger that opened the dialog.
      triggerRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 p-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="search courses"
        className="w-full max-w-xl overflow-hidden rounded-md border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          // Trap Tab inside the modal: background controls are unreachable
          // while open (pairs with aria-modal).
          if (e.key !== "Tab" || !dialogRef.current) return;
          const focusables = Array.from(
            dialogRef.current.querySelectorAll<HTMLElement>(
              "a[href], button:not([disabled]), input:not([disabled])",
            ),
          ).filter((el) => el.offsetParent !== null);
          if (focusables.length === 0) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }}
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
            className="min-h-11 min-w-11 cursor-pointer font-mono text-xs text-muted-foreground hover:text-foreground"
          >
            esc
          </button>
        </div>
        {results.length > 0 ? (
          <ul
            id={listId}
            role="listbox"
            className="max-h-[50vh] overflow-y-auto p-2"
          >
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
            {query.trim()
              ? "no matches — try fewer words"
              : "type to search chapters, glossary, drills + manual"}
          </p>
        )}
      </div>
    </div>
  );
}
