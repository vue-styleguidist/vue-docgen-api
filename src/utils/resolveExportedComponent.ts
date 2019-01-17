import traverse, { NodePath } from '@babel/traverse'
import * as bt from '@babel/types'
import isExportedAssignment from './isExportedAssignment'
import resolveExportDeclaration from './resolveExportDeclaration'

function isComponentDefinition(path: NodePath): boolean {
  return (
    // export default {}
    path.isObjectExpression() ||
    // export const myComp = {}
    (path.isVariableDeclarator() && path.node.init && bt.isObjectExpression(path.node.init)) ||
    // export default Vue.extends({})
    (path.isCallExpression() &&
      bt.isMemberExpression(path.node.callee) &&
      bt.isIdentifier(path.node.callee.object) &&
      path.node.callee.object.name === 'Vue' &&
      path.node.callee.property.name === 'extend') ||
    // @Component
    // export default class MyComp extends VueComp
    (path.isClassDeclaration() &&
      (path.node.decorators || []).some((d) => {
        const exp = bt.isCallExpression(d.expression) ? d.expression.callee : d.expression
        return bt.isIdentifier(exp) && exp.name === 'Component'
      }))
  )
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
export default function resolveExportedComponent(ast: bt.File): NodePath[] {
  const components: NodePath[] = []

  function setComponent(definition: NodePath) {
    if (definition && components.indexOf(definition) === -1) {
      components.push(normalizeComponentPath(definition))
    }
  }

  // function run for every non "assignment" export declaration
  // in extenso export default or export myvar
  function exportDeclaration(path: NodePath) {
    const definitions = resolveExportDeclaration(path).reduce((acc: NodePath[], definition) => {
      if (isComponentDefinition(definition)) {
        acc.push(definition)
      }
      return acc
    }, [])

    definitions.forEach((definition: NodePath) => {
      setComponent(definition)
    })
  }

  traverse(ast, {
    DeclareExportDeclaration: exportDeclaration,
    ExportNamedDeclaration: exportDeclaration,
    ExportDefaultDeclaration: exportDeclaration,

    AssignmentExpression(path) {
      // function run on every assignments (with an =)

      // Ignore anything that is not `exports.X = ...;` or
      // `module.exports = ...;`
      if (!isExportedAssignment(path)) {
        return
      }

      // Resolve the value of the right hand side. It should resolve to a call
      // expression, something like Vue.extend({})
      const pathRight = path.get('right')
      if (!isComponentDefinition(pathRight)) {
        return
      }

      setComponent(pathRight)
    },
  })

  return components
}

function normalizeComponentPath(path: NodePath): NodePath {
  if (path.isObjectExpression()) {
    return path
  } else if (path.isCallExpression()) {
    return path.get('arguments')[0]
  } else if (path.isVariableDeclarator()) {
    return path.get('init') as NodePath
  }
  return path
}
