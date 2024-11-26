import { CustomersPage, ManagerPage } from '../modules';
import { KEYS, utils, TRANSACTIONS, CUSTOMER_PAGE } from '../../fixtures';
import { expect } from '@playwright/test';

export class Transactions extends CustomersPage {
  constructor(page) {
    super(page);
    this.managerPage = new ManagerPage(page);
    //Labels
    this.depositLabel = page.locator('.form-group label');
    this.withdrawLabel = page.locator('.form-group label');
    this.errorLabel = page.locator('span.error');

    //Inputs
    this.amountInputField = page.locator('input[ng-model="amount"]');

    //Buttons
    this.submitBtn = page.locator('form button');
  }

  async deposit() {
    //Get deposit value and turn it to string
    const depositValue = TRANSACTIONS['DEPOSIT_VALUE'];
    const stringedDepositValue = await depositValue.toString();

    //Deposit
    await this.depositBtn.click();
    await this.amountInputField.fill(stringedDepositValue);
    await this.submitBtn.click();
    return depositValue;
  }

  async withdraw() {
    const value = TRANSACTIONS['LOWER_DEPOSIT_VALUE'];
    await this.withdrawBtn.click();
    await expect(this.withdrawLabel).toHaveText(
      CUSTOMER_PAGE['WITHDRAW_LABEL']
    );

    await this.amountInputField.fill(value.toString());
    await this.submitBtn.click();
    return value;
  }

  async getLastTransaction() {
    //Get user ID
    const userId = await this.managerPage.getId();
    //Get transactions from local storage
    const transactions = await utils.getDataFromLocalStorage(
      this.page,
      KEYS['TRANSACTIONS']
    );
    //Get current account number
    const account = await this.getCurrentAccount();
    const accountNo = await account[KEYS['USER_KEYS']['ACCOUNT_NO']];

    //Return all transactions with given ID
    const allTransactions = await transactions[userId][accountNo];
    const lastTransaction = await allTransactions[allTransactions.length - 1];
    //Return last transaction
    return lastTransaction;
  }

  async getAmountFromStorage() {
    const lastTransaction = await this.getLastTransaction();
    const amount = lastTransaction.amount;
    return amount;
  }
}
