"use client";

import { useRef, useState } from "react";
import {
  exportProgressJson,
  importProgressJson,
  resetProgress,
} from "@/lib/progress";

const buttonClass =
  "cursor-pointer font-mono text-[0.6875rem] text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground";

/**
 * Export / import / reset controls for local progress.
 * Export is a small JSON download; import re-validates through the
 * schema migration so foreign or stale files can never corrupt state.
 */
export function DataControls() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);

  function onExport() {
    const blob = new Blob([exportProgressJson()], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "learn-smmeyer-dev-progress.json";
    a.click();
    URL.revokeObjectURL(url);
    setMessage("exported progress as JSON");
  }

  function onImportFile(file: File) {
    file.text().then((text) => {
      const result = importProgressJson(text);
      setMessage(
        result.ok ? "imported progress" : `import failed: ${result.error}`,
      );
    });
  }

  function onReset() {
    if (!confirmingReset) {
      setConfirmingReset(true);
      return;
    }
    resetProgress();
    setConfirmingReset(false);
    setMessage("cleared local progress");
  }

  return (
    <div className="mt-10 border-t pt-5">
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
        local data
      </p>
      <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
        Progress lives only in this browser. Export a backup before switching
        devices; importing a file replaces what is here.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
        <button type="button" onClick={onExport} className={buttonClass}>
          [ export JSON ]
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className={buttonClass}
        >
          [ import JSON ]
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          aria-label="import progress JSON file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImportFile(file);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={onReset}
          className={
            confirmingReset
              ? "cursor-pointer font-mono text-[0.6875rem] text-destructive underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
              : buttonClass
          }
        >
          {confirmingReset ? "[ confirm reset ]" : "[ reset ]"}
        </button>
        {confirmingReset && (
          <button
            type="button"
            onClick={() => setConfirmingReset(false)}
            className={buttonClass}
          >
            [ keep my progress ]
          </button>
        )}
      </div>
      {message && (
        <p role="status" className="mt-3 font-mono text-[0.6875rem] text-primary">
          {message}
        </p>
      )}
    </div>
  );
}
