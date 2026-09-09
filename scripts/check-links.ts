/**
 * On-demand external link check. Reads every `references[]` URL out of the
 * course content and fetches it — no app server needed, since this never
 * touches rendered pages. Deliberately NOT part of CI: external sites flake,
 * rate-limit, and block bots, and that should never fail a build.
 *
 * Run before deploy: pnpm check-links
 */
import { courses } from "../content/index";

const TIMEOUT_MS = 15_000;
const CONCURRENCY = 5;

type Result = { href: string; where: string; ok: boolean; detail: string };

async function check(href: string, where: string): Promise<Result> {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(href, {
        method: "GET",
        redirect: "follow",
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { "user-agent": "learn.smmeyer.dev link-check" },
      });
      // Drain so keep-alive sockets don't hang the process.
      await res.arrayBuffer().catch(() => undefined);
      if (res.ok) return { href, where, ok: true, detail: String(res.status) };
      if (attempt === 2) return { href, where, ok: false, detail: `HTTP ${res.status}` };
    } catch (err) {
      if (attempt === 2) {
        const msg = err instanceof Error ? err.message : String(err);
        return { href, where, ok: false, detail: msg.slice(0, 120) };
      }
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  return { href, where, ok: false, detail: "unreachable" };
}

const targets: { href: string; where: string }[] = [];
for (const course of courses) {
  for (const chapter of course.chapters) {
    for (const ref of chapter.references ?? []) {
      targets.push({ href: ref.href, where: `${course.slug}/${chapter.slug}` });
    }
  }
}

const unique = [...new Map(targets.map((t) => [t.href, t])).values()];
console.log(`checking ${unique.length} reference URLs…`);

async function main(): Promise<void> {
  const results: Result[] = [];
  for (let i = 0; i < unique.length; i += CONCURRENCY) {
    const batch = await Promise.all(
      unique.slice(i, i + CONCURRENCY).map((t) => check(t.href, t.where)),
    );
    results.push(...batch);
    for (const r of batch) {
      console.log(`  ${r.ok ? "✓" : "✗"} ${r.detail}  ${r.href}`);
    }
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} links alive`);
  if (failed.length > 0) {
    console.error("dead or blocked links (verify by hand, then update or drop):");
    for (const r of failed) console.error(`  - ${r.href} (${r.where}): ${r.detail}`);
    process.exit(1);
  }
}

void main();
