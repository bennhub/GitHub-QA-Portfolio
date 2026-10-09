export class SignupLoginPage {
  constructor(page) {
    this.page = page;
  }

  get newUserSignupHeading() {
    return this.page.locator('text=New User Signup!');
  }

  get nameInput() {
    return this.page.locator('[data-qa="signup-name"]');
  }

  get emailInput() {
    return this.page.locator('[data-qa="signup-email"]');
  }

  get signupButton() {
    return this.page.locator('[data-qa="signup-button"]');
  }

  async signUp(name, email) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.signupButton.click();
  }
}
