import { test, expect, type Page } from '@playwright/test';
import { Server } from "../POM/Classes/Server/Server.class"
import { ServerType } from '../POM/Classes/ServerManager.class';



let page: Page;
let servers: { [key:string]: Server} = {};
let sites = [
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
]


test.describe.configure({mode: 'serial'});


test.beforeAll(async ({browser}) => {
    page = await browser.newPage();

    // Different Servers --
    servers['vultrNginx']   = await new Server(page, 'id').init();
    // servers['vultrOls']     = await new Server(page, 'id').init();
    // servers['hetznerNginx'] = await new Server(page, 'id').init();
    // servers['hetznerOls']   = await new Server(page, 'id').init();
    // servers['awsNginx']     = await new Server(page, 'id').init();
    // servers['awsOls']       = await new Server(page, 'id').init();
    // servers['gcpNginx']     = await new Server(page, 'id').init();
    // servers['gcpOls']       = await new Server(page, 'id').init();
    // servers['linodeNginx']  = await new Server(page, 'id').init();
    // servers['linodeOls']    = await new Server(page, 'id').init();
    // servers['xCloudManagedNginx'] = await new Server(page, 'id').init();
    // servers['xCloudManagedOls']   = await new Server(page, 'id').init();
    // servers['xCloudProviderNginx']= await new Server(page, 'id').init();
    // servers['xCloudProvicerOls']  = await new Server(page, 'id').init();
    // servers['arm_server']   = await new Server(page, 'id').init();
    // servers['mariaDbServer']= await new Server(page, 'id').init();
});

for(const [key, server] of Object.entries(servers))
{
  const _sites = sites.filter((site) => site.supportedServerType.includes(server.getServerType()));
  _sites.forEach((site) => {
    test(`Create site at ${server.getServerId()} named ${site.title}`, async ()=> {
      let _site = await server.createSite(site.title, {
        phpVersion: site.phpVersion,
        wpVersion: site.wpVersion,
        fullObjectCaching: true,
        objectCaching: true
      });

      await _site?.gotoSiteDashboard();
      await expect(page).toHaveTitle(/Overview/);


    })
  });
  
}
