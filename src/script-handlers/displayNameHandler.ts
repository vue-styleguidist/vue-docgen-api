import * as bt from '@babel/types';
import { NodePath } from 'ast-types';
import { Documentation } from '../Documentation';

export default function propHandler(documentation: Documentation, path: NodePath) {
  let displayName: string | undefined;
  if (bt.isObjectExpression(path.node)) {
    const namePath = path
      .get('properties')
      .filter((p: NodePath<bt.Property>) => p.node.key.name === 'name');

    // if no prop return
    if (!namePath.length) {
      return;
    }

    const nameValueNode = namePath[0].get('value').node;

    if (bt.isLiteral(nameValueNode)) {
      displayName = (nameValueNode as bt.StringLiteral).value;
    } else if (bt.isIdentifier(nameValueNode)) {
      const nameConstId = (nameValueNode as bt.Identifier).name;
      displayName = getDeclaredConstantValue(path.parentPath.parentPath, nameConstId);
    }
  } else if (bt.isClassDeclaration(path.node)) {
    const config = getArgFromDecorator(path.node);

    const arg = config ? config[0] : undefined;

    if (arg && bt.isObjectExpression(arg)) {
      arg.properties
        .filter((p: bt.ObjectProperty) => p.key.name === 'name')
        .forEach((p: bt.ObjectProperty) => {
          if (p.value && bt.isLiteral(p.value)) {
            displayName = (p.value as bt.StringLiteral).value;
          }
        });
    } else {
      displayName = path.node.id ? path.node.id.name : undefined;
    }
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

function getArgFromDecorator(
  node: bt.ClassDeclaration,
): undefined | Array<bt.Expression | bt.SpreadElement | bt.JSXNamespacedName> {
  const exp = node.decorators && node.decorators[0].expression;
  if (exp && bt.isCallExpression(exp)) {
    return exp.arguments;
  }
  return undefined;
}
