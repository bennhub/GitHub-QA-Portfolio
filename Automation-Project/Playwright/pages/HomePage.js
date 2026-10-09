import { UI_BASE_URL } from "../config/env.js";

export class HomePage {
  constructor(page) {
    this.page = page;
  }

  get signupLoginLink() {
    return this.page.locator('text=Signup / Login');
  }

  get productsLink() {
    return this.page.locator('[href="/products"]');
  }

  get subscriptionHeading() {
    return this.page.locator(':text("Subscription")');
  }

  get subscriptionEmailInput() {
    return this.page.locator('[type="email"]');
  }

  get scrollUpButton() {
    return this.page.locator("#scrollUp");
  }

  get sliderCarousel() {
    return this.page.locator("#slider-carousel");
  }

  async goto() {
    await this.page.goto(UI_BASE_URL, { waitUntil: "domcontentloaded" });
  }

  async clickSignupLogin() {
    await this.signupLoginLink.click();
  }

  async goToProducts() {
    await this.productsLink.click();
  }

  async scrollToBottom() {
    await this.page.evaluate(() => {
      window.scrollBy(0, document.documentElement.scrollHeight);
    });
  }

  async scrollToTop() {
    await this.scrollUpButton.click();
  }

  async getSliderText() {
    return this.sliderCarousel.innerText();
  }
}
