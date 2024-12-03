import { type Page, expect } from "@playwright/test"
import { DBEngine, ServerProvider, ServerSize, ServerType } from "../ServerManager.class"
import { Site } from "../Site/Site.class"
import { vultrAPI } from "../../../config/secrets"

export class Server {
    private page: Page;
    private name: string = '';
    private ip: string = '';
    private dbEnging: DBEngine;
    private serverSize: string;
    serverId: string = '';
    private region: string = '';
    private serverType: ServerType;
    sites: Site[] = [];
    private options?: {
        backup_enable?: boolean;
        demo_server?: boolean;
        ip_doc?: boolean;
        billing?: boolean;
    };
    serverProvider: ServerProvider;
    constructor(
        page: Page,
        serverId: string | null = null,
        optional?: {
            serverProvider: ServerProvider;
            name: string;
            dbEnging: DBEngine;
            size: string;
            region: string;
            serverType: ServerType;
            options?: {
                backup_enable?: boolean;
                demo_server?: boolean;
                ip_doc?: boolean;
                billing?: boolean;
            };
        }
    ) {
        this.page = page;
        if (serverId === null) {
            if (!optional) {
                throw new Error('Optional properties must be provided if serverId is null.');
            }
            this.serverProvider = optional.serverProvider;
            this.name = optional.name;
            this.dbEnging = optional.dbEnging;
            this.serverSize = optional.size;
            this.region = optional.region;
            this.serverType = optional.serverType;
            this.options = optional.options;

        } else {
            // Initialize the server with the provided serverId
            this.serverId = serverId;
            // Additional logic for existing serverId can be added here
        }
    } 

    async provisionServer(): Promise<boolean> {
        try {
            console.log(this.serverProvider);
            // await page.goto('/server/create');
            // TODO: step-by-step go later.
            // TODO: Check pages if all is ok

            let url: string | null = null;
            let credential: object | null = null; 
            
            switch (this.serverProvider) {
                case ServerProvider.AWS:
                    url = '/credential/choose/aws';

                    break;
                case ServerProvider.DO:
                    url = '/credential/choose/digitalocean';

                    break;
                case ServerProvider.GCP:
                    url = '/server/create/gcp';

                    break;
                case ServerProvider.HETZNER:
                    url = '/credential/choose/hetzner';

                    break;
                case ServerProvider.VULTR:
                    url = '/credential/choose/vultr';
                    credential = vultrAPI

                    await this.page.goto(url);
                    await this.createVultrServer(credential);
                    return true;
                    break;
                default:
                    throw Error('Must pass a server Provider');
                    break;
            }

        } catch(e) {
            console.log(`Encounter Error while creating server: ${e}`);
            throw Error(e);
        }

        return false;
    }

    getServerId()
    {
        return this.serverId;
    }


    async createSite(
        name:string, 
        options?: { 
            phpVersion?: string, 
            wpVersion?: string,
        } 
    ): Promise<number> {
        
        const { phpVersion, wpVersion } = options || {};

        const site = new Site(
            this.page,
            this,
            null,
            {
                name: name,
                phpVersion: phpVersion,
                wpVersion: wpVersion,
            }
        );
    
        if(await site.provisionSite())
        {
            this.sites.push(site);
            return this.sites.length;
        }
        return -1;
        
    }

