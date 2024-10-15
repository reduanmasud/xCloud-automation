import { test, expect, type Page } from "@playwright/test";


export enum DBEngine {
    mysql = 'MySQL 8.0',
    mariadb = 'MariaDB 10.6'
}

export enum ServerProvider {
    VULTR = "Vultr",
    HETZNER = "Hetzner",
    GCP = "Google Cloud",
    AWS = "AWS",
    DO = "DigitalOcean"
}

export enum ServerType {
    nginx = 'NGINX',
    openlitespeed = 'OpenLiteSpeed'
}

// Define your server sizes and types as before...
export type VULTRServerSize =
    | "1 vCPU / 1 GB RAM / 25 GB NVMe / 1 TB Bandwidth - $5/month"
    | "1 vCPU / 1 GB RAM / 25 GB NVMe / 1 TB Bandwidth - $7.5/month"
    | "1 vCPU / 2 GB RAM / 55 GB NVMe / 2 TB Bandwidth - $10/month"
    | "1 vCPU / 2 GB RAM / 55 GB NVMe / 2 TB Bandwidth - $15/month"
    | "2 vCPUs / 2 GB RAM / 65 GB NVMe / 3 TB Bandwidth - $15/month"
    | "2 vCPUs / 2 GB RAM / 65 GB NVMe / 3 TB Bandwidth - $22.5/month"
    | "2 vCPUs / 4 GB RAM / 80 GB NVMe / 3 TB Bandwidth - $20/month"
    | "2 vCPUs / 4 GB RAM / 80 GB NVMe / 3 TB Bandwidth - $30/month"
    | "4 vCPUs / 8 GB RAM / 160 GB NVMe / 4 TB Bandwidth - $40/month"
    | "4 vCPUs / 8 GB RAM / 160 GB NVMe / 4 TB Bandwidth - $60/month"
    | "6 vCPUs / 16 GB RAM / 320 GB NVMe / 5 TB Bandwidth - $80/month"
    | "6 vCPUs / 16 GB RAM / 320 GB NVMe / 5 TB Bandwidth - $120/month"
    | "8 vCPUs / 32 GB RAM / 640 GB NVMe / 6 TB Bandwidth - $160/month"
    | "8 vCPUs / 32 GB RAM / 640 GB NVMe / 6 TB Bandwidth - $240/month"
    | "16 vCPUs / 64 GB RAM / 1280 GB NVMe / 10 TB Bandwidth - $320/month"
    | "16 vCPUs / 64 GB RAM / 1280 GB NVMe / 10 TB Bandwidth - $480/month"
    | "24 vCPUs / 96 GB RAM / 1600 GB NVMe / 15 TB Bandwidth - $640/month"
    | "24 vCPUs / 96 GB RAM / 1600 GB NVMe / 15 TB Bandwidth - $960/month"
    | "1 vCPU / 1 GB RAM / 32 GB NVMe / 1 TB Bandwidth - $6/month"
    | "1 vCPU / 1 GB RAM / 32 GB NVMe / 1 TB Bandwidth - $9/month"
    | "1 vCPU / 2 GB RAM / 64 GB NVMe / 2 TB Bandwidth - $12/month"
    | "1 vCPU / 2 GB RAM / 64 GB NVMe / 2 TB Bandwidth - $18/month"
    | "2 vCPUs / 2 GB RAM / 80 GB NVMe / 3 TB Bandwidth - $18/month"
    | "2 vCPUs / 2 GB RAM / 80 GB NVMe / 3 TB Bandwidth - $27/month"
    | "2 vCPUs / 4 GB RAM / 128 GB NVMe / 3 TB Bandwidth - $24/month"
    | "2 vCPUs / 4 GB RAM / 128 GB NVMe / 3 TB Bandwidth - $36/month"
    | "3 vCPUs / 8 GB RAM / 256 GB NVMe / 4 TB Bandwidth - $48/month"
    | "3 vCPUs / 8 GB RAM / 256 GB NVMe / 4 TB Bandwidth - $72/month"
    | "4 vCPUs / 16 GB RAM / 384 GB NVMe / 5 TB Bandwidth - $96/month"
    | "4 vCPUs / 16 GB RAM / 384 GB NVMe / 5 TB Bandwidth - $144/month"
    | "6 vCPUs / 24 GB RAM / 448 GB NVMe / 6 TB Bandwidth - $144/month"
    | "6 vCPUs / 24 GB RAM / 448 GB NVMe / 6 TB Bandwidth - $216/month"
    | "8 vCPUs / 32 GB RAM / 512 GB NVMe / 7 TB Bandwidth - $192/month"
    | "8 vCPUs / 32 GB RAM / 512 GB NVMe / 7 TB Bandwidth - $288/month"
    | "12 vCPUs / 48 GB RAM / 768 GB NVMe / 8 TB Bandwidth - $256/month"
    | "12 vCPUs / 48 GB RAM / 768 GB NVMe / 8 TB Bandwidth - $384/month"
    | "16 vCPUs / 58 GB RAM / 1024 GB NVMe / 9 TB Bandwidth - $320/month"
    | "16 vCPUs / 58 GB RAM / 1024 GB NVMe / 9 TB Bandwidth - $480/month"
    | "1 vCPU / 1 GB RAM / 25 GB NVMe / 2 TB Bandwidth - $6/month"
    | "1 vCPU / 1 GB RAM / 25 GB NVMe / 2 TB Bandwidth - $9/month"
    | "1 vCPU / 2 GB RAM / 50 GB NVMe / 3 TB Bandwidth - $10/month"
    | "1 vCPU / 2 GB RAM / 50 GB NVMe / 3 TB Bandwidth - $15/month"
    | "2 vCPUs / 2 GB RAM / 80 GB NVMe / 4 TB Bandwidth - $15/month"
    | "2 vCPUs / 2 GB RAM / 80 GB NVMe / 4 TB Bandwidth - $22.5/month"
    | "2 vCPUs / 4 GB RAM / 160 GB NVMe / 5 TB Bandwidth - $30/month"
    | "2 vCPUs / 4 GB RAM / 160 GB NVMe / 5 TB Bandwidth - $40/month"
    | "4 vCPUs / 8 GB RAM / 320 GB NVMe / 6 TB Bandwidth - $60/month"
    | "4 vCPUs / 8 GB RAM / 320 GB NVMe / 6 TB Bandwidth - $80/month"
    | "8 vCPUs / 16 GB RAM / 640 GB NVMe / 7 TB Bandwidth - $120/month"
    | "8 vCPUs / 16 GB RAM / 640 GB NVMe / 7 TB Bandwidth - $160/month";

