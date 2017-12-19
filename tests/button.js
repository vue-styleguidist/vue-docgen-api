const path = require("path");
const expect = require("chai").expect;
var api = require("../dist/main");
var button = path.join(__dirname, "./components/button/Button.vue");

describe("tests button", () => {
	const docButton = api.parse(button);

	it("should return equal object", () => {
		expect(docButton).to.deep.equal({
			description:
				"This is an example of creating a reusable button component and using it with external data.",
			methods: [],
			displayName: "buttonComponent",
			props: {
				color: {
					type: {
						name: "string"
					},
					required: "",
					defaultValue: {
						value: '"#333"',
						func: false
					},
					tags: {},
					comment: "/**\r\n   * The color for the button example\r\n   */",
					description: "The color for the button example"
				},
				size: {
					type: {
						name: "string"
					},
					required: "",
					defaultValue: {
						value: '"normal"',
						func: false
					},
					tags: {},
					comment: "/**\n   * The size of the button\n   */",
					description: "The size of the button"
				},
				secret: {
					type: {
						name: "string"
					},
					required: "",
					tags: {},
					comment: "/**\r\n   * Another mixin\r\n   */",
					description: "Another mixin"
				},
				example: {
					type: {
						name: "boolean"
					},
					required: "",
					defaultValue: {
						value: "false",
						func: false
					},
					tags: {},
					comment: "/**\n   * The example props\n   */",
					description: "The example props"
				},
				"v-model": {
					type: {
						name: "string"
					},
					required: "",
					defaultValue: {
						value: '"example model"',
						func: false
					},
					tags: {
						model: [
							{
								title: "model",
								description: ""
							}
						]
					},
					comment: "/**\n   * Model example2\n   * @model\n   */",
					description: "Model example2"
				},
				example3: {
					type: {
						name: "number"
					},
					required: "",
					defaultValue: {
						value: "16",
						func: false
					},
					tags: {},
					comment: "/**\n   * The example3 props\n   */",
					description: "The example3 props"
				},
				onCustomClick: {
					type: {
						name: "func"
					},
					required: "",
					defaultValue: {
						value: "function() { return function () { return null; }; }",
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
					comment: "/**\n   * @ignore\n   * Add custom click actions.\n   **/",
					description: ""
				},
				funcDefault: {
					type: {
						name: "func"
					},
					required: "",
					defaultValue: {
						value: "function() { return 'foo'; }",
						func: true
					},
					tags: {},
					comment: "/**\n   * Function default\n   */",
					description: "Function default"
				},
				prop1: {
					type: {
						name: "string"
					},
					tags: {
						ignore: [
							{
								title: "ignore",
								description: true
							}
						]
					},
					comment: "/**\n   *@ignore\n   *\n   */",
					description: ""
				}
			},
			comment:
				"/**\n * This is an example of creating a reusable button component and using it with external data.\n * @author [Rafael](https://github.com/rafaesc92)\n * @version 1.0.5\n*/",
			tags: {
				author: [
					{
						title: "author",
						description: "[Rafael](https://github.com/rafaesc92)"
					}
				],
				version: [
					{
						title: "version",
						description: "1.0.5"
					}
				]
			},
			events: {
				success: {
					description: "Success event.",
					type: {
						names: ["object"]
					},
					comment:
						"/**\n     * Success event.\n     *\n     * @event success\n     * @type {object}\n     */"
				}
			},
			slots: {
				default: {
					description: "Use this slot default"
				}
			}
		});
	});
});
