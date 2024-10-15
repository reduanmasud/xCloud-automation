import { test, expect, type Page } from "@playwright/test";
import { DBEngine, ServerManager, ServerProvider, ServerType } from "../POM/Classes/ServerManager.class";
import { vultrAPI } from "../config/secrets";
let page: Page

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    
});

test.afterAll(async () => {
    await page.close();
});


test('Create Server in Vultr', async()=>{
    const serverManager = await new ServerManager(page);

    // await serverManager.createServer(
    //     ServerProvider.VULTR,
    //     vultrAPI,
    //     'qa-test',
    //     '1 vCPU / 1 GB RAM / 25 GB NVMe / 1 TB Bandwidth - $5/month',
    //     'New Jersey - North America (US)',
    //     DBEngine.mariadb,
    //     ServerType.nginx,
        
    // )

    await serverManager.createServer(
        ServerProvider.VULTR,
        vultrAPI,
        'qa-test-demo-server',
        '1 vCPU / 1 GB RAM / 25 GB NVMe / 1 TB Bandwidth - $5/month',
        'New Jersey - North America (US)',
        DBEngine.mysql,
        ServerType.nginx,
        [],
        {
            backup_enable:false,
            ip_doc: true,
            billing: true,
            demo_server: true
        }
    )

    
})
