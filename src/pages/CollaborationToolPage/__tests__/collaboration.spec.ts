import { test, expect } from "@playwright/test";

test.describe("Collaboration Tool", () => {
  test.skip("navigate and toggle views", async ({ page }) => {
    await page.goto("/dashboard/collaboration-tool");
    await expect(page.getByText("Document Editor")).toBeVisible();
    await expect(page.getByText("Comments and activity")).toBeVisible();
    await page.getByRole("button", { name: "Action Log" }).click();
    await expect(page.getByText("Log")).toBeVisible();
  });
});

