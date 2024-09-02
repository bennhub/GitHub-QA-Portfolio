//--------------------------------
// Arrange:
//--------------------------------
import { test, expect } from "@playwright/test";
test("Validate Adding Products to Cart", async ({ page, context }) => {
  await context.setDefaultNavigationTimeout(60000); // optional: set a longer navigation timeout
  
  await page.goto("https://automationexercise.com", { // go to url
    waitUntil: "domcontentloaded", // ensure the DOM is fully loaded
    ignoreHTTPSErrors: true, // Ignore HTTPS errors (if needed)
  });

  // Verify that home page is visible successfully
  await expect(page).toHaveTitle(/Automation Exercise/);

  //--------------------------------
  // Act:
  //--------------------------------

  // Click 'Products' button
  await page.locator(`[href="/products"]`).click();

  // Hover over first product and click 'Add to cart'
  await page.hover('[data-product-id="1"].add-to-cart', { timeout: 3000 });
  await page.click('[data-product-id="1"].add-to-cart');

  // Click 'Continue Shopping' button
  await page.locator(`:text("Continue Shopping")`).click();

  // Hover over second product and click 'Add to cart'
  await page.hover('[data-product-id="2"].add-to-cart', { timeout: 3000 });
  await page.click('[data-product-id="2"].add-to-cart');

  // Click 'View Cart' button
  await page.locator(`:text("View Cart")`).click();

  //--------------------------------
  // Assert:
  //--------------------------------

  // Verify both products are added to Cart
  await expect(page.locator(`#product-1`)).toBeVisible();
  await expect(page.locator(`#product-2`)).toBeVisible();
  
  // Verify their prices, quantity and total price
  await expect(page.locator(`#product-1 .cart_price`)).toHaveText(`Rs. 500`);
  await expect(page.locator(`#product-1 .cart_quantity`)).toHaveText(`1`);
  await expect(page.locator(`#product-1 .cart_total_price`)).toHaveText(
    `Rs. 500`
  );
  await expect(page.locator(`#product-2 .cart_price`)).toHaveText(`Rs. 400`);
  await expect(page.locator(`#product-2 .cart_quantity`)).toHaveText(`1`);
  await expect(page.locator(`#product-2 .cart_total_price`)).toHaveText(
    `Rs. 400`
  );
});
