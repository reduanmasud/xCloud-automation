import { test, expect, type Page } from "@playwright/test";
import { ServerProvider } from "../POM/functions/create_server";

let page: Page

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
});

test.afterAll(async () => {
    await page.close();
});

export interface ServerCredential {
    label: string;
    api_key: string;
}
export enum DBEnine {
    mysql = 'MySQL',
    mariadb = 'MariaDB'
}

export enum ServerType {
    nginx = 'NGINX',
    openlitespeed = 'OpenLiteSpeed'
}
// Union Types for Server Sizes
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

type DynamicServerSize<T extends ServerProvider> =
    T extends ServerProvider.VULTR ? VULTRServerSize :
    T extends ServerProvider.HETZNER ? HETZNERServerSize :
    never;


export type Server<T extends ServerProvider> = {
    provider: T;
    credential: ServerCredential;
    server_name: string;
    server_size: DynamicServerSize<T>;
    server_region: string;
    server_database: DBEnine;
    tag?: string[];
    server_type: ServerType;
    document_read?: boolean;
    understand_bill?: boolean;
}

export type MultiProviderServer =
    | Server<ServerProvider.VULTR>
    | Server<ServerProvider.HETZNER>
    | Server<ServerProvider.AWS>;

// const vultrServers: Server<ServerProvider.VULTR>[] = [
//     {
//         provider: ServerProvider.VULTR,
//         credential: {
//             label: "HEllo",
//             api_key: "Key"
//         },
//         server_name: "",
//         server_size: "1 vCPU / 1 GB RAM / 25 GB NVMe / 1 TB Bandwidth - $5/month",
//         server_region: "",
//         server_database: DBEnine.mariadb,
//         server_type: ServerType.nginx
//     }
// ]


const servers: MultiProviderServer[] = [
    {
        provider: ServerProvider.VULTR,
        credential: {
            label: "HEllo",
            api_key: "Key"
        },
        server_name: "",
        server_size: "1 vCPU / 1 GB RAM / 25 GB NVMe / 1 TB Bandwidth - $5/month",
        server_region: "",
        server_database: DBEnine.mariadb,
        server_type: ServerType.nginx
    },
    {
        provider: ServerProvider.HETZNER,
        credential: {
            label: "HEllo",
            api_key: "Key"
        },
        server_name: "",
        server_size: "CAX11 - (2 vCPU / 4 GB RAM / 40 GB DISK) - €3.29/Month",
        server_region: "",
        server_database: DBEnine.mariadb,
        server_type: ServerType.nginx
    }
]