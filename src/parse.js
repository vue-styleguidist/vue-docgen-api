import path from 'path'
import deepmerge from 'deepmerge'
import scfParser from './utils/sfc-parser'
import buildParser from './babel-parser'
import getRequiredExtendsDocumentations from './utils/getRequiredExtendsDocumentations'
import getRequiredMixinDocumentations from './utils/getRequiredMixinDocumentations'
import resolveExportedComponent from './utils/resolveExportedComponent'
import getSlots from './utils/getSlots'
import getEvents from './utils/getEvents'
import Documentation from './Documentation'
import handlers from './handlers'

const ERROR_MISSING_DEFINITION = 'No suitable component definition found'
const ERROR_EMPTY_DOCUMENT = 'The passed source is empty'

function executeHandlers(handlers, componentDefinitions, mixinsDocumentations) {
  return componentDefinitions.map(compDef => {
    var documentation = new Documentation(mixinsDocumentations)
    handlers.forEach(handler => handler(documentation, compDef))
    return documentation.toObject()
  })
}

/**
 * parses the source and returns the doc
 * @param {string} source code whose documentation is parsed
 * @param {string} filePath path of the current file against whom to resolve the mixins
 * @returns {object} documentation object
 */
export default function parse(source, filePath) {
  const singleFileComponent = /\.vue$/i.test(path.extname(filePath))
  let parts,
    vueDocArray = [],
    ast
  if (singleFileComponent) {
    parts = scfParser(source)
  }

  if (source === '') {
    throw new Error(ERROR_EMPTY_DOCUMENT)
  }

  const originalSource = parts ? (parts.script ? parts.script.content : undefined) : source
  if (originalSource) {
    if ((parts && parts.script.lang === 'ts') || /\.tsx?$/i.test(path.extname(filePath))) {
      const typescript = require('typescript')
      const jsSource = typescript.transpileModule(originalSource, {
        compilerOptions: {
          target: 'es2017',
        },
      }).outputText
      ast = buildParser().parse(jsSource)
    } else {
      ast = buildParser().parse(originalSource)
    }

    var componentDefinitions = resolveExportedComponent(ast.program)

    if (componentDefinitions.length === 0) {
      throw new Error(ERROR_MISSING_DEFINITION)
    }

    // extends management
    var extendsDocumentations =
      getRequiredExtendsDocumentations(ast.program, componentDefinitions, filePath) || {}

    // mixins management
    var mixinsDocumentations = getRequiredMixinDocumentations(
      ast.program,
      componentDefinitions,
      filePath
    )

    // merge all the varnames found in the mixins
    const mixinDocs = Object.keys(mixinsDocumentations).reduce((acc, mixinVar) => {
      return deepmerge(acc, mixinsDocumentations[mixinVar])
    }, extendsDocumentations)

    vueDocArray = executeHandlers(handlers, componentDefinitions, mixinDocs)
  }
  const doc = vueDocArray.length
    ? vueDocArray[0]
    : { comment: '', description: '', methods: [], props: undefined, tags: {} }

  // a component should always have a display name
  if (!doc.displayName) {
    doc.displayName = path.basename(filePath).replace(/\.\w+$/, '')
  }

  // get events from comments
  doc.events = ast ? getEvents(ast) : {}

  // get slots from template
  doc.slots = parts ? getSlots(parts) : {}

  return doc
}
