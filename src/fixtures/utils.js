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

function formatToCustomDateTime(isoString) {
  const date = new Date(isoString);

  // Array of month names
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Extract parts of the date
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert hours to 12-hour format
  hours = hours % 12 || 12;

  // Format the final string
  return `${month} ${day}, ${year} ${hours}:${minutes}:${seconds} ${ampm}`;
}

export {
  generateRandomNumber,
  generateRandomString,
  getDataFromLocalStorage,
  lastObjectVal,
  arraysAreEqual,
  generateRandomNumberInRange,
  formatToCustomDateTime,
};
