import sandbox from './sandbox';
const babel = require('babel-core');
import vm from 'vm';

const babelifyCode = code => {
	const options = {
		ast: false,
		comments: false,
		presets: ['babel-preset-es2015'],
	};
	return babel.transform(code, options);
};

function clone(obj) {
	if (null == obj || 'object' != typeof obj) return obj;
	var copy = obj.constructor();
	for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	}
	return copy;
}

const evalComponentCode = (code) => {
	try {
		const script = new vm.Script(code, {});
		let sand = clone(sandbox)
		const context = new vm.createContext(sand);
		script.runInContext(context);
		return sand.exports;
	} catch (err) {
		throw new Error('Can not compile the vue component', err)
	}
};

module.exports = function getSandbox(jscodeReqest) {
	const babelifycode = babelifyCode(jscodeReqest);
	return evalComponentCode(babelifycode.code);
};
