const babel = require('babel-core');

module.exports = function getParseBabel(code, preset = '2015', comments = false) {
	let presets;

	if (preset === '2017') {
		presets = ['babel-preset-es2017', 'babel-preset-stage-3'];
	} else {
		presets = ['babel-preset-es2015', 'babel-preset-stage-2'];
	}

	const options = {
		ast: false,
		comments,
		presets,
	};
	return babel.transform(code, options);
};