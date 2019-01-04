import { NodePath } from 'ast-types';
import {
  isExportDefaultDeclaration,
  isExportNamedDeclaration,
  isDeclareExportDeclaration,
  isExportSpecifier,
  isVariableDeclaration,
} from '@babel/types';

export default function resolveExportDeclaration(path: NodePath) {
  const definitions = [];
  const node = path.node;
  if (isExportDefaultDeclaration(node)) {
    definitions.push(path.get('declaration'));
  } else if (isExportNamedDeclaration(node)) {
    if (node.declaration && isVariableDeclaration(node.declaration)) {
      path.get('declaration', 'declarations').each((declarator) => definitions.push(declarator));
    } else {
      definitions.push(path.get('declaration'));
    }
  } else if (isDeclareExportDeclaration(node)) {
    path.get('specifiers').each((specifier: NodePath) => {
      const specifierNode = specifier.node;
      definitions.push(
        isExportSpecifier(specifierNode) ? specifier.get('local') : specifier.get('id'),
      );
    });
  }
  return definitions;
}
