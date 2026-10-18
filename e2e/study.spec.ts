import { expect, test } from "@playwright/test";

const CHAPTER = "/system-design/04-caching-and-performance";

test("the roadmap groups phases and chapter links target real sections", async ({
  page,
}) => {
  await page.goto("/system-design");
  const phases = page.getByRole("navigation", { name: "course phases" });
  await phases
    .getByRole("link", { name: "Distributed core", exact: true })
    .click();
  await expect(page).toHaveURL(/#distributed-core$/);
  await expect(
    page.locator("#distributed-core").getByRole("heading", { level: 3 }),
  ).toContainText("Distributed core");
  await page.goto(CHAPTER);
  const links = page
    .getByRole("navigation", { name: "chapter sections" })
    .getByRole("link");
  for (const link of await links.all()) {
    const href = await link.getAttribute("href");
    if (href?.startsWith("#")) await expect(page.locator(href)).toBeAttached();
  }
  await links.filter({ hasText: "assignment + rubric" }).click();
  await expect(page).toHaveURL(/#assignment$/);
  await expect(
    page.getByRole("heading", { name: "Self-review rubric", exact: true }),
  ).toBeVisible();
});

test("a lab captures the prediction before exposing its result", async ({
  page,
}) => {
  await page.goto(CHAPTER);
  await expect(page.getByRole("slider")).toHaveCount(0);
  const explore = page.getByRole("button", {
    name: "save prediction & explore",
  });
  await expect(explore).toBeDisabled();
  await page
    .getByLabel("Your prediction and assumption")
    .fill("10,000 × 0.30 × 0.2 = 600 requests.");
  await explore.click();
  await expect(
    page.getByText("10,000 × 0.30 × 0.2 = 600 requests.", { exact: true }),
  ).toBeVisible();
  const sourceHits = page
    .locator("div", {
      has: page.getByText("source hits per expiry", { exact: true }),
    })
    .filter({ has: page.locator("dd") })
    .last();
  await expect(sourceHits.locator("dd")).toHaveText("600");
  await expect(
    page.getByRole("slider", { name: "hot-key share", exact: true }),
  ).toBeVisible();
});

test("recall requires an attempt and weak practice survives reload into review", async ({
  page,
}) => {
  await page.goto(CHAPTER + "#retrieval");
  const compare = page
    .getByRole("button", { name: "compare with a sample answer" })
    .first();
  await expect(compare).toBeDisabled();
  await expect(page.getByText(/Misses rise from 200 to 400/)).toHaveCount(0);
  await page
    .getByLabel(/At 20k reads\/s/)
    .fill("The misses double from 200 to 400 per second.");
  await compare.click();
  await expect(page.getByText(/Misses rise from 200 to 400/)).toBeVisible();
  await page.getByRole("radio", { name: /2 · gaps/ }).check();
  await page
    .getByLabel(/One piece of evidence/)
    .fill("I need to distinguish TTL jitter from coalescing.");
  await page.getByRole("button", { name: "log chapter practice" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: /Saved locally/ }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByText(/Last practice: 2\/4/)).toBeVisible();
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "practice to revisit" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Caching & performance", exact: true }),
  ).toHaveAttribute("href", CHAPTER + "#retrieval");
});

test("completed chapters lead directly to the next unfinished chapter", async ({
  page,
}) => {
  await page.goto("/system-design/01-system-design-foundations");
  await page.getByRole("button", { name: /mark complete/ }).click();
  await page.goto("/");
  await expect(
    page.getByRole("region", { name: "continue studying" }).getByRole("link"),
  ).toHaveAttribute("href", "/system-design/02-networking-apis-and-boundaries");
});

test.describe("touch layouts", () => {
  test.use({ hasTouch: true, isMobile: true });
  for (const width of [320, 375, 768]) {
    test(
      "navigation and learning surfaces fit at " + width + "px",
      async ({ page }) => {
        await page.setViewportSize({ width, height: 812 });
        for (const url of [
          "/",
          "/llm-engineering",
          CHAPTER,
          "/llm-engineering/04-inference-and-serving",
          "/mock",
        ]) {
          await page.goto(url);
          if (await page.getByLabel("Your prediction and assumption").count()) {
            await page
              .getByLabel("Your prediction and assumption")
              .fill("I predict a larger value as workload increases.");
            await page
              .getByRole("button", { name: "save prediction & explore" })
              .click();
          }
          expect(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= window.innerWidth,
            ),
            url + " overflows at " + width,
          ).toBe(true);
        }
        await page.goto("/");
        await page.locator("header summary").tap();
        const menu = page.getByRole("navigation", { name: "site menu" });
        for (const name of ["drills", "manual", "glossary", "study guide"])
          await expect(
            menu.getByRole("link", { name, exact: true }),
          ).toBeVisible();
        const tapTargets = await menu.getByRole("link").evaluateAll((links) =>
          links.map((link) => {
            const { top, bottom, height } = link.getBoundingClientRect();
            return { top, bottom, height };
          }),
        );
        for (let index = 0; index < tapTargets.length; index++) {
          expect(tapTargets[index].height).toBeGreaterThanOrEqual(44);
          if (index > 0)
            expect(tapTargets[index].top).toBeGreaterThanOrEqual(
              tapTargets[index - 1].bottom,
            );
        }
        await menu
          .getByRole("link", { name: "study guide", exact: true })
          .tap();
        await expect(page).toHaveURL("/about-this-course");
        await page.getByRole("button", { name: /search/ }).click();
        await page
          .getByPlaceholder(/chapters, concepts/)
          .fill("study sequence");
        await expect(
          page.getByRole("dialog").getByRole("link", { name: /How to study/ }),
        ).toBeVisible();
      },
    );
  }
});

test("share metadata and the 404 work in the production build", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const image = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  expect(image).toContain("learn.smmeyer.dev/opengraph-image");
  const response = await request.get(new URL(image!).pathname);
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("image/png");
  const missing = await page.goto("/system-design/missing-chapter");
  expect(missing?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Find your next lesson." }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Browse courses/ }),
  ).toHaveAttribute("href", "/");
});
