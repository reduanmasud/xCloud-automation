import { test, expect } from "@playwright/test";
import { baseConfig } from "../config/config";

const targetSite = "boxbox-9fi7.x-cloud.app";

function getSiteNameFromURL(url: string): string {
  return url.split(".")[0];
}

const selectors = {
  sitesGrid: "div[data-v-64177c1d] > .grid.grid-cols-4",
  siteCard: ".relative.flex.flex-col.p-30px",
  dashboardLink: "a.inline-flex.items-center.text-dark[href^='/site/']",
  magicLoginBtn: "a.md\\:inline-flex[href*='remote-login']",
  visitSiteLink: "a[href*='x-cloud.app']:has-text('Visit Site')",
  wpDashboardTitle: "title:has-text('Dashboard')",
} as const;

test("Check site accessibility", async ({ page, context }) => {
  try {
    const siteName = getSiteNameFromURL(targetSite);

    // Navigate to sites page
    await Promise.all([
      page.goto("/site"),
      page.waitForSelector(selectors.sitesGrid, {
        state: "visible",
        timeout: 5000,
      }),
    ]);

    // Find and click site card
    const siteCard = page
      .locator(selectors.siteCard)
      .filter({
        has: page.locator(".tooltipContent span").filter({
          hasText: siteName,
        }),
      })
      .first();

    const exists = await siteCard.count();
    if (exists === 0) {
      throw new Error(`Site ${targetSite} not found`);
    }

    // Navigate to site dashboard
    await Promise.all([
      siteCard.locator(selectors.dashboardLink).click(),
      page.waitForNavigation({ waitUntil: "networkidle" }),
    ]);

    console.log(`Navigated to ${targetSite} dashboard`);

    // Get Visit Site link and verify URL
    const visitSiteLink = page.locator(selectors.visitSiteLink);
    const siteUrl = await visitSiteLink.getAttribute("href");

    if (!siteUrl) {
      throw new Error("Site URL not found");
    }

    // Create new page for status check
    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      visitSiteLink.click(),
    ]);

    // Wait for response to check status
    const response = await newPage.waitForLoadState("domcontentloaded");
    const status = newPage.url().includes("x-cloud.app")
      ? await newPage.evaluate(() =>
          fetch(window.location.href).then((r) => r.status)
        )
      : null;

    // Log results
    console.log("\nSite Accessibility Check:");
    console.log(`URL: ${siteUrl}`);
    console.log(`Status Code: ${status}`);

    if (status === 200) {
      console.log("Site is accessible");
    } else {
      console.log(`Site returned status code: ${status}`);
    }

    // Additional verification
    const pageTitle = await newPage.title();
    console.log(`Page Title: ${pageTitle}`);

    // await newPage.pause();
  } catch (error) {
    console.error(
      `Operation failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    throw error;
  }
});
