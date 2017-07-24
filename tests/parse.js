const path = require('path');
var api = require('../dist/main');
const expect = require("chai").expect;

var vue1 = path.join(__dirname,  './components/vue1/spinner.js');
describe('test example vue1', () =>{
	const docVue = api.parse(vue1);
	console.log(JSON.stringify(docVue, null, 2))
	it('should return an object', () => {
		expect(docVue).to.be.an('object')
	})

	it('The component name should be spinner', () => {
		expect(docVue.displayName).to.equal('spinner');
	})

	it('The component should have a description', () => {
		expect(docVue.description).to.equal('Partial mapping, object spread operator example');
	})

	it('should have a method', () => {
		expect(docVue['methods'].length).to.equal(1)
	})

	it('should have "submit" method', () => {
		expect(docVue['methods'][0]['name']).to.equal('onSubmit')
	})
})
