import getParseTypescript from './getParseTypescript'
import getParseBabel from './getParseBabel'

module.exports = function parseModule(source, type, preset) {
  const comment = !!preset
  switch (type) {
    case 'ts':
      const tsOutput = getParseTypescript(source)
      return getParseBabel(tsOutput.outputText, comment).code
      break
    default:
      return getParseBabel(source, comment).code
  }
}
