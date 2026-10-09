export class ProductsPage {
  constructor(page) {
    this.page = page;
  }

  get searchInput() {
    return this.page.locator("#search_product");
  }

  get searchButton() {
    return this.page.locator("#submit_search");
  }

  get searchedProductsHeading() {
    return this.page.locator(':text("Searched Products")');
  }

  get productInfoNames() {
    return this.page.locator(".col-sm-4 .productinfo p");
  }

  get emptyResultIndicator() {
    return this.page.locator(".col-sm-4 p");
  }

  get continueShoppingButton() {
    return this.page.locator(':text("Continue Shopping")');
  }

  get viewCartLink() {
    return this.page.locator(':text("View Cart")');
  }

  addToCartButton(productId) {
    return this.page.locator(`[data-product-id="${productId}"].add-to-cart`);
  }

  async addProductToCart(productId, { hoverFirst = false } = {}) {
    const button = this.addToCartButton(productId);
    if (hoverFirst) {
      await button.hover({ timeout: 3000 });
    }
    await button.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async viewCart() {
    await this.viewCartLink.click();
  }

  async search(term) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  async clearSearch() {
    await this.searchInput.clear();
    await this.page.reload();
  }

  async getProductNames() {
    return this.productInfoNames.allTextContents();
  }
}
