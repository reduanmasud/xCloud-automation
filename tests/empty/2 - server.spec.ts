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
    await page.goto('/server');
    const navMenu = page.locator("//div[@class='xc-container !h-full flex !flex-row']");

    await expect.soft(navMenu.getByText('Dashboard')).toBeVisible();
    await expect.soft(navMenu.getByText('Servers')).toBeVisible();
    await expect.soft(navMenu.getByText('Sites')).toBeVisible();
    await expect.soft(navMenu.getByText('White Label')).toBeVisible();
    await expect.soft(navMenu.getByPlaceholder('Find Servers or Sites')).toBeVisible();

})


test('Server Image Test', async() => {
    await expect.soft(page.getByRole('img', { name: 'empty_dashboard' })).toBeVisible();
})

test('Server Text Test', async() => {
    await expect.soft(page.getByText('Hey there! You have no server yet.')).toBeVisible();
    await expect.soft(page.getByText('Check out our Quick Start Documentation.')).toBeVisible();
})

test('Server page button test', async() => {
    await expect.soft(page.getByRole('link', { name: /Add New server/ })).toBeVisible();
});

test('Server page Quick Start Documentation link test', async() => {
    const $link = page.getByRole('link', { name: 'Quick Start Documentation' })
    await expect.soft($link).toHaveAttribute('href', 'https://xcloud.host/docs/how-to-get-free-hosting-with-vultr/');
})

test('Server Page Footer Test', async() => {
    await expect.soft(page.getByText(/xCloud v\d+\.\d+\.\d+ Copyright © 2024 \| xCloud Hosting LLC\. All rights reserved\./)).toBeVisible();
})