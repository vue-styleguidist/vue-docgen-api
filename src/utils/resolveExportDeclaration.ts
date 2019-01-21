import * as bt from '@babel/types'
import { NodePath } from 'ast-types'

export default function resolveExportDeclaration(path: NodePath): NodePath[] {
  const definitions: NodePath[] = []
  if (bt.isExportDefaultDeclaration(path.node)) {
    const defaultPath = path as NodePath<bt.ExportDefaultDeclaration>
    definitions.push(defaultPath.get('declaration'))
  } else if (bt.isExportNamedDeclaration(path.node)) {
    const declaration = path.get('declaration')
    if (declaration && bt.isVariableDeclaration(declaration.node)) {
      declaration.get('declarations').each((declarator: NodePath) => definitions.push(declarator))
    } else {
      definitions.push(path.get('declaration') as NodePath)
    }
  } else if (bt.isExportDeclaration(path.node)) {
    const declarePath = path
    const specifiersPath = declarePath.get('specifiers')
    specifiersPath.each((specifier: NodePath<bt.ExportSpecifier | bt.ExportNamespaceSpecifier>) => {
      definitions.push(
        bt.isExportSpecifier(specifier.node) ? specifier.get('local') : specifier.get('exported'),
      )
    })
  }
  return definitions
}
