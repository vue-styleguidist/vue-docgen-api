import { NodePath } from 'ast-types';
import {
  isExpressionStatement,
  isAssignmentExpression,
  isMemberExpression,
  isIdentifier,
} from '@babel/types';

/**
 * true if the left part of the expression of the NodePath is of form `exports.foo = ...;` or
 * `modules.exports = ...;`.
 */
export default function isExportedAssignment(path: NodePath) {
  if (isExpressionStatement(path.node)) {
    path = path.get('expression');
  }
  // if we are not looking at `a.b = blabla`
  if (!isAssignmentExpression(path.node) || isMemberExpression(path.node.left)) {
    return false;
  }
  const pathLeft = path.get('left').node;
  const isSimpleExports = isIdentifier(pathLeft) && pathLeft.name === 'exports';
  const isModuleExports =
    isMemberExpression(pathLeft) &&
    isIdentifier(pathLeft.object) &&
    pathLeft.object.name === 'module' &&
    pathLeft.property.name === 'exports';
  return isSimpleExports || isModuleExports;
}
