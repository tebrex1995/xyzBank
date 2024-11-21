// @ts-check
import { test, expect } from '@playwright/test';
import { Homepage, ManagerPage } from '../pom/modules';
import { ALERTS, HOMEPAGE, URLS } from '../fixtures/';

test.describe('Verify manager functionality', () => {
  let homepage, managerPage;

  test.beforeEach(
    'Home page should be loaded and manager should be logged in successfully',
    async ({ page }) => {
      homepage = new Homepage(page);
      managerPage = new ManagerPage(page);

      await page.goto(URLS['baseUrl']);

      await expect(homepage['homeBtn']).toBeVisible();
      await expect(homepage['mainHeading']).toHaveText(
        HOMEPAGE['mainHeadingText']
      );

      //Login as Manager
      await managerPage.managerLogin();

      await managerPage.verifyManagerLogin();
    }
  );

  test('Customer should be created successfully', async ({ page }) => {
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain(ALERTS['customerCreated']);
      await dialog.accept();
    });

    await managerPage.addCustomer();
  });
});
