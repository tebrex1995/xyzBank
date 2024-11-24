import { test, expect } from '@playwright/test';
import { setupManager, teardownManager } from '../fixtures';
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

  test.afterAll('Customer should be deleted successfully', async ({ page }) => {
    await teardownManager(page, managerPage, oldLastUserId);
  });

  test('Customer should be able to login', async () => {
    await customersPage.customerLogin();
  });
});
