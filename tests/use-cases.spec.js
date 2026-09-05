import { expect, test } from "@playwright/test";
import { collectPageFaults } from "./helpers.js";

test("Use Cases section has exactly five cards including Cryo-CMOS", async ({ page }) => {
  const faults = collectPageFaults(page);

  await page.goto("/");
  await page.getByRole("link", { name: "Explore Use Cases" }).click();

  const section = page.locator("#use-cases");
  await expect(section).toBeVisible();
  await expect(section.getByText("Use Cases", { exact: true })).toBeVisible();
  await expect(section.getByRole("article")).toHaveCount(5);
  await expect(section.getByText("Cryo-CMOS for AI assisted Quantum circuits")).toBeVisible();

  faults.assertClean();
});
