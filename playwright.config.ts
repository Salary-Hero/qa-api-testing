import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    extraHTTPHeaders: {
      'x-app-version': process.env.APP_VERSION ?? '10.0.0',
    },
    // Add environment-specific settings if needed
    trace: 'on', // Enable tracing for debugging
    screenshot: 'on', // Capture screenshots on failure
  },
  projects: [
    {
      name: 'dev',
      use: {
        baseURL: 'https://apiv2-dev.salary-hero.com',
      },
    },
    {
      name: 'staging',
      use: {
        baseURL: 'https://apiv2-staging.salary-hero.com',
      },
    },
    {
      name: 'prod',
      use: {
        baseURL: 'https://apiv2.salary-hero.com',
      },
    },
  ],
});
