import { NodePath } from '@babel/traverse'
import * as bt from '@babel/types'
import { Documentation } from '../Documentation'

export default function displayNameHandler(documentation: Documentation, path: NodePath) {
  if (path.isObjectExpression()) {
    const namePath = path
      .get('properties')
      .filter(p => p.isObjectProperty() && p.node.key.name === 'name')

    // if no prop return
    if (!namePath.length) {
      return
    }

    const nameValuePath = namePath[0].get('value')
    const singleNameValuePath = !Array.isArray(nameValuePath) ? nameValuePath : null

    let displayName: string | null = null
    if (singleNameValuePath) {
      if (singleNameValuePath.isLiteral()) {
        displayName = (singleNameValuePath.node as bt.StringLiteral).value
      } else if (singleNameValuePath.isIdentifier()) {
        const nameConstId = singleNameValuePath.node.name
        // TODO: find out the real typeof this global scope (NodePath<bt.Program>)
        displayName = getDeclaredConstantValue(
          path.parentPath.parentPath as NodePath<bt.Program>,
          nameConstId
        )
      }
    }

    if (displayName) {
      documentation.set('displayName', displayName)
    }
  }
}

function getDeclaredConstantValue(path: NodePath<bt.Program>, nameConstId: string): string | null {
  const globalVariableDeclarations = path
    .get('body')
    .filter(p => p.isVariableDeclaration()) as Array<NodePath<bt.VariableDeclaration>>
  const declarators = globalVariableDeclarations.reduce(
    (a: bt.VariableDeclarator[], declPath) => a.concat(declPath.node.declarations),
    []
  )
  const nodeDeclaratorArray = declarators.filter(
    d => bt.isIdentifier(d.id) && d.id.name === nameConstId
  )
  const nodeDeclarator = nodeDeclaratorArray.length ? nodeDeclaratorArray[0] : undefined
  return nodeDeclarator && nodeDeclarator.init && bt.isLiteral(nodeDeclarator.init)
    ? (nodeDeclarator.init as bt.StringLiteral).value
    : null
}
