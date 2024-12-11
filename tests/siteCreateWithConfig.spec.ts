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
const phpVersions = [
  {
    displayVersion: "PHP56Nginx",
    phpVersion: "5.6",
    wordPressVersion: "latest",
  },
  {
    displayVersion: "PHP70Nginx",
    phpVersion: "7.0",
    wordPressVersion: "latest",
  },
  {
    displayVersion: "PHP71Nginx",
    phpVersion: "7.1",
    wordPressVersion: "latest",
  },
  {
    displayVersion: "PHP72Nginx",
    phpVersion: "7.2",
    wordPressVersion: "latest",
  },
  {
    displayVersion: "PHP73Nginx",
    phpVersion: "7.3",
    wordPressVersion: "latest",
  },
  {
    displayVersion: "PHP74Nginx",
    phpVersion: "7.4",
    wordPressVersion: "latest",
  },
  {
    displayVersion: "PHP80Nginx",
    phpVersion: "8.0",
    wordPressVersion: "latest",
  },
  {
    displayVersion: "PHP81Nginx",
    phpVersion: "8.1",
    wordPressVersion: "latest",
  },
  {
    displayVersion: "PHP82Nginx",
    phpVersion: "8.2",
    wordPressVersion: "latest",
  },
  {
    displayVersion: "PHP83Nginx",
    phpVersion: "8.3",
    wordPressVersion: "latest",
  },
  {
    displayVersion: "PHP84Nginx",
    phpVersion: "8.4",
    wordPressVersion: "latest",
  },
];

// Server configurations
const serverConfigs: ServerConfigs = {
  vultr: {
    nginx: "2834",
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

    // Initialize server once for all tests
    server = new Server(page, serverConfigs.vultr.nginx);
    await server.loadData();
    log(`Server loaded with ID: ${serverConfigs.vultr.nginx}`);
  });

  test.afterAll(async () => {
    log("Closing browser");
    await page.close();
  });

  // Create separate test for each PHP version
  for (const phpConfig of phpVersions) {
    test(`Creating site with ${phpConfig.displayVersion}`, async () => {
      log(`Starting creation of ${phpConfig.displayVersion}`);
      await page.waitForLoadState("domcontentloaded");

      try {
        const result = await server.createSite(phpConfig.displayVersion, {
          phpVersion: phpConfig.phpVersion,
          wpVersion: phpConfig.wordPressVersion,
          fullObjectCaching: true,
          objectCaching: true,
        });

        // Verify the result
        expect(result).toBeTruthy();
        log(`Successfully created site ${phpConfig.displayVersion}`);

        // Wait for any remaining page loads
        await page.waitForLoadState("networkidle");

        // Additional verification if needed
        // if (await page.locator('text="WordPress site installation completed successfully"').isVisible()) {
        //   log(`Verified site ${phpConfig.displayVersion} is created successfully`);
        // }
      } catch (e) {
        log(`Warning: Issue with site ${phpConfig.displayVersion}: ${e}`);
        test.fail(); // Mark test as failed but continue with others
      }
    });
  }
});
