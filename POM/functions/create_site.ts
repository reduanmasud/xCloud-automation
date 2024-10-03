import { expect, Locator, Page } from "@playwright/test";


export type SiteConfig = {
    server_name: string;
    server_type: 'ols' | 'nginx';
    site_title: string;
    php_version: string;
    wordpress_version: string;
};

export async function checkStep(page: Page, locatorElm: Locator): Promise<boolean> {
    console.log(`Checking step for locator: ${locatorElm}`);

    // Wait for the element to be visible before proceeding
    await locatorElm.waitFor({ state: 'visible', timeout: 600000 });  // Increased timeout if needed


    // Use locator.evaluate() to avoid the need for elementHandle()
    const result = await locatorElm.evaluate((el) => {
        const afterContent = window.getComputedStyle(el, '::after').getPropertyValue('content');
        if (afterContent === '"\\e92b"') return 'success';
        if (afterContent === '"\\e92a"') return 'failure';
        return null;
    });

    if (result === 'success') {
        console.log('Step succeeded.');
        return true;
    } else if (result === 'failure') {
        console.error('Step failed!');
        throw new Error('Step failed! Throwing exception...');
    }

    console.log('Unknown step result, continuing...');
    return false; // Default case if result is neither 'success' nor 'failure'
}

type Role = "alert" | "alertdialog" | "application" | "article" | "banner" | "blockquote" | "button" | "caption" | "cell" | "checkbox" | "code" | "columnheader" | "combobox" | "complementary" | "contentinfo" | "definition" | "deletion" | "dialog" | "directory" | "document" | "emphasis" | "feed" | "figure" | "form" | "generic" | "grid" | "gridcell" | "group" | "heading" | "img" | "insertion" | "link" | "list" | "listbox" | "listitem" | "log" | "main" | "marquee" | "math" | "meter" | "menu" | "menubar" | "menuitem" | "menuitemcheckbox" | "menuitemradio" | "navigation" | "none" | "note" | "option" | "paragraph" | "presentation" | "progressbar" | "radio" | "radiogroup" | "region" | "row" | "rowgroup" | "rowheader" | "scrollbar" | "search" | "searchbox" | "separator" | "slider" | "spinbutton" | "status" | "strong" | "subscript" | "superscript" | "switch" | "tab" | "table" | "tablist" | "tabpanel" | "term" | "textbox" | "time" | "timer" | "toolbar" | "tooltip" | "tree" | "treegrid" | "treeitem";

async function waitForAndClick(page: Page, role: Role, name: string | RegExp) {
    console.log(`Waiting for and clicking element with role: ${role}, name: ${name}`);
    const locator = page.getByRole(role, { name });
    await locator.waitFor();
    await locator.click();
    console.log(`Clicked element with role: ${role}, name: ${name}`);
}

