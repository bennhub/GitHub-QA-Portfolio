
  //--------------------------------
  // Arrange:
  //--------------------------------
  
  import { test, expect } from "@playwright/test";
  test("Register and Enter Account Details", async ({ page, context }) => {
  await context.setDefaultNavigationTimeout(60000); // optional: set a longer navigation timeout

  await page.goto("https://automationexercise.com", {
    waitUntil: "domcontentloaded", // ensure the DOM is fully loaded
  });

  // Verify that home page is visible successfully
  await expect(page).toHaveTitle(/Automation Exercise/);

  //--------------------------------
  // Act: Register User
  //--------------------------------

  // Click login
  await page.locator(`text=Signup / Login`).click();

  // Verify New Users Signup is Visible
  await expect(page.locator(`text=New User Signup!`)).toBeVisible();

  // Type username
  await page.locator(`[data-qa="signup-name"]`).fill(`TestingName`);

  // Generate a random email
  let email = "06.12.25testers@gmail.com";

  // Generate a random number between 0 and 999
  const randomNumber = Math.floor(Math.random() * 1000);

  // Append the random number to the email
  email = `06.12.25testers${randomNumber}@gmail.com`;

  // Fill email in input field
  await page.locator(`[data-qa="signup-email"]`).fill(email);

  // Click signup button
  await page.locator(`[data-qa="signup-button"]`).click();

  // Verify "Enter Account Information" is visible
  await expect(page.locator(`text=Enter Account Information`)).toBeVisible();

  //--------------------------------
  // Act: Enter Account Details
  //--------------------------------

  // Enter account details
  await page.locator(`[id="id_gender1"]`).check();
  await page.locator(`[data-qa="password"]`).fill(`Password`);
  await page.selectOption(`[data-qa="days"]`, `14`);
  await page.selectOption(`[data-qa="months"]`, "3");
  await page.selectOption(`[data-qa="years"]`, "1985");
  await page.locator(`[data-qa="first_name"]`).fill(`Ben`);
  await page.locator(`[data-qa="last_name"]`).fill(`Tester`);
  await page.locator(`[data-qa="company"]`).fill(`QA Wolf`);
  await page.locator(`[data-qa="address"]`).fill(`WFH`);
  await page.selectOption(`[data-qa="country"]`, `Canada`);
  await page.locator(`[data-qa="state"]`).fill(`BC`);
  await page.locator(`[data-qa="city"]`).fill(`Vancouver`);
  await page.locator(`[data-qa="zipcode"]`).fill(`V6E1L8`);
  await page.locator(`[data-qa="mobile_number"]`).fill(`1234567`);
  await page.locator(`[data-qa="create-account"]`).click();

  //--------------------------------
  // Assert:
  //--------------------------------

  // Verify account creation success message or redirection to correct page
  await expect(page.locator(`text=Account Created!`)).toBeVisible();

  //-------------------------------------
  // Clean up - Delete logged in account
  //------------------------------------

  // Click 'Continue' button to goto the loged in page
  await page.locator(`[data-qa="continue-button"]`).click();

  // Click 'Delete Account' button to delete account
  await page.locator(`:text("Delete Account")`).click();

  // Verify that 'ACCOUNT DELETED!' is visible and click 'Continue' button
  await expect(page.locator(`[data-qa="account-deleted"]`)).toBeVisible();
  await page.locator(`[data-qa="continue-button"]`).click();
});
