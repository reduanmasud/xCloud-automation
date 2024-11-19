import { test, expect } from "@playwright/test";
import { baseConfig } from "../config/config";

const url: string[] = ["/server"];
const targetIP = "5.75.161.167"; // Single IP to focus on

test("Debug server deletion process", async ({ page }) => {
  console.log("🚀 Starting server deletion debug process");
  console.log(`🎯 Target IP: ${targetIP}`);

  await page.goto(url[0]);
  await page.waitForLoadState("networkidle");
  console.log("✅ Navigated to server page");

  try {
    // Wait for and verify server container
    await page.waitForSelector(".xc-container-2 .relative.p-40px");
    const container = page
      .locator(".xc-container-2 .relative.p-40px")
      .filter({
        has: page.locator(
          `.tooltipWrapper span.cursor-pointer:text("${targetIP}")`
        ),
      })
      .first();

    // Verify server exists
    const exists = (await container.count()) > 0;
    if (!exists) {
      throw new Error(`❌ Server with IP ${targetIP} not found`);
    }
    console.log("✅ Found target server container");

    // Get server name for logging
    const serverName = await container
      .locator('a[href^="/server/"]')
      .textContent();
    console.log(`📝 Server name: ${serverName?.trim()}`);

    // Click menu button
    await container.locator("i.xcloud.xc-menu-vertical").click();
    console.log("✅ Clicked menu button");
    await page.waitForTimeout(500);

    // Click delete option
    await page.getByRole("menuitem", { name: "Delete Server" }).click();
    console.log("✅ Clicked delete server option");

    // Enable provider deletion
    await page
      .locator("label")
      .filter({ hasText: "Enable this to delete this" })
      .locator("span")
      .first()
      .click();
    console.log("✅ Enabled provider deletion");

    // Get confirmation text
    const confirmLabel = await page
      .getByText("Type", { exact: false })
      .textContent();
    const serverNameToConfirm = confirmLabel
      ?.split("Type ")[1]
      .split(" to confirm")[0];
    console.log(`📝 Server name to confirm: ${serverNameToConfirm}`);

    // Fill confirmation
    const inputField = page.getByPlaceholder("Type server name to confirm");
    await inputField.click();
    await inputField.fill(serverNameToConfirm || "");
    console.log("✅ Filled confirmation input");

    // Verify confirmation text
    const inputValue = await inputField.inputValue();
    if (inputValue === serverNameToConfirm) {
      console.log("✅ Confirmation text verified");
    } else {
      console.log("⚠️ Confirmation text mismatch");
      console.log(`Expected: ${serverNameToConfirm}`);
      console.log(`Got: ${inputValue}`);
    }

    console.log("\n🔍 Final Status:");
    console.log("- Target IP found and selected");
    console.log("- Delete modal opened");
    console.log("- Provider deletion enabled");
    console.log("- Confirmation text entered");
    console.log("- Ready for final deletion (button not clicked)");

    // Final deletion button - commented out by default
    // await page.getByRole('button', { name: 'Delete' }).click();
    // console.log("✅ Clicked final delete button");
    // await page.waitForLoadState('networkidle');
    // console.log("✅ Server deletion completed");

    // Add Playwright debugger
    console.log("\n🔍 Pausing for debug inspection...");
    await page.pause();
  } catch (error) {
    console.error("\n❌ Error during deletion process:");
    if (error instanceof Error) {
      console.error(`Error message: ${error.message}`);
    }
    throw error;
  }
});
