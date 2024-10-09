//@ts-nocheck
import { test, expect, type Page } from '@playwright/test';
import { title } from 'process';

let page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/white-label/onboarding/brand-setup');
});

test.afterAll(async () => {
    await page.close();
});

const setupSteps = [
    {
        title: 'Brand Setup',
        subtitle: 'Setup your brand to get started',
        isActive: true
    },
    {
        title: 'Payment Setup',
        subtitle: 'Setup your payment method',
        isActive: false
    },
    {
        title: 'Create Products',
        subtitle: 'Create customized plans',
        isActive: false
    },
    {
        title: 'Domain Setup',
        subtitle: 'Setup your domain easily',
        isActive: false
    }
]

// const allSteps = page.locator(`//div[@class='flex flex-col gap-10 wide-mobile:gap-5']/div`).all();
setupSteps.forEach((step) => {
    test(`Test: ${step.title} title should exists`, async () => {
        await expect(page.locator(`//h4[@class='text-lg font-medium leading-snug'][contains(text(),'${step.title}')]`)).toBeVisible();
    })
    test(`Test: ${step.subtitle} subtitle should exists`, async () => {
        await expect(page.locator(`//p[contains(text(),'${step.subtitle}')]`)).toBeVisible();
    })
    test(`The ${step.title} stet should be ${step.isActive ? 'Active' : 'Unactive'}`, async () => {
        if (step.isActive) {
            await expect(page.locator(`//p[contains(text(),'${step.subtitle}')]/../../div[1]`)).toHaveClass(/text-white/);
            // await expect(page.locator(`//h4[@class='text-lg font-medium leading-snug'][contains(text(),'${step.title}')]`)).toHaveClass(/text-white/);
        } else {
            await expect(page.locator(`//p[contains(text(),'${step.subtitle}')]/../../div[1]`)).not.toHaveClass(/text-white/);
            // await expect(page.locator(`//h4[@class='text-lg font-medium leading-snug'][contains(text(),'${step.title}')]`)).not.toHaveClass(/text-white/);
        }
    })
})

test('Test & setup Brand', async() => {
    const mainLocator = page.locator(`//div[@class='flex flex-col w-full divide-y-1 divide-light dark:divide-mode-base h-full']`);

    await expect(mainLocator.getByRole('heading', {name: /Brand Setup/})).toBeVisible();
    await expect(mainLocator.getByRole('heading', {name: /Add Your Logo/})).toBeVisible();
    //TODO: Upload a logo (double space is seen)
    await expect(mainLocator.getByText('Upload  a logo or icon that represent your brand profile')).toBeVisible();
    await expect(mainLocator.getByRole('heading', {name:/Brand Profile/})).toBeVisible();
    await expect(mainLocator.getByRole('button', {name: /Upload Logo/})).toBeVisible();
    await expect(mainLocator.getByLabel(/Brand Name/)).toBeVisible();
    await mainLocator.getByPlaceholder("myhosting.com", {exact:true}).pressSequentially('HostSea LLC');
    await expect(mainLocator.getByLabel(/Contact Number/)).toBeVisible();
    await mainLocator.getByPlaceholder("+8801xxxxxxxxx", {exact:true}).pressSequentially("+8801728293838");
    await expect(mainLocator.getByLabel(/Mailing Address/, {exact: true})).toBeVisible();
    await mainLocator.getByPlaceholder("admin@myhosting.com", {exact:true}).pressSequentially("reduan+info1@wpdeveloper.com");
    await expect(mainLocator.getByLabel(/Support Email/)).toBeVisible();
    await mainLocator.getByPlaceholder("support@myhosting.com", {exact:true}).pressSequentially("reduan+support1@wpdeveloper.com");
    await expect(mainLocator.getByLabel(/Address/)).toBeVisible();
    await mainLocator.getByPlaceholder("House # 123, Road # 123, City").pressSequentially("House # 123, Road # 123, Dhaka.");
    await expect(mainLocator.getByLabel(/Copyright Name/)).toBeVisible();
    await mainLocator.getByPlaceholder("X Hosting LLC").pressSequentially("HostSea LLC");
    
})

//p[contains(text(),'Setup your brand to get started')]/../../div[1]