import { TRANSACTIONS } from './testData';

const URLS = {
  baseUrl: '/angularJs-protractor/BankingProject/',
};

const ENDPOINTS = {
  LOGIN: `${URLS['baseUrl']}#/login`,
  CUSTOMER: `${URLS['baseUrl']}#/customer`,
  LOGGED_CUSTOMER: `${URLS['baseUrl']}#/account`,
  CUSTOMER_LIST: `${URLS['baseUrl']}#/manager/list`,
  OPEN_ACCOUNT: `${URLS['baseUrl']}#/manager/openAccount`,
  TRANSACTION_LIST: `https://www.globalsqa.com${URLS['baseUrl']}#/listTx`,
};

export { URLS, ENDPOINTS };
