import { test, expect, type Page } from "@playwright/test";

// import "../POM/CustomMatchers/isImgLoaded";

// expect.extend({ isImgLoaded });

// import { DBEngine, ServerManager, ServerProvider, ServerType } from "../POM/Classes/ServerManager.class";
// import { Server } from "../POM/Classes/Server/Server.class";

let page: Page
// let server: Server;
// let vultr_server: Server;
// let hetzner_server: Server;
// let gcp_server: Server;
// let aws_server: Server;

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

    // server = await new Server(page,'2815')
    // vultr_server = await Server(page, 'id');
    // hetzner_server = await Server(page, 'id');
    // gcp_server = await Server(page, 'id');
    // await server.loadData();
    
});

test.afterAll(async () => {
    // vultr_server.changePhpVersion('8.4').apply();
    await page.close();
});

test("Before Content Check", async() => {
    await page.goto('https://db262a91-2ad1-4c2b-8295-bfe072de448c-00-2odnt9nb2f2cj.pike.replit.dev/');
    await expect(page.locator('#box1')).cssBeforeHas('content', '"Before Hover"');
})

// test("Image Load Test Image", async () => {

//     await page.goto('https://db262a91-2ad1-4c2b-8295-bfe072de448c-00-2odnt9nb2f2cj.pike.replit.dev/');
//     await expect(page.locator('#imageOne')).isImgLoaded();
// })

// test("Image is not load test", async() => {
//     await page.goto('https://db262a91-2ad1-4c2b-8295-bfe072de448c-00-2odnt9nb2f2cj.pike.replit.dev/');
//     await expect(page.locator('#imageTwo')).not.isImgLoaded();
// })
// test('Create Server Test', async() => {

//     const success = await server.provisionServer();
//     expect(success).toBe(true); // Verify server provisioning was successful
//     expect(server.serverId).not.toBe(''); // Ensure serverId is set;
    
// });

// test('Create Site Test hello-site', async() => {
//     const i = await server.createSite('hello-site');
//     const site = server.sites[i - 1]; 
//     expect(i).not.toBe(-1);
//     expect(site.siteId).not.toBe('');
// })

// test('Create site demo-site', async() => {
//     const i = await server.createSite("demo-site",{fullObjectCaching:true,objectCaching:true,phpVersion:"8.2",wpVersion:"6.4"});
//     const site = server.sites[i - 1]; 
//     expect(i).not.toBe(-1);
//     expect(site.siteId).not.toBe('');
// })


// test('Server Delete Test', async()=>{
//     await server.delete();
//     await expect(true).toBe(true);
// });



