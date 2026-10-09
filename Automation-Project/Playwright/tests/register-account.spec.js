import { test, expect } from "@playwright/test";
import { registerNewAccount } from "./helpers/registration.js";

test("Register account and delete it", async ({ page, context }) => {
  //--------------------------------
  // Act: Register a new account
  //--------------------------------
  await registerNewAccount(page, context);

  //--------------------------------
  // Assert: Account was created
  //--------------------------------
  await expect(page.locator(`text=Account Created!`)).toBeVisible();

  //--------------------------------
  // Act + Assert: Clean up - delete the account
  //--------------------------------

  // Click 'Continue' button to goto the logged in page
  await page.locator(`[data-qa="continue-button"]`).click();

  // Click 'Delete Account' button to delete account
  await page.locator(`:text("Delete Account")`).click();

  // Verify that 'ACCOUNT DELETED!' is visible and click 'Continue' button
  await expect(page.locator(`[data-qa="account-deleted"]`)).toBeVisible();
  await page.locator(`[data-qa="continue-button"]`).click();
});
