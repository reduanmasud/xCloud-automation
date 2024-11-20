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
  // New selectors for Magic Login
  magicLoginBtn: "a.md\\:inline-flex[href*='remote-login']",
  wpDashboardTitle: "title:has-text('Dashboard')",
} as const;

test("Navigate to WordPress dashboard via Magic Login", async ({
  page,
  context,
}) => {
  try {
    const siteName = getSiteNameFromURL(targetSite);

    // Navigate to sites page and wait for content
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

    // Verify site exists
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

    // Wait for and click Magic Login button
    // This will open a new tab
    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      page.locator(selectors.magicLoginBtn).click(),
    ]);

    // Wait for WordPress dashboard to load in new tab
    await newPage.waitForLoadState("networkidle");
    await newPage.waitForSelector("body", { state: "visible" });

    // Verify we're on WordPress dashboard
    const pageTitle = await newPage.title();
    if (pageTitle.includes("Dashboard")) {
      console.log("Successfully logged into WordPress dashboard");
    }

    await newPage.pause();
  } catch (error) {
    console.error(
      `Operation failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    throw error;
  }
});
