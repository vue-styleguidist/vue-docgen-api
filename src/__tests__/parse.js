var parse = require('../parse')

describe('parse', () => {
  it('should return an function', () => {
    expect(typeof parse.parse).toEqual('function')
  })
})
