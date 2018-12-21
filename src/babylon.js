const parser = require('@babel/parser')

const babelParserOptions = {
  sourceType: 'module',
  strictMode: false,
  tokens: true,
  plugins: [
    'jsx',
    'flow',
    'estree',
    'doExpressions',
    'objectRestSpread',
    'classProperties',
    'classPrivateProperties',
    'classPrivateMethods',
    'exportDefaultFrom',
    'exportNamespaceFrom',
    'asyncGenerators',
    'functionBind',
    'functionSent',
    'dynamicImport',
    'numericSeparator',
    'optionalChaining',
    'importMeta',
    'bigInt',
    'optionalCatchBinding',
    'throwExpressions',
    ['pipelineOperator', { proposal: 'minimal' }],
    'nullishCoalescingOperator',
  ],
}

function buildOptions(options = {}) {
  const parserOptions = {
    ...babelParserOptions,
    plugins: [...babelParserOptions.plugins],
  }
  if (options.legacyDecorators) {
    parserOptions.plugins.push('decorators-legacy')
  } else {
    parserOptions.plugins.push([
      'decorators',
      { decoratorsBeforeExport: options.decoratorsBeforeExport || false },
    ])
  }

  return parserOptions
}

export default function buildParse(options) {
  const parserOptions = buildOptions(options)

  return {
    parse(src) {
      return parser.parse(src, parserOptions)
    },
  }
}