export type HETZNERServerSize =
    | "CX11 - (1 vCPU / 2 GB RAM / 20 GB DISK) - €3.29/Month"
    | "CX22 - (2 vCPU / 4 GB RAM / 40 GB DISK) - €3.29/Month"
    | "CX32 - (4 vCPU / 8 GB RAM / 80 GB DISK) - €6.3/Month"
    | "CX42 - (8 vCPU / 16 GB RAM / 160 GB DISK) - €15.9/Month"
    | "CX52 - (16 vCPU / 32 GB RAM / 320 GB DISK) - €31.9/Month"
    | "CPX 11 - (2 vCPU / 2 GB RAM / 40 GB DISK) - €3.85/Month"
    | "CPX 21 - (3 vCPU / 4 GB RAM / 80 GB DISK) - €7.05/Month"
    | "CPX 31 - (4 vCPU / 8 GB RAM / 160 GB DISK) - €13.1/Month"
    | "CPX 41 - (8 vCPU / 16 GB RAM / 240 GB DISK) - €24.7/Month"
    | "CPX 51 - (16 vCPU / 32 GB RAM / 360 GB DISK) - €54.4/Month"
    | "CAX11 - (2 vCPU / 4 GB RAM / 40 GB DISK) - €3.29/Month"
    | "CAX21 - (4 vCPU / 8 GB RAM / 80 GB DISK) - €5.99/Month"
    | "CAX31 - (8 vCPU / 16 GB RAM / 160 GB DISK) - €11.99/Month"
    | "CAX41 - (16 vCPU / 32 GB RAM / 320 GB DISK) - €23.99/Month"
    | "CCX13 Dedicated CPU - (2 vCPU / 8 GB RAM / 80 GB DISK) - €11.99/Month"
    | "CCX23 Dedicated CPU - (4 vCPU / 16 GB RAM / 160 GB DISK) - €23.99/Month"
    | "CCX33 Dedicated CPU - (8 vCPU / 32 GB RAM / 240 GB DISK) - €47.99/Month"
    | "CCX43 Dedicated CPU - (16 vCPU / 64 GB RAM / 360 GB DISK) - €95.99/Month"
    | "CCX53 Dedicated CPU - (32 vCPU / 128 GB RAM / 600 GB DISK) - €191.99/Month"
    | "CCX63 Dedicated CPU - (48 vCPU / 192 GB RAM / 960 GB DISK) - €287.99/Month";

