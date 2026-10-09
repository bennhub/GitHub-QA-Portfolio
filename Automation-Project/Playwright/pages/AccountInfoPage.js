export class AccountInfoPage {
  constructor(page) {
    this.page = page;
  }

  get enterAccountInfoHeading() {
    return this.page.locator('text=Enter Account Information');
  }

  get genderRadio() {
    return this.page.locator('[id="id_gender1"]');
  }

  get passwordInput() {
    return this.page.locator('[data-qa="password"]');
  }

  get daysSelect() {
    return this.page.locator('[data-qa="days"]');
  }

  get monthsSelect() {
    return this.page.locator('[data-qa="months"]');
  }

  get yearsSelect() {
    return this.page.locator('[data-qa="years"]');
  }

  get firstNameInput() {
    return this.page.locator('[data-qa="first_name"]');
  }

  get lastNameInput() {
    return this.page.locator('[data-qa="last_name"]');
  }

  get companyInput() {
    return this.page.locator('[data-qa="company"]');
  }

  get addressInput() {
    return this.page.locator('[data-qa="address"]');
  }

  get countrySelect() {
    return this.page.locator('[data-qa="country"]');
  }

  get stateInput() {
    return this.page.locator('[data-qa="state"]');
  }

  get cityInput() {
    return this.page.locator('[data-qa="city"]');
  }

  get zipcodeInput() {
    return this.page.locator('[data-qa="zipcode"]');
  }

  get mobileNumberInput() {
    return this.page.locator('[data-qa="mobile_number"]');
  }

  get createAccountButton() {
    return this.page.locator('[data-qa="create-account"]');
  }

  async fillAccountDetails(user) {
    await this.genderRadio.check();
    await this.passwordInput.fill(user.password);
    await this.daysSelect.selectOption(user.day);
    await this.monthsSelect.selectOption(user.month);
    await this.yearsSelect.selectOption(user.year);
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.companyInput.fill(user.company);
    await this.addressInput.fill(user.address);
    await this.countrySelect.selectOption(user.country);
    await this.stateInput.fill(user.state);
    await this.cityInput.fill(user.city);
    await this.zipcodeInput.fill(user.zipcode);
    await this.mobileNumberInput.fill(user.mobile);
  }

  async submit() {
    await this.createAccountButton.click();
  }
}
