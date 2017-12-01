var parse = require('../../dist/parse');
const expect = require("chai").expect;

describe('parse', () => {
	it('should return an function', () => {
		expect(parse.parse).to.be.an('function')
	})
})