    // Private functions
    private async createVultrServer(credential)
    {
        // Setup VULTR api key each time..
        // TODO: Need to implement already saved password

        // For now i am implementing new account every time insteade of saved password
        const $chooseAccount = this.page.getByLabel('Select Existing or Connect New');
        await $chooseAccount.selectOption({label: 'Connect New Account'})
        await this.page.waitForTimeout(1000);

        await expect(this.page.getByText('Vultr Label')).toBeVisible();
        await this.page.getByPlaceholder('Label').pressSequentially(credential.label);
        await expect(this.page.getByText('Vultr API Key')).toBeVisible();
        await this.page.getByPlaceholder('API Key').fill(credential.api_key);

        await expect(this.page.getByPlaceholder('API Key')).toHaveAttribute('type', 'password');
        await this.page.getByTitle('Show Password').locator('i').click();
        await expect(this.page.getByPlaceholder('API Key')).toHaveAttribute('type', 'text');
        await this.page.getByTitle('Hide Password').locator('i').click();
        await expect(this.page.getByPlaceholder('API Key')).toHaveAttribute('type', 'password');

        await this.page.getByRole('button', { name: /Verify/ }).click();

        await this.page.waitForURL(/server\/create/);
        await this.page.waitForLoadState('domcontentloaded');

        await this.page.waitForTimeout(3000);
        const $cloudProviderSuccessMsg = this.page.getByRole('heading', { name: 'Cloud provider authorized' });
        await $cloudProviderSuccessMsg.waitFor();
        await expect($cloudProviderSuccessMsg).toBeVisible();

        // Do some checks.
        await expect(this.page.getByRole('heading', { name: /Set Up Your Server With/ })).toBeVisible();
        await expect(this.page.getByText('Connect xCloud with your')).toBeVisible();
        await expect(this.page.getByText('Provider Label')).toBeVisible();
        await expect(this.page.getByPlaceholder('VULTR')).toHaveAttribute('readonly');
        await expect(this.page.getByRole('button', { name: /Connected/ })).toBeVisible();
        await expect(this.page.getByText('Server Size', { exact: true })).toBeVisible();
        await expect(this.page.getByPlaceholder('Server Name')).toBeVisible();

        await this.page.getByPlaceholder('Server Name').pressSequentially(this.name);
        await this.page.getByLabel('Server Size').click();
        await this.page.getByLabel('Server Size').selectOption({ label: this.serverSize });

        await expect(this.page.getByLabel('Server Size')).toBeVisible(); //Check server size
        await this.page.waitForTimeout(5000); // Waiting 5s to load regions.
        await this.page.getByText('Choose region', { exact: true }).click();
        await this.page.getByLabel('Choose region').selectOption({ label: this.region });

        await expect(this.page.getByLabel('Choose region')).toBeVisible();  //Check choose region

        if(this.dbEnging === DBEngine.mariadb)
        {
            await this.page.locator('#database_type').click();
            await this.page.waitForTimeout(1000);
            await this.page.locator(".multiselect-option").filter({hasText: this.dbEnging}).click();
        }

        // Do some checks
        await expect(this.page.getByRole('heading', { name: 'Choose Web Server' })).toBeVisible();
        await expect(this.page.locator('label').filter({ hasText: 'NGINX' })).toBeVisible();
        await expect(this.page.locator('label').filter({ hasText: 'OpenLiteSpeed' })).toBeVisible();

        if (this.serverType === ServerType.nginx) {
            await this.page.locator('label').filter({ hasText: 'NGINX' }).click();
        } else {
            await this.page.locator('label').filter({ hasText: 'OpenLiteSpeed' }).click();
        }

        if (this.options) {
            if (this.options.backup_enable) {
                await this.page.locator('span').filter({ hasText: 'Enable Vultr Auto Backups (+$' }).first().check();
            }
            if (this.options.demo_server) {
                await this.page.locator('span').filter({ hasText: 'Demo Server for Billing Plan' }).first().check();
            }
            if (this.options.ip_doc) {
                await this.page.locator('span').filter({ hasText: 'I am sure that I\'ve read the' }).first().check();
            }
            if (this.options.billing) {
                await this.page.locator('span').filter({ hasText: 'I have understood that the' }).first().check();
            }
        }

        await this.page.getByRole('button', { name: 'Next' }).click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.getByRole('heading', {name: 'Setting Up Your Server'}).waitFor();

        await this.page.waitForURL(/\/progress/);
        await expect(this.page).toHaveURL(/.*progress/);

        const regx = /server\/(\d+)\/progress/;
        const match = this.page.url().match(regx);

        if(match) {
            this.serverId = match[1];
            console.log(`Server ID: ${match[1]}`);
            console.log(`Visit to check: ${this.page.url()}`);
        } else {
            console.log('No server found');

        }

        try {
            
            const waitForLocator = await Promise.race([
                this.page.waitForURL(/.*sites/, { timeout: 30 * 60 * 1000 }),
                this.page.getByRole('heading', { name: 'Something went wrong' }).waitFor({state: 'visible'}),
            ])
            console.log(waitForLocator);

            if(/server\/(\d+)\/sites/.test(this.page.url())) {
                console.log(`Server installstion successfull.`)
                console.log(`Visit Server: ${this.page.url()}`)
            } else if (await this.page.getByRole('heading', { name: 'Something went wrong' }).isVisible()) {
                console.log(`Failed to create server`);
                throw new Error('Failed to create server. x1');
            }
        } catch (e) {
            throw new Error('Failed to create server. x2');
        }


    }

}