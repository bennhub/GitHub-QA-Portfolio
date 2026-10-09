# Automation Agent Reference

This is the canonical, self-describing reference for how this automation repo is
actually built. It's meant to be read by an AI agent (or a human) before writing or
reviewing a test here. It isn't a separate copy of the standards; it's written to
stay accurate to what's actually in this folder, so if the code changes, this file
should change with it in the same commit.

## Structure

```
Automation-Project/Playwright/
├── .env.example        # documents the env vars; copy to .env to override locally
├── config/
│   └── env.js           # UI_BASE_URL / API_BASE_URL, both env-overridable
├── test-data/
│   ├── users.js         # buildNewUser() factory - unique email per run
│   └── products.js      # static product catalog data (IDs, names, prices)
├── pages/
│   ├── HomePage.js
│   ├── SignupLoginPage.js
│   ├── AccountInfoPage.js
│   ├── AccountStatusPage.js
│   ├── ProductsPage.js
│   ├── CartPage.js
│   └── CheckoutPage.js
├── fixtures/
│   └── pages.fixture.js  # one fixture per page object + registeredUser setup fixture
├── tests/
│   └── *.spec.js         # the actual specs; see "Scenarios" below
├── agent/
│   └── automation-agent.md  # this file
├── eslint.config.js
├── playwright.config.js
└── package.json
```

## Page Object Model

Every page object follows the same shape:

- A constructor that takes only `page`.
- Locators as **getters** (`get searchInput() { return this.page.locator(...); }`),
  not locators computed once in the constructor. Playwright locators are lazy by
  design; getters keep that laziness and keep the locator definitions readable next
  to each other.
- Action methods (`signUp()`, `addProductToCart()`, `proceedToCheckout()`) that
  perform a UI interaction.
- **No assertions inside page objects.** Page objects expose locators and actions;
  `expect()` calls stay in the spec files. This keeps "how to interact with the
  page" separate from "what this test is actually checking."
- Parameterized locators are plain methods, not getters, when they need an argument
  (e.g. `productRow(productId)` in `CartPage.js`, `addToCartButton(productId)` in
  `ProductsPage.js`).

## Fixtures

`fixtures/pages.fixture.js` extends Playwright's base `test` with:

- One fixture per page object (`homePage`, `productsPage`, `cartPage`, etc.), each
  just `new`-ing the corresponding page object with the current `page`.
- A `page` fixture override that sets the default navigation timeout once
  (`page.context().setDefaultNavigationTimeout(60000)`), instead of every spec
  calling it itself.
- A `registeredUser` setup fixture: performs the full registration flow before the
  test body runs, and yields the user data it registered with, so the test can
  assert against real values instead of hardcoded strings. A test that needs the
  side effect but not the data requests it as `registeredUser: _registeredUser` (an
  alias) rather than ignoring the lint rule outright.

Specs import `test`/`expect` from `../fixtures/pages.fixture.js`, never directly
from `@playwright/test`, except `post-api-request.spec.js` (it's a pure API test
with no page objects, so it has no reason to depend on the fixture file).

## Test Data

- `test-data/users.js`: `buildNewUser(overrides)` returns a full registration-form
  object with a unique, timestamp-based email so repeated runs against the shared
  public demo site don't collide. Call it per test, don't share one instance across
  tests.
- `test-data/products.js`: static data (the demo site's fixed product catalog), not
  a factory, since IDs/names/prices are properties of the site, not generated.

## Environment / Config

- `config/env.js` exports `UI_BASE_URL` and `API_BASE_URL`, both read from
  `process.env` (via `dotenv`) with the current defaults as fallback.
- `.env.example` documents both vars. `.env` itself is gitignored; CI sets them as
  workflow-level `env:` instead (see `.github/workflows/ci.yml`).
- `UI_BASE_URL` and `API_BASE_URL` are kept separate on purpose: the UI specs and
  the API spec target two different systems under test
  (automationexercise.com vs. restful-booker.herokuapp.com).

## Linting

`eslint.config.js` (flat config) runs `@eslint/js` recommended rules plus
`eslint-plugin-playwright`'s recommended set, with `no-wait-for-timeout` set to
`error` (an explicit wait is exactly the anti-pattern this suite avoids) and
`no-unused-vars` configured with an `^_` ignore pattern specifically so the
`registeredUser: _registeredUser` alias pattern above doesn't need a per-line
disable comment. Run it with `npm run lint`; CI runs it before browsers are even
installed, so a lint failure fails fast.

## Assertions

- Every meaningful step ends in a real `expect(...)` assertion
  (`toBeVisible()`/`toHaveText()`/etc.), never just "it didn't throw."
- Prefer `toBeHidden()` over `not.toBeVisible()` (the lint rule
  `playwright/no-useless-not` catches this).
- No `page.waitForTimeout()`, ever; rely on Playwright's auto-waiting or wait on a
  specific condition.
- Global test timeout stays at Playwright's 30s default unless there's a documented
  reason for a longer one.

## Scenarios

1. **Register account and delete it** (`register-account.spec.js`): registration
   via the `registeredUser` fixture, verify creation, delete as cleanup.
2. **Register account and add products to cart** (`register-user-add-products.spec.js`):
   registration, add two products, checkout, verify the delivery/invoice address
   against the actual registered user data.
3. **Add products to cart** (`add-products-to-cart.spec.js`): guest cart flow,
   verify price/quantity/total per product.
4. **Search products** (`search-products.spec.js`): a valid search (results
   present) and an invalid one (empty results).
5. **Scroll and slider content** (`verify-scroll-up-down.spec.js`): homepage
   scroll behavior and slider text.
6. **API request validation** (`post-api-request.spec.js`): POST to the booking
   API, validate status and nested JSON fields. No page objects involved.

## Known External Gotcha

automationexercise.com sits behind bot-protection that can return a "One moment,
please..." / "Please wait while your request is being verified..." interstitial
instead of the real page, to **any** client, including plain `curl`, not just
headless browsers. If a test fails with `expect(page).toHaveTitle` reporting that
string instead of `/Automation Exercise/`, that's the target site blocking the
runner's IP, not a regression in this suite. Confirm with
`curl -s <url> | grep -o "<title>.*</title>"` before assuming the code broke;
retrying from a different network path (or waiting) is the actual fix, not editing
a test.
