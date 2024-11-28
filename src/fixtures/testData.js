import { ALERTS } from './pageTextValues';
import { generateRandomNumberInRange } from './utils';

const CUSTOMER_DATA = {
  VALID_DATA: {
    FIRST_NAME: 'Aleksa',
    LAST_NAME: 'Tvrdisic',
    POST_CODE: '21000',
  },

  EXISTING_CUSTOMER: {
    FIRST_NAME: 'Hermoine',
    LAST_NAME: 'Granger ',
    POST_CODE: 'E859AB',
    ALERT_MESSAGE: ALERTS['DUPLICATE_CUSTOMER'],
  },
};

const TRANSACTIONS = (() => {
  let cachedDepositValue = null;

  return {
    get DEPOSIT_VALUE() {
      if (cachedDepositValue === null) {
        cachedDepositValue = generateRandomNumberInRange(500, 1000);
      }
      return cachedDepositValue;
    },
    get LOWER_DEPOSIT_VALUE() {
      return this.DEPOSIT_VALUE - generateRandomNumberInRange(100, 300);
    },
  };
})();

const KEYS = {
  MAX_USER_ID: 'maxUserId',
  USERS: 'User',
  TRANSACTIONS: 'Transaction',
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

export { CUSTOMER_DATA, KEYS, TRANSACTIONS };
