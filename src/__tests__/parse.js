var path = require("path");
var fs = require("fs");
const expect = require("chai").expect;
var parse = require("../../dist/main");

describe("parse", () => {
	it("should return an function", () => {
		expect(parse.parse).to.be.an("function");
	});
});
