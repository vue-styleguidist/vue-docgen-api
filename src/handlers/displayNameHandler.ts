import { NodePath } from 'ast-types';
import { Documentation } from 'src/Documentation';
import * as bt from '@babel/types';

export default function propHandler(documentation: Documentation, path: NodePath) {
  const namePath = path
    .get('properties')
    .filter((p: NodePath<bt.Property>) => p.node.key.name === 'name');

  // if no prop return
  if (!namePath.length) {
    return;
  }

  const nameValueNode = namePath[0].get('value').node;
  let displayName;
  if (bt.isLiteral(nameValueNode)) {
    displayName = (nameValueNode as bt.StringLiteral).value;
  } else if (bt.isIdentifier(nameValueNode)) {
    const nameConstId = (nameValueNode as bt.Identifier).name;
    displayName = getDeclaredConstantValue(path.parentPath.parentPath, nameConstId);
  }
  if (displayName) {
    documentation.set('displayName', displayName);
  }
}

function getDeclaredConstantValue(path: NodePath, nameConstId: string): string | undefined {
  const globalVariableDeclarations = path.filter((p) => bt.isVariableDeclaration(p.node)) as Array<
    NodePath<bt.VariableDeclaration>
  >;
  const declarators = globalVariableDeclarations.reduce(
    (a: bt.VariableDeclarator[], declPath) => a.concat(declPath.node.declarations),
    [],
  );
  const nodeDeclaratorArray = declarators.filter(
    (d) => bt.isIdentifier(d.id) && d.id.name === nameConstId,
  );
  const nodeDeclarator = nodeDeclaratorArray.length ? nodeDeclaratorArray[0] : undefined;
  return nodeDeclarator && nodeDeclarator.init && bt.isLiteral(nodeDeclarator.init)
    ? (nodeDeclarator.init as bt.StringLiteral).value
    : undefined;
}
