import { type Page, expect, Locator, test } from "@playwright/test";
import { Server } from "../Server/Server.class";
export enum PageStatus {
    OK = "OK",
    NOT_FOUND = "NOT_FOUND",
    PERMISSION_ERROR = "PERMISSION_ERROR",
    SERVER_ERROR = "SERVER_ERROR"
}

export class Site {
    private name: string = '';
    private url: string = '';
    siteId: string = '';
    private server: Server;
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
        server: Server,
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

    private gotoReturnStatus(response) {
        
            
            if(response.status() >= 200 && response.status() < 300) {
                return PageStatus.OK;
            } else if(response.status() >= 300 && response.status() < 400) {
                return PageStatus.PERMISSION_ERROR;
            } else if (response.status() >= 400 && response.status() < 500) {
                return PageStatus.NOT_FOUND;
            } else {
                return PageStatus.SERVER_ERROR;
            }
    }
    public async gotoMonitoringPage(): Promise<PageStatus> {
        const url = `/server/${this.server.getServerId()}/site/${this.siteId}/monotoring`;
        const response = await this.page.goto(url); 
        
        if(!response) {
            throw new Error(`Url does not exists or server is down: ${url}`);
        }

        if(!this.page.url().includes(url))
        {
            console.log(`${url} is redirected to ${this.page.url()}`);
        }

        return this.gotoReturnStatus(response);
        
    }

    public async gotoLogsPage() {
        await this.page.goto(`/server/${this.server.getServerId()}/site/${this.siteId}/logs`);
    }

    public async gotoEventsPage() {
        await this.page.goto(`/server/${this.server.getServerId()}/site/${this.siteId}/events`); 
    }

    public async gotoSiteOverviewPage() {
        await this.page.goto(`/server/${this.server.getServerId()}/site/${this.siteId}/site-overview`); 
    }

    public async gotoGoLivePage() {
        await this.page.goto(`/server/${this.server.getServerId()}/site/${this.siteId}/staging_environment`); 
    }

    public async gotoSslHttpsPage() {
        await this.page.goto(`/server/${this.server.getServerId()}/site/${this.siteId}/ssl`); 
    }
    
    public async gotoRedirectionPage() {
        await this.page.goto(`/server/${this.server.getServerId()}/site/${this.siteId}/redirection`); 
    }

    public async gotoWpConfigPage() {
        await this.page.goto(`/server/${this.server.getServerId()}/site/${this.siteId}/wp-config`); 
    }

    public async gotoUpdatesPage() {
        await this.page.goto(`/server/${this.server.getServerId()}/site/${this.siteId}/updates`); 
    }

    public async gotoCachingPage() {
        await this.page.goto(`/server/${this.server.getServerId()}/site/${this.siteId}/caching`); 
    }
    
    public async gotoVulnerabilityScanPage() {
        await this.page.goto(`/server/${this.server.getServerId()}/site/${this.siteId}/vulnerability-scan`); 
    }

    public async gotoEmailConfigurationPage() {
        await this.page.goto(`/server/${this.server.getServerId()}/site/${this.siteId}/email-configuration`); 
    }

    public async gotoPreviousBackupPage() {
        await this.page.goto(`/server/${this.server.getServerId()}/site/${this.siteId}/backups`); 
    }

    public async gotoBackupSettingsPage() {
        await this.page.goto(`/server/${this.server.getServerId()}/site/${this.siteId}/backup`); 
    }

    public async gotoSshSftpPage() {
        await this.page.goto(`/server/${this.server.getServerId()}/site/${this.siteId}/ssh`); 
    }

    public async gotoDatabasePage() {
        await this.page.goto(`/server/${this.server.getServerId()}/site/${this.siteId}/database`); 
    }

    public async gotoFileManagerPage() {
        await this.page.goto(`/server/${this.server.getServerId()}/site/${this.siteId}/file-manager`); 
    }

    public async gotoNginxAndSecurityPage() {
        await this.page.goto(`/server/${this.server.getServerId()}/site/${this.siteId}/web-server-security`); 
    }

    public async gotoNginxCustomizationPage() {
        await this.page.goto(`/server/${this.server.getServerId()}/site/${this.siteId}/nginx-customization`); 
    }

    public async gotoBasicAuthenticationPage() {
        await this.page.goto(`/server/${this.server.getServerId()}/site/${this.siteId}/basic-authentication`); 
    }

    public async gotoCommandsPage() {
        await this.page.goto(`/server/${this.server.getServerId()}/site/${this.siteId}/commands`); 
    }

    public async gotoIpManagementPage() {
        await this.page.goto(`/server/${this.server.getServerId()}/site/${this.siteId}/ip-management`); 
    }

    public async gotoSiteSettingsPage() {
        await this.page.goto(`/server/${this.server.getServerId()}/site/${this.siteId}/settings`); 
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
        await page.goto(`/server/${this.server.getServerId()}/site/${this.siteId}/settings`);
        await page.waitForURL(/.*settings/);
        await page.waitForLoadState('domcontentloaded');

        await page.getByRole('button', {name: 'Delete Site'}).click();
        await page.waitForTimeout(2000);

        await page.getByPlaceholder('Type site name to confirm').fill(this.name);
        await page.getByRole('button', {name: 'Delete'}).click();
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