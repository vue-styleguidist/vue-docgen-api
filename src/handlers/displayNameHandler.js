import { namedTypes as types } from 'ast-types'

export default function propHandler(documentation, path) {
  const namePath = path.get('properties').filter(p => p.node.key.name === 'name')

  // if no prop return
  if (!namePath.length) {
    return
  }

  const nameValueNode = namePath[0].get('value').node
  let displayName
  if (types.Literal.check(nameValueNode)) {
    displayName = nameValueNode.value
  } else if (types.Identifier.check(nameValueNode)) {
    const nameConstId = nameValueNode.name
    displayName = getDeclaredConstantValue(path.parentPath.parentPath, nameConstId)
  }
  if (displayName) {
    documentation.set('displayName', displayName)
  }
}

function getDeclaredConstantValue(path, nameConstId) {
  const globalVariableDeclarations = path.filter(p => types.VariableDeclaration.check(p.node))
  const declarators = globalVariableDeclarations.reduce((a, declPath) => {
    return a.concat(declPath.node.declarations)
  }, [])
  return declarators.find(d => d.id.name === nameConstId).init.value
}
