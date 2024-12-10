import { test, expect } from "@playwright/test";
import {
  DBEngine,
  ServerManager,
  ServerProvider,
  ServerType,
} from "../POM/Classes/ServerManager.class";
import { Server } from "../POM/Classes/Server/Server.class";

// Types and Interfaces
interface ServerTypeConfig {
  nginx?: string;
  ols?: string;
}

interface ServerConfigs {
  [provider: string]: ServerTypeConfig;
}

// Debug logging
const DEBUG = true;
const log = (message: string) => DEBUG && console.log(`[DEBUG] ${message}`);

// Site configurations
const nginxSites = [
  {
    displayVersion: "PHP81Nginx",
    phpVersion: "8.1",
    wordPressVersion: "latest",
  },
];

const olsSites = [];

// Server configurations
const serverConfigs: ServerConfigs = {
  vultr: {
    nginx: "2808",
  },
};

let page;

// Main test suite
test("Site Creation Tests", async ({ browser }) => {
  const servers: { [key: string]: Server } = {};

  // Setup
  const context = await browser.newContext();
  page = await context.newPage();
  await page.waitForLoadState("domcontentloaded");
  log("Browser page created");

  // Initialize servers
  for (const [provider, config] of Object.entries(serverConfigs)) {
    if (config.nginx) {
      const serverKey = `${provider}Nginx`;
      servers[serverKey] = new Server(page, config.nginx);
      await servers[serverKey].loadData();
      log(`${serverKey} server loaded with ID: ${config.nginx}`);
    }
  }

  // Create sites
  for (const [serverKey, server] of Object.entries(servers)) {
    const serverType = serverKey.includes("Nginx") ? "nginx" : "ols";
    if (serverType === "nginx") {
      for (const site of nginxSites) {
        log(`Creating site ${site.displayVersion} on ${serverKey}`);
        await page.waitForLoadState("domcontentloaded");

        try {
          const result = await server.createSite(site.displayVersion, {
            phpVersion: site.phpVersion,
            wpVersion: site.wordPressVersion,
            fullObjectCaching: true,
            objectCaching: true,
          });

          // Verify the result
          expect(result).toBeTruthy();
          log(`Successfully created site ${site.displayVersion}`);

          // Wait for any remaining page loads
          await page.waitForLoadState("networkidle");
        } catch (e) {
          log(`Failed to create site: ${e}`);
          // Don't throw error if site creation was actually successful
          if (
            !(await page
              .locator(
                'text="WordPress site installation completed successfully"'
              )
              .isVisible())
          ) {
            throw new Error("Site creation failed");
          }
        }
      }
    }
  }

  // Cleanup
  await context.close();
});
