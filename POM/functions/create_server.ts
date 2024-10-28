import { expect, Page } from "@playwright/test"
import { waitForText } from "../helper_functions";

export enum ServerProvider {
    VULTR,
    HETZNER,
    GCP,
    AWS,
    DO
}

interface serverProp {
    name: string
    serverProvider: ServerProvider
    
}

export const create_server = async (page:Page, {
    provider,
}: {
    provider: ServerProvider,
}) => {
    await page.goto('/server/create');

    switch(provider) {
        case ServerProvider.VULTR:
            await page.getByRole('heading', { name: 'Vultr' }).click();
            await page.getByLabel('Select Existing or Connect New').selectOption('0');
            break;
        case ServerProvider.HETZNER:
            await page.getByRole('heading', { name: 'Hetzner' }).click();
            await page.getByLabel('Select Existing or Connect New').selectOption('0');
            break;
        case ServerProvider.GCP:
            await page.getByRole('heading', { name: 'Google Cloud' }).click();
            await page.getByLabel('Select Existing or Connect New').selectOption('0');
            break;
        case ServerProvider.DO:
            await page.getByRole('heading', { name: 'DigitalOcean' }).click();
            await page.getByLabel('Select Existing or Connect New').selectOption('0');
            break;
        case ServerProvider.AWS:
            await page.getByRole('heading', { name: 'AWS' }).click();
            await page.getByLabel('Select Existing or Connect New').selectOption('0');
            break;
        default:
            throw new Error('Invalid Server Provider')
    };

    await page.getByPlaceholder('Server Name').click();
    await page.getByPlaceholder('Server Name').fill('qa-auto-test');

    switch (provider) {
        case ServerProvider.VULTR:
            await page.getByLabel('Server Size').selectOption({ label: '1 vCPU / 1 GB RAM / 25 GB NVMe / 1 TB Bandwidth - $5/month' });
            await page.getByLabel('Choose region').selectOption('ewr');
            await page.locator('div').filter({ hasText: /^Select or create tagsThe list is empty$/ }).getByRole('listbox').click();
            await page.locator('div').filter({ hasText: /^Select or create tagsThe list is empty$/ }).getByRole('listbox').fill('auto-test-server');
            await page.locator('span').filter({ hasText: 'I have understood that the' }).first().click();
            await page.locator('span').filter({ hasText: 'I am sure that I\'ve read the' }).first().click();
            break;
    
        default:
            throw new Error('Invalid Server Size')

    }

    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('main')).toContainText('Verifying Card & Taking Payment');
    await page.locator('role=main', {
        hasText: /\[1\/28\] Verifying Card & Taking Payment of $5(.)*/
    }).waitFor({state: 'visible', timeout: 300000});
    await waitForText(page, 'role=main', '[1/28] Verifying Card & Taking Payment of $5');
}