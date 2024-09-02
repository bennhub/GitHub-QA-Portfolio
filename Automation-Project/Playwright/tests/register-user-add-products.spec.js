
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
  // Verify 'ACCOUNT CREATED!' and click 'Continue' button
await expect(page.locator(`[data-qa="account-created"]`)).toBeVisible();
await page.locator(`[data-qa="continue-button"]`).click();

//--------------------------------
// Act:
//--------------------------------

// Add products to cart
await page.click('[data-product-id="1"].add-to-cart');
await page.locator(`:text("Continue Shopping")`).click();
await page.click('[data-product-id="2"].add-to-cart');
// Click 'Cart' button
await page.locator(`:text("View Cart")`).click();

//--------------------------------
// Assert:
//--------------------------------

// verify products in cart 
await expect(page.locator(`:text("Blue Top Women > Tops")`)).toBeVisible();
// verify by 2nd product in cart
await expect(page.locator(`:text("Blue Top Women > Tops")`)).toBeVisible();
// Verify by Proceed to checkout button
await expect(page.locator(`:text("Proceed To Checkout")`)).toBeVisible();

//--------------------------------
// Act:
//--------------------------------

// Click Proceed To Checkout
await page.locator('.btn:has-text("Proceed To Checkout")').click();

//--------------------------------
// Assert:
//--------------------------------

// Verify Address Details and Review Your Order
await expect(page.locator('#address_delivery')).toContainText('Mr. Ben Tester');
await expect(page.locator('#address_invoice')).toContainText('Vancouver BC V6E1L8');

//verify cart contents
await expect(page.locator(`#product-1`)).toHaveText(`Blue Top\n\nWomen > Tops\n\n\t\n\nRs. 500\n\n\t1\t\n\nRs. 500`);
await expect(page.locator(`#product-2`)).toHaveText(`Men Tshirt\n\nMen > Tshirts\n\n\t\n\nRs. 400\n\n\t1\t\n\nRs. 400`);

});
