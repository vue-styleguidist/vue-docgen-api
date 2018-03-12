const path = require('path')
const expect = require('chai').expect

const api = require('../../../dist/main')
const button = path.join(__dirname, './Button.vue')
let docButton

describe('tests button', () => {
	before(function(done) {
		docButton = api.parse(button)
		done()
	})

	it('should return an object', () => {
		expect(docButton).to.be.an('object')
	})

	it('The component name should be buttonComponent', () => {
		expect(docButton.displayName).to.equal('buttonComponent')
	})

	it('The component should has a description', () => {
		expect(docButton.description).to.equal(
			'This is an example of creating a reusable button component and using it with external data.'
		)
	})

	it('should the component has two tags', () => {
		expect(Object.keys(docButton['tags']).length).to.equal(2)
	})

	it('should the component has size prop default equal normal', () => {
		expect(docButton['props']['size']['defaultValue']['value']).to.equal(
			'"normal"'
		)
	})

	it('should the component has size prop description equal The size of the button', () => {
		expect(docButton['props']['size']['description']).to.equal(
			'The size of the button'
		)
	})

	it('should the component has color prop description equal The color for the button example', () => {
		expect(docButton['props']['color']['description']).to.equal(
			'The color for the button example'
		)
	})

	it('should the component has color prop default equal #333', () => {
		expect(docButton['props']['color']['defaultValue']['value']).to.equal(
			'"#333"'
		)
	})

	it('should the component has authors', () => {
		expect(typeof docButton['tags']['author'] !== 'undefined').to.be.true
	})

	it('should dont has methods', () => {
		expect(docButton['methods'].length).to.equal(0)
	})

	it('should has props', () => {
		expect(typeof docButton['props'] !== 'undefined').to.be.true
	})

	it('should the component has version', () => {
		expect(typeof docButton['tags']['version'] !== 'undefined').to.be.true
	})

	it('should the component has twelve props', () => {
		expect(Object.keys(docButton['props']).length).to.equal(12)
	})

	it('should span to be string|number', () => {
		expect(docButton['props']['span']['type']['name']).to.equal('string|number')
	})

	it("should span has as description 'Number of columns (1-12) the column should span.'", () => {
		expect(docButton['props']['span']['description']).to.equal(
			'Number of columns (1-12) the column should span.'
		)
	})

	it("should span has as description 'Sm breakpoint and above'", () => {
		expect(docButton['props']['spanSm']['description']).to.equal(
			'Sm breakpoint and above'
		)
	})

	it("should spanMd has as description 'Md breakpoint and above'", () => {
		expect(docButton['props']['spanMd']['description']).to.equal(
			'Md breakpoint and above'
		)
	})

	it('should spanSm to be string|number', () => {
		expect(docButton['props']['spanSm']['type']['name']).to.equal(
			'string|number'
		)
	})

	it('should funcDefault to be string', () => {
		expect(docButton['props']['funcDefault']['type']['name']).to.equal('func')
	})

	it('should prop1 to be string', () => {
		expect(docButton['props']['prop1']['type']['name']).to.equal('string')
	})

	it('should example to be boolean', () => {
		expect(docButton['props']['example']['type']['name']).to.equal('boolean')
	})

	it('should value default example to be false', () => {
		expect(docButton['props']['example']['defaultValue']['value']).to.equal(
			'false'
		)
	})

	it('should value default example props description to be The example props', () => {
		expect(docButton['props']['example']['description']).to.equal(
			'The example props'
		)
	})

	it('should v-model to be string', () => {
		expect(docButton['props']['v-model']['type']['name']).to.equal('string')
	})

	it('should value default v-model to be example model', () => {
		expect(docButton['props']['v-model']['defaultValue']['value']).to.equal(
			'"example model"'
		)
	})

	it('should value default v-model props description to be Model example2', () => {
		expect(docButton['props']['v-model']['description']).to.equal(
			'Model example2'
		)
	})

	it('should example3 to be number', () => {
		expect(docButton['props']['example3']['type']['name']).to.equal('number')
	})

	it('should value default example3 to be 16', () => {
		expect(docButton['props']['example3']['defaultValue']['value']).to.equal(
			'16'
		)
	})

	it('should value default example3 props description to be The example3 props', () => {
		expect(docButton['props']['example3']['description']).to.equal(
			'The example3 props'
		)
	})

	it('should onCustomClick to be ignored', () => {
		expect(docButton['props']['onCustomClick']['tags']['ignore']).to.be.an(
			'array'
		)
	})

	it('should prop1 to be ignored', () => {
		expect(docButton['props']['prop1']['tags']['ignore']).to.be.an('array')
	})

	it('should the component has one event', () => {
		expect(Object.keys(docButton['events']).length).to.equal(1)
	})

	it('should the component has event, it called success', () => {
		expect(typeof docButton['events']['success'] !== 'undefined').to.be.true
	})

	it('should the description of success event is Success event.', () => {
		expect(docButton['events']['success']['description']).to.equal(
			'Success event.'
		)
	})

	it('should have a slot.', () => {
		expect(Object.keys(docButton['slots']).length).to.equal(1)
	})

	it('should have a default slot.', () => {
		expect(typeof docButton['slots']['default'] !== 'undefined').to.be.true
	})

	it('the default slot should have "Use this slot default" as description', () => {
		expect(docButton['slots']['default']['description']).to.equal(
			'Use this slot default'
		)
	})
})
