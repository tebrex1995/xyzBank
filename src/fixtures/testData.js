import { generateRandomNumber, generateRandomString } from './utils';

const CUSTOMER_DATA = {
  validData: {
    firstName: generateRandomString(5),
    lastName: generateRandomString(6),
    postCode: generateRandomNumber(5).toString(),
  },
};

export { CUSTOMER_DATA };
