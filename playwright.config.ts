import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL ?? 'https://apiv2-dev.salary-hero.com',
    extraHTTPHeaders: {
      'x-app-version': process.env.APP_VERSION ?? '10.0.0',
    },
  },
});
