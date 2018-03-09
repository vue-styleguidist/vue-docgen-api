const expect = require('chai').expect
const parse = require('../../dist/parse')

describe("parse", () => {
	it("should return an function", () => {
		expect(parse.parse).to.be.an("function");
	});
});
