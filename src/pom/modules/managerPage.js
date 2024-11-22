import { expect } from '@playwright/test';
import { Homepage } from './homePage';
import { ALERTS, CUSTOMER_DATA, MANAGER_PAGE } from '../../fixtures';

export class ManagerPage extends Homepage {
  constructor(page) {
    super(page);
    //Buttons
    this.addCustomerBtn = page.getByRole('button', {
      name: MANAGER_PAGE['addCustomerText'],
    });
    this.openAccountBtn = page.getByRole('button', {
      name: MANAGER_PAGE['openAccountText'],
    });
    this.customersListBtn = page.getByRole('button', {
      name: MANAGER_PAGE['customerListText'],
    });
    this.formSubmitBtn = this.addCustomerBtn.last();
    this.submitCurrencyBtn = page.getByRole('button', {
      name: MANAGER_PAGE['submitCurrencyButton'],
    });

    //Create customer => Input fields
    this.firstNameInputField = page.getByPlaceholder('First Name');
    this.lastNameInputField = page.getByPlaceholder('Last Name');
    this.postCodeInputField = page.getByPlaceholder('Post Code');

    //Create account => Dropdowns
    this.selectUserDropdown = '#userSelect';
    this.selectCurrencyDropdown = ' #currency';
    this.currencies = ['Dollar', 'Pound', 'Rupee'];

    //Customers List
    this.trLocator = page.locator('tr');
    this.baseCustomerNumber = 6;
    this.oneCustomerFoundTable = 2;
    this.lastTableRow = page.locator('table tr').last();
    this.deleteBtn = this.lastTableRow.getByRole('button');
    this.searchBar = page.getByPlaceholder('Search Customer');
    this.firstNameColumn = page.locator('tr td.ng-binding').first();
    this.lastNameColumn = page.locator('tr td.ng-binding').nth(1);
    this.postCodeColumn = page.locator('tr td.ng-binding').nth(2);
    this.accountsColumn = page.locator('tr td.ng-binding').nth(3);
  }

  //Funcional methods
  async managerLogin() {
    await this.managerLoginBtn.click();
  }

  async addCustomer() {
    await this.checkAlertDialog(ALERTS['customerCreated']);

    await this.addCustomerBtn.click();
    await this.firstNameInputField.fill(
      CUSTOMER_DATA['validData']['firstName']
    );
    await this.lastNameInputField.fill(CUSTOMER_DATA['validData']['lastName']);
    await this.postCodeInputField.fill(CUSTOMER_DATA['validData']['postCode']);
    await this.formSubmitBtn.click();

    await this.page.removeAllListeners('dialog');
  }

  //Delete customer as manager
  async deleteCustomer() {
    await this.customersListBtn.click();
    await expect(this.deleteBtn).toHaveText(MANAGER_PAGE['deleteCustomer']);
    await this.deleteBtn.click();
  }

  //Search Customer as manager
  async searchCustomer(customerName) {
    await this.customersListBtn.click();
    await this.searchBar.click();
    await this.searchBar.fill(customerName);
  }

  //Select user from dropdown in open accounts page
  async selectUser() {
    await this.page.selectOption(
      this.selectUserDropdown,
      `${CUSTOMER_DATA['validData']['firstName']} ${CUSTOMER_DATA['validData']['lastName']}`
    );
  }

  async openAccount() {
    await this.openAccountBtn.click();
    this.checkAlertDialog(ALERTS['accountCreatedSuccessfully']);
    for (const curr of this.currencies) {
      await this.selectUser();
      await this.page.selectOption(this.selectCurrencyDropdown, `${curr}`);

      await this.submitCurrencyBtn.click();
    }
    this.page.removeAllListeners('dialog');
  }

  //TODO:
  //Write random data in file with fs and read it in addCustomer

  //Other test methods

  //Check alert dialog and close it
  async checkAlertDialog(message) {
    this.page.on('dialog', async dialog => {
      expect(dialog.message()).toContain(message);
      await dialog.accept();
    });
  }

  //Get users information from local storage
  async getCustomerFromLocalStorage() {
    const customerInfo = await this.page.evaluate(() => {
      return window.localStorage.getItem('User').last();
    });
    return customerInfo;
  }

  //Assertions of manager login
  async verifyManagerLogin() {
    await expect(this.addCustomerBtn).toBeVisible();
    await expect(this.openAccountBtn).toBeVisible();
    await expect(this.customersListBtn).toBeVisible();
    await expect(this.addCustomerBtn).toHaveText(
      MANAGER_PAGE['addCustomerText']
    );
    await expect(this.openAccountBtn).toHaveText(
      MANAGER_PAGE['openAccountText']
    );
    await expect(this.customersListBtn).toHaveText(
      MANAGER_PAGE['customerListText']
    );
  }

  //Assertions of search result
  async verifySearchResult() {
    await expect(this.firstNameColumn).toHaveText(
      CUSTOMER_DATA['validData']['firstName']
    );
    await expect(this.lastNameColumn).toHaveText(
      CUSTOMER_DATA['validData']['lastName']
    );
    await expect(this.postCodeColumn).toHaveText(
      CUSTOMER_DATA['validData']['postCode']
    );
    await expect(this.trLocator).toHaveCount(this.oneCustomerFoundTable);
  }
}
