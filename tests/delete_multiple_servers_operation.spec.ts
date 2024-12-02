import { test, expect } from "@playwright/test";
import { baseConfig } from "../config/config";
import * as fs from "fs";
import * as path from "path";

const url: string[] = ["/server"];

const selectors = {
  serverContainer: ".xc-container-2 .relative.p-40px",
  serverName: 'a[href^="/server/"]',
  menuButton: "i.xcloud.xc-menu-vertical",
  ipAddress: ".tooltipWrapper span.cursor-pointer",
  deleteOption: { role: "menuitem", name: "Delete Server" },
  confirmInput: "input[placeholder='Type server name to confirm']",
  enableDeleteCheckbox: 'label:has-text("Enable this to delete this")',
  deleteButton: { role: "button", name: "Delete" }, // Added for reference
} as const;

interface ServerToDelete {
  name: string;
  ipAddress: string;
  mainTag: string;
  additionalTags: string;
}

// Read servers from JSON
const serversData: ServerToDelete[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, "delete-server-ip.json"), "utf-8")
);

// Run tests in parallel
test.describe.configure({ mode: "parallel" });

for (const serverData of serversData) {
  test(`Prepare deletion for server: ${serverData.name} (${serverData.ipAddress})`, async ({
    page,
  }) => {
    console.log(`\nStarting deletion process for IP: ${serverData.ipAddress}`);

    try {
      await page.goto(url[0]);
      await page.waitForLoadState("networkidle");

      // Find server by IP
      const container = page
        .locator(selectors.serverContainer)
        .filter({
          has: page.locator(selectors.ipAddress).filter({
            hasText: serverData.ipAddress,
          }),
        })
        .first();

      // Verify server exists
      const exists = await container.count();
      if (!exists) {
        throw new Error(`Server with IP ${serverData.ipAddress} not found`);
      }
      console.log("Server located successfully");

      // Click menu and select delete
      await container.locator(selectors.menuButton).click();
      await page.waitForTimeout(500);
      await page
        .getByRole(selectors.deleteOption.role, {
          name: selectors.deleteOption.name,
        })
        .click();

      // Handle the confirmation process
      await page.waitForSelector(selectors.confirmInput);

      // Enable provider deletion
      await page
        .locator(selectors.enableDeleteCheckbox)
        .locator("span")
        .first()
        .click();

      // Get confirmation text
      const confirmLabel = await page
        .getByText("Type", { exact: false })
        .textContent();
      const serverNameToConfirm = confirmLabel
        ?.split("Type ")[1]
        .split(" to confirm")[0];

      // Fill confirmation
      const inputField = page.getByPlaceholder("Type server name to confirm");
      await inputField.click();
      await inputField.fill(serverNameToConfirm || "");

      // Verify confirmation text
      const inputValue = await inputField.inputValue();
      if (inputValue === serverNameToConfirm) {
        console.log("Confirmation text verified");
      } else {
        console.log("Warning: Confirmation text mismatch");
        console.log(`Expected: ${serverNameToConfirm}`);
        console.log(`Got: ${inputValue}`);
      }

      console.log("\nDeletion preparation complete for:");
      console.log(`Server: ${serverData.name}`);
      console.log(`IP: ${serverData.ipAddress}`);
      console.log("Ready for final deletion");

      // Final deletion button
      // To delete, uncomment the following lines:
      // await page.getByRole(selectors.deleteButton.role, {
      //   name: selectors.deleteButton.name
      // }).click();
      // await page.waitForLoadState('networkidle');
      // console.log("Server deletion completed");

      await page.pause();
    } catch (error) {
      console.error(`Error processing server ${serverData.ipAddress}:`, error);
      throw error;
    }
  });
}
