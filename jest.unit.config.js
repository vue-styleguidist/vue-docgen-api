var jestBase = require('./jest.config')

module.exports = {
  ...jestBase,
  testMatch: ['<rootDir>/src/**/__tests__/**/*.(ts|js)'],
}
