export default {
	exports: {},
	Vue: {
		component: () => {},
		extended: () => {},
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
