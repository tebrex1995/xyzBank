const generateRandomString = length => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};

const generateRandomNumber = max => {
  return Math.floor(Math.random() * (max - 1) + 1);
};

function generateRandomNumberInRange(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const getDataFromLocalStorage = (page, storageKey) => {
  const customerInfo = page.evaluate(key => {
    const item = window.localStorage.getItem(key);
    const parsed = JSON.parse(item);
    return parsed;
  }, storageKey);
  return customerInfo;
};

const lastObjectVal = obj => {
  const values = Object.values(obj);
  return values[values.length - 1];
};

function arraysAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((value, index) => value === arr2[index]);
}

export {
  generateRandomNumber,
  generateRandomString,
  getDataFromLocalStorage,
  lastObjectVal,
  arraysAreEqual,
  generateRandomNumberInRange,
};
