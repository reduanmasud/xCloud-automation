import { type Page, expect, Locator, test } from "@playwright/test";
import { Server } from "../Server/Server.class";

export class Site {
    private name: string = '';
    private url: string = '';
    siteId: string = '';
    private server: Server | string;
    private phpVersion: string | null;
    private wpVersion: string | null;
    private blueprint: boolean = false;
    private fullPageCaching: boolean;
    private objectCaching: boolean;
    private emailService: boolean;
    private multisite: boolean;
    private page: Page;

    constructor(
        page: Page,
        server: Server | string,
        siteId: string | null = null,
        optional?: { 
            name: string; 
            phpVersion?: string;
            wpVersion?: string;
            bluepring?: boolean;
            multisite?: boolean;
            fullPageCaching?: boolean;
            objectCaching?: boolean;
            emailService?: boolean;
        }
    ) {
        this.page = page;
        if (typeof server === 'string') {
            //TODO: Implement Later
        } else if (server instanceof Server) {
            this.server = server;
        }

        if(siteId === null) {
            if(!optional) throw new Error('Optional properties must be provided if siteId is null');
            
            this.name = optional.name;
            this.phpVersion = optional.phpVersion||null;
            this.wpVersion = optional.wpVersion || 'latest';
            this.blueprint = optional.bluepring || false;
            this.fullPageCaching = optional.fullPageCaching || false;
            this.objectCaching = optional.objectCaching || false;
            this.emailService = optional.emailService || false;
            this.multisite = optional.multisite || false;

        }

    } 


    public async provisionSite(): Promise<boolean>
    {

        // await this.page.goto('/');
        // await this.page.waitForURL(/\/dashbaord/);

        //TODO: Before Going to server do a Server Check

        //Goto Install WordPress Page
        const serverId = typeof this.server === 'string' ? this.server : this.server.getServerId();
        let serverUrl = `/server/${serverId}/site/installWordPress`;
        await this.page.goto(serverUrl);
        await this.page.waitForURL(serverUrl);

        await this.page.getByPlaceholder('Site Title').fill(this.name);

        //TODO: Need to add options for select Go Live Or Demo Site
        //Currently I am going for Demo Site Only
        
        await this.page.getByText('Demo Site Create a demo site').click();

        //TODO: Condition for enabling multisite

        //TODO: Conditional Cacheing enable disable
        if(this.fullPageCaching === false)
            await this.page.locator('#enable_full_page_cache').locator('span').click();
        if(this.objectCaching === false)
            await this.page.locator('#enable_redis_object_cache').locator('span').click();


        //TODO: Email Provider Enable Disable
        if(this.emailService === false)
            await this.page.locator('#xcloud_default_email_provider').locator('span').click();

        //TODO: Blueprint Enable Disable
        if (this.blueprint === false) {
            await this.page.locator("xpath=//div[@class='flex wide-mobile:flex-wrap gap-2 items-center justify-between mb-4']").locator("label").click();
        }
        
        await this.page.waitForTimeout(2000);

        const $moreAdvanceSettingsButton = this.page.getByRole('button', {name: /More Advanced Settings/} );
        await $moreAdvanceSettingsButton.waitFor();
        await $moreAdvanceSettingsButton.click();

        const $phpVersionSelector = this.page.getByLabel('PHP Version');
        await $phpVersionSelector.click();
        await this.page.waitForTimeout(5000); // Waiting for 5 second to get php versions

        // Checking if phpVersion exists; then selecting that version of php
        if(this.phpVersion) {
            if(await this.hasOption($phpVersionSelector, this.phpVersion)) {
                await $phpVersionSelector.selectOption(this.phpVersion);
            } else {
                    console.log(`Option "${this.phpVersion}" not found`);
                    test.skip(true, `Option "${this.phpVersion}" not found`)
                    throw new Error(`Option "${this.phpVersion}" not found`);
            }
        }


        const $wordPressVersionSelector = this.page.getByLabel(`WordPress Version`);
        await $wordPressVersionSelector.click();
        await this.page.waitForTimeout(3000);

        await $wordPressVersionSelector.selectOption(this.wpVersion);
        await this.page.waitForTimeout(2000);

        const $nextButton = this.page.getByRole('button', {name: /Next/});
        $nextButton.waitFor();
        $nextButton.click();

        await this.page.waitForLoadState('domcontentloaded');
        await this.page.getByRole('heading', {name:'Setting Up Your Site' }).waitFor(); //Double-check
        await this.page.waitForURL(/.*progress/); // Triple-check

        await expect(this.page).toHaveURL(/.*progress/);
        await this.page.waitForLoadState('domcontentloaded');

        const regex = /server\/(\d+)\/site\/(\d+)/;
        const match = this.page.url().match(regex);


        if (match) {
            this.siteId = match[2];

            console.log(`Server ID: ${match[1]}, Site ID: ${match[2]}`);
            console.log(`Progress Site: ${this.page.url()}`);
        } else {
            console.log('No server or site ID match found');
        }

        const $retryButton = this.page.getByRole('button', {name: 'Retry'});
        const $reportIssueButton = this.page.getByRole('button', { name: 'Report an issue' });
        const $wentWrongText = this.page.getByRole('heading', { name: 'Something went wrong' });

        async function handleSiteInstallationFailure()
        {
            console.log("Something went wrong, reloading page...");
            await this.page.reload();

            if (await $retryButton.isVisible() && await $reportIssueButton.isVisible()) {
                await this.page.waitForTimeout(5000);

                console.log("Retrying...");
                await $retryButton.click();
                await this.page.waitForTimeout(5000);
                return await handleRaceCondition();
            } else if (await $retryButton.isHidden() && await $reportIssueButton.isVisible()) {
                throw new Error('Failed to create site. x1');
            }
        }

        async function handleRaceCondition() {
            const waitForLocator = await Promise.race([
                this.page.waitForURL(/.*site-overview/, { timeout: 60 * 60 * 1000 }),
                $wentWrongText.waitFor({ state: 'visible', timeout: 60 * 60 * 1000 })
            ]);
    
            if (/.*site-overview/.test(this.page.url())) {
                console.log('WordPress site installation completed successfully.');
            } else if (await $wentWrongText.isVisible()) {
                console.log("Site creation failed.");
                throw new Error('Failed to create site. x2');
            }
        }

        try {
            const waitForLocator = await Promise.race([
                this.page.waitForURL(/.*site-overview/, { timeout: 60 * 60 * 1000 }),
                $retryButton.waitFor({ state: 'visible', timeout: 60 * 60 * 1000 }),
                $reportIssueButton.waitFor({ state: 'visible', timeout: 60 * 60 * 1000 }),
                $wentWrongText.waitFor({ state: 'visible' })
            ]);
    
            if (/.*site-overview/.test(this.page.url())) {
    
                console.log('WordPress site installation completed successfully.');
                return true; 
                
            } else if (await $wentWrongText.isVisible()) {
                await handleSiteInstallationFailure();
            } else {
                throw new Error('Failed to create site. x3');
                
            }
        } catch (error) {
            console.log(`Error: ${error.message}`);
            throw new Error('Failed to create site. x4');
        }

        return false;

        
    }

    public async delete(page: Page) {

    }


    private async hasOption(element: Locator, value: string): Promise<boolean> {
        const options = await element.locator('option').all();  // Get all options inside the select element
    
        for (const option of options) {

            // @ts-ignore
            const optionValue = await option.textContent('value'); // Get the value attribute
            if (optionValue === value) {
                return true; // Option found
            }
        }
    
        return false; // Option not found
    }
    
}