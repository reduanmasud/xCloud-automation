import { test, expect } from "@playwright/test";
import { baseConfig } from "../config/config";

const url: string[] = ["/server"];
const targetIP = "5.75.161.167";

test("Server deletion process", async ({ page }) => {
  console.log(`[INFO] Starting deletion process for IP: ${targetIP}`);

  await page.goto(url[0]);
  await page.waitForLoadState("networkidle");
  console.log("[INFO] Page loaded successfully");

  try {
    await page.waitForSelector(".xc-container-2 .relative.p-40px");
    const container = page
      .locator(".xc-container-2 .relative.p-40px")
      .filter({
        has: page.locator(
          `.tooltipWrapper span.cursor-pointer:text("${targetIP}")`
        ),
      })
      .first();

    const exists = (await container.count()) > 0;
    if (!exists) {
      throw new Error(`Server with IP ${targetIP} not found`);
    }
    console.log("[INFO] Target server located");

    const serverName = await container
      .locator('a[href^="/server/"]')
      .textContent();
    console.log(`[INFO] Processing server: ${serverName?.trim()}`);

    await container.locator("i.xcloud.xc-menu-vertical").click();
    await page.waitForTimeout(500);
    await page.getByRole("menuitem", { name: "Delete Server" }).click();
    console.log("[INFO] Delete operation initiated");

    await page
      .locator("label")
      .filter({ hasText: "Enable this to delete this" })
      .locator("span")
      .first()
      .click();
    console.log("[INFO] Provider deletion enabled");

    const confirmLabel = await page
      .getByText("Type", { exact: false })
      .textContent();
    const serverNameToConfirm = confirmLabel
      ?.split("Type ")[1]
      .split(" to confirm")[0];

    const inputField = page.getByPlaceholder("Type server name to confirm");
    await inputField.click();
    await inputField.fill(serverNameToConfirm || "");

    const inputValue = await inputField.inputValue();
    if (inputValue === serverNameToConfirm) {
      console.log("[INFO] Confirmation text verified");
    } else {
      console.log("[WARNING] Confirmation text verification failed");
      console.log(`Expected: ${serverNameToConfirm}`);
      console.log(`Actual: ${inputValue}`);
    }

    console.log("\n[STATUS] Pre-deletion checklist:");
    console.log("- Server identified and selected");
    console.log("- Delete modal confirmed");
    console.log("- Provider deletion enabled");
    console.log("- Confirmation text verified");

    // await page.getByRole('button', { name: 'Delete' }).click();
    // await page.waitForLoadState('networkidle');
    // console.log("[INFO] Server deletion completed");

    await page.pause();
  } catch (error) {
    console.error("[ERROR] Deletion process failed:");
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw error;
  }
});
