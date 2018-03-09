import stateDoc from './stateDoc'
const fs = require('fs')
const path = require('path')
const getRequires = require('./getRequires')
const { parseModule } = require('./parseModule')
import vm from 'vm'

function clone(obj) {
	if (null == obj || 'object' != typeof obj) return obj
	var copy = obj.constructor()
	for (var attr in obj) {
		if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr]
	}
	return copy
}

function getMixins(code, file) {
	try {
		const requiresFromComponent = getRequires(code)
		let output = []
		Object.keys(requiresFromComponent).forEach(reqFromComponent => {
			const tempRequire = reqFromComponent.split('/')
			if (tempRequire[0] === '.' || tempRequire[0] === '..') {
				const folderFile = path.dirname(file)
				const pathRequire =
					path.join(path.normalize(folderFile), reqFromComponent) + '.js'
				if (fs.existsSync(pathRequire)) {
					const source = fs.readFileSync(pathRequire, {
						encoding: 'utf-8',
					})
					stateDoc.saveMixin(source, pathRequire)
					if (stateDoc.isMixin()) {
						const parsedSource = parseModule(source, stateDoc.jscodeLang)
						const mixin = evalComponentCode(parsedSource)
						if (Object.keys(mixin.exports).length === 0) {
							mixin.exports.default = mixin.module.exports
						}
						if (mixin.exports.default) {
							output.push(mixin.exports.default)
						}
					}
				}
			}
		})
		return output
	} catch (err) {
		throw err
	}
}

const evalComponentCode = code => {
	try {
		const script = new vm.Script(code, {})
		let requireSanbox = function(element) {
			if (element === 'vuex') {
				return {
					mapState: function() {},
					mapMutations: function() {},
					mapGetters: function() {},
					mapActions: function() {},
				}
			}
			if (element === 'vue') {
				return {
					__esModule: true,
					use: function use() {},
					component: function component() {},
					extended: function extended() {},
					default: {
						extend(obj) {
							return obj
						},
					},
				}
			}
			return function() {}
		}
		requireSanbox.context = function() {
			return function() {}
		}
		const sandbox = {
			exports: {},
			module: {
				exports: {},
			},
			require: requireSanbox,
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
		const context = new vm.createContext(sandbox)
		script.runInContext(context)
		const output = sandbox
		return clone(output)
	} catch (err) {
		throw err
	}
}

module.exports = function getSandbox(stateDoc, file) {
	const parsedSource = parseModule(stateDoc.jscodeReqest, stateDoc.jscodeLang)
	let component = evalComponentCode(parsedSource).exports
	const mixins = getMixins(parsedSource, file).reverse()
	component.default.mixins = mixins
	return component
}
