const path = require("path");
const expect = require("chai").expect;
var api = require("../dist/main");
var exampleVuex = path.join(__dirname, "./components/vuex/example.vue");

describe("test example vuex", () => {
	const docVuex = api.parse(exampleVuex);

	it("should return equal object", () => {
		expect(docVuex).to.deep.equal({
			description: "Partial mapping, object spread operator example",
			props: undefined,
			methods: [
				{
					name: "onSubmit",
					comment:
						"/**\n    * Sets the order\n    *\n    * @public\n    * @version 1.0.5\n    * @since Version 1.0.1\n    * @param {string} key Key to order\n    * @returns {string} Test\n    */",
					modifiers: [],
					params: [
						{
							name: "key",
							description: "Key to order",
							type: {
								name: "string"
							}
						}
					],
					returns: {
						description: "Test",
						type: {
							name: "string"
						}
					},
					description: "Sets the order",
					tags: {
						access: [
							{
								title: "access",
								description: "public"
							}
						],
						params: [
							{
								title: "param",
								description: "Key to order",
								name: "key",
								type: {
									type: "NameExpression",
									name: "string"
								}
							}
						],
						returns: [
							{
								title: "returns",
								description: "Test",
								type: {
									type: "NameExpression",
									name: "string"
								}
							}
						],
						since: [
							{
								title: "since",
								description: "Version 1.0.1"
							}
						],
						version: [
							{
								title: "version",
								description: "1.0.5"
							}
						]
					}
				}
			],
			displayName: "example",
			comment: "/**\n* Partial mapping, object spread operator example\n*/",
			tags: {},
			events: {},
			slots: {}
		});
	});
});
