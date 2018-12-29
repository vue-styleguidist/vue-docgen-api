import { utils } from 'react-docgen'
import resolveExportDeclaration from './resolveExportDeclaration'
import isExportedAssignment from './isExportedAssignment'

function ignore() {
  return false
}

function isComponentDefinition(path, types) {
  return types.ObjectExpression.check(path.node)
}

/**
 * Given an AST, this function tries to find the exported component definitions.
 *
 * If a definition is part of the following statements, it is considered to be
 * exported:
 *
 * modules.exports = Definition;
 * exports.foo = Definition;
 * export default Definition;
 * export var Definition = ...;
 */
export default function resolveExportedComponent(ast, recast) {
  var types = recast.types.namedTypes
  var components = []

  // function run for every non "assignment" export declaration
  // in extenso export default or export myvar
  function exportDeclaration(path) {
    var definitions = resolveExportDeclaration(path, types).reduce((acc, definition) => {
      if (isComponentDefinition(definition, types)) {
        acc.push(definition)
      }
      return acc
    }, [])

    if (definitions.length === 0) {
      return false
    }
    definitions.forEach(definition => {
      if (definition && components.indexOf(definition) === -1) {
        components.push(definition)
      }
    })
    return false
  }

  recast.visit(ast, {
    visitFunctionDeclaration: ignore,
    visitFunctionExpression: ignore,
    visitClassDeclaration: ignore,
    visitClassExpression: ignore,
    visitIfStatement: ignore,
    visitWithStatement: ignore,
    visitSwitchStatement: ignore,
    visitCatchCause: ignore,
    visitWhileStatement: ignore,
    visitDoWhileStatement: ignore,
    visitForStatement: ignore,
    visitForInStatement: ignore,

    visitExportDeclaration: exportDeclaration,
    visitExportNamedDeclaration: exportDeclaration,
    visitExportDefaultDeclaration: exportDeclaration,

    visitAssignmentExpression: function(path) {
      // function run on every assignments (with an =)

      // Ignore anything that is not `exports.X = ...;` or
      // `module.exports = ...;`
      if (!isExportedAssignment(path)) {
        return false
      }
      // Resolve the value of the right hand side. It should resolve to a call
      // expression, something like React.createClass
      path = utils.resolveToValue(path.get('right'))
      if (!isComponentDefinition(path, types)) {
        path = utils.resolveToValue(path)
        if (!isComponentDefinition(path, types)) {
          return false
        }
      }
      const definition = path
      if (definition && components.indexOf(definition) === -1) {
        components.push(definition)
      }
      return false
    },
  })

  return components
}
