import { utils } from 'react-docgen'
// import isExportsOrModuleAssignment from 'react-docgen/utils/isExportsOrModuleAssignment'
// import isReactComponentClass from 'react-docgen/utils/isReactComponentClass'
// import isReactCreateClassCall from 'react-docgen/utils/isReactCreateClassCall'
// import isStatelessComponent from 'react-docgen/utils/isStatelessComponent'
// import normalizeClassDefinition from 'react-docgen/utils/normalizeClassDefinition'
// import resolveExportDeclaration from 'react-docgen/utils/resolveExportDeclaration'
// import resolveToValue from 'react-docgen/utils/resolveToValue'
// import resolveHOC from 'react-docgen/utils/resolveHOC'

const {
  isExportsOrModuleAssignment,
  resolveExportDeclaration,
  resolveToValue,
} = utils

function ignore() {
  return false
}

function isComponentDefinition(path, types) {
  return types.ObjectExpression.check(path.node)
}

/**
 * Given an AST, this function tries to find the exported component definitions.
 *
 * The component definitions are either the ObjectExpression passed to
 * `React.createClass` or a `class` definition extending `React.Component` or
 * having a `render()` method.
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

  function exportDeclaration(path) {
    var definitions = resolveExportDeclaration(path, types).reduce(
      (acc, definition) => {
        if (isComponentDefinition(definition, types)) {
          acc.push(definition)
        }
        return acc
      },
      []
    )

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
      // Ignore anything that is not `exports.X = ...;` or
      // `module.exports = ...;`
      if (!isExportsOrModuleAssignment(path)) {
        return false
      }
      // Resolve the value of the right hand side. It should resolve to a call
      // expression, something like React.createClass
      path = resolveToValue(path.get('right'))
      if (!isComponentDefinition(path)) {
        path = resolveToValue(path)
        if (!isComponentDefinition(path)) {
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
