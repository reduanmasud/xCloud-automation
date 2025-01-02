import { Page } from "@playwright/test";
import { ServerType } from "./Classes/ServerManager.class";

export async function waitForText(page: Page, selectiorText: string, text: string) {
    const pattern = new RegExp(`${text}(.)*`);
    await page.locator('role=main', { hasText: pattern })
        .waitFor({ state: 'visible', timeout: 300000 });
}


export const sites = (type?: ServerType) => {
    const _s = [
        {
            title: 'PHP56',
            phpVersion: '5.6',
            wpVersion: '6.2',
            supportedServerType: [ServerType.nginx],
        },
        {
            title: 'PHP70',
            phpVersion: '7.0',
            wpVersion: '6.5',
            supportedServerType: [ServerType.nginx],
        },
        {
            title: 'PHP71',
            phpVersion: '7.1',
            wpVersion: '6.5',
            supportedServerType: [ServerType.nginx],
        },
        {
            title: 'PHP72',
            phpVersion: '7.2',
            wpVersion: '6.7',
            supportedServerType: [ServerType.nginx],
        },
        {
            title: 'PHP73',
            phpVersion: '7.3',
            wpVersion: '6.7',
            supportedServerType: [ServerType.nginx],
        },
        {
            title: 'PHP74',
            phpVersion: '7.4',
            wpVersion: '6.7',
            supportedServerType: [ServerType.nginx, ServerType.openlitespeed],
        },
        {
            title: 'PHP80',
            phpVersion: '8.0',
            wpVersion: 'latest',
            supportedServerType: [ServerType.nginx, ServerType.openlitespeed],
        },
        {
            title: 'PHP81',
            phpVersion: '8.1',
            wpVersion: 'latest',
            supportedServerType: [ServerType.nginx, ServerType.openlitespeed],
        },
        {
            title: 'PHP82',
            phpVersion: '8.2',
            wpVersion: 'latest',
            supportedServerType: [ServerType.nginx, ServerType.openlitespeed],
        },
        {
            title: 'PHP83',
            phpVersion: '8.3',
            wpVersion: 'latest',
            supportedServerType: [ServerType.nginx, ServerType.openlitespeed],
        },
        {
            title: 'PHP84',
            phpVersion: '8.4',
            wpVersion: 'latest',
            supportedServerType: [ServerType.nginx],
        }
    ];

    if(type === ServerType.nginx) {
        return _s.filter((s)=>{
            return s.supportedServerType.includes(type);
        })
    } else if ( type === ServerType.openlitespeed) {
        return _s.filter((s) => s.supportedServerType.includes(type));
    } else {
        return _s;
    }
}