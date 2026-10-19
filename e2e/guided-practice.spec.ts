import { test, expect, type Page } from "@playwright/test";
import { guidedExercises } from "../content/guided-exercises";
import type { GuidedExercise } from "../content/guided-exercises/types";

const cache = guidedExercises[0];
const rag = guidedExercises[1];
const cacheAnswers: Record<string, string> = {
  "normal-source": "50",
  "expiry-arrivals": "600",
  "cold-source": "10000",
  timeline: "A owns a shared per-key lease. B and C wait within a deadline or use permitted stale text. Ownership expires; reject stale late publications.",
  freshness: "The copy has ten seconds remaining. Preserve its source-observation time and stop serving after age 30 seconds.",
  protection: "Admit at most 1000 source reads/s with finite waiting and bounded retries. Reject excess; source protection costs some unavailable reads.",
};
const ragAnswers: Record<string, string> = {
  sources: "A is current and authorized. B is superseded; C is outside the caller's workspace.",
  "evidence-coverage": "0",
  "unsupported-claims": "2",
  diagnosis: "A survives retrieval and reranking but disappears at assembly. The answer supports neither claim from B. Test context IDs and claim support separately.",
  "corrected-answer": "Submit within 30 calendar days of the expense and include a receipt. [A, North policy v3]",
  "missing-evidence": "I cannot verify current North policy from authorized sources. Contact its owner. Evaluate expected abstention without disclosing C.",
};

async function attempt(page: Page, exercise: GuidedExercise, answers: Record<string, string>) {
  await page.goto("/drills/" + exercise.id);
  await page.getByRole("button", { name: "Start the worksheet" }).click();
  await expect(page.getByRole("button", { name: "Compare my attempt" })).toBeDisabled();
  await expect(page.getByRole("region", { name: "worked reference answer" })).toHaveCount(0);
  for (const field of exercise.fields) await page.getByLabel(field.label, { exact: true }).fill(answers[field.id]);
  await page.reload();
  await expect(page.getByLabel(exercise.fields[0].label, { exact: true })).toHaveValue(answers[exercise.fields[0].id]);
  await page.getByRole("button", { name: "Compare my attempt" }).click();
  await expect(page.getByRole("region", { name: "worked reference answer" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Continue to revision" })).toBeDisabled();
}

async function assess(page: Page, exercise: GuidedExercise) {
  for (const criterion of exercise.rubric) {
    await page.getByRole("radio", { name: new RegExp("^Meets the goal · " + criterion.label) }).check();
    await page.getByLabel("Evidence for " + criterion.label, { exact: true }).fill("My first attempt includes this criterion's mechanism and limitation.");
  }
  await page.getByRole("button", { name: "Continue to revision" }).click();
  await expect(page.getByRole("button", { name: "Save reviewed attempt" })).toBeDisabled();
}

test("guided practice starts with two clear cases and keeps the random deck optional", async ({ page }) => {
  await page.goto("/drills");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("guided practice");
  await expect(page.getByRole("link", { name: /Start guided exercise/ })).toHaveCount(2);
  await expect(page.getByRole("button", { name: /draw scenario/ })).toBeHidden();
  for (const exercise of guidedExercises) {
    await expect(page.getByRole("heading", { name: exercise.title, exact: true })).toBeVisible();
    await expect(page.locator('a[href="/drills/' + exercise.id + '"]')).toBeVisible();
  }
});

test("cache review preserves first work, targets wrong arithmetic, and retains history on exact retry", async ({ page }) => {
  await attempt(page, cache, cacheAnswers);
  await page.getByText("Compare your worksheet item by item", { exact: true }).click();
  await expect(page.getByText(cache.fields[0].reference, { exact: true })).toBeVisible();
  await expect(page.getByRole("region", { name: "calculation checks" })).toContainText("Revisit · Normal source demand");
  await assess(page, cache);
  await expect(page.getByRole("heading", { name: "Focus your next repair: Workload reasoning" })).toBeVisible();
  await page.getByLabel("Your revision and why it improves the answer", { exact: true }).fill("Normal source demand is 500, not 50: 10,000 × 0.05. The unit is source reads per second.");
  await page.getByRole("button", { name: "Save reviewed attempt" }).click();
  await expect(page.getByRole("heading", { name: "Reviewed attempt saved", exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Your saved revision", { exact: true })).toBeVisible();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("learn.smmeyer.dev:progress:v1")!).guidedExercises["cache-expiry"]);
  expect(saved.attempts).toHaveLength(1);
  expect(saved.attempts[0].firstAttempt["normal-source"]).toBe("50");
  expect(saved.attempts[0].revision).toContain("500");
  expect(saved.attempts[0].needsPractice).toBe(true);
  await page.goto("/");
  await expect(page.getByRole("link", { name: cache.title, exact: true })).toHaveAttribute("href", "/drills/cache-expiry");
  await page.getByRole("link", { name: cache.title, exact: true }).click();
  await page.getByRole("button", { name: "Practice this exact case again" }).click();
  await expect(page.getByText("Reviewed attempt history (1)", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Start the worksheet" }).click();
  await expect(page.getByLabel("Normal source demand", { exact: true })).toHaveValue("");
  await expect(page.getByRole("region", { name: "worked reference answer" })).toHaveCount(0);
});

test("LLM exercise is usable on mobile and a reviewed baseline returns after 48 hours", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await attempt(page, rag, ragAnswers);
  await expect(page.getByRole("region", { name: "calculation checks" })).toContainText("Matches · Measure final-context evidence coverage");
  await expect(page.getByRole("region", { name: "calculation checks" })).toContainText("Matches · Check the displayed answer against its context");
  await assess(page, rag);
  await page.getByLabel("Your revision and why it improves the answer", { exact: true }).fill("I separated evidence eligibility from claim support and added an explicit test for abstention when A is missing.");
  await page.getByRole("button", { name: "Save reviewed attempt" }).click();
  await expect(page.getByRole("heading", { name: "Reviewed attempt saved", exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto("/");
  await expect(page.getByRole("link", { name: rag.title, exact: true })).toHaveCount(0);
  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem("learn.smmeyer.dev:progress:v1")!);
    state.guidedExercises["grounded-support-answer"].attempts[0].completedAt = new Date(Date.now() - 48 * 60 * 60 * 1000 - 1000).toISOString();
    localStorage.setItem("learn.smmeyer.dev:progress:v1", JSON.stringify(state));
  });
  await page.reload();
  await expect(page.getByRole("link", { name: rag.title, exact: true })).toBeVisible();
  await expect(page.getByText("guided practice · 48-hour recall", { exact: true })).toBeVisible();
});

test("unknown guided exercise has a genuine 404", async ({ page }) => {
  const response = await page.goto("/drills/not-an-exercise");
  expect(response?.status()).toBe(404);
});
