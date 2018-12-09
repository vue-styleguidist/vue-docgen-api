const babylon = require('babylon')

const options = {
  sourceType: 'module',
  strictMode: false,
  locations: true,
  ranges: true,
  ecmaVersion: 7,
  features: {
    'es7.classProperties': true,
    'es7.decorators': true,
    'es7.comprehensions': true,
    'es7.asyncFunctions': true,
    'es7.exportExtensions': true,
    'es7.trailingFunctionCommas': true,
    'es7.objectRestSpread': true,
    'es7.doExpressions': true,
    'es7.functionBind': true,
  },
  plugins: { jsx: true, flow: true },
}

export default {
  parse(src) {
    const file = babylon.parse(src, options)
    file.program.comments = file.comments
    return file.program
  },
}
