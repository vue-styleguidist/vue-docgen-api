import recast from 'recast'

const {
  types: { namedTypes: types },
} = recast

/**
 * true if the left part of the expression of the NodePath is of form `exports.foo = ...;` or
 * `modules.exports = ...;`.
 */
export default function isExportedAssignment(path) {
  if (types.ExpressionStatement.check(path.node)) {
    path = path.get('expression')
  }
  if (
    !types.AssignmentExpression.check(path.node) ||
    !types.MemberExpression.check(path.node.left)
  ) {
    return false
  }
  const pathLeft = path.get('left')
  const isSimpleExports = types.Identifier.check(pathLeft) && pathLeft.name === 'exports'
  const isModuleExports =
    types.MemberExpression.check(pathLeft) &&
    pathLeft.object.name === 'module' &&
    pathLeft.property.name === 'exports'
  return isSimpleExports || isModuleExports
}
