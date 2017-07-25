import stateDoc from './stateDoc';
const fs = require('fs');
const path = require('path');
const getRequires = require('./getRequires');
const getParseBabel = require('./getParseBabel');
import vm from 'vm';

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
						const babelifycode = getParseBabel(source);
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
		let requireSanbox = function(element){
			if (element === 'vuex') {
				return {
					mapState: function(){},
					mapMutations: function(){},
					mapGetters: function(){},
					mapActions: function(){}
				}
			}
			return function(){}
		}
		requireSanbox.context = function(){
			return function(){}
		}
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
			require:requireSanbox,
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
	const babelifycode = getParseBabel(jscodeReqest);
	let component = evalComponentCode(babelifycode.code).exports;
	const mixins = getMixins(babelifycode.code, file).reverse();
	component.default.mixins = mixins;
	return component;
};
