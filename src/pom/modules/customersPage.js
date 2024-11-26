import { Homepage } from './homePage';
import {
  CUSTOMER_PAGE,
  selectUser,
  URLS,
  ENDPOINTS,
  utils,
  KEYS,
} from '../../fixtures';
import { expect } from '@playwright/test';

export class CustomersPage extends Homepage {
  constructor(page) {
    super(page);

    //Buttons
    this.loginBtn = page.locator(`button[ng-show="custId != ''"]`);
    this.logoutBtn = page.locator('button[ng-click="byebye()"]');
    this.transactionsBtn = page.locator('button[ng-click="transactions()"]');
    this.depositBtn = page.locator('button[ng-click="deposit()"]');
    this.withdrawBtn = page.locator('button[ng-click="withdrawl()"]');

    //Text locators
    this.nameHeading = page.locator('.fontBig');
    this.noAccount = page.locator('span[ng-show="noAccount"]');
    this.welcomeHeading = page.locator('strong', {
      hasText: CUSTOMER_PAGE['WELCOME'],
    });
    this.accNo = page.locator('div.center > strong:nth-child(1)');
    this.balance = page.locator('div.center > strong:nth-child(2)');
    this.currency = page.locator('div.center > strong:nth-child(3)');
    //Dropdowns
    this.accountSelect = '#accountSelect';
  }

  //Functional methods

  //Login Customer
  async customerLogin() {
    await this.loginCheck();
    await this.customerLoginBtn.click();
    await selectUser(this.page);
    await expect(this.loginBtn).toBeVisible();
    await this.loginBtn.click();
  }

  //Get current logged in user from local storage
  async getCurrentUser() {
    const loggedUser = await utils.getDataFromLocalStorage(
      this.page,
      KEYS['CURRENT_USER']
    );
    return await loggedUser;
  }

  //Get current users accounts
  async getCurrentAccount() {
    const usersAccount = await utils.getDataFromLocalStorage(
      this.page,
      KEYS['CURRENT_ACCOUNT']
    );
    return await usersAccount;
  }

  //Check if user is on the customer login page
  async loginCheck() {
    if (this.page.url() !== `${ENDPOINTS['CUSTOMER']}`)
      this.page.goto(`${URLS['baseUrl']}`);
  }

  //Logout customer
  async logoutCustomer() {
    if (this.loginBtn.isVisible()) {
      await this.logoutBtn.click();
    }
  }

  //Return array of options in accounts dropdown
  async compareOptionsWithLocalStorage() {
    //Declare accounts var as an empty array
    let accounts = [];
    //Get currentUser data
    const currentUser = await this.getCurrentUser();

    //Get all storage accounts (returns array)
    const storageAccounts = await currentUser.accountNo;

    //Loop through storage accounts to check if they match and push in accounts array
    for (const account of storageAccounts) {
      const option = await this.page.selectOption(
        this.accountSelect,
        `${account}`
      );
      //Returns an array with 1 element.Get first element split and take second el wich is number, then turn it to number
      const accountNo = Number(option[0].split(':')[1]);
      accounts.push(accountNo);
    }

    //Return true if number of elements in array matches and if numbers match
    const areEqual = await utils.arraysAreEqual(accounts, storageAccounts);
    return areEqual;
  }

  //Return array of users accounts in local storage
  async getLocalStorageAccounts() {}

  //Assertion methods
  async verifyLoginWithAccount() {
    await expect(this.depositBtn).toBeVisible();
    await expect(this.withdrawBtn).toBeVisible();
    await expect(this.transactionsBtn).toBeVisible();
  }
}
