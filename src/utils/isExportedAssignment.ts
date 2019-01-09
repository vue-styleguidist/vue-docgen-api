import { NodePath } from 'ast-types';
import * as bt from '@babel/types';

/**
 * true if the left part of the expression of the NodePath is of form `exports.foo = ...;` or
 * `modules.exports = ...;`.
 */
export default function isExportedAssignment(path: NodePath) {
  if (bt.isExpressionStatement(path.node)) {
    path = path.get('expression');
  }

  // check if we are looking at obj.member = value`
  if (!bt.isAssignmentExpression(path.node) || !bt.isMemberExpression(path.node.left)) {
    return false;
  }
  const pathLeft = path.get('left').node;
  const isSimpleExports = bt.isIdentifier(pathLeft) && pathLeft.name === 'exports';
  const isModuleExports =
    bt.isMemberExpression(pathLeft) &&
    bt.isIdentifier(pathLeft.object) &&
    pathLeft.object.name === 'module' &&
    pathLeft.property.name === 'exports';
  return isSimpleExports || isModuleExports;
}
