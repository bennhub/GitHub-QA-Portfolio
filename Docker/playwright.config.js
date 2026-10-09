// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Minimal config for running the test suite inside the Docker image.
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  timeout: 30_000,
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  use: {
    /* Base URL for the API test. */
    baseURL: 'https://restful-booker.herokuapp.com/booking',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
