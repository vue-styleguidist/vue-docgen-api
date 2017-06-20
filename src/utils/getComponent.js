import optionsWebpack from './optionsWebpack';
const path = require('path');

export default function getComponentModuleJSCode (source, file, webpackConfig){
	let myRequire;
	if (webpackConfig && webpackConfig.module && webpackConfig.module.loaders) {
		optionsWebpack.module.loaders = webpackConfig.module.loaders;
	}
	let loaders = optionsWebpack.module.loaders;
	loaders.push({
		test: /\.vue$/,
		exclude: /node_modules/,
		loader: path.resolve(__dirname, '../loaders/vuedoc-loader.js'),
	})

	loaders.unshift({
		test: /\.js$/,
		exclude: /node_modules/,
		loader: path.resolve(__dirname, '../loaders/mixin-loader.js'),
	});

	myRequire = require('enhanced-require')(module, optionsWebpack);
	return myRequire(file)
}
