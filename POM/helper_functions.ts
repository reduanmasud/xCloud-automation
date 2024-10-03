import { Page } from "@playwright/test";

export async function waitForText(page:Page, selectiorText:string, text:string) {
    const pattern = new RegExp(`${text}(.)*`);
    await page.locator('role=main', { hasText: pattern })
        .waitFor({ state: 'visible', timeout: 300000 });
}