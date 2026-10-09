import { expect } from "@playwright/test";
import { UI_BASE_URL } from "./config.js";

// Registers a brand-new account on automationexercise.com and returns the
// email used, so callers (e.g. an account-deletion test or a
// add-to-cart/checkout test) can continue from a fresh, logged-in session.
export async function registerNewAccount(page, context) {
  await context.setDefaultNavigationTimeout(60000);

  await page.goto(UI_BASE_URL, {
    waitUntil: "domcontentloaded",
  });

  // Verify that home page is visible successfully
  await expect(page).toHaveTitle(/Automation Exercise/);

  // Click login
  await page.locator(`text=Signup / Login`).click();

  // Verify New Users Signup is Visible
  await expect(page.locator(`text=New User Signup!`)).toBeVisible();

  // Type username
  await page.locator(`[data-qa="signup-name"]`).fill(`TestingName`);

  // Generate a random email
  const randomNumber = Math.floor(Math.random() * 1000);
  const email = `06.12.25testers${randomNumber}@gmail.com`;

  // Fill email in input field
  await page.locator(`[data-qa="signup-email"]`).fill(email);

  // Click signup button
  await page.locator(`[data-qa="signup-button"]`).click();

  // Verify "Enter Account Information" is visible
  await expect(page.locator(`text=Enter Account Information`)).toBeVisible();

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

  return { email };
}
