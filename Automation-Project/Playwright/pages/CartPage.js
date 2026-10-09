export class CartPage {
  constructor(page) {
    this.page = page;
  }

  get proceedToCheckoutButton() {
    return this.page.locator('.btn:has-text("Proceed To Checkout")');
  }

  get proceedToCheckoutText() {
    return this.page.locator(':text("Proceed To Checkout")');
  }

  productRow(productId) {
    return this.page.locator(`#product-${productId}`);
  }

  productPrice(productId) {
    return this.productRow(productId).locator(".cart_price");
  }

  productQuantity(productId) {
    return this.productRow(productId).locator(".cart_quantity");
  }

  productTotalPrice(productId) {
    return this.productRow(productId).locator(".cart_total_price");
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButton.click();
  }
}
