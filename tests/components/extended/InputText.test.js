const path = require('path')

const api = require('../../../src/main')
const InputText = path.join(__dirname, './InputText.vue')
let docInputText

describe('tests InputText', () => {
  beforeAll(function(done) {
    docInputText = api.parse(InputText)
    done()
  })

  it('should return an object', () => {
    expect(typeof docInputText).toBe('object')
  })

  it('The component name should be InputText', () => {
    expect(docInputText.displayName).toEqual('InputText')
  })

  it('The component should has a description', () => {
    expect(docInputText.description).toEqual('Description InputText')
  })

  it('should has props', () => {
    expect(typeof docInputText['props'] !== 'undefined').toBe(true)
  })

  it('should the component has two props', () => {
    expect(Object.keys(docInputText['props']).length).toEqual(2)
  })
})
