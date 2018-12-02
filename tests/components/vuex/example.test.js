const path = require('path')

var api = require('../../../src/main')
var exampleVuex = path.join(__dirname, './example.vue')
let docVuex

describe('test example vuex', () => {
  beforeAll(function(done) {
    docVuex = api.parse(exampleVuex)
    done()
  })

  it('should return an object', () => {
    expect(typeof docVuex).toBe('object')
  })

  it('The component name should be example', () => {
    expect(docVuex.displayName).toEqual('example')
  })

  it('The component should has a description', () => {
    expect(docVuex.description).toEqual('Partial mapping, object spread operator example')
  })

  it('should has a method', () => {
    expect(docVuex['methods'].length).toEqual(1)
  })

  it('should has "submit" method', () => {
    expect(docVuex['methods'][0]['name']).toEqual('onSubmit')
  })

  it('should dont have slots.', () => {
    expect(Object.keys(docVuex['slots']).length).toEqual(0)
  })
})
