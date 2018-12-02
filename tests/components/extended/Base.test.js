const path = require('path')

const api = require('../../../src/main')
const Base = path.join(__dirname, './Base.vue')
let docBase

describe('tests Base', () => {
  beforeAll(function(done) {
    docBase = api.parse(Base)
    done()
  })

  it('should return an object', () => {
    expect(typeof docBase).toBe('object')
  })

  it('The component name should be Base', () => {
    expect(docBase.displayName).toEqual('Base')
  })

  it('The component should has a description', () => {
    expect(docBase.description).toEqual('')
  })

  it('should has props', () => {
    expect(typeof docBase['props'] !== 'undefined').toBe(true)
  })

  it('should the component has one prop', () => {
    expect(Object.keys(docBase['props']).length).toEqual(1)
  })
})
