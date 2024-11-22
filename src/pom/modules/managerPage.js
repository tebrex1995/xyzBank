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

    //Create customer => Input fields
    this.firstNameInputField = page.getByPlaceholder('First Name');
    this.lastNameInputField = page.getByPlaceholder('Last Name');
    this.postCodeInputField = page.getByPlaceholder('Post Code');

    //Create account => Dropdowns
    this.selectUser = page.locator('#userSelect');
    this.selectCurrency = page.locator('#currency');

    //Customers List
    this.trLocator = page.locator('tr');
    this.baseCustomerNumber = 6;
    this.oneCustomerFoundTable = 2;
    this.lastTableRow = page.locator('table tr').last();
    this.deleteBtn = this.lastTableRow.getByRole('button');
    this.searchBar = page.getByPlaceholder('Search Customer');
  }

  //Funcional methods
  async addCustomer() {
    await this.addCustomerBtn.click();
    await this.firstNameInputField.fill(
      CUSTOMER_DATA['validData']['firstName']
    );
    await this.lastNameInputField.fill(CUSTOMER_DATA['validData']['lastName']);
    await this.postCodeInputField.fill(CUSTOMER_DATA['validData']['postCode']);
    await this.formSubmitBtn.click();
  }

  async deleteCustomer() {
    await this.customersListBtn.click();
    await expect(this.deleteBtn).toHaveText(MANAGER_PAGE['deleteCustomer']);
    await this.deleteBtn.click();
  }

  async searchCustomer(customerName) {
    await this.customersListBtn.click();
    await this.searchBar.click();
    await this.searchBar.fill(customerName);
  }

  async managerLogin() {
    await this.managerLoginBtn.click();
  }

  //TODO:
  //Write random data in file with fs and read it in addCustomer

  //Other test methods

  async checkAlertDialog(message) {
    //Alert dialog
    this.page.on('dialog', async dialog => {
      expect(dialog.message()).toContain(message);
      await dialog.accept();
    });
  }

  async getCustomerFromLocalStorage() {
    const customerInfo = await this.page.evaluate(() => {
      return window.localStorage.getItem('User').last();
    });
    return customerInfo;
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
}
