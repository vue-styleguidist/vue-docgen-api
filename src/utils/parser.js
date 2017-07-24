import hash from 'hash-sum'
const cache = require('lru-cache')(100)

export default function parser (source, filename) {
	const cacheKey = hash(filename + source);
	// source-map cache busting for hot-reloadded modules
	let output = cache.get(cacheKey);
	if (output) {
		return output;
	}
	output = source;
	cache.set(cacheKey, output);
	return output;
}
