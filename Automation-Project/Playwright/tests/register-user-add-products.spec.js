import { test, expect } from "../fixtures/pages.fixture.js";
import { PRODUCTS } from "../test-data/products.js";

test("Register account and add products to cart", async ({
  registeredUser,
  accountStatusPage,
  productsPage,
  cartPage,
  checkoutPage,
}) => {
  //--------------------------------
  // Assert: Account was created
  //--------------------------------
  await expect(accountStatusPage.accountCreatedDataQa).toBeVisible();
  await accountStatusPage.continue();

  //--------------------------------
  // Act: Add products to cart
  //--------------------------------
  await productsPage.addProductToCart(PRODUCTS.blueTop.id);
  await productsPage.continueShopping();
  await productsPage.addProductToCart(PRODUCTS.menTshirt.id);
  await productsPage.viewCart();

  //--------------------------------
  // Assert: Products are in cart
  //--------------------------------
  await expect(cartPage.productRow(PRODUCTS.blueTop.id)).toBeVisible();
  await expect(cartPage.productRow(PRODUCTS.menTshirt.id)).toBeVisible();
  await expect(cartPage.proceedToCheckoutText).toBeVisible();

  //--------------------------------
  // Act: Proceed to checkout
  //--------------------------------
  await cartPage.proceedToCheckout();

  //--------------------------------
  // Assert: Address details and order review
  //--------------------------------
  await expect(checkoutPage.deliveryAddress).toContainText(
    `Mr. ${registeredUser.firstName} ${registeredUser.lastName}`,
  );
  await expect(checkoutPage.invoiceAddress).toContainText(
    `${registeredUser.city} ${registeredUser.state} ${registeredUser.zipcode}`,
  );

  // Verify cart contents
  await expect(cartPage.productRow(PRODUCTS.blueTop.id)).toHaveText(
    `${PRODUCTS.blueTop.name}\n\n${PRODUCTS.blueTop.category}\n\n\t\n\n${PRODUCTS.blueTop.price}\n\n\t1\t\n\n${PRODUCTS.blueTop.price}`,
  );
  await expect(cartPage.productRow(PRODUCTS.menTshirt.id)).toHaveText(
    `${PRODUCTS.menTshirt.name}\n\n${PRODUCTS.menTshirt.category}\n\n\t\n\n${PRODUCTS.menTshirt.price}\n\n\t1\t\n\n${PRODUCTS.menTshirt.price}`,
  );
});
