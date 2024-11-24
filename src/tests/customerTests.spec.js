import { test, expect } from '@playwright/test';
import {
  CUSTOMER_DATA,
  CUSTOMER_PAGE,
  ENDPOINTS,
  setupManager,
  teardownManager,
} from '../fixtures';
import { CustomersPage } from '../pom/modules/';

test.describe('Customer tests', () => {
  let customersPage, managerPage, homepage, oldLastUserId;

  test.beforeEach(
    'Home page should be loaded and manager should be logged in successfully',
    async ({ page }) => {
      const setup = await setupManager(page);
      homepage = setup.homepage;
      managerPage = setup.managerPage;
      oldLastUserId = setup.oldLastUserId;
      customersPage = new CustomersPage(page);
    }
  );

  test.afterEach('Logout user successfully', async ({ page }) => {
    await customersPage.logoutCustomer();
    await teardownManager(page, managerPage, oldLastUserId);
  });

  test('Customer should be able to login', async () => {
    await customersPage.customerLogin();
    const loggedUser = await customersPage.getCurrentUser();

    expect(await loggedUser['fName']).toBe(
      CUSTOMER_DATA['VALID_DATA']['FIRST_NAME']
    );
    expect(await loggedUser['lName']).toBe(
      CUSTOMER_DATA['VALID_DATA']['LAST_NAME']
    );
    expect(await loggedUser['postCd']).toBe(
      CUSTOMER_DATA['VALID_DATA']['POST_CODE']
    );
    await expect(customersPage['welcomeHeading']).toBeVisible();
    await expect(customersPage['nameHeading']).toHaveText(
      `${CUSTOMER_DATA['VALID_DATA']['FIRST_NAME']} ${CUSTOMER_DATA['VALID_DATA']['LAST_NAME']}`
    );
  });

  test('Customer should get appropriate message if he has no accounts', async () => {
    await customersPage.customerLogin();

    await expect(customersPage['welcomeHeading']).toBeVisible();
    await expect(customersPage['nameHeading']).toHaveText(
      `${CUSTOMER_DATA['VALID_DATA']['FIRST_NAME']} ${CUSTOMER_DATA['VALID_DATA']['LAST_NAME']}`
    );
    await expect(customersPage.noAccount).toHaveText(
      CUSTOMER_PAGE['NO_ACCOUNT_MESSAGE']
    );
  });

  test('Customer should have visible buttons and accounts if he has accounts', async ({
    page,
  }) => {
    await page.goto(ENDPOINTS['OPEN_ACCOUNT']);
    await managerPage.openAccount();
    await customersPage.customerLogin();
    await customersPage.verifyLoginWithAccount();
  });

  test('Customer should have added accounts in account select dropdown', async () => {
    await managerPage.openAccount();
    await customersPage.customerLogin();

    const accountsMatch = await customersPage.compareOptionsWithLocalStorage();
    expect(accountsMatch).toBe(true);
  });
});
