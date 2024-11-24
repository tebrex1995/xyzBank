import { Homepage } from './homePage';
import { selectUser, URLS } from '../../fixtures';
import { ENDPOINTS } from '../../fixtures';
import { expect } from '@playwright/test';

export class CustomersPage extends Homepage {
  constructor(page) {
    super(page);
    this.loginBtn = page.locator(`button[ng-show="custId != ''"]`);
    this.logoutBtn = page.locator('button[ng-click="byebye()"]');
  }

  async customerLogin() {
    await this.loginCheck();
    await this.customerLoginBtn.click();
    await selectUser(this.page);
    await expect(this.loginBtn).toBeVisible();
    await this.loginBtn.click();
  }

  async loginCheck() {
    if (this.page.url() !== `${ENDPOINTS['CUSTOMER']}`)
      this.page.goto(`${URLS['baseUrl']}`);
  }
}
