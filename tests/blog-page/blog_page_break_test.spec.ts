import { test, expect, type Page, request } from "@playwright/test";

let page: Page;
let links: Array<{ link: string }> = [];


async function fetchLinks() {
    const req = await request.newContext();
    const response = await req.get('https://xcloud.host/wp-json/wp/v2/posts', {
        params: {
            _fields: 'link',
            per_page: 5,
            page: 1,
        },
    });

    // Check if the response is successful
    if (!response.ok()) {
        throw new Error(`Failed to fetch posts: ${response.status()}`);
    }

    links = await response.json();
    console.log(await response.headers());
    
    // Ensure links array is not empty
    if (links.length === 0) {
        throw new Error('No links found in the response');
    }
}

test.beforeAll(async ({ browser }) => {
    console.log('Before all tests - creating new page');
    console.log('Creating new pages');
    page = await browser.newPage();

    
});

test.afterAll(async () => {
    await page.close();
});

test.describe('Blog posts', async () => {
    console.log('Defining tests for blog posts');
    const req = await request.newContext();
    const response = await req.get('https://xcloud.host/wp-json/wp/v2/posts', {
        params: {
            _fields: 'link',
            per_page: 100,
        },
    });

    // Check if the response is successful
    if (!response.ok()) {
        throw new Error(`Failed to fetch posts: ${response.status()}`);
    }

    links = await response.json();
    //console.log(await response.headers());
    
    // Ensure links array is not empty
    if (links.length === 0) {
        throw new Error('No links found in the response');
    } 
    
    for(const link of links) {
        const url = link.link; // TypeScript knows link is of the specified type
        console.log(`Creating test for link: ${link.link}`);
        test(`Blog page: ${url}`, async () => {
            await page.goto(url);

            const $sidebar = await page.locator('.eb-post-grid-posts-wrapper');
            await expect(page).toHaveScreenshot({
                fullPage: true,
                mask: [$sidebar],
            });
        });
    };
})