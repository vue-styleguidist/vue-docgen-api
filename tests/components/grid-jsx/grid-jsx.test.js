const path = require('path')

const api = require('../../../src/main')
const grid = path.join(__dirname, './Grid.vue')
let docGrid

describe('tests grid jsx', () => {
  beforeAll(function(done) {
    docGrid = api.parse(grid)
    done()
  })

  it('should return an object', () => {
    expect(typeof docGrid).toBe('object')
  })

  it('The component name should be grid', () => {
    expect(docGrid.displayName).toEqual('grid')
  })

  it('should the component has tags', () => {
    expect(typeof docGrid['tags'] !== 'undefined').toBe(true)
  })

  it('should the component has authors', () => {
    expect(typeof docGrid['tags']['author'] !== 'undefined').toBe(true)
  })

  it('should the component has description', () => {
    expect(typeof docGrid['description'] !== 'undefined').toBe(true)
  })

  it('should has methods', () => {
    expect(typeof docGrid['methods'] !== 'undefined').toBe(true)
  })

  it('should the component has one method', () => {
    expect(Object.keys(docGrid['methods']).length).toEqual(1)
  })

  it('should has props', () => {
    expect(typeof docGrid['props'] !== 'undefined').toBe(true)
  })

  it('should the component has version', () => {
    expect(typeof docGrid['tags']['version'] !== 'undefined').toBe(true)
  })

  it('should the component has four props', () => {
    expect(Object.keys(docGrid['props']).length).toEqual(6)
  })

  it('grid component should have a msg prop as string|number type', () => {
    expect(docGrid['props']['msg']['type']['name']).toEqual('string|number')
  })

  it('grid component should have a filterKey prop as string type', () => {
    expect(docGrid['props']['filterKey']['type']['name']).toEqual('string')
  })

  it('grid component should have a propFunc prop as func type', () => {
    expect(docGrid['props']['propFunc']['type']['name']).toEqual('func')
  })

  it('grid component should have a images prop as Array type', () => {
    expect(docGrid['props']['images']['type']['name']).toEqual('array')
  })

  it('grid component should have a data prop as Array type', () => {
    expect(docGrid['props']['data']['type']['name']).toEqual('array')
  })

  it('grid component should have a columns prop as Array type', () => {
    expect(docGrid['props']['columns']['type']['name']).toEqual('array')
  })

  it('should the prop msg has four tags', () => {
    expect(Object.keys(docGrid['props']['msg']['tags']).length).toEqual(4)
  })

  it('should the component has two event', () => {
    expect(Object.keys(docGrid['events']).length).toEqual(2)
  })

  it('should the component has event, it called success', () => {
    expect(typeof docGrid['events']['success'] !== 'undefined').toBe(true)
  })

  it('should the description of success event is Success event.', () => {
    expect(docGrid['events']['success']['description']).toEqual('Success event.')
  })

  it('should the component has event, it called error', () => {
    expect(typeof docGrid['events']['error'] !== 'undefined').toBe(true)
  })

  it('should the description of error event is Error event.', () => {
    expect(docGrid['events']['error']['description']).toEqual('Error event.')
  })

  it('should the type of error event is object.', () => {
    expect(docGrid['events']['error']['type']['names'][0]).toEqual('object')
  })

  it('should define the return type of the first method', () => {
    expect(docGrid['methods'][0]['returns']['description']).toEqual('Test')
  })

  it('should match the snapshot', () => {
    expect(docGrid).toMatchSnapshot()
  })
})
