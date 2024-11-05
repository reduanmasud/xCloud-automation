import { chromium, FullConfig } from "@playwright/test";
import { baseConfig } from "./config/config";

const authFile = 'state.json';

const baseURL = baseConfig.baseURL;
const userEmail = baseConfig.email;
const userPass = baseConfig.password;


async function globalSetup(config: FullConfig) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(`${baseURL}/login`);
    await page.waitForLoadState('domcontentloaded');
    await page.locator('#email').pressSequentially(userEmail);
    await page.locator("#password").pressSequentially(userPass);
    await page.locator('span').filter({ hasText: 'Remember me' }).first().click();
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.waitForURL(`${baseURL}/dashboard`);
    await page.context().storageState({ path: authFile });
    await browser.close();
}

export default globalSetup;
