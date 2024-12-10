import { test, expect } from "@playwright/test";
import { baseConfig } from "../config/config";
import * as fs from "fs";
import * as path from "path";

const url: string[] = ["/server"];

const selectors = {
  serverContainer: ".xc-container-2 .relative.p-40px",
  serverName: 'a[href^="/server/"]',
  plusTagButton: "h6.text-base.text-primary-dark",
  mainTag:
    "span.text-base.tablet\\:text-sm.text-secondary-full.dark\\:text-mode-secondary-light.rounded-md",
  ipAddress: ".tooltipWrapper span.cursor-pointer",
  additionalTagsContainer:
    ".tooltipWrapper.text-xs.cursor-pointer .tooltipContent span",
} as const;

interface ServerWithDeleteTag {
  name: string;
  ipAddress: string;
  mainTag: string;
  additionalTags: string;
}

test("Collect IPs of servers with delete tag", async ({ page }) => {
  const serversToDelete: ServerWithDeleteTag[] = [];

  try {
    await page.goto(url[0]);
    await page.waitForLoadState("networkidle");

    // Wait for containers
    await page.waitForSelector(selectors.serverContainer, {
      state: "visible",
      timeout: 10000,
    });

    const serverContainers = page.locator(selectors.serverContainer);
    const count = await serverContainers.count();
    console.log(`\nScanning ${count} servers for delete tags...`);

    // Check each server
    for (let i = 0; i < count; i++) {
      const container = serverContainers.nth(i);
      await container.waitFor({ state: "visible", timeout: 5000 });

      // Get server information
      const serverName =
        (await container.locator(selectors.serverName).textContent()) ||
        "Unknown";

      const ipAddress =
        (await container.locator(selectors.ipAddress).first().textContent()) ||
        "No IP";

      const mainTag =
        (await container.locator(selectors.mainTag).textContent()) || "";

      // Check additional tags
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

      // Check for delete in tags
      if (
        additionalTags.toLowerCase().includes("delete") ||
        mainTag.toLowerCase().includes("delete")
      ) {
        console.log(`\nFound server with delete tag:`);
        console.log(`Name: ${serverName.trim()}`);
        console.log(`IP: ${ipAddress.trim()}`);
        console.log(`Tags: ${mainTag.trim()} ${additionalTags.trim()}`);

        serversToDelete.push({
          name: serverName.trim(),
          ipAddress: ipAddress.trim(),
          mainTag: mainTag.trim(),
          additionalTags: additionalTags.trim(),
        });
      }
    }

    // Save to JSON file
    const filePath = path.join(__dirname, "delete-server-ip.json");
    fs.writeFileSync(filePath, JSON.stringify(serversToDelete, null, 2));

    console.log(`\nSummary:`);
    console.log(`Total servers scanned: ${count}`);
    console.log(`Servers with delete tag: ${serversToDelete.length}`);
    console.log(`IPs saved to: ${filePath}`);
  } catch (error) {
    console.error("Error during test execution:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    throw error;
  }
});
