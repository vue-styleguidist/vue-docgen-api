import recast from 'recast'
import getDocblock from '../utils/getDocblock'

const types = recast.types.namedTypes

export default function propHandler(documentation, path) {
  const propsPath = path.get('properties').filter(p => p.node.key.name === 'props')

  // if no prop return
  if (!propsPath.length) {
    return
  }

  const propsObject = propsPath[0].get('value')

  propsObject
    .get('properties')
    // filter non object properties
    .filter(p => types.Property.check(p.node))
    .forEach(prop => {
      const propDescriptor = documentation.getPropDescriptor(prop.get('key').node.name)
      const propValuePath = prop.get('value')
      const isObjectExpression = types.ObjectExpression.check(propValuePath.value)
      const isIdentifier = types.Identifier.check(propValuePath.value)
      if (isIdentifier || isObjectExpression) {
        // description
        propDescriptor.description = getDocblock(prop)

        if (isObjectExpression) {
          const propPropertiesPath = propValuePath.get('properties')
          // type
          describeType(propPropertiesPath, propDescriptor)

          // required
          describeRequired(propPropertiesPath, propDescriptor)

          // default
          describeDefault(propPropertiesPath, propDescriptor)
        } else if (isIdentifier) {
          // contents of the prop is it's type
          propDescriptor.type = propValuePath.node.name
        }
      }
    })
}

function describeType(propPropertiesPath, propDescriptor) {
  const typeArray = propPropertiesPath.filter(p => p.node.key.name === 'type')
  if (typeArray.length) {
    propDescriptor.type = typeArray[0].get('value').node.name
  }
}

function describeRequired(propPropertiesPath, propDescriptor) {
  const requiredArray = propPropertiesPath.filter(p => p.node.key.name === 'required')
  if (requiredArray.length) {
    propDescriptor.required = requiredArray[0].get('value').node.value
  }
}

function describeDefault(propPropertiesPath, propDescriptor) {
  const defaultArray = propPropertiesPath.filter(p => p.node.key.name === 'default')
  if (defaultArray.length) {
    propDescriptor.defaultValue = { value: recast.print(defaultArray[0].get('value')).code }
  }
}
