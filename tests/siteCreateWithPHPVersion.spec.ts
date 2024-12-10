import { test, expect, type Page } from "@playwright/test";
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

// Global variables
let page: Page;
const servers: { [key: string]: Server } = {};

// All supported PHP versions
const phpConfigs = [
  // { version: "7.4", displayVersion: "74", wordpress: "6.4" },
  // { version: "8.0", displayVersion: "80", wordpress: "6.4" },
  // { version: "8.1", displayVersion: "81", wordpress: "6.4" },
  { version: "8.2", displayVersion: "82", wordpress: "6.4" },
  // { version: "8.3", displayVersion: "83", wordpress: "6.4" },
];

// All server providers with their IDs
const serverConfigs: ServerConfigs = {
  vultr: {
    nginx: "2814",
    // ols: "2815"
  },

  // xCloud Provider
  // xcloudProvider: {
  //   nginx: "3001",
  //   ols: "3002"
  // },

  // xCloud Managed
  // xcloudManaged: {
  //   nginx: "3101",
  //   ols: "3102"
  // },

  // Hetzner
  // hetzner: {
  //   nginx: "4001",
  //   ols: "4002"
  // },

  // Linode
  // linode: {
  //   nginx: "5001",
  //   ols: "5002"
  // },

  // AWS
  // aws: {
  //   nginx: "6001",
  //   ols: "6002"
  // },

  // GCP
  // gcp: {
  //   nginx: "7001",
  //   ols: "7002"
  // },

  // Any Server
  // any: {
  //   nginx: "8001",
  //   ols: "8002"
  // }
};

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  log("Browser page created");

  // Initialize active servers
  for (const [provider, config] of Object.entries(serverConfigs)) {
    if (config.nginx) {
      const serverKey = `${provider}Nginx`;
      servers[serverKey] = new Server(page, config.nginx);
      await servers[serverKey].loadData();
      log(`${serverKey} server loaded with ID: ${config.nginx}`);
    }

    if (config.ols) {
      const serverKey = `${provider}Ols`;
      servers[serverKey] = new Server(page, config.ols);
      await servers[serverKey].loadData();
      log(`${serverKey} server loaded with ID: ${config.ols}`);
    }
  }
});

test("Create sites with PHP versions", async () => {
  // Process each active server
  for (const [serverKey, server] of Object.entries(servers)) {
    log(`Starting site creation for ${serverKey}`);
    const serverType = serverKey.includes("Nginx") ? "Nginx" : "Ols";

    for (const php of phpConfigs) {
      const siteName = `PHP${php.displayVersion}${serverType}`;
      log(`Creating site: ${siteName}`);

      try {
        const i = await server.createSite(siteName, {
          phpVersion: php.version,
          wpVersion: php.wordpress,
          fullObjectCaching: true,
          objectCaching: true,
        });

        const site = server.sites[i - 1];
        log(`Site created: ${siteName} with index: ${i}`);

        expect(i).not.toBe(-1);
        expect(site.siteId).not.toBe("");
      } catch (error) {
        log(`Failed to create site ${siteName}: ${error}`);
        throw error;
      }
    }
  }
});

test.afterAll(async () => {
  log("Closing browser");
  await page.close();
});
