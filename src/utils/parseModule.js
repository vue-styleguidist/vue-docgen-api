import getParseTypescript from './getParseTypescript'
import getParseBabel from './getParseBabel'

export default function parseModule(source, filename, type, preset) {
  const comment = !!preset
  switch (type) {
    case 'ts':
      const tsOutput = getParseTypescript(source)
      return getParseBabel(tsOutput.outputText, filename, comment).code
      break
    default:
      return getParseBabel(source, filename, comment).code
  }
}
