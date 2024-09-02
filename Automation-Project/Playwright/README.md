# Playwright Tests Project
This repository contains a collection of Playwright tests created as part of my personal practice to learn and master Playwright for end-to-end testing. Playwright is a Node.js library to automate Chromium, Firefox, and WebKit with a single API.

## Tests
This project is a practice repository to help me learn Playwright by creating and running end-to-end tests. The tests cover various functionalities and scenarios to ensure a thorough understanding of Playwright's capabilities.

## CI/CD with GitHub Actions
I have integrated Continuous Integration and Continuous Deployment (CI/CD) into this repository using GitHub Actions. The CI/CD pipeline is configured to automatically run Playwright tests on each push and pull request to the `main` branch. This ensures that all tests are executed consistently and any issues are detected early.

### Workflow Details
- **Trigger**: The workflow is triggered on pushes and pull requests to the `main` branch.
- **Environment**: The tests run on the latest Ubuntu environment (`ubuntu-latest`).
- **Steps**:
  1. Checkout the repository.
  2. Set up Node.js.
  3. Install dependencies.
  4. Install Playwright browsers.
  5. Run Playwright tests.
  6. Upload test results as artifacts.

The workflow file is located at `.github/workflows/playwright.yml`.

By using GitHub Actions, I ensure that my Playwright tests are continuously validated, maintaining high quality and reliability in my end-to-end testing practice.
