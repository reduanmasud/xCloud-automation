import { test, expect, type Page } from '@playwright/test';
import { Server } from "../POM/Classes/Server/Server.class"
import { ServerType } from '../POM/Classes/ServerManager.class';
import { Site } from '../POM/Classes/Site/Site.class';



let page: Page;
let servers: { [key:string]: Server} = {};
let vs: Server;


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

    // try {
    //   vs = await new Server(page, '136').init();
    //   if (!vs) throw new Error("Server initialization failed.");
    //   console.log(`Server initialized with ID: ${vs.getServerId()}`);
    //   } catch (e) {
    //       console.error("Error during server initialization:", e);
    //       throw e;
    //   }
    // Different Servers --
    try {
      // vs = await new Server(page, '2815').init();
    // servers['vultrNginx']   = await new Server(page, 'id').init();
    // servers['vultrOls']     = await new Server(page, 'id').init();
      servers['hetznerNginx'] = await new Server(page, '136').init();
    // servers['hetznerOls']   = await new Server(page, 'id').init();
    // servers['awsNginx']     = await new Server(page, 'id').init();
      servers['awsOls']       = await new Server(page, '137').init();
    // servers['gcpNginx']     = await new Server(page, 'id').init();
    // servers['gcpOls']       = await new Server(page, 'id').init();
    // servers['linodeNginx']  = await new Server(page, 'id').init();
    // servers['linodeOls']    = await new Server(page, 'id').init();
    //  servers['xCloudManagedNginx'] = await new Server(page, '2815').init();
    // servers['xCloudManagedOls']   = await new Server(page, 'id').init();
    // servers['xCloudProviderNginx']= await new Server(page, 'id').init();
    // servers['xCloudProvicerOls']  = await new Server(page, 'id').init();
    // servers['arm_server']   = await new Server(page, 'id').init();
    // servers['mariaDbServer']= await new Server(page, 'id').init();
    } catch (e) {
      console.log(e);
      throw Error(e);
    }
    
});




test('Create site 01', async() => {
  try {
    const createdSite = await servers['hetznerNginx'].createSite('Test Site');
  } catch (e) {
    throw new Error(e);
  }
})

// test.describe('Creating Sites on Server', () => {
//   for (const site of sites) {
//     test(`Creating site '${site.title}' on server '${vs.getServerId()}'`, async () => {
//       try {
//         const createdSite = await vs.createSite(site.title, {
//           phpVersion: site.phpVersion,
//           wpVersion: site.wpVersion,
//           fullObjectCaching: true,
//           objectCaching: true,
//         });

//         // Navigate to the site dashboard
//         await createdSite?.gotoSiteDashboard();
//         await expect(page).toHaveTitle(/Overview/);
//       } catch (error) {
//         console.error(`Failed to create site '${site.title}':`, error);
//       }
//     });
//   }
// });




// test.describe('Server-Specific Tests', async () => {
//   console.log(servers);
//   for (const [key, server] of Object.entries(servers)) {
  

//     test.describe(`Tests for server: ${key}`, async () => {
//       // Filter supported sites for the current server
//       const supportedSites: any = [];
//       for (const site of sites) {
//         if (site.supportedServerType.includes(server.getServerType())) {
//           supportedSites.push(site);
//         }
//       }

//       // Define tests for each supported site
//       for (const site of supportedSites) {
//         test(`Create site on ${key} with title ${site.title}`, async () => {
//           try {
//             const createdSite = await server.createSite(site.title, {
//               phpVersion: site.phpVersion,
//               wpVersion: site.wpVersion,
//               fullObjectCaching: true,
//               objectCaching: true,
//             });

//             // Navigate to the site dashboard
//             await createdSite?.gotoSiteDashboard();
//             await expect(page).toHaveTitle(/Overview/);
//           } catch (error) {
//             console.error(`Failed to create site '${site.title}' on server '${key}':`, error);
//           }
//         });
//       }
//     });
//   }
// });
