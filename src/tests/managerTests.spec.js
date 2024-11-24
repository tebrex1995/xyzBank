// @ts-check
import { test, expect } from '@playwright/test';
import {
  ALERTS,
  CUSTOMER_DATA,
  KEYS,
  setupManager,
  teardownManager,
} from '../fixtures';

test.describe('Verify manager can create customer successfully', () => {
  let homepage, managerPage, oldLastUserId;

  test.beforeEach(
    'Home page should be loaded and manager should be logged in successfully',
    async ({ page }) => {
      const setup = await setupManager(page);
      homepage = setup.homepage;
      managerPage = setup.managerPage;
      oldLastUserId = setup.oldLastUserId;
    }
  );

  test.afterEach(
    'Customer should be deleted successfully',
    async ({ page }) => {
      await teardownManager(page, managerPage, oldLastUserId);
    }
  );

  test('Customer should be able to be found on search bar', async () => {
    await managerPage.searchCustomer(CUSTOMER_DATA['VALID_DATA']['FIRST_NAME']);
    await managerPage.verifySearchResult();

    //Clear search bar
    await managerPage['searchBar'].clear();
  });

  test('Manager should be able to open an account', async () => {
    const accountNumbers = await managerPage.openAccount();
    const lastUser = await managerPage.getLastUser();
    expect(await accountNumbers).toEqual(
      await lastUser[KEYS['USER_KEYS']['ACCOUNT_NO']]
    );
  });

  test('Duplicated customer should not be able to get created', async () => {
    await managerPage.addCustomer({ alertMsg: ALERTS['DUPLICATE_CUSTOMER'] });
  });
});
