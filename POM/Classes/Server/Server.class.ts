import { type Page, expect } from "@playwright/test"
import { DBEngine, ServerProvider, ServerSize, ServerType } from "../ServerManager.class"
import { Site } from "../Site/Site.class"
import { vultrAPI } from "../../../config/secrets"
type ServerStatusChange = {
    event: string;
    id: number;
    status: string;
    state: string;
    redirect: string | null;
};
/**
 * @type class
 */
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

    /**
     * Constructs a Server instance.
     * @param {Page} page - The Playwright `Page` instance for browser interaction.
     * @param {string | null} [serverId=null] - The unique identifier for the server, if available, If u give id, no need to pass optional datas
     * @param {object} [optional] - Optional configuration for the server.
     * @param {ServerProvider} optional.serverProvider - The server provider (e.g., AWS, GCP).
     * @param {string} optional.name - The name of the server.
     * @param {DBEngine} optional.dbEnging - The database engine used by the server.
     * @param {string} optional.size - The size or specification of the server.
     * @param {string} optional.region - The hosting region for the server.
     * @param {ServerType} optional.serverType - The type of server (e.g., production, staging).
     * @param {object} [optional.options] - Additional options for server configuration.
     * @param {boolean} [optional.options.backup_enable] - Indicates if backups are enabled.
     * @param {boolean} [optional.options.demo_server] - Specifies if this is a demo server.
     * @param {boolean} [optional.options.ip_doc] - Indicates if IP documentation is enabled.
     * @param {boolean} [optional.options.billing] - Indicates if billing is enabled for this server.
     */
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

    /**
     * Provisions a server based on the configured server provider.
     * @returns {Promise<boolean>} - Resolves to `true` if the server is successfully provisioned, otherwise `false`.
     * @throws {Error} - If an error occurs during server provisioning.
     */
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

    /**
     * Retrieves the server ID.
     * @returns {string} - The unique server ID.
     */
    getServerId()
    {
        return this.serverId;
    }

    /**
     * Creates and provisions a new site on the server.
     * @param {string} name - The name of the site to create.
     * @param {Object} [options] - Optional settings for the site.
     * @param {string} [options.phpVersion] - The PHP version to use for the site.
     * @param {string} [options.wpVersion] - The WordPress version to use for the site.
     * @returns {Promise<number>} - Returns the total number of sites if successful, or -1 if provisioning fails.
     */
    async createSite(
        name:string, 
        options?: { 
            phpVersion?: string, 
            wpVersion?: string,
            fullObjectCaching?: boolean,
            objectCaching?: boolean,
        } 
    ): Promise<number> {
        
        const { phpVersion, wpVersion, fullObjectCaching, objectCaching } = options || {};

        const site = new Site(
            this.page,
            this,
            null,
            {
                name: name,
                phpVersion: phpVersion,
                wpVersion: wpVersion,
                fullPageCaching: fullObjectCaching,
                objectCaching: objectCaching
            }
        );
    
        if(await site.provisionSite())
        {
            this.sites.push(site);
            return this.sites.length;
        }
        return -1;
        
    }

    async delete()
    {
        await this.page.goto(`server/${this.serverId}/sites`);
        await this.page.getByRole('button', { name: 'Actions' }).click();
        await this.page.getByRole('menuitem', { name: 'Delete Server' }).click();

        const $deleteFromProvider = this.page.locator('label').filter({ hasText: 'Enable this to delete this' }).locator('span').nth(0); 
        
        if (await $deleteFromProvider.isVisible()) {
            await $deleteFromProvider.click();
        }

        await this.page.getByPlaceholder('Type server name to confirm').click()
        await this.page.getByPlaceholder('Type server name to confirm').pressSequentially(this.name);

        await this.page.locator('footer').filter({ hasText: 'Delete' }).getByRole('button').click()
        

        // try {
        //     await this.waitForServerDeletion();
        //     console.log('Server deletion confirmed.');

        // } catch (error){
        //     console.error(`Error: ${error.message}`);
        // }

    }


    // private async waitForServerDeletion() {
    //     return new Promise<void>((resolve, reject) => {
    //         // Set up a console event listener to log messages
    //         this.page.on('console', (message) => {
    //             // console.log(`[${message.type()}]: ${message.text()}`);
    //             // You can also add checks here to see if the specific event indicates the server has been deleted
    //             let e = this.parseEventText(message.text());
    //             console.log(e);
    //             if(e.event == "ServerStatusChanged" && e.state =="deletion_failed")
    //             {
    //                 resolve();
    //                 //reject(new Error('Server Delation Failed'));
    //             }

    //         });
    
    //         // Set a timeout to avoid waiting indefinitely
    //         setTimeout(() => {
    //             reject(new Error('Timeout waiting for server deletion'));
    //         }, 60000);  // Wait for 30 seconds max
    //     });
    // }
    
    
    //Helper Function 
    
    
    private parseEventText(inputString: string): ServerStatusChange {
        // Regular expression to capture event name and key-value pairs
        const eventRegex = /^(\w+)/; // Captures the event name (e.g., ServerStatusChanged)
        const keyValueRegex = /(\w+): (\w+|null|\d+)/g; // Captures key-value pairs
        
        const eventMatch = inputString.match(eventRegex);
        const eventName = eventMatch ? eventMatch[1] : 'UnknownEvent'; // Default to 'UnknownEvent' if not found
        
        let match;
        const jsonObject: Partial<ServerStatusChange> = {}; // Use Partial for intermediate object
    
        // Extract key-value pairs from the input string
        while ((match = keyValueRegex.exec(inputString)) !== null) {
            const key = match[1];
            const value = match[2] === 'null' ? null : isNaN(match[2]) ? match[2] : Number(match[2]);
    
            if (key === "id") {
                jsonObject.id = value as number;
            } else if (key === "status") {
                jsonObject.status = value as string;
            } else if (key === "state") {
                jsonObject.state = value as string;
            } else if (key === "redirect") {
                jsonObject.redirect = value as string | null;
            }
        }
    
        jsonObject.event = eventName;  // Add the dynamic event name
    
        return jsonObject as ServerStatusChange;
    }
    
    
    
    /**
     * Connects to a Vultr account by selecting an existing account or adding a new one.
     * @param {Object} credential - The credential object for the Vultr account.
     * @throws Will throw an error if account verification fails.
     */
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

    /**
     * Loads server data by navigating to the server metadata page and extracting the server name.
     * Updates the `name` property with the server's name if successfully retrieved.
     * @throws Will log an error if the navigation or data extraction fails.
     * @async
     */
    async loadData() {
        if(this.serverId == null) return;
        try {
            await this.page.goto(`/server/${this.serverId}/meta`);
            const $serverName = this.page
                .locator('div')
                .filter({ hasText: /^Server Name$/ })
                .getByRole('textbox');
            this.name = await $serverName.inputValue();
        } catch (error) {
            console.error('Failed to set server info:', error);
        }
    }
    
}