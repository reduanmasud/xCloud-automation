import { test, expect, type Page, request } from "@playwright/test";

let page: Page;
let links: Array<{ link: string }> = [{"link":"https:\/\/xcloud.host\/xcloud-october-2024-release-notes\/"},{"link":"https:\/\/xcloud.host\/run-commands-on-your-website-using-xcloud\/"},{"link":"https:\/\/xcloud.host\/why-ssl-is-important-for-websites\/"},{"link":"https:\/\/xcloud.host\/automate-security-updates-xcloud\/"},{"link":"https:\/\/xcloud.host\/xcloud-integration-with-slack\/"},{"link":"https:\/\/xcloud.host\/guide-to-setup-mariadb-database-with-xcloud\/"},{"link":"https:\/\/xcloud.host\/website-vulnerability-checker\/"},{"link":"https:\/\/xcloud.host\/xcloud-september-2024-release-notes\/"},{"link":"https:\/\/xcloud.host\/advanced-web-application-firewall-configurations\/"},{"link":"https:\/\/xcloud.host\/408-request-timeout-error\/"},{"link":"https:\/\/xcloud.host\/managing-traffic-spikes-on-a-shared-server\/"},{"link":"https:\/\/xcloud.host\/best-practices-to-prevent-downtime\/"},{"link":"https:\/\/xcloud.host\/defend-against-12-major-client-side-security-threats\/"},{"link":"https:\/\/xcloud.host\/set-up-wp-config-php-file-for-wordpress\/"},{"link":"https:\/\/xcloud.host\/xcloud-august-2024-release-notes\/"},{"link":"https:\/\/xcloud.host\/integrate-aws-with-xcloud\/"},{"link":"https:\/\/xcloud.host\/create-a-staging-environment-in-xcloud\/"},{"link":"https:\/\/xcloud.host\/how-to-leverage-browser-caching-on-wordpress\/"},{"link":"https:\/\/xcloud.host\/what-is-rce-remote-code-execution-and-exploit-guide\/"},{"link":"https:\/\/xcloud.host\/guide-how-to-create-a-website\/"},{"link":"https:\/\/xcloud.host\/data-leakage-examples-and-tips-to-fight\/"},{"link":"https:\/\/xcloud.host\/clickjacking-attack-examples-and-prevention\/"},{"link":"https:\/\/xcloud.host\/xcloud-july-2024-release-notes\/"},{"link":"https:\/\/xcloud.host\/host-wordpress-multisites-under-subdomains-xcloud\/"},{"link":"https:\/\/xcloud.host\/load-balancing-techniques\/"},{"link":"https:\/\/xcloud.host\/php-8-2-how-to-change-the-php-version-in-xcloud\/"},{"link":"https:\/\/xcloud.host\/set-up-your-google-cloud-platform-server-with-xcloud\/"},{"link":"https:\/\/xcloud.host\/how-to-manage-storage-providers-backups-with-xcloud\/"},{"link":"https:\/\/xcloud.host\/xcloud-june-2024-release-notes\/"},{"link":"https:\/\/xcloud.host\/top-best-transactional-email-services\/"},{"link":"https:\/\/xcloud.host\/maximize-your-vps-security\/"},{"link":"https:\/\/xcloud.host\/csv-injection-and-how-to-prevent-it\/"},{"link":"https:\/\/xcloud.host\/xcloud-april-and-may-release-notes\/"},{"link":"https:\/\/xcloud.host\/host-website-on-hetzner-cloud-server-with-xcloud\/"},{"link":"https:\/\/xcloud.host\/cloudflare-firewall-rules-to-secure-your-web-app\/"},{"link":"https:\/\/xcloud.host\/self-managed-vs-managed-hosting\/"},{"link":"https:\/\/xcloud.host\/how-to-test-accessibility-score-on-wordpress-site\/"},{"link":"https:\/\/xcloud.host\/free-encrypt-wildcard-ssl-certificate\/"},{"link":"https:\/\/xcloud.host\/shared-hosting-vps-or-cloud-hosting\/"},{"link":"https:\/\/xcloud.host\/how-to-stress-test-a-wordpress-website\/"},{"link":"https:\/\/xcloud.host\/advanced-redis-object-caching-for-wordpress\/"},{"link":"https:\/\/xcloud.host\/top-advanced-git-hooks-best-practices\/"},{"link":"https:\/\/xcloud.host\/how-to-clone-a-wordpress-site-with-xcloud\/"},{"link":"https:\/\/xcloud.host\/schedule-tasks-with-cron-jobs\/"},{"link":"https:\/\/xcloud.host\/introducing-openlitespeed-server-in-xcloud\/"},{"link":"https:\/\/xcloud.host\/monitor-website-ram-and-cpu-usage\/"},{"link":"https:\/\/xcloud.host\/xcloud-march-release-notes\/"},{"link":"https:\/\/xcloud.host\/how-to-setup-staging-site-guide\/"},{"link":"https:\/\/xcloud.host\/types-of-website-hosting-services\/"},{"link":"https:\/\/xcloud.host\/use-playground-environments-in-xcloud\/"},{"link":"https:\/\/xcloud.host\/page-caching-redis-full-page-cache-fastcgi-caching\/"},{"link":"https:\/\/xcloud.host\/access-site-database-with-adminer-in-xcloud\/"},{"link":"https:\/\/xcloud.host\/migrate-wordpress-from-shared-hosting-to-cloud-server\/"},{"link":"https:\/\/xcloud.host\/tips-to-speed-up-wordpress-websites\/"},{"link":"https:\/\/xcloud.host\/100-free-credit-from-vultr-to-use-with-xcloud\/"},{"link":"https:\/\/xcloud.host\/use-mailgun-to-send-transactional-email\/"},{"link":"https:\/\/xcloud.host\/setup-amazon-aws-to-host-websites\/"},{"link":"https:\/\/xcloud.host\/set-up-your-first-server-in-xcloud\/"},{"link":"https:\/\/xcloud.host\/introducing-xcloud\/"},{"link":"https:\/\/xcloud.host\/shahjahan-jewel-joins-xcloud-as-partner\/"}]


// async function fetchLinks() {
//     const req = await request.newContext();
//     const response = await req.get('https://xcloud.host/wp-json/wp/v2/posts', {
//         params: {
//             _fields: 'link',
//             per_page: 5,
//             page: 1,
//         },
//     });

//     // Check if the response is successful
//     if (!response.ok()) {
//         throw new Error(`Failed to fetch posts: ${response.status()}`);
//     }

//     links = await response.json();
//     console.log(await response.headers());
    
//     // Ensure links array is not empty
//     if (links.length === 0) {
//         throw new Error('No links found in the response');
//     }
// }

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
});

test.afterAll(async () => {
    await page.close();
});

test.describe('Blog posts', async () => {
    for(const link of links) {
        const url = link.link; // TypeScript knows link is of the specified type
        console.log(`Creating test for link: ${link.link}`);
        test(`Blog page: ${url}`, async () => {
            await page.goto(url);
            await page.waitForLoadState('domcontentloaded', {timeout: 10 * 60 * 1000});

            const $sidebar = await page.locator('.eb-post-grid-posts-wrapper');
            const $gif_images = await page.locator('//img[substring(@src, string-length(@src) - 3) = ".gif"]');
            await expect(page).toHaveScreenshot({
                timeout: 3 * 60 * 1000,
                fullPage: true,
                mask: [$sidebar, $gif_images],
            });
        });
    };
})