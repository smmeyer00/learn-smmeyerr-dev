"use client";

import { useEffect, useRef, useState } from "react";
import { saveNote, useNote } from "@/lib/progress";

/**
 * Personal notes per chapter. Debounced save (600ms) into localStorage;
 * empty notes are dropped. The stored note is read through the external
 * store (SSR snapshot is empty, so hydration always agrees); local edits
 * live in draft state until saved.
 */
export function ChapterNotes({
  courseSlug,
  chapterSlug,
}: {
  courseSlug: string;
  chapterSlug: string;
}) {
  const key = `${courseSlug}/${chapterSlug}`;
  const stored = useNote(key);
  const [draft, setDraft] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function onChange(text: string) {
    setDraft(text);
    setSaving(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      saveNote(key, text);
      setSaving(false);
    }, 600);
  }

  return (
    <div className="mt-3">
      <label
        htmlFor={`notes-${courseSlug}-${chapterSlug}`}
        className="sr-only"
      >
        personal notes for this chapter, stored only in this browser
      </label>
      <textarea
        id={`notes-${courseSlug}-${chapterSlug}`}
        value={draft ?? stored}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder="What will future-you need to remember? Stored only in this browser."
        className="w-full rounded-md border border-border bg-secondary/40 p-3 text-sm leading-6 text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none"
      />
      <p className="mt-2 font-mono text-[0.6875rem] text-muted-foreground">
        {saving ? "saving…" : "saved locally"}
      </p>
    </div>
  );
}
