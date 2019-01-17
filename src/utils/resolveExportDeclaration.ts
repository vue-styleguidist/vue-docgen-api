import { NodePath } from '@babel/traverse'
import * as bt from '@babel/types'

export default function resolveExportDeclaration(path: NodePath) {
  const definitions: NodePath[] = []
  if (path.isExportDefaultDeclaration()) {
    const defaultPath = path as NodePath<bt.ExportDefaultDeclaration>
    definitions.push(defaultPath.get('declaration'))
  } else if (path.isExportNamedDeclaration()) {
    const declaration = path.get('declaration')
    if (declaration && declaration.isVariableDeclaration()) {
      declaration
        .get('declarations')
        .forEach((declarator: NodePath) => definitions.push(declarator))
    } else {
      definitions.push(path.get('declaration') as NodePath)
    }
  } else if (path.isExportDeclaration()) {
    const declarePath = path
    const specifiersPath = declarePath.get('specifiers')
    const specifiersPathArray = Array.isArray(specifiersPath) ? specifiersPath : [specifiersPath]
    specifiersPathArray.forEach(
      (specifier: NodePath<bt.ExportSpecifier | bt.ExportNamespaceSpecifier>) => {
        definitions.push(
          specifier.isExportSpecifier() ? specifier.get('local') : specifier.get('exported')
        )
      }
    )
  }
  return definitions
}
