import { CustomersPage, ManagerPage } from '../modules';
import { KEYS, utils, TRANSACTIONS, CUSTOMER_PAGE } from '../../fixtures';
import { expect } from '@playwright/test';
import {
  generateRandomNumber,
  generateRandomNumberInRange,
} from '../../fixtures/utils';

export class Transactions extends CustomersPage {
  constructor(page) {
    super(page);
    this.managerPage = new ManagerPage(page);
    //Labels
    this.depositLabel = page.locator('.form-group label');
    this.withdrawLabel = page.locator('.form-group label');
    this.errorLabel = page.locator('span.error');
    this.tableRow = page.locator('tbody tr');

    //Inputs
    this.amountInputField = page.locator('input[ng-model="amount"]');

    //Buttons
    this.submitBtn = page.locator('form button');
    this.resetBtn = page.locator('.btn[ng-click="reset()"]');
    this.backBtn = page.locator('.btn[ng-click="back()"]');
  }

  async visitTransactionsList() {
    await this.page.reload();
    await this.transactionsBtn.click();
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

  async makeMultipleTransactions(transactions) {
    for (let i = 0; i < transactions; i++) {
      await this.deposit();
      await this.withdraw();
    }
    const allTransactions = await this.getAllTransactions();

    return allTransactions;
  }

  async extractTransactionInfo() {
    const transactions = await this.makeMultipleTransactions(
      // generateRandomNumberInRange(10, 20)

      2
    );
    let dates = [];
    let formatedDates = [];
    let amounts = [];
    let types = [];
    for (const transaction of transactions) {
      dates.push(transaction.date);
      amounts.push(transaction.amount);
      types.push(transaction.type);
    }
    for (const date of dates) {
      const formatedDate = utils.formatToCustomDateTime(date);
      formatedDates.push(formatedDate);
    }
    return [formatedDates, amounts, types];
  }

  async getAllTransactions() {
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
    return allTransactions;
  }

  async getLastTransaction() {
    const allTransactions = this.getAllTransactions();
    const lastTransaction = await allTransactions[allTransactions.length - 1];
    //Return last transaction
    return lastTransaction;
  }

  async getAmountFromStorage() {
    const lastTransaction = await this.getLastTransaction();
    const amount = await lastTransaction['amount'];
    return amount;
  }
}
