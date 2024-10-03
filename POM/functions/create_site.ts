//@ts-nocheck
import { expect, Locator, Page } from "@playwright/test";

export type SiteConfig = {
    server_name: string;
    server_type: 'ols' | 'nginx';
    site_title: string;
    php_version: string;
    wordpress_version: string;
};

// Utility function to wait for and click on elements by role
async function waitForAndClick(page: Page, role: Role, name: string | RegExp) {
    console.log(`Waiting for and clicking element with role: ${role}, name: ${name}`);
    const locator = page.getByRole(role, { name });
    await locator.waitFor();
    await locator.click();
    console.log(`Clicked element with role: ${role}, name: ${name}`);
}

// Function to check if a step succeeded or failed based on CSS pseudo-elements
export async function checkStep(page: Page, locatorElm: Locator): Promise<boolean> {
    console.log(`Checking step for locator: ${locatorElm}`);

    await locatorElm.waitFor({ state: 'visible', timeout: 600000 }); // Increased timeout

    const result = await locatorElm.evaluate((el) => {
        const afterContent = window.getComputedStyle(el, '::after').getPropertyValue('content');
        return afterContent === '"\\e92b"' ? 'success' : afterContent === '"\\e92a"' ? 'failure' : null;
    });

    if (result === 'success') {
        console.log('Step succeeded.');
        return true;
    } else if (result === 'failure') {
        console.error('Step failed!');
        throw new Error('Step failed!');
    }

    console.log('Unknown step result.');
    return false;
}

// Function to handle WordPress site creation
export const createSite = async (page: Page, config: SiteConfig) => {
    await page.goto(`/`);
    await page.waitForURL(`/dashboard`);

    console.log(`Navigating to servers page: /server`);
    await page.goto(`/server`);
    await page.waitForURL(`/server`);

    // Locate the servers grid and find matching server
    const serverGridLocator = page.getByRole('main').locator('div').filter({ hasText: 'All Servers All Web' }).nth(1);
    console.log(`Waiting for 'All Servers' heading`);
    await page.getByRole('heading', { name: 'All Servers' }).waitFor();

    const serverCount = await serverGridLocator.count();
    if (serverCount === 0) {
        console.warn("No servers found.");
        return;
    }

    console.log(`Server count: ${serverCount}, searching for "${config.server_name}"...`);
    const servers = await serverGridLocator.all();
    let foundServer = false;

    for (const server of servers) {
        const serverText = await server.innerText();
        if (serverText.includes(config.server_name)) {
            foundServer = true;
            console.log(`Server "${config.server_name}" found, proceeding...`);

            await server.click();
            await page.getByRole('link', { name: config.server_name }).click();

            await waitForAndClick(page, 'link', /New Site/i);
            await page.getByText('Install New WordPress WebsiteSelect this option if you want to a create a fresh').click();
            await page.getByPlaceholder('Site Title').fill(config.site_title);

            await page.getByText('Demo Site Create a demo site').click();
            await waitForAndClick(page, 'button', 'More Advanced Settings');

            await selectOptionWithValidation(page.getByLabel('PHP Version'), config.php_version);
            
            await waitForAndClick(page, 'button', 'Next');

            await page.waitForLoadState("domcontentloaded");
            await page.getByRole('heading', { name: 'Setting Up Your Site' }).waitFor();
            await page.waitForURL(/.*progress/);
            await expect(page).toHaveURL(/.*progress/);
            await page.waitForLoadState('domcontentloaded');

            // Optional: Check installation progress steps
            // ...

            const regex = /server\/(\d+)\/site\/(\d+)/;
            const match = page.url().match(regex);

            if (match) {
                console.log(`Server ID: ${match[1]}, Site ID: ${match[2]}`);
            } else {
                console.log('No server or site ID match found');
            }

            await handlePostInstallation(page);
            break;
        }
    }

    if (!foundServer) {
        console.error(`Server "${config.server_name}" not found.`);
    }
};

// Helper function to handle post-installation scenarios
async function handlePostInstallation(page: Page) {
    const retryButton = page.getByRole('button', { name: 'Retry' });
    const reportIssueButton = page.getByRole('button', { name: 'Report an issue' });
    const wentWrongText = page.getByRole('heading', { name: 'Something went wrong' });

    async function handleFailure() {
        console.log("Something went wrong, reloading page...");
        await page.reload();

        if (await retryButton.isVisible() && await reportIssueButton.isVisible()) {
            console.log("Retrying...");
            await retryButton.click();
            return await handleRaceCondition();
        } else if (await retryButton.isHidden() && await reportIssueButton.isVisible()) {
            throw new Error('Failed to create site.');
        }
    }

    async function handleRaceCondition() {
        const waitForLocator = await Promise.race([
            page.waitForURL(/.*site-overview/, { timeout: 30 * 60 * 1000 }),
            wentWrongText.waitFor({ state: 'visible', timeout: 30 * 60 * 1000 })
        ]);

        if (/.*site-overview/.test(page.url())) {
            console.log('WordPress site installation completed successfully.');
        } else if (await wentWrongText.isVisible()) {
            console.log("Site creation failed.");
            throw new Error('Failed to create site.');
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
            throw new Error('Failed to create site.');
        }
    } catch (error) {
        console.log(`Error: ${error.message}`);
        throw new Error('Failed to create site.');
    }
}


async function selectOptionWithValidation(element: Locator, option: string | string[]) {
    try {
        // Check if the option exists in the select element
        const options = await element.evaluateAll((elms: HTMLOptionElement[]) => elms.map(option => option.value));

        if (Array.isArray(option)) {
            // Check for multiple selections
            const missingOptions = option.filter(opt => !options.includes(opt));
            if (missingOptions.length > 0) {
                throw new Error(`Options not found: ${missingOptions.join(', ')}`);
            }
        } else if (!options.includes(option)) {
            throw new Error(`Option "${option}" not found`);
        }

        // Proceed with selection
        await element.selectOption(option);
        console.log(`Successfully selected option: ${option}`);
    } catch (error) {
        console.error(`Error selecting option: ${error.message}`);
        throw error;
    }
}