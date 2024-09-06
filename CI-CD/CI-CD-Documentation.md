## CI/CD Implementation

This section details the continuous integration and deployment (CI/CD) pipeline set up using GitHub Actions for my Playwright tests. The workflow is configured as follows:

- **Triggering Events:**
  - The pipeline runs automatically when:
    - Code is pushed to the `main` branch.
    - A pull request (PR) is created for the `main` branch.
  
- **Job Execution:**
  - The workflow is named `Playwright Tests` and runs on the `ubuntu-latest` environment.
  - The pipeline performs the following steps:
    1. **Checkout code** using the `actions/checkout@v4` action.
    2. **Set up Node.js (version 18)** using `actions/setup-node@v4`.
    3. **Install dependencies** located in the `Automation-Project/Playwright` directory.
    4. **Install Playwright browsers** with `npx playwright install`.
    5. **Run Playwright tests** using `npx playwright test`, ensuring that all tests are executed against the latest codebase.

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

  jobs:
    test:
      runs-on: ubuntu-latest

      steps:
      - name: Checkout code
        uses: actions/checkout@v4 

      - name: Set up Node.js
        uses: actions/setup-node@v4  
        with:
          node-version: '18'  

      - name: Install dependencies
        run: npm install
        working-directory: Automation-Project/Playwright

      - name: Install Playwright browsers
        run: npx playwright install
        working-directory: Automation-Project/Playwright

      - name: Run Playwright tests
        run: npx playwright test
        working-directory: Automation-Project/Playwright

