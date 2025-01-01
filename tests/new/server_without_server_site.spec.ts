import { test, expect, type Page } from "@playwright/test";
import exp from "constants";
import { baseConfig } from "../../config/config";

test.describe.configure({ mode: 'serial' });

let page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
});

test.afterAll(async () => {
    await page.close();
});


test('Dashboard Menu Test', async() => {
    page.goto('/server');
    const navMenu = page.locator("//div[@class='xc-container !h-full flex !flex-row']");

    await expect(navMenu.getByText('Dashboard')).toBeVisible();
    await expect(navMenu.getByText('Servers')).toBeVisible();
    await expect(navMenu.getByText('Sites')).toBeVisible();
    await expect(navMenu.getByText('White Label')).toBeVisible();
    await expect(navMenu.getByPlaceholder('Find Servers or Sites')).toBeVisible();

})


test('Server Image Test', async() => {
    await expect(page.getByRole('img', { name: 'empty_dashboard' })).toBeVisible();
})

test('Server Text Test', async() => {
    await expect(page.getByText('Hey there! You have no server yet.')).toBeVisible();
    await expect(page.getByText('Check out our Quick Start Documentation.')).toBeVisible();
})

test('Server page button test', async() => {
    await expect(page.getByRole('link', { name: /Try xCloud Playground/ })).toBeVisible();
});

test('Server page Quick Start Documentation link test', async() => {
    const $link = page.getByRole('link', { name: 'Quick Start Documentation' })
    await expect($link).toHaveAttribute('href', 'https://xcloud.host/docs/how-to-get-free-hosting-with-vultr/');
})

test('Server Page Footer Test', async() => {
    await expect(page.getByText('xCloud Copyright © 2024 | xCloud Hosting LLC. All rights reserved.')).toBeVisible();
})