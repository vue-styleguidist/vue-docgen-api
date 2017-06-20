let loaders = require('vue-webpack-loaders');

export default {
	debug: true,
	recursive: true,
	resolve: {
		modulesDirectories: ['node_modules', 'bower_components'],
	},
	module: {
		loaders,
	},
}
