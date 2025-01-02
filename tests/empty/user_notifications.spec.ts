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
    page.goto('/user/notifications');
    const navMenu = page.locator("//div[@class='xc-container !h-full flex !flex-row']");

    await expect(navMenu.getByText('Dashboard')).toBeVisible();
    await expect(navMenu.getByText('Servers')).toBeVisible();
    await expect(navMenu.getByText('Sites')).toBeVisible();
    await expect(navMenu.getByText('White Label')).toBeVisible();
    await expect(navMenu.getByPlaceholder('Find Servers or Sites')).toBeVisible();

    $section = page.locator(".border-2");
})


test('Server Notifications Section', async() => {
    let $elm: Locator= page.locator(".border-2").filter({hasText:'Server Notifications'});
    await expect($elm.getByText('Server Notifications')).toBeVisible();
    await expect($elm.getByText('For server reboots, unavailable servers, and available upgrades are included')).toBeVisible();
    await expect($elm.getByText('Telegram')).toBeVisible();
    await expect($elm.getByText('WhatsApp')).toBeVisible();
    await expect($elm.getByText('Email')).toBeVisible();
    await expect($elm.getByText('Slack')).toBeVisible();
    await expect($elm.getByText('xCloud')).toBeVisible();
});

test('Newly Provisioned Servers Section', async() => {
    let $elm = page.locator(".border-2").filter({hasText:'Newly Provisioned Servers'});
    await expect($elm.getByText('Newly Provisioned Servers')).toBeVisible();
});


test('Site Notifications Section', async() => {
    let $elm = page.locator(".border-2").filter({hasText:'Site Notifications'});
    await expect($elm.getByText('Site Notifications')).toBeVisible();
    await expect($elm.getByText('For site upgrades, SSL certificate issues, and deployment errors')).toBeVisible();
    await expect($elm.getByText('Telegram')).toBeVisible();
    await expect($elm.getByText('WhatsApp')).toBeVisible();
    await expect($elm.getByText('Email')).toBeVisible();
    await expect($elm.getByText('Slack')).toBeVisible();
    await expect($elm.getByText('xCloud')).toBeVisible();
});

test('Other Notifications Section', async() => {
    let $elm = page.locator(".border-2").filter({hasText:'Other Notifications'});
    await expect($elm.getByText('Other Notifications')).toBeVisible();
    await expect($elm.getByText('Get notified about team accounts and actions')).toBeVisible();
    await expect($elm.getByText('Telegram')).toBeVisible();
    await expect($elm.getByText('WhatsApp')).toBeVisible();
    await expect($elm.getByText('Email')).toBeVisible();
    await expect($elm.getByText('Slack')).toBeVisible();
    await expect($elm.getByText('xCloud')).toBeVisible();
});

test('Do Not Send Sensitive Information Section', async() => {
    let $elm = page.locator(".border-2").filter({hasText:'Do Not Send Sensitive Information'});
    await expect($elm.getByText('Do Not Send Sensitive Information')).toBeVisible();
    await expect($elm.getByText('This option will disable sending sensitive options like, sudo password, database password, wp-admin password over email and notification channels')).toBeVisible();
});

test('Vulnerability Notifications Section', async() => {
    let $elm = page.locator(".border-2").filter({hasText:'Vulnerability Notifications'});
    await expect($elm.getByText('Vulnerability Notifications')).toBeVisible();
    await expect($elm.getByText('Enable this option to receive notifications about vulnerabilities via Email, Slack, and WhatsApp. Stay informed and take timely action to secure your systems')).toBeVisible();
});