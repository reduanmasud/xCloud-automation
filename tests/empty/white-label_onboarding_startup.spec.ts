import { test, expect, type Page } from "@playwright/test";
import { baseConfig } from "../../config/config";

test.describe.configure({ mode: 'serial' });

let page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
});

test.afterAll(async () => {
    await page.close();
});


test('Site Page Menu Test', async() => {
    page.goto('/white-label/onboarding/startup');
    const navMenu = page.locator("//div[@class='xc-container !h-full flex !flex-row']");

    await expect(navMenu.getByText('Dashboard')).toBeVisible();
    await expect(navMenu.getByText('Servers')).toBeVisible();
    await expect(navMenu.getByText('Sites')).toBeVisible();
    await expect(navMenu.getByText('White Label')).toBeVisible();
    await expect(navMenu.getByPlaceholder('Find Servers or Sites')).toBeVisible();

})


test('White Label Page Image Test', async() => {
    await expect(page.getByRole('img', { name: 'Illustration' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Circular Image' })).toBeVisible();
})

test('White Label Page Text Test', async() => {
    await expect(page.getByRole('heading', { name: 'Start Your Hosting Business: Resell & Earn Revenue' })).toBeVisible();
    await expect(page.getByText('Launch a cloud hosting business with xCloud Managed Servers. Resell our fully managed web hosting under your own brand or domain to maximize your revenue ensuring a reliable performance.')).toBeVisible();
    await expect(page.getByText('Complete control for your personal branding')).toBeVisible();
    await expect(page.getByText('Manage your client billings with Stripe Connect')).toBeVisible();
    await expect(page.getByText('Customize hosting packages & sell at your own price')).toBeVisible();
    await expect(page.getByText('Get access to powerful features of xCloud')).toBeVisible();
    await expect(page.getByText('By ticking this box, you are confirming that you have read, understood, and agree to our Terms and Privacy Policy *')).toBeVisible();
    await expect(page.getByText('Before proceeding, ensure you have an active Stripe account, as all transactions are managed via Stripe Connect *')).toBeVisible();
})

test('White Label page button test', async() => {
    await expect(page.getByRole('button', { name: /Start Your Hosting Business Now/ })).toBeVisible();
});

test('White Label page Quick Start link test', async() => {
    const $terms = page.getByRole('link', { name: 'Quick Start' });
    const $privacyPolicy = page.getByRole('link', { name: 'Privacy Policy' });
    const $stripeConnect = page.getByRole('link', { name: 'Stripe Connect' });

    await expect($terms).toHaveAttribute('href', 'https://xcloud.host/xcloud-white-label-terms-and-conditions/');
    await expect($privacyPolicy).toHaveAttribute('href', 'https://xcloud.host/privacy-policy/');
    await expect($stripeConnect).toHaveAttribute('href', 'https://stripe.com/connect');
})

test('Server Page Footer Test', async() => {
    await expect(page.getByText(/xCloud v\d+\.\d+\.\d+ Copyright © 2024 \| xCloud Hosting LLC\. All rights reserved\./)).toBeVisible();
})