const path = require('path')

const api = require('../../../src/main')
const button = path.join(__dirname, './Button.vue')

let docButton
xdescribe('tests button', () => {
    beforeAll(function(done) {
      docButton = api.parse(button)
      done()
    })
  
    it('should return an object', () => {
      expect(typeof docButton).toEqual('object')
    })
});
