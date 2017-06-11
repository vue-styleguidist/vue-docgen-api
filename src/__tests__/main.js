var main = require('../../dist/main');
const expect = require("chai").expect;

describe('main', () => {
	it('should return an object', () => {
		expect(main).to.be.an('object')
	})
})
