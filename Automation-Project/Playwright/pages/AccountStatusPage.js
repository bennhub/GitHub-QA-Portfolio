export class AccountStatusPage {
  constructor(page) {
    this.page = page;
  }

  get accountCreatedText() {
    return this.page.locator('text=Account Created!');
  }

  get accountCreatedDataQa() {
    return this.page.locator('[data-qa="account-created"]');
  }

  get accountDeletedDataQa() {
    return this.page.locator('[data-qa="account-deleted"]');
  }

  get continueButton() {
    return this.page.locator('[data-qa="continue-button"]');
  }

  get deleteAccountLink() {
    return this.page.locator(':text("Delete Account")');
  }

  async continue() {
    await this.continueButton.click();
  }

  async deleteAccount() {
    await this.deleteAccountLink.click();
  }
}
