var jestBase = require('./jest.config')

module.exports = {
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  ...jestBase,
}
