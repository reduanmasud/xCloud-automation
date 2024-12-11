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
// Nginx Configurations (commented)
/*
const phpConfigs = [
  { 
    displayVersion: "PHP56Nginx",
    phpVersion: "5.6",
    wordPressVersion: "latest"
  },
  { 
    displayVersion: "PHP70Nginx",
    phpVersion: "7.0",
    wordPressVersion: "latest"
  },
  { 
    displayVersion: "PHP71Nginx",
    phpVersion: "7.1",
    wordPressVersion: "latest"
  },
  { 
    displayVersion: "PHP72Nginx",
    phpVersion: "7.2",
    wordPressVersion: "latest"
  },
  { 
    displayVersion: "PHP73Nginx",
    phpVersion: "7.3",
    wordPressVersion: "latest"
  },
  { 
    displayVersion: "PHP74Nginx",
    phpVersion: "7.4",
    wordPressVersion: "latest"
  },
  { 
    displayVersion: "PHP80Nginx",
    phpVersion: "8.0",
    wordPressVersion: "latest"
  },
  { 
    displayVersion: "PHP81Nginx",
    phpVersion: "8.1",
    wordPressVersion: "latest"
  },
  { 
    displayVersion: "PHP82Nginx",
    phpVersion: "8.2",
    wordPressVersion: "latest"
  },
  { 
    displayVersion: "PHP83Nginx",
    phpVersion: "8.3",
    wordPressVersion: "latest"
  },
  { 
    displayVersion: "PHP84Nginx",
    phpVersion: "8.4",
    wordPressVersion: "latest"
  }
];
*/

// OLS Configurations (active)
const phpConfigs = [
  {
    displayVersion: "PHP74OLS",
    phpVersion: "7.4",
    wordPressVersion: "latest",
  },
  {
    displayVersion: "PHP80OLS",
    phpVersion: "8.0",
    wordPressVersion: "latest",
  },
  {
    displayVersion: "PHP81OLS",
    phpVersion: "8.1",
    wordPressVersion: "latest",
  },
  {
    displayVersion: "PHP82OLS",
    phpVersion: "8.2",
    wordPressVersion: "latest",
  },
  {
    displayVersion: "PHP83OLS",
    phpVersion: "8.3",
    wordPressVersion: "latest",
  },
];

// Server configurations
const serverConfigs: ServerConfigs = {
  aws: {
    // nginx: "2831",  // Uncomment for Nginx testing
    ols: "2836", // Comment out for Nginx testing
  },
};

let page;
let server;

test.describe("PHP Version Site Creation Tests", () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    await page.waitForLoadState("domcontentloaded");
    log("Browser page created");

    // Initialize server
    server = new Server(page, serverConfigs.aws.ols); // Change to .nginx for Nginx testing
    await server.loadData();
    log(`AWS OLS Server loaded with ID: ${serverConfigs.aws.ols}`);
  });

  test.afterAll(async () => {
    log("Closing browser");
    await page.close();
  });

  // Create test for each PHP version
  for (const config of phpConfigs) {
    test(`Creating site with ${config.displayVersion}`, async () => {
      log(`Starting creation of ${config.displayVersion}`);
      await page.waitForLoadState("domcontentloaded");

      try {
        const result = await server.createSite(config.displayVersion, {
          phpVersion: config.phpVersion,
          wpVersion: config.wordPressVersion,
          fullObjectCaching: true,
          objectCaching: true,
        });

        expect(result).toBeTruthy();
        log(`Successfully created site ${config.displayVersion}`);
        await page.waitForLoadState("networkidle");
      } catch (e) {
        log(`Warning: Issue with site ${config.displayVersion}: ${e}`);
        test.fail();
      }
    });
  }
});
