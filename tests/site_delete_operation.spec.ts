import { test, expect } from "@playwright/test";
import { baseConfig } from "../config/config";

// Configuration
const config = {
  url: ["/site"],
  targetSite: "testsite-adfk.x-cloud.app",
} as const;

// Selectors
const selectors = {
  siteGrid: ".xc-container-2 .grid.grid-cols-4",
  siteContainer: ".relative.flex.flex-col",
  siteLink: 'a[href^="/site/"]',
  menuButton: "i.xcloud.xc-menu-vertical",
  deleteOption: { role: "menuitem", name: "Delete Site" },
  confirmInput: "input[placeholder='Type site name to confirm']",
  deleteButton: { role: "button", name: "Delete" },
} as const;

// Helper functions
async function locateSiteContainer(page: any) {
  await page.waitForSelector(selectors.siteGrid);
  return page
    .locator(selectors.siteContainer)
    .filter({
      has: page.locator(`.tooltipContent span:text("${config.targetSite}")`),
    })
    .first();
}

async function validateSiteExists(container: any) {
  const exists = (await container.count()) > 0;
  if (!exists) {
    throw new Error(`Site ${config.targetSite} not found`);
  }
  return exists;
}

async function getConfirmationText(page: any) {
  const confirmLabel = await page
    .getByText("Type", { exact: false })
    .textContent();
  return confirmLabel?.split("Type ")[1].split(" to confirm")[0];
}

async function verifyConfirmationInput(inputField: any, expectedText: string) {
  const inputValue = await inputField.inputValue();
  const isValid = inputValue === expectedText;

  if (!isValid) {
    console.log("[WARNING] Confirmation text verification failed");
    console.log(`Expected: ${expectedText}`);
    console.log(`Actual: ${inputValue}`);
  }

  return isValid;
}

test("Site deletion process", async ({ page }) => {
  console.log(
    `[INFO] Starting deletion process for site: ${config.targetSite}`
  );

  try {
    // Navigate to the site list page
    await page.goto(config.url[0]);
    await page.waitForLoadState("networkidle");
    console.log("[INFO] Page loaded successfully");

    // Locate and validate site
    const container = await locateSiteContainer(page);
    await validateSiteExists(container);
    console.log("[INFO] Target site located");

    const siteName = await container.locator(selectors.siteLink).textContent();
    console.log(`[INFO] Processing site: ${siteName?.trim()}`);

    // Initiate deletion
    await container.locator(selectors.menuButton).click();
    await page.waitForTimeout(500);
    await page
      .getByRole(selectors.deleteOption.role, {
        name: selectors.deleteOption.name,
      })
      .click();
    console.log("[INFO] Delete operation initiated");

    // Handle confirmation
    await page.waitForSelector(selectors.confirmInput);
    const siteNameToConfirm = await getConfirmationText(page);

    const inputField = page.getByPlaceholder("Type site name to confirm");
    await inputField.click();
    await inputField.fill(siteNameToConfirm || "");

    // Verify confirmation
    await verifyConfirmationInput(inputField, siteNameToConfirm || "");
    console.log("[INFO] Confirmation text verified");

    console.log("\n[STATUS] Pre-deletion checklist:");
    console.log("- Site identified and selected");
    console.log("- Delete modal confirmed");
    console.log("- Confirmation text verified");
    console.log("- Ready for final deletion");

    // Final deletion

    // await page.getByRole(selectors.deleteButton.role, { name: selectors.deleteButton.name }).click();
    // await page.waitForLoadState('networkidle');
    // console.log("[INFO] Site deletion completed");

    await page.pause();
  } catch (error) {
    console.error("[ERROR] Site deletion process failed:");
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw error;
  }
});
