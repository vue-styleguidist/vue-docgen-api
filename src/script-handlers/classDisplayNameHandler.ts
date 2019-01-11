import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import { Documentation } from '../Documentation'

export default function propHandler(documentation: Documentation, path: NodePath) {
  if (bt.isClassDeclaration(path.node)) {
    const config = getArgFromDecorator(path.node)

    const arg = config ? config[0] : undefined

    let displayName: string | undefined
    if (arg && bt.isObjectExpression(arg)) {
      arg.properties
        .filter((p: bt.ObjectProperty) => p.key.name === 'name')
        .forEach((p: bt.ObjectProperty) => {
          if (p.value && bt.isLiteral(p.value)) {
            displayName = (p.value as bt.StringLiteral).value
          }
        })
    } else {
      displayName = path.node.id ? path.node.id.name : undefined
    }

    if (displayName) {
      documentation.set('displayName', displayName)
    }
  }
}

function getArgFromDecorator(
  node: bt.ClassDeclaration,
): undefined | Array<bt.Expression | bt.SpreadElement | bt.JSXNamespacedName> {
  const exp = node.decorators && node.decorators[0].expression
  if (exp && bt.isCallExpression(exp)) {
    return exp.arguments
  }
  return undefined
}
