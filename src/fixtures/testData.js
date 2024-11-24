import { ALERTS } from './pageTextValues';

const CUSTOMER_DATA = {
  VALID_DATA: {
    FIRST_NAME: 'Aleksa',
    LAST_NAME: 'Tvrdisic',
    POST_CODE: '21000',
  },

  EXISTING_CUSTOMER: {
    FIRST_NAME: 'Harry',
    LAST_NAME: 'Potter',
    POST_CODE: 'E725JB',
    ALERT_MESSAGE: ALERTS['DUPLICATE_CUSTOMER'],
  },
};

const KEYS = {
  MAX_USER_ID: 'maxUserId',
  USERS: 'User',
  TRANSACTIONS: 'Transactions',
  MAX_ACCOUNT_NO: 'maxAccountNo',
  USER_KEYS: {
    FIRST_NAME: 'fName',
    LAST_NAME: 'lName',
    POST_CODE: 'postCd',
    ID: 'id',
    ACCOUNT_NO: 'accountNo',
  },
  CURRENT_USER: 'CurrentUser',
  CURRENT_ACCOUNT: 'CurrentAccount',
};

export { CUSTOMER_DATA, KEYS };
