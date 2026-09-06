import { expect, test } from "@playwright/test";
import { collectPageFaults } from "./helpers.js";

const HOME_DESCRIPTION =
  "SpandanAI is a fabless semiconductor company building hybrid analog-digital silicon for AI inference and next-generation communication systems.";

test("homepage metadata: title, description, and canonical", async ({ page }) => {
  const faults = collectPageFaults(page);
  await page.goto("/");

  await expect(page).toHaveTitle("SpandanAI");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", HOME_DESCRIPTION);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://spandanai.com/");

  faults.assertClean();
});

test("team metadata: title, description, and canonical", async ({ page }) => {
  const faults = collectPageFaults(page);
  await page.goto("/team");

  await expect(page).toHaveTitle("Meet the Team | SpandanAI");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "Leadership and team at SpandanAI."
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://spandanai.com/team");

  faults.assertClean();
});
