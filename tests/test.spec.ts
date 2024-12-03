import { test, expect, type Page } from "@playwright/test";
import { DBEngine, ServerManager, ServerProvider, ServerType } from "../POM/Classes/ServerManager.class";
import { Server } from "../POM/Classes/Server/Server.class";
let page: Page
let server: Server;

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    // server = await new Server(page,null, {
    //     name: 'qa-test-server',
    //     dbEnging: DBEngine.mysql,
    //     size: '1 vCPU / 1 GB RAM / 25 GB NVMe / 1 TB Bandwidth - $5/month',
    //     serverProvider: ServerProvider.VULTR,
    //     region: 'New Jersey - North America (US)',
    //     serverType: ServerType.nginx,
    //     options: {
    //         backup_enable: false,
    //         demo_server: false,
    //         ip_doc: true,
    //         billing: true
    //     }
    // })

    server = await new Server(page,'179')
    
});

test.afterAll(async () => {
    await page.close();
});

// test('Create Server Test', async() => {

//     const success = await server.provisionServer();
//     expect(success).toBe(true); // Verify server provisioning was successful
//     expect(server.serverId).not.toBe(''); // Ensure serverId is set;
    
// });

test('Create Site Test', async() => {
    const i = await server.createSite('Test Site');
    const site = server.sites[i - 1]; 
    expect(i).not.toBe(-1);
    expect(site.siteId).not.toBe('');
})
