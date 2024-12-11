import { test, expect, type Page } from "@playwright/test";
import { DBEngine, ServerManager, ServerProvider, ServerType } from "../POM/Classes/ServerManager.class";
import { Server } from "../POM/Classes/Server/Server.class";
import exp from "constants";
import { sites } from "../POM/helper_functions";
let page: Page
let olsServer: Server;


test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();

    // olsServer = await new Server(page, '137').init();

});

test.afterAll(async () => {
    // vultr_server.changePhpVersion('8.4').apply();
    await page.close();
});


test.describe('Creating Nginx Sites', () => {
    let nginxServer: Server;

    test.beforeAll(async () => {
        nginxServer = await new Server(page, '2843').init();
    });

    const nginx_site = sites(ServerType.nginx);
    if (!Array.isArray(nginx_site) || nginx_site.length === 0) {
        throw new Error("No site configurations available for Nginx.");
    }

    for (const site_config of nginx_site) {
        test(`Creating site at server Nginx name ${site_config.title}`, async () => {
            const site = await nginxServer.createSite(site_config.title, {
                phpVersion: site_config.phpVersion,
                wpVersion: site_config.wpVersion,
                objectCaching: true,
                fullObjectCaching: true,
            });

            await expect(site).toBeTruthy();
        });
    }
});





