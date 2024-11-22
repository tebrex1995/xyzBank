// @ts-check
import { test, expect } from '@playwright/test';
import { Homepage, ManagerPage } from '../pom/modules';
import { ALERTS, CUSTOMER_DATA, HOMEPAGE, URLS } from '../fixtures';

test.describe('Verify manager can create customer successfully', () => {
  let homepage, managerPage;

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
      await managerPage.checkAlertDialog(ALERTS['customerCreated']);
      //Add new customer
      await managerPage.addCustomer();
    }
  );

  test('Customer should be able to be found on search bar', async () => {
    await managerPage.searchCustomer(CUSTOMER_DATA['validData']['firstName']);
    await managerPage.verifySearchResult();

    //Clear search bar
    await managerPage['searchBar'].clear();
  });

  test('Manager should be able to open an account', async () => {
    await managerPage.openAccounts();
  });

  // test.afterEach('Customer should be deleted successfully', async () => {
  //   //Delete customer
  //   await managerPage.deleteCustomer();
  //   await expect(managerPage['trLocator']).toHaveCount(
  //     managerPage['baseCustomerNumber']
  //   );
  // });
});
