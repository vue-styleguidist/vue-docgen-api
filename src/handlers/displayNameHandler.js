import recast from 'recast'

const types = recast.types.namedTypes

export default function propHandler(documentation, path) {
  const namePath = path
    .get('properties')
    .filter(propertyPath => types.Property.check(propertyPath.node))
    .filter(p => p.node.key.name === 'name')

  // if no prop return
  if (!namePath.length) {
    return
  }

  documentation.set('displayName', namePath[0].node.value.value)
}
