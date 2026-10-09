import { test, expect } from "../fixtures/pages.fixture.js";
import { PRODUCTS } from "../test-data/products.js";

test("Validate Adding Products to Cart", async ({
  page,
  homePage,
  productsPage,
  cartPage,
}) => {
  //--------------------------------
  // Arrange:
  //--------------------------------
  await homePage.goto();
  await expect(page).toHaveTitle(/Automation Exercise/);
  await homePage.goToProducts();

  //--------------------------------
  // Act:
  //--------------------------------
  await productsPage.addProductToCart(PRODUCTS.blueTop.id, { hoverFirst: true });
  await productsPage.continueShopping();
  await productsPage.addProductToCart(PRODUCTS.menTshirt.id, { hoverFirst: true });
  await productsPage.viewCart();

  //--------------------------------
  // Assert:
  //--------------------------------
  await expect(cartPage.productRow(PRODUCTS.blueTop.id)).toBeVisible();
  await expect(cartPage.productRow(PRODUCTS.menTshirt.id)).toBeVisible();

  await expect(cartPage.productPrice(PRODUCTS.blueTop.id)).toHaveText(
    PRODUCTS.blueTop.price,
  );
  await expect(cartPage.productQuantity(PRODUCTS.blueTop.id)).toHaveText("1");
  await expect(cartPage.productTotalPrice(PRODUCTS.blueTop.id)).toHaveText(
    PRODUCTS.blueTop.price,
  );
  await expect(cartPage.productPrice(PRODUCTS.menTshirt.id)).toHaveText(
    PRODUCTS.menTshirt.price,
  );
  await expect(cartPage.productQuantity(PRODUCTS.menTshirt.id)).toHaveText("1");
  await expect(cartPage.productTotalPrice(PRODUCTS.menTshirt.id)).toHaveText(
    PRODUCTS.menTshirt.price,
  );
});
