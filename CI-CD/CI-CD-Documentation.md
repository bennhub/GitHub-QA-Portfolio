## CI/CD Implementation

This section details the continuous integration (CI) pipeline set up using GitHub
Actions for the Playwright suite in `Automation-Project/Playwright`. The workflow is
configured as follows:

- **Triggering Events:**
  - The pipeline runs automatically when:
    - Code is pushed to the `main` branch.
    - A pull request (PR) is created for the `main` branch.

- **Environment Variables:**
  - `BASE_URL` and `API_BASE_URL` are set at the workflow level, matching the
    defaults in `Automation-Project/Playwright/config/env.js`. Overriding either
    (e.g. to point at a staging environment) means changing these two lines, not
    the code.

- **Job Execution:**
  - The workflow is named `Playwright Tests` and runs on the `ubuntu-latest` environment.
  - The pipeline performs the following steps:
    1. **Checkout code** using the `actions/checkout@v4` action.
    2. **Set up Node.js (version 22)** using `actions/setup-node@v4`, with npm
       dependency caching enabled.
    3. **Install dependencies** with `npm ci` in the `Automation-Project/Playwright`
       directory (uses the committed lockfile for reproducible installs).
    4. **Lint** the suite with `npm run lint` (ESLint, including
       `eslint-plugin-playwright`'s rules), failing the build on a lint error before
       any browser time is spent.
    5. **Install Playwright browsers** with `npx playwright install --with-deps
       chromium` (only Chromium is installed, matching the single active browser
       project in `playwright.config.js`).
    6. **Run Playwright tests** using `npx playwright test`.
    7. **Upload the HTML report** as a build artifact (retained 14 days) whenever the
       job runs, pass or fail, so a failing run's report can be inspected without
       re-running locally.

- **Workflow YAML File:**
  ```yaml
  name: Playwright Tests

  on:
    push:
      branches:
        - main
    pull_request:
      branches:
        - main

  env:
    BASE_URL: https://automationexercise.com
    API_BASE_URL: https://restful-booker.herokuapp.com/booking

  jobs:
    test:
      runs-on: ubuntu-latest

      steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm
          cache-dependency-path: Automation-Project/Playwright/package-lock.json

      - name: Install dependencies
        run: npm ci
        working-directory: Automation-Project/Playwright

      - name: Lint
        run: npm run lint
        working-directory: Automation-Project/Playwright

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
        working-directory: Automation-Project/Playwright

      - name: Run Playwright tests
        run: npx playwright test
        working-directory: Automation-Project/Playwright

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: Automation-Project/Playwright/playwright-report/
          retention-days: 14
  ```
