var jestBase = require('./jest.config')

module.exports = {
  testMatch: ['<rootDir>/src/**/__tests__/**/*.js'],
  ...jestBase,
}
