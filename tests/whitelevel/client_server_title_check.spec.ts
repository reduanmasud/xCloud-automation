import {test, expect, type Page} from "@playwright/test";

const SITE_URL = "whl-qpxgbzk8.hello1.site/server/";
const SITE_ID = '89';

const links = [
    "https://" + SITE_URL + "" + SITE_ID + "/sites",
    "https://" + SITE_URL + "" + SITE_ID + "/server-settings",
    "https://" + SITE_URL + "" + SITE_ID + "/database", 
    "https://" + SITE_URL + "" + SITE_ID + "/custom-cron-job",
    "https://" + SITE_URL + "" + SITE_ID + "/php-configuration",
    "https://" + SITE_URL + "" + SITE_ID + "/sudo",
    "https://" + SITE_URL + "" + SITE_ID + "/command-runner",
    "https://" + SITE_URL + "" + SITE_ID + "/monitoring",
    "https://" + SITE_URL + "" + SITE_ID + "/logs",
    "https://" + SITE_URL + "" + SITE_ID + "/events",
    "https://" + SITE_URL + "" + SITE_ID + "/firewall-management",
    "https://" + SITE_URL + "" + SITE_ID + "/vulnerability-settings",
    "https://" + SITE_URL + "" + SITE_ID + "/security-update",
    "https://" + SITE_URL + "" + SITE_ID + "/backup", 
    "https://" + SITE_URL + "" + SITE_ID + "/meta",
    "https://" + SITE_URL + "" + SITE_ID + "/others"
    
]

let page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();

});

test.afterAll(async () => {
    await page.close();
});


links.forEach( link => {
    let testText = `Title Should not have xcloud @ ${link}`
    test(testText, async () => {
        const url = link;
        
        await page.goto(url);
        await expect(page).not.toHaveTitle(/xcloud/i);

    })
})