import { HOMEPAGE } from '../../fixtures/pageTextValues';

export class Homepage {
  constructor(page) {
    this.page = page;
    this.homeBtn = page.getByRole('button', {
      name: HOMEPAGE['HOME_BTN_TEXT'],
    });
    this.mainHeading = page.locator('.mainHeading');
    this.managerLoginBtn = page.getByRole('button', {
      name: HOMEPAGE['MANAGER_LOGIN_BTN_TEXT'],
    });
    this.customerLoginBtn = page.locator('button[ng-click="customer()"]');
  }
}
