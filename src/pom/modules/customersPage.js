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
    return loggedUser;
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

  //Assertion methods
  async verifyLoginWithAccount() {
    await expect(this.depositBtn).toBeVisible();
    await expect(this.withdrawBtn).toBeVisible();
    await expect(this.transactionsBtn).toBeVisible();
  }
}
