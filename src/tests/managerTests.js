// @ts-check
import { test, expect } from '@playwright/test';
import { Homepage, ManagerPage } from '../pom/modules';
import { ALERTS, CUSTOMER_DATA, HOMEPAGE, KEYS, URLS } from '../fixtures';

test.describe('Verify manager can create customer successfully', () => {
  let homepage, managerPage, oldLastUserId;

  test.beforeEach(
    'Home page should be loaded and manager should be logged in successfully',
    async ({ page }) => {
      //Instantiate class
      homepage = new Homepage(page);
      managerPage = new ManagerPage(page);

      //Visit Url
      await page.goto(URLS['baseUrl']);

      await expect(homepage['homeBtn']).toBeVisible();
      await expect(homepage['mainHeading']).toHaveText(
        HOMEPAGE['mainHeadingText']
      );

      //Login as Manager
      await managerPage.managerLogin();

      await managerPage.verifyManagerLogin();
      oldLastUserId = await managerPage.getLastUserId();

      //Add new customer
      await managerPage.addCustomer();
      await managerPage.verifyUserCreating(oldLastUserId);
    }
  );

  test.afterEach('Customer should be deleted successfully', async () => {
    //Delete customer
    try {
      if ((await managerPage.getLastUserId()) > oldLastUserId) {
        await managerPage.deleteCustomer();
        await expect(managerPage['trLocator']).toHaveCount(
          managerPage['baseCustomerNumber']
        );
      }
    } catch (error) {
      console.error('Error during customer deletion:', error);
      throw error;
    }
  });

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
    await managerPage.addCustomer({ alertMsg: ALERTS['duplicateCustomer'] });
  });
});