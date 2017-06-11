const path = require('path');
var api = require('../dist/main');
var file = path.join(__dirname,  './components/grid/Grid.vue');
const expect = require("chai").expect;

describe('tests', () => {
	it('should not return error', () => {
		expect(() => {api.parse(file)}).to.not.throw()
	})

	const docJson = api.parse(file);
	console.log(JSON.stringify(docJson, null, 2));

	it('should return an object', () => {
		expect(docJson).to.be.an('object')
	})

	it('should the component have tags', () => {
		expect(typeof docJson['tags'] !== 'undefined').to.be.true
	})

	it('should the component have authors', () => {
		expect(typeof docJson['tags']['author'] !== 'undefined').to.be.true
	})

	it('should the component have description', () => {
		expect(typeof docJson['description'] !== 'undefined').to.be.true
	})

	it('should have methods', () => {
		expect(typeof docJson['methods'] !== 'undefined').to.be.true
	})

	it('should the component have one method', () => {
		expect(Object.keys(docJson['methods']).length === 1).to.be.true
	})

	it('should have props', () => {
		expect(typeof docJson['props'] !== 'undefined').to.be.true
	})

	it('should the component have kind', () => {
		expect(typeof docJson['tags']['kind'] !== 'undefined').to.be.true
	})

	it('should the component have version', () => {
		expect(typeof docJson['tags']['version'] !== 'undefined').to.be.true
	})

	it('should the component have one prop', () => {
		expect(Object.keys(docJson['props']).length === 1).to.be.true
	})

	it('should the prop filter key have three tags', () => {
		expect(Object.keys(docJson['props']['filterKey']['tags']).length === 3).to.be.true
	})
})
