# Automation Demo

## Playwright Demo Overview

This folder contains a Playwright test suite covering both UI and API testing against
two public demo targets: [automationexercise.com](https://automationexercise.com) (a
sample e-commerce site) and the [restful-booker](https://restful-booker.herokuapp.com)
API sandbox. Each test follows the Arrange, Act, Assert pattern for clarity and
maintainability.

## Scenarios Covered

The suite includes 6 tests:

1. **Register account and delete it** (`register-account.spec.js`)
   Registers a new account, verifies creation, then deletes the account as cleanup,
   keeping the test repeatable against a shared public demo site.
2. **Register account and add products to cart** (`register-user-add-products.spec.js`)
   Registers a new account, adds two products to the cart, proceeds to checkout, and
   verifies the delivery address and cart contents.
3. **Add products to cart** (`add-products-to-cart.spec.js`)
   Adds products to the cart as a guest and verifies prices, quantity, and totals.
4. **Search products** (`search-products.spec.js`)
   Covers both a valid search (verifies matching results appear) and an invalid search
   (verifies an empty result set).
5. **Scroll and slider content** (`verify-scroll-up-down.spec.js`)
   Scrolls to the bottom of the page, verifies the subscription section is visible,
   scrolls back to the top, and verifies the homepage slider text.
6. **API request validation** (`post-api-request.spec.js`)
   Sends a POST request to a booking API and validates the response status and nested
   JSON fields.

The shared account-registration flow used by tests 1 and 2 lives in
`tests/helpers/registration.js`, so it's defined once rather than duplicated across
spec files.

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

3. **Reviewing Test Results:**

   ```bash
   npm run report
   ```

## Continuous Integration

This suite runs automatically in GitHub Actions on every push/PR to `main`. See the
[CI/CD section](../CI-CD/CI-CD-Documentation.md) and the
[workflow run history](https://github.com/bennhub/GitHub-QA-Portfolio/actions).

## Conclusion

This project demonstrates Playwright for both UI and API testing: e-commerce
registration/checkout flows, product search, UI interaction, and API response
validation, using the Arrange, Act, Assert pattern throughout.
