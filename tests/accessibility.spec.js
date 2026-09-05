import { expect, test } from "@playwright/test";
import { collectPageFaults } from "./helpers.js";

test("accessibility smoke: landmarks, skip link, labels, and mobile menu ARIA", async ({ page }) => {
  const faults = collectPageFaults(page);

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("main")).toHaveCount(1);
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Skip to main content" })).toHaveCount(1);
  await expect(page.getByRole("banner").getByRole("link", { name: "SpandanAI" })).toBeVisible();

  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to main content" });
  await expect(skip).toBeFocused();
  await skip.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  expect(new URL(page.url()).hash).not.toBe("#main-content");

  await page.goto("/#contact");
  const contact = page.locator("#contact");
  await expect(contact.getByLabel("Name")).toBeVisible();
  await expect(contact.getByLabel("Email")).toBeVisible();
  await expect(contact.getByLabel("Organization / Company")).toBeVisible();
  await expect(contact.getByLabel("Message")).toBeVisible();

  await page.goto("/team");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("main")).toHaveCount(1);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const hamburger = page.getByRole("button", { name: /navigation menu/ });
  await expect(hamburger).toHaveAttribute("aria-expanded", "false");
  await expect(hamburger).toHaveAttribute("aria-controls", "mobile-navigation");
  await hamburger.click();
  await expect(hamburger).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#mobile-navigation")).toBeVisible();

  faults.assertClean();
});

test("reduced motion: homepage renders without runtime errors", async ({ page }) => {
  const faults = collectPageFaults(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/SpandanAI/);
  await expect(page.locator("canvas")).toHaveCount(2);

  faults.assertClean();
});
