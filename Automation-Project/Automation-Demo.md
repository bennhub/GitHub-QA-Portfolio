# Automation Demo

## Playwright Demo Overview

This folder contains a Playwright framework (not just a flat pile of specs) covering
both UI and API testing against two public demo targets:
[automationexercise.com](https://automationexercise.com) (a sample e-commerce site)
and the [restful-booker](https://restful-booker.herokuapp.com) API sandbox.

For the full architecture reference (directory structure, Page Object Model
conventions, fixtures, test data, linting, env config, and a known external
gotcha), see
[Playwright/agent/automation-agent.md](./Playwright/agent/automation-agent.md) — it's
written to be the canonical source of truth, kept in sync with the actual code
rather than a separate description of it.

## Framework at a Glance

- **Page Object Model** (`Playwright/pages/`): one class per page, getter-based
  locators, action methods, no assertions inside the page object.
- **Fixtures** (`Playwright/fixtures/pages.fixture.js`): one fixture per page
  object, plus a `registeredUser` setup fixture that performs account registration
  before the test body runs.
- **Test data** (`Playwright/test-data/`): a `buildNewUser()` factory (unique email
  per run) and static product catalog data, instead of magic strings scattered
  across specs.
- **Env-driven config** (`Playwright/config/env.js`, `.env.example`): the site under
  test is overridable via `BASE_URL`/`API_BASE_URL`, not hardcoded.
- **Linting** (`Playwright/eslint.config.js`): ESLint plus
  `eslint-plugin-playwright`, enforcing (among other things) that nothing uses
  `waitForTimeout`.

## Scenarios Covered

The suite includes 6 tests:

1. **Register account and delete it** (`register-account.spec.js`)
   Registers a new account via the `registeredUser` fixture, verifies creation,
   then deletes the account as cleanup.
2. **Register account and add products to cart** (`register-user-add-products.spec.js`)
   Registers a new account, adds two products to the cart, proceeds to checkout,
   and verifies the delivery address and cart contents against the actual
   registered user data.
3. **Add products to cart** (`add-products-to-cart.spec.js`)
   Adds products to the cart as a guest and verifies prices, quantity, and totals.
4. **Search products** (`search-products.spec.js`)
   Covers both a valid search (verifies matching results appear) and an invalid
   search (verifies an empty result set).
5. **Scroll and slider content** (`verify-scroll-up-down.spec.js`)
   Scrolls to the bottom of the page, verifies the subscription section is visible,
   scrolls back to the top, and verifies the homepage slider text.
6. **API request validation** (`post-api-request.spec.js`)
   Sends a POST request to a booking API and validates the response status and
   nested JSON fields. No page objects involved; it's a pure API test.

## How to Use

1. **Setup:**

   ```bash
   cd Automation-Project/Playwright
   npm install
   npx playwright install --with-deps
   ```

2. **Running Tests:**

   ```bash
   npm test
   ```

   To run a single test file:

   ```bash
   npx playwright test tests/<test-file-name>.spec.js
   ```

3. **Linting:**

   ```bash
   npm run lint
   ```

4. **Reviewing Test Results:**

   ```bash
   npm run report
   ```

## Continuous Integration

This suite runs automatically in GitHub Actions on every push/PR to `main`, lint
step included. See the
[CI/CD section](../CI-CD/CI-CD-Documentation.md) and the
[workflow run history](https://github.com/bennhub/GitHub-QA-Portfolio/actions).

## Conclusion

This project demonstrates Playwright as an actual framework, not just a folder of
scripts: a Page Object Model, fixtures, test data factories, env-driven config, and
linting, covering e-commerce registration/checkout flows, product search, UI
interaction, and API response validation.
