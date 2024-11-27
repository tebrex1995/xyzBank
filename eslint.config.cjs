const { configs } = require('eslint-plugin-playwright');

module.exports = [
  {
    ...configs['flat/recommended'],
    files: ['src/tests/**'],
  },
  {
    files: ['tests/**'],
    rules: {
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-commented-out-tests': 'error',
      'playwright/expect-expect': 'error',
      'playwright/missing-playwright-await': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/no-skipped-test': 'error',
    },
  },
];
