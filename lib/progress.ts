/**
 * Versioned local-only progress store.
 *
 * No backend, no accounts. All state lives in `localStorage` under a
 * versioned key and is only written on meaningful learner events
 * (completion toggles, visits, quiz answers, bookmarks, notes).
 *
 * Schema follows the handoff's `ProgressStateV1` (build docs §8 "Progress
 * schema"). The handoff references `QuizAttempt` / `DrillAttempt` without
 * defining them; minimal shapes are defined here and documented as the
 * extension point for interview-mode scoring.
 *
 * Chapter keys are opaque `"<course-slug>/<chapter-slug>"` strings, built
 * with {@link chapterKey}. Never persist titles or content — slugs are the
 * stable identity (renaming a slug intentionally orphans its history).
 *
 * This module is safe to import from server components: `localStorage` is
 * only touched inside client-guarded functions. Interactive use goes
 * through {@link useProgress} (`useSyncExternalStore`, SSR-safe) and the
 * small client islands in `components/progress/`.
 */

import { useSyncExternalStore } from "react";

export const STORAGE_KEY = "learn.smmeyer.dev:progress:v1";
export const SCHEMA_VERSION = 1 as const;

export type QuizAttempt = {
  chapterKey: string;
  /** index into the chapter's quiz array */
  questionIndex: number;
  selectedIndex: number;
  correct: boolean;
  attemptedAt: string; // ISO timestamp
};

export type DrillAttempt = {
  /** chapter key when tied to a chapter; absent for deck/mock drills */
  chapterKey?: string;
  completedAt: string; // ISO timestamp
  /**
   * Optional 1–4 self-score (handoff interview-mode axes:
   * framing / correctness / depth / tradeoffs / recovery).
   */
  score?: number;
  /** interview-mode drill id (e.g. "url-shortener") for drills deck entries */
  drillId?: string;
  note?: string;
};

export type ProgressStateV1 = {
  schemaVersion: 1;
  /** chapter keys marked complete, e.g. "system-design/01-..." */
  completedChapters: string[];
  /** last-known position per chapter key (reserved for lesson anchors) */
  lessonPositions: Record<string, string>;
  quizAttempts: Record<string, QuizAttempt[]>;
  drillAttempts: DrillAttempt[];
  bookmarks: string[];
  /** free-form notes per chapter key; writers must debounce */
  notes: Record<string, string>;
  lastVisited?: string;
  preferences: { reducedMotion: boolean; denseMode: boolean };
};

export function chapterKey(courseSlug: string, chapterSlug: string): string {
  return `${courseSlug}/${chapterSlug}`;
}

export function defaultProgress(): ProgressStateV1 {
  return {
    schemaVersion: 1,
    completedChapters: [],
    lessonPositions: {},
    quizAttempts: {},
    drillAttempts: [],
    bookmarks: [],
    notes: {},
    lastVisited: undefined,
    preferences: { reducedMotion: false, denseMode: false },
  };
}

/** Stable server snapshot for `useSyncExternalStore` (must be cached). */
const serverSnapshot: ProgressStateV1 = defaultProgress();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

/**
 * Best-effort migration to the current schema. Unknown future
 * `schemaVersion` values fall through to sanitization so a redesign never
 * crashes on old study history — unrecognized fields are dropped, recognized
 * ones are kept. Add explicit `case` branches here when v2 exists.
 */
