import jsdoc from 'jsdoc-api'
import path from 'path'
import recast from 'recast'
import babylon from './babylon'
import parseModule from './parseModule'
import resolveExportedComponent from './resolveExportedComponent'
import Documentation from '../Documentation'
import propTypeHandler from '../handlers/propTypeHandler'

// var ERROR_MISSING_DEFINITION = 'No suitable component definition found.'

function executeHandlers(handlers, componentDefinitions) {
  return componentDefinitions.map(componentDefinition => {
    var documentation = new Documentation()
    handlers.forEach(handler => handler(documentation, componentDefinition))
    return documentation.toObject()
  })
}

export default function getDocFile(source, file, lang) {
  try {
    const parsedSource = parseModule(source, file, lang, '2017')
    let docReturn = jsdoc
      .explainSync({
        source: parsedSource,
        configure: path.join(path.dirname(__dirname), '..', 'config.json'),
      })
      .filter(obj => obj.undocumented !== true)
      .map(obj => {
        if (obj.meta) {
          obj.meta.filename = file
          obj.meta.path = file
        } else {
          obj.files[0] = file
        }
        return obj
      })

    var ast = recast.parse(source, babylon)
    var componentDefinitions = resolveExportedComponent(ast.program, recast)
    console.log(componentDefinitions)

    if (Array.isArray(componentDefinitions)) {
      if (componentDefinitions.length === 0) {
        // throw new Error(ERROR_MISSING_DEFINITION)
      }
      console.log(executeHandlers([propTypeHandler], componentDefinitions[0]))
    } else if (componentDefinitions) {
      console.log(executeHandlers([propTypeHandler], [componentDefinitions])[0])
    }
    return docReturn
  } catch (err) {
    const errorMessage = err.toString()
    console.log(`\n${errorMessage}\n`)
    throw new Error(err)
  }
}
