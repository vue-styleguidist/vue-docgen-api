const path = require('path')
const expect = require('chai').expect

const api = require('../../../dist/main')
const button = path.join(__dirname, './MyButton.vue')
let docButton

describe.only('tests button', () => {
  before(function(done) {
    this.timeout(10000)
    docButton = api.parse(button)
    done()
  })

  it('should return an object', () => {
    expect(docButton).to.be.an('object')
  })

  it('should have a slot.', () => {
    expect(Object.keys(docButton['slots']).length).to.equal(1)
  })

  it('should have a default slot.', () => {
    expect(typeof docButton['slots']['default'] !== 'undefined').to.be.true
  })

  it('the default slot should have "Use this slot default" as description', () => {
    expect(docButton['slots']['default']['description']).to.equal('Use this slot default')
  })
})
