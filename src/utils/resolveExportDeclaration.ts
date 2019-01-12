import * as bt from '@babel/types'
import { NodePath } from 'ast-types'

export default function resolveExportDeclaration(path: NodePath) {
  const definitions: NodePath[] = []
  const node = path.node
  if (bt.isExportDefaultDeclaration(node)) {
    definitions.push(path.get('declaration'))
  } else if (bt.isExportNamedDeclaration(node)) {
    if (node.declaration && bt.isVariableDeclaration(node.declaration)) {
      path.get('declaration', 'declarations').each((declarator) => definitions.push(declarator))
    } else {
      definitions.push(path.get('declaration'))
    }
  } else if (bt.isDeclareExportDeclaration(node)) {
    path.get('specifiers').each((specifier: NodePath) => {
      const specifierNode = specifier.node
      definitions.push(
        bt.isExportSpecifier(specifierNode) ? specifier.get('local') : specifier.get('id'),
      )
    })
  }
  return definitions
}
