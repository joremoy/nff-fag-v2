import { test, expect } from "@playwright/test";

test("viewer route sends noindex metadata", async ({ page }) => {
  await page.goto("/dommerportal-nff");
  const robots = page.locator('meta[name="robots"]');
  await expect(robots).toHaveAttribute("content", /noindex/);
});
