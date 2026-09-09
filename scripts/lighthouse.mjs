/**
 * Automated Lighthouse pass, shaped like the Playwright suites: boots the
 * production build locally, scores index + chapter + lab pages, asserts
 * category floors. No CI gate (local perf numbers wobble); run pre-deploy:
 *
 *   pnpm perf   (= build + this script)
 *
 * Chrome binary: reuses Playwright's headless shell when CHROME_PATH is
 * unset (installed via `playwright install --only-shell chromium`).
 */
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { existsSync, globSync } from "node:fs";

/** A port nothing else holds: stale `next start` orphans must never poison a run. */
async function freePort() {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.once("error", reject);
    probe.listen(0, () => {
      const address = probe.address();
      const port = typeof address === "object" && address ? address.port : 0;
      probe.close(() => resolve(port));
    });
  });
}

const PORT = await freePort();
const BASE = `http://localhost:${PORT}`;
const TARGETS = [
  { url: `${BASE}/`, label: "index" },
  { url: `${BASE}/system-design/01-system-design-foundations`, label: "chapter" },
  { url: `${BASE}/llm-engineering/04-inference-and-serving`, label: "lab page" },
];
const FLOORS = { performance: 85, accessibility: 95, "best-practices": 90, seo: 90 };

function findChrome() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  const home = process.env.HOME ?? "";
  const hits = globSync(
    `${home}/Library/Caches/ms-playwright/chromium_headless_shell-*/**/chrome-headless-shell`,
  ).concat(
    globSync(`${home}/.cache/ms-playwright/chromium_headless_shell-*/**/chrome-headless-shell`),
  );
  if (hits.length === 0) {
    throw new Error(
      "no Chrome found: set CHROME_PATH or run `playwright install --only-shell chromium`",
    );
  }
  return hits.sort().reverse()[0];
}

async function waitForServer(url, timeoutMs = 60_000) {
  const start = Date.now();
  for (;;) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    if (Date.now() - start > timeoutMs) throw new Error(`server never came up: ${url}`);
    await new Promise((r) => setTimeout(r, 500));
  }
}

const server = spawn("pnpm", ["exec", "next", "start", "-p", String(PORT)], {
  stdio: "ignore",
  detached: false,
});
process.on("exit", () => {
  try {
    server.kill();
  } catch {
    /* already down */
  }
});

let failed = false;
try {
  await waitForServer(BASE);
  const chromeLauncher = await import("chrome-launcher");
  const launchChrome =
    chromeLauncher.launch ?? chromeLauncher.default?.launch;
  if (!launchChrome) throw new Error("chrome-launcher has no launch export");
  const lh = await import("lighthouse");
  const lighthouse = lh.default ?? lh;
  const chromePath = findChrome();
  // Fresh browser per target: sequential runs in one profile leak state
  // (storage, throttling baselines) and produced phantom 96s in testing.
  for (const target of TARGETS) {
    const chrome = await launchChrome({
      chromePath,
      chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu"],
    });
    try {
      const result = await lighthouse(target.url, {
        port: chrome.port,
        output: "json",
        logLevel: "error",
      });
      const cats = result.lhr.categories;
      const scores = Object.fromEntries(
        Object.entries(cats).map(([k, v]) => [k, Math.round(v.score * 100)]),
      );
      const verdicts = Object.entries(FLOORS).map(([k, floor]) => {
        const ok = scores[k] >= floor;
        if (!ok) {
          failed = true;
          for (const ref of cats[k].auditRefs) {
            const a = result.lhr.audits[ref.id];
            if (a.score !== null && a.score < 1) {
              console.log(`    failing: ${ref.id} (${Math.round(a.score * 100)})`);
            }
          }
        }
        return `${k} ${scores[k]}${ok ? "" : ` < ${floor} FAIL`}`;
      });
      console.log(`${target.label}: ${verdicts.join(" · ")}`);
    } finally {
      await chrome.kill();
    }
  }
} finally {
  server.kill();
}

if (failed) {
  console.error("\nlighthouse floors missed.");
  process.exit(1);
}
console.log("\nlighthouse floors held ✓");
