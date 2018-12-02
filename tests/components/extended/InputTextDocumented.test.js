const path = require('path')

const api = require('../../../src/main')
const InputTextDoc = path.join(__dirname, './InputTextDocumented.vue')
let docInputTextDoc

describe('tests InputTextDoc', () => {
  beforeAll(function(done) {
    docInputTextDoc = api.parse(InputTextDoc)
    done()
  })

  it('should return an object', () => {
    expect(typeof docInputTextDoc).toBe('object')
  })

  it('The component name should be InputTextDoc', () => {
    expect(docInputTextDoc.displayName).toEqual('InputTextDocumented')
  })

  it('The component should has a description', () => {
    expect(docInputTextDoc.description).toEqual('Description InputTextDocumented')
  })

  it('should has props', () => {
    expect(typeof docInputTextDoc['props'] !== 'undefined').toBe(true)
  })

  it('should the component has two props', () => {
    expect(Object.keys(docInputTextDoc['props']).length).toEqual(2)
  })

  it('should the component has placeholder of type string', () => {
    expect(docInputTextDoc['props']['placeholder']['type']['name']).toEqual('string')
  })
})
