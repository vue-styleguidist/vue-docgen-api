import { ParserPlugin } from '@babel/parser'
import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import Map from 'ts-map'
import buildParser from './babel-parser'
import { Documentation } from './Documentation'
import cacher from './utils/cacher'
import resolveExportedComponent from './utils/resolveExportedComponent'

// tslint:disable-next-line:no-var-requires
import recast = require('recast')

const ERROR_MISSING_DEFINITION = 'No suitable component definition found'

export default function parseScript(
  source: string,
  documentation: Documentation,
  handlers: Array<
    (doc: Documentation, componentDefinition: NodePath, ast: bt.File, filePath: string) => void
  >,
  options: { lang: 'ts' | 'js'; filePath: string },
) {
  const plugins: ParserPlugin[] = options.lang === 'ts' ? ['typescript'] : ['flow']

  const ast = cacher(() => recast.parse(source, { parser: buildParser({ plugins }) }), source)
  if (!ast) {
    throw new Error(ERROR_MISSING_DEFINITION)
  }

  // FIXME: should be a Map<nameOfExport,NodePath>
  // then the documentation can become a map itself and we can look at component/mixins
  // with multiple items inside
  const componentDefinitions = resolveExportedComponent(ast)

  if (componentDefinitions.size === 0) {
    throw new Error(ERROR_MISSING_DEFINITION)
  }

  executeHandlers(handlers, componentDefinitions, documentation, ast, options.filePath)
}

function executeHandlers(
  localHandlers: Array<
    (doc: Documentation, componentDefinition: NodePath, ast: bt.File, filePath: string) => void
  >,
  componentDefinitions: Map<string, NodePath>,
  documentation: Documentation,
  ast: bt.File,
  filePath: string,
) {
  return componentDefinitions.forEach(compDef => {
    if (compDef) {
      localHandlers.forEach(handler => handler(documentation, compDef, ast, filePath))
    }
  })
}