export function migrateProgress(raw: unknown): ProgressStateV1 {
  const base = defaultProgress();
  if (!isRecord(raw)) return base;
  const data = raw as Record<string, unknown>;

  const quizAttempts: Record<string, QuizAttempt[]> = {};
  if (isRecord(data.quizAttempts)) {
    for (const [k, attempts] of Object.entries(data.quizAttempts)) {
      if (!Array.isArray(attempts)) continue;
      const clean = attempts.filter(
        (a): a is QuizAttempt =>
          isRecord(a) &&
          typeof a.chapterKey === "string" &&
          typeof a.questionIndex === "number" &&
          typeof a.selectedIndex === "number" &&
          typeof a.correct === "boolean" &&
          typeof a.attemptedAt === "string",
      );
      if (clean.length > 0) quizAttempts[k] = clean;
    }
  }

  const drillAttempts: DrillAttempt[] = Array.isArray(data.drillAttempts)
    ? data.drillAttempts.filter(
        (d): d is DrillAttempt =>
          isRecord(d) &&
          (d.chapterKey === undefined || typeof d.chapterKey === "string") &&
          typeof d.completedAt === "string",
      )
    : [];

  const notes: Record<string, string> = {};
  if (isRecord(data.notes)) {
    for (const [k, v] of Object.entries(data.notes)) {
      if (typeof v === "string" && v.length > 0) notes[k] = v;
    }
  }

  const lessonPositions: Record<string, string> = {};
  if (isRecord(data.lessonPositions)) {
    for (const [k, v] of Object.entries(data.lessonPositions)) {
      if (typeof v === "string") lessonPositions[k] = v;
    }
  }

  const preferences = isRecord(data.preferences) ? data.preferences : {};
  const lastVisited =
    typeof data.lastVisited === "string" ? data.lastVisited : undefined;

  return {
    schemaVersion: 1,
    completedChapters: asStringArray(data.completedChapters),
    lessonPositions,
    quizAttempts,
    drillAttempts,
    bookmarks: asStringArray(data.bookmarks),
    notes,
    ...(lastVisited ? { lastVisited } : {}),
    preferences: {
      reducedMotion: preferences.reducedMotion === true,
      denseMode: preferences.denseMode === true,
    },
  };
}

// ---------------------------------------------------------------------------
// Browser store (client only)
// ---------------------------------------------------------------------------

type Listener = () => void;

let cached: ProgressStateV1 | null = null;
const listeners = new Set<Listener>();
let storageListenerAttached = false;

function isClient(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readStored(): ProgressStateV1 {
  if (!isClient()) return serverSnapshot;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    return migrateProgress(JSON.parse(raw));
  } catch {
    return defaultProgress();
  }
}

function getSnapshot(): ProgressStateV1 {
  if (!isClient()) return serverSnapshot;
  if (!cached) cached = readStored();
  return cached;
}

function persist(state: ProgressStateV1): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota or privacy mode: progress stays in memory for the session.
  }
}

function emit(): void {
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  if (isClient() && !storageListenerAttached) {
    storageListenerAttached = true;
    // Cross-tab sync: another tab wrote our key, re-read and notify.
    window.addEventListener("storage", (event) => {
      if (event.key === STORAGE_KEY) {
        cached = readStored();
        emit();
      }
    });
  }
  return () => {
    listeners.delete(listener);
  };
}

/** Reactive access to progress state. SSR-safe: server snapshot is empty. */
export function useProgress(): ProgressStateV1 {
  return useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
}

/** Reactive access to a single chapter note (stable primitive snapshot). */
export function useNote(key: string): string {
  return useSyncExternalStore(
    subscribe,
    () => getSnapshot().notes[key] ?? "",
    () => "",
  );
}

function update(fn: (prev: ProgressStateV1) => ProgressStateV1): void {
  if (!isClient()) return;
  cached = fn(getSnapshot());
  persist(cached);
  emit();
}

// ---------------------------------------------------------------------------
// Domain actions — the only writers (persist on meaningful events only)
// ---------------------------------------------------------------------------

export function isChapterComplete(
  state: ProgressStateV1,
  key: string,
): boolean {
  return state.completedChapters.includes(key);
}

export function toggleChapterComplete(key: string): void {
  update((prev) => {
    const complete = prev.completedChapters.includes(key);
    return {
      ...prev,
      completedChapters: complete
        ? prev.completedChapters.filter((k) => k !== key)
        : [...prev.completedChapters, key],
    };
  });
}

/** Append a quiz attempt (history kept; latest per question wins in UI). */
export function recordQuizAttempt(attempt: QuizAttempt): void {
  update((prev) => ({
    ...prev,
    quizAttempts: {
      ...prev.quizAttempts,
      [attempt.chapterKey]: [
        ...(prev.quizAttempts[attempt.chapterKey] ?? []),
        attempt,
      ],
    },
  }));
}

