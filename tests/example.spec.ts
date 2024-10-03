import { test, expect } from '@playwright/test';
import { createSite, SiteConfig } from '../POM/functions/create_site';



const sites: SiteConfig[] = [
    // {
    //     server_name: 'qa-nginx-24-mysql',
    //     server_type: 'nginx',
    //     site_title: 'PHP56',
    //     php_version: '5.6',
    //     wordpress_version: '5.6',
    // },
    // {
    //     server_name: 'qa-nginx-24-mysql',
    //     server_type: 'nginx',
    //     site_title: 'PHP70',
    //     php_version: '7.0',
    //     wordpress_version: '5.8',
    // },
    // {
    //     server_name: 'qa-nginx-24-mysql',
    //     server_type: 'nginx',
    //     site_title: 'PHP71',
    //     php_version: '7.1',
    //     wordpress_version: '5.8',
    // },
    // {
    //     server_name: 'qa-nginx-24-mysql',
    //     server_type: 'nginx',
    //     site_title: 'PHP72',
    //     php_version: '7.2',
    //     wordpress_version: '5.8',
    // },
    // {
    //     server_name: 'qa-nginx-24-mysql',
    //     server_type: 'nginx',
    //     site_title: 'PHP73',
    //     php_version: '7.3',
    //     wordpress_version: '5.8',
    // },
    // {
    //     server_name: 'qa-nginx-24-mysql',
    //     server_type: 'nginx',
    //     site_title: 'PHP74',
    //     php_version: '7.4',
    //     wordpress_version: 'latest',
    // },
    // {
    //     server_name: 'qa-nginx-24-mysql',
    //     server_type: 'nginx',
    //     site_title: 'PHP80',
    //     php_version: '8.0',
    //     wordpress_version: 'latest',
    // },
    // {
    //     server_name: 'qa-nginx-24-mysql',
    //     server_type: 'nginx',
    //     site_title: 'PHP81',
    //     php_version: '8.1',
    //     wordpress_version: 'latest',
    // },
    // {
    //     server_name: 'qa-nginx-24-mysql',
    //     server_type: 'nginx',
    //     site_title: 'PHP80',
    //     php_version: '8.2',
    //     wordpress_version: 'latest',
    // },
    {
        server_name: 'qa-nginx-24-mysql',
        server_type: 'nginx',
        site_title: 'PHP80',
        php_version: '8.3',
        wordpress_version: 'latest',
    },

]

if(sites.length !== 0) {
    sites.forEach( (site, idx) => {
        test(`Creating Site ${site.site_title} on environment ${site.server_type}`, async ({page})=>{
            await createSite(page, site);
        })
    })
}





// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
