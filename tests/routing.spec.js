import { expect, test } from "@playwright/test";
import { collectPageFaults } from "./helpers.js";

test("representative routing, direct /team load, and back/forward remain functional", async ({ page }) => {
  const faults = collectPageFaults(page);
  const primaryNav = page.getByRole("navigation", { name: "Primary navigation" });

  await page.goto("/");
  await page.getByRole("link", { name: "Meet the Team" }).click();
  await expect(page).toHaveURL(/\/team$/);

  await primaryNav.getByRole("link", { name: "Home", exact: true }).click();
  await expect(page).toHaveURL(/\/(?:#home)?$/);

  await page.goto("/team");
  await primaryNav.getByRole("link", { name: "Use Cases", exact: true }).click();
  await expect(page).toHaveURL(/\/#use-cases$/);
  await expect(page.locator("#use-cases")).toBeVisible();

  await page.goto("/team");
  await primaryNav.getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page).toHaveURL(/\/#contact$/);
  await expect(page.locator("#contact")).toBeVisible();

  await page.goto("/team");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Meet the Team/);

  await page.goBack();
  await expect(page).toHaveURL(/\/#contact$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/team$/);

  faults.assertClean();
});
