import { NodePath } from '@babel/traverse'
import * as bt from '@babel/types'
import { Documentation } from '../Documentation'

export default function classDisplayNameHandler(documentation: Documentation, path: NodePath) {
  if (path.isClassDeclaration()) {
    const config = getArgFromDecorator(path.get('decorators'))

    const arg = config && Array.isArray(config) ? config[0] : null

    let displayName: string | undefined
    if (arg && arg.isObjectExpression()) {
      arg
        .get('properties')
        .filter((p) => p.isObjectProperty() && p.node.key.name === 'name')
        .forEach((p: NodePath<bt.ObjectProperty>) => {
          const valuePath = p.get('value')
          if (valuePath.isStringLiteral()) {
            displayName = valuePath.node.value
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
  path: Array<NodePath<bt.Decorator>>,
): null | Array<NodePath<bt.Expression | bt.SpreadElement | bt.JSXNamespacedName>> {
  const expForDecorator = path
    .filter((p) => {
      const exp = p.get('expression')
      const decoratorIdenifier = exp.isCallExpression() ? exp.node.callee : exp.node
      return 'Component' === (bt.isIdentifier(decoratorIdenifier) ? decoratorIdenifier.name : null)
    })[0]
    .get('expression')
  if (expForDecorator.isCallExpression()) {
    return expForDecorator.get('arguments')
  }
  return null
}
