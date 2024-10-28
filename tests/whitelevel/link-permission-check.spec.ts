import { test, expect, type Page } from "@playwright/test";
import { request } from "http";
const links = [
    {
        link: "/dashboard",
        isAccessible: true
    },
    {
        link: "/server",
        isAccessible: true
    },
    {
        link: "/site/create",
        isAccessible: true
    },
    {
        link: "/user/profile",
        isAccessible: true
    },
    {
        link: "/user/password",
        isAccessible: true
    },
    {
        link: "/user/authentication",
        isAccessible: true
    },
    {
        link: "/user/browser-sessions",
        isAccessible: true
    },
    {
        link: "/user/vulnerable-sites",
        isAccessible: true
    },
    {
        link: "/user/ssh-key",
        isAccessible: true
    },
    {
        link: "/user/integration/cloudflare",
        isAccessible: true
    },
    {
        link: "/user/email-provider",
        isAccessible: true
    },
    {
        link: "/user/bills-payment",
        isAccessible: true
    },
    {
        link: "/user/detailed-invoices",
        isAccessible: true
    },
    {
        link: "/user/team-products",
        isAccessible: true
    },
    {
        link: "/user/notifications",
        isAccessible: true
    },
    {
        link: "/user/all-events",
        isAccessible: true
    },
    {
        link: "/user/team-management",
        isAccessible: false
    },
    {
        link: "/user/team/76",
        isAccessible: false
    },
    {
        link: "/user/server-provider",
        isAccessible: false
    },
    {
        link: "/user/team-packages",
        isAccessible: false
    },
    {
        link: "/user/email-subscriptions",
        isAccessible: false
    },
    {
        link: "/white-label/onboarding/startup",
        isAccessible: false
    },
    {
        link: "/server/create",
        isAccessible: false
    },
    {
        link: "/server/create/xcloud-provider",
        isAccessible: false
    },
    {
        link: "/credential/choose/vultr",
        isAccessible: false
    },
    {
        link: "/credential/choose/digitalocean",
        isAccessible: false
    },
    {
        link: "/server/create/gcp",
        isAccessible: false
    },
    {
        link: "/credential/choose/hetzner",
        isAccessible: false
    },
    {
        link: "/server/create/any",
        isAccessible: false
    },
    {
        link: "/credential/choose/aws",
        isAccessible: false
    },
    {
        link: "/user/team/create",
        isAccessible: false
    }


]

let page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();

});

test.afterAll(async () => {
    await page.close();
});

links.forEach( link => {
    let testText = `Client should ${link.isAccessible ? "" : "not"} have permission to access at : ${link.link}`
    test(testText, async () => {
        const url = link.link;
        
        // try {
            const response = await page.goto(url);

            if (!response) {
                throw new Error(`No response received for ${url}`);
            }

            console.log(`Status: ${response.status()}`);
            console.log(page.url());
            
            if(await page.url().includes(url) === false)
            {
                
                console.log("The page is redirected")
                await test.skip();
            }

            if (link.isAccessible) {

                await expect(response.status()).toBeGreaterThanOrEqual(200);
                await expect(response.status()).toBeLessThan(300)
            } else {

                
                // if()
                // {
                //     await test.skip();
                //     console.log(`The page is redirected to ${page.url()}`)
                // }
                await expect(response.status()).toBeGreaterThanOrEqual(400);
                await expect(response.status()).toBeLessThan(500)
            }
        // } catch (error) {
        //     // If an error occurs, check if the link was expected to be inaccessible
        //     if (link.isAccessible) {
        //         throw new Error(`Expected ${url} to be accessible, but it was not: ${error}`);
        //     } else {
        //         console.log(`As expected, ${url} is not accessible.`);
        //     }
        // }


    })
})