export function latestQuizAttempts(
  state: ProgressStateV1,
  key: string,
): Map<number, QuizAttempt> {
  const latest = new Map<number, QuizAttempt>();
  for (const attempt of state.quizAttempts[key] ?? []) {
    latest.set(attempt.questionIndex, attempt);
  }
  return latest;
}

export function isBookmarked(state: ProgressStateV1, key: string): boolean {
  return state.bookmarks.includes(key);
}

export function toggleBookmark(key: string): void {
  update((prev) => ({
    ...prev,
    bookmarks: prev.bookmarks.includes(key)
      ? prev.bookmarks.filter((k) => k !== key)
      : [...prev.bookmarks, key],
  }));
}

export function getNote(state: ProgressStateV1, key: string): string {
  return state.notes[key] ?? "";
}

/** Writers must debounce (see ChapterNotes); skips the write when unchanged. */
export function saveNote(key: string, text: string): void {
  if (!isClient()) return;
  const trimmed = text.trim();
  const current = getSnapshot().notes[key] ?? "";
  if (current === trimmed) return;
  update((prev) => {
    if ((prev.notes[key] ?? "") === trimmed) return prev;
    const notes = { ...prev.notes };
    if (trimmed.length === 0) delete notes[key];
    else notes[key] = trimmed;
    return { ...prev, notes };
  });
}

/** Log an interview-mode drill/mock attempt (drill deck, mock workspace). */
export function recordDrillAttempt(attempt: DrillAttempt): void {
  update((prev) => ({
    ...prev,
    drillAttempts: [...prev.drillAttempts, attempt],
  }));
}
export function recordVisit(key: string): void {
  if (!isClient()) return;
  if (getSnapshot().lastVisited === key) return;
  update((prev) =>
    prev.lastVisited === key ? prev : { ...prev, lastVisited: key },
  );
}

export function countCompleted(
  state: ProgressStateV1,
  courseSlug: string,
): number {
  const prefix = `${courseSlug}/`;
  return state.completedChapters.filter((k) => k.startsWith(prefix)).length;
}

// ---------------------------------------------------------------------------
// Export / import / reset
// ---------------------------------------------------------------------------

export function exportProgressJson(): string {
  return JSON.stringify(getSnapshot(), null, 2);
}

const PROGRESS_KEYS = [
  "completedChapters",
  "lessonPositions",
  "quizAttempts",
  "drillAttempts",
  "bookmarks",
  "notes",
  "lastVisited",
  "preferences",
] as const;

/** True when the state holds anything worth keeping (for replace guards). */
export function hasProgressData(state: ProgressStateV1): boolean {
  return (
    state.completedChapters.length > 0 ||
    state.drillAttempts.length > 0 ||
    state.bookmarks.length > 0 ||
    Object.keys(state.notes).length > 0 ||
    Object.keys(state.quizAttempts).length > 0 ||
    Object.keys(state.lessonPositions).length > 0 ||
    state.lastVisited !== undefined
  );
}

export function importProgressJson(json: string): { ok: true } | { ok: false; error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, error: "not valid JSON" };
  }
  if (!isRecord(parsed)) return { ok: false, error: "not a progress file" };
  // Strict gate: a real export always carries the version marker plus at
  // least one recognized key, so stray JSON can never wipe study history.
  if (parsed.schemaVersion !== SCHEMA_VERSION) {
    return { ok: false, error: `unsupported schema (want v${SCHEMA_VERSION})` };
  }
  if (!PROGRESS_KEYS.some((key) => key in parsed)) {
    return { ok: false, error: "no progress data found" };
  }
  const migrated = migrateProgress(parsed);
  if (!isClient()) return { ok: true };
  cached = migrated;
  persist(cached);
  emit();
  return { ok: true };
}

export function resetProgress(): void {
  update(() => defaultProgress());
}
