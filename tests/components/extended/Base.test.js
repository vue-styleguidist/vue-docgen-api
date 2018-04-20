const path = require('path')
const expect = require('chai').expect

const api = require('../../../dist/main')
const Base = path.join(__dirname, './Base.vue')
let docBase

describe('tests Base', () => {
  before(function (done) {
    this.timeout(10000)
    docBase = api.parse(Base)
    done()
  })

  it('should return an object', () => {
    expect(docBase).to.be.an('object')
  })

  it('The component name should be Base', () => {
    expect(docBase.displayName).to.equal('Base')
  })

  it('The component should has a description', () => {
    expect(docBase.description).to.equal('')
  })

  it('should has props', () => {
    expect(typeof docBase['props'] !== 'undefined').to.be.true
  })

  it('should the component has one prop', () => {
    expect(Object.keys(docBase['props']).length).to.equal(1)
  })
})
