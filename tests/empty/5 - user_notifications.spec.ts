import { test, expect, type Page, Locator } from "@playwright/test";
import { baseConfig } from "../../config/config";

test.describe.configure({ mode: 'serial' });

let page: Page;
let $section: Locator

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
});

test.afterAll(async () => {
    await page.close();
});


test('Notification Page Menu Test', async() => {
    await page.goto('/user/notifications');
    const navMenu = page.locator("//div[@class='xc-container !h-full flex !flex-row']");

    await expect.soft(navMenu.getByText('Dashboard')).toBeVisible();
    await expect.soft(navMenu.getByText('Servers')).toBeVisible();
    await expect.soft(navMenu.getByText('Sites')).toBeVisible();
    await expect.soft(navMenu.getByText('White Label')).toBeVisible();
    await expect.soft(navMenu.getByPlaceholder('Find Servers or Sites')).toBeVisible();

    $section = page.locator(".border-2");
})


test('Server Notifications Section', async() => {
    let $elm: Locator= $section.filter({hasText:'Server Notifications'});
    await expect.soft($elm.getByText('Server Notifications')).toBeVisible();
    await expect.soft($elm.getByText('For server reboots, unavailable servers, and available upgrades are included')).toBeVisible();
    await expect.soft($elm.getByText('Telegram')).toBeVisible();
    await expect.soft($elm.getByText('WhatsApp')).toBeVisible();
    await expect.soft($elm.getByText('Email')).toBeVisible();
    await expect.soft($elm.getByText('Slack')).toBeVisible();
    await expect.soft($elm.getByText('xCloud')).toBeVisible();
});

test('Newly Provisioned Servers Section', async() => {
    let $elm = $section.filter({hasText:'Newly Provisioned Servers'});
    await expect.soft($elm.getByText('Newly Provisioned Servers')).toBeVisible();
});


test('Site Notifications Section', async() => {
    let $elm = $section.filter({hasText:'Site Notifications'});
    await expect.soft($elm.getByText('Site Notifications')).toBeVisible();
    await expect.soft($elm.getByText('For site upgrades, SSL certificate issues, and deployment errors')).toBeVisible();
    await expect.soft($elm.getByText('Telegram')).toBeVisible();
    await expect.soft($elm.getByText('WhatsApp')).toBeVisible();
    await expect.soft($elm.getByText('Email')).toBeVisible();
    await expect.soft($elm.getByText('Slack')).toBeVisible();
    await expect.soft($elm.getByText('xCloud')).toBeVisible();
});

test('Other Notifications Section', async() => {
    let $elm = $section.filter({hasText:'Other Notifications'});
    await expect.soft($elm.getByText('Other Notifications')).toBeVisible();
    await expect.soft($elm.getByText('Get notified about team accounts and actions')).toBeVisible();
    await expect.soft($elm.getByText('Telegram')).toBeVisible();
    await expect.soft($elm.getByText('WhatsApp')).toBeVisible();
    await expect.soft($elm.getByText('Email')).toBeVisible();
    await expect.soft($elm.getByText('Slack')).toBeVisible();
    await expect.soft($elm.getByText('xCloud')).toBeVisible();
});

test('Do Not Send Sensitive Information Section', async() => {
    let $elm = $section.filter({hasText:'Do Not Send Sensitive Information'});
    await expect.soft($elm.getByText('Do Not Send Sensitive Information')).toBeVisible();
    await expect.soft($elm.getByText('This option will disable sending sensitive options like, sudo password, database password, wp-admin password over email and notification channels')).toBeVisible();
});

test('Vulnerability Notifications Section', async() => {
    let $elm = $section.filter({hasText:'Vulnerability Notifications'});
    await expect.soft($elm.getByText('Vulnerability Notifications')).toBeVisible();
    await expect.soft($elm.getByText('Enable this option to receive notifications about vulnerabilities via Email, Slack, and WhatsApp. Stay informed and take timely action to secure your systems')).toBeVisible();
});

test('Server Page Footer Test', async() => {
    await expect.soft(page.getByText(/xCloud v\d+\.\d+\.\d+ Copyright © 2024 \| xCloud Hosting LLC\. All rights reserved\./)).toBeVisible();
})