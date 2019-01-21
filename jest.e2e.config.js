var jestBase = require('./jest.config')

module.exports = {
  ...jestBase,
  testMatch: ['<rootDir>/tests/**/*.test.(ts|js)'],
}
