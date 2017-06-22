import getDocFile from './getDocFile';
import stateDoc from './stateDoc';
const babel = require('babel-core');
const fs = require('fs');
const path = require('path');
const getRequires = require('./getRequires');
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

function getMixins(code, file) {
	try {
		const requiresFromComponent = getRequires(code);
		let output = [];
		Object.keys(requiresFromComponent).forEach((reqFromComponent) =>{
			const tempRequire = reqFromComponent.split('/');
			if (tempRequire[0] === '.' || tempRequire[0] === '..') {
				const folderFile = path.dirname(file);
				const pathRequire = path.join(path.normalize(folderFile), reqFromComponent) + '.js'
				if (fs.existsSync(pathRequire)) {
					const source = fs.readFileSync(pathRequire, { encoding: 'utf-8' });
					stateDoc.saveMixin(source, pathRequire);
					if (stateDoc.isMixin()){
						const babelifycode = babelifyCode(source);
						const mixin = evalComponentCode(babelifycode.code);
						if (Object.keys(mixin.exports).length === 0 ) {
							mixin.exports.default = mixin.module.exports;
						}
						if (mixin.exports.default) {
							output.push(mixin.exports.default);
						}
					}
				}
			}
		});
		return output;
	} catch (err) {
		throw err
	}
}

const evalComponentCode = (code) => {
	try {
		const script = new vm.Script(code, {});
		const sandbox = {
			exports: {},
			Vue: {
				component: () => {},
				extended: () => {},
			},
			module: {
				exports: {
				},
			},
			require:()=> {
				return function(){}
			},
			document: {},
			window: {
				location: {},
			},
			alert() {},
			confirm() {},
			console: {
				log() {},
				debug() {},
			},
			sessionStorage: {
				getItem() {},
				setItem() {},
				removeItem() {},
			},
			localStorage: {
				getItem() {},
				setItem() {},
				removeItem() {},
			},
		}
		const context = new vm.createContext(sandbox);
		script.runInContext(context);
		const output = sandbox;
		return clone(output);
	} catch (err) {
		throw err
	}
};

module.exports = function getSandbox(jscodeReqest, file) {
	const babelifycode = babelifyCode(jscodeReqest);
	let component = evalComponentCode(babelifycode.code).exports;
	const mixins = getMixins(babelifycode.code, file).reverse();
	component.default.mixins = mixins;
	return component;
};
