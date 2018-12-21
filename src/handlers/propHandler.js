import recast from 'recast'
import { getDocblock } from '../utils/commentDocblock'

const {
  types: { namedTypes: types },
} = recast

export default function propHandler(documentation, path) {
  const propsPath = path
    .get('properties')
    .filter(propertyPath => types.Property.check(propertyPath.node))
    .filter(p => p.node.key.name === 'props')

  // if no prop return
  if (!propsPath.length) {
    return
  }

  const propsObject = propsPath[0].get('value')

  propsObject
    .get('properties')
    .filter(propertyPath => types.Property.check(propertyPath.node))
    .forEach(prop => {
      const propDescriptor = documentation.getPropDescriptor(prop.get('key').name)
      if (types.ObjectExpression.check(prop.get('value').value)) {
        // description
        describeComment(prop, propDescriptor)

        const propPropertiesPath = prop.get('value').get('properties')
        // type
        describeType(propPropertiesPath, propDescriptor)

        // required
        describeRequired(propPropertiesPath, propDescriptor)

        // default
        describeDefault(propPropertiesPath, propDescriptor)
      }
    })
}

function describeComment(prop, propDescriptor) {
  propDescriptor.description = getDocblock(prop)
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
    propDescriptor.defaultValue = recast.print(defaultArray[0].get('value')).code
  }
}
