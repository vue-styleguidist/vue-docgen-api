import recast from 'recast'
import babylon from './babylon'
import resolveExportedComponent from './resolveExportedComponent'
import Documentation from '../Documentation'
import propHandler from '../handlers/propHandler'

var ERROR_MISSING_DEFINITION = 'No suitable component definition found.'

function executeHandlers(handlers, componentDefinitions) {
  return componentDefinitions.map(compDef => {
    var documentation = new Documentation()
    handlers.forEach(handler => handler(documentation, compDef))
    return documentation.toObject()
  })
}

export default function getDocFile(source, file, lang) {
  var ast = recast.parse(source, babylon)
  var componentDefinitions = resolveExportedComponent(ast.program, recast)

  if (componentDefinitions.length === 0) {
    throw new Error(ERROR_MISSING_DEFINITION)
  }

  return executeHandlers([propHandler], componentDefinitions)
}
