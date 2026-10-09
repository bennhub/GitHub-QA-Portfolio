import { test, expect } from "../fixtures/pages.fixture.js";
import { SEARCH_TERMS } from "../test-data/products.js";

test("Search Products", async ({ page, homePage, productsPage }) => {
  //--------------------------------
  // Arrange:
  //--------------------------------
  await homePage.goto();
  await expect(page).toHaveTitle(/Automation Exercise/);
  await homePage.goToProducts();

  //--------------------------------
  // Act: Search Products
  //--------------------------------
  await productsPage.search(SEARCH_TERMS.valid);

  //---------------------------------------------
  // Assert: validate search products are visible
  //---------------------------------------------
  await expect(productsPage.searchedProductsHeading).toBeVisible();
  await expect(page.locator(':text("Sleeveless Dress")').first()).toBeVisible();
  await expect(page.locator(':text("Stylish Dress")').first()).toBeVisible();

  const productNames = await productsPage.getProductNames();
  const containsSearchTerm = productNames.some((name) =>
    name.includes(SEARCH_TERMS.valid),
  );
  expect(containsSearchTerm).toBe(true);

  //-------------------------------------------
  // Act: Clear Search / Search Invalid product
  //--------------------------------------------
  await productsPage.clearSearch();
  await productsPage.search(SEARCH_TERMS.invalid);

  //-------------------------------------
  // Assert - validate empty product list
  //------------------------------------
  await expect(productsPage.emptyResultIndicator).toBeHidden();
});
