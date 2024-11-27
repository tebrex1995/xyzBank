import { defineConfig, devices } from '@playwright/test';
import allurePlaywright from 'allure-playwright';

export default defineConfig({
  testDir: './src/tests',
  timeout: 30000,

  fullyParallel: true,

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['line'],
    ['html'],
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
      },
    ],
  ],

  use: {
    expect: {
      timeout: 30000,
    },
    baseURL: 'https://www.globalsqa.com',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
