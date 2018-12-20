import { utils } from 'react-docgen'
import recast from 'recast'

const {
  getPropertyName,
  printValue,
  resolveToValue,
  getMemberValuePath,
  getMemberExpressionValuePath,
} = utils

const {
  types: { namedTypes: types },
} = recast

function getDefaultValue(path) {
  let node = path.node
  if (types.Literal.check(node)) {
    return node.raw
  } else {
    // console.log(path)
  }
}

export default function getPropDefault(path) {
  let defaultValue
  path = path.get('value')
  let node = path.node
  if (types.Literal.check(node)) {
    defaultValue = getDefaultValue(path)
  } else {
    if (types.AssignmentPattern.check(path.node)) {
      path = resolveToValue(path.get('right'))
    } else {
      path = resolveToValue(path)
    }
    if (types.ImportDeclaration.check(path.node)) {
      defaultValue = node.name
    } else {
      node = path.node
      defaultValue = getDefaultValue(path)
    }
  }
  if (typeof defaultValue !== 'undefined') {
    return {
      value: defaultValue,
      computed:
        types.CallExpression.check(node) ||
        types.MemberExpression.check(node) ||
        types.Identifier.check(node),
    }
  }
}
