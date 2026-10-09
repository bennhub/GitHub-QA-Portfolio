import { test as base } from "@playwright/test";
import { HomePage } from "../pages/HomePage.js";
import { SignupLoginPage } from "../pages/SignupLoginPage.js";
import { AccountInfoPage } from "../pages/AccountInfoPage.js";
import { AccountStatusPage } from "../pages/AccountStatusPage.js";
import { ProductsPage } from "../pages/ProductsPage.js";
import { CartPage } from "../pages/CartPage.js";
import { CheckoutPage } from "../pages/CheckoutPage.js";
import { buildNewUser } from "../test-data/users.js";

/**
 * Custom fixtures: one per page object (dependency-injected into any test
 * that names it as a parameter), plus a `registeredUser` fixture that
 * performs the registration flow as setup and hands the test the user data
 * it registered with. Tests that don't need a page object simply don't
 * list it as a parameter; Playwright only instantiates fixtures a test
 * actually uses.
 */
export const test = base.extend({
  // Override the built-in `page` fixture once, instead of every spec
  // calling context.setDefaultNavigationTimeout() itself.
  page: async ({ page }, use) => {
    page.context().setDefaultNavigationTimeout(60000);
    await use(page);
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  signupLoginPage: async ({ page }, use) => {
    await use(new SignupLoginPage(page));
  },

  accountInfoPage: async ({ page }, use) => {
    await use(new AccountInfoPage(page));
  },

  accountStatusPage: async ({ page }, use) => {
    await use(new AccountStatusPage(page));
  },

  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  // Setup fixture: registers a brand-new account before the test body
  // runs, and yields the user data it registered with (so a test can
  // assert against the name/email/address it expects).
  registeredUser: async (
    { homePage, signupLoginPage, accountInfoPage },
    use,
  ) => {
    const user = buildNewUser();

    await homePage.goto();
    await homePage.clickSignupLogin();
    await signupLoginPage.signUp(user.name, user.email);
    await accountInfoPage.fillAccountDetails(user);
    await accountInfoPage.submit();

    await use(user);
  },
});

export { expect } from "@playwright/test";
