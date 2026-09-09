import { test, expect } from "@playwright/test";

test("index lists both courses with links", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "courses" })).toBeVisible();
  await expect(page.getByRole("link", { name: /system design for software engineers/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /llm engineering for software engineers/i })).toBeVisible();
});

test("course page lists chapters with hours", async ({ page }) => {
  await page.goto("/system-design");
  await expect(page.getByRole("heading", { name: "chapter index" })).toBeVisible();
  await expect(page.getByRole("link", { name: /system design foundations/i })).toBeVisible();
});

test("chapter renders the full learning loop", async ({ page }) => {
  await page.goto("/system-design/01-system-design-foundations");
  for (const label of ["outcome", "mental model", "lessons", "interview drill", "knowledge checks"]) {
    await expect(page.getByText(label, { exact: true }).first()).toBeVisible();
  }
});

test("mark-complete persists across reload", async ({ page }) => {
  await page.goto("/llm-engineering/01-mental-model-of-modern-llms");
  const toggle = page.getByRole("button", { name: /mark complete|complete — undo/i });
  await toggle.click();
  await expect(toggle).toContainText("complete — undo?");
  await page.reload();
  await expect(page.getByRole("button", { name: /complete — undo/i })).toBeVisible();
  // Index shows the tally.
  await page.goto("/");
  await expect(page.getByText("01/21").first()).toBeVisible();
});

test("quiz selection reveals the explanation", async ({ page }) => {
  await page.goto("/system-design/01-system-design-foundations");
  const options = page.getByRole("group", { name: /options for question 1/i }).getByRole("button");
  await options.first().click();
  await expect(page.getByText(/correct|not quite/).first()).toBeVisible();
});

test("search palette finds chapters", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /search/i }).click();
  await page.getByPlaceholder(/chapters, concepts/i).fill("quorum");
  const dialog = page.getByRole("dialog", { name: /search courses/i });
  await expect(dialog.getByRole("option").first()).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("search palette traps Tab focus while open", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /search/i }).click();
  const dialog = page.getByRole("dialog", { name: /search courses/i });
  await expect(dialog).toBeVisible();
  // Type to produce options, then Tab through every focusable control:
  // focus must never leave the dialog.
  await page.getByPlaceholder(/chapters, concepts/i).fill("cache");
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press("Tab");
    const inside = await dialog.evaluate((el, active) => el.contains(active), await page.evaluateHandle(() => document.activeElement));
    expect(inside).toBe(true);
  }
});

test("importing a non-progress file fails without wiping state", async ({ page }) => {
  await page.goto("/");
  // Establish real state first: a chapter visit records lastVisited.
  await page.goto("/system-design/01-system-design-foundations");
  await page.goto("/");
  await page.setInputFiles("input[type=file]", {
    name: "stray.json",
    mimeType: "application/json",
    buffer: Buffer.from("{}"),
  });
  // Existing history triggers the replace confirmation first.
  await expect(page.getByText(/import will replace current progress/i)).toBeVisible();
  await page.getByRole("button", { name: /confirm — replace my progress/i }).click();
  await expect(page.getByText(/import failed: unsupported schema/i)).toBeVisible();
  // And the prior visit survived: the continue banner still offers it.
  await expect(page.getByText(/pick up where you left off/i)).toBeVisible();
});

test("redo queue surfaces weak scenarios and weak mocks", async ({ page }) => {
  const hour = 3_600_000;
  const now = Date.now();
  await page.addInitScript(({ now, hour }) => {
    localStorage.setItem(
      "learn.smmeyer.dev:progress:v1",
      JSON.stringify({
        schemaVersion: 1,
        completedChapters: [],
        lessonPositions: {},
        quizAttempts: {},
        drillAttempts: [
          { drillId: "url-shortener", completedAt: new Date(now - hour).toISOString(), score: 1 },
          {
            drillId: "mock:public-ai-api",
            completedAt: new Date(now - hour).toISOString(),
            score: 2,
            note: "mock: Public AI API — framing 2",
          },
        ],
        bookmarks: [],
        notes: {},
        preferences: { reducedMotion: false, denseMode: false },
      }),
    );
  }, { now, hour });
  await page.goto("/drills");
  await expect(page.getByText("redo — scored weak").first()).toBeVisible();
  await expect(page.getByRole("link", { name: /public ai api/i })).toBeVisible();
});

test("drill deck draw is reproducible", async ({ page }) => {
  await page.goto("/drills");
  await page.getByRole("button", { name: /draw scenario/i }).click();
  const first = await page.getByText(/seed \d+/).first().textContent();
  const seed = first?.match(/seed (\d+)/)?.[1] ?? "";
  expect(seed).not.toBe("");
  await page.getByLabel("seed").fill(seed);
  await page.getByLabel("seed").press("Enter");
  await expect(page.getByText(`seed ${seed}`).first()).toBeVisible();
});
