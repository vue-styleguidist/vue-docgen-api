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

export default function parse(source, singleFileComponent, filePath) {
  var time2 = 'parse'
  console.time(time2)
  if (source === '') {
    throw new Error('The document is empty')
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
    return Object.assign(acc, mixinsDocumentations[mixinVar])
  }, {})

  const vueDoc = executeHandlers(handlers, componentDefinitions, mixinDocs)
  console.timeEnd(time2)
  return vueDoc.length ? vueDoc[0] : undefined
}
