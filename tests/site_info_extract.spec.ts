import { test, expect } from "@playwright/test";
import { baseConfig } from "../config/config";

const targetSite = "testsite-adfk.x-cloud.app";

interface SiteInfo {
  ipAddress: string;
  wordpressVersion: string;
  phpVersion: string;
  siteUser: string;
  siteSize: string;
  updates: string;
}

const selectors = {
  // More specific selectors targeting the info panel
  infoPanel: ".flex.py-20px.divide-x-2",
  ipSection: 'h4:has-text("IP Address") + h5 span.cursor-pointer',
  wordpressSection: 'h4:has-text("WordPress") + h5 a',
  phpSection: 'h4:has-text("PHP") + h5 a',
  siteUserSection: 'h4:has-text("Site User") + h5 a',
  sizeSection: 'h4:has-text("Size") + h5 a',
  updatesSection: 'h4:has-text("Updates") + a h5',
} as const;

test("Verify site information panel data", async ({ page }) => {
  try {
    // Navigate to site dashboard
    await page.goto("/site");
    const siteName = getSiteNameFromURL(targetSite);

    // Click on site to go to dashboard
    const siteCard = page
      .locator(".relative.flex.flex-col.p-30px")
      .filter({
        has: page.locator(".tooltipContent span").filter({
          hasText: siteName,
        }),
      })
      .first();

    await Promise.all([
      siteCard.locator('a[href^="/site/"]').click(),
      page.waitForNavigation({ waitUntil: "networkidle" }),
    ]);

    // Wait for info panel to be visible
    await page.waitForSelector(selectors.infoPanel, { state: "visible" });

    // Extract all information with better error handling
    const siteInfo = await extractSiteInfo(page);

    // Log the extracted information
    console.log("\nSite Information Panel Data:");
    console.log("--------------------------");
    console.log(`IP Address: ${siteInfo.ipAddress}`);
    console.log(`WordPress Version: ${siteInfo.wordpressVersion}`);
    console.log(`PHP Version: ${siteInfo.phpVersion}`);
    console.log(`Site User: ${siteInfo.siteUser}`);
    console.log(`Site Size: ${siteInfo.siteSize}`);
    console.log(`Updates Available: ${siteInfo.updates}`);

    // Verify data validity
    expect(siteInfo.ipAddress).toMatch(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
    expect(siteInfo.wordpressVersion).toMatch(/^\d+\.\d+$/);
    expect(siteInfo.phpVersion).toMatch(/^\d+\.\d+$/);
    expect(siteInfo.siteUser).toContain(siteName.split("-")[0]);
    expect(parseFloat(siteInfo.siteSize)).toBeGreaterThan(0);
    expect(parseInt(siteInfo.updates) || 0).toBeGreaterThanOrEqual(0);

    // await page.pause();
  } catch (error) {
    console.error("Error during site info verification:", error);
    throw error;
  }
});

async function extractSiteInfo(page: any): Promise<SiteInfo> {
  const info: SiteInfo = {
    ipAddress: "N/A",
    wordpressVersion: "N/A",
    phpVersion: "N/A",
    siteUser: "N/A",
    siteSize: "N/A",
    updates: "N/A",
  };

  try {
    // Extract each piece of information with individual error handling
    info.ipAddress = await page
      .locator(selectors.ipSection)
      .textContent()
      .then((text: string | null) => text?.trim() || "N/A")
      .catch(() => "N/A");

    info.wordpressVersion = await page
      .locator(selectors.wordpressSection)
      .textContent()
      .then((text: string | null) => text?.trim() || "N/A")
      .catch(() => "N/A");

    info.phpVersion = await page
      .locator(selectors.phpSection)
      .textContent()
      .then((text: string | null) => text?.trim() || "N/A")
      .catch(() => "N/A");

    info.siteUser = await page
      .locator(selectors.siteUserSection)
      .textContent()
      .then((text: string | null) => text?.trim() || "N/A")
      .catch(() => "N/A");

    info.siteSize = await page
      .locator(selectors.sizeSection)
      .textContent()
      .then((text: string | null) => text?.trim() || "N/A")
      .catch(() => "N/A");

    info.updates = await page
      .locator(selectors.updatesSection)
      .textContent()
      .then((text: string | null) => text?.trim() || "0")
      .catch(() => "0");
  } catch (error) {
    console.error("Error extracting site information:", error);
  }

  return info;
}

function getSiteNameFromURL(url: string): string {
  return url.split(".")[0];
}
