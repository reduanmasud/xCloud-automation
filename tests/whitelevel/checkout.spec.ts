import { test, expect } from '@playwright/test';
import { strict } from 'assert';


test('Start Up page', async ({page}) => {

    await page.goto("/white-label/onboarding/checkout");
    await page.waitForLoadState('domcontentloaded');

    const heading = "Proceed to Checkout"
    const plans = [
        {
            name: 'Basic Plan',
            price: '$12.00/',
            billing_period: 'Billed Monthly'

        },
        {
            name: 'Basic Plan',
            price: '$12.00/',
            billing_period: 'Billed Monthly'

        },
        {
            name: 'Basic Plan',
            price: '$12.00/',
            billing_period: 'Billed Monthly'

        },

    ]

    await expect(page.locator(`//h3[contains(text(),'${heading}')]`)).toBeVisible();

    const allLabel = await page.locator('label');
    let idx = 0;

    await expect(allLabel.count()).toBe(plans.length);

    for(const plan of plans) {
        // TODO: implement
    }

    await expect(page.locator(`//h4[contains(text(), 'Checkout')]`));
    await expect(page.locator(`//p[contains(text(),'Your Order Summery')]`));
    await expect(page.locator(`//p[contains(text(),'Sub Total')]`));
    await expect(page.locator(`//p[contains(text(),'VAT (15%)')]`));
})

test('Start Onboarding', async ({page}) => {
    await page.goto("/white-label/onboarding/startup");
    await page.waitForLoadState('domcontentloaded');
    await page.getByRole('button',{ name: /Start Your Hosting Business Now/ }).click();

    await page.waitForURL(/checkout/);
    

})


