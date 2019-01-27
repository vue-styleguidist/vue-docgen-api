import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import Map from 'ts-map'
import isExportedAssignment from './isExportedAssignment'
import resolveExportDeclaration from './resolveExportDeclaration'

// tslint:disable-next-line:no-var-requires
import recast = require('recast')

function ignore(): boolean {
  return false
}

function isComponentDefinition(path: NodePath): boolean {
  return (
    // export default {}
    bt.isObjectExpression(path.node) ||
    // export const myComp = {}
    (bt.isVariableDeclarator(path.node) &&
      path.node.init &&
      bt.isObjectExpression(path.node.init)) ||
    // export default Vue.extends({})
    (bt.isCallExpression(path.node) &&
      bt.isMemberExpression(path.node.callee) &&
      bt.isIdentifier(path.node.callee.object) &&
      path.node.callee.object.name === 'Vue' &&
      path.node.callee.property.name === 'extend') ||
    // @Component
    // export default class MyComp extends VueComp
    (bt.isClassDeclaration(path.node) &&
      (path.node.decorators || []).some(d => {
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
export default function resolveExportedComponent(ast: bt.File): Map<string, NodePath> {
  const components = new Map<string, NodePath>()

  function setComponent(exportName: string, definition: NodePath) {
    if (definition && !components.get(exportName)) {
      components.set(exportName, normalizeComponentPath(definition))
    }
  }

  // function run for every non "assignment" export declaration
  // in extenso export default or export myvar
  function exportDeclaration(path: NodePath) {
    const definitions = resolveExportDeclaration(path).reduce((acc: NodePath[], definition) => {
      const realDef = resolveIdentifier(ast, definition)
      if (realDef && isComponentDefinition(realDef)) {
        acc.push(realDef)
      }
      return acc
    }, [])

    definitions.forEach((definition: NodePath) => {
      setComponent('default', definition)
    })
    return false
  }

  recast.visit(ast.program, {
    // to look only at the root we ignore all traversing
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

    visitDeclareExportDeclaration: exportDeclaration,
    visitExportNamedDeclaration: exportDeclaration,
    visitExportDefaultDeclaration: exportDeclaration,

    visitAssignmentExpression(path: NodePath) {
      // function run on every assignments (with an =)

      // Ignore anything that is not `exports.X = ...;` or
      // `module.exports = ...;`
      if (!isExportedAssignment(path)) {
        return false
      }

      // Resolve the value of the right hand side. It should resolve to a call
      // expression, something like Vue.extend({})
      const pathRight = path.get('right')
      const realComp = resolveIdentifier(ast, pathRight)
      if (!realComp || !isComponentDefinition(realComp)) {
        return false
      }

      setComponent('default', realComp)
      return false
    },
  })

  return components
}

function normalizeComponentPath(path: NodePath): NodePath {
  if (bt.isObjectExpression(path.node)) {
    return path
  } else if (bt.isCallExpression(path.node)) {
    return path.get('arguments', 0)
  } else if (bt.isVariableDeclarator(path.node)) {
    return path.get('init')
  }
  return path
}

function resolveIdentifier(ast: bt.File, path: NodePath): NodePath | null {
  if (!bt.isIdentifier(path.node)) {
    return path
  }

  const varName = path.node.name
  let comp: NodePath | null = null

  recast.visit(ast.program, {
    // to look only at the root we ignore all traversing
    visitFunctionDeclaration: ignore,
    visitFunctionExpression: ignore,
    visitClassExpression: ignore,
    visitIfStatement: ignore,
    visitWithStatement: ignore,
    visitSwitchStatement: ignore,
    visitCatchCause: ignore,
    visitWhileStatement: ignore,
    visitDoWhileStatement: ignore,
    visitForStatement: ignore,
    visitForInStatement: ignore,

    visitVariableDeclaration(variablePath: NodePath<bt.VariableDeclaration>) {
      const varID = variablePath.node.declarations[0].id
      if (!varID || !bt.isIdentifier(varID) || varID.name !== varName) {
        return false
      }

      comp = variablePath.get('declarations', 0).get('init')
      return false
    },

    visitClassDeclaration(classPath: NodePath<bt.ClassDeclaration>) {
      const classID = classPath.node.id
      if (!classID || !bt.isIdentifier(classID) || classID.name !== varName) {
        return false
      }

      comp = classPath
      return false
    },
  })
  return comp
}
