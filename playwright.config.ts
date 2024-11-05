import { defineConfig, devices } from '@playwright/test';
import { baseConfig } from './config/config';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: 60 * 60 * 1000,
  
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // reporter: 'html',
  reporter: [['html', { open: 'always' }]],

  use: {
    storageState: 'state.json', // Use the saved auth state from global-setup
    trace: 'on-first-retry',
    baseURL: baseConfig.baseURL,  // Use a single baseURL for all projects
  },

  projects: [
    // { 
    //   name: 'setup', 
    //   testMatch: /global-setup\.ts/,
    // },
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'state.json',  // Reuse the auth state
      },
      // dependencies: ['setup'],
    },
    // {
    //   name: 'blog',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     baseURL: 'xcloud.host'
    //   }
    // }

    // Commented out other browsers
    // {
    //   name: 'firefox',
    //   use: { 
    //     ...devices['Desktop Firefox'],
    //     storageState: 'state.json',
    //   },
    //   dependencies: ['setup'],
    // },
    // {
    //   name: 'webkit',
    //   use: { 
    //     ...devices['Desktop Safari'],
    //     storageState: 'state.json',
    //   },
    //   dependencies: ['setup'],
    // },
  ],

  /* Run your global setup before starting the tests */
  globalSetup: require.resolve('./global-setup'),  // Add this line to run global setup
});
