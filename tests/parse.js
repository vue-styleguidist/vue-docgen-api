const path = require('path');
var api = require('../dist/main');
var grid = path.join(__dirname, './components/grid/Grid.vue');
var button = path.join(__dirname, './components/button/Button.vue');
var exampleVuex = path.join(__dirname, './components/vuex/example.vue');
const expect = require("chai").expect;
let docGrid;
let docButton;

describe('tests grid', () => {
	docGrid = api.parse(grid);
	console.log(JSON.stringify(docGrid, null, 2))

	it('should return an object', () => {
		expect(docGrid).to.be.an('object')
	})

	it('The component name should be grid', () => {
		expect(docGrid.displayName).to.equal('grid');
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
		expect(Object.keys(docGrid['props']).length).to.equal(4)
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

	it('should have two slots.', () => {
		expect(Object.keys(docGrid['slots']).length).to.equal(2)
	})

	it('should have a slot named header.', () => {
		expect(typeof docGrid['slots']['header'] !== 'undefined').to.be.true
	})

	it('the header slot should have "Use this slot header" as description', () => {
		expect(docGrid['slots']['header']['description']).to.equal('Use this slot header')
	})

	it('should have a slot named footer.', () => {
		expect(typeof docGrid['slots']['footer'] !== 'undefined').to.be.true
	})

	it('the footer slot should have "Use this slot footer" as description', () => {
		expect(docGrid['slots']['footer']['description']).to.equal('Use this slot footer')
	})
})

describe('tests button', () => {
	docButton = api.parse(button);
	console.log(JSON.stringify(docButton, null, 2))

	it('should return an object', () => {
		expect(docButton).to.be.an('object')
	})

	it('The component name should be buttonComponent', () => {
		expect(docButton.displayName).to.equal('buttonComponent');
	})

	it('The component should has a description', () => {
		expect(docButton.description).to.equal('This is an example of creating a reusable button component and using it with external data.');
	})

	it('should the component has two tags', () => {
		expect(Object.keys(docButton['tags']).length).to.equal(2)
	})

	it('should the component has size prop default equal normal', () => {
		expect(docButton['props']['size']['defaultValue']['value']).to.equal('"normal"')
	})

	it('should the component has size prop description equal The size of the button', () => {
		expect(docButton['props']['size']['description']).to.equal('The size of the button')
	})

	it('should the component has color prop description equal The color for the button example', () => {
		expect(docButton['props']['color']['description']).to.equal('The color for the button example')
	})

	it('should the component has color prop default equal #333', () => {
		expect(docButton['props']['color']['defaultValue']['value']).to.equal('"#333"')
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

	it('should the component has eight props', () => {
		expect(Object.keys(docButton['props']).length).to.equal(8)
	})

	it('should prop1 to be string', () => {
		expect(docButton['props']['prop1']['type']['name']).to.equal('string')
	})

	it('should example to be boolean', () => {
		expect(docButton['props']['example']['type']['name']).to.equal('boolean')
	})

	it('should value default example to be false', () => {
		expect(docButton['props']['example']['defaultValue']['value']).to.equal('false')
	})

	it('should value default example props description to be The example props', () => {
		expect(docButton['props']['example']['description']).to.equal('The example props')
	})

	it('should v-model to be string', () => {
		expect(docButton['props']['v-model']['type']['name']).to.equal('string')
	})

	it('should value default v-model to be example model', () => {
		expect(docButton['props']['v-model']['defaultValue']['value']).to.equal('"example model"')
	})

	it('should value default v-model props description to be Model example2', () => {
		expect(docButton['props']['v-model']['description']).to.equal('Model example2')
	})

	it('should example3 to be number', () => {
		expect(docButton['props']['example3']['type']['name']).to.equal('number')
	})

	it('should value default example3 to be 16', () => {
		expect(docButton['props']['example3']['defaultValue']['value']).to.equal('16')
	})

	it('should value default example3 props description to be The example3 props', () => {
		expect(docButton['props']['example3']['description']).to.equal('The example3 props')
	})

	it('should onCustomClick to be ignored', () => {
		expect(docButton['props']['onCustomClick']['tags']['ignore']).to.be.an('array')
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
		expect(docButton['events']['success']['description']).to.equal('Success event.')
	})

	it('should have a slot.', () => {
		expect(Object.keys(docButton['slots']).length).to.equal(1)
	})

	it('should have a default slot.', () => {
		expect(typeof docButton['slots']['default'] !== 'undefined').to.be.true
	})

	it('the default slot should have "Use this slot default" as description', () => {
		expect(docButton['slots']['default']['description']).to.equal('Use this slot default')
	})
})

describe('test example vuex', () => {
	const docVuex = api.parse(exampleVuex);

	it('should return an object', () => {
		expect(docVuex).to.be.an('object')
	})

	it('The component name should be example', () => {
		expect(docVuex.displayName).to.equal('example');
	})

	it('The component should has a description', () => {
		expect(docVuex.description).to.equal('Partial mapping, object spread operator example');
	})

	it('should has a method', () => {
		expect(docVuex['methods'].length).to.equal(1)
	})

	it('should has "submit" method', () => {
		expect(docVuex['methods'][0]['name']).to.equal('onSubmit')
	})

	it('should dont have slots.', () => {
		expect(Object.keys(docVuex['slots']).length).to.equal(0)
	})
})
