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

test("electrical overlay is scoped to the homepage Hero and absent on /team", async ({ page }) => {
  const faults = collectPageFaults(page);

  await page.goto("/");
  const hero = page.locator("#home");
  const overlay = page.locator("[data-electrical-overlay='hero']");
  await expect(hero.locator("canvas")).toHaveCount(2);
  await expect(overlay).toHaveCount(1);
  await expect(hero.locator("[data-electrical-overlay='hero']")).toHaveCount(1);
  await expect(page.locator("#use-cases canvas")).toHaveCount(0);
  await expect(page.locator("#team canvas")).toHaveCount(0);

  const overlapUseCases = await page.evaluate(() => {
    const overlayEl = document.querySelector("[data-electrical-overlay='hero']");
    const useCases = document.getElementById("use-cases");
    if (!overlayEl || !useCases) return -1;
    const a = overlayEl.getBoundingClientRect();
    const b = useCases.getBoundingClientRect();
    const height = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    const width = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
    return height * width;
  });
  expect(overlapUseCases).toBe(0);

  await page.locator("#use-cases").scrollIntoViewIfNeeded();
  const overlapAfterScroll = await page.evaluate(() => {
    const overlayEl = document.querySelector("[data-electrical-overlay='hero']");
    const useCases = document.getElementById("use-cases");
    if (!overlayEl || !useCases) return -1;
    const a = overlayEl.getBoundingClientRect();
    const b = useCases.getBoundingClientRect();
    const height = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    const width = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
    return height * width;
  });
  expect(overlapAfterScroll).toBe(0);

  await page.getByRole("link", { name: "Meet the Team" }).click();
  await expect(page).toHaveURL(/\/team$/);
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator("[data-electrical-overlay]")).toHaveCount(0);

  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Home", exact: true }).click();
  await expect(page).toHaveURL(/\/(?:#home)?$/);
  await expect(page.locator("#home canvas")).toHaveCount(2);
  await expect(page.locator("[data-electrical-overlay='hero']")).toHaveCount(1);

  await page.goto("/team");
  await expect(page.locator("canvas")).toHaveCount(0);

  faults.assertClean();
});
