import { expect, test } from "@playwright/test";
import { collectPageFaults, LEADERSHIP_LINKEDIN, LEADERSHIP_NAMES } from "./helpers.js";

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

  const groupPhoto = page.getByRole("img", { name: "SpandanAI team", exact: true });
  const secondaryPhoto = page.getByRole("img", { name: "SpandanAI team group photo", exact: true });
  await expect(groupPhoto).toBeVisible();
  await expect(groupPhoto).toHaveAttribute("src", /\/images\/team\/team-photo\.webp$/);
  await expect(groupPhoto).toHaveAttribute("loading", "eager");
  await expect(secondaryPhoto).toBeVisible();
  await expect(secondaryPhoto).toHaveAttribute("src", /\/images\/team\/team-photo-2\.webp$/);
  await expect(secondaryPhoto).toHaveAttribute("loading", "lazy");
  await expect(page.getByText("Team photo", { exact: true })).toHaveCount(0);
  await expect(page.locator("canvas")).toHaveCount(0);

  const photoOrder = await page.evaluate(() => {
    const primary = document.querySelector('img[alt="SpandanAI team"]');
    const secondary = document.querySelector('img[alt="SpandanAI team group photo"]');
    const leadership = [...document.querySelectorAll("h2")].find((heading) =>
      heading.textContent.includes("Founding engineering")
    );
    if (!primary || !secondary || !leadership) return null;
    const top = (el) => el.getBoundingClientRect().top + window.scrollY;
    return {
      primaryBeforeSecondary: top(primary) < top(secondary),
      secondaryBeforeLeadership: top(secondary) < top(leadership)
    };
  });
  expect(photoOrder?.primaryBeforeSecondary).toBe(true);
  expect(photoOrder?.secondaryBeforeLeadership).toBe(true);

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
  await expect(page.getByRole("contentinfo")).toContainText("Designed by Korak Das");

  faults.assertClean();
});

test("leadership LinkedIn profiles match confirmed URLs on homepage and /team", async ({ page }) => {
  const faults = collectPageFaults(page);

  const assertLeadershipLinkedIn = async (scope) => {
    await expect(scope.getByRole("article")).toHaveCount(4);
    for (const profile of LEADERSHIP_LINKEDIN) {
      const link = scope.getByRole("link", { name: profile.label, exact: true });
      await expect(link).toHaveCount(1);
      await expect(link).toHaveAttribute("href", profile.href);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", /noopener/);
      await expect(link).toHaveAttribute("rel", /noreferrer/);
      const mappedToCard = await scope.evaluate((root, data) => {
        const heading = [...root.querySelectorAll("h3")].find((node) => node.textContent === data.name);
        return Boolean(heading?.closest("article")?.querySelector(`a[href="${data.href}"]`));
      }, { name: profile.name, href: profile.href });
      expect(mappedToCard).toBe(true);
    }
  };

  await page.goto("/");
  await assertLeadershipLinkedIn(page.locator("#team"));

  await page.goto("/team");
  await assertLeadershipLinkedIn(page.locator("#main-content"));
  await expect(page.getByRole("img", { name: "SpandanAI team", exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: "SpandanAI team group photo", exact: true })).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.getByRole("contentinfo")).toContainText("Designed by Korak Das");

  faults.assertClean();
});
