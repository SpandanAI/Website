import { expect, test } from "@playwright/test";
import { collectPageFaults } from "./helpers.js";

test.describe("mobile navigation at 390x844", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("hamburger opens and closes the mobile menu", async ({ page }) => {
    const faults = collectPageFaults(page);

    await page.goto("/");

    const hamburger = page.getByRole("button", { name: /navigation menu/ });
    await expect(hamburger).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toHaveCount(0);

    await hamburger.click();
    await expect(hamburger).toHaveAttribute("aria-expanded", "true");
    await expect(hamburger).toHaveAttribute("aria-controls", "mobile-navigation");

    const mobileNav = page.locator("#mobile-navigation");
    await expect(mobileNav).toBeVisible();
    await expect(mobileNav.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(mobileNav.getByRole("link", { name: "Use Cases" })).toBeVisible();
    await expect(mobileNav.getByRole("link", { name: "Team" })).toBeVisible();
    await expect(mobileNav.getByRole("link", { name: "Contact" })).toBeVisible();
    await expect(mobileNav.getByRole("link", { name: "Partner With Us" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator("#mobile-navigation")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Open navigation menu" })).toHaveAttribute("aria-expanded", "false");

    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await page.locator("#mobile-navigation").getByRole("link", { name: "Contact" }).click();
    await expect(page.locator("#mobile-navigation")).toHaveCount(0);
    await expect(page.locator("#contact")).toBeVisible();

    faults.assertClean();
  });

  test("Back to Top appears after scrolling and returns to the current page top", async ({ page }) => {
    const faults = collectPageFaults(page);

    await page.goto("/");
    await expect(page.getByRole("button", { name: "Back to top" })).toHaveCount(0);

    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.3));
    const backToTop = page.getByRole("button", { name: "Back to top" });
    await expect(backToTop).toBeVisible();
    await backToTop.click();
    await expect.poll(async () => page.evaluate(() => window.scrollY)).toBeLessThan(80);

    await page.goto("/team");
    await expect(page).toHaveURL(/\/team$/);
    await expect(page.getByRole("button", { name: "Back to top" })).toHaveCount(0);
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.3));
    await expect(page.getByRole("button", { name: "Back to top" })).toBeVisible();
    await page.getByRole("button", { name: "Back to top" }).click();
    await expect.poll(async () => page.evaluate(() => window.scrollY)).toBeLessThan(80);
    await expect(page).toHaveURL(/\/team$/);

    faults.assertClean();
  });
});

test.describe("navbar breakpoint", () => {
  test("767 is hamburger mode; 768 and 769 are desktop nav", async ({ page }) => {
    const faults = collectPageFaults(page);
    await page.goto("/");

    await page.setViewportSize({ width: 767, height: 900 });
    await expect(page.getByRole("button", { name: "Open navigation menu" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toHaveCount(0);
    await expect(page.locator("#mobile-navigation")).toHaveCount(0);

    await page.setViewportSize({ width: 768, height: 900 });
    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Open navigation menu" })).toHaveCount(0);
    await expect(page.locator("#mobile-navigation")).toHaveCount(0);

    await page.setViewportSize({ width: 769, height: 900 });
    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Open navigation menu" })).toHaveCount(0);
    await expect(page.locator("#mobile-navigation")).toHaveCount(0);

    faults.assertClean();
  });
});
