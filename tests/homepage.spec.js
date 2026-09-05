import { expect, test } from "@playwright/test";
import { collectPageFaults } from "./helpers.js";

test("homepage smoke: renders header, H1, and primary CTA", async ({ page }) => {
  const faults = collectPageFaults(page);

  await page.goto("/");

  await expect(page).toHaveTitle(/SpandanAI/);
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
  const primaryNav = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(primaryNav.getByRole("link", { name: "Home", exact: true })).toBeVisible();
  await expect(primaryNav.getByRole("link", { name: "Use Cases", exact: true })).toBeVisible();
  await expect(primaryNav.getByRole("link", { name: "Team", exact: true })).toBeVisible();
  await expect(primaryNav.getByRole("link", { name: "Contact", exact: true })).toBeVisible();

  const headings = page.getByRole("heading", { level: 1 });
  await expect(headings).toHaveCount(1);
  await expect(headings).toHaveText(/SpandanAI/);

  await expect(page.getByRole("link", { name: "Explore Use Cases" })).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(2);

  faults.assertClean();
});
