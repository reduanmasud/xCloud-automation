import { test, expect } from "@playwright/test";
import { baseConfig } from "../config/config";

const url: string[] = ["/server"];

// Enhanced selectors with more specific paths
const selectors = {
  serverContainer: ".xc-container-2 .relative.p-40px",
  serverName: 'a[href^="/server/"]',
  plusTagButton: "h6.text-base.text-primary-dark",
  mainTag:
    "span.text-base.tablet\\:text-sm.text-secondary-full.dark\\:text-mode-secondary-light.rounded-md",
  ipAddress: ".tooltipWrapper span.cursor-pointer",
  location: "span.fi-de",
  serverType: '.tooltipWrapper:has-text("Self Managed")',
  provisionStatus: "i.xcloud.xc-tick-o",
  storage: '.text-sm:has-text("Storage") + span.text-xs',
  ram: '.text-sm:has-text("Ram") + span.text-xs',
  menuButton: "i.xcloud.xc-menu-vertical",
  additionalTagsContainer:
    ".tooltipWrapper.text-xs.cursor-pointer .tooltipContent span",
} as const;

interface ServerData {
  name: string;
  ipAddress: string;
  location: string;
  serverType: string;
  storage: string;
  ram: string;
  status: string;
  visibleTag: string;
  additionalTags: string;
  hasDeleteTag: boolean;
}

test("Navigate and analyze server page", async ({ page }) => {
  await page.goto(url[0]);
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveTitle(/Servers/);

  try {
    await page.waitForSelector(selectors.serverContainer, {
      state: "visible",
      timeout: 10000,
    });

    const serverContainers = page.locator(selectors.serverContainer);
    const count = await serverContainers.count();
    console.log(`Total number of servers found: ${count}`);

    for (let i = 0; i < count; i++) {
      const container = serverContainers.nth(i);
      await container.waitFor({ state: "visible", timeout: 5000 });

      // Get server name
      const serverName =
        (await container.locator(selectors.serverName).textContent()) ||
        "Unknown";

      // Get IP Address
      const ipAddress =
        (await container.locator(selectors.ipAddress).first().textContent()) ||
        "No IP";

      // Get Location
      const location = await container
        .locator(selectors.location)
        .isVisible()
        .then((visible) => (visible ? "DE" : "Unknown"));

      // Get Server Type
      const serverType =
        (await container.locator(selectors.serverType).textContent()) ||
        "Unknown Type";

      // Get Status
      const status = await container
        .locator(selectors.provisionStatus)
        .isVisible()
        .then((visible) => (visible ? "Provisioned" : "Not Provisioned"));

      // Get Resource Usage
      const storage =
        (await container.locator(selectors.storage).textContent()) ||
        "Storage N/A";

      const ram =
        (await container.locator(selectors.ram).textContent()) || "RAM N/A";

      // Get Tags
      const visibleTag =
        (await container.locator(selectors.mainTag).textContent()) || "";

      // Handle Additional Tags
      let additionalTags = "";
      const plusTag = container.locator(selectors.plusTagButton);
      if ((await plusTag.count()) > 0) {
        await plusTag.hover();
        await page.waitForTimeout(500);
        additionalTags =
          (await container
            .locator(selectors.additionalTagsContainer)
            .last()
            .textContent()) || "";
      }

      // Check for delete tags
      const hasDeleteTag =
        additionalTags.toLowerCase().includes("delete") ||
        visibleTag.toLowerCase().includes("delete");

      // Log server information
      console.log("\n=== Server Details ===");
      console.log(`Name: ${serverName.trim()}`);
      console.log(`IP Address: ${ipAddress.trim()}`);
      console.log(`Location: ${location}`);
      console.log(`Type: ${serverType.trim()}`);
      console.log(`Status: ${status}`);
      console.log(`Storage: ${storage.trim()}`);
      console.log(`RAM: ${ram.trim()}`);
      console.log(`Main Tag: ${visibleTag.trim()}`);
      console.log(`Additional Tags: ${additionalTags.trim()}`);
      console.log(`Has Delete Tag: ${hasDeleteTag}`);
      console.log("=====================");
    }
  } catch (error) {
    console.error("Error during test execution:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    throw error;
  }
});
