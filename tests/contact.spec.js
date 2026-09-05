import { expect, test } from "@playwright/test";
import { collectPageFaults, CONTACT_EMAIL } from "./helpers.js";

test("Contact section exposes form controls and email actions without sending mail", async ({ page, context }) => {
  const faults = collectPageFaults(page);

  await page.goto("/#contact");
  const contact = page.locator("#contact");
  await expect(contact).toBeVisible();

  await expect(contact.getByLabel("Name")).toBeVisible();
  await expect(contact.getByLabel("Email")).toBeVisible();
  await expect(contact.getByLabel("Organization / Company")).toBeVisible();
  await expect(contact.getByLabel("Message")).toBeVisible();
  await expect(contact.getByRole("button", { name: "Contact Team" })).toBeVisible();
  await expect(contact.getByRole("link", { name: "Email Us" })).toBeVisible();
  await expect(contact.getByRole("button", { name: "Copy" })).toBeVisible();

  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await contact.getByRole("button", { name: "Copy" }).click();
  await expect(contact.getByRole("button", { name: "Copied ✓" })).toBeVisible();
  await expect.poll(async () => page.evaluate(() => navigator.clipboard.readText())).toBe(CONTACT_EMAIL);

  faults.assertClean();
});
