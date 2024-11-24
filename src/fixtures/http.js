const URLS = {
  baseUrl: '/angularJs-protractor/BankingProject/',
};

const ENDPOINTS = {
  CUSTOMER: `${URLS['baseUrl']}#/customer`,
  LOGGED_CUSTOMER: `${URLS['baseUrl']}#/account`,
  CUSTOMER_LIST: `${URLS['baseUrl']}#/manager/list`,
};

export { URLS, ENDPOINTS };
