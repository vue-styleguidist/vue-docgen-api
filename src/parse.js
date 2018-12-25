import recast from 'recast'
import parser from './utils/parser'
import babylon from './babylon'
import getRequiredMixinDocumentations from './utils/getRequiredMixinDocumentations'
import resolveExportedComponent from './utils/resolveExportedComponent'
import Documentation from './Documentation'
import handlers from './handlers'

const ERROR_MISSING_DEFINITION = 'No suitable component definition found.'

function executeHandlers(handlers, componentDefinitions, mixinsDocumentations) {
  return componentDefinitions.map(compDef => {
    var documentation = new Documentation(mixinsDocumentations)
    handlers.forEach(handler => handler(documentation, compDef))
    return documentation.toObject()
  })
}

export default function parse(source) {
  var time2 = 'parse'
  console.time(time2)
  if (source === '') {
    throw new Error('The document is empty')
  }
  const blocks = parser(source)
  var ast = recast.parse(blocks.script.content, babylon)
  var mixinsDocumentations = getRequiredMixinDocumentations(ast.program, recast)
  var componentDefinitions = resolveExportedComponent(ast.program, recast)

  if (componentDefinitions.length === 0) {
    throw new Error(ERROR_MISSING_DEFINITION)
  }

  const vueDoc = executeHandlers(handlers, componentDefinitions, mixinsDocumentations)
  console.timeEnd(time2)
  return vueDoc.length ? vueDoc[0] : undefined
}
