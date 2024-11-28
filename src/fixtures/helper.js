import { expect } from '@playwright/test';
import { Homepage, ManagerPage, Transactions } from '../pom/modules';
import { URLS, HOMEPAGE, CUSTOMER_DATA, ENDPOINTS } from '../fixtures';
import { CustomersPage } from '../pom/modules/customersPage';

const userSelectId = '#userSelect';

const setupManager = async page => {
  // Instantiate classes
  const homepage = new Homepage(page);
  const managerPage = new ManagerPage(page);

  // Visit URL
  await page.goto(URLS['baseUrl']);

  // Validate homepage elements
  await expect(homepage['homeBtn']).toBeVisible();
  await expect(homepage['mainHeading']).toHaveText(
    HOMEPAGE['MAIN_HEADING_TEXT']
  );

  // Login as Manager
  await managerPage.managerLogin();
  await managerPage.verifyManagerLogin();

  // Get the last user ID
  const oldLastUserId = await managerPage.getId();

  // Add a new customer
  await managerPage.addCustomer();
  await managerPage.verifyUserCreating(oldLastUserId);

  return { homepage, managerPage, oldLastUserId };
};

const teardownManager = async (page, managerPage, oldLastUserId) => {
  //Navigate to customers list
  await page.goto(ENDPOINTS['CUSTOMER_LIST']);

  //Delete customer
  try {
    if ((await managerPage.getId()) > oldLastUserId) {
      await managerPage.deleteCustomer();
      await expect(managerPage['trLocator']).toHaveCount(
        managerPage['baseCustomerNumber']
      );
    }
  } catch (error) {
    console.error('Error during customer deletion:', error);
    throw error;
  }
};

const customerSetup = async page => {
  const customerPage = new CustomersPage(page);
  return customerPage;
};

//Select user from dropdown
const selectUser = async (page, user) => {
  await page.waitForSelector(userSelectId, { state: 'visible' });

  await page.selectOption(userSelectId, user);
};

//Setup transactions customer
const setupTransactionsCustomer = async browser => {
  // Create a new context and page
  const context = await browser.newContext();
  const page = await context.newPage();

  // Use setupManager to initialize manager and homepage
  const setup = await setupManager(page);
  const managerPage = setup.managerPage;

  // Instantiate the CustomersPage
  const customersPage = new CustomersPage(page);

  // Perform additional setup
  await managerPage.openAccount();
  await customersPage.customerLogin(
    `${CUSTOMER_DATA['VALID_DATA']['FIRST_NAME']} ${CUSTOMER_DATA['VALID_DATA']['LAST_NAME']}`
  );

  const transactions = new Transactions(page);

  return { context, page, customersPage, managerPage, transactions };
};

export {
  setupManager,
  teardownManager,
  selectUser,
  customerSetup,
  setupTransactionsCustomer,
};
