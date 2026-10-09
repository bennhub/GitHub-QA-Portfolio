import { test, expect } from "../fixtures/pages.fixture.js";

test("Register account and delete it", async ({
  // Requested to trigger the registration setup; its value isn't needed
  // here, so it's aliased to satisfy the no-unused-vars lint rule.
  registeredUser: _registeredUser,
  accountStatusPage,
}) => {
  //--------------------------------
  // Assert: Account was created
  //--------------------------------
  await expect(accountStatusPage.accountCreatedText).toBeVisible();

  //--------------------------------
  // Act + Assert: Clean up - delete the account
  //--------------------------------
  await accountStatusPage.continue();
  await accountStatusPage.deleteAccount();
  await expect(accountStatusPage.accountDeletedDataQa).toBeVisible();
  await accountStatusPage.continue();
});
