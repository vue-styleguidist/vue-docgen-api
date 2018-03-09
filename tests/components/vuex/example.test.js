const path = require('path')
const expect = require('chai').expect

var api = require('../../../dist/main')
var exampleVuex = path.join(__dirname, './example.vue')

describe('test example vuex', () => {
	const docVuex = api.parse(exampleVuex)
	it('should return an object', () => {
		expect(docVuex).to.be.an('object')
	})

	it('The component name should be example', () => {
		expect(docVuex.displayName).to.equal('example')
	})

	it('The component should has a description', () => {
		expect(docVuex.description).to.equal(
			'Partial mapping, object spread operator example'
		)
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