export type GCServerSize = 'g1-standard-1' | 'g2-standard-2';
export type AWSServerSize = 't2.micro' | 't2.small';
export type DOServerSize = 's-1vcpu-2gb' | 's-2vcpu-4gb';


// Union of all possible server sizes
export type ServerSize = VULTRServerSize | HETZNERServerSize | GCServerSize | AWSServerSize | DOServerSize;

export interface ServerCredential {
    label: string;
    api_key: string;
}

type DynamicServerSize<T extends ServerProvider> =
    T extends ServerProvider.VULTR ? VULTRServerSize :
    T extends ServerProvider.HETZNER ? HETZNERServerSize :
    T extends ServerProvider.AWS ? AWSServerSize :
    T extends ServerProvider.GCP ? GCServerSize :
    T extends ServerProvider.DO ? DOServerSize :
    never;


export type Server<T extends ServerProvider> = {
    provider: T;
    credential: ServerCredential;
    server_name: string;
    server_size: DynamicServerSize<T>;
    server_region: string;
    server_database: DBEngine;
    tag?: string[];
    server_type: ServerType;
    options?: {
        backup_enable?: boolean,
        demo_server?: boolean,
        ip_doc?: boolean,
        billing?: boolean
    }
}

export type MultiProviderServer =
    | Server<ServerProvider.VULTR>
    | Server<ServerProvider.HETZNER>
    | Server<ServerProvider.AWS>
    | Server<ServerProvider.DO>
    | Server<ServerProvider.GCP>;

export class ServerManager {
    private servers: MultiProviderServer[] = [];
    public page: Page;

    constructor(page: Page) {
        this.page = page; // Set the page property when the class is instantiated
    }

