// @ts-check
import { test, expect } from '@playwright/test';
import { Homepage, ManagerPage } from '../pom/modules';
import {
  ALERTS,
  CUSTOMER_DATA,
  HOMEPAGE,
  MANAGER_PAGE,
  URLS,
} from '../fixtures';

test.describe('Verify manager can create customer successfully', () => {
  let homepage, managerPage, usersId;

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

      //Asserts
      await managerPage.verifyManagerLogin();
      //Alert dialog
      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain(ALERTS['customerCreated']);

        usersId = dialog.message().slice(-2);

        await dialog.accept();
      });

      //Add new customer
      await managerPage.addCustomer();

      //Get last created customer ID from localStorage
      const lastUsersId = await page.evaluate(() => {
        return window.localStorage.getItem('maxUserId');
      });
      expect(usersId).toContain(lastUsersId);
    }
  );

  test('Customer should be able to be found on search bar', async ({
    page,
  }) => {
    await managerPage.searchCustomer(CUSTOMER_DATA['validData']['firstName']);
    await expect(page.locator('tr')).toHaveCount(
      managerPage['oneCustomerFoundTable']
    );

    //Clear search bar
    await managerPage['searchBar'].clear();
  });

  test.afterEach('Customer should be deleted successfully', async () => {
    //Delete customer
    await managerPage.deleteCustomer();
    await expect(managerPage['trLocator']).toHaveCount(
      managerPage['baseCustomerNumber']
    );
  });
});
