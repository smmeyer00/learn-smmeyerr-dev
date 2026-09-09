import { test, expect } from "@playwright/test";
import { courses } from "../content/index";

/**
 * Route crawl: every static URL derived from content, visited in a real
 * browser. Asserts HTTP 200, zero page errors, and the shared landmarks
 * (skip link target, h1). This is the mechanical equivalent of walking the
 * whole course by hand — templates are verified through every chapter.
 */

const urls: string[] = ["/", "/drills", "/mock", "/field-manual", "/glossary"];
for (const course of courses) {
  urls.push(`/${course.slug}`);
  for (const chapter of course.chapters) {
    urls.push(`/${course.slug}/${chapter.slug}`);
  }
}

test.describe("route crawl", () => {
  for (const url of urls) {
    test(url, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (err) => errors.push(String(err)));
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
      });

      const response = await page.goto(url);
      expect(response?.status(), `${url} status`).toBe(200);
      await expect(page.locator("#main")).toBeAttached();
      await expect(page.locator("h1").first()).toBeVisible();
      expect(errors, `${url} console/page errors`).toEqual([]);
    });
  }
});
