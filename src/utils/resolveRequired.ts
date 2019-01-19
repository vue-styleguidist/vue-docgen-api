import * as bt from '@babel/types'
import { NodePath } from 'ast-types'

// tslint:disable-next-line:no-var-requires
import recast = require('recast')

/**
 *
 * @param ast
 * @param varNameFilter
 */
export default function resolveRequired(
  ast: bt.File,
  varNameFilter?: string[],
): { [key: string]: string } {
  const varToFilePath: { [key: string]: string } = {}

  recast.visit(ast.program, {
    visitImportDeclaration(astPath: NodePath) {
      const specifiers = astPath.get('specifiers')

      // if `import 'module'` without variable name it cannot be a mixin

      specifiers.each((sp: NodePath) => {
        const nodeSpecifier = sp.node
        if (bt.isImportDefaultSpecifier(nodeSpecifier) || bt.isImportSpecifier(nodeSpecifier)) {
          const varNameDefault = nodeSpecifier.local.name
          if (!varNameFilter || varNameFilter.indexOf(varNameDefault) > -1) {
            const nodeSource = (astPath.get('source') as NodePath<bt.Literal>).node
            if (bt.isLiteral(nodeSource)) {
              varToFilePath[varNameDefault] = (nodeSource as bt.StringLiteral).value
            }
          }
        }
      })
      return false
    },

    visitVariableDeclaration(astPath: NodePath) {
      // only look at variable declarations
      if (!bt.isVariableDeclaration(astPath.node)) {
        return false
      }
      astPath.node.declarations.forEach(nodeDeclaration => {
        let sourceNode: bt.Node
        let source: string = ''
        const init =
          nodeDeclaration.init && bt.isMemberExpression(nodeDeclaration.init)
            ? nodeDeclaration.init.object
            : nodeDeclaration.init
        if (!init) {
          return
        }

        if (bt.isCallExpression(init)) {
          if (!bt.isIdentifier(init.callee) || init.callee.name !== 'require') {
            return
          }
          sourceNode = init.arguments[0]
          if (!bt.isLiteral(sourceNode)) {
            return
          }
          source = (sourceNode as bt.StringLiteral).value
        } else {
          return
        }

        if (bt.isIdentifier(nodeDeclaration.id)) {
          const varName = nodeDeclaration.id.name
          varToFilePath[varName] = source
        } else if (bt.isObjectPattern(nodeDeclaration.id)) {
          nodeDeclaration.id.properties.forEach((p: bt.ObjectProperty) => {
            varToFilePath[p.key.name] = source
          })
        } else {
          return
        }
      })
      return false
    },
  })

  return varToFilePath
}