export const createSite = async (page: Page, config: SiteConfig) => {


    await page.goto(`/`);
    await page.waitForURL(`/dashboard`);

    console.log(`Navigating to servers page: /server`);
    await page.goto(`/server`);
    await page.waitForURL(`/server`);

    // const serverGridLocator = page.locator('//main[1]/div[1]/div[1]/div[1]/div[2]/div[1]/div[position()]');
    const serverGridLocator = page.getByRole('main').locator('div').filter({ hasText: 'All Servers All Web' }).nth(1);
    console.log(`Waiting for 'All Servers' heading`);
    await page.getByRole('heading', { name: 'All Servers' }).waitFor();

    const serverCount = await serverGridLocator.count();
    const servers = await serverGridLocator.all();

    console.log(`Server count: ${serverCount}`);
    if (serverCount === 0) {
        console.warn("No servers found.");
        return;
    }

    console.log("Servers found, searching for the matching server...");
    let foundServer = false;

    for (const server of servers) {
        const serverText = await server.innerText();
        if (serverText.includes(config.server_name)) {
            foundServer = true;
            console.log(`Server "${config.server_name}" found, proceeding...`);
            await server.click();
            await page.getByRole('link', { name: config.server_name }).click();

            await waitForAndClick(page, 'link', /New Site/i);
            console.log(`Installing new WordPress site...`);
            await page.getByText('Install New WordPress WebsiteSelect this option if you want to a create a fresh').click();
            await page.getByPlaceholder('Site Title').fill(config.site_title);
            await page.getByText('Demo Site Create a demo site').click();

            await waitForAndClick(page, 'button', 'More Advanced Settings');
            console.log(`Selecting PHP version: ${config.php_version}`);
            await page.getByLabel('PHP Version').selectOption(config.php_version);
            await waitForAndClick(page, 'button', 'Next');
            await page.waitForLoadState("domcontentloaded");
            await page.getByRole('heading', { name: 'Setting Up Your Site' }).waitFor();
            // await page.getByRole('heading', { name: '100%' }).waitFor();
            await page.waitForURL(/.*progress/)
            await expect(page).toHaveURL(/.*progress/);
            await page.waitForLoadState('domcontentloaded');

            // console.log(`Checking and verifying installation steps...`);
            // for (let i = 1; i <= 16; i++) {
            //     const stepText = `[${i}/16]`;
            //     console.log(`Verifying step ${stepText}`);
            //     await expect(checkStep(page, page.getByText(new RegExp(`\\[${i}\\/16\\].+(\\.{2,4})`, 'i')))).toBe(true);
            // }

            // Extract serverID and siteID using regex
            const regex = /server\/(\d+)\/site\/(\d+)/;
            const match = await page.url().match(regex);

            if (match) {
                const serverID = match[1]; // '118'
                const siteID = match[2];   // '394'

                console.log(`Server ID: ${serverID}, Site ID: ${siteID}`);

            } else {
                console.log('No match found');
            }

            const retryButton = page.getByRole('button', { name: 'Retry' });
            const reportIssueButton = page.getByRole('button', { name: 'Report an issue' });
            const wentWrongText = page.getByRole('heading', { name: 'Something went wrong' });

            async function handleFailure() {
                console.log("Something Went Wrong..");
                console.log("Reloading Page");
                await page.reload();

                if (await retryButton.isVisible() && await reportIssueButton.isVisible()) {
                    console.log("Retry Button Found.... Will retry");
                    await retryButton.click();

                    return await handleRace();
                } else if (await retryButton.isHidden() && await reportIssueButton.isVisible()) {
                    throw new Error('Failed to Create Site.');
                }
            }

            async function handleRace() {
                const waitForLocator = await Promise.race([
                    page.waitForURL(/.*site-overview/, { timeout: 30 * 60 * 1000 }),
                    wentWrongText.waitFor({ state: 'visible', timeout: 30 * 60 * 1000 })
                ]);
                await page.waitForTimeout(10000);
                await page.reload();
                if (/.*site-overview/.test(page.url())) {
                    console.log('WordPress site installation completed successfully.');
                } else if (await wentWrongText.isVisible()) {
                    console.log("Failed to create site: " + page.url());
                    throw new Error('Failed to Create Site.');
                }
            }

            try {
                const waitForLocator = await Promise.race([
                    page.waitForURL(/.*site-overview/, { timeout: 30 * 60 * 1000 }),
                    retryButton.waitFor({ state: 'visible', timeout: 30 * 60 * 1000 }),
                    reportIssueButton.waitFor({ state: 'visible', timeout: 30 * 60 * 1000 }),
                    wentWrongText.waitFor({ state: 'visible' })
                ]);

                if (/.*site-overview/.test(page.url())) {
                    console.log('WordPress site installation completed successfully.');
                } else if (await wentWrongText.isVisible()) {
                    await handleFailure();
                } else {
                    throw new Error('Failed to Create Site.');
                }
            } catch (error) {
                console.log(error);
                console.log("Failed to create site: " + page.url());
                throw new Error('Failed to Create Site.');
            }

            break;
        }
    }

    if (!foundServer) {
        console.error(`Server "${config.server_name}" not found.`);
    }
};
