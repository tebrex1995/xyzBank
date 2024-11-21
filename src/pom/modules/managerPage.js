import { expect } from '@playwright/test';
import { Homepage } from './homePage';
import { CUSTOMER_DATA, MANAGER_PAGE } from '../../fixtures';

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

    //Input fields
    this.firstNameInputField = page.getByPlaceholder('First Name');
    this.lastNameInputField = page.getByPlaceholder('Last Name');
    this.postCodeInputField = page.getByPlaceholder('Post Code');
  }

  async managerLogin() {
    await this.managerLoginBtn.click();
  }

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

  async addCustomer() {
    await this.addCustomerBtn.click();
    await this.firstNameInputField.fill(
      CUSTOMER_DATA['validData']['firstName']
    );
    await this.lastNameInputField.fill(CUSTOMER_DATA['validData']['lastName']);
    await this.postCodeInputField.fill(CUSTOMER_DATA['validData']['postCode']);
    await this.formSubmitBtn.click();
  }
}
