import { expect } from '@playwright/test';
import { Homepage } from './homePage';
import {
  ALERTS,
  CUSTOMER_DATA,
  MANAGER_PAGE,
  utils,
  KEYS,
} from '../../fixtures';

export class ManagerPage extends Homepage {
  constructor(page) {
    super(page);
    //Buttons
    this.addCustomerBtn = page.locator('button[ng-click="addCust()"]');
    this.openAccountBtn = page.locator('button[ng-click="openAccount()"]');
    this.customersListBtn = page.locator('button[ng-click="showCust()"]');
    this.formSubmitBtn = page
      .locator('form')
      .locator('button', { name: MANAGER_PAGE['addCustomerText'] });

    this.submitCurrencyBtn = page.getByRole('form').getByRole('button', {
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

  async addCustomer({
    firstName = CUSTOMER_DATA['VALID_DATA']['FIRST_NAME'],
    lastName = CUSTOMER_DATA['VALID_DATA']['LAST_NAME'],
    postCode = CUSTOMER_DATA['VALID_DATA']['POST_CODE'],
    alertMsg = ALERTS['customerCreated'],
  } = {}) {
    await this.checkAlertDialog(alertMsg);

    await this.addCustomerBtn.click();
    await this.firstNameInputField.fill(firstName);
    await this.lastNameInputField.fill(lastName);
    await this.postCodeInputField.fill(postCode);
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
      `${CUSTOMER_DATA['VALID_DATA']['FIRST_NAME']} ${CUSTOMER_DATA['VALID_DATA']['LAST_NAME']}`
    );
  }

  //Open customers account
  async openAccount() {
    let accountNumbers = [];
    await this.openAccountBtn.click();
    this.checkAlertDialog(ALERTS['accountCreatedSuccessfully']);
    for (const curr of this.currencies) {
      await this.selectUser();
      await this.page.selectOption(this.selectCurrencyDropdown, `${curr}`);
      await this.submitCurrencyBtn.click();
      const lastAccNumber = await this.getLastAccount();
      accountNumbers.push(await lastAccNumber);
    }
    this.page.removeAllListeners('dialog');
    return accountNumbers;
  }

  async getLastAccount() {
    const lastAccountNumber = await utils.getDataFromLocalStorage(
      this.page,
      KEYS['MAX_ACCOUNT_NO']
    );
    return lastAccountNumber;
  }

  //Get last user
  async getLastUser() {
    const customerObject = await utils.getDataFromLocalStorage(
      this.page,
      KEYS['USERS']
    );
    const newCustomer = await utils.lastObjectVal(customerObject);

    return newCustomer;
  }

  //Get max user ID
  async getLastUserId() {
    const lastUserId = await utils.getDataFromLocalStorage(
      this.page,
      KEYS['MAX_USER_ID']
    );
    return lastUserId;
  }

  //Other test methods

  //Check alert dialog and close it
  async checkAlertDialog(message) {
    this.page.on('dialog', async dialog => {
      expect(dialog.message()).toContain(message);
      await dialog.accept();
    });
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
      CUSTOMER_DATA['VALID_DATA']['FIRST_NAME']
    );
    await expect(this.lastNameColumn).toHaveText(
      CUSTOMER_DATA['VALID_DATA']['LAST_NAME']
    );
    await expect(this.postCodeColumn).toHaveText(
      CUSTOMER_DATA['VALID_DATA']['POST_CODE']
    );
    await expect(this.trLocator).toHaveCount(this.oneCustomerFoundTable);
  }

  //Assert user creation
  async verifyUserCreating(oldLastUserId) {
    const newUserId = await this.getLastUserId();

    const newCustomer = await this.getLastUser();

    expect(await newCustomer[KEYS['USER_KEYS']['FIRST_NAME']]).toBe(
      CUSTOMER_DATA['VALID_DATA']['FIRST_NAME']
    );

    expect(await newCustomer[KEYS['USER_KEYS']['LAST_NAME']]).toBe(
      CUSTOMER_DATA['VALID_DATA']['LAST_NAME']
    );

    expect(await newCustomer[KEYS['USER_KEYS']['POST_CODE']]).toBe(
      CUSTOMER_DATA['VALID_DATA']['POST_CODE']
    );

    expect(await newCustomer).toHaveProperty('id');

    expect(await newUserId).toBeGreaterThan(oldLastUserId);
  }
}
