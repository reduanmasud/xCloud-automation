import { test, expect } from '@playwright/test';
import { strict } from 'assert';

test('Start Up page', async ({page}) => {

    await page.goto("/white-label/onboarding/startup");
    await page.waitForLoadState('domcontentloaded');

    const image_ilastrator = {
        url: "",
        class: "",
        alt: ""
    }

    const image_circular = {
        url: "",
        class: "",
        alt: "",
    }

    const heading = "Start Your Hosting Business: Resell & Earn Revenue"
    const description = "Launch a cloud hosting services business with xCloud Managed Servers. Resell our fully managed web hosting under your own brand or domain to maximize your revenue ensuring a reliable performance."
    const features = [
        "Complete control for your personal branding",
        "Manage your client billings with Stripe Connect", 
        "Customize hosting packages & sell at your own price", 
        "Get access to all powerful features of xCloud"
    ]


    await expect(page.locator(`//h3[contains(text(),'${heading}')]`)).toBeVisible();
    await expect(page.locator(`//p[contains(text(),'${description}')]`)).toBeVisible();
    
    for(const feature of features) {
        const featureLocator = page.locator(`//p[contains(text(),'${feature}')]`, )
        await expect(featureLocator.first()).toBeVisible();
        await expect(featureLocator.first()).toHaveClass(/before:content-\[\'\\e92d\'\]/);
    }

    await expect(page.getByRole('button',{ name: /Start Your Hosting Business Now/ })).toBeVisible();
})

test('Start Onboarding', async ({page}) => {
    await page.goto("/white-label/onboarding/startup");
    await page.waitForLoadState('domcontentloaded');
    await page.getByRole('button',{ name: /Start Your Hosting Business Now/ }).click();

    await page.waitForURL(/checkout/);
    
    // const successText = page.getByText('White Label Onboarding Started.', {exact: true});
    // await successText.waitFor();
    // await expect(successText).toBeVisible();
})


