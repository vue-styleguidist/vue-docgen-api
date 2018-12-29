import recast from 'recast'
import path from 'path'
import deepmerge from 'deepmerge'
import parser from './utils/parser'
import babylon from './babylon'
import getRequiredMixinDocumentations from './utils/getRequiredMixinDocumentations'
import resolveExportedComponent from './utils/resolveExportedComponent'
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
  const singleFileComponent = /\.vue/i.test(path.extname(filePath))
  if (source === '') {
    throw new Error(ERROR_EMPTY_DOCUMENT)
  }
  const script = singleFileComponent ? parser(source).script.content : source
  var ast = recast.parse(script, babylon)
  var componentDefinitions = resolveExportedComponent(ast.program, recast)
  var mixinsDocumentations = getRequiredMixinDocumentations(
    ast.program,
    recast,
    componentDefinitions,
    filePath
  )

  if (componentDefinitions.length === 0) {
    throw new Error(ERROR_MISSING_DEFINITION)
  }

  // merge all the varnames found in the mixins
  const mixinDocs = Object.keys(mixinsDocumentations).reduce((acc, mixinVar) => {
    return deepmerge(acc, mixinsDocumentations[mixinVar])
  }, {})

  const vueDoc = executeHandlers(handlers, componentDefinitions, mixinDocs)
  const ret = vueDoc.length ? vueDoc[0] : undefined
  // get events from comments
  // get slots from template
  return ret
}
