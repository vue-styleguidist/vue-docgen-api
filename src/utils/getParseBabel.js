const babel = require('babel-core')

module.exports = function getParseBabel(
	code,
	preset = '2015',
	comments = false
) {
	const options = {
		ast: false,
		comments,
		presets: [
			["env", {
				"targets": {
					"chrome": 52
				}
			}]
		],
		plugins: ["transform-object-rest-spread"]
	}
	return babel.transform(code, options)
}
