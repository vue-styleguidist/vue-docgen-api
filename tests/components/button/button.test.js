const path = require('path')

const api = require('../../../src/main')
const button = path.join(__dirname, './Button.vue')
let docButton

describe('tests button', () => {
  beforeAll(function(done) {
    docButton = api.parse(button)
    done()
  })

  it('should return an object', () => {
    expect(typeof docButton).toEqual('object')
  })

  it('The component name should be buttonComponent', () => {
    expect(docButton.displayName).toEqual('buttonComponent')
  })

  it('The component should have a description', () => {
    expect(docButton.description).toEqual(
      'This is an example of creating a reusable button component and using it with external data.'
    )
  })

  it('should the component has two tags', () => {
    expect(Object.keys(docButton['tags']).length).toEqual(2)
  })

  it('should give the component a size prop with default value to "normal"', () => {
    expect(docButton['props']['size']['defaultValue']['value']).toEqual("'normal'")
  })

  it('should the component has size prop description equal The size of the button', () => {
    expect(docButton['props']['size']['description']).toEqual('The size of the button')
  })

  it('should the component has color prop description equal The color for the button example', () => {
    expect(docButton['props']['color']['description']).toEqual('The color for the button example')
  })

  it('should the component has color prop default equal #333', () => {
    expect(docButton['props']['color']['defaultValue']['value']).toEqual('"#333"')
  })

  it('should the component has authors', () => {
    expect(typeof docButton['tags']['author'] !== 'undefined').toBe(true)
  })

  it('should not see the method without tag @public', () => {
    expect(docButton['methods'].length).toEqual(0)
  })

  it('should have props', () => {
    expect(typeof docButton['props'] !== 'undefined').toBe(true)
  })

  it('should the component has version', () => {
    expect(typeof docButton['tags']['version'] !== 'undefined').toBe(true)
  })

  it('should the component has fourteen props', () => {
    expect(Object.keys(docButton['props']).length).toEqual(14)
  })

  it('should the component has propsAnother prop default equal "blue"', () => {
    expect(docButton['props']['propsAnother']['defaultValue']['value']).toEqual('"blue"')
  })

  it('should span to be string|number', () => {
    expect(docButton['props']['span']['type']['name']).toEqual('string|number')
  })

  it("should span has as description 'Number of columns (1-12) the column should span.'", () => {
    expect(docButton['props']['span']['description']).toEqual(
      'Number of columns (1-12) the column should span.'
    )
  })

  it("should span has as description 'Sm breakpoint and above'", () => {
    expect(docButton['props']['spanSm']['description']).toEqual('Sm breakpoint and above')
  })

  it("should spanMd has as description 'Md breakpoint and above'", () => {
    expect(docButton['props']['spanMd']['description']).toEqual('Md breakpoint and above')
  })

  it('should spanSm to be string|number', () => {
    expect(docButton['props']['spanSm']['type']['name']).toEqual('string|number')
  })

  it('should set funcDefault prop as a function (type "func")', () => {
    expect(docButton['props']['funcDefault']['type']['name']).toEqual('func')
  })

  it('should prop1 to be string', () => {
    expect(docButton['props']['prop1']['type']).toMatchObject({name:'string'})
  })

  it('should example to be boolean', () => {
    expect(docButton['props']['example']['type']['name']).toEqual('boolean')
  })

  it('should value default example to be false', () => {
    expect(docButton['props']['example']['defaultValue']['value']).toEqual('false')
  })

  it('should value default example props description to be The example props', () => {
    expect(docButton['props']['example']['description']).toEqual('The example props')
  })

  it('should v-model to be string', () => {
    expect(docButton['props']['v-model']['type']['name']).toEqual('string')
  })

  it('should value default v-model to be example model', () => {
    expect(docButton['props']['v-model']['defaultValue']['value']).toEqual("'example model'")
  })

  it('should value default v-model props description to be Model example2', () => {
    expect(docButton['props']['v-model']['description']).toEqual('Model example2')
  })

  it('should propE to be string', () => {
    expect(docButton['props']['propE']['type']['name']).toEqual('object')
  })

  it('should value default propE to be a funtion', () => {
    expect(docButton['props']['propE']['defaultValue']['value']).toEqual(
      "() => { return { message: 'hello' }}"
    )
    expect(docButton['props']['propE']['defaultValue']['func']).toEqual(true)
  })

  it('should example3 to be number', () => {
    expect(docButton['props']['example3']['type']['name']).toEqual('number')
  })

  it('should value default example3 to be 16', () => {
    expect(docButton['props']['example3']['defaultValue']['value']).toEqual('16')
  })

  it('should value default example3 props description to be The example3 props', () => {
    expect(docButton['props']['example3']['description']).toEqual('The example3 props')
  })

  it('should onCustomClick to be ignored', () => {
    expect(docButton['props']['onCustomClick']['tags']['ignore']).toBeDefined()
  })

  it('should prop1 to be ignored', () => {
    expect(docButton['props']['prop1']['tags']['ignore']).toBeDefined()
  })

  it('should the component has one event', () => {
    expect(Object.keys(docButton['events']).length).toEqual(1)
  })

  it('should the component has event, it called success', () => {
    expect(typeof docButton['events']['success'] !== 'undefined').toBe(true)
  })

  it('should the description of success event is Success event.', () => {
    expect(docButton['events']['success']['description']).toEqual('Success event.')
  })

  it('should have a slot.', () => {
    expect(Object.keys(docButton['slots']).length).toEqual(1)
  })

  it('should have a default slot.', () => {
    expect(typeof docButton['slots']['default'] !== 'undefined').toBe(true)
  })

  it('the default slot should have "Use this slot default" as description', () => {
    expect(docButton['slots']['default']['description']).toEqual('Use this slot default')
  })
})
