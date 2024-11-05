
import {type Locator, test, type Page, expect} from '@playwright/test'

let page: Page
let countCards: Locator
test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    //Goto Section
    countCards = page.locator(`//div[@class='flex flex-col p-6 gap-4 bg-white dark:bg-mode-light w-full rounded-lg']`);
})

test.afterAll(async () => {
    await page.close();
})

test(`xCloud Text on Security > Browser Session Page`, async() => {
    await page.goto('/user/browser-sessions');
    await page.waitForTimeout(3*1000);
    await expect(page.getByText(/xcloud/i)).not.toBeVisible();
})

// TODO:  Before adding any card, in Bills & Payment Page the warning message need to be changed

test(`Bills & Paymet should not have "how Billing works" doc text`, async() => {
    await page.goto('/user/bills-payment');
    await expect(page.getByText(`Read how billing works.`)).not.toBeVisible();
})

test(`Notification page should not have whatsapp, slack or xCloud`, async() => {
    await page.goto('/user/notifications');
    await expect(page.getByText(/xcloud/i)).not.toBeVisible();
    await expect(page.getByText(/slack/i)).not.toBeVisible();
    await expect(page.getByText(/whatsapp/i)).not.toBeVisible();
    await expect(page.getByText("Email")).toBeVisible();
})

test(`xCloud Managed Email Provider should not be available`, async() => {
    await page.goto('/user/email-provider');
    await page.getByRole('button', { name: 'Add New Provider' }).click();
    await expect(page.locator('span').filter({ hasText: 'xCloud Managed Email Service' })).not.toBeVisible();
    await expect(page.getByText('Get help from our Configure SMTP Provider documentation')).not.toBeVisible();
    await expect(page.getByText(/xcloud/i)).not.toBeVisible();
    await page.locator('div').filter({ hasText: /^Add Email Provider$/ }).first().getByRole('button').click();
    await expect(page.getByText(/xcloud/i)).not.toBeVisible();
})

test(`Should not have xcloud or docs in storage provider integration page`, async () =>{
    await page.goto(`/user/storage-provider`);
    await page.getByRole('button', {name: 'Add New Provider'}).click();

    await page.locator('span').filter({ hasText: 'Digital Ocean Spaces' }).click();
    await expect(page.getByText("Get help from our Site Backup documentation")).not.toBeVisible();
    await expect(page.getByText(/xcloud/i)).not.toBeVisible();
    await page.locator('span').filter({ hasText: 'Vultr Object Storage' }).click();
    await expect(page.getByText("Get help from our Site Backup documentation")).not.toBeVisible();
    await expect(page.getByText(/xcloud/i)).not.toBeVisible();
    await page.locator('span').filter({ hasText: 'Cloudflare R2' }).click();
    await expect(page.getByText("Get help from our Site Backup documentation")).not.toBeVisible();
    await expect(page.getByText(/xcloud/i)).not.toBeVisible();
    await page.locator('span').filter({ hasText: 'Other' }).click();
    await expect(page.getByText("Get help from our Site Backup documentation")).not.toBeVisible();
    await expect(page.getByText(/xcloud/i)).not.toBeVisible();

    await page.locator('header').filter({ hasText: 'Add Storage Provider' }).locator('div').getByRole('button').click();
    await expect(page.getByText(/xcloud/i)).not.toBeVisible();
})


test(`CloudFlare integration page should not have xCloud or Docs`, async () => {

    await page.goto("/user/integration/cloudflare");
    await expect(page.getByText(/xcloud/i)).not.toBeVisible();
    await page.getByRole("button", {
        name: "New Cloudflare Integration"
    }).click();
    await expect(page.getByText(/xcloud/i)).not.toBeVisible();
    await expect(page.getByText("Get help from our Integrate Cloudflare For DNS Management documentation")).not.toBeVisible();
    await page.locator('header').filter({ hasText: 'Add New Cloudflare Integration' }).locator('div').getByRole('button').click();

})

test(`Should not have archive server menu`, async () => {
    await page.goto("/user/integration/cloudflare");
    await expect(page.getByText("Archive Servers")).not.toBeVisible();
})

test("Test Menu Items", async()=>{
    await page.goto('/dashboard');
    await page.locator('.xc-container').first().getByRole('button').nth(2).click();
    await expect(page.getByRole('menuitem', { name: 'Support' }).getAttribute('href')).toBe(/mailto:/);
    await expect(page.getByRole('menuitem', { name: 'Documentation' })).not.toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Affiliates' })).not.toBeVisible();
    await expect(page.getByText('Default Team')).not.toBeVisible();
    await expect(page.getByText('Other Teams')).not.toBeVisible();
    await expect(page.getByRole('link', {name: 'New Team'})).not.toBeVisible();
})


// TODO: While purchase from Landing page xCloud is visible. - https://d.pr/i/3WKfEP
// TODO: Need to update xCloud from Server Provisioning time - https://d.pr/i/Ywb4kp
// TODO: Need to remove xCloud form Recent Event Server Provisioning Event - https://d.pr/i/l2ugsY
// TODO: xCloud is visible in Server Page, in info Too - https://d.pr/i/R8BDbU
// TODO: xCloud Logo is visible in server page - https://d.pr/i/dzEFBX
// TODO: Notification there is xCloud visible - https://d.pr/i/Z4hFSx
// TODO: Server Logo and info has xCloud - https://d.pr/i/8Pimyv

test(`Test Total Servers Count Card`, async() => {
    await expect(countCards.filter({hasText:/Total Servers/}).getByText(/Total Servers/).count()).toBe(2);
    await expect(countCards.filter({hasText:/Total Servers/}).locator('h3').allInnerTexts()).toMatch(/[0-9]+/)

})

test(`Test Total Sites Count Card`, async() => {
    await expect(countCards.filter({hasText:/Total Sites/}).getByText(/Total Sites/).count()).toBe(2);
    await expect(countCards.filter({hasText:/Total Sites/}).locator('h3').allInnerTexts()).toMatch(/[0-9]+/)

})