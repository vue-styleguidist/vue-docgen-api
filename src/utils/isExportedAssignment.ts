import * as bt from '@babel/types';
import { NodePath } from 'ast-types';

/**
 * true if the left part of the expression of the NodePath is of form `exports.foo = ...;` or
 * `modules.exports = ...;`.
 */
export default function isExportedAssignment(path: NodePath) {
  if (bt.isExpressionStatement(path.node)) {
    path = path.get('expression');
  }

  if (!bt.isAssignmentExpression(path.node)) {
    return false;
  }
  const pathLeft = path.node.left;
  const isSimpleExports = bt.isIdentifier(pathLeft) && pathLeft.name === 'exports';

  // check if we are looking at obj.member = value`
  let isModuleExports = false;
  if (!isSimpleExports && !bt.isMemberExpression(path.node.left)) {
    return false;
  } else {
    isModuleExports =
      bt.isMemberExpression(pathLeft) &&
      bt.isIdentifier(pathLeft.object) &&
      // if exports.xx =
      (pathLeft.object.name === 'exports' ||
        // if module.exports =
        (pathLeft.object.name === 'module' && pathLeft.property.name === 'exports'));
  }

  return isSimpleExports || isModuleExports;
}
