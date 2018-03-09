import getParseTypescript from './getParseTypescript'
const getParseBabel = require('./getParseBabel')

export function parseModule(source, type, preset) {
	const comment = !!preset
	preset = preset || '2015'
	switch (type) {
		case 'ts':
			const tsOutput = getParseTypescript(source)
			return getParseBabel(tsOutput.outputText, preset, comment).code
			break
		default:
			return getParseBabel(source, preset, comment).code
	}
}
