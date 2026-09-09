import { test, expect, type Page } from "@playwright/test";
import { labRegistry } from "../components/labs/registry";

/**
 * Lab sweep: every shipped lab, driven like a learner. Sliders move via
 * real input events, buttons click, readouts must change, no page errors.
 * Chapter URLs come from the same registry the app uses to mount labs.
 */

const chaptersForLab = new Map<string, string[]>();
for (const [chapterKey, labs] of Object.entries(labRegistry)) {
  const [course, ...rest] = chapterKey.split("/");
  const url = `/${course}/${rest.join("/")}`;
  for (const lab of labs) {
    chaptersForLab.set(lab.id, [...(chaptersForLab.get(lab.id) ?? []), url]);
  }
}

async function setRange(page: Page, name: RegExp, value: number) {
  // React overrides the input value descriptor, so assign through the
  // native prototype setter — otherwise React sees no change and ignores
  // the event.
  await page.getByRole("slider", { name }).evaluate((el, v) => {
    const input = el as HTMLInputElement;
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    )?.set;
    setter?.call(input, String(v));
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }, value);
}

async function gotoLab(page: Page, labId: string, errors: string[]) {
  page.on("pageerror", (err) => errors.push(String(err)));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await page.goto(chaptersForLab.get(labId)![0]);
  await expect(page.getByText("interactive lab").first()).toBeVisible();
  await expect(page.getByText(/pedagogical model/).first()).toBeVisible();
}

async function readout(page: Page, termText: string): Promise<string> {
  const term = page.locator("dt", { hasText: termText }).first();
  return (await term.locator("xpath=ancestor::div[1]/dd").textContent()) ?? "";
}

test("scale-dial responds to DAU share and judges bottlenecks", async ({ page }) => {
  const errors: string[] = [];
  await gotoLab(page, "scale-dial", errors);
  const before = await readout(page, "peak RPS");
  await setRange(page, /DAU share/, 100);
  expect(await readout(page, "peak RPS")).not.toBe(before);
  await expect(page.getByText(/bottleneck verdict/).first()).toBeVisible();
  expect(errors).toEqual([]);
});

test("cache-stampede coalescing collapses source hits", async ({ page }) => {
  const errors: string[] = [];
  await gotoLab(page, "cache-stampede", errors);
  await page.getByRole("button", { name: "request coalescing", exact: true }).click();
  await expect(page.getByText("1 (coalesced)").first()).toBeVisible();
  expect(errors).toEqual([]);
});

test("partition-lease gates split brain on quorum", async ({ page }) => {
  const errors: string[] = [];
  await gotoLab(page, "partition-lease", errors);
  // Defaults: N=5 R=3 W=3, fenced minority refuses.
  await expect(page.getByText(/refuses \(fenced\)/).first()).toBeVisible();
  await page.getByRole("button", { name: /fencing/ }).click();
  // Minority of 2 cannot reach W=3: stalls, does not diverge.
  await expect(page.getByText(/cannot reach write quorum/).first()).toBeVisible();
  await page.getByRole("button", { name: /one node down/ }).click();
  await page.getByRole("button", { name: /all nodes reachable/ }).click();
  expect(errors).toEqual([]);
});

test("gpu-capacity turns RPS into token demand", async ({ page }) => {
  const errors: string[] = [];
  await gotoLab(page, "gpu-capacity", errors);
  const before = await readout(page, "token demand");
  await setRange(page, /requests \/ second/, 2000);
  expect(await readout(page, "token demand")).not.toBe(before);
  await expect(page.getByText(/fleet utilization/).first()).toBeVisible();
  expect(errors).toEqual([]);
});

test("gpu-capacity also mounts on llm ch.17", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(String(err)));
  await page.goto(chaptersForLab.get("gpu-capacity")![1]);
  await expect(page.getByText(/token-shaped demand/).first()).toBeVisible();
  expect(errors).toEqual([]);
});

test("next-token samples and counts draws", async ({ page }) => {
  const errors: string[] = [];
  await gotoLab(page, "next-token", errors);
  const sample = page.getByRole("button", { name: /sample one token/ });
  await sample.click();
  await sample.click();
  await sample.click();
  await expect(page.getByText(/draws: 3/).first()).toBeVisible();
  await setRange(page, /temperature/, 2);
  expect(errors).toEqual([]);
});

test("attention-explorer is causal and switchable", async ({ page }) => {
  const errors: string[] = [];
  await gotoLab(page, "attention-explorer", errors);
  // Causality is visible: future positions render as masked.
  await expect(page.getByText(/masked · 0 %/).first()).toBeVisible();
  await page.getByRole("button", { name: /query: “tired”/ }).click();
  await expect(page.getByText(/Adjectives bind/).first()).toBeVisible();
  expect(errors).toEqual([]);
});

test("kv-cache scales with sequence length", async ({ page }) => {
  const errors: string[] = [];
  await gotoLab(page, "kv-cache", errors);
  const before = await readout(page, "share of one GPU");
  await setRange(page, /sequence length/, 128000);
  expect(await readout(page, "share of one GPU")).not.toBe(before);
  expect(errors).toEqual([]);
});

test("agent-loop steps healthy traces and flags oscillation", async ({ page }) => {
  const errors: string[] = [];
  await gotoLab(page, "agent-loop", errors);
  await page.getByRole("button", { name: /step →/ }).click();
  await expect(page.getByText(/02 · /).first()).toBeVisible();
  await page.getByRole("button", { name: /faulty loop/ }).click();
  for (let i = 0; i < 9; i++) {
    const done = await page.getByText(/trace complete/).count();
    if (done > 0) break;
    await page.getByRole("button", { name: /step →/ }).click();
  }
  await expect(page.getByText(/oscillation detected/).first()).toBeVisible();
  expect(errors).toEqual([]);
});

test("rag-explorer trades recall against noise", async ({ page }) => {
  const errors: string[] = [];
  await gotoLab(page, "rag-explorer", errors);
  const before = await readout(page, "recall@k (illustrative)");
  await setRange(page, /top-k retrieved/, 20);
  expect(await readout(page, "recall@k (illustrative)")).not.toBe(before);
  await page.getByRole("button", { name: /rerank/ }).click();
  await expect(page.getByText(/evidence assembled/).first()).toBeVisible();
  expect(errors).toEqual([]);
});

test("eval-workbench exposes the slice regression", async ({ page }) => {
  const errors: string[] = [];
  await gotoLab(page, "eval-workbench", errors);
  const overallB = await readout(page, "variant B overall");
  await page.getByRole("button", { name: /^variant A$/ }).click();
  expect(await readout(page, "variant A overall")).not.toBe(overallB);
  const agreementBefore = await readout(page, "agreement with humans");
  await setRange(page, /judge pass threshold/, 0.2);
  expect(await readout(page, "agreement with humans")).not.toBe(agreementBefore);
  await expect(page.getByText(/GATE:/).first()).toBeVisible();
  expect(errors).toEqual([]);
});
