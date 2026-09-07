import { expect, test } from "@playwright/test";
import { collectPageFaults, LEADERSHIP_NAMES } from "./helpers.js";

test("homepage leadership shows four approved leaders and Meet the Team routes to /team", async ({ page }) => {
  const faults = collectPageFaults(page);

  await page.goto("/");
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Team", exact: true }).click();

  const leadership = page.locator("#team");
  await expect(leadership).toBeVisible();

  for (const name of LEADERSHIP_NAMES) {
    await expect(leadership.getByRole("heading", { name, exact: true })).toHaveCount(1);
  }
  await expect(leadership.getByRole("article")).toHaveCount(4);

  const meetTheTeam = leadership.getByRole("link", { name: "Meet the Team" });
  await expect(meetTheTeam).toBeVisible();
  const ctaAboveCards = await leadership.evaluate((section) => {
    const cta = [...section.querySelectorAll("a")].find((link) => link.textContent.includes("Meet the Team"));
    const card = section.querySelector("article");
    if (!cta || !card) return false;
    const ctaTop = cta.getBoundingClientRect().top + window.scrollY;
    const cardTop = card.getBoundingClientRect().top + window.scrollY;
    return ctaTop < cardTop;
  });
  expect(ctaAboveCards).toBe(true);

  await meetTheTeam.click();
  await expect(page).toHaveURL(/\/team$/);

  faults.assertClean();
});

test("team page loads directly with four leadership cards and no extra members", async ({ page }) => {
  const faults = collectPageFaults(page);

  await page.goto("/team");

  await expect(page).toHaveURL(/\/team$/);
  const headings = page.getByRole("heading", { level: 1 });
  await expect(headings).toHaveCount(1);
  await expect(headings).toHaveText(/Meet the Team/);
  await expect(page.getByRole("heading", { name: "The SpandanAI Team" })).toBeVisible();

  for (const name of LEADERSHIP_NAMES) {
    await expect(page.getByRole("heading", { name, exact: true })).toHaveCount(1);
  }
  await expect(page.getByRole("article")).toHaveCount(4);
  await expect(page.getByRole("heading", { name: "Team Members" })).toHaveCount(0);

  await expect(page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Team", exact: true })).toHaveAttribute(
    "aria-current",
    "page"
  );
  await expect(page.getByRole("contentinfo")).toBeVisible();

  faults.assertClean();
});
