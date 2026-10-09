export class CheckoutPage {
  constructor(page) {
    this.page = page;
  }

  get deliveryAddress() {
    return this.page.locator("#address_delivery");
  }

  get invoiceAddress() {
    return this.page.locator("#address_invoice");
  }
}
