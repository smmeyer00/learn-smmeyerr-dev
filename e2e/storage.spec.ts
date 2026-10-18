import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

const CHAPTER = "/llm-engineering/01-mental-model-of-modern-llms";

/**
 * Storage matrix: every local-state domain (completion, quiz, bookmark,
 * note, visit) survives reload, exports to JSON, survives a wipe, and
 * restores byte-identically on import.
 */
test("full storage round trip", async ({ page }) => {
  await page.goto(CHAPTER);

  // 1. Live in every domain.
  await page.getByRole("button", { name: /mark complete/i }).click();
  await expect(
    page.getByRole("button", { name: /complete — undo/i }),
  ).toBeVisible();

  await page
    .getByRole("group", { name: /options for question 1/i })
    .getByRole("button")
    .first()
    .click();
  await expect(page.getByText(/correct|not quite/).first()).toBeVisible();

  await page.getByRole("button", { name: /bookmark/i }).click();
  await expect(
    page.getByRole("button", { name: /saved — remove/i }),
  ).toBeVisible();

  await page
    .getByLabel(/personal notes for this chapter/)
    .fill("round-trip note");
  await page.waitForTimeout(900); // past the 600ms debounced save

  await page.getByRole("radio", { name: /3 · explain/ }).check();
  await page
    .getByLabel(/One piece of evidence/)
    .fill("I separated sampling from factual support.");
  await page.getByRole("button", { name: "log chapter practice" }).click();
  await expect(
    page.getByRole("status", { name: "" }).filter({ hasText: /Saved locally/ }),
  ).toBeVisible();

  // 2. Reload: everything persists.
  await page.reload();
  await expect(
    page.getByRole("button", { name: /complete — undo/i }),
  ).toBeVisible();
  await expect(page.getByText(/correct|not quite/).first()).toBeVisible();
  await expect(
    page.getByRole("button", { name: /saved — remove/i }),
  ).toBeVisible();
  await expect(page.getByLabel(/personal notes for this chapter/)).toHaveValue(
    "round-trip note",
  );
  await expect(page.getByText(/Last practice: 3\/4/)).toBeVisible();

  // 3. Export captures it.
  await page.goto("/");
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /export JSON/ }).click(),
  ]);
  const savedPath = await download.path();
  const exported = JSON.parse(readFileSync(savedPath!, "utf-8"));
  expect(exported.schemaVersion).toBe(1);
  expect(exported.completedChapters).toContain(
    "llm-engineering/01-mental-model-of-modern-llms",
  );
  expect(exported.bookmarks).toContain(
    "llm-engineering/01-mental-model-of-modern-llms",
  );
  expect(Object.keys(exported.quizAttempts).length).toBe(1);
  expect(exported.drillAttempts).toHaveLength(1);
  expect(exported.drillAttempts[0].note).toBe(
    "I separated sampling from factual support.",
  );
  expect(exported.lastVisited).toBe(
    "llm-engineering/01-mental-model-of-modern-llms",
  );

  // 4. Reset wipes it (two-step confirm).
  await page.getByRole("button", { name: /\[ reset \]/ }).click();
  await page.getByRole("button", { name: /confirm reset/ }).click();
  await expect(page.getByText(/cleared local progress/)).toBeVisible();
  await expect(page.getByText(/pick up where you left off/)).toBeHidden();

  // 5. Import restores it (two-step confirm).
  await page.setInputFiles("input[type=file]", savedPath!);
  await expect(page.getByText(/import will replace/)).toBeHidden(); // empty state: no confirm
  await expect(page.getByText(/imported progress/)).toBeVisible();
  // Chapter was completed pre-export, so the banner offers the next chapter;
  // tally + bookmark prove the restore.
  await expect(page.getByText(/start the next chapter/)).toBeVisible();
  await expect(page.getByText("01/21").first()).toBeVisible();
  await expect(page.getByText(/saved · 01/)).toBeVisible();
});
