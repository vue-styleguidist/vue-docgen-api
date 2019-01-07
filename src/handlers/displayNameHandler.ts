import { namedTypes as types, NodePath } from 'ast-types';
import { Documentation } from 'src/Documentation';
import {
  Property,
  isLiteral,
  StringLiteral,
  Identifier,
  isIdentifier,
  isVariableDeclaration,
  VariableDeclaration,
  VariableDeclarator,
} from '@babel/types';

export default function propHandler(documentation: Documentation, path: NodePath) {
  const namePath = path
    .get('properties')
    .filter((p: NodePath<Property>) => p.node.key.name === 'name');

  // if no prop return
  if (!namePath.length) {
    return;
  }

  const nameValueNode = namePath[0].get('value').node;
  let displayName;
  if (isLiteral(nameValueNode)) {
    displayName = (nameValueNode as StringLiteral).value;
  } else if (isIdentifier(nameValueNode)) {
    const nameConstId = (nameValueNode as Identifier).name;
    displayName = getDeclaredConstantValue(path.parentPath.parentPath, nameConstId);
  }
  if (displayName) {
    documentation.set('displayName', displayName);
  }
}

function getDeclaredConstantValue(path: NodePath, nameConstId: string): string | undefined {
  const globalVariableDeclarations = path.filter((p) => isVariableDeclaration(p.node)) as Array<
    NodePath<VariableDeclaration>
  >;
  const declarators = globalVariableDeclarations.reduce(
    (a: VariableDeclarator[], declPath) => a.concat(declPath.node.declarations),
    [],
  );
  const nodeDeclarator = declarators.find((d) => isIdentifier(d.id) && d.id.name === nameConstId);
  return nodeDeclarator && nodeDeclarator.init && isLiteral(nodeDeclarator.init)
    ? (nodeDeclarator.init as StringLiteral).value
    : undefined;
}
