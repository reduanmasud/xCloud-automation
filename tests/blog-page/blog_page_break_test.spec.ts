import { test, expect, type Page, request} from "@playwright/test";

let page: Page;
let links: Array<object> = [];
test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const req = await request.newContext()
    const response = await req.get('https://xcloud.host/wp-json/wp/v2/posts',
        {
            params: {
                _fields: 'link',
                per_page: 100
            }
        }
    )
    links = await response.json();
});

test.afterAll(async () => {
    await page.close();
});

links.forEach(link => {
    //@ts-ignore
    let url = link.link;

    test(`Blog page: ${url}`, async() => {
        await page.goto(url);
        const $sidebar = page.locator('.eb-post-grid-posts-wrapper');
        await expect(page).toHaveScreenshot({
            fullPage: true,
            mask: [
                $sidebar
            ]
        });
    });


});