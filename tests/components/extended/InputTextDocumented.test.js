const path = require('path')
const expect = require('chai').expect

const api = require('../../../dist/main')
const InputTextDoc = path.join(__dirname, './InputTextDocumented.vue')
let docInputTextDoc

describe('tests InputTextDoc', () => {
  before(function(done) {
    this.timeout(10000)
    docInputTextDoc = api.parse(InputTextDoc)
    done()
  })

  it('should return an object', () => {
    expect(docInputTextDoc).to.be.an('object')
  })

  it('The component name should be InputTextDoc', () => {
    expect(docInputTextDoc.displayName).to.equal('InputTextDocumented')
  })

  it('The component should has a description', () => {
    expect(docInputTextDoc.description).to.equal('Description InputTextDocumented')
  })

  it('should has props', () => {
    expect(typeof docInputTextDoc['props'] !== 'undefined').to.be.true
  })

  it('should the component has two props', () => {
    expect(Object.keys(docInputTextDoc['props']).length).to.equal(2)
  })

  it('should the component has placeholder of type string', () => {
    expect(docInputTextDoc['props']['placeholder']['type']['name']).to.equal('string')
  })
})
