const path = require('path')
const expect = require('chai').expect

const api = require('../../../dist/main')
const grid = path.join(__dirname, './Grid.vue')
let docGrid

describe('tests grid', () => {
  before(function(done) {
    docGrid = api.parse(grid)
    done()
  })

  it('should return an object', () => {
    expect(docGrid).to.be.an('object')
  })

  it('The component name should be grid', () => {
    expect(docGrid.displayName).to.equal('grid')
  })

  it('should the component has tags', () => {
    expect(typeof docGrid['tags'] !== 'undefined').to.be.true
  })

  it('should the component has authors', () => {
    expect(typeof docGrid['tags']['author'] !== 'undefined').to.be.true
  })

  it('should the component has description', () => {
    expect(typeof docGrid['description'] !== 'undefined').to.be.true
  })

  it('should has methods', () => {
    expect(typeof docGrid['methods'] !== 'undefined').to.be.true
  })

  it('should the component has one method', () => {
    expect(Object.keys(docGrid['methods']).length).to.equal(1)
  })

  it('should has props', () => {
    expect(typeof docGrid['props'] !== 'undefined').to.be.true
  })

  it('should the component has version', () => {
    expect(typeof docGrid['tags']['version'] !== 'undefined').to.be.true
  })

  it('should the component has four props', () => {
    expect(Object.keys(docGrid['props']).length).to.equal(6)
  })

  it('grid component should have a msg prop as string|number type', () => {
    expect(docGrid['props']['msg']['type']['name']).to.equal('string|number')
  })

  it('grid component should have a filterKey prop as string type', () => {
    expect(docGrid['props']['filterKey']['type']['name']).to.equal('string')
  })

  it('grid component should have a propFunc prop as func type', () => {
    expect(docGrid['props']['propFunc']['type']['name']).to.equal('func')
  })

  it('grid component should have a images prop as Array type', () => {
    expect(docGrid['props']['images']['type']['name']).to.equal('array')
  })

  it('grid component should have a data prop as Array type', () => {
    expect(docGrid['props']['data']['type']['name']).to.equal('array')
  })

  it('grid component should have a columns prop as Array type', () => {
    expect(docGrid['props']['columns']['type']['name']).to.equal('array')
  })

  it('should the prop msg has four tags', () => {
    expect(Object.keys(docGrid['props']['msg']['tags']).length).to.equal(4)
  })

  it('should the component has two event', () => {
    expect(Object.keys(docGrid['events']).length).to.equal(2)
  })

  it('should the component has event, it called success', () => {
    expect(typeof docGrid['events']['success'] !== 'undefined').to.be.true
  })

  it('should the description of success event is Success event.', () => {
    expect(docGrid['events']['success']['description']).to.equal('Success event.')
  })

  it('should the component has event, it called error', () => {
    expect(typeof docGrid['events']['error'] !== 'undefined').to.be.true
  })

  it('should the description of error event is Error event.', () => {
    expect(docGrid['events']['error']['description']).to.equal('Error event.')
  })

  it('should the type of error event is object.', () => {
    expect(docGrid['events']['error']['type']['names'][0]).to.equal('object')
  })

})
