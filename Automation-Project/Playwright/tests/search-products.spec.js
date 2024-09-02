//--------------------------------
// Arrange:
//--------------------------------

import { test, expect } from "@playwright/test";
test("Search Products", async ({ page, context }) => {
  {
    args: ["--ignore-certificate-errors", "--disable-web-security"];
  }
  await context.setDefaultNavigationTimeout(60000); // optional: set a longer navigation timeout
  await page.goto("https://automationexercise.com", {
    waitUntil: "domcontentloaded", // ensure the DOM is fully loaded
  });

  // Verify that home page is visible successfully
  await expect(page).toHaveTitle(/Automation Exercise/);

  //--------------------------------
  // Act: Search Products
  //--------------------------------

  // Click on 'Products' button on top of navigation bar to go to the products list page
  await page.locator(`[href="/products"]`).click();

  // Fill the search input in left top side of the page(next to the search icon)
  await page.locator(`#search_product`).fill(`Dress`);

  //Click search icon to do the search
  await page.locator(`#submit_search`).click();

  //---------------------------------------------
  // Assert: validate search products are visible
  //---------------------------------------------

  // Verify 'SEARCHED PRODUCTS' is visible
  await expect(page.locator(`:text("Searched Products")`)).toBeVisible();

  // Verify some of the products related to search are visible
  await expect(page.locator(':text("Sleeveless Dress")').first()).toBeVisible();
  await expect(page.locator(':text("Stylish Dress")').first()).toBeVisible();

  // Get the name list of all products
  const productNames = await page.$$eval(
    ".col-sm-4 .productinfo p",
    (elements) => elements.map((element) => element.innerText)
  );
  console.log(productNames);

  //Check if there are some of product name have the search world(Dress)
  const containsDress = productNames.some((name) => name.includes("Dress"));
  console.log(containsDress);

  // Assert some of product name have the search world(Dress) is true
  expect(containsDress).toBe(true);

  //-------------------------------------------
  // Act: Clear Search / Search Invalid product
  //--------------------------------------------

  //Clear the search input
  await page.locator(`#search_product`).clear();
  
  //refresh the page
  await page.reload();

  //Fill  the seach input in left top side of the page(next to the search icon) with invalid word
  await page.locator(`#search_product`).fill(`XPXPXPXPXX`);

  //Click search icon to do the search
  await page.locator(`#submit_search`).click();

  //-------------------------------------
  // Assert - validate empty product list
  //------------------------------------

  // Assert Empty Products list Search Result
  await expect(page.locator(".col-sm-4 p")).not.toBeVisible();

  // Clear the search input
  await page.locator(`#search_product`).clear();

  // Refresh the page
  await page.reload();

  // Fill  the seach input in left top side of the page(next to the search icon) with invalid word
  await page.locator(`#search_product`).fill(`XPXPXPXPXX`);

  // Click search icon to do the search
  await page.locator(`#submit_search`).click();

  //--------------------------------
  // Assert:
  //--------------------------------

  // There is empty in the Searched Products list
  await expect(page.locator(".col-sm-4 p")).not.toBeVisible();
});
