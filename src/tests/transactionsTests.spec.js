import { test, expect } from '@playwright/test';
import {
  CUSTOMER_PAGE,
  setupTransactionsCustomer,
  TRANSACTIONS,
} from '../fixtures';

test.describe('Verify transactions work as expected', () => {
  let context, page, customersPage, managerPage, transactions;
  //Setup Customer for tests
  test.beforeAll('Create customer and accounts', async ({ browser }) => {
    // Setup customer
    const setup = await setupTransactionsCustomer(browser);
    context = setup.context;
    page = setup.page;
    customersPage = setup.customersPage;
    managerPage = setup.managerPage;
    transactions = setup.transactions;
  });

  test.afterAll('Close context', async () => {
    await context.close();
  });

  test('Should be able to navigate to deposit', async () => {
    const depositBtn = await customersPage['depositBtn'];
    await depositBtn.click();
    await expect(transactions['depositLabel']).toHaveText(
      CUSTOMER_PAGE['DEPOSIT_LABEL']
    );
  });

  test('Should be able to make a deposit', async () => {
    const depositValue = await transactions.deposit();

    await expect(transactions['errorLabel']).toHaveText(
      CUSTOMER_PAGE['DEPOSIT_SUCCESSFULL']
    );
    await expect(customersPage['balance']).toHaveText(
      await depositValue.toString()
    );

    //Check if local storage amounts matches
    const localStorageAmount = await transactions.getAmountFromStorage();
    expect(localStorageAmount).toBe(Number(depositValue));
  });

  test('Should be able to make a withdrawal', async () => {
    const depositValue = await transactions.deposit();
    const withdrawValue = await transactions.withdraw();
    const difference = depositValue - withdrawValue;

    await expect(transactions['errorLabel']).toHaveText(
      CUSTOMER_PAGE['TRANSACTION_SUCCESSFULL']
    );
    await expect(customersPage['balance']).toHaveText(difference.toString());

    //Check if local storage amounts matches
    const localStorageAmount = await transactions.getAmountFromStorage();
    expect(localStorageAmount).toBe(Number(withdrawValue));
  });
});