    public async createServer<T extends ServerProvider>(
        provider: T,
        credential: ServerCredential,
        server_name: string,
        server_size: DynamicServerSize<T>,
        server_region: string,
        server_database: DBEngine,
        server_type: ServerType,
        tag?: string[],
        options?: {
            backup_enable?: boolean,
            demo_server?: boolean,
            ip_doc?: boolean,
            billing?: boolean
        }
    ): Promise<Server<T>> {
        const newServer: Server<T> = {
            provider,
            credential,
            server_name,
            server_size,
            server_region,
            server_database,
            server_type,
            tag,
            options
        };

        await this.page.goto('/server/create');
        const providerLocator = await this.page.locator(`//fieldset[@class='grid grid-cols-2 wide-tablet:grid-cols-1 w-full gap-30px wide-tablet:gap-25px wide-mobile:gap-20px']/div`);
        await providerLocator.filter({ hasText: provider }).click();

        await this.page.waitForURL(/credential\/choose/);
        await expect(this.page.getByLabel('Select Existing or Connect New')).toBeVisible();
        await this.page.getByLabel('Select Existing or Connect New').selectOption({ label: "Connect New Account" })
        await this.page.waitForTimeout(3000);


        switch (provider) {
            case ServerProvider.VULTR:

                await expect(this.page.getByText('Vultr Label')).toBeVisible();
                await this.page.getByPlaceholder('Label').pressSequentially(credential.label);

                await expect(this.page.getByText('Vultr API Key')).toBeVisible();
                await this.page.getByPlaceholder('API Key').fill(credential.api_key);

                //Check if type is password:
                await expect(this.page.getByPlaceholder('API Key')).toHaveAttribute('type', 'password');
                await this.page.getByTitle('Show Password').locator('i').click();
                await expect(this.page.getByPlaceholder('API Key')).toHaveAttribute('type', 'text');
                await this.page.getByTitle('Hide Password').locator('i').click();
                await expect(this.page.getByPlaceholder('API Key')).toHaveAttribute('type', 'password');
                await this.page.getByRole('button', { name: /Verify/ }).click();
                break;

            default:
                break;
        }

        await this.page.waitForURL(/server\/create/);
        await this.page.waitForLoadState('domcontentloaded');

        await this.page.waitForTimeout(3000);
        await this.page.getByRole('heading', { name: 'Cloud provider authorized' }).waitFor();
        await expect(this.page.getByRole('heading', { name: 'Cloud provider authorized' })).toBeVisible();

        switch (provider) {
            case ServerProvider.VULTR:
                await expect(this.page.getByRole('heading', { name: 'Set Up Your Server With vultr' })).toBeVisible();
                await expect(this.page.getByText('Connect xCloud with your')).toBeVisible();
                await expect(this.page.getByText('Provider Label')).toBeVisible();
                await expect(this.page.getByPlaceholder('VULTR')).toHaveAttribute('readonly');
                await expect(this.page.getByRole('button', { name: /Connected/ })).toBeVisible();
                await expect(this.page.getByText('Server Size', { exact: true })).toBeVisible();
                await expect(this.page.getByPlaceholder('Server Name')).toBeVisible();
                await this.page.getByPlaceholder('Server Name').pressSequentially(server_name);
                await this.page.getByLabel('Server Size').click();
                await this.page.getByLabel('Server Size').selectOption({ label: server_size });
                await expect(this.page.getByLabel('Server Size')).toBeVisible();
                await this.page.waitForTimeout(5000);
                await this.page.getByText('Choose region', { exact: true }).click();
                await this.page.getByLabel('Choose region').selectOption({ label: server_region });
                await expect(this.page.getByLabel('Server Size')).toBeVisible();

                if(server_database === DBEngine.mariadb)
                {
                    await this.page.locator('#database_type').click();
                    await this.page.waitForTimeout(1000);
                    await this.page.locator(".multiselect-option").filter({hasText: server_database}).click();
                }
                //TODO: Tag need to implement

                break;

            default:
                break;
        }

        await expect(this.page.getByRole('heading', { name: 'Choose Web Server' })).toBeVisible();
        await expect(this.page.locator('label').filter({ hasText: 'NGINX' })).toBeVisible();
        await expect(this.page.locator('label').filter({ hasText: 'OpenLiteSpeed' })).toBeVisible();

        if (server_type === ServerType.nginx) {
            await this.page.locator('label').filter({ hasText: 'NGINX' }).click();
        } else {
            await this.page.locator('label').filter({ hasText: 'OpenLiteSpeed' }).click();
        }

        if (options) {
            if (options.backup_enable) {
                await this.page.locator('span').filter({ hasText: 'Enable Vultr Auto Backups (+$' }).first().check();
            }
            if (options.demo_server) {
                await this.page.locator('span').filter({ hasText: 'Demo Server for Billing Plan' }).first().check();
            }
            if (options.ip_doc) {
                await this.page.locator('span').filter({ hasText: 'I am sure that I\'ve read the' }).first().check();
            }
            if (options.billing) {
                await this.page.locator('span').filter({ hasText: 'I have understood that the' }).first().check();
            }
        }

        await this.page.getByRole('button', { name: 'Next' }).click();
        await this.page.waitForURL(/\/progress/);
        await this.page.waitForTimeout(1000);
        await this.page.waitForTimeout(1000);
        await this.page.waitForTimeout(1000);
        await this.page.waitForTimeout(1000);
        await this.page.waitForTimeout(1000);
        await this.page.getByText(/\[1\/28]*./);
        
        await this.page.waitForTimeout(1000);
        await this.page.waitForTimeout(1000);
        await this.page.waitForTimeout(1000);
        await this.page.waitForTimeout(10000000);
        this.servers.push(newServer as MultiProviderServer);
        return newServer;
    }

    public createServers(servers: MultiProviderServer[]): MultiProviderServer[] {



        return this.servers;
    }

    // public getServers(): MultiProviderServer[] {
    //     return this.servers;
    // }
}

// Usage example
// const serverManager = new ServerManager();

// // Creating a single server
// const vultrServer = serverManager.createServer(
//     ServerProvider.VULTR,
//     { label: "Hello", api_key: "Key" },
//     "MyVultrServer",
//     "1 vCPU / 1 GB RAM / 25 GB NVMe / 1 TB Bandwidth - $5/month",
//     "us-west-1",
//     DBEngine.mariadb,
//     ServerType.nginx
// );

// Creating multiple servers
// const multipleServers = serverManager.createServers([
//     {
//         provider: ServerProvider.HETZNER,
//         credential: { label: "Hello", api_key: "Key" },
//         server_name: "MyHetznerServer",
//         server_size: "CX11 - (1 vCPU / 2 GB RAM / 20 GB DISK) - €3.29/Month",
//         server_region: "eu-central-1",
//         server_database: DBEngine.mysql,
//         server_type: ServerType.openlitespeed,
//     },
//     // Add more servers as needed...
// ]);

// Getting all servers
// const allServers = serverManager.getServers();
// console.log(allServers);
