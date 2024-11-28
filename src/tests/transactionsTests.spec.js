import { test, expect } from '@playwright/test';
import {
  CUSTOMER_PAGE,
  ENDPOINTS,
  setupTransactionsCustomer,
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

  test.beforeEach('Navigate to customers account page', async () => {
    page.goto(`${ENDPOINTS['LOGGED_CUSTOMER']}`);
  });

  test.afterAll('Close context', async () => {
    await context.close();
  });

  test('Should be able to navigate to deposit page', async () => {
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

    await expect(customersPage['balance']).toHaveValue(difference.toString(), {
      timeout: 5000,
    });

    //Check if local storage amounts matches
    const localStorageAmount = await transactions.getAmountFromStorage();
    expect(localStorageAmount).toBe(Number(withdrawValue));
  });

  test('Should be able to navigate to the transactions page', async () => {
    await customersPage['transactionsBtn'].click();

    await expect(transactions['backBtn']).toBeVisible();
    const url = page.url();
    expect(url).toContain(ENDPOINTS['TRANSACTION_LIST']);
  });

  test('Should be able to see transactions on the page', async () => {
    //Navigate to transactions page
    await customersPage['transactionsBtn'].click();
    await expect(transactions['backBtn']).toBeVisible();

    const url = page.url();
    expect(url).toContain(ENDPOINTS['TRANSACTION_LIST']);
  });

  test('Customer should see transactions in table', async () => {
    //Make transactions and get info of them
    const [dates, amounts, types] = await transactions.extractTransactionInfo();

    //Reload page so that elements appear in table
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    await transactions.transactionsBtn.click();

    await expect(page).toHaveURL(ENDPOINTS['TRANSACTION_LIST']);
    await page.screenshot({
      path: './test-results/screenshot.png',
      fullPage: true,
    });

    const tableRow = await transactions['tableRow'];
    const tableRows = await tableRow.count();

    expect(tableRows).toBeGreaterThan(0);

    for (let i = 0; i < (await dates.length); i++) {
      const row = tableRow.nth(i);

      await expect(row.locator('td').nth(0)).toHaveText(dates[i]);
      await expect(row.locator('td').nth(1)).toHaveText(amounts[i].toString());
      await expect(row.locator('td').nth(2)).toHaveText(types[i]);
    }
  });

  test('Transaction list should be able to get reset', async () => {
    //Make transactions and get info of them
    const [dates, amounts, types] = await transactions.extractTransactionInfo();

    //Reload page so that elements appear in table
    await transactions.visitTransactionsList();

    await expect(page).toHaveURL(ENDPOINTS['TRANSACTION_LIST']);

    //Reset transactions
    await transactions['resetBtn'].click();

    const tableRow = transactions['tableRow'];

    expect(await tableRow.count()).toBe(0);
  });
});
