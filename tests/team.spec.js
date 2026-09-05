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

  await page.getByRole("link", { name: "Meet the Team" }).click();
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
