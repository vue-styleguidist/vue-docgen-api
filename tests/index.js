const path = require('path');
var api = require('../dist/main');
var grid = path.join(__dirname,  './components/grid/Grid.vue');
var button = path.join(__dirname,  './components/button/Button.vue');
const expect = require("chai").expect;
let docGrid;
let docButton;

describe('tests components', () => {
	docGrid = api.parse(grid);
	docButton = api.parse(button);
	console.log(JSON.stringify(docButton, null, 2));

	it('should return an object', () => {
		expect(docGrid).to.be.an('object')
		expect(docButton).to.be.an('object')
	})

	it('The component name should be buttonComponent', () => {
		expect(docButton.displayName).to.equal('buttonComponent');
	})

	it('The component name should be grid', () => {
		expect(docGrid.displayName).to.equal('grid');
	})

	it('should the component have tags', () => {
		expect(typeof docGrid['tags'] !== 'undefined').to.be.true
	})

	it('should the component have authors', () => {
		expect(typeof docGrid['tags']['author'] !== 'undefined').to.be.true
	})

	it('should the component have description', () => {
		expect(typeof docGrid['description'] !== 'undefined').to.be.true
	})

	it('should have methods', () => {
		expect(typeof docGrid['methods'] !== 'undefined').to.be.true
	})

	it('should the component have one method', () => {
		expect(Object.keys(docGrid['methods']).length === 1).to.be.true
	})

	it('should have props', () => {
		expect(typeof docGrid['props'] !== 'undefined').to.be.true
	})

	it('should the component have version', () => {
		expect(typeof docGrid['tags']['version'] !== 'undefined').to.be.true
	})

	it('should the component have three prop', () => {
		expect(Object.keys(docGrid['props']).length === 3).to.be.true
	})

	it('should the prop msg have four tags', () => {
		expect(Object.keys(docGrid['props']['msg']['tags']).length === 4).to.be.true
	})
})
