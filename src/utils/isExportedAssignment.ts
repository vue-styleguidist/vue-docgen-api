import { NodePath } from '@babel/traverse'

/**
 * true if the left part of the expression of the NodePath is of form `exports.foo = ...;` or
 * `modules.exports = ...;`.
 */
export default function isExportedAssignment(path: NodePath): boolean {
  if (path.isExpressionStatement()) {
    path = path.get('expression')
  }

  if (!path.isAssignmentExpression()) {
    return false
  }
  const pathLeft = path.get('left')
  const isSimpleExports = pathLeft.isIdentifier() && pathLeft.node.name === 'exports'

  // check if we are looking at obj.member = value`
  let isModuleExports = false
  if (!isSimpleExports && !path.get('left').isMemberExpression()) {
    return false
  } else if (pathLeft.isMemberExpression()) {
    const leftObject = pathLeft.get('object')
    const leftProp = pathLeft.get('property')
    isModuleExports =
      !Array.isArray(leftProp) &&
      leftProp.isIdentifier() &&
      leftObject.isIdentifier() &&
      // if exports.xx =
      (leftObject.node.name === 'exports' ||
        // if module.exports =
        (leftObject.node.name === 'module' && leftProp.node.name === 'exports'))
  }

  return isSimpleExports || isModuleExports
}
