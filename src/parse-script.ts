import { ParserPlugin } from '@babel/parser'
import { NodePath } from '@babel/traverse'
import * as bt from '@babel/types'
import buildParser from './babel-parser'
import { ComponentDoc, Documentation } from './Documentation'
import getRequiredExtendsDocumentations from './utils/getRequiredExtendsDocumentations'
import getRequiredMixinDocumentations from './utils/getRequiredMixinDocumentations'
import resolveExportedComponent from './utils/resolveExportedComponent'

// tslint:disable-next-line:no-var-requires
const deepmerge = require('deepmerge')

const ERROR_MISSING_DEFINITION = 'No suitable component definition found'

export default function parseScript(
  source: string,
  handlers: Array<(doc: Documentation, componentDefinition: NodePath) => void>,
  options: { lang: 'ts' | 'js'; filePath: string },
): { doc: ComponentDoc; ast: bt.File } {
  const plugins: ParserPlugin[] = options.lang === 'ts' ? ['typescript'] : ['flow']
  const ast = buildParser({ plugins }).parse(source)
  if (!ast) {
    throw new Error(ERROR_MISSING_DEFINITION)
  }
  const componentDefinitions = resolveExportedComponent(ast)

  if (componentDefinitions.length === 0) {
    throw new Error(ERROR_MISSING_DEFINITION)
  }

  // extends management
  const extendsDocumentations =
    getRequiredExtendsDocumentations(ast, componentDefinitions, options.filePath) || {}

  // mixins management
  const mixinsDocumentations = getRequiredMixinDocumentations(
    ast,
    componentDefinitions,
    options.filePath,
  )

  // merge all the varnames found in the mixins
  const mixinDocs = Object.keys(mixinsDocumentations).reduce((acc, mixinVar) => {
    return deepmerge(acc, mixinsDocumentations[mixinVar])
  }, extendsDocumentations)

  const vueDocArray = executeHandlers(handlers, componentDefinitions, mixinDocs)
  return { doc: vueDocArray[0], ast }
}

function executeHandlers(
  localHandlers: Array<(doc: Documentation, componentDefinition: NodePath) => void>,
  componentDefinitions: NodePath[],
  mixinsDocumentations: { props?: any; data?: any },
) {
  return componentDefinitions.map((compDef) => {
    const documentation = new Documentation(mixinsDocumentations)
    localHandlers.forEach((handler) => handler(documentation, compDef))
    return documentation.toObject()
  })
}
