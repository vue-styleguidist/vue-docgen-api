const path = require('path')
const expect = require('chai').expect

const api = require('../../../dist/main')
const InputText = path.join(__dirname, './InputText.vue')
let docInputText

describe('tests InputText', () => {
  before(function(done) {
    this.timeout(10000)
    docInputText = api.parse(InputText)
    done()
  })

  it('should return an object', () => {
    expect(docInputText).to.be.an('object')
  })

  it('The component name should be InputText', () => {
    expect(docInputText.displayName).to.equal('InputText')
  })

  it('The component should has a description', () => {
    expect(docInputText.description).to.equal('Description InputText')
  })

  it('should has props', () => {
    expect(typeof docInputText['props'] !== 'undefined').to.be.true
  })

  it('should the component has two props', () => {
    expect(Object.keys(docInputText['props']).length).to.equal(2)
  })
})
