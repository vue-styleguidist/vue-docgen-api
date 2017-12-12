var getProp = require("../../../dist/utils/getProp").default;
const expect = require("chai").expect;

describe("getProp", () => {
	it("should return a object", () => {
		expect(
			getProp(
				{
					default: function() {
						return function() {
							return null;
						};
					}
				},
				{
					ignore: true
				}
			)
		).to.deep.equal({
			type: {
				name: "func"
			},
			required: "",
			defaultValue: {
				value: "function() { return function() { return null; }; }",
				func: true
			},
			tags: {
				ignore: [
					{
						title: "ignore",
						description: true
					}
				]
			},
			comment: "",
			description: ""
		});
	});

	it("should return a prop type string", () => {
		expect(
			getProp(
				{
					type: String
				},
				{
					ignore: true
				}
			)
		).to.deep.equal({
			type: {
				name: "string"
			},
			required: "",
			tags: {
				ignore: [
					{
						title: "ignore",
						description: true
					}
				]
			},
			comment: "",
			description: ""
		});
	});

	it("should return a prop type string with default", () => {
		expect(
			getProp({
				default: "Hello",
				type: String
			})
		).to.deep.equal({
			type: {
				name: "string"
			},
			required: "",
			defaultValue: {
				value: '"Hello"',
				func: false
			},
			tags: {},
			comment: "",
			description: ""
		});
	});

	it("should return a prop type string with function default", () => {
		expect(
			getProp({
				default: function() {
					return "Hello";
				},
				type: String
			})
		).to.deep.equal({
			type: {
				name: "string"
			},
			required: "",
			defaultValue: {
				value: 'function() { return "Hello"; }',
				func: true
			},
			tags: {},
			comment: "",
			description: ""
		});
	});

	it("should return a prop type number", () => {
		expect(
			getProp({
				type: Number
			})
		).to.deep.equal({
			type: {
				name: "number"
			},
			required: "",
			tags: {},
			comment: "",
			description: ""
		});
	});

	it("should return a prop type number with default", () => {
		expect(
			getProp({
				default: 3,
				type: Number
			})
		).to.deep.equal({
			type: {
				name: "number"
			},
			required: "",
			defaultValue: {
				value: "3",
				func: false
			},
			tags: {},
			comment: "",
			description: ""
		});
	});

	it("should return a prop type number with function default", () => {
		expect(
			getProp({
				default: function() {
					return 3;
				},
				type: Number
			})
		).to.deep.equal({
			type: {
				name: "number"
			},
			required: "",
			defaultValue: {
				value: "function() { return 3; }",
				func: true
			},
			tags: {},
			comment: "",
			description: ""
		});
	});

	it("should return a prop type boolean", () => {
		expect(
			getProp({
				type: Boolean
			})
		).to.deep.equal({
			type: {
				name: "boolean"
			},
			required: "",
			tags: {},
			comment: "",
			description: ""
		});
	});

	it("should return a prop type boolean with default", () => {
		expect(
			getProp({
				default: true,
				type: Boolean
			})
		).to.deep.equal({
			type: {
				name: "boolean"
			},
			required: "",
			defaultValue: {
				value: "true",
				func: false
			},
			tags: {},
			comment: "",
			description: ""
		});
	});

	it("should return a prop type boolean with function default", () => {
		expect(
			getProp({
				default: function() {
					return true;
				},
				type: Boolean
			})
		).to.deep.equal({
			type: {
				name: "boolean"
			},
			required: "",
			defaultValue: {
				value: "function() { return true; }",
				func: true
			},
			tags: {},
			comment: "",
			description: ""
		});
	});

	it("should return a prop type Array", () => {
		expect(
			getProp({
				type: Array
			})
		).to.deep.equal({
			type: {
				name: "array"
			},
			required: "",
			tags: {},
			comment: "",
			description: ""
		});
	});

	it("should return a prop type Array with default", () => {
		expect(
			getProp({
				default: [],
				type: Array
			})
		).to.deep.equal({
			type: {
				name: "array"
			},
			required: "",
			defaultValue: {
				value: "[]",
				func: false
			},
			tags: {},
			comment: "",
			description: ""
		});
	});

	it("should return a prop type Array with function default", () => {
		expect(
			getProp({
				default: function() {
					return [];
				},
				type: Array
			})
		).to.deep.equal({
			type: {
				name: "array"
			},
			required: "",
			defaultValue: {
				value: "function() { return []; }",
				func: true
			},
			tags: {},
			comment: "",
			description: ""
		});
	});

	it("should return a prop type Object", () => {
		expect(
			getProp({
				type: Object
			})
		).to.deep.equal({
			type: {
				name: "object"
			},
			required: "",
			tags: {},
			comment: "",
			description: ""
		});
	});

	it("should return a prop type Object with default", () => {
		expect(
			getProp({
				default: {},
				type: Object
			})
		).to.deep.equal({
			type: {
				name: "object"
			},
			required: "",
			defaultValue: {
				value: "{}",
				func: false
			},
			tags: {},
			comment: "",
			description: ""
		});
	});

	it("should return a prop type Object with function default", () => {
		expect(
			getProp({
				default: function() {
					return {};
				},
				type: Object
			})
		).to.deep.equal({
			type: {
				name: "object"
			},
			required: "",
			defaultValue: {
				value: "function() { return {}; }",
				func: true
			},
			tags: {},
			comment: "",
			description: ""
		});
	});

	it("should return a prop type Function", () => {
		expect(
			getProp({
				type: Function
			})
		).to.deep.equal({
			type: {
				name: "func"
			},
			required: "",
			tags: {},
			comment: "",
			description: ""
		});
	});

	it("should return a prop type Function with default", () => {
		expect(
			getProp({
				default: function(){},
				type: Function
			})
		).to.deep.equal({
			type: {
				name: "func"
			},
			required: "",
			defaultValue: {
				value: "function(){}",
				func: true
			},
			tags: {},
			comment: "",
			description: ""
		});
	});

	it("should return a prop type Function with function default", () => {
		expect(
			getProp({
				default: function() {
					return function() {};
				},
				type: Function
			})
		).to.deep.equal({
			type: {
				name: "func"
			},
			required: "",
			defaultValue: {
				value: "function() { return function() {}; }",
				func: true
			},
			tags: {},
			comment: "",
			description: ""
		});
	});
});
