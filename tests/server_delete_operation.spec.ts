import { test, expect } from "@playwright/test";
import { baseConfig } from "../config/config";

const url: string[] = ["/server"];

test("Navigate and analyze server page", async ({ page }) => {
  // Navigate to server page
  await page.goto("/server");
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveTitle(/Servers/);

  try {
    // Get and count all server containers
    const serverContainers = page.locator(".xc-container-2 .relative.p-40px");
    const count = await serverContainers.count();
    console.log(`Total number of servers found: ${count}`);

    // Wait for containers to be visible
    await page.waitForSelector(".xc-container-2 .relative.p-40px", {
      timeout: 10000,
    });

    // Check each server
    for (let i = 0; i < count; i++) {
      const container = serverContainers.nth(i);
      await container.waitFor({ state: "visible", timeout: 5000 });

      // Get server name
      const serverName: string | null = await container
        .locator('a[href^="/server/"]')
        .textContent({ timeout: 5000 });

      // Check for +2 tags
      const plusTag = container.locator("h6.text-base.text-primary-dark");
      if ((await plusTag.count()) > 0) {
        await plusTag.hover();
        await page.waitForTimeout(500);
      }
      // Get tags content
      const mainTag: string =
        (await container
          .locator(".text-secondary-full >> text=/# .*/")
          .textContent({ timeout: 5000 })
          .catch(() => null)) || "";

      // Get tooltip content
      const tooltipContent: string =
        (await container
          .locator(".tooltipContent >> text=/.*delete.*/i")
          .textContent({ timeout: 5000 })
          .catch(() => null)) || "";

      // Check for delete tags
      if (
        (tooltipContent && tooltipContent.toLowerCase().includes("delete")) ||
        (mainTag && mainTag.toLowerCase().includes("delete"))
      ) {
        console.log("\nServer with delete tag found:");
        console.log(
          `Server Name: ${serverName ? serverName.trim() : "Unknown"}`
        );
        console.log(
          `Visible Tag: ${mainTag ? mainTag.trim() : "No visible tag"}`
        );
        console.log(
          `Additional Tags: ${
            tooltipContent ? tooltipContent.trim() : "No additional tags"
          }`
        );
      }
    }

    // Log total server count
    console.log(`\nTotal Servers Available: ${count}`);
  } catch (error) {
    console.error("Error during test execution:", error);
    throw error;
  }
});
