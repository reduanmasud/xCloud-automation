import { test, expect, type Page } from "@playwright/test";
import exp from "constants";
import { baseConfig } from "../config/config";

test.describe.configure({ mode: 'serial' });

let page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
});

test.afterAll(async () => {
    await page.close();
});


test('Dashboard Menu Test', async() => {
    page.goto('/dashboard');
    const navMenu = page.locator("//div[@class='xc-container !h-full flex !flex-row']");

    await expect(navMenu.getByText('Dashboard')).toBeVisible();
    await expect(navMenu.getByText('Servers')).toBeVisible();
    await expect(navMenu.getByText('Sites')).toBeVisible();
    await expect(navMenu.getByText('White Label')).toBeVisible();
    await expect(navMenu.getByPlaceholder('Find Servers or Sites')).toBeVisible();

})


test('Dashboard Image Test', async() => {
    await expect(page.getByRole('img', { name: 'empty_dashboard' })).toBeVisible();
})

test('Dashboard Text Test', async() => {
    await expect(page.getByText('Check our Documentation to get a quick start.')).toBeVisible();
})

test('Dashboard page button test', async() => {
    await expect(page.getByRole('link', { name: /Add New/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Try xCloud Playground/ })).toBeVisible();
});