import { test, expect } from "@playwright/test";
import { registerNewAccount } from "./helpers/registration.js";

test("Register account and add products to cart", async ({ page, context }) => {
  //--------------------------------
  // Act: Register a new account
  //--------------------------------
  await registerNewAccount(page, context);

  //--------------------------------
  // Assert: Account was created
  //--------------------------------
  await expect(page.locator(`[data-qa="account-created"]`)).toBeVisible();
  await page.locator(`[data-qa="continue-button"]`).click();

  //--------------------------------
  // Act: Add products to cart
  //--------------------------------
  await page.click('[data-product-id="1"].add-to-cart');
  await page.locator(`:text("Continue Shopping")`).click();
  await page.click('[data-product-id="2"].add-to-cart');
  // Click 'Cart' button
  await page.locator(`:text("View Cart")`).click();

  //--------------------------------
  // Assert: Products are in cart
  //--------------------------------
  await expect(page.locator(`#product-1`)).toBeVisible();
  await expect(page.locator(`#product-2`)).toBeVisible();
  // Verify by Proceed to checkout button
  await expect(page.locator(`:text("Proceed To Checkout")`)).toBeVisible();

  //--------------------------------
  // Act: Proceed to checkout
  //--------------------------------
  await page.locator('.btn:has-text("Proceed To Checkout")').click();

  //--------------------------------
  // Assert: Address details and order review
  //--------------------------------
  await expect(page.locator('#address_delivery')).toContainText('Mr. Ben Tester');
  await expect(page.locator('#address_invoice')).toContainText('Vancouver BC V6E1L8');

  // Verify cart contents
  await expect(page.locator(`#product-1`)).toHaveText(`Blue Top\n\nWomen > Tops\n\n\t\n\nRs. 500\n\n\t1\t\n\nRs. 500`);
  await expect(page.locator(`#product-2`)).toHaveText(`Men Tshirt\n\nMen > Tshirts\n\n\t\n\nRs. 400\n\n\t1\t\n\nRs. 400`);
});
