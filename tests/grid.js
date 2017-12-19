const path = require("path");
const expect = require("chai").expect;
var api = require("../dist/main");
var grid = path.join(__dirname, "./components/grid/Grid.vue");

describe("tests grid", () => {
	const docGrid = api.parse(grid);

	it("should return equal object", () => {
		expect(docGrid).to.deep.equal({
			description:
				"This is an example of creating a reusable grid component and using it with external data.",
			methods: [
				{
					name: "sortBy",
					comment:
						"/**\r\n    * Sets the order\r\n    *\r\n    * @public\r\n    * @version 1.0.5\r\n    * @since Version 1.0.1\r\n    * @param {string} key Key to order\r\n    * @returns {string} Test\r\n    */",
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
			displayName: "grid",
			props: {
				msg: {
					type: {
						name: "string|number"
					},
					required: "",
					tags: {
						see: [
							{
								title: "see",
								description:
									"See [Wikipedia](https://en.wikipedia.org/wiki/Web_colors#HTML_color_names) for a list of color names"
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
						],
						link: [
							{
								title: "link",
								description:
									"See [Wikipedia](https://en.wikipedia.org/wiki/Web_colors#HTML_color_names) for a list of color names"
							}
						]
					},
					comment:
						"/**\r\n     * object/array defaults should be returned from a factory function\r\n     * @version 1.0.5\r\n     * @since Version 1.0.1\r\n     * @see See [Wikipedia](https://en.wikipedia.org/wiki/Web_colors#HTML_color_names) for a list of color names\r\n     * @link See [Wikipedia](https://en.wikipedia.org/wiki/Web_colors#HTML_color_names) for a list of color names\r\n     */",
					description:
						"object/array defaults should be returned from a factory function"
				},
				data: {
					type: {
						name: "array"
					},
					tags: {
						version: [
							{
								title: "version",
								description: "1.0.5"
							}
						]
					},
					comment:
						"/**\r\n     * describe data\r\n     * @version 1.0.5\r\n     */",
					description: "describe data"
				},
				images: {
					type: {
						name: "array"
					},
					required: "",
					defaultValue: {
						value: "function() { return [{}]; }",
						func: true
					},
					tags: {},
					comment: "",
					description: ""
				},
				propFunc: {
					type: {
						name: "func"
					},
					required: "",
					defaultValue: {
						value: "function() {}",
						func: true
					},
					tags: {},
					comment: "/**\r\n     * prop function\r\n     */",
					description: "prop function"
				},
				columns: {
					type: {
						name: "array"
					},
					tags: {},
					comment: "/**\r\n     * get columns list\r\n     */",
					description: "get columns list"
				},
				filterKey: {
					type: {
						name: "string"
					},
					required: "",
					defaultValue: {
						value: '"example"',
						func: false
					},
					tags: {
						ignore: [
							{
								title: "ignore",
								description: true
							}
						]
					},
					comment: "/**\r\n     * filter key\r\n     * @ignore\r\n     */",
					description: "filter key"
				}
			},
			comment:
				"/**\r\n * This is an example of creating a reusable grid component and using it with external data.\r\n * @version 1.0.5\r\n * @author [Rafael](https://github.com/rafaesc92)\r\n * @since Version 1.0.1\r\n */",
			tags: {
				author: [
					{
						title: "author",
						description: "[Rafael](https://github.com/rafaesc92)"
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
			},
			events: {
				error: {
					description: "Error event.",
					type: {
						names: ["object"]
					},
					comment:
						"/**\r\n      * Error event.\r\n      *\r\n      * @event error\r\n      * @type {object}\r\n      */"
				},
				success: {
					description: "Success event.",
					type: {
						names: ["object"]
					},
					comment:
						"/**\r\n      * Success event.\r\n      *\r\n      * @event success\r\n      * @type {object}\r\n      */"
				}
			},
			slots: {
				header: {
					description: "Use this slot header"
				},
				footer: {
					description: "Use this slot footer"
				}
			}
		});
	});
});
