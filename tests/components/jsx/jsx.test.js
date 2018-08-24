const path = require('path')
const expect = require('chai').expect

const api = require('../../../dist/main')
const jsx = path.join(__dirname, './jsx.vue')
let docJsx;



describe('tests jsx', () => {
  before(function(done) {
    this.timeout(10000)
    docJsx = api.parse(jsx)
    done()
  })
  it('should return an object', () => {
    expect(docJsx).to.be.an('object')
  })

})